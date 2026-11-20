'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch, getUploadUrl } from '../lib/api';
import { getSocket } from '../lib/socket';
import Navbar from '../components/Navbar';
import TechnologyLogo from '../components/TechnologyLogo';
import AIOfflineIndicator from '../components/AIOfflineIndicator';
import ContactForm from '../components/ContactForm';
import AIChatbotWidget from '../components/AIChatbotWidget';
import ResumeAnalyzer from '../components/ResumeAnalyzer';
import ProjectModal from '../components/ProjectModal';
import DetailModal from '../components/DetailModal';
import ImageLightbox from '../components/ImageLightbox';

export default function Home() {
  const [portfolio, setPortfolio] = useState({
    profile: null,
    skills: [],
    projects: [],
    achievements: [],
    experience: [],
    education: [],
    certifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  // Sync DOM with theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const fetchPortfolioData = useCallback(async () => {
    try {
      const data = await apiFetch('/api/portfolio/data');
      setPortfolio({
        profile: data.profile || null,
        skills: data.skills || [],
        projects: data.projects || [],
        achievements: data.achievements || [],
        experience: data.experience || [],
        education: data.education || [],
        certifications: data.certifications || []
      });
      setError(null);
    } catch (err) {
      console.error('Failed to load portfolio details:', err);
      setError('Could not connect to the backend server. Make sure the server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount
    fetchPortfolioData();

    const socket = getSocket();
    if (socket) {
      socket.connect();
      socket.on('portfolio_updated', () => {
        fetchPortfolioData();
      });
    }

    return () => {
      if (socket) {
        socket.off('portfolio_updated');
        socket.disconnect();
      }
    };
  }, [fetchPortfolioData]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-bg-main text-text-primary space-y-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
        <p className="tech-badge animate-pulse">LOADING PORTFOLIO...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-bg-main text-text-primary min-h-screen">
        <div className="max-w-md w-full p-8 text-center glass-panel bento-card space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-sans font-bold">
            ⚠
          </div>
          <h2 className="text-base font-bold text-text-primary">Connection Error</h2>
          <p className="text-xs text-text-secondary leading-relaxed">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchPortfolioData(); }}
            className="btn-primary text-xs py-2 px-5 w-full justify-center"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { profile, skills, projects, achievements, experience, education, certifications } = portfolio;

  // Extract unique categories from skills
  const categories = ['All', ...Array.from(new Set((skills || []).map((s) => s.category || 'General')))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : (skills || []).filter((s) => (s.category || 'General') === selectedCategory);

  // Separate flagship project from other projects for a perfectly balanced layout
  const flagshipProject = projects && projects.length > 0 ? projects[0] : null;
  const gridProjects = projects && projects.length > 1 ? projects.slice(1) : [];

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-text-primary selection:bg-accent/30 selection:text-white relative bg-grid-pattern">
      {/* Ambient Lighting Cones */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-mid" />

      <AIOfflineIndicator />

      {/* Floating Precision Navigation */}
      <Navbar
        profileName={profile?.name}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Experience Stream */}
      <main className="max-w-[1400px] mx-auto px-3.5 xs:px-5 sm:px-8 lg:px-12 xl:px-14 pt-24 xs:pt-28 sm:pt-32 md:pt-40 pb-16 xs:pb-20 sm:pb-24 md:pb-32 flex-grow space-y-16 xs:space-y-20 sm:space-y-24 md:space-y-32 lg:space-y-36 relative z-10 w-full overflow-x-hidden">

        {/* ======================================================== */}
        {/* 1. HERO SECTION — PROFESSIONAL EDITORIAL SHOWCASE        */}
        {/* ======================================================== */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-10 lg:gap-14 xl:gap-16 items-center min-h-[calc(100vh-140px)] scroll-mt-28 py-4 xs:py-6 lg:py-12">

          {/* Left Editorial Narrative */}
          <div className="lg:col-span-7 space-y-4 xs:space-y-5 sm:space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 xs:gap-2.5 px-3 xs:px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-[11px] xs:text-xs font-sans text-accent shadow-xs">
              <span className="w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-semibold tracking-wider uppercase">Software Developer • CSE</span>
            </div>

            {/* Oversized Typographic Statement with Responsive Fluid Clamp */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-[clamp(1.75rem,5.2vw+0.5rem,4.5rem)] font-black tracking-tight leading-[1.08] break-words">
                Hi, I&apos;m <span className="gradient-heading">{profile?.name || 'DHAMODHARAN R'}</span>.
                <br />
                <span className="gradient-accent text-[clamp(1.25rem,3.6vw+0.3rem,3.25rem)] font-extrabold block mt-1.5 xs:mt-2 sm:mt-3">
                  Building Intelligent Systems.
                </span>
              </h1>
            </div>

            {/* Narrative Bio */}
            <p className="text-xs xs:text-sm sm:text-base lg:text-lg leading-relaxed text-text-secondary max-w-2xl font-normal">
              {profile?.bio || 'I am a motivated Computer Science student learning Full Stack Development, with practical experience in IoT-based projects like smart monitoring systems. I build innovative solutions combining software and physical hardware to solve real-world challenges.'}
            </p>

            {/* Telemetry Highlight Chips — 2x2 Grid on Mobile, 4-col on Tablet & Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-surface text-center shadow-xs">
                <span className="font-sans font-black text-lg xs:text-xl sm:text-2xl text-accent block tracking-tight">
                  {skills.length > 0 ? `${skills.length}+` : '35+'}
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] uppercase font-sans font-semibold tracking-wider text-text-muted mt-0.5 sm:mt-1 block">Tech & Skills</span>
              </div>
              <div className="p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-surface text-center shadow-xs">
                <span className="font-sans font-black text-lg xs:text-xl sm:text-2xl text-sky-400 block tracking-tight">
                  {projects.length > 0 ? `${projects.length}` : '9'}
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] uppercase font-sans font-semibold tracking-wider text-text-muted mt-0.5 sm:mt-1 block">Projects Built</span>
              </div>
              <div className="p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-surface text-center shadow-xs">
                <span className="font-sans font-black text-lg xs:text-xl sm:text-2xl text-emerald-400 block tracking-tight">9.05</span>
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] uppercase font-sans font-semibold tracking-wider text-text-muted mt-0.5 sm:mt-1 block">B.Tech CGPA</span>
              </div>
              <div className="p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-surface text-center shadow-xs">
                <span className="font-sans font-black text-lg xs:text-xl sm:text-2xl text-purple-400 block tracking-tight">
                  {achievements.length > 0 ? `${achievements.length}` : '12'}
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] uppercase font-sans font-semibold tracking-wider text-text-muted mt-0.5 sm:mt-1 block">Hackathons & Wins</span>
              </div>
            </div>

            {/* Quick Actions & Social Dock — Stacked on small mobile, row on tablet/desktop */}
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 xs:gap-3 sm:gap-4 pt-1 sm:pt-2">
              <a
                href="#projects"
                className="btn-primary text-xs xs:text-sm py-2.5 xs:py-3 px-5 sm:px-6 rounded-xl font-semibold shadow-md justify-center"
              >
                <span>View Projects</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>

              {profile?.resume && (
                <a
                  href={getUploadUrl(profile.resume)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs xs:text-sm py-2.5 xs:py-3 px-5 sm:px-6 rounded-xl font-semibold justify-center"
                >
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Resume</span>
                </a>
              )}

              {/* Connected Social Nodes */}
              <div className="flex items-center gap-2 pt-2 xs:pt-0 justify-center xs:justify-start">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border-subtle bg-bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent hover:scale-105 transition-all shadow-sm"
                    title="GitHub Profile"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border-subtle bg-bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent hover:scale-105 transition-all shadow-sm"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border-subtle bg-bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent hover:scale-105 transition-all shadow-sm"
                    title="Email Direct"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Professional Developer Dossier Card — Intelligently Centered on Mobile/Tablet */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-md xl:max-w-lg glass-panel p-4 xs:p-5 sm:p-6 lg:p-7 space-y-3.5 xs:space-y-4 sm:space-y-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-border-subtle bg-bg-surface/90 mx-auto lg:mr-0">

              {/* Profile Image with Proportional Aspect Ratio */}
              <div className="relative aspect-[4/4.5] w-full max-h-[340px] xs:max-h-[420px] sm:max-h-[500px] rounded-xl sm:rounded-2xl overflow-hidden border border-border-subtle bg-bg-elevated group">
                {profile?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getUploadUrl(profile.image)}
                    alt={profile.name || "Dhamodharan R"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-4xl sm:text-5xl text-text-muted gap-2">
                    <span>👨‍💻</span>
                    <span className="font-sans text-xs sm:text-sm font-medium text-text-muted">Dhamodharan R</span>
                  </div>
                )}
              </div>

              {/* Developer Metadata */}
              <div className="space-y-2 border-t border-border-subtle pt-3 sm:pt-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm xs:text-base sm:text-lg text-text-primary font-sans truncate">{profile?.name || 'DHAMODHARAN R'}</h3>
                    <p className="text-[11px] xs:text-xs sm:text-sm text-accent font-semibold font-sans truncate">{profile?.title || 'SOFTWARE DEVELOPER & AI/ML ENGINEER'}</p>
                  </div>
                  <span className="font-sans font-semibold text-[10px] sm:text-xs text-text-muted px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-bg-elevated border border-border-subtle shrink-0">
                    CSE
                  </span>
                </div>

                <div className="space-y-1.5 font-sans text-[11px] xs:text-xs sm:text-sm pt-0.5">
                  <div className="flex items-center justify-between text-text-secondary gap-2">
                    <span className="text-text-muted font-medium shrink-0">FOCUS:</span>
                    <span className="text-text-primary font-medium truncate">Software Dev, AI/ML & IoT</span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary gap-2">
                    <span className="text-text-muted font-medium shrink-0">LOCATION:</span>
                    <span className="text-text-primary font-medium truncate">{profile?.location || 'Pondicherry, India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. CORE ARCHITECTURAL PILLARS & TECH MATRIX              */}
        {/* ======================================================== */}
        <section id="skills" className="space-y-6 sm:space-y-8 lg:space-y-10 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 xs:gap-4">
            <div>
              <span className="tech-badge">TECHNICAL EXPERTISE</span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-text-primary mt-2">
                Engineering Stack & Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Authentic toolchains, languages, and frameworks applied across software and physical systems.
              </p>
            </div>

            {/* Category Filter Pills — Fluid wrapping & touch-friendly */}
            <div className="flex flex-wrap gap-1 xs:gap-1.5 p-1 xs:p-1.5 rounded-xl bg-bg-surface border border-border-subtle shadow-xs self-start md:self-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 xs:px-3 sm:px-3.5 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Core Pillar Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <div className="bento-card p-4 xs:p-5 sm:p-6 lg:p-7 space-y-3 sm:space-y-3.5 bg-gradient-to-b from-bg-surface to-bg-elevated/40">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <span className="font-mono text-sm sm:text-base font-bold">&lt;/&gt;</span>
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-text-primary">Low-Level & DSA Architecture</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Strong foundations in C, C++, Java, and Data Structures. Focused on time-space optimization, algorithm design, and computational efficiency.
              </p>
              <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">C</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">C++</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Java</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">DSA</span>
              </div>
            </div>

            <div className="bento-card p-4 xs:p-5 sm:p-6 lg:p-7 space-y-3 sm:space-y-3.5 bg-gradient-to-b from-bg-surface to-bg-elevated/40">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <span className="font-sans text-sm sm:text-base font-bold">🧠</span>
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-text-primary">AI/ML & Software Engineering</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Applied Machine Learning algorithms, data science with Pandas & NumPy, predictive modeling, and responsive database-backed software systems.
              </p>
              <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Python</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Pandas</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">NumPy</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">MySQL</span>
              </div>
            </div>

            <div className="bento-card p-4 xs:p-5 sm:p-6 lg:p-7 space-y-3 sm:space-y-3.5 bg-gradient-to-b from-bg-surface to-bg-elevated/40">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <span className="font-sans text-sm sm:text-base font-bold">📡</span>
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-text-primary">Cyber-Physical & IoT Systems</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Connecting physical hardware with software logic. Practical telemetry implementations in vehicle safety, water cleaning, and attendance systems.
              </p>
              <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Microcontrollers</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Sensors</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Telemetry</span>
                <span className="px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-md text-[10px] xs:text-[11px] font-sans font-medium bg-bg-surface border border-border-subtle text-text-secondary">Automation</span>
              </div>
            </div>
          </div>

          {/* Interactive Technology Matrix with Mobile-to-Desktop Adaptive Grid */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 xs:gap-3 sm:gap-4">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill._id || skill.id}
                  className="skill-card group cursor-default p-2.5 xs:p-3 sm:p-4"
                >
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-125">
                    <TechnologyLogo name={skill.name} className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9" />
                  </div>
                  <h4 className="text-[11px] xs:text-xs font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors font-sans truncate w-full text-center">
                    {skill.name}
                  </h4>
                  <span className="font-sans text-[10px] xs:text-[11px] text-text-muted mt-0.5 font-medium truncate w-full text-center">
                    {skill.category || 'Technology'}
                  </span>

                  {/* Subtle Proficiency Bar */}
                  {skill.percentage && (
                    <div className="w-full mt-2 sm:mt-3 bg-bg-elevated rounded-full h-1 overflow-hidden border border-border-subtle">
                      <div
                        className="bg-gradient-to-r from-accent to-accent-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted font-sans col-span-full py-8 text-center font-medium">
                No technologies found in category: {selectedCategory}
              </p>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. SELECTED WORKS — BALANCED EDITORIAL GALLERY            */}
        {/* ======================================================== */}
        <section id="projects" className="space-y-6 sm:space-y-8 scroll-mt-28">
          <div>
            <span className="tech-badge">PROJECT ARCHITECTURES</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-text-primary mt-2">
              Featured Projects & Systems
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Handcrafted IoT architectures, software platforms, and department utilities.
            </p>
          </div>

          <div className="space-y-4 xs:space-y-6 lg:space-y-8">

            {/* FLAGSHIP HERO PROJECT FEATURE */}
            {flagshipProject && (
              <div
                onClick={() => setSelectedProject(flagshipProject)}
                className="bento-card p-4 xs:p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-5 xs:gap-6 lg:gap-10 xl:gap-12 items-center cursor-pointer group bg-gradient-to-br from-bg-surface via-bg-surface to-accent/5"
              >
                {/* Media Showcase */}
                <div className="lg:col-span-6 h-48 xs:h-60 sm:h-80 lg:h-[380px] rounded-xl sm:rounded-2xl overflow-hidden border border-border-subtle bg-bg-elevated relative group-hover:border-accent/40 transition-all">
                  {flagshipProject.imageUrls?.[0] || flagshipProject.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getUploadUrl(flagshipProject.imageUrls?.[0] || flagshipProject.imageUrl)}
                      alt={flagshipProject.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted text-xs xs:text-sm font-sans space-y-2">
                      <span className="text-3xl xs:text-4xl">🛰️</span>
                      <span className="font-semibold tracking-wider text-[11px] xs:text-xs">SYS-01 // FLAGSHIP ARCHITECTURE</span>
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 xs:top-3 xs:left-3 px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-md bg-bg-main/80 backdrop-blur-md border border-white/10 font-sans text-[9px] xs:text-[10px] text-accent font-bold uppercase tracking-wider">
                    FLAGSHIP SYSTEM
                  </div>
                </div>

                {/* Narrative & Details */}
                <div className="lg:col-span-6 space-y-3 xs:space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[11px] xs:text-xs text-accent font-bold">SYS-01</span>
                    <span className="text-text-muted">•</span>
                    <span className="text-[11px] xs:text-xs text-emerald-500 font-sans font-semibold">IoT & Embedded Architecture</span>
                  </div>

                  <h3 className="text-xl xs:text-2xl sm:text-3xl font-black text-text-primary group-hover:text-accent transition-colors">
                    {flagshipProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 xs:line-clamp-4">
                    {flagshipProject.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {flagshipProject.techStack?.map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 xs:px-2.5 py-0.5 xs:py-1 text-[10px] xs:text-[11px] font-sans rounded-md bg-bg-elevated border border-border-subtle text-text-secondary font-medium uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Direct Actions */}
                  <div className="flex flex-wrap items-center gap-3 xs:gap-4 pt-2 text-xs font-semibold">
                    {flagshipProject.githubUrl && (
                      <a
                        href={flagshipProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-text-primary hover:text-accent flex items-center gap-1.5 transition-colors font-sans"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                        <span>Source Code</span>
                      </a>
                    )}
                    {flagshipProject.demoUrl && (
                      <a
                        href={flagshipProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent hover:underline flex items-center gap-1 transition-colors font-sans"
                      >
                        <span>Live Experience</span>
                        <span>↗</span>
                      </a>
                    )}
                    <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors ml-auto flex items-center gap-1 font-sans font-semibold">
                      <span>VIEW DETAILS</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BALANCED 2-COLUMN PROJECT GRID (SYMMETRICAL ALIGNMENT) */}
            {gridProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {gridProjects.map((proj, idx) => (
                  <div
                    key={proj._id || proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className="bento-card p-4 xs:p-5 sm:p-7 space-y-3.5 xs:space-y-4 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail */}
                      <div className="h-40 xs:h-48 rounded-xl overflow-hidden border border-border-subtle bg-bg-elevated relative">
                        {proj.imageUrls?.[0] || proj.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={getUploadUrl(proj.imageUrls?.[0] || proj.imageUrl)}
                            alt={proj.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-sans font-semibold">
                            <span>SYS-0{idx + 2}</span>
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-bg-main/80 backdrop-blur-md border border-white/10 font-sans text-[9px] text-text-muted font-medium">
                          SYS-0{idx + 2}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-base xs:text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 mt-1.5">
                          {proj.description}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.techStack?.map((tech, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 text-[10px] font-sans font-medium rounded bg-bg-elevated border border-border-subtle text-text-secondary uppercase">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-xs">
                      <span className="font-sans font-semibold text-xs text-accent">INSPECT ARCHITECTURE</span>
                      <span className="text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CAREER & ACADEMICS — BLUEPRINT ROADMAP                */}
        {/* ======================================================== */}
        <section id="experience" className="space-y-6 sm:space-y-8 scroll-mt-28">
          <div>
            <span className="tech-badge">CHRONOLOGY</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-text-primary mt-2">
              Career Experience & Education
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Academic progression and professional work milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xs:gap-6 lg:gap-8 items-start">

            {/* Experience Track */}
            <div className="space-y-3.5 xs:space-y-4 flex flex-col">
              <div className="flex items-center gap-2 pb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-text-muted">Work Experience</h3>
              </div>

              {experience.length > 0 ? (
                experience.map((exp) => (
                  <div
                    key={exp._id || exp.id}
                    onClick={() => setSelectedExperience(exp)}
                    className="bento-card p-4 xs:p-5 sm:p-7 space-y-3 xs:space-y-3.5 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-1 xs:gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm xs:text-base sm:text-lg font-bold text-text-primary group-hover:text-accent transition-colors font-sans break-words">{exp.role}</h4>
                          <p className="text-xs sm:text-sm text-accent font-semibold mt-0.5 font-sans truncate">{exp.company}</p>
                        </div>
                        <span className="text-[10px] xs:text-[10.5px] sm:text-xs font-sans font-medium text-text-muted shrink-0 self-start bg-bg-elevated px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border border-border-subtle">
                          {exp.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 xs:line-clamp-4 mt-2.5 sm:mt-3 font-sans">{exp.description}</p>
                    </div>
                    <span className="text-xs font-sans font-semibold text-accent pt-3 border-t border-border-subtle block">VIEW RECORD DETAILS →</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-text-muted font-sans p-4 border border-border-subtle rounded-xl">No work experience entries recorded.</p>
              )}
            </div>

            {/* Education Track */}
            <div id="education" className="space-y-3.5 xs:space-y-4 flex flex-col scroll-mt-28">
              <div className="flex items-center gap-2 pb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-text-muted">Academic Degrees</h3>
              </div>

              {education.length > 0 ? (
                education.map((edu) => (
                  <div
                    key={edu._id || edu.id}
                    onClick={() => setSelectedEducation(edu)}
                    className="bento-card p-4 xs:p-5 sm:p-7 space-y-3 xs:space-y-3.5 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-1 xs:gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm xs:text-base sm:text-lg font-bold text-text-primary group-hover:text-accent transition-colors font-sans break-words">{edu.degree}</h4>
                          <p className="text-xs sm:text-sm text-accent font-semibold mt-0.5 font-sans truncate">{edu.institution}</p>
                        </div>
                        <span className="text-[10px] xs:text-[10.5px] sm:text-xs font-sans font-medium text-text-muted shrink-0 self-start bg-bg-elevated px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border border-border-subtle">
                          {edu.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 xs:line-clamp-4 mt-2.5 sm:mt-3 font-sans">{edu.description}</p>
                    </div>
                    <span className="text-xs font-sans font-semibold text-accent pt-3 border-t border-border-subtle block">VIEW ACADEMIC DETAILS →</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-text-muted font-sans p-4 border border-border-subtle rounded-xl">No academic history recorded.</p>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. CERTIFICATIONS — DEDICATED SEPARATE SESSION           */}
        {/* ======================================================== */}
        <section id="certifications" className="space-y-6 sm:space-y-8 scroll-mt-28">
          <div>
            <span className="tech-badge">QUALIFICATIONS</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-text-primary mt-2">
              Certifications & Qualifications
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Verified industry-recognized credentials and professional technical certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {certifications.map((cert) => (
              <div
                key={cert._id || cert.id}
                onClick={() => setSelectedCertification(cert)}
                className="bento-card p-3.5 xs:p-4 sm:p-5 flex gap-3 sm:gap-4.5 items-start cursor-pointer group hover:border-accent/40"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-lg sm:text-xl text-blue-500">
                  🎖️
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[10px] xs:text-[11px] sm:text-xs font-medium text-text-muted">{cert.date}</span>
                    <span className="text-[11px] xs:text-xs font-sans font-semibold text-accent group-hover:translate-x-0.5 transition-transform">Details →</span>
                  </div>
                  <h4 className="text-xs xs:text-sm sm:text-base font-bold text-text-primary truncate group-hover:text-accent transition-colors mt-0.5 font-sans">
                    {cert.title}
                  </h4>
                  <p className="text-[11px] xs:text-xs sm:text-sm text-text-secondary mt-0.5 font-medium font-sans truncate">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. ACHIEVEMENTS — DEDICATED SEPARATE SESSION             */}
        {/* ======================================================== */}
        <section id="achievements" className="space-y-6 sm:space-y-8 scroll-mt-28">
          <div>
            <span className="tech-badge">HONORS & AWARDS</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-text-primary mt-2">
              Key Achievements & Milestones
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Hackathon selections, inter-college paper presentation wins, and project expo recognitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {achievements.map((ach) => (
              <div
                key={ach._id || ach.id}
                onClick={() => setSelectedAchievement(ach)}
                className="bento-card p-3.5 xs:p-4 sm:p-5 flex gap-3 sm:gap-4.5 items-start cursor-pointer group hover:border-amber-500/40"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-lg sm:text-xl text-amber-500">
                  🏆
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[10px] xs:text-[11px] sm:text-xs text-amber-500 font-semibold">{ach.date || 'Milestone'}</span>
                    <span className="text-[11px] xs:text-xs font-sans font-semibold text-amber-500 group-hover:translate-x-0.5 transition-transform">Details →</span>
                  </div>
                  <h4 className="text-xs xs:text-sm sm:text-base font-bold text-text-primary truncate group-hover:text-amber-500 transition-colors mt-0.5 font-sans">
                    {ach.title}
                  </h4>
                  <p className="text-[11px] xs:text-xs sm:text-sm text-text-secondary mt-0.5 font-medium font-sans truncate">{ach.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. AI RESUME FIT COMMAND STATION                         */}
        {/* ======================================================== */}
        <section id="resume-analyzer" className="bento-card p-4 xs:p-6 sm:p-10 lg:p-12 space-y-5 sm:space-y-8 scroll-mt-28 border-accent/20 bg-gradient-to-b from-bg-surface via-bg-surface to-accent/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border-subtle pb-5 sm:pb-6">
            <div>
              <span className="tech-badge">AI RECRUITMENT INTELLIGENCE & EVALUATION</span>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-text-primary mt-2">
                Job Fit & Hireability Intelligence Suite
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
                Assess job role hireability capability against verified profile data, run side-by-side candidate comparison, or conduct comprehensive ATS resume telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2 font-sans text-[11px] sm:text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 xs:px-3.5 py-1.5 rounded-full border border-emerald-500/20 self-start sm:self-auto shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI TELEMETRY READY</span>
            </div>
          </div>

          <ResumeAnalyzer />
        </section>

        {/* ======================================================== */}
        {/* 8. GET IN TOUCH — COMMUNICATION CONSOLE                  */}
        {/* ======================================================== */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 scroll-mt-28 items-start">

          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div>
              <span className="tech-badge">DIRECT CHANNELS</span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-text-primary mt-2">
                Let&apos;s Connect & Build
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                Reach out for software development positions, IoT engineering collaborations, or technical discussions.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-3.5 pt-1">
              {profile?.email && (
                <div className="bento-card p-3.5 xs:p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 hover:border-accent/40 transition-colors">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-500 text-base sm:text-lg">
                    ✉
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-sans font-semibold text-[10px] tracking-wider text-text-muted block uppercase">PRIMARY EMAIL</span>
                    <a href={`mailto:${profile.email}`} className="text-xs sm:text-sm font-bold text-text-primary hover:text-accent transition-colors truncate block font-sans">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.linkedin && (
                <div className="bento-card p-3.5 xs:p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 hover:border-accent/40 transition-colors">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 text-sky-500 text-base sm:text-lg">
                    💼
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-sans font-semibold text-[10px] tracking-wider text-text-muted block uppercase">LINKEDIN NETWORK</span>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-bold text-text-primary hover:text-accent transition-colors truncate block font-sans">
                      Connect on LinkedIn ↗
                    </a>
                  </div>
                </div>
              )}

              {profile?.github && (
                <div className="bento-card p-3.5 xs:p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 hover:border-accent/40 transition-colors">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-500 text-base sm:text-lg">
                    ⌘
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-sans font-semibold text-[10px] tracking-wider text-text-muted block uppercase">GITHUB REPOSITORIES</span>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-bold text-text-primary hover:text-accent transition-colors truncate block font-sans">
                      Explore GitHub Repositories ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel bento-card p-4 xs:p-6 sm:p-8 lg:p-10">
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Cyber Minimalist Footer */}
      <footer className="border-t border-border-subtle bg-bg-surface/80 backdrop-blur-md py-8 sm:py-10 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
            <p className="font-sans font-medium text-[11px] sm:text-xs">© {new Date().getFullYear()} {profile?.name || 'DHAMODHARAN R'}. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 xs:gap-4 sm:gap-6 font-sans font-medium text-[10.5px] xs:text-[11px] sm:text-xs tracking-wide">
            <a href="#about" className="hover:text-text-primary transition-colors">ABOUT</a>
            <a href="#skills" className="hover:text-text-primary transition-colors">STACK</a>
            <a href="#projects" className="hover:text-text-primary transition-colors">WORKS</a>
            <a href="#experience" className="hover:text-text-primary transition-colors">CAREER</a>
            <a href="#certifications" className="hover:text-text-primary transition-colors">CERTS</a>
            <a href="#achievements" className="hover:text-text-primary transition-colors">AWARDS</a>
            <a href="#contact" className="hover:text-text-primary transition-colors">CONTACT</a>
          </div>
        </div>
      </footer>

      {/* Assistant Launcher */}
      <AIChatbotWidget />

      {/* Interactive Detail & Project Modals */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onImageClick={(src, alt) => setLightboxImage({ src, alt })}
        />
      )}

      {selectedExperience && (
        <DetailModal
          item={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onImageClick={(src, alt) => setLightboxImage({ src, alt })}
          type="experience"
        />
      )}

      {selectedEducation && (
        <DetailModal
          item={selectedEducation}
          onClose={() => setSelectedEducation(null)}
          onImageClick={(src, alt) => setLightboxImage({ src, alt })}
          type="education"
        />
      )}

      {selectedCertification && (
        <DetailModal
          item={selectedCertification}
          onClose={() => setSelectedCertification(null)}
          onImageClick={(src, alt) => setLightboxImage({ src, alt })}
          type="certification"
        />
      )}

      {selectedAchievement && (
        <DetailModal
          item={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          onImageClick={(src, alt) => setLightboxImage({ src, alt })}
          type="achievement"
        />
      )}

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
