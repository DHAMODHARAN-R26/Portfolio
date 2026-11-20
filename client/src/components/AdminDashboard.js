'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch, getUploadUrl, getApiUrl } from '../lib/api';
import { getSocket } from '../lib/socket';

export default function AdminDashboard() {
  const formatFileName = (url) => {
    if (!url) return '';
    const filename = url.split('/').pop();
    const match = filename.match(/^\w+-\d+-\d+-(.+)$/);
    return match ? match[1] : filename;
  };
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };
  const removeFile = (formSetter, field, index) => {
    formSetter(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '', image: '', resume: '', github: '', linkedin: '', email: ''
  });
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Notification states
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [inboxAlert, setInboxAlert] = useState(null);

  // CRUD Form states
  const [skillForm, setSkillForm] = useState({ id: null, name: '', category: 'Frontend', percentage: 80 });
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  
  // API Keys state
  const [apiKeysForm, setApiKeysForm] = useState({ geminiKey: '', openaiKey: '' });
  const [apiKeysLoading, setApiKeysLoading] = useState(false);
  const [projectForm, setProjectForm] = useState({ id: null, title: '', description: '', techStack: '', githubUrl: '', demoUrl: '', imageUrl: '', reportUrl: '', imageUrls: [], reportUrls: [] });
  const [achievementForm, setAchievementForm] = useState({ id: null, title: '', issuer: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '', imageUrls: [], reportUrls: [] });
  const [experienceForm, setExperienceForm] = useState({ id: null, role: '', company: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '', imageUrls: [], reportUrls: [] });
  const [educationForm, setEducationForm] = useState({ id: null, degree: '', institution: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '', imageUrls: [], reportUrls: [] });
  const [certificationForm, setCertificationForm] = useState({ id: null, title: '', issuer: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '', imageUrls: [], reportUrls: [] });

  // Modal open states
  const [skillModal, setSkillModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [achievementModal, setAchievementModal] = useState(false);
  const [experienceModal, setExperienceModal] = useState(false);
  const [educationModal, setEducationModal] = useState(false);
  const [certificationModal, setCertificationModal] = useState(false);

  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const projectCoverInputRef = useRef(null);
  const projectReportInputRef = useRef(null);
  const achievementReportInputRef = useRef(null);
  const experienceReportInputRef = useRef(null);
  const educationReportInputRef = useRef(null);
  const certificationReportInputRef = useRef(null);

  const experienceImgRef = useRef(null);
  const educationImgRef = useRef(null);
  const certificationImgRef = useRef(null);

  // Status Alerts
  const [status, setStatus] = useState({ type: '', message: '' });
  const [enhancing, setEnhancing] = useState(false);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const fetchMessages = useCallback(async () => {
    try {
      const msgs = await apiFetch('/api/portfolio/contacts');
      setMessages(msgs || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await apiFetch('/api/portfolio/data');
      if (data.profile) setProfile(data.profile);
      if (data.skills) setSkills(data.skills);
      if (data.projects) setProjects(data.projects);
      if (data.achievements) setAchievements(data.achievements);
      if (data.experience) setExperience(data.experience);
      if (data.education) setEducation(data.education);
      if (data.certifications) setCertifications(data.certifications);
      fetchMessages();
    } catch (err) {
      showStatus('error', 'Failed to load portfolio dashboard details.');
    }
  }, [fetchMessages]);

  // Check login on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          await apiFetch('/api/auth/verify');
          setIsAuthenticated(true);
          fetchDashboardData();
        } catch (err) {
          console.error('Session verification failed:', err);
          localStorage.removeItem('admin_token');
        }
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [fetchDashboardData]);

  // Socket.io Real-time inbox handler
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (socket) {
      socket.connect();
      socket.on('new_contact_message', (data) => {
        console.log('Real-time message received:', data);
        setUnreadMsgCount((c) => c + 1);
        setInboxAlert('New contact message received!');
        fetchMessages();
      });
    }

    return () => {
      if (socket) {
        socket.off('new_contact_message');
        socket.disconnect();
      }
    };
  }, [isAuthenticated, fetchMessages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoginLoading(true);
    setAuthError('');

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });

      localStorage.setItem('admin_token', data.token);
      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showStatus('error', 'New passwords do not match.');
    }
    if (passwordForm.newPassword.length < 4) {
      return showStatus('error', 'New password must be at least 4 characters long.');
    }

    setPasswordChangeLoading(true);
    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      showStatus('success', 'Admin passcode changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showStatus('error', err.message || 'Failed to change passcode.');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleApiKeysUpdate = async (e) => {
    e.preventDefault();
    setApiKeysLoading(true);
    try {
      await apiFetch('/api/auth/api-keys', {
        method: 'POST',
        body: JSON.stringify(apiKeysForm)
      });
      showStatus('success', 'API Keys saved successfully.');
      setApiKeysForm({ geminiKey: '', openaiKey: '' }); // Clear fields after save for security
    } catch (err) {
      showStatus('error', err.message || 'Failed to save API keys.');
    } finally {
      setApiKeysLoading(false);
    }
  };



  // ==========================================
  // Profile Handlers
  // ==========================================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/portfolio/profile', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      showStatus('success', 'Profile updated successfully.');
    } catch (err) {
      showStatus('error', 'Failed to update profile context.');
    }
  };

  const handleProfileEnhance = async () => {
    if (!profile.bio) return;
    setEnhancing(true);
    try {
      const data = await apiFetch('/api/ai/enhance', {
        method: 'POST',
        body: JSON.stringify({ text: profile.bio, field: 'biography' })
      });
      setProfile({ ...profile, bio: data.enhanced });
      showStatus('success', 'Biography enhanced using AI copywriter.');
    } catch (err) {
      showStatus('error', 'AI Copypolish service failed.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      if (type === 'avatar') {
        setProfile({ ...profile, image: data.fileUrl });
      } else if (type === 'resume') {
        setProfile({ ...profile, resume: data.fileUrl });
      }
      showStatus('success', `${type === 'avatar' ? 'Image' : 'Resume'} uploaded successfully.`);
    } catch (err) {
      showStatus('error', err.message || 'Upload operation failed.');
    }
  };

  // ==========================================
  // Skills CRUD Handlers
  // ==========================================
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      if (skillForm.id) {
        // Update
        const updated = await apiFetch(`/api/portfolio/skills/${skillForm.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: skillForm.name,
            category: skillForm.category,
            percentage: Number(skillForm.percentage)
          })
        });
        setSkills(skills.map(s => s.id === skillForm.id ? updated.data : s));
        showStatus('success', 'Skill updated successfully.');
      } else {
        // Create
        const created = await apiFetch('/api/portfolio/skills', {
          method: 'POST',
          body: JSON.stringify({
            name: skillForm.name,
            category: skillForm.category,
            percentage: Number(skillForm.percentage)
          })
        });
        setSkills([...skills, created.data]);
        showStatus('success', 'Skill created successfully.');
      }
      setSkillModal(false);
    } catch (err) {
      showStatus('error', 'Failed to save skill details.');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await apiFetch(`/api/portfolio/skills/${id}`, { method: 'DELETE' });
      setSkills(skills.filter(s => s.id !== id));
      showStatus('success', 'Skill deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete skill.');
    }
  };

  // ==========================================
  // Projects CRUD Handlers
  // ==========================================
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const formatted = {
      ...projectForm,
      techStack: typeof projectForm.techStack === 'string' 
        ? projectForm.techStack.split(',').map(s => s.trim()) 
        : projectForm.techStack
    };

    try {
      if (projectForm.id) {
        const updated = await apiFetch(`/api/portfolio/projects/${projectForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(formatted)
        });
        setProjects(projects.map(p => p.id === projectForm.id ? updated.data : p));
        showStatus('success', 'Project updated successfully.');
      } else {
        const created = await apiFetch('/api/portfolio/projects', {
          method: 'POST',
          body: JSON.stringify(formatted)
        });
        setProjects([...projects, created.data]);
        showStatus('success', 'Project created successfully.');
      }
      setProjectModal(false);
    } catch (err) {
      showStatus('error', 'Failed to save project.');
    }
  };

  const handleProjectCoverUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch(getApiUrl('/api/upload/multiple'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cover upload failed');

      setProjectForm({ 
        ...projectForm, 
        imageUrls: [...(projectForm.imageUrls || []), ...data.fileUrls],
        imageUrl: data.fileUrls[0] || projectForm.imageUrl 
      });
      showStatus('success', 'Project images uploaded.');
    } catch (err) {
      showStatus('error', err.message);
    }
  };

  const handleProjectReportUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch(getApiUrl('/api/upload/multiple'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Report upload failed');

      setProjectForm({ 
        ...projectForm, 
        reportUrls: [...(projectForm.reportUrls || []), ...data.fileUrls],
        reportUrl: data.fileUrls[0] || projectForm.reportUrl
      });
      showStatus('success', 'Project reports uploaded.');
    } catch (err) {
      showStatus('error', err.message);
    }
  };

  // Generic section image uploader
  const handleSectionImageUpload = async (e, setForm, currentForm) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    try {
      const res = await fetch(getApiUrl('/api/upload/multiple'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm({ 
        ...currentForm, 
        imageUrls: [...(currentForm.imageUrls || []), ...data.fileUrls],
        imageUrl: data.fileUrls[0] || currentForm.imageUrl 
      });
      showStatus('success', 'Images uploaded successfully.');
    } catch (err) {
      showStatus('error', err.message || 'Image upload failed.');
    }
  };

  // Generic section report uploader
  const handleSectionReportUpload = async (e, setForm, currentForm) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    try {
      const res = await fetch(getApiUrl('/api/upload/multiple'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Report upload failed');
      setForm({ 
        ...currentForm, 
        reportUrls: [...(currentForm.reportUrls || []), ...data.fileUrls],
        reportUrl: data.fileUrls[0] || currentForm.reportUrl 
      });
      showStatus('success', 'Reports attached successfully.');
    } catch (err) {
      showStatus('error', err.message || 'Report upload failed.');
    }
  };

  const handleProjectEnhance = async () => {
    if (!projectForm.description) return;
    setEnhancing(true);
    try {
      const data = await apiFetch('/api/ai/enhance', {
        method: 'POST',
        body: JSON.stringify({ text: projectForm.description, field: 'project description' })
      });
      setProjectForm({ ...projectForm, description: data.enhanced });
      showStatus('success', 'Description enhanced via AI.');
    } catch (err) {
      showStatus('error', 'Enhancement failed.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await apiFetch(`/api/portfolio/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
      showStatus('success', 'Project deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete project.');
    }
  };

  // ==========================================
  // Achievements CRUD Handlers
  // ==========================================
  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    try {
      if (achievementForm.id) {
        const updated = await apiFetch(`/api/portfolio/achievements/${achievementForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(achievementForm)
        });
        setAchievements(achievements.map(a => a.id === achievementForm.id ? updated.data : a));
        showStatus('success', 'Milestone updated.');
      } else {
        const created = await apiFetch('/api/portfolio/achievements', {
          method: 'POST',
          body: JSON.stringify(achievementForm)
        });
        setAchievements([...achievements, created.data]);
        showStatus('success', 'Milestone added.');
      }
      setAchievementModal(false);
    } catch (err) {
      showStatus('error', 'Failed to save milestone.');
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await apiFetch(`/api/portfolio/achievements/${id}`, { method: 'DELETE' });
      setAchievements(achievements.filter(a => a.id !== id));
      showStatus('success', 'Milestone deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete milestone.');
    }
  };

  // ==========================================
  // Experience CRUD Handlers
  // ==========================================
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    try {
      if (experienceForm.id) {
        const updated = await apiFetch(`/api/portfolio/experience/${experienceForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(experienceForm)
        });
        setExperience(experience.map(x => x.id === experienceForm.id ? updated.data : x));
        showStatus('success', 'Experience updated.');
      } else {
        const created = await apiFetch('/api/portfolio/experience', {
          method: 'POST',
          body: JSON.stringify(experienceForm)
        });
        setExperience([...experience, created.data]);
        showStatus('success', 'Experience added.');
      }
      setExperienceModal(false);
    } catch (err) {
      showStatus('error', 'Failed to save experience.');
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await apiFetch(`/api/portfolio/experience/${id}`, { method: 'DELETE' });
      setExperience(experience.filter(x => x.id !== id));
      showStatus('success', 'Experience deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete experience.');
    }
  };

  // ==========================================
  // Education CRUD Handlers
  // ==========================================
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    try {
      if (educationForm.id) {
        const updated = await apiFetch(`/api/portfolio/education/${educationForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(educationForm)
        });
        setEducation(education.map(x => x.id === educationForm.id ? updated.data : x));
        showStatus('success', 'Education updated.');
      } else {
        const created = await apiFetch('/api/portfolio/education', {
          method: 'POST',
          body: JSON.stringify(educationForm)
        });
        setEducation([...education, created.data]);
        showStatus('success', 'Education added.');
      }
      setEducationModal(false);
    } catch (err) {
      showStatus('error', 'Failed to save education.');
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      await apiFetch(`/api/portfolio/education/${id}`, { method: 'DELETE' });
      setEducation(education.filter(x => x.id !== id));
      showStatus('success', 'Education deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete education.');
    }
  };

  // ==========================================
  // Certifications CRUD Handlers
  // ==========================================
  const handleSaveCertification = async (e) => {
    e.preventDefault();
    try {
      if (certificationForm.id) {
        const updated = await apiFetch(`/api/portfolio/certifications/${certificationForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(certificationForm)
        });
        setCertifications(certifications.map(x => x.id === certificationForm.id ? updated.data : x));
        showStatus('success', 'Certification updated.');
      } else {
        const created = await apiFetch('/api/portfolio/certifications', {
          method: 'POST',
          body: JSON.stringify(certificationForm)
        });
        setCertifications([...certifications, created.data]);
        showStatus('success', 'Certification added.');
      }
      setCertificationModal(false);
    } catch (err) {
      showStatus('error', 'Failed to save certification.');
    }
  };

  const handleDeleteCertification = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await apiFetch(`/api/portfolio/certifications/${id}`, { method: 'DELETE' });
      setCertifications(certifications.filter(x => x.id !== id));
      showStatus('success', 'Certification deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete certification.');
    }
  };

  // ==========================================
  // Messages Handlers
  // ==========================================
  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await apiFetch(`/api/portfolio/contacts/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
      showStatus('success', 'Message deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete message.');
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background">
        <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  // LOGIN PANEL WALL
  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-background min-h-screen grid-backdrop">
        <div className="max-w-md w-full p-8 rounded-2xl glass-panel border border-card-border shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-bold font-display tracking-tight">Admin Gate</h1>
            <p className="text-xs text-foreground/60">Enter the administration passcode to manage details.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl">
                {authError}
              </div>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin passcode..."
              disabled={loginLoading}
              required
              className="w-full px-4 py-3 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all text-center"
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-md shadow-accent/15 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loginLoading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground grid-backdrop">
      
      {/* Header bar */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-card-border/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛠️</span>
            <span className="font-bold text-sm uppercase tracking-wider font-display">Portfolio Workspace</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/15 text-accent font-semibold uppercase">Admin Mode</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl hover:bg-card-border/30 border border-card-border text-foreground transition-all cursor-pointer"
              aria-label="Toggle dark/light theme"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.070 0l-7.07 7.07z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link href="/" className="text-xs hover:text-accent font-semibold hover:underline">View Portfolio</Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl border border-card-border bg-card hover:bg-rose-500/10 hover:text-rose-500 text-xs font-semibold transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex-grow w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-2.5">
          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-medium">
            <button
              onClick={() => { setActiveTab('profile'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>👤</span> Profile Context
            </button>
            <button
              onClick={() => { setActiveTab('skills'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>📊</span> Technical Skills
            </button>
            <button
              onClick={() => { setActiveTab('projects'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>🚀</span> Project Grid
            </button>
            <button
              onClick={() => { setActiveTab('achievements'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>🏆</span> Milestone Timeline
            </button>
            <button
              onClick={() => { setActiveTab('experience'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>💼</span> Work Experience
            </button>
            <button
              onClick={() => { setActiveTab('education'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>🎓</span> Education
            </button>
            <button
              onClick={() => { setActiveTab('certifications'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'certifications'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>🎖️</span> Certifications
            </button>
            <button
              onClick={() => { setActiveTab('messages'); setUnreadMsgCount(0); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center justify-between border cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>✉️</span> Inbox Logs
              </span>
              {unreadMsgCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                  {unreadMsgCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setInboxAlert(null); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-sm transition-all shrink-0 md:shrink flex items-center gap-2.5 border cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                  : 'bg-card border-card-border hover:bg-card-border/20'
              }`}
            >
              <span>⚙️</span> Admin Settings
            </button>
          </nav>
        </aside>

        {/* Dynamic Display Panel */}
        <section className="md:col-span-3 space-y-6">
          {/* Status Banners */}
          {status.message && (
            <div className={`p-4 rounded-xl border text-sm transition-all ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {status.message}
            </div>
          )}

          {inboxAlert && (
            <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-sm flex items-center justify-between animate-glow">
              <span>✉️ {inboxAlert}</span>
              <button onClick={() => setInboxAlert(null)} className="text-xs font-semibold hover:underline">Dismiss</button>
            </div>
          )}

          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel border border-card-border space-y-6">
              <div className="border-b border-card-border pb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold font-display">Edit Profile Context</h2>
                <button
                  type="button"
                  onClick={handleProfileEnhance}
                  disabled={enhancing || !profile.bio}
                  className="px-3.5 py-1.5 rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent hover:text-white text-xs font-semibold text-accent transition-all flex items-center gap-1 cursor-pointer disabled:opacity-55"
                >
                  {enhancing ? 'Enhancing...' : '🪄 AI Enhance Bio'}
                </button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Job Title</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Biography Description</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">GitHub URL</label>
                    <input
                      type="url"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">LinkedIn URL</label>
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* File Uploads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-card-border bg-card/30 rounded-xl mt-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Profile Photo</label>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'avatar')}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      {profile.image && (
                        <img src={getUploadUrl(profile.image)} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#3a1d5c] bg-white" />
                      )}
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current.click()}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-card border border-card-border hover:bg-card-border/30 cursor-pointer"
                      >
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Resume PDF</label>
                    <input
                      type="file"
                      ref={resumeInputRef}
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'resume')}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      {profile.resume && (
                        <div className="text-xl">📄</div>
                      )}
                      <button
                        type="button"
                        onClick={() => resumeInputRef.current.click()}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-card border border-card-border hover:bg-card-border/30 cursor-pointer"
                      >
                        Upload Resume PDF
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-md shadow-accent/15 cursor-pointer mt-6"
                >
                  Save Profile Context
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: TECHNICAL SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display">Technical Skills ({skills.length})</h2>
                <button
                  onClick={() => {
                    setSkillForm({ id: null, name: '', category: 'Frontend', percentage: 80 });
                    setSkillModal(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer transition-colors"
                >
                  + Add New Skill
                </button>
              </div>

              {/* Skills List Table */}
              <div className="rounded-2xl glass-panel border border-card-border overflow-hidden">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-card-border bg-card/65 font-semibold text-xs uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Proficiency</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/40">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-card-border/10">
                          <td className="p-4 font-semibold">{skill.name}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-card-border/40 border border-card-border text-foreground/80 uppercase">
                              {skill.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 rounded-full bg-card-border/30 overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: `${skill.percentage}%` }} />
                              </div>
                              <span className="text-xs font-medium">{skill.percentage}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSkillForm(skill);
                                setSkillModal(true);
                              }}
                              className="text-accent hover:underline text-xs font-semibold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-rose-500 hover:underline text-xs font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-foreground/50 text-xs">No technical skills added yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT GRID */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display">Projects Workspace ({projects.length})</h2>
                <button
                  onClick={() => {
                    setProjectForm({ id: null, title: '', description: '', techStack: '', githubUrl: '', demoUrl: '', imageUrl: '', reportUrl: '' });
                    setProjectModal(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer transition-colors"
                >
                  + Add Project Card
                </button>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.length > 0 ? (
                  projects.map((proj) => (
                    <div key={proj.id} className="p-5 rounded-2xl glass-panel border border-card-border flex flex-col justify-between space-y-4 shadow-sm">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-bold text-sm tracking-wide font-display truncate">{proj.title}</h3>
                          {proj.imageUrl && (
                            <img src={getUploadUrl(proj.imageUrl)} alt={proj.title} className="w-12 h-10 object-cover rounded-lg border-2 border-white dark:border-[#3a1d5c] bg-white" />
                          )}
                        </div>
                        <p className="text-xs text-foreground/75 line-clamp-3">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {proj.techStack?.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 text-[9px] font-semibold bg-card-border/40 rounded border border-card-border uppercase">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-card-border/50 text-xs">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setProjectForm({
                                ...proj,
                                techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack
                              });
                              setProjectModal(true);
                            }}
                            className="text-accent hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-rose-500 hover:underline font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                        <span className="text-[10px] text-foreground/50">ID: {proj.id}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground/50 py-10 md:col-span-2 text-center">No projects in list. Create one to display.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MILESTONE TIMELINE */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display">Timeline Credentials ({achievements.length})</h2>
                <button
                  onClick={() => {
                    setAchievementForm({ id: null, title: '', issuer: '', date: '', description: '', reportUrl: '' });
                    setAchievementModal(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer transition-colors"
                >
                  + Add Milestone Card
                </button>
              </div>

              {/* Milestone list rows */}
              <div className="space-y-3">
                {achievements.length > 0 ? (
                  achievements.map((ach) => (
                    <div key={ach.id} className="p-4 rounded-xl border border-card-border bg-card/40 flex items-start justify-between shadow-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-accent tracking-wider uppercase">{ach.date}</span>
                          <span className="text-foreground/40 text-xs">|</span>
                          <span className="text-xs font-semibold opacity-75">{ach.issuer}</span>
                        </div>
                        <h4 className="font-bold text-sm font-display">{ach.title}</h4>
                        {ach.description && <p className="text-xs text-foreground/75 leading-relaxed pt-1.5">{ach.description}</p>}
                      </div>
                      <div className="flex gap-3 text-xs shrink-0 pl-4">
                        <button
                          onClick={() => {
                            setAchievementForm(ach);
                            setAchievementModal(true);
                          }}
                          className="text-accent hover:underline font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAchievement(ach.id)}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground/50 py-10 pl-2">No timeline achievements defined yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display">Work Experience ({experience.length})</h2>
                <button
                  onClick={() => {
                    setExperienceForm({ id: null, role: '', company: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '' });
                    setExperienceModal(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer transition-colors"
                >
                  + Add Experience
                </button>
              </div>
              <div className="space-y-3">
                {experience.length > 0 ? (
                  experience.map((exp) => (
                    <div key={exp.id} className="p-5 rounded-2xl glass-panel border border-card-border flex items-start justify-between shadow-sm gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-accent tracking-wider uppercase">{exp.date}</span>
                          <span className="text-foreground/40 text-xs">|</span>
                          <span className="text-xs font-semibold opacity-75">{exp.company}</span>
                        </div>
                        <h4 className="font-bold text-sm font-display">{exp.role}</h4>
                        {exp.description && <p className="text-xs text-foreground/75 leading-relaxed pt-1 line-clamp-2">{exp.description}</p>}
                        {exp.githubUrl && <a href={exp.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">GitHub Link</a>}
                      </div>
                      <div className="flex gap-3 text-xs shrink-0">
                        <button onClick={() => { setExperienceForm(exp); setExperienceModal(true); }} className="text-accent hover:underline font-semibold cursor-pointer">Edit</button>
                        <button onClick={() => handleDeleteExperience(exp.id)} className="text-rose-500 hover:underline font-semibold cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground/50 py-10">No work experience added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display">Education ({education.length})</h2>
                <button
                  onClick={() => {
                    setEducationForm({ id: null, degree: '', institution: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '' });
                    setEducationModal(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer transition-colors"
                >
                  + Add Education
                </button>
              </div>
              <div className="space-y-3">
                {education.length > 0 ? (
                  education.map((edu) => (
                    <div key={edu.id} className="p-5 rounded-2xl glass-panel border border-card-border flex items-start justify-between shadow-sm gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-indigo-500 tracking-wider uppercase">{edu.date}</span>
                          <span className="text-foreground/40 text-xs">|</span>
                          <span className="text-xs font-semibold opacity-75">{edu.institution}</span>
                        </div>
                        <h4 className="font-bold text-sm font-display">{edu.degree}</h4>
                        {edu.description && <p className="text-xs text-foreground/75 leading-relaxed pt-1 line-clamp-2">{edu.description}</p>}
                        {edu.githubUrl && <a href={edu.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline">GitHub Link</a>}
                      </div>
                      <div className="flex gap-3 text-xs shrink-0">
                        <button onClick={() => { setEducationForm(edu); setEducationModal(true); }} className="text-accent hover:underline font-semibold cursor-pointer">Edit</button>
                        <button onClick={() => handleDeleteEducation(edu.id)} className="text-rose-500 hover:underline font-semibold cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground/50 py-10">No education entries added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display">Certifications ({certifications.length})</h2>
                <button
                  onClick={() => {
                    setCertificationForm({ id: null, title: '', issuer: '', date: '', description: '', imageUrl: '', githubUrl: '', reportUrl: '' });
                    setCertificationModal(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer transition-colors"
                >
                  + Add Certification
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certifications.length > 0 ? (
                  certifications.map((cert) => (
                    <div key={cert.id} className="p-5 rounded-2xl glass-panel border border-card-border shadow-sm space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-teal-500 tracking-wider uppercase">{cert.date}</span>
                          <h4 className="font-bold text-sm font-display truncate">{cert.title}</h4>
                          <p className="text-xs font-semibold opacity-75">{cert.issuer}</p>
                          {cert.description && <p className="text-xs text-foreground/75 leading-relaxed pt-1 line-clamp-2">{cert.description}</p>}
                          {cert.githubUrl && <a href={cert.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-500 hover:underline">Credential Link</a>}
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs pt-1 border-t border-card-border/40">
                        <button onClick={() => { setCertificationForm(cert); setCertificationModal(true); }} className="text-accent hover:underline font-semibold cursor-pointer">Edit</button>
                        <button onClick={() => handleDeleteCertification(cert.id)} className="text-rose-500 hover:underline font-semibold cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground/50 py-10 md:col-span-2">No certifications added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INBOX LOGS */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display">Inquiry Inbox ({messages.length})</h2>
              
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-5 rounded-2xl glass-panel border border-card-border space-y-3 shadow-sm">
                      <div className="flex items-start justify-between border-b border-card-border/60 pb-2.5">
                        <div>
                          <h4 className="font-bold text-sm font-display">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-xs text-accent hover:underline font-medium">{msg.email}</a>
                        </div>
                        <div className="text-right space-y-1 shrink-0">
                          <span className="block text-[10px] text-foreground/50 font-medium">{new Date(msg.createdAt).toLocaleString()}</span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-rose-500 hover:underline text-xs font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold opacity-75 uppercase tracking-wider">Subject: {msg.subject || '(None)'}</div>
                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line bg-background/35 p-3 rounded-lg border border-card-border/30">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 border border-card-border bg-card/25 rounded-2xl">
                    <span className="text-4xl block mb-2">📥</span>
                    <p className="text-xs text-foreground/50">Inbox is empty. No messages submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel border border-card-border space-y-6">
              <div className="border-b border-card-border pb-3">
                <h2 className="text-xl font-bold font-display">Security Settings</h2>
                <p className="text-xs text-foreground/60 mt-1">Update your admin dashboard access passcode.</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Current Passcode</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">New Passcode</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Confirm New Passcode</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordChangeLoading}
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-md shadow-accent/15 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {passwordChangeLoading ? 'Updating...' : 'Update Passcode'}
                </button>
              </form>

              <div className="border-t border-card-border pt-6 mt-6">
                <h2 className="text-xl font-bold font-display">AI Provider Integration</h2>
                <p className="text-xs text-foreground/60 mt-1">Configure your API keys to enable the AI Chatbot, Resume Analyzer, and AI Enhancements. Keys are saved securely to the server environment.</p>
              </div>

              <form onSubmit={handleApiKeysUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKeysForm.geminiKey}
                    onChange={(e) => setApiKeysForm({ ...apiKeysForm, geminiKey: e.target.value })}
                    placeholder="Enter new Gemini API Key..."
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">OpenAI API Key (Optional)</label>
                  <input
                    type="password"
                    value={apiKeysForm.openaiKey}
                    onChange={(e) => setApiKeysForm({ ...apiKeysForm, openaiKey: e.target.value })}
                    placeholder="Enter new OpenAI API Key..."
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={apiKeysLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all shadow-md shadow-indigo-500/15 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {apiKeysLoading ? 'Saving...' : 'Save API Keys'}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>

      {/* ========================================================================= */}
      {/* CRUD POPUP MODALS */}
      {/* ========================================================================= */}

      {/* Skill Modal */}
      {skillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-card-border shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold font-display">{skillForm.id ? 'Edit Skill' : 'Create New Skill'}</h3>
            <form onSubmit={handleSaveSkill} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Skill Title</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                  placeholder="e.g. Next.js"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Proficiency ({skillForm.percentage}%)</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={skillForm.percentage}
                    onChange={(e) => setSkillForm({ ...skillForm, percentage: e.target.value })}
                    className="w-full h-8 accent-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSkillModal(false)}
                  className="px-4 py-2 rounded-xl border border-card-border hover:bg-card-border/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {projectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full p-6 rounded-2xl glass-panel border border-card-border shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-card-border pb-2">
              <h3 className="text-lg font-bold font-display">{projectForm.id ? 'Edit Project Card' : 'Add Project Card'}</h3>
              <button
                type="button"
                onClick={handleProjectEnhance}
                disabled={enhancing || !projectForm.description}
                className="px-2.5 py-1.5 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent hover:text-white text-[10px] font-semibold text-accent transition-all cursor-pointer disabled:opacity-55"
              >
                {enhancing ? 'Enhancing...' : '🪄 AI Enhance Description'}
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Project Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                    placeholder="e.g. Chat Engine"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                    required
                    placeholder="React, Node.js, Socket.io"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://demo.com"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
              </div>

              {/* Cover image uploader */}
              <div className="p-4 border border-card-border bg-card/20 rounded-xl">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Project Cover Image</label>
                <input
                  type="file" multiple
                  ref={projectCoverInputRef}
                  accept="image/*"
                  onChange={handleProjectCoverUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => projectCoverInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-card-border hover:bg-card-border/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>📁</span> Upload Cover
                  </button>
                </div>
                {( projectForm.imageUrls?.length > 0 ? projectForm.imageUrls : projectForm.imageUrl ? [projectForm.imageUrl] : [] ).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-foreground/70 mb-2">Uploaded Images:</p>
                    <div className="flex flex-wrap gap-3">
                      {( projectForm.imageUrls?.length > 0 ? projectForm.imageUrls : projectForm.imageUrl ? [projectForm.imageUrl] : [] ).map((url, idx) => (
                        <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-card-border shadow-sm">
                          <img src={getUploadUrl(url)} alt="Upload preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeFile(setProjectForm, 'imageUrls', idx)}
                              className="p-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md transform hover:scale-110 transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Report file uploader */}
              <div className="p-4 border border-card-border bg-card/20 rounded-xl">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Project Report / Presentation (Optional)</label>
                <input
                  type="file" multiple
                  ref={projectReportInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleProjectReportUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => projectReportInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-card-border hover:bg-card-border/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>📎</span> Attach File
                  </button>
                </div>
                {( projectForm.reportUrls?.length > 0 ? projectForm.reportUrls : projectForm.reportUrl ? [projectForm.reportUrl] : [] ).length > 0 && (
                  <div className="flex flex-col gap-2 mt-3">
                    <p className="text-xs font-semibold text-foreground/70">Attached Reports:</p>
                    {( projectForm.reportUrls?.length > 0 ? projectForm.reportUrls : projectForm.reportUrl ? [projectForm.reportUrl] : [] ).map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-card-border">
                        <span className="text-[11px] truncate max-w-[200px] text-foreground text-emerald-500 font-medium">
                          {formatFileName(url)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(setProjectForm, 'reportUrls', idx)}
                          className="p-1 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setProjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-card-border hover:bg-card-border/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {achievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-card-border shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold font-display">{achievementForm.id ? 'Edit Milestone' : 'Add Timeline Milestone'}</h3>
            <form onSubmit={handleSaveAchievement} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Credential/Title</label>
                <input
                  type="text"
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  required
                  placeholder="e.g. Lead AI Hackathon Winner"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Issuer/Organization</label>
                  <input
                    type="text"
                    value={achievementForm.issuer}
                    onChange={(e) => setAchievementForm({ ...achievementForm, issuer: e.target.value })}
                    required
                    placeholder="e.g. DevPost"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Year/Date</label>
                  <input
                    type="text"
                    value={achievementForm.date}
                    onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                    required
                    placeholder="e.g. 2025"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={achievementForm.description}
                  onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent resize-y"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Image URL (optional)</label>
                  <input
                    type="text"
                    value={achievementForm.imageUrl || ''}
                    onChange={(e) => setAchievementForm({ ...achievementForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">GitHub / Proof URL</label>
                  <input
                    type="text"
                    value={achievementForm.githubUrl || ''}
                    onChange={(e) => setAchievementForm({ ...achievementForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent"
                  />
                </div>
              </div>

              {/* Report file uploader */}
              <div className="p-4 border border-card-border bg-card/20 rounded-xl mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Attached Document / Certificate (Optional)</label>
                <input
                  type="file" multiple
                  ref={achievementReportInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleSectionReportUpload(e, setAchievementForm, achievementForm)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => achievementReportInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-card-border hover:bg-card-border/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>📎</span> Attach File
                  </button>
                </div>
                {( achievementForm.reportUrls?.length > 0 ? achievementForm.reportUrls : achievementForm.reportUrl ? [achievementForm.reportUrl] : [] ).length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    <p className="text-xs font-semibold text-foreground/70">Attached Reports:</p>
                    {( achievementForm.reportUrls?.length > 0 ? achievementForm.reportUrls : achievementForm.reportUrl ? [achievementForm.reportUrl] : [] ).map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-card-border w-full">
                        <span className="text-[11px] truncate max-w-[200px] text-foreground text-emerald-500 font-medium">
                          {formatFileName(url)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(setAchievementForm, 'reportUrls', idx)}
                          className="p-1 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAchievementModal(false)}
                  className="px-4 py-2 rounded-xl border border-card-border hover:bg-card-border/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EXPERIENCE MODAL */}
      {experienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card rounded-2xl border border-card-border p-6 shadow-2xl space-y-5 my-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display">{experienceForm.id ? 'Edit Experience' : 'Add Experience'}</h3>
              <button type="button" onClick={() => setExperienceModal(false)} className="text-foreground/50 hover:text-foreground text-xl cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSaveExperience} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Company Logo / Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-card-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                    {experienceForm.imageUrl
                      ? <img src={getUploadUrl(experienceForm.imageUrl)} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-2xl">💼</span>}
                  </div>
                  <div className="space-y-1 flex-1">
                    <button type="button" onClick={() => experienceImgRef.current?.click()} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-card-border hover:bg-accent/10 hover:border-accent cursor-pointer transition-colors">📁 Upload Image</button>
                    <p className="text-[10px] text-foreground/50">PNG, JPG up to 5MB. Or paste a URL below.</p>
                    <input type="text" value={experienceForm.imageUrl} onChange={(e) => setExperienceForm({ ...experienceForm, imageUrl: e.target.value })} className="w-full px-2 py-1.5 rounded-lg bg-background border border-card-border outline-none text-xs focus:border-accent" placeholder="https://... (paste image URL)" />
                  </div>
                  <input ref={experienceImgRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleSectionImageUpload(e, setExperienceForm, experienceForm)} />
                </div>
                {( experienceForm.imageUrls?.length > 0 ? experienceForm.imageUrls : experienceForm.imageUrl ? [experienceForm.imageUrl] : [] ).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-foreground/70 mb-2">Uploaded Images:</p>
                    <div className="flex flex-wrap gap-3">
                      {( experienceForm.imageUrls?.length > 0 ? experienceForm.imageUrls : experienceForm.imageUrl ? [experienceForm.imageUrl] : [] ).map((url, idx) => (
                        <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-card-border shadow-sm">
                          <img src={getUploadUrl(url)} alt="Upload preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeFile(setExperienceForm, 'imageUrls', idx)}
                              className="p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Role / Title</label>
                  <input type="text" required value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. Web Developer Intern" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Company / Organization</label>
                  <input type="text" required value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. SkillBuilder Academy" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Duration</label>
                <input type="text" value={experienceForm.date} onChange={(e) => setExperienceForm({ ...experienceForm, date: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. Dec 2025-Jan 2026" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Description</label>
                <textarea rows={4} value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent resize-y" placeholder="Describe your role and responsibilities..." />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">🔗 GitHub Repository / Project URL</label>
                <input type="text" value={experienceForm.githubUrl} onChange={(e) => setExperienceForm({ ...experienceForm, githubUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="https://github.com/your-username/repository-name" />
                <p className="text-[10px] text-foreground/50 mt-1">Paste the specific repository URL (not just your profile)</p>
              </div>
              
              {/* Report file uploader */}
              <div className="p-4 border border-card-border bg-card/20 rounded-xl mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Attached Document / Proof (Optional)</label>
                <input
                  type="file" multiple
                  ref={experienceReportInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleSectionReportUpload(e, setExperienceForm, experienceForm)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => experienceReportInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-card-border hover:bg-card-border/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>📎</span> Attach File
                  </button>
                </div>
                {( experienceForm.reportUrls?.length > 0 ? experienceForm.reportUrls : experienceForm.reportUrl ? [experienceForm.reportUrl] : [] ).length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    <p className="text-xs font-semibold text-foreground/70">Attached Reports:</p>
                    {( experienceForm.reportUrls?.length > 0 ? experienceForm.reportUrls : experienceForm.reportUrl ? [experienceForm.reportUrl] : [] ).map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-card-border w-full">
                        <span className="text-[11px] truncate max-w-[200px] text-foreground text-emerald-500 font-medium">
                          {formatFileName(url)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(setExperienceForm, 'reportUrls', idx)}
                          className="p-1 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
                <button type="button" onClick={() => setExperienceModal(false)} className="px-4 py-2 rounded-xl border border-card-border hover:bg-card-border/20 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer">Save Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {educationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card rounded-2xl border border-card-border p-6 shadow-2xl space-y-5 my-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display">{educationForm.id ? 'Edit Education' : 'Add Education'}</h3>
              <button type="button" onClick={() => setEducationModal(false)} className="text-foreground/50 hover:text-foreground text-xl cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSaveEducation} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">College / Institute Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-card-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                    {educationForm.imageUrl
                      ? <img src={getUploadUrl(educationForm.imageUrl)} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-2xl">🎓</span>}
                  </div>
                  <div className="space-y-1 flex-1">
                    <button type="button" onClick={() => educationImgRef.current?.click()} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-card-border hover:bg-accent/10 hover:border-accent cursor-pointer transition-colors">📁 Upload Image</button>
                    <p className="text-[10px] text-foreground/50">PNG, JPG up to 5MB. Or paste a URL below.</p>
                    <input type="text" value={educationForm.imageUrl} onChange={(e) => setEducationForm({ ...educationForm, imageUrl: e.target.value })} className="w-full px-2 py-1.5 rounded-lg bg-background border border-card-border outline-none text-xs focus:border-accent" placeholder="https://... (paste image URL)" />
                  </div>
                  <input ref={educationImgRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleSectionImageUpload(e, setEducationForm, educationForm)} />
                </div>
                {( educationForm.imageUrls?.length > 0 ? educationForm.imageUrls : educationForm.imageUrl ? [educationForm.imageUrl] : [] ).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-foreground/70 mb-2">Uploaded Images:</p>
                    <div className="flex flex-wrap gap-3">
                      {( educationForm.imageUrls?.length > 0 ? educationForm.imageUrls : educationForm.imageUrl ? [educationForm.imageUrl] : [] ).map((url, idx) => (
                        <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-card-border shadow-sm">
                          <img src={getUploadUrl(url)} alt="Upload preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeFile(setEducationForm, 'imageUrls', idx)}
                              className="p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Degree / Course</label>
                  <input type="text" required value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. B.Tech in CSE" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Institution</label>
                  <input type="text" required value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="College / University name" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Year / Duration</label>
                <input type="text" value={educationForm.date} onChange={(e) => setEducationForm({ ...educationForm, date: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. 2024-Present" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Details (CGPA, specialization, etc.)</label>
                <textarea rows={3} value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent resize-y" placeholder="e.g. CGPA: 9.23, specialization in AI..." />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">🔗 GitHub Repository / Related Link</label>
                <input type="text" value={educationForm.githubUrl} onChange={(e) => setEducationForm({ ...educationForm, githubUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="https://github.com/your-username/project" />
                <p className="text-[10px] text-foreground/50 mt-1">Paste a specific repository or academic project link</p>
              </div>
              
              {/* Report file uploader */}
              <div className="p-4 border border-card-border bg-card/20 rounded-xl mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Attached Document / Transcripts (Optional)</label>
                <input
                  type="file" multiple
                  ref={educationReportInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleSectionReportUpload(e, setEducationForm, educationForm)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => educationReportInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-card-border hover:bg-card-border/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>📎</span> Attach File
                  </button>
                </div>
                {( educationForm.reportUrls?.length > 0 ? educationForm.reportUrls : educationForm.reportUrl ? [educationForm.reportUrl] : [] ).length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    <p className="text-xs font-semibold text-foreground/70">Attached Reports:</p>
                    {( educationForm.reportUrls?.length > 0 ? educationForm.reportUrls : educationForm.reportUrl ? [educationForm.reportUrl] : [] ).map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-card-border w-full">
                        <span className="text-[11px] truncate max-w-[200px] text-foreground text-emerald-500 font-medium">
                          {formatFileName(url)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(setEducationForm, 'reportUrls', idx)}
                          className="p-1 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
                <button type="button" onClick={() => setEducationModal(false)} className="px-4 py-2 rounded-xl border border-card-border hover:bg-card-border/20 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer">Save Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATION MODAL */}
      {certificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card rounded-2xl border border-card-border p-6 shadow-2xl space-y-5 my-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display">{certificationForm.id ? 'Edit Certification' : 'Add Certification'}</h3>
              <button type="button" onClick={() => setCertificationModal(false)} className="text-foreground/50 hover:text-foreground text-xl cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSaveCertification} className="space-y-4">
               {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Certificate Badge / Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-card-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                    {certificationForm.imageUrl
                      ? <img src={getUploadUrl(certificationForm.imageUrl)} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-2xl">🎖️</span>}
                  </div>
                  <div className="space-y-1 flex-1">
                    <button type="button" onClick={() => certificationImgRef.current?.click()} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-card-border hover:bg-accent/10 hover:border-accent cursor-pointer transition-colors">📁 Upload Badge</button>
                    <p className="text-[10px] text-foreground/50">PNG, JPG up to 5MB. Or paste a URL below.</p>
                    <input type="text" value={certificationForm.imageUrl} onChange={(e) => setCertificationForm({ ...certificationForm, imageUrl: e.target.value })} className="w-full px-2 py-1.5 rounded-lg bg-background border border-card-border outline-none text-xs focus:border-accent" placeholder="https://... (paste badge/image URL)" />
                  </div>
                  <input ref={certificationImgRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleSectionImageUpload(e, setCertificationForm, certificationForm)} />
                </div>
                {( certificationForm.imageUrls?.length > 0 ? certificationForm.imageUrls : certificationForm.imageUrl ? [certificationForm.imageUrl] : [] ).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-foreground/70 mb-2">Uploaded Images:</p>
                    <div className="flex flex-wrap gap-3">
                      {( certificationForm.imageUrls?.length > 0 ? certificationForm.imageUrls : certificationForm.imageUrl ? [certificationForm.imageUrl] : [] ).map((url, idx) => (
                        <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-card-border shadow-sm">
                          <img src={getUploadUrl(url)} alt="Upload preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeFile(setCertificationForm, 'imageUrls', idx)}
                              className="p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Certificate Title</label>
                  <input type="text" required value={certificationForm.title} onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. Full Stack Development" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Issuing Organization</label>
                  <input type="text" required value={certificationForm.issuer} onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. CodeBuilders" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Date / Status</label>
                <input type="text" value={certificationForm.date} onChange={(e) => setCertificationForm({ ...certificationForm, date: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="e.g. 2025 or Ongoing" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Description</label>
                <textarea rows={3} value={certificationForm.description} onChange={(e) => setCertificationForm({ ...certificationForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent resize-y" placeholder="Brief description of what you learned..." />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">🔗 Credential / Verification URL</label>
                <input type="text" value={certificationForm.githubUrl} onChange={(e) => setCertificationForm({ ...certificationForm, githubUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-background border border-card-border outline-none text-sm focus:border-accent" placeholder="https://certificate-link.com/verify/your-id" />
                <p className="text-[10px] text-foreground/50 mt-1">Paste the direct credential verification or certificate link</p>
              </div>

              {/* Report file uploader */}
              <div className="p-4 border border-card-border bg-card/20 rounded-xl mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Attached Document / Certificate (Optional)</label>
                <input
                  type="file" multiple
                  ref={certificationReportInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleSectionReportUpload(e, setCertificationForm, certificationForm)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => certificationReportInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-card-border hover:bg-card-border/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>📎</span> Attach File
                  </button>
                </div>
                {( certificationForm.reportUrls?.length > 0 ? certificationForm.reportUrls : certificationForm.reportUrl ? [certificationForm.reportUrl] : [] ).length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    <p className="text-xs font-semibold text-foreground/70">Attached Reports:</p>
                    {( certificationForm.reportUrls?.length > 0 ? certificationForm.reportUrls : certificationForm.reportUrl ? [certificationForm.reportUrl] : [] ).map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-card-border w-full">
                        <span className="text-[11px] truncate max-w-[200px] text-foreground text-emerald-500 font-medium">
                          {formatFileName(url)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(setCertificationForm, 'reportUrls', idx)}
                          className="p-1 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
                <button type="button" onClick={() => setCertificationModal(false)} className="px-4 py-2 rounded-xl border border-card-border hover:bg-card-border/20 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover cursor-pointer">Save Certification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
