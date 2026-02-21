/**
 * Creates a WAV header for the given raw PCM data.
 * @param {number} dataLength - Length of the raw PCM data in bytes.
 * @param {number} sampleRate - Sample rate (e.g., 16000).
 * @param {number} numChannels - Number of channels (e.g., 1).
 * @param {number} bitsPerSample - Bits per sample (e.g., 16).
 * @returns {Buffer} WAV header buffer (44 bytes).
 */
export function createWavHeader(dataLength, sampleRate = 16000, numChannels = 1, bitsPerSample = 16) {
    const header = Buffer.alloc(44);

    // RIFF chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4); // ChunkSize
    header.write('WAVE', 8);

    // fmt sub-chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    header.writeUInt16LE(numChannels, 22); // NumChannels
    header.writeUInt32LE(sampleRate, 24); // SampleRate

    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    header.writeUInt32LE(byteRate, 28); // ByteRate

    const blockAlign = numChannels * (bitsPerSample / 8);
    header.writeUInt16LE(blockAlign, 32); // BlockAlign
    header.writeUInt16LE(bitsPerSample, 34); // BitsPerSample

    // data sub-chunk
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40); // Subchunk2Size

    return header;
}

/**
 * Wraps raw PCM data with a WAV header.
 * @param {Buffer} rawData - Raw PCM buffer.
 * @param {number} sampleRate 
 * @returns {Buffer} WAV file buffer.
 */
export function wrapInWav(rawData, sampleRate = 16000) {
    const header = createWavHeader(rawData.length, sampleRate);
    return Buffer.concat([header, rawData]);
}
