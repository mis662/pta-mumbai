import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, 'data');
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
const PORT = process.env.PORT || 5000;

const readJson = async (file) => JSON.parse(await fs.readFile(path.join(DATA, file), 'utf-8'));

const app = express();
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// ---------- Content API ----------
app.get('/api/site', async (_req, res) => res.json(await readJson('site.json')));
app.get('/api/members', async (_req, res) => res.json(await readJson('members.json')));
app.get('/api/history', async (_req, res) => res.json(await readJson('history.json')));

app.get('/api/blogs', async (_req, res) => {
  const blogs = await readJson('blogs.json');
  res.json(blogs.map(({ body, ...summary }) => summary));
});

app.get('/api/blogs/:slug', async (req, res) => {
  const blogs = await readJson('blogs.json');
  const post = blogs.find((b) => b.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// ---------- Contact / enquiry form ----------
const mailer =
  process.env.SMTP_HOST &&
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', async (req, res) => {
  const clean = (v, max) => String(v ?? '').trim().slice(0, max);
  const enquiry = {
    name: clean(req.body.name, 100),
    email: clean(req.body.email, 150),
    phone: clean(req.body.phone, 20),
    service: clean(req.body.service, 50),
    message: clean(req.body.message, 3000),
  };

  const errors = {};
  if (!enquiry.name) errors.name = 'Please enter your name';
  if (!EMAIL_RE.test(enquiry.email)) errors.email = 'Please enter a valid email';
  if (!enquiry.message) errors.message = 'Please enter a message';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const record = { ...enquiry, receivedAt: new Date().toISOString() };

  // Always keep a copy on disk
  const file = path.join(DATA, 'enquiries.json');
  let all = [];
  try { all = JSON.parse(await fs.readFile(file, 'utf-8')); } catch { /* first enquiry */ }
  all.push(record);
  await fs.writeFile(file, JSON.stringify(all, null, 2));

  // Email the office if SMTP is configured
  if (mailer) {
    try {
      await mailer.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: process.env.MAIL_TO || 'info@ptamumbai.com',
        replyTo: enquiry.email,
        subject: `Website enquiry: ${enquiry.service || 'General'} – ${enquiry.name}`,
        text: Object.entries(enquiry).map(([k, v]) => `${k}: ${v}`).join('\n'),
      });
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  }

  res.json({ ok: true, message: 'Thank you! We will get back to you shortly.' });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ---------- Old WordPress URLs → new pages (keeps Google links working) ----------
const legacyRedirects = {
  '/the-truth-about-paper-myths-vs-facts': '/blog/the-truth-about-paper-myths-vs-facts',
  '/paper-a-sustainable-choice-for-a-changing-world': '/blog/paper-a-sustainable-choice-for-a-changing-world',
  '/a-corporate-guide-to-continuous-improvement': '/blog/the-future-of-paper',
  '/wp-content/uploads/2025/10/PTA-New-Membership-Form.pdf': '/PTA-New-Membership-Form.pdf',
  '/home': '/',
};
app.use((req, res, next) => {
  const p = req.path.replace(/\/+$/, '') || '/';
  if (legacyRedirects[p]) return res.redirect(301, legacyRedirects[p]);
  if (p.startsWith('/category/') || p.startsWith('/growhub-team/')) return res.redirect(301, '/');
  next();
});

// ---------- Serve React build in production ----------
app.use(express.static(CLIENT_DIST));
app.get('/{*splat}', (_req, res, next) =>
  res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => err && next()),
);

app.listen(PORT, () => console.log(`PTA Mumbai server running on http://localhost:${PORT}`));
