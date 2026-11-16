import { Link } from 'react-router-dom';
import { useSite } from '../api.jsx';

export default function Footer() {
  const site = useSite();
  const c = site?.contact;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-mark">
          <span className="logo-crop footer-logo"><img src="/images/logo.png" alt="PTA Mumbai" /></span>
          <p>Paper Traders' Association of Mumbai.<br />Serving the paper trade since 1941.</p>
        </div>

        <div className="footer-grid">
          <div>
            <h4>Visit</h4>
            <p>{c?.address}</p>
          </div>
          <div>
            <h4>Contact</h4>
            {c && (
              <p>
                <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a><br />
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </p>
            )}
          </div>
          <div>
            <h4>Working Time</h4>
            <p>{(c?.hours ?? []).map((h) => <span key={h}>{h}<br /></span>)}</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about-us">About us</Link>
              <Link to="/members">Members</Link>
              <Link to="/contact-us">Contact us</Link>
              <a href={site?.membershipFormUrl ?? '/PTA-New-Membership-Form.pdf'} target="_blank" rel="noreferrer">Membership form</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PTA Mumbai. All Rights Reserved.</span>
          <span>Member of the Federation of Paper Traders' Associations of India network</span>
        </div>
      </div>
    </footer>
  );
}
