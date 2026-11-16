# PTA Mumbai Website

Website of the Paper Traders' Association of Mumbai — **React (Vite)** frontend + **Node.js (Express)** backend.

```
client/          React app (pages, components, styles, images)
server/index.js  Express server – API + serves the built React app
server/data/     All website content as JSON (edit these to update text)
```

## Run locally

```bash
npm run install:all   # first time only
npm run dev           # opens http://localhost:5173
```

## Production

```bash
npm install
npm run build         # builds React into client/dist
npm start             # serves everything on $PORT (default 5000)
```

### Environment variables (set in hosting panel)

| Variable | Purpose |
|---|---|
| `PORT` | Set automatically by the host |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email account used to send contact-form enquiries |
| `MAIL_FROM` | Sender address (defaults to `SMTP_USER`) |
| `MAIL_TO` | Where enquiries go (default `info@ptamumbai.com`) |

For Hostinger email: `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`.

## Deploy on Hostinger (Business / Cloud plan)

1. hPanel → **Websites → Add Website → Node.js web app → Import Git repository**
2. Connect GitHub and select this repository, branch `main`
3. Build settings: root directory `/`, build command `npm run build`, start command `npm start`, Node 20+
4. Add the SMTP environment variables above
5. Every `git push` to `main` redeploys automatically

## Editing content

| File | Content |
|---|---|
| `server/data/site.json` | Contact details, services, stats, milestones, benefits, news, FAQs |
| `server/data/members.json` | Office bearers, committee, sub-committees, Women's Wing |
| `server/data/history.json` | Year-by-year history (About page) |
| `server/data/blogs.json` | Blog articles |
