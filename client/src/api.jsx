import { createContext, useContext, useEffect, useState } from 'react';

/** Fetch JSON from the Node API. */
export function useApi(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: null });
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status === 404 ? 'Not found' : 'Failed to load'))))
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
