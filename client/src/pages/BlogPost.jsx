import { Link, useParams } from 'react-router-dom';
import { useApi, Loader } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';
import BlogCard, { formatDate } from '../components/BlogCard.jsx';
import NotFound from './NotFound.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useApi(`/api/blogs/${slug}`);
  const { data: all } = useApi('/api/blogs');

  if (loading) return <Loader />;
  if (error || !post) return <NotFound />;

  // group consecutive list items into <ul>
  const blocks = [];
  post.body.forEach((b) => {
    if (b.type === 'li') {
      const last = blocks[blocks.length - 1];
      if (last?.type === 'ul') last.items.push(b.text);
      else blocks.push({ type: 'ul', items: [b.text] });
    } else blocks.push(b);
  });

  return (
    <>
      <PageBanner title={post.title} crumb="Blog" />
      <article className="section">
        <div className="container post">
          <img className="post-cover" src={post.image} alt="" />
          <p className="meta">
            <span className="pill">{post.category}</span> By {post.author} · {formatDate(post.date)} · Updated {formatDate(post.updated)}
          </p>
          <div className="post-body">
            {blocks.map((b, i) =>
              b.type === 'h' ? <h2 key={i}>{b.text}</h2>
              : b.type === 'ul' ? <ul key={i}>{b.items.map((t, j) => <li key={j}>{t}</li>)}</ul>
              : <p key={i}>{b.text}</p>,
            )}
          </div>
          <Link to="/" className="btn btn-outline mt">← Back to Home</Link>
        </div>
      </article>

      {all && (
        <section className="section alt">
          <div className="container">
            <h2 className="section-title small center">More <em>Articles</em></h2>
            <div className="blog-grid">
              {all.filter((p) => p.slug !== slug).map((p) => <BlogCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
