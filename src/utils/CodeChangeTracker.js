/**
 * CodeChangeTracker
 * Tracks code file changes and generates semantic summaries
 * for the AI interviewer
 */

class CodeChangeTracker {
    constructor() {
        this.changeHistory = [];
        this.lastSyncedIndex = 0;
        this.fileSnapshots = {}; // Store last known state of files
    }

    /**
     * Record a file change
     * @param {string} filename - Name of the file
     * @param {string} content - Current content
     * @returns {string|null} - Human-readable summary or null if no change
     */
    recordFileChange(filename, content) {
        const lastSnapshot = this.fileSnapshots[filename];

        // First time seeing this file
        if (lastSnapshot === undefined) {
            this.fileSnapshots[filename] = content;
            const lineCount = content.split('\n').length;
            const summary = `Created ${filename} (${lineCount} lines)`;

            this.changeHistory.push({
                timestamp: Date.now(),
                type: 'file_created',
                filename,
                summary
            });

            return summary;
        }

        // File hasn't changed
        if (lastSnapshot === content) {
            return null;
        }

        // File was modified
        const oldLines = lastSnapshot.split('\n').length;
        const newLines = content.split('\n').length;
        const lineDiff = newLines - oldLines;

        let summary = `Modified ${filename}`;
        if (lineDiff > 0) {
            summary += ` (+${lineDiff} lines)`;
        } else if (lineDiff < 0) {
            summary += ` (${lineDiff} lines)`;
        }

        this.fileSnapshots[filename] = content;

        this.changeHistory.push({
            timestamp: Date.now(),
            type: 'file_modified',
            filename,
            oldLines,
            newLines,
            summary
        });

        return summary;
    }

    /**
     * Record a file deletion
     * @param {string} filename - Name of the deleted file
     * @returns {string} - Human-readable summary
     */
    recordFileDeletion(filename) {
        const summary = `Deleted ${filename}`;

        delete this.fileSnapshots[filename];

        this.changeHistory.push({
            timestamp: Date.now(),
            type: 'file_deleted',
            filename,
            summary
        });

        return summary;
    }

    /**
     * Get all changes since last sync
     * @returns {Array} - List of change summaries
     */
    getChangesSinceLastSync() {
        if (this.lastSyncedIndex >= this.changeHistory.length) {
            return [];
        }

        const changes = this.changeHistory.slice(this.lastSyncedIndex);
        return changes.map(c => c.summary);
    }

    /**
     * Mark current changes as synced
     */
    markAsSynced() {
        this.lastSyncedIndex = this.changeHistory.length;
    }

    /**
     * Get count of unsynced changes
     * @returns {number}
     */
    getUnsyncedCount() {
        return this.changeHistory.length - this.lastSyncedIndex;
    }

    /**
     * Reset tracker
     */
    reset() {
        this.changeHistory = [];
        this.lastSyncedIndex = 0;
        this.fileSnapshots = {};
    }
}

// Export as singleton
export const codeChangeTracker = new CodeChangeTracker();

// Export class for testing
export default CodeChangeTracker;
