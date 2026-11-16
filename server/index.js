// Local / Node hosting entry point: API + the built React site.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';

const CLIENT_DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'client', 'dist');
const PORT = process.env.PORT || 5000;

app.use(express.static(CLIENT_DIST));
app.get('/{*splat}', (_req, res, next) =>
  res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => err && next()),
);

app.listen(PORT, () => console.log(`PTA Mumbai server running on http://localhost:${PORT}`));
