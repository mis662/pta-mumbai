import { useState } from 'react';
import { useApi, useSite, Loader, ErrorBox } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';
import Ledger from '../components/Ledger.jsx';

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
        <div className="container">
          <div className="about-intro">
            <div className="about-images">
              <img src="/images/about2.jpg" alt="PTA Mumbai" loading="lazy" />
              <img src="/images/about1.jpg" alt="PTA Mumbai" loading="lazy" />
            </div>
            <div className="prose">
              <p className="kicker">Association Roots</p>
              <h2 className="display">Our History</h2>
              <p className="dropcap">{site?.historyIntro}</p>
              <p>{site?.affiliations}</p>
            </div>
          </div>
          <Ledger items={site?.stats} />
        </div>
      </section>

      <section className="section archive">
        <div className="container">
          <div className="row-head">
            <div>
              <p className="kicker">Year by year</p>
              <h2 className="display">The PTA record, 1941 to today</h2>
            </div>
          </div>

          {loading && <Loader />}
          {error && <ErrorBox error={error} />}

          {visible && (
            <ol className="timeline">
              {visible.map((h) => (
                <li key={h.year + h.title}>
                  <div className="timeline-year">{h.year}</div>
                  <div className="timeline-body">
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
                {showAll ? 'Show less' : `Show all ${history.length} entries`}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
