import { asset } from '../asset.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useSite } from '../api.jsx';
import BlogCard, { formatDate } from '../components/BlogCard.jsx';
import Ledger from '../components/Ledger.jsx';
import PersonCard from '../components/PersonCard.jsx';
import { PhoneIcon, ArrowIcon, ChevronIcon, iconMap } from '../components/Icons.jsx';

const newsDate = (n) => n.dateLabel ?? formatDate(n.date);

export default function Home() {
  const site = useSite();
  const { data: members } = useApi('/api/members');
  const { data: blogs } = useApi('/api/blogs');
  const [openFaq, setOpenFaq] = useState(0);
  const formUrl = asset(site?.membershipFormUrl ?? '/PTA-New-Membership-Form.pdf');
  const [lead, ...moreNews] = site?.news ?? [];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="hero-kicker">{site?.hero.caption ?? 'New Opportunities Makes company growth'}</p>
            <h1>Empowering <em>Traders</em>, Connecting <em>Mumbai</em></h1>
            <p className="lead">{site?.hero.intro}</p>
            <div className="hero-actions">
              <Link to="/about-us" className="btn btn-primary">View History <ArrowIcon width={17} height={17} /></Link>
              {site && (
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="hero-phone">
                  <span className="hero-phone-icon"><PhoneIcon width={20} height={20} /></span>
                  {site.contact.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Since 1941 ---------- */}
      <section className="section intro">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-head">
              <p className="kicker">Association Roots · Est. {site?.foundedYear ?? 1941}</p>
              <h2 className="display">A glorious history, written by Mumbai's paper traders.</h2>
              <figure className="photo-stack">
                <img className="photo-main" src={asset("/images/about2.jpg")} alt="Members attending a PTA Mumbai seminar" loading="lazy" />
                <img className="photo-small" src={asset("/images/about1.jpg")} alt="Traders standing together" loading="lazy" />
                <figcaption className="years-badge">
                  <strong>{new Date().getFullYear() - (site?.foundedYear ?? 1941)}</strong>
                  <span>years serving<br />the paper trade</span>
                </figcaption>
              </figure>
            </div>
            <div className="intro-body prose">
              <p className="dropcap">{site?.historyIntro}</p>
              <h3>Affiliations</h3>
              <p>{site?.affiliations}</p>
              <Link to="/about-us" className="text-link">Read the full history, year by year</Link>
            </div>
          </div>
          <Ledger items={site?.stats} />
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section services" id="services">
        <div className="container">
          <div className="row-head">
            <div>
              <p className="kicker">Our Services</p>
              <h2 className="display">What the association does for its members.</h2>
            </div>
            <p className="muted row-note">From settling a dispute to testing a ream, PTA is the first call a Mumbai paper trader makes.</p>
          </div>
          <ol className="service-grid">
            {site?.services.map((s, i) => {
              const Icon = iconMap[s.icon] ?? iconMap.handshake;
              return (
                <li className="service-card" key={s.title}>
                  <div className="service-top">
                    <span className="service-icon"><Icon width={28} height={28} /></span>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- Milestones ---------- */}
      {site?.milestones && (
        <section className="section milestones">
          <div className="container">
            <div className="row-head">
              <div>
                <p className="kicker light">From the archives</p>
                <h2 className="display light">Moments that shaped the association.</h2>
              </div>
              <Link to="/about-us" className="text-link light">Full timeline</Link>
            </div>
          </div>
          <ol className="years-scroll" tabIndex={0} aria-label="Milestones, scroll sideways">
            {site.milestones.map((m) => (
              <li key={m.year}>
                <span className="year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------- Leadership ---------- */}
      <section className="section leadership">
        <div className="container">
          <div className="row-head">
            <div>
              <p className="kicker">About Our Leadership</p>
              <h2 className="display">Our Committee</h2>
            </div>
            <Link to="/members" className="text-link">All committee &amp; sub-committee members</Link>
          </div>
          <div className="people">
            {members?.office.map((m, i) => (
              <PersonCard key={m.name} person={m} lead={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Paper in India ---------- */}
      {site?.industry && (
        <section className="section industry">
          <div className="container">
            <div className="split">
              <div className="split-head">
                <p className="kicker">The trade we represent</p>
                <h2 className="display">Paper in India, by the numbers.</h2>
                <p className="muted">{site.industry.intro}</p>
              </div>
              <div className="facts">
                {site.industry.facts.map((f) => (
                  <div className="fact" key={f.value}>
                    <strong>{f.value}</strong>
                    <p>{f.label}</p>
                    <a href={f.url} target="_blank" rel="noreferrer">Source: {f.source}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Membership ---------- */}
      <section className="section membership">
        <div className="container">
          <div className="membership-card">
            <div className="membership-intro">
              <p className="kicker light">Membership</p>
              <h2 className="display light">Join the association that has stood by Mumbai's paper trade since 1941.</h2>
              <ol className="steps">
                {site?.joinSteps?.map((s, i) => (
                  <li key={s.title}><span>{i + 1}</span><div><strong>{s.title}</strong> — {s.text}</div></li>
                ))}
              </ol>
              <div className="membership-actions">
                <a href={formUrl} className="btn btn-light" target="_blank" rel="noreferrer">Download Membership Form</a>
                <Link to="/contact-us" className="text-link light">Ask us a question</Link>
              </div>
            </div>
            <div className="membership-benefits">
              <h3>What members get</h3>
              <ul>
                {site?.whyJoin?.map((b) => (
                  <li key={b.title}><strong>{b.title}.</strong> {b.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- News ---------- */}
      {lead && (
        <section className="section news">
          <div className="container">
            <div className="row-head">
              <div>
                <p className="kicker">Updates</p>
                <h2 className="display">PTA in the News</h2>
              </div>
            </div>
            <div className="news-layout">
              <a className="news-lead" href={lead.url} target="_blank" rel="noreferrer">
                <p className="news-meta">{lead.source} · {newsDate(lead)}</p>
                <h3>{lead.title}</h3>
                <p>{lead.text}</p>
                <span className="text-link">Read the story</span>
              </a>
              <ul className="news-list">
                {moreNews.map((n) => (
                  <li key={n.title}>
                    <a href={n.url} target="_blank" rel="noreferrer">
                      <p className="news-meta">{n.source} · {newsDate(n)}</p>
                      <h4>{n.title}</h4>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Blogs ---------- */}
      <section className="section blogs">
        <div className="container">
          <div className="row-head">
            <div>
              <p className="kicker">Featured This Week</p>
              <h2 className="display">Read Our Blogs</h2>
            </div>
          </div>
          <div className="blog-grid">
            {blogs?.map((p) => <BlogCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      {site?.faqs && (
        <section className="section faq">
          <div className="container split">
            <div className="split-head">
              <p className="kicker">FAQ</p>
              <h2 className="display">Questions we are often asked.</h2>
              <p className="muted">Can't find your answer? Call the office on {site.contact.phone} — Mon to Sat, 10 AM to 6 PM.</p>
            </div>
            <div className="faq-list">
              {site.faqs.map((f, i) => (
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={f.q}>
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                    {f.q} <ChevronIcon />
                  </button>
                  <div className="faq-answer"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
