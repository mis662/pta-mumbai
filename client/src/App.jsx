import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Members from './pages/Members.jsx';
import Contact from './pages/Contact.jsx';
import BlogPost from './pages/BlogPost.jsx';
import NotFound from './pages/NotFound.jsx';
import { SiteProvider } from './api.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // wait a tick so the target section has rendered
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <SiteProvider>
      <ScrollManager />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* Old WordPress URLs (GitHub Pages has no server-side redirects) */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/category/*" element={<Navigate to="/" replace />} />
          <Route path="/growhub-team/*" element={<Navigate to="/" replace />} />
          <Route path="/the-truth-about-paper-myths-vs-facts" element={<Navigate to="/blog/the-truth-about-paper-myths-vs-facts" replace />} />
          <Route path="/paper-a-sustainable-choice-for-a-changing-world" element={<Navigate to="/blog/paper-a-sustainable-choice-for-a-changing-world" replace />} />
          <Route path="/a-corporate-guide-to-continuous-improvement" element={<Navigate to="/blog/the-future-of-paper" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </SiteProvider>
  );
}
