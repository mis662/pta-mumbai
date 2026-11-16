import { useState } from 'react';
import { useSite } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { PhoneIcon, MailIcon, PinIcon } from '../components/Icons.jsx';

const empty = { name: '', email: '', phone: '', service: '', message: '' };

export default function Contact() {
  const site = useSite();
  const c = site?.contact;
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    setErrors({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setStatus({ state: 'error', message: data.message || 'Please correct the highlighted fields.' });
        return;
      }
      setForm(empty);
      setStatus({ state: 'success', message: data.message });
    } catch {
      setStatus({ state: 'error', message: 'Could not send your message. Please call or email us instead.' });
    }
  }

  return (
    <>
      <PageBanner title="Contact Us" subtitle="Have questions? Reach out to us for more information and support!" image="/images/banner.jpg" />

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="kicker">Get in touch</span>
            <h2 className="display">Let's start <em>working together</em></h2>

            {c && (
              <div className="contact-cards">
                <a className="contact-card" href={`tel:${c.phone.replace(/\s/g, '')}`}>
                  <span className="icon-circle"><PhoneIcon /></span>
                  <span><small>Call us for Enquiry</small>{c.phone}</span>
                </a>
                <a className="contact-card" href={`mailto:${c.email}`}>
                  <span className="icon-circle"><MailIcon /></span>
                  <span><small>Email anytime</small>{c.email}</span>
                </a>
                <div className="contact-card">
                  <span className="icon-circle"><PinIcon /></span>
                  <span><small>Visit Our Office</small>{c.address}</span>
                </div>
              </div>
            )}
          </div>

          <form className="contact-form" onSubmit={submit} noValidate>
            <h3>Send us a message</h3>
            <div className="form-row">
              <Field label="Your Name *" name="name" value={form.name} onChange={update} error={errors.name} />
              <Field label="Email Address *" name="email" type="email" value={form.email} onChange={update} error={errors.email} />
            </div>
            <div className="form-row">
              <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={update} />
              <label className="field">
                <span>Select Service</span>
                <select name="service" value={form.service} onChange={update}>
                  <option value="">Select Service</option>
                  {(site?.enquiryServices ?? []).map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <label className={`field ${errors.message ? 'has-error' : ''}`}>
              <span>Message *</span>
              <textarea name="message" rows={5} value={form.message} onChange={update} />
              {errors.message && <em>{errors.message}</em>}
            </label>
            <button className="btn btn-primary" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
            {status.message && <p className={`form-status ${status.state}`} role="status">{status.message}</p>}
          </form>
        </div>
      </section>

      {c && (
        <section className="map">
          <iframe
            title="PTA Mumbai office location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
    </>
  );
}

function Field({ label, error, ...props }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input {...props} />
      {error && <em>{error}</em>}
    </label>
  );
}
