const fs = require('fs');
const path = require('path');
const { processSession, BRAIN_DIR } = require('./capture');

const LOG_FILE = 'D:/nano.com/.agent-logs/daemon.log';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch (e) {}
}

log(`Capture daemon started, watching ${BRAIN_DIR}...`);

process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.stack || err}`);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled Rejection: ${reason}`);
});

let lastMtimes = new Map();

function checkUpdates() {
  if (!fs.existsSync(BRAIN_DIR)) return;
  try {
    const entries = fs.readdirSync(BRAIN_DIR);
    const now = Date.now();

    for (const entry of entries) {
      const sessionDir = path.join(BRAIN_DIR, entry);
      try {
        const stat = fs.statSync(sessionDir);
        if (stat.isDirectory() && (now - stat.mtimeMs < 48 * 60 * 60 * 1000)) {
          const t1 = path.join(sessionDir, '.system_generated', 'logs', 'transcript_full.jsonl');
          const t2 = path.join(sessionDir, '.system_generated', 'logs', 'transcript.jsonl');

          let latestMtime = 0;
          if (fs.existsSync(t1)) {
            latestMtime = Math.max(latestMtime, fs.statSync(t1).mtimeMs);
          }
          if (fs.existsSync(t2)) {
            latestMtime = Math.max(latestMtime, fs.statSync(t2).mtimeMs);
          }

          if (latestMtime > 0) {
            const prev = lastMtimes.get(entry) || 0;
            if (latestMtime > prev) {
              lastMtimes.set(entry, latestMtime);
              log(`Processing update for session ${entry}`);
              processSession(entry);
            }
          }
        }
      } catch (err) {
        // ignore locked files
      }
    }
  } catch (err) {
    log(`Error scanning brain dir: ${err.message}`);
  }
}

// Initial pass
checkUpdates();

// Check periodically every 1 second
setInterval(checkUpdates, 1000);

try {
  fs.watch(BRAIN_DIR, { recursive: true }, (eventType, filename) => {
    checkUpdates();
  });
} catch (e) {
  // fallback is setInterval
}
