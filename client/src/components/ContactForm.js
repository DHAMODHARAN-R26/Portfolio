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

    try {
      await apiFetch('/api/portfolio/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setStatus({ type: 'success', message: 'Message sent successfully! Thank you.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.message && (
        <div className={`p-4 rounded-xl text-sm border ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}>
          {status.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Your Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="e.g. John Doe"
          className="w-full px-4 py-3 rounded-xl bg-background/50 border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-55"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Your Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g. john@example.com"
            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-55"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Subject</label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g. Project Inquiry"
            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-55"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="What would you like to discuss?"
          className="w-full px-4 py-3 rounded-xl bg-background/50 border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-y disabled:opacity-55"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/10 focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
