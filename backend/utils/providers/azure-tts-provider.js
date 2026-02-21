import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { normalizeTextForTTS } from '../tts.js';

/**
 * Azure TTS Provider
 * Implements streaming TTS with word-level timestamps using Azure Speech SDK
 */
export class AzureTTSProvider {
    constructor() {
        this.speechKey = process.env.SPEECH_KEY;
        this.speechRegion = process.env.SPEECH_REGION;

        if (!this.speechKey || !this.speechRegion) {
            console.warn('[Azure TTS] Missing SPEECH_KEY or SPEECH_REGION in environment variables');
        }

        // Configuration
        this.voiceName = 'en-US-AndrewMultilingualNeural'; // Natural, conversational
    }

    /**
     * Stream speech with word timestamps
     * @param {string} text - Text to speak
     * @param {function} onChunk - Callback(data) where data = { audio: Buffer, words: Array, textChunk: string }
     */
    async streamTTS(text, onChunk) {
        if (!this.speechKey || !this.speechRegion) {
            console.error('[Azure TTS] Cannot transform text: Missing credentials');
            return;
        }

        const normalizedText = normalizeTextForTTS(text);
        console.log(`[Azure TTS] Synthesizing: "${normalizedText}"`);

        const speechConfig = sdk.SpeechConfig.fromSubscription(this.speechKey, this.speechRegion);
        speechConfig.speechSynthesisVoiceName = this.voiceName;
        // Output format: Raw 16kHz 16-bit Mono PCM (matches frontend expectation)
        speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm;

        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

        // Store word boundaries temporarily to attach to the next audio chunk
        let pendingWordBoundaries = [];

        // 1. Capture Word Boundaries
        synthesizer.wordBoundary = (s, e) => {
            // Azure: 1 tick = 100ns. 10,000,000 ticks = 1s.
            const timeSeconds = e.audioOffset / 10000000;
            if (e.text) {
                pendingWordBoundaries.push({
                    word: e.text,
                    start: timeSeconds
                });
            }
        };

        // 2. Capture Audio Chunks (Streaming)
        synthesizer.synthesizing = (s, e) => {
            try {
                if (e.result.reason === sdk.ResultReason.SynthesizingAudio) {
                    const audioBuffer = Buffer.from(e.result.audioData);

                    if (audioBuffer.length > 0) {
                        console.log(`[Azure TTS] Stream chunk: ${audioBuffer.length} bytes`);

                        // Send chunk with any accumulated word boundaries
                        onChunk({
                            audio: audioBuffer,
                            words: [...pendingWordBoundaries], // Copy and send
                            textChunk: null // Azure doesn't give text chunks easily, rely on words
                        });

                        // Clear sent boundaries
                        pendingWordBoundaries = [];
                    } else {
                        console.log(`[Azure TTS] Stream chunk empty (0 bytes)`);
                    }
                }
            } catch (err) {
                console.error("[Azure TTS] Error in synthesizing event:", err);
            }
        };

        return new Promise((resolve, reject) => {
            // 3. Start Synthesis
            try {
                synthesizer.speakTextAsync(
                    normalizedText,
                    (result) => {
                        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                            console.log(`[Azure TTS] Synthesis completed.`);
                            synthesizer.close();
                            resolve();
                        } else if (result.reason === sdk.ResultReason.Canceled) {
                            const cancellation = sdk.CancellationDetails.fromResult(result);
                            console.error("[Azure TTS] Synthesis canceled. Reason: " + cancellation.reason);
                            console.error("[Azure TTS] Error Details: " + cancellation.errorDetails);
                            synthesizer.close();
                            reject(new Error(cancellation.errorDetails));
                        } else {
                            console.warn("[Azure TTS] Unexpected result reason: " + result.reason);
                            synthesizer.close();
                            resolve(); // Resolve to avoid hanging
                        }
                    },
                    (err) => {
                        console.error("[Azure TTS] Async Error: " + err);
                        synthesizer.close();
                        reject(err);
                    }
                );
            } catch (err) {
                console.error("[Azure TTS] Synchronous Error: " + err);
                synthesizer.close();
                reject(err);
            }
        });
    }

    getName() {
        return "Azure TTS";
    }
}
