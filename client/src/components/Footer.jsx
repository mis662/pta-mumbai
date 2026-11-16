import { Link } from 'react-router-dom';
import { useSite } from '../api.jsx';
import { PhoneIcon, MailIcon, PinIcon, ClockIcon } from './Icons.jsx';

export default function Footer() {
  const site = useSite();
  const c = site?.contact;
  return (
    <footer className="site-footer">
      <div className="paper-lines" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="footer-about">
          <span className="logo-crop footer-logo"><img src="/images/logo.png" alt="PTA Mumbai" /></span>
          <p>Serving and protecting the interests of Mumbai's paper trading community since 1941.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About us</Link></li>
            <li><Link to="/members">Members</Link></li>
            <li><Link to="/contact-us">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h4>Working Time</h4>
          <ul className="footer-contact">
            {(c?.hours ?? []).map((h) => (
              <li key={h}><ClockIcon width={17} height={17} /> {h}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact Us</h4>
          {c && (
            <ul className="footer-contact">
              <li><MailIcon width={17} height={17} /> <a href={`mailto:${c.email}`}>{c.email}</a></li>
              <li><PhoneIcon width={17} height={17} /> <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>
              <li><PinIcon width={17} height={17} /> {c.address}</li>
            </ul>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} PTA Mumbai. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
