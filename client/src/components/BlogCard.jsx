import { asset } from '../asset.js';
import { Link } from 'react-router-dom';

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-thumb">
        <img src={asset(post.image)} alt="" loading="lazy" />
      </Link>
      <p className="kicker">{post.category}</p>
      <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p className="blog-excerpt">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="text-link">Read article</Link>
    </article>
  );
}
