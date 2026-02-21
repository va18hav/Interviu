/**
 * Extracts the first conversational intent from the LLM response.
 * Rules:
 * 1. Optional acknowledgement (short, specific phrases).
 * 2. First question OR first imperative statement.
 * 3. Discard everything after.
 * 
 * @param {string} text - The raw LLM response.
 * @returns {string} - The segmented response.
 */
export function extractFirstConversationalIntent(text) {
    if (!text) return "";

    // STEP 1: Normalize text
    let normalized = text.trim().replace(/\n+/g, '\n');

    // STEP 2: Split into sentences conservatively
    const parts = [];
    const tokenRegex = /([\s\S]*?)([\?]|(?:[\.\!](?:\n|$)))/gy;

    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(normalized)) !== null) {
        parts.push(match[0]); // match[0] is the whole chunk including delimiter
        lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < normalized.length) {
        parts.push(normalized.substring(lastIndex));
    }

    let sentences = parts.map(s => s.trim()).filter(s => s.length > 0);

    if (sentences.length === 0) return "";

    // STEP 3: Detect acknowledgement sentences
    const strictAckPhrases = ["that makes sense", "okay", "good", "i see", "fair point", "reasonable", "got it", "understood", "great", "excellent", "right"];

    const isAcknowledgement = (sent) => {
        const lower = sent.toLowerCase();
        if (sent.includes('?')) return false;
        const wordCount = sent.split(/\s+/).length;
        if (wordCount > 15) return false;
        return strictAckPhrases.some(phrase => lower.includes(phrase));
    };

    let keepSentences = [];
    let processing = true;
    let i = 0;

    // Check first sentence for ack
    if (sentences.length > 0 && isAcknowledgement(sentences[0])) {
        keepSentences.push(sentences[0]);
        i = 1;
    }

    // Process remaining sentences (Setup + Question)
    const imperativeStarters = ["walk me through", "explain", "describe", "tell me", "how would you"];

    for (; i < sentences.length; i++) {
        const sent = sentences[i];
        const lower = sent.toLowerCase();

        keepSentences.push(sent);

        // Check for Question
        if (sent.includes('?')) {
            processing = false;
            break;
        }

        // Check for Imperative
        const isImperative = imperativeStarters.some(start => lower.startsWith(start));
        if (isImperative) {
            processing = false;
            break;
        }
    }

    return keepSentences.join(" ");
}
