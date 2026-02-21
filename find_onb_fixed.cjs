const fs = require('fs');
const path = require('path');

const historyDirs = [
    path.join(process.env.APPDATA || '', 'Code', 'User', 'History'),
    path.join(process.env.APPDATA || '', 'Cursor', 'User', 'History'),
    path.join(process.env.APPDATA || '', 'Antigravity', 'User', 'History')
];

let sortedEntries = [];

for (const historyDir of historyDirs) {
    if (!fs.existsSync(historyDir)) continue;
    let folders;
    try {
        const raw = fs.readdirSync(historyDir);
        // De-duplicate in case of messy readdir
        folders = Object.keys(raw.reduce((acc, val) => (acc[val]=1, acc), {}));
    } catch(e) { continue; }

    for (const folder of folders) {
        const folderPath = path.join(historyDir, folder);
        try {
            if (!fs.statSync(folderPath).isDirectory()) continue;
        } catch(e) { continue; }
        
        const entriesPath = path.join(folderPath, 'entries.json');
        if (!fs.existsSync(entriesPath)) continue;
        
        try {
            const fileContent = fs.readFileSync(entriesPath, 'utf8');
            const data = JSON.parse(fileContent);
            const fileUri = data.resource || data.fileUri || data.resourceUri;
            if (!fileUri) continue;
            
            let standardPath = decodeURIComponent(fileUri).replace(/\\/g, '/').toLowerCase();
            if (standardPath.endsWith('src/pages/onboarding.jsx')) {
                if (data.entries && data.entries.length > 0) {
                    for (const entry of data.entries) {
                        try {
                            const contentPath = path.join(folderPath, entry.id);
                            if (fs.existsSync(contentPath)) {
                                sortedEntries.push({
                                    source: historyDir.includes('Cursor') ? 'Cursor' : (historyDir.includes('Code') ? 'VSCode' : 'Antigravity'),
                                    timestamp: entry.timestamp,
                                    date: new Date(entry.timestamp).toISOString(),
                                    path: contentPath
                                });
                            }
                        } catch(e) {}
                    }
                }
            }
        } catch(e) {}
    }
}

sortedEntries.sort((a,b) => b.timestamp - a.timestamp);

let out = Found  history entries for Onboarding.jsx\n;
for(let i=0; i < Math.min(20, sortedEntries.length); i++) {
    out += ${i}. []  - \n;
}
fs.writeFileSync('onboarding_hist.txt', out);
