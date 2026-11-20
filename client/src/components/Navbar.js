'use client';
import { useState, useEffect } from 'react';

// Streamlined desktop navigation with zero clutter and generous breathing space
const DESKTOP_NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Career', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Certs', href: '#certifications' },
  { label: 'Awards', href: '#achievements' },
  { label: 'AI Suite', href: '#resume-analyzer' },
];

// Comprehensive navigation for the mobile slide-down drawer
const MOBILE_NAV_LINKS = [
  { label: 'About Overview', href: '#about' },
  { label: 'Technical Skills', href: '#skills' },
  { label: 'Projects Showcase', href: '#projects' },
  { label: 'Work Experience', href: '#experience' },
  { label: 'Academic Degrees', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Key Achievements', href: '#achievements' },
  { label: 'AI Resume Suite', href: '#resume-analyzer' },
];

export default function Navbar({ profileName, darkMode, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'resume-analyzer', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile/Tablet Backdrop scrim when drawer is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-2 xs:top-3 sm:top-5 inset-x-0 mx-auto max-w-[1400px] z-50 px-2.5 xs:px-3.5 sm:px-6 lg:px-10 transition-all duration-300">
        <div 
          className={`w-full rounded-full transition-all duration-300 px-3 xs:px-4 sm:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3 flex items-center justify-between gap-2 xs:gap-3 sm:gap-4 lg:gap-8 ${
            scrolled 
              ? 'glass-panel shadow-xl border-border-hover dark:border-white/10 backdrop-blur-2xl bg-bg-surface/95 dark:bg-bg-surface/90' 
              : 'border border-border-subtle bg-bg-surface/90 dark:bg-bg-surface/85 backdrop-blur-xl'
          }`}
        >
          {/* Brand identity — locked with shrink-0 so it NEVER gets squeezed */}
          <a href="#about" className="flex items-center gap-2 group shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
            </div>
            <span className="text-[11px] xs:text-xs font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors font-sans uppercase truncate max-w-[130px] xs:max-w-none">
              {profileName || 'DHAMODHARAN R'}
            </span>
          </a>

          {/* Desktop Navigation Links — streamlined, generous breathing space */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-bg-elevated/70 p-1 rounded-full border border-border-subtle shrink-0">
            {DESKTOP_NAV_LINKS.map((link) => {
              const sectionId = link.href.substring(1);
              const isActive = activeSection === sectionId || (sectionId === 'experience' && activeSection === 'experience');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] xl:text-xs font-medium px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-accent text-white shadow-sm font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/80'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Island — theme toggle + contact button + mobile menu */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border-subtle bg-bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent transition-all cursor-pointer shadow-sm shrink-0"
              aria-label="Toggle theme"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.070 0l-7.07 7.07z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Dedicated Primary Contact CTA Button (Tablet & Desktop) */}
            <a
              href="#contact"
              className="hidden sm:inline-flex btn-primary text-xs py-1.5 px-3.5 sm:px-4 rounded-full font-semibold shadow-sm hover:shadow-md transition-all shrink-0"
            >
              Contact
            </a>

            {/* Mobile/Tablet Hamburger Toggle (screens < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border-subtle bg-bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer with Frosted Glass */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 sm:p-4 rounded-3xl glass-panel border border-border-hover dark:border-white/10 bg-bg-surface/98 dark:bg-bg-surface/95 backdrop-blur-2xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-90px)] overflow-y-auto">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 pb-1">
              {MOBILE_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-medium px-3.5 py-3 rounded-2xl transition-colors flex items-center justify-between min-h-[44px] ${
                    activeSection === link.href.substring(1)
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/25'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-text-muted text-[10px]">→</span>
                </a>
              ))}
            </div>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full text-center text-xs py-3 rounded-2xl justify-center font-bold tracking-wide shadow-md flex items-center gap-2 min-h-[44px]"
            >
              <span>Get in Touch Directly</span>
              <span>→</span>
            </a>
          </div>
        )}
      </header>
    </>
  );
}
