/**
 * Simple RMS-based Voice Activity Detection (VAD)
 * 
 * Logic:
 * Calculate Root Mean Square (RMS) of audio chunk.
 * If RMS > threshold, it's speech.
 * 
 * @param {Buffer} audioChunk - Raw Int16 PCM audio chunk
 * @param {number} threshold - Energy threshold (0-1 range roughly, or raw PCM values). 
 *                             For PCM 16-bit, values are -32768 to 32767.
 *                             A conservative threshold like 500-1000 usually works for "silence".
 * @returns {number} RMS value
 */
export function calculateRMS(audioChunk) {
    let sum = 0;
    // We assume 16-bit PCM (2 bytes per sample)
    const numSamples = audioChunk.length / 2;

    for (let i = 0; i < audioChunk.length; i += 2) {
        // Read Int16 Little Endian
        const sample = audioChunk.readInt16LE(i);
        sum += sample * sample;
    }

    return Math.sqrt(sum / numSamples);
}

// Configuration Constants
export const VAD_CONFIG = {
    // 500 is a reasonable noise floor for 16-bit PCM. 
    // Silence is usually < 100. Quiet room ~200-300. Speech > 1000.
    ENERGY_THRESHOLD: 800,

    // 1200ms of silence required to trigger turn end
    SILENCE_THRESHOLD_MS: 1200,

    // Minimum speech duration to be considered valid turn start (avoid clicks)
    MIN_SPEECH_MS: 300,

    // Debounce to avoid cutting words
    DEBOUNCE_MS: 300
};
