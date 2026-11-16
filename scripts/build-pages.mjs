// After `vite build`: turn client/dist into a complete GitHub Pages site.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'client', 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('Run the client build first');

// 1. Content files (the Node API is not available on GitHub Pages)
fs.mkdirSync(path.join(dist, 'data'), { recursive: true });
for (const f of ['site.json', 'members.json', 'history.json', 'blogs.json']) {
  fs.copyFileSync(path.join(root, 'server', 'data', f), path.join(dist, 'data', f));
}

// 2. Deep links like /members: Pages serves 404.html, which boots the React app
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));

// 3. Old WordPress link to the membership form
const wpPdf = path.join(dist, 'wp-content', 'uploads', '2025', '10');
fs.mkdirSync(wpPdf, { recursive: true });
fs.copyFileSync(path.join(dist, 'PTA-New-Membership-Form.pdf'), path.join(wpPdf, 'PTA-New-Membership-Form.pdf'));

// 4. Serve files as-is, and the custom domain when one is set
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
if (process.env.CUSTOM_DOMAIN) fs.writeFileSync(path.join(dist, 'CNAME'), process.env.CUSTOM_DOMAIN + '\n');

console.log('GitHub Pages files ready in client/dist');
