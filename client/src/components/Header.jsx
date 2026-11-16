import { asset } from '../asset.js';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSite } from '../api.jsx';
import { PhoneIcon, MenuIcon, CloseIcon } from './Icons.jsx';

export default function Header() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone = site?.contact?.phone ?? '+91 22 66663322';
  const formUrl = asset(site?.membershipFormUrl || '/PTA-New-Membership-Form.pdf');
  const tel = phone.replace(/\s/g, '');

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container hdr">
        <Link to="/" className="brand" aria-label="PTA Mumbai home">
          <span className="logo-crop"><img src={asset("/images/logo.png")} alt="PTA Mumbai" /></span>
        </Link>

        <div className="hdr-right">
          <div className="hdr-navrow">
            <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main">
              <NavLink to="/" end>Home</NavLink>
              <Link to="/#services">Our Services</Link>
              <NavLink to="/members">Members</NavLink>
              <a href={formUrl} target="_blank" rel="noreferrer">Membership Form</a>
              <NavLink to="/about-us">About Us</NavLink>
              <NavLink to="/contact-us">Contact Us</NavLink>
            </nav>
            <a className="hdr-call" href={`tel:${tel}`}><PhoneIcon width={16} height={16} /> Call the office</a>
            <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
