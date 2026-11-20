'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { apiFetch, getUploadUrl } from '../lib/api';
import { getSocket } from '../lib/socket';
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  // Sync the DOM class with initial darkMode state (no setState needed)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Fetch portfolio data and setup Socket.io
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount is a legitimate pattern
    fetchPortfolioData();

    const socket = getSocket();
    if (socket) {
      socket.connect();
      socket.on('portfolio_updated', (event) => {
        console.log('Real-time updates received:', event);
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background text-foreground space-y-4">
        <svg className="animate-spin h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-semibold tracking-wider opacity-85">Loading Portfolio Context...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-background text-foreground min-h-screen">
        <div className="max-w-md w-full p-6 text-center rounded-2xl glass-panel border border-rose-500/20">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
          <h2 className="text-lg font-bold mb-2 font-display">Server Connection Error</h2>
          <p className="text-sm text-foreground/75 mb-6">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchPortfolioData(); }}
            className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { profile, skills, projects, achievements, experience, education, certifications } = portfolio;
  
  // Group skills by category
  const skillsByCategory = (skills || []).reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col grid-backdrop relative overflow-hidden">
      {/* Background Ambient Glow Blobs for Glassmorphism */}
      <div className="glow-blob top-[10%] left-[5%] w-72 h-72 bg-accent/30" />
      <div className="glow-blob top-[35%] right-[5%] w-96 h-96 bg-purple-500/20" />
      <div className="glow-blob top-[60%] left-[10%] w-80 h-80 bg-fuchsia-500/20" />
      <div className="glow-blob bottom-[10%] right-[10%] w-96 h-96 bg-accent/20" />

      <AIOfflineIndicator />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-card-border/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight text-accent font-display">
            {profile?.name || 'Developer'}.
          </a>
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-foreground/80">
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
            <a href="#experience" className="hover:text-accent transition-colors">Experience</a>
            <a href="#education" className="hover:text-accent transition-colors">Education</a>
            <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
            <a href="#certifications" className="hover:text-accent transition-colors">Certifications</a>
            <a href="#achievements" className="hover:text-accent transition-colors">Achievements</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-card-border/30 border border-card-border text-foreground transition-all cursor-pointer"
              aria-label="Toggle dark/light theme"
            >
              {darkMode ? (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.070 0l-7.07 7.07z" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <a
              href="#contact"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-md shadow-accent/15"
            >
              Hire Me
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex-grow space-y-24 md:space-y-36">
        
        {/* HERO SECTION */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/15 text-accent text-xs font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>Available for Freelance & Contract</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display">
              Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-500">{profile?.name || 'Dhamodharan'}</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold opacity-90 tracking-wide font-display">
              {profile?.title || 'Full-Stack AI Developer'}
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 max-w-xl mx-auto md:mx-0">
              {profile?.bio || 'I build intelligent web applications, integrating modern frontend designs with advanced backend and AI solutions.'}
            </p>
            
            {/* Social Links & Resume Action */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              {profile?.resume && (
                <a
                  href={getUploadUrl(profile.resume)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors shadow-lg flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Resume
                </a>
              )}
              <div className="flex items-center gap-3">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-card-border hover:border-accent hover:text-accent transition-colors bg-card"
                    title="GitHub Profile"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-card-border hover:border-accent hover:text-accent transition-colors bg-card"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-3 rounded-xl border border-card-border hover:border-accent hover:text-accent transition-colors bg-card"
                    title="Send Email"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Avatar Graphic */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center p-2 border-4 border-white dark:border-[#3a1d5c] bg-white dark:bg-[#1a0b2e] shadow-2xl animate-float">
              {profile?.image ? (
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-black/50 border border-black/5 dark:border-white/10">
                  <img
                    src={getUploadUrl(profile.image)}
                    alt={profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent to-indigo-600/30 flex items-center justify-center text-8xl shadow-md border border-card-border">
                  💻
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Technical Expertise</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              A comprehensive view of languages, frameworks, and database architectures I actively utilize.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(skillsByCategory).length > 0 ? (
              Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="p-6 rounded-2xl glass-panel space-y-6">
                  <h3 className="text-base font-bold text-accent uppercase tracking-wider font-display border-b border-card-border pb-2.5">
                    {category}
                  </h3>
                  <div className="space-y-5">
                    {items.map((skill) => (
                      <div key={skill._id || skill.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>{skill.name}</span>
                          <span className="opacity-80 text-xs">{skill.percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-card-border/30 overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center md:col-span-3 text-sm text-foreground/60 py-10">No skills added yet.</p>
            )}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Featured Projects</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Explore custom systems merging advanced client capabilities with server services and AI APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div 
                  key={proj._id || proj.id} 
                  className="flex flex-col rounded-2xl glass-card overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedProject(proj)}
                >
                  <div className="h-48 bg-gradient-to-br from-accent/20 to-indigo-500/20 border-b border-card-border flex items-center justify-center overflow-hidden relative">
                    {proj.imageUrls?.[0] || proj.imageUrl ? (
                      <img
                        src={getUploadUrl(proj.imageUrls?.[0] || proj.imageUrl)}
                        alt={proj.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2 flex flex-col items-center">
                        <span className="text-5xl opacity-60 transition-transform duration-500 group-hover:scale-110">🚀</span>
                        <div className="text-xs font-semibold text-accent/80 tracking-wider uppercase font-display">{proj.title}</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold font-display">{proj.title}</h3>
                      <p className="text-sm text-foreground/75 leading-relaxed">{proj.description}</p>
                      
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {proj.techStack?.map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-lg bg-card-border/30 border border-card-border text-foreground/85 uppercase">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold pt-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-accent transition-colors"
                        >
                          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          Code
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-accent transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center md:col-span-2 text-sm text-foreground/60 py-10">No projects added yet.</p>
            )}
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Work Experience</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Internships, contract roles, and professional employment.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {experience.length > 0 ? (
              experience.map((exp) => (
                <div 
                  key={exp._id || exp.id} 
                  className="p-6 rounded-2xl border border-card-border bg-card hover:bg-card-border/10 transition-all duration-300 shadow-sm flex flex-col sm:flex-row gap-5 items-start cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-accent/50 group"
                  onClick={() => setSelectedExperience(exp)}
                >
                  {exp.imageUrls?.[0] || exp.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-card-border">
                      <img src={getUploadUrl(exp.imageUrls?.[0] || exp.imageUrl)} alt={exp.company} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-accent/15 border border-accent/20 text-accent flex items-center justify-center shrink-0 text-3xl font-display font-bold">
                      💼
                    </div>
                  )}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
                      <div>
                        <h3 className="text-lg font-bold font-display">{exp.role}</h3>
                        <p className="text-sm font-semibold opacity-85 text-accent">{exp.company}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/15 text-accent text-xs font-semibold self-start sm:self-center">
                        {exp.date}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-1 whitespace-pre-line line-clamp-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      {exp.githubUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                          Project Link
                        </span>
                      )}
                      {exp.reportUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Attached File
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-foreground/60 py-6">No experience listed.</p>
            )}
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Education</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Academic credentials and qualifications.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {education.length > 0 ? (
              education.map((edu) => (
                <div 
                  key={edu._id || edu.id} 
                  className="p-6 rounded-2xl border border-card-border bg-card hover:bg-card-border/10 transition-all duration-300 shadow-sm flex flex-col sm:flex-row gap-5 items-start cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/50 group"
                  onClick={() => setSelectedEducation(edu)}
                >
                  {edu.imageUrls?.[0] || edu.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-card-border">
                      <img src={getUploadUrl(edu.imageUrls?.[0] || edu.imageUrl)} alt={edu.institution} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 text-3xl font-display font-bold">
                      🎓
                    </div>
                  )}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
                      <div>
                        <h3 className="text-lg font-bold font-display">{edu.degree}</h3>
                        <p className="text-sm font-semibold opacity-85 text-indigo-505 text-indigo-500">{edu.institution}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-indigo-500 text-xs font-semibold self-start sm:self-center">
                        {edu.date}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-1 whitespace-pre-line line-clamp-3">{edu.description}</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      {edu.githubUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:underline">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                          Academic Link
                        </span>
                      )}
                      {edu.reportUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Attached File
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-foreground/60 py-6">No education details listed.</p>
            )}
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Certifications</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Verifications of technical expertise and workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <div 
                  key={cert._id || cert.id} 
                  className="p-6 rounded-2xl border border-card-border bg-card hover:bg-card-border/10 transition-all duration-300 shadow-sm flex gap-4 items-start cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-teal-500/50 group"
                  onClick={() => setSelectedCertification(cert)}
                >
                  {cert.imageUrls?.[0] || cert.imageUrl ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-card-border">
                      <img src={getUploadUrl(cert.imageUrls?.[0] || cert.imageUrl)} alt={cert.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-teal-500/15 border border-teal-500/20 text-teal-500 flex items-center justify-center shrink-0 text-2xl font-bold">
                      🎖️
                    </div>
                  )}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">{cert.date}</span>
                    <h3 className="text-base font-bold font-display leading-tight truncate">{cert.title}</h3>
                    <p className="text-xs font-semibold opacity-75">{cert.issuer}</p>
                    {cert.description && (
                      <p className="text-xs text-foreground/75 leading-relaxed pt-1.5 line-clamp-3">{cert.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-2">
                      {cert.githubUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-500 hover:underline">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                          Credential Link
                        </span>
                      )}
                      {cert.reportUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Attached File
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-foreground/60 py-6 md:col-span-2">No certifications listed.</p>
            )}
          </div>
        </section>

        {/* ACHIEVEMENTS TIMELINE */}
        <section id="achievements" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Milestones & Achievements</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Timeline credentials, awards, hackathons, and certifications.
            </p>
          </div>

          <div className="max-w-3xl mx-auto border-l-2 border-card-border/80 pl-6 space-y-10 relative">
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach._id || ach.id} className="relative space-y-2">
                  <span className="absolute -left-[31px] top-1.5 block w-4.5 h-4.5 rounded-full bg-accent border-4 border-background" />
                  
                  <div 
                    className="p-6 rounded-2xl border border-card-border bg-card space-y-3 shadow-sm hover:bg-card-border/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-accent/50 group"
                    onClick={() => setSelectedAchievement(ach)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
                      <div>
                        <span className="text-xs font-bold text-accent tracking-wider uppercase">{ach.date || 'Award'}</span>
                        <h3 className="text-base font-bold font-display">{ach.title}</h3>
                        <p className="text-xs font-semibold opacity-75">{ach.issuer}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center">
                        {ach.githubUrl && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline self-start sm:self-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                            Project Link
                          </span>
                        )}
                        {ach.reportUrl && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline self-start sm:self-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            Attached File
                          </span>
                        )}
                      </div>
                    </div>
                    {ach.description && (
                      <p className="text-sm text-foreground/75 leading-relaxed pt-2 border-t border-card-border/30">{ach.description}</p>
                    )}
                    {(ach.imageUrls?.[0] || ach.imageUrl) && (
                      <div className="w-full max-w-md h-48 rounded-xl overflow-hidden bg-white/5 border border-card-border relative mt-2">
                        <img src={getUploadUrl(ach.imageUrls?.[0] || ach.imageUrl)} alt={ach.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground/60 pl-2">No achievements added yet.</p>
            )}
          </div>
        </section>

        {/* RESUME ANALYZER */}
        <section id="resume-analyzer" className="p-8 rounded-2xl glass-panel space-y-6 scroll-mt-24">
          <div className="max-w-lg space-y-2">
            <h2 className="text-2xl font-bold font-display tracking-tight">AI Resume Fit Analyzer</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Curious how your credentials compare to {profile?.name || 'Dhamodharan'}&apos;s level? Upload your resume to receive an automated analysis report and a list of key skills gaps.
            </p>
          </div>
          <ResumeAnalyzer />
        </section>

        {/* CONTACT FORM */}
        <section id="contact" className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 scroll-mt-24">
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Let&apos;s Connect</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Have a contract, job query, or project idea? Submit your inquiry here, or reach out directly via email or social portals.
            </p>
            <div className="space-y-4 pt-4 text-sm font-medium">
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-card-border text-accent flex items-center justify-center">📧</div>
                  <div>
                    <div className="text-xs opacity-75 font-semibold uppercase tracking-wider">Direct Email</div>
                    <a href={`mailto:${profile.email}`} className="text-sm hover:underline">{profile.email}</a>
                  </div>
                </div>
              )}
              {profile?.linkedin && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-card-border text-accent flex items-center justify-center">💼</div>
                  <div>
                    <div className="text-xs opacity-75 font-semibold uppercase tracking-wider">LinkedIn Professional</div>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Connect on LinkedIn</a>
                  </div>
                </div>
              )}
              {profile?.github && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-card-border text-accent flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 font-semibold uppercase tracking-wider">GitHub Portfolio</div>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">View Repositories</a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-7 p-6 md:p-8 rounded-2xl glass-panel">
            <ContactForm />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-card-border bg-card/45 py-8 mt-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs opacity-80 gap-4">
          <p>© {new Date().getFullYear()} {profile?.name || 'Dhamodharan'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
            <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
          </div>
        </div>
      </footer>

      {/* FLOATING BOT WIDGET */}
      <AIChatbotWidget />

      {/* MODALS */}
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
