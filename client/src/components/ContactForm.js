'use client';
import { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Name, email, and message are required.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    // Pre-calculate fallback mailto link so it's ready even if server is unreachable
    const mailtoSubject = encodeURIComponent(`[Portfolio Direct Inquiry] ${formData.subject || 'New Message'} from ${formData.name}`);
    const mailtoBody = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject || 'None'}\n\nMessage:\n${formData.message}\n\n--\nSent via Dhamodharan's Portfolio`);
    const fallbackMailto = `mailto:dhamodharanr08@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    try {
      const res = await apiFetch('/api/portfolio/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setStatus({ 
        type: 'success', 
        message: res?.message || 'Transmission received. Delivered to Dhamodharan.',
        mailtoUrl: res?.mailtoUrl || fallbackMailto,
        emailed: res?.emailed,
        receiver: res?.receiver || 'dhamodharanr08@gmail.com'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact Form transmission error:', err);
      const isConnectionIssue = err.message?.includes('connect') || err.message?.toLowerCase().includes('failed to fetch');
      const helpfulMessage = isConnectionIssue
        ? 'Could not reach the backend server. If testing locally, please run "npm run dev" from the project root so both client and server are running. If deployed, ensure NEXT_PUBLIC_API_URL is configured in your hosting dashboard.'
        : (err.message || 'Failed to transmit message. Please try again.');

      setStatus({ 
        type: 'error', 
        message: helpfulMessage,
        mailtoUrl: fallbackMailto,
        receiver: 'dhamodharanr08@gmail.com'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <h3 className="text-sm font-bold text-text-primary tracking-tight">Direct Message Dispatch</h3>
        <span className="font-sans font-semibold text-[11px] text-accent flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>INBOX DIRECT</span>
        </span>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl text-xs font-medium border space-y-2.5 ${
          status.emailed
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
            : status.type === 'success'
            ? 'bg-blue-500/10 border-blue-500/25 text-blue-300'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none mt-0.5">
              {status.emailed ? '✓' : status.type === 'success' ? 'ℹ' : '⚠'}
            </span>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-text-primary text-xs sm:text-sm">
                {status.emailed ? 'Delivered Directly to Gmail Inbox!' : status.message}
              </p>
              {!status.emailed && status.type === 'success' && (
                <p className="text-[11px] text-text-muted leading-relaxed">
                  The message is safely stored in your portfolio database. To deliver future messages straight to your Gmail inbox automatically, configure your Gmail App Password in <code className="bg-bg-elevated px-1 py-0.5 rounded text-accent">.env</code>.
                </p>
              )}
            </div>
          </div>

          {status.mailtoUrl && (
            <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-text-muted">Target: {status.receiver || 'dhamodharanr08@gmail.com'}</span>
              <a
                href={status.mailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-[11px] py-1.5 px-3 font-semibold text-accent hover:border-accent flex items-center gap-1.5"
              >
                <span>✉️ Forward via Gmail / Email App Now</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-medium text-text-secondary mb-1.5 font-sans">
          NAME <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="e.g. Alex Hunter"
          className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-xs focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all placeholder:text-text-muted disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5 font-sans">
            EMAIL <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="alex@company.com"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-xs focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all placeholder:text-text-muted disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-xs font-medium text-text-secondary mb-1.5 font-sans">
            SUBJECT
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            placeholder="Engineering Role / Project"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-xs focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all placeholder:text-text-muted disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-text-secondary mb-1.5 font-sans">
          MESSAGE <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Share project parameters, job description, or message details..."
          className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary text-xs focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all resize-y placeholder:text-text-muted disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 sm:py-3.5 text-xs xs:text-sm font-semibold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-md min-h-[44px] justify-center flex items-center gap-2"
      >
        {loading ? 'Transmitting to Mailbox...' : 'Dispatch Message Directly →'}
      </button>

      <div className="pt-1 flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-[11px] text-text-muted font-sans font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">Delivers to: dhamodharanr08@gmail.com</span>
        </span>
        <a
          href="mailto:dhamodharanr08@gmail.com?subject=Portfolio%20Direct%20Inquiry"
          className="text-accent hover:underline flex items-center gap-1 shrink-0 self-start xs:self-auto"
        >
          <span>Open in Mail App</span>
          <span>↗</span>
        </a>
      </div>
    </form>
  );
}
