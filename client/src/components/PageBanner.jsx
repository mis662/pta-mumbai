import { asset } from '../asset.js';
import { Link } from 'react-router-dom';

export default function PageBanner({ title, subtitle, crumb, image = '/images/about2.jpg' }) {
  return (
    <section className="page-banner" style={{ '--banner-img': `url('${asset(image)}')` }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> <span>/</span> {crumb ?? title}
        </nav>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
