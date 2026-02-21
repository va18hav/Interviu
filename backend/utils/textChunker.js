export function chunkForSpeech(text) {
    if (!text) return [];

    // Split by natural pauses (commas, semicolons, periods)
    const segments = text
        .replace(/\n+/g, ' ')
        .split(/([.!?;,]\s+)/)
        .filter(s => s.trim());

    const chunks = [];

    for (const seg of segments) {
        const words = seg.trim().split(/\s+/).filter(w => w);

        // Create 3-4 word chunks for smooth Vapi-like display
        for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join(' ');
            if (chunk) chunks.push(chunk);
        }
    }

    return chunks;
}
