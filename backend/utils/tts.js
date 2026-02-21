import { CartesiaClient } from "@cartesia/cartesia-js";

// Configuration
const CARTESIA_VOICE_ID = "a167e0f3-df7e-4d52-a9c3-f949145efdab"; // Sonic-3 Voice
const MODEL_ID = "sonic-3"; // Updated model ID for sonic-3-like quality (or specific model ID if known) 
// User specified "sonic-3". 
// Checking docs (mental check): Cartesia models are usually "sonic-english", "sonic-multilingual". 
// Let's use "sonic-english" as the safe default for high quality English.

/**
 * Normalizes text for optimal TTS performance.
 * - Expands acronyms (API -> A P I)
 * - Removes markdown/formatting
 * - Ensures punctuation
 * 
 * @param {string} text 
 * @returns {string} Normalized text
 */
export function normalizeTextForTTS(text) {
    if (!text) return "";

    let normalized = text;

    // 1. Remove Markdown / Artifacts
    normalized = normalized.replace(/\*\*/g, "").replace(/\*/g, ""); // Remove bold/italic
    normalized = normalized.replace(/`{1,3}[^`]*`{1,3}/g, "code block"); // Simplify code blocks

    // 2. Expand Acronyms (Common tech ones)
    const acronyms = {
        "API": "A P I",
        "AWS": "A W S",
        "SLA": "S L A",
        "QPS": "Q P S",
        "CAP": "C A P",
        "CPU": "C P U",
        "HTTP": "H T T P",
        "JSON": "Jason",
        "SQL": "Sequel",
        "NoSQL": "No Sequel",
        "DB": "D B",
        "p99": "P ninety nine",
        "p95": "P ninety five",
        "p50": "P fifty"
    };

    // Replace acronyms ensuring word boundaries
    Object.keys(acronyms).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        normalized = normalized.replace(regex, acronyms[key]);
    });

    // 3. Clean whitespace
    normalized = normalized.replace(/\s+/g, " ").trim();

    // 4. Ensure punctuation
    if (!/[.?!]$/.test(normalized)) {
        normalized += ".";
    }

    return normalized;
}

/**
 * Generates speech using Cartesia API.
 * 
 * @param {string} text - Text to speak
 * @returns {Promise<Buffer>} - Audio buffer (MP3 or Raw)
 */
export async function generateSpeech(text) {
    if (!process.env.CARTESIA_API_KEY) {
        throw new Error("Missing CARTESIA_API_KEY");
    }

    const client = new CartesiaClient({
        apiKey: process.env.CARTESIA_API_KEY,
    });

    const normalizedText = normalizeTextForTTS(text);
    console.log(`[TTS] Generating speech for: "${normalizedText}"`);
    console.log(`[TTS] Chars: ${normalizedText.length}`);

    const start = Date.now();

    try {
        // Using tts.bytes() for direct buffer return (simpler than streaming for this stage)
        const response = await client.tts.bytes({
            modelId: MODEL_ID,
            voice: {
                mode: "id",
                id: CARTESIA_VOICE_ID,
            },
            transcript: normalizedText,
            outputFormat: {
                container: "mp3",
                sampleRate: 44100,
                encoding: "mp3",
                bitRate: 128000,
            },
        });

        // Handle potential stream wrapper return type
        let buffer;

        if (Buffer.isBuffer(response)) {
            buffer = response;
        } else if (typeof response.arrayBuffer === 'function') {
            buffer = Buffer.from(await response.arrayBuffer());
        } else if (typeof response.buffer === 'function') {
            buffer = Buffer.from(await response.buffer());
        } else {
            // Fallback: Assume async iterable (Stream)
            console.log("[TTS] Response is stream-like, collecting chunks...");
            const chunks = [];
            for await (const chunk of response) {
                chunks.push(Buffer.from(chunk));
            }
            buffer = Buffer.concat(chunks);
        }
        const duration = Date.now() - start;

        console.log(`[TTS] Generated ${buffer.length} bytes in ${duration}ms`);

        return buffer;

    } catch (error) {
        console.error("[TTS] Generation Failed:", error);
        throw error; // Let caller handle fallback
    }
}

/**
 * Streams speech using Cartesia WebSocket API with word alignment.
 * 
 * @param {string} text - Text to speak
 * @param {function} onChunk - Callback(data) where data = { audio: Buffer, words: Array }
 */
import { chunkForSpeech } from './textChunker.js';

/**
 * Streams speech using Cartesia WebSocket API.
 * Implements Vapi-style "Fake Karaoke" by emitting text chunks immediately,
 * separate from audio chunks.
 * 
 * @param {string} text - Text to speak
 * @param {function} onChunk - Callback(data)
 */
export async function streamSpeech(text, onChunk) {
    if (!process.env.CARTESIA_API_KEY) {
        throw new Error("Missing CARTESIA_API_KEY");
    }

    const client = new CartesiaClient({
        apiKey: process.env.CARTESIA_API_KEY,
    });

    const normalizedText = normalizeTextForTTS(text);
    console.log(`[TTS-Stream] processing: "${normalizedText.substring(0, 50)}..."`);

    // 2. Start Audio Stream (Connect concurrently)
    // 1. Prepare Audio Stream
    const websocket = client.tts.websocket({
        container: "raw",
        encoding: "pcm_s16le",
        sampleRate: 16000
    });

    try {
        // 2. Connect FIRST (Critical for stability)
        await websocket.connect();

        // 3. Emit Text Chunks (Vapi-style) - Fire and forget promise to not block audio
        const textChunks = chunkForSpeech(normalizedText);
        console.log(`[TTS-Stream] Text Chunks (${textChunks.length}):`, textChunks);

        const streamTextPromise = (async () => {
            for (const chunk of textChunks) {
                onChunk({ textChunk: chunk });
                await new Promise(r => setTimeout(r, 500));
            }
        })();

        // 4. Send Audio Request IMMEDIATELY
        const response = await websocket.send({
            modelId: MODEL_ID,
            voice: { mode: "id", id: CARTESIA_VOICE_ID },
            transcript: normalizedText,
            add_timestamps: true, // ✅ Enable word timestamps (separate "timestamps" messages)
        });

        // Cartesia sends:
        // - type: "chunk"      -> audio data (base64)
        // - type: "timestamps" -> word_timestamps { words:[], start:[], end:[] }
        //
        // We'll collect the latest word_timestamps and attach them to the
        // first audio chunk we emit to the frontend. The frontend treats
        // `start` as seconds from the beginning of the generated audio.
        let pendingWordTimings = null;
        let sentWordTimings = false;

        for await (const message of response.events('message')) {
            const result = JSON.parse(message);

            if (result.type === "timestamps" && result.word_timestamps) {
                const wt = result.word_timestamps;
                const wordsArray = Array.isArray(wt.words) ? wt.words : [];
                const startsArray = Array.isArray(wt.start) ? wt.start : [];

                if (wordsArray.length && startsArray.length) {
                    pendingWordTimings = wordsArray.map((word, idx) => ({
                        word,
                        start: typeof startsArray[idx] === "number" ? startsArray[idx] : 0
                    }));

                    console.log(`[TTS-Stream] Received ${pendingWordTimings.length} word timestamps.`);
                }
            } else if (result.type === "chunk" && result.data) {
                const audioBuffer = Buffer.from(result.data, 'base64');

                const wordsToSend = !sentWordTimings && pendingWordTimings
                    ? pendingWordTimings
                    : null;

                if (wordsToSend) {
                    sentWordTimings = true;
                }

                onChunk({
                    audio: audioBuffer,
                    words: wordsToSend || []
                });
            } else if (result.type === "error") {
                console.error("[TTS-Stream] Error:", result.error);
            }
        }

        // await streamTextPromise; // (Removed)
    } catch (err) {
        console.error("[TTS-Stream] Loop Error:", err);
    } finally {
        websocket.disconnect();
    }
}
