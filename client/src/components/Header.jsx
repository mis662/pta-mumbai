import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSite } from '../api.jsx';
import { PhoneIcon, MailIcon, PinIcon, MenuIcon, CloseIcon, FileIcon } from './Icons.jsx';

export default function Header() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const c = site?.contact;
  const formUrl = site?.membershipFormUrl || '/PTA-New-Membership-Form.pdf';

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><PinIcon width={15} height={15} /> {c?.location ?? 'Fort, Mumbai'}</span>
          <a href={`mailto:${c?.email ?? 'info@ptamumbai.com'}`}><MailIcon width={15} height={15} /> {c?.email ?? 'info@ptamumbai.com'}</a>
          <a href={`tel:${(c?.phone ?? '+912266663322').replace(/\s/g, '')}`}><PhoneIcon width={15} height={15} /> {c?.phone ?? '+91 22 66663322'}</a>
        </div>
      </div>

      <div className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand" aria-label="PTA Mumbai home">
            <span className="logo-crop"><img src="/images/logo.png" alt="PTA Mumbai" /></span>
          </Link>

          <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main">
            <NavLink to="/" end>Home</NavLink>
            <Link to="/#services">Our Services</Link>
            <NavLink to="/members">Members</NavLink>
            <NavLink to="/about-us">About Us</NavLink>
            <NavLink to="/contact-us">Contact Us</NavLink>
            <a className="btn btn-primary nav-cta" href={formUrl} target="_blank" rel="noreferrer">
              <FileIcon width={17} height={17} /> Membership Form
            </a>
          </nav>

          <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
