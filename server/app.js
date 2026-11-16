// The PTA Mumbai API. Used by server/index.js (local / Node hosting)
// and by netlify/functions/api.mjs (Netlify).
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

// Content is imported (not read from disk) so it is bundled into the Netlify Function.
import site from './data/site.json' with { type: 'json' };
import members from './data/members.json' with { type: 'json' };
import history from './data/history.json' with { type: 'json' };
import blogs from './data/blogs.json' with { type: 'json' };

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// On Netlify, requests may arrive as /.netlify/functions/api/<route>; map them back to /api/<route>.
app.use((req, _res, next) => {
  const prefix = '/.netlify/functions/api';
  if (req.url.startsWith(prefix)) req.url = '/api' + (req.url.slice(prefix.length) || '/');
  next();
});

// ---------- Content API ----------
app.get('/api/site', (_req, res) => res.json(site));
app.get('/api/members', (_req, res) => res.json(members));
app.get('/api/history', (_req, res) => res.json(history));
app.get('/api/blogs', (_req, res) => res.json(blogs.map(({ body, ...summary }) => summary)));
app.get('/api/blogs/:slug', (req, res) => {
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
    name: clean(req.body?.name, 100),
    email: clean(req.body?.email, 150),
    phone: clean(req.body?.phone, 20),
    service: clean(req.body?.service, 50),
    message: clean(req.body?.message, 3000),
  };

  const errors = {};
  if (!enquiry.name) errors.name = 'Please enter your name';
  if (!EMAIL_RE.test(enquiry.email)) errors.email = 'Please enter a valid email';
  if (!enquiry.message) errors.message = 'Please enter a message';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const record = { ...enquiry, receivedAt: new Date().toISOString() };
  console.log('Website enquiry:', JSON.stringify(record));

  // Keep a copy on disk where the host allows it (not possible on Netlify).
  let saved = false;
  try {
    const file = path.join(DATA, 'enquiries.json');
    let all = [];
    try { all = JSON.parse(await fs.readFile(file, 'utf-8')); } catch { /* first enquiry */ }
    all.push(record);
    await fs.writeFile(file, JSON.stringify(all, null, 2));
    saved = true;
  } catch { /* read-only file system */ }

  // Email the office if SMTP is configured
  let emailed = false;
  if (mailer) {
    try {
      await mailer.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: process.env.MAIL_TO || 'info@ptamumbai.com',
        replyTo: enquiry.email,
        subject: `Website enquiry: ${enquiry.service || 'General'} – ${enquiry.name}`,
        text: Object.entries(enquiry).map(([k, v]) => `${k}: ${v}`).join('\n'),
      });
      emailed = true;
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  }

  if (!saved && !emailed) {
    return res.status(503).json({ message: 'Our form is temporarily unavailable. Please call or email the office.' });
  }
  res.json({ ok: true, message: 'Thank you! We will get back to you shortly.' });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ---------- Old WordPress URLs → new pages (keeps Google links working) ----------
export const legacyRedirects = {
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

export default app;
