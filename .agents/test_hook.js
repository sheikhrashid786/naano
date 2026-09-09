const fs = require('fs');
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    try {
        fs.appendFileSync('d:/nano.com/hook_debug.log', `[${new Date().toISOString()}] STDIN: ${input}\n---\n`);
    } catch (e) {
        fs.appendFileSync('d:/nano.com/hook_debug.log', `[${new Date().toISOString()}] ERROR: ${e.message}\n`);
    }
    console.log(JSON.stringify({}));
});
