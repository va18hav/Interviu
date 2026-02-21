const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFiles = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. WebSocket URL in WebSocket Constructor
    // ws.current = new WebSocket('ws://localhost:8081'); -> ws.current = new WebSocket(import.meta.env.VITE_WS_URL);
    content = content.replace(/new WebSocket\(['"`]ws:\/\/localhost:8081['"`]\)/g, "new WebSocket(import.meta.env.VITE_WS_URL)");

    // WebSocket URL standalone
    content = content.replace(/['"`]ws:\/\/localhost:8081['"`]/g, "import.meta.env.VITE_WS_URL");

    // 2. HTTP URL embedded in backticks (e.g., fetch(`http://localhost:5000/api/...`))
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`\${import.meta.env.VITE_API_URL}$1`");

    // 3. HTTP URL embedded in Quotes (e.g., fetch('http://localhost:5000/api/...'))
    content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, "`${import.meta.env.VITE_API_URL}$1`");

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
        console.log("Fixed endpoints in: " + file);
    }
}

console.log(`Total files updated: ${changedFiles}`);
