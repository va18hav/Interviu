const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
const targetDir = 'c:\\\\users\\\\vaibh\\\\desktop\\\\intervyu\\\\intervyu'; // Lowercase for case-insensitive match

if (!fs.existsSync(historyDir)) {
    console.log('No VSCode history found.');
    process.exit(0);
}

// Target timestamp (around the time the task started, approximate 2026-02-20T12:00:00Z or so)
// I will just look for the absolute newest version BEFORE my destructive actions, or just the newest version overall since my destructive actions didn't save locally from VSCode (git checkout modifies files externally).
// Actually, VSCode recognizes external file changes and saves them as a new history entry! 
// So the version *before* the external modification by Git will have source: "workspace.applyEdit" or something, but usually it's just the previous timestamp.

const cutoffTime = Date.now(); // We can just look at recent history
const recoveredFiles = new Map();

const folders = fs.readdirSync(historyDir);

for (const folder of folders) {
    const folderPath = path.join(historyDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    
    const entriesPath = path.join(folderPath, 'entries.json');
    if (!fs.existsSync(entriesPath)) continue;
    
    try {
        const data = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
        const fileUri = data.resource || data.fileUri || data.resourceUri;
        if (!fileUri) continue;
        
        let filePath = fileUri.toString();
        if (filePath.startsWith('file:///')) {
            filePath = filePath.substring(8);
        } else if (filePath.startsWith('file://')) {
            filePath = filePath.substring(7); // Windows has file:///c%3A/...
        }
        
        filePath = decodeURIComponent(filePath).replace(/\//g, '\\');
        if (filePath.toLowerCase().startsWith(targetDir)) {
            // Find the newest entry for this file
            if (data.entries && data.entries.length > 0) {
                // We want the newest entry that matches our constraint (if any).
                // Let's just output the file path and the times of the last few entries to investigate.
                let latestEntry = data.entries[data.entries.length - 1];
                let previousEntry = data.entries.length > 1 ? data.entries[data.entries.length - 2] : null;
                
                recoveredFiles.set(filePath, {
                    folder: folderPath,
                    latest: latestEntry,
                    previous: previousEntry,
                    allEntries: data.entries
                });
            }
        }
    } catch (e) {}
}

// Dump the recovered files info into a json file for inspection
const recoveryLog = [];
for (const [filePath, info] of recoveredFiles.entries()) {
    recoveryLog.push({
        file: filePath,
        folder: info.folder,
        times: info.allEntries.map(e => new Date(e.timestamp).toISOString() + (e.source ? ' ('+e.source+')' : '')).slice(-5)
    });
}
fs.writeFileSync('recovery_log.json', JSON.stringify(recoveryLog, null, 2));
console.log('Saved recovery_log.json with ' + recoveryLog.length + ' files tracked.');
