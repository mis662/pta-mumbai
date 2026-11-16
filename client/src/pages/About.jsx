import { useState } from 'react';
import { useApi, useSite, Loader, ErrorBox } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';

const INITIAL = 8;

export default function About() {
  const site = useSite();
  const { data: history, loading, error } = useApi('/api/history');
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? history : history?.slice(0, INITIAL);

  return (
    <>
      <PageBanner title="About Us" subtitle="Serving the paper trade of Mumbai since 1941" />

      <section className="section">
        <div className="container about-intro">
          <div className="about-images">
            <img src="/images/about2.jpg" alt="PTA Mumbai" loading="lazy" />
            <img src="/images/about1.jpg" alt="PTA Mumbai" loading="lazy" />
          </div>
          <div>
            <span className="eyebrow">Association Roots</span>
            <h2 className="section-title">Our <em>History</em></h2>
            <p>{site?.historyIntro}</p>
            <p>{site?.affiliations}</p>
          </div>
        </div>
      </section>

      {site?.stats && (
        <section className="stats-strip">
          <div className="container stats-grid">
            {site.stats.map((s) => (
              <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
            ))}
          </div>
        </section>
      )}

      {site?.milestones && (
        <section className="section">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">At a Glance</span>
              <h2 className="section-title">Defining <em>Moments</em></h2>
            </div>
            <div className="glance-grid">
              {site.milestones.map((m) => (
                <div className="glance-card" key={m.year}>
                  <span>{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section timeline-section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Year by Year</span>
            <h2 className="section-title">Milestones of <em>PTA</em></h2>
          </div>

          {loading && <Loader />}
          {error && <ErrorBox error={error} />}

          {visible && (
            <ol className="timeline">
              {visible.map((h) => (
                <li key={h.year + h.title}>
                  <div className="timeline-year">{h.year}</div>
                  <div className="timeline-card">
                    {h.title && <h3>{h.title}</h3>}
                    {h.items.map((t, i) => <p key={i}>{t}</p>)}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {history && history.length > INITIAL && (
            <div className="center mt">
              <button className="btn btn-outline" onClick={() => setShowAll((s) => !s)}>
                {showAll ? 'Show less' : `Show all ${history.length} milestones`}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
