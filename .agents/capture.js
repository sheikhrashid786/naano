const fs = require('fs');
const path = require('path');

const BRAIN_DIR = 'C:/Users/bhaiu/.gemini/antigravity-ide/brain';
const CONVERSATIONS_DIR = 'C:/Users/bhaiu/.gemini/antigravity-ide/conversations';
const OUTPUT_DIR = 'D:/nano.com/.agent-logs';
const CURRENT_SESSION = '7e671983-958e-4029-89b0-eb8a4f8ecbe3';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function isNanoSession(sessionId, rawTranscript) {
  if (sessionId === CURRENT_SESSION) return true;
  if (rawTranscript.includes('nano.com') || rawTranscript.includes('CAPTURE TEST') || rawTranscript.includes('8x assignment')) {
    return true;
  }
  const dbPath = path.join(CONVERSATIONS_DIR, `${sessionId}.db`);
  if (fs.existsSync(dbPath)) {
    try {
      const dbBuf = fs.readFileSync(dbPath);
      if (dbBuf.toString('binary').includes('nano.com')) {
        return true;
      }
    } catch (e) {
      // ignore
    }
  }
  return false;
}

function parseTranscript(transcriptPath, sessionId) {
  if (!fs.existsSync(transcriptPath)) return null;
  let content;
  try {
    content = fs.readFileSync(transcriptPath, 'utf8');
  } catch (e) {
    return null;
  }
  const lines = content.trim().split('\n').filter(Boolean);
  if (lines.length === 0) return null;

  if (!isNanoSession(sessionId, content)) {
    return null;
  }

  const exchanges = [];
  let currentExchange = null;

  for (const line of lines) {
    let step;
    try {
      step = JSON.parse(line);
    } catch (e) {
      continue;
    }

    if (step.type === 'USER_INPUT' && step.source === 'USER_EXPLICIT') {
      if (currentExchange) {
        exchanges.push(currentExchange);
      }
      let promptText = step.content || '';
      const match = promptText.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
      if (match) {
        promptText = match[1].trim();
      } else {
        promptText = promptText.trim();
      }

      currentExchange = {
        num: exchanges.length + 1,
        prompt: promptText,
        prompt_time: step.created_at || new Date().toISOString(),
        response: null,
        response_time: null
      };
    } else if (step.type === 'PLANNER_RESPONSE' && step.source === 'MODEL') {
      if (currentExchange && step.content && step.content.trim()) {
        currentExchange.response = step.content.trim();
        currentExchange.response_time = step.created_at || new Date().toISOString();
      }
    }
  }

  if (currentExchange) {
    exchanges.push(currentExchange);
  }

  if (exchanges.length === 0) {
    return null;
  }

  return exchanges;
}

function processSession(sessionId) {
  const sessionDir = path.join(BRAIN_DIR, sessionId);
  const transcriptPath = path.join(sessionDir, '.system_generated', 'logs', 'transcript_full.jsonl');
  const altTranscriptPath = path.join(sessionDir, '.system_generated', 'logs', 'transcript.jsonl');

  let exchanges = parseTranscript(transcriptPath, sessionId);
  if (!exchanges) {
    exchanges = parseTranscript(altTranscriptPath, sessionId);
  }
  if (!exchanges || exchanges.length === 0) return;

  const shortId = sessionId.substring(0, 8);
  const firstPromptTime = exchanges[0].prompt_time;
  const lastPromptTime = exchanges[exchanges.length - 1].prompt_time;
  const dateStr = firstPromptTime.substring(0, 10);

  const d = new Date(firstPromptTime);
  const pad = n => String(n).padStart(2, '0');
  const filePrefix = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}_${pad(d.getUTCHours())}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}`;
  const logFileName = `${filePrefix}_${sessionId}.md`;
  const logFilePath = path.join(OUTPUT_DIR, logFileName);

  let doc = '';
  doc += `---\n`;
  doc += `session_id: ${sessionId}\n`;
  doc += `date: ${dateStr}\n`;
  doc += `author: bhaiumar759\n`;
  doc += `model: gemini-3-8-flash\n`;
  doc += `tool: antigravity-ide\n`;
  doc += `project: naano-rebuild\n`;
  doc += `total_exchanges: ${exchanges.length}\n`;
  doc += `first_prompt_time: ${firstPromptTime}\n`;
  doc += `last_prompt_time: ${lastPromptTime}\n`;
  doc += `---\n\n`;

  doc += `# Session Log - ${dateStr}\n\n`;
  doc += `Session: \`${shortId}\` | Project: \`naano-rebuild\` | Author: \`bhaiumar759\`\n\n`;
  doc += `---\n\n`;

  for (const ex of exchanges) {
    doc += `[LOG_ENTRY type=PROMPT num=${ex.num} session=${shortId}]\n`;
    doc += `timestamp: ${ex.prompt_time}\n`;
    doc += `model: gemini-3-8-flash\n\n`;
    doc += `${ex.prompt}\n\n`;

    if (ex.response) {
      doc += `\n[LOG_ENTRY type=RESPONSE num=${ex.num} session=${shortId}]\n`;
      doc += `timestamp: ${ex.response_time}\n`;
      doc += `model: gemini-3-8-flash\n\n`;
      doc += `${ex.response}\n\n`;
    }
  }

  let writeNeeded = true;
  if (fs.existsSync(logFilePath)) {
    const existing = fs.readFileSync(logFilePath, 'utf8');
    if (existing === doc) {
      writeNeeded = false;
    }
  }

  if (writeNeeded) {
    fs.writeFileSync(logFilePath, doc, 'utf8');
  }
}

function runCapture() {
  if (!fs.existsSync(BRAIN_DIR)) return;
  const entries = fs.readdirSync(BRAIN_DIR);
  const now = Date.now();
  for (const entry of entries) {
    const fullPath = path.join(BRAIN_DIR, entry);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && (now - stat.mtimeMs < 48 * 60 * 60 * 1000)) {
        processSession(entry);
      }
    } catch (err) {
      // ignore
    }
  }
}

if (require.main === module) {
  runCapture();
  // If invoked as a hook, always return valid JSON object to stdout
  console.log(JSON.stringify({}));
}

module.exports = { runCapture, processSession, BRAIN_DIR };
