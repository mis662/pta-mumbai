import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useSite } from '../api.jsx';
import BlogCard, { formatDate } from '../components/BlogCard.jsx';
import { PhoneIcon, ArrowIcon, UserIcon, FileIcon, ChevronIcon, ExternalIcon, iconMap } from '../components/Icons.jsx';

export default function Home() {
  const site = useSite();
  const { data: members } = useApi('/api/members');
  const { data: blogs } = useApi('/api/blogs');
  const [openFaq, setOpenFaq] = useState(0);
  const formUrl = site?.membershipFormUrl ?? '/PTA-New-Membership-Form.pdf';

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="eyebrow">{site?.hero.caption ?? 'New Opportunities Makes company growth'}</span>
            <h1>Empowering <em>Traders</em>, Connecting <em>Mumbai</em></h1>
            <p className="lead">{site?.hero.intro}</p>
            <div className="hero-actions">
              <Link to="/about-us" className="btn btn-primary">View History <ArrowIcon width={18} height={18} /></Link>
              {site && (
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="hero-phone">
                  <span className="icon-circle"><PhoneIcon /></span>
                  <span><small>Call us anytime</small>{site.contact.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      {site?.stats && (
        <section className="stats-strip">
          <div className="container stats-grid">
            {site.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- History ---------- */}
      <section className="section history">
        <div className="container history-grid">
          <div className="history-media">
            <img src="/images/history.png" alt="Paper Traders' Association of Mumbai" loading="lazy" />
            <div className="year-badge">
              <strong>{site?.foundedYear ?? 1941}</strong>
              <span>Association Roots</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Association Roots</span>
            <h2 className="section-title">A Glorious <em>History</em></h2>
            <p>{site?.historyIntro}</p>
            <h3 className="sub-title">Affiliations</h3>
            <p>{site?.affiliations}</p>
            <Link to="/about-us" className="btn btn-outline">Read Our Full History <ArrowIcon width={18} height={18} /></Link>
          </div>
        </div>
      </section>

      {/* ---------- Milestones ---------- */}
      {site?.milestones && (
        <section className="section milestones">
          <div className="paper-lines" aria-hidden="true" />
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow light">Since 1941</span>
              <h2 className="section-title light">Key <em>Milestones</em></h2>
            </div>
            <ol className="milestone-track">
              {site.milestones.map((m) => (
                <li key={m.year}>
                  <span className="m-year">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- Committee ---------- */}
      <section className="section committee">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">About Our Leadership</span>
            <h2 className="section-title">Our <em>Committee</em></h2>
          </div>
          <div className="leader-grid">
            {members?.office.map((m) => (
              <div className="leader-card" key={m.name}>
                <div className="leader-avatar"><UserIcon width={40} height={40} /></div>
                <h3>{m.name}</h3>
                <p>{m.designation}</p>
              </div>
            ))}
          </div>
          <div className="center mt">
            <Link to="/members" className="btn btn-outline">View All Members <ArrowIcon width={18} height={18} /></Link>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section services" id="services">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">What We Do</span>
            <h2 className="section-title">Our <em>Services</em></h2>
          </div>
          <div className="service-grid">
            {site?.services.map((s) => {
              const Icon = iconMap[s.icon] ?? iconMap.handshake;
              return (
                <div className="service-card" key={s.title}>
                  <div className="service-icon"><Icon /></div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Why join ---------- */}
      {site?.whyJoin && (
        <section className="section alt why-join">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Member Benefits</span>
              <h2 className="section-title">Why Join <em>PTA Mumbai?</em></h2>
              <p className="section-lead">Eight decades of standing together for Mumbai's paper trade — here's what membership brings you.</p>
            </div>
            <div className="benefit-grid">
              {site.whyJoin.map((b) => {
                const Icon = iconMap[b.icon] ?? iconMap.handshake;
                return (
                  <div className="benefit" key={b.title}>
                    <span className="benefit-icon"><Icon width={26} height={26} /></span>
                    <div>
                      <h3>{b.title}</h3>
                      <p>{b.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- How to join ---------- */}
      {site?.joinSteps && (
        <section className="section join">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Membership</span>
              <h2 className="section-title">How to <em>Become a Member</em></h2>
            </div>
            <ol className="steps">
              {site.joinSteps.map((s, i) => (
                <li key={s.title}>
                  <span className="step-no">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- Membership CTA ---------- */}
      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Become a member of PTA Mumbai</h2>
            <p>Download the membership form, fill it in and submit it at our Fort office.</p>
          </div>
          <div className="cta-actions">
            <a href={formUrl} className="btn btn-light" target="_blank" rel="noreferrer">
              <FileIcon width={18} height={18} /> Membership Form
            </a>
            <Link to="/contact-us" className="btn btn-ghost">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ---------- News ---------- */}
      {site?.news && (
        <section className="section news">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Updates</span>
              <h2 className="section-title">PTA in the <em>News</em></h2>
            </div>
            <div className="news-grid">
              {site.news.map((n) => {
                const external = n.url.startsWith('http');
                const inner = (
                  <>
                    <span className="news-date">{formatDate(n.date)}</span>
                    <h3>{n.title}</h3>
                    <p>{n.text}</p>
                    <span className="news-source">
                      {n.source} {external ? <ExternalIcon /> : <ArrowIcon width={15} height={15} />}
                    </span>
                  </>
                );
                return external ? (
                  <a key={n.title} className="news-card" href={n.url} target="_blank" rel="noreferrer">{inner}</a>
                ) : (
                  <Link key={n.title} className="news-card" to={n.url}>{inner}</Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Blogs ---------- */}
      <section className="section alt blogs">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Featured This Week</span>
            <h2 className="section-title">Read Our <em>Blogs</em></h2>
          </div>
          <div className="blog-grid">
            {blogs?.map((p) => <BlogCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      {site?.faqs && (
        <section className="section faq">
          <div className="container faq-grid">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2 className="section-title">Frequently Asked <em>Questions</em></h2>
              <p>Can't find what you're looking for? Our office team is happy to help.</p>
              <Link to="/contact-us" className="btn btn-primary">Ask a Question <ArrowIcon width={18} height={18} /></Link>
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
