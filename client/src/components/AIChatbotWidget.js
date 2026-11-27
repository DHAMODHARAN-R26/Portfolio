'use client';
import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm ZAZA, Dhamodharan's personal AI companion.\n\nAsk me anything about his software engineering background, IoT architectures, academic record (9.05 CGPA), or hireability fit for your engineering team!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const chatEndRef = useRef(null);
  const msgIdRef = useRef(0);

  useEffect(() => {
    if (chatEndRef.current && isOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) setInputValue('');
    setErrorMsg('');
    setShowTooltip(false);

    const userMsg = { id: `msg-${++msgIdRef.current}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await apiFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      });

      const botMsg = {
        id: `msg-${++msgIdRef.current}`,
        sender: 'bot',
        text: response.reply
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to connect to ZAZA assistant service.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "👋 Chat reset! I'm ZAZA. What would you like to know about Dhamodharan?"
      }
    ]);
    setErrorMsg('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'Who is Dhamodharan?',
    'Technical Stack & DSA',
    'Flagship IoT Systems',
    'Why hire Dhamodharan?',
    'Contact Information'
  ];

  return (
    <>
      {/* Mobile Backdrop Scrim when chat is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Widget Container — Ergonomically offset across all device screen sizes */}
      <div className="fixed bottom-3 right-3 xs:bottom-5 xs:right-4 sm:bottom-7 sm:right-7 lg:bottom-8 lg:right-8 z-50 max-w-[calc(100%-1.5rem)]">
        {/* Floating Futuristic Launcher */}
        {!isOpen && (
          <div className="relative flex flex-col items-end">
            {/* Friendly Greeting Speech Bubble */}
            {showTooltip && (
              <div className="hidden sm:flex items-center gap-2 mb-2.5 px-3.5 py-1.5 rounded-2xl bg-bg-surface/95 border border-border-hover shadow-xl backdrop-blur-md text-xs text-text-primary animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-sans font-medium text-text-secondary">
                  Chat with <strong className="text-text-primary font-bold">ZAZA</strong>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                  className="text-text-muted hover:text-text-primary ml-1 text-xs"
                  aria-label="Dismiss tooltip"
                >
                  ×
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              className="flex items-center gap-2 xs:gap-2.5 px-3.5 xs:px-4 py-2 xs:py-2.5 rounded-full border border-accent/40 bg-bg-surface/95 hover:bg-bg-surface text-text-primary shadow-2xl backdrop-blur-2xl transition-all duration-300 cursor-pointer group hover:scale-105 hover:border-accent hover:shadow-[0_0_24px_rgba(99,102,241,0.35)] min-h-[44px]"
              aria-label="Open ZAZA AI Assistant"
            >
              {/* Glowing Avatar Indicator */}
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-accent via-indigo-500 to-sky-400 p-[1.5px] shadow-sm">
                  <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center text-xs font-black text-accent font-sans">
                    ⚡
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-bg-surface animate-pulse" />
              </div>

              {/* Identity & Status */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black tracking-tight text-text-primary font-sans">
                    ZAZA
                  </span>
                  <span className="text-[9px] font-sans font-bold text-accent px-1.5 py-0.2 rounded bg-accent/15 border border-accent/25">
                    AI
                  </span>
                </div>
                <span className="text-[10px] font-sans font-medium text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>ONLINE</span>
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Futuristic Glass Chat Drawer — Responsive on Mobile, Tablet & Widescreen Desktop */}
        {isOpen && (
          <div className="fixed inset-x-2.5 bottom-2.5 xs:inset-x-3 xs:bottom-3 sm:static sm:inset-auto w-auto sm:w-[390px] md:w-[410px] h-[82vh] sm:h-[560px] max-h-[640px] rounded-2xl xs:rounded-3xl glass-panel border border-border-hover bg-bg-surface/98 sm:bg-bg-surface/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

            {/* Header */}
            <div className="px-4 sm:px-5 py-3.5 border-b border-border-subtle flex items-center justify-between bg-bg-surface/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent via-indigo-500 to-sky-400 p-[1.5px] shadow-sm">
                    <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center text-xs font-black text-accent font-sans">
                      ⚡
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-bg-surface animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-text-primary font-sans tracking-tight">
                      ZAZA
                    </h3>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-sans">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted font-sans font-medium">
                    Dhamodharan&apos;s AI Companion
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="text-text-muted hover:text-text-primary p-2 rounded-xl hover:bg-bg-elevated transition-colors cursor-pointer"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-muted hover:text-text-primary p-2 rounded-xl hover:bg-bg-elevated transition-colors cursor-pointer"
                  aria-label="Close ZAZA Assistant"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-bg-main/30 text-xs sm:text-[13px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-black text-accent flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                      Z
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-accent to-accent-hover text-white font-medium shadow-md rounded-br-xs'
                        : 'bg-bg-surface border border-border-subtle text-text-primary shadow-xs rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-black text-accent flex items-center justify-center shrink-0">
                    Z
                  </div>
                  <div className="bg-bg-surface border border-border-subtle px-4 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl text-xs border border-rose-500/20 bg-rose-500/10 text-rose-400 font-sans font-medium">
                  {errorMsg}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="px-3.5 py-2 border-t border-border-subtle bg-bg-surface/70 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-sans font-medium border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent hover:bg-bg-elevated transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Terminal */}
            <div className="p-3 sm:p-3.5 border-t border-border-subtle bg-bg-surface flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask ZAZA anything..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-sm sm:text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors font-sans"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputValue.trim()}
                className="p-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all cursor-pointer disabled:opacity-40 shadow-sm shrink-0"
                aria-label="Send message to ZAZA"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
