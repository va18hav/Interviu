const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
const targetStr = 'desktop/intervyu/intervyu'; // Lowercase substring

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
        
        let standardPath = decodeURIComponent(fileUri).replace(/\\/g, '/').toLowerCase();
        
        if (standardPath.includes(targetStr)) {
            if (data.entries && data.entries.length > 0) {
                // Find correct entries that are recently saved
                const sortedEntries = data.entries.sort((a,b) => a.timestamp - b.timestamp);
                
                // Keep the entire entry history
                recoveredFiles.set(fileUri, {
                    folder: folderPath,
                    entries: sortedEntries
                });
            }
        }
    } catch (e) {}
}

const outDir = path.join(process.cwd(), 'recovery_dump');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

let count = 0;
for (const [fileUri, info] of recoveredFiles.entries()) {
    let rawPath = decodeURIComponent(fileUri).replace('file:///', '').replace('file://', '');
    rawPath = rawPath.replace(/\\/g, '/');
    const relativePath = rawPath.substring(rawPath.toLowerCase().indexOf('desktop/intervyu/intervyu') + 26);
    
    const targetPath = path.join(outDir, relativePath.replace(/\\/g, '/'));
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    
    // We want the newest entry BEFORE my git checkout. 
    // I did git checkout around 21:55:00 LOCAL time (which is roughly 16:25:00 UTC).
    // Let's just output EVERY version to a log, but dump the absolute newest version to the file.
    if (info.entries.length > 0) {
        // Let's find the absolute newest entry
        const latestEntry = info.entries[info.entries.length - 1];
        const sourceFile = path.join(info.folder, latestEntry.id);
        if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, targetPath);
            count++;
        }
        
        // Let's write a log next to it with all timestamps
        const logData = info.entries.map(e => new Date(e.timestamp).toISOString() + ' -> ' + e.id).join('\n');
        fs.writeFileSync(targetPath + '.history_log.txt', logData);
    }
}

console.log('Recovered ' + count + ' files into ./recovery_dump');
