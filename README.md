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


## Deploying on GitHub Pages (current live site)

Live: https://ptamumbai.com/ — repo https://github.com/mis662/pta-mumbai

- Every push to `main` rebuilds and publishes automatically (`.github/workflows/pages.yml`, takes ~1 minute; see the **Actions** tab).
- Pages has no Node server: content is read from `data/*.json` (copied from `server/data` by `scripts/build-pages.mjs`), and the contact form opens the visitor's email app addressed to the office.
- **Custom domain:** `pages.yml` builds with `BASE_PATH: /` and `CUSTOM_DOMAIN: ptamumbai.com` (writes the `CNAME` file). GitHub → Settings → Pages has `ptamumbai.com`. Hostinger DNS: `A` records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 and a `CNAME` for `www` → `mis662.github.io`.
