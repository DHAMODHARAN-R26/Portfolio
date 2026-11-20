'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function AIOfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (response.ok) {
          const data = await response.json();
          // If backend has aiConfigured property (we'll make sure it does or check if fallback is active)
          setIsOffline(data.aiConfigured === false);
        } else {
          setIsOffline(true);
        }
      } catch (err) {
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  if (loading || !isOffline) return null;

  return (
    <div className="w-full px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs text-center flex items-center justify-center gap-2">
      <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>Running in Offline Mode (Mock AI). Please set a <code>GEMINI_API_KEY</code> or <code>OPENAI_API_KEY</code> in the server <code>.env</code> file for dynamic responses.</span>
    </div>
  );
}
