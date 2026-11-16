import { Link } from 'react-router-dom';
import { ArrowIcon } from './Icons.jsx';

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-thumb">
        <img src={post.image} alt="" loading="lazy" />
        <span className="tag">{post.category}</span>
      </Link>
      <div className="blog-body">
        <p className="meta">By {post.author} · {formatDate(post.date)}</p>
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="read-more">Read More <ArrowIcon width={16} height={16} /></Link>
      </div>
    </article>
  );
}
