import { createContext, useContext, useEffect, useState } from 'react';
import { asset, IS_STATIC } from './asset.js';

const getJson = (url) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status === 404 ? 'Not found' : 'Failed to load'))));

/** Static hosting: answer the same /api/... URLs from the bundled data files. */
async function staticApi(url) {
  const blog = url.match(/^\/api\/blogs\/([^/]+)$/);
  if (blog) {
    const post = (await getJson(asset('/data/blogs.json'))).find((b) => b.slug === decodeURIComponent(blog[1]));
    if (!post) throw new Error('Not found');
    return post;
  }
  const name = url.match(/^\/api\/(site|members|history|blogs)$/)?.[1];
  if (!name) throw new Error('Not found');
  return getJson(asset(`/data/${name}.json`));
}

/** Fetch JSON from the Node API (or the static data files on GitHub Pages). */
export function useApi(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: null });
    (IS_STATIC ? staticApi(url) : getJson(url))
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
  }, [url]);
  return state;
}

const SiteContext = createContext(null);

/** Site-wide settings (contact details, services…) loaded once. */
export function SiteProvider({ children }) {
  const { data } = useApi('/api/site');
  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

export function Loader() {
  return <div className="loader" aria-label="Loading"><span /></div>;
}

export function ErrorBox({ error }) {
  return <div className="container error-box">Sorry, something went wrong: {error.message}</div>;
}
