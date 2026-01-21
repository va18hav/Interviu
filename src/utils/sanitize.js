import DOMPurify from 'dompurify';

/**
 * Sanitizes a string input to prevent XSS.
 * @param {string} input - The input string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return DOMPurify.sanitize(input.trim());
};

/**
 * Sanitizes an object of string inputs.
 * @param {object} obj - The object containing string values to sanitize.
 * @returns {object} - A new object with sanitized string values.
 */
export const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            sanitized[key] = sanitizeInput(obj[key]);
        }
    }
    return sanitized;
};
