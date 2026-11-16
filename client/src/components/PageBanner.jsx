import { Link } from 'react-router-dom';

export default function PageBanner({ title, subtitle, crumb }) {
  return (
    <section className="page-banner">
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
