// Prefix site-relative paths ("/images/x.jpg") with the deploy base,
// so the site works both at ptamumbai.com/ and at mis662.github.io/pta-mumbai/.
export const asset = (p) =>
  typeof p === 'string' && p.startsWith('/') && !p.startsWith('//')
    ? import.meta.env.BASE_URL + p.slice(1)
    : p;

// Static build (GitHub Pages): no Node server, content comes from /data/*.json
export const IS_STATIC = import.meta.env.VITE_STATIC === '1';
