import http from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'study-steps.json');

const readDatabase = (callback) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return callback(err);
    try {
      const db = JSON.parse(data);
      callback(null, db);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
};

const sendJson = (res, statusCode, body, delayMs = 0) => {
  const send = () => {
    res.statusCode = statusCode;
    res.end(JSON.stringify(body));
  };

  if (delayMs > 0) {
    setTimeout(send, delayMs);
    return;
  }

  send();
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const delayMs = Number(parsedUrl.query.delay ?? 0);
  const shouldError =
    parsedUrl.query.error === '1' || parsedUrl.query.error === 'true';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  if (
    (pathname === '/study-steps' || pathname === '/api/study-steps') &&
    method === 'GET'
  ) {
    if (shouldError) {
      return sendJson(
        res,
        500,
        { error: 'Simulated request failure for lesson 14' },
        delayMs
      );
    }

    readDatabase((err, db) => {
      if (err) {
        return sendJson(res, 500, { error: 'Failed to read database' }, delayMs);
      }

      if (!db || !Array.isArray(db.steps)) {
        return sendJson(
          res,
          500,
          { error: 'Invalid study step data shape' },
          delayMs
        );
      }

      sendJson(res, 200, db.steps, delayMs);
    });
  } else if (
    (pathname.startsWith('/study-steps/') ||
      pathname.startsWith('/api/study-steps/')) &&
    method === 'GET'
  ) {
    if (shouldError) {
      return sendJson(
        res,
        500,
        { error: 'Simulated request failure for lesson 14' },
        delayMs
      );
    }

    const id = pathname.split('/').at(-1);

    if (!id) {
      return sendJson(
        res,
        400,
        { error: 'A study step id is required' },
        delayMs
      );
    }

    readDatabase((err, db) => {
      if (err) {
        return sendJson(res, 500, { error: 'Failed to read database' }, delayMs);
      }

      if (!db || !Array.isArray(db.steps)) {
        return sendJson(
          res,
          500,
          { error: 'Invalid study step data shape' },
          delayMs
        );
      }

      const step = db.steps.find((entry) => String(entry.id) === String(id));
      if (!step) {
        return sendJson(
          res,
          404,
          { error: `No study step found for id ${id}` },
          delayMs
        );
      }

      sendJson(res, 200, step, delayMs);
    });
  } else {
    sendJson(res, 404, { error: 'Endpoint not found' }, delayMs);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
