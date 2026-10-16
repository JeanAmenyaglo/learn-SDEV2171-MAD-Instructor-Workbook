const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const EMPTY_DB = {
  users: [],
  entries: [],
  'sample-entries': [],
};

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), 'utf8');
  }
}

async function readDb() {
  await ensureDbFile();
  const file = await fs.readFile(DB_PATH, 'utf8');

  if (!file.trim()) {
    return { ...EMPTY_DB };
  }

  const parsed = JSON.parse(file);

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    'sample-entries': Array.isArray(parsed['sample-entries'])
      ? parsed['sample-entries']
      : [],
  };
}

async function writeDb(data) {
  const safeData = {
    users: Array.isArray(data.users) ? data.users : [],
    entries: Array.isArray(data.entries) ? data.entries : [],
    'sample-entries': Array.isArray(data['sample-entries'])
      ? data['sample-entries']
      : [],
  };

  await fs.writeFile(DB_PATH, JSON.stringify(safeData, null, 2), 'utf8');
}

module.exports = {
  readDb,
  writeDb,
  DB_PATH,
};
