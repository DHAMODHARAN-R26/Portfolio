'use client';
import { useState, useRef } from 'react';
import { getApiUrl } from '../lib/api';

/**
 * Enhanced Markdown Renderer for AI evaluation reports
 */
function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-text-primary">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Primary Match Score Banner
        if (trimmed.startsWith('# MATCH SCORE:')) {
          const match = trimmed.match(/^#\s*MATCH SCORE:\s*(\d+)%\s*(?:—|-|:)?\s*(.*)/i);
          const score = match ? parseInt(match[1], 10) : null;
          const verdict = match ? match[2].trim() : trimmed.replace('# MATCH SCORE:', '').trim();

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-2 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl sm:text-2xl font-black font-mono text-accent leading-none">
                    {score !== null ? `${score}%` : 'FIT'}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-text-muted mt-0.5">SCORE</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block">
                    TELEMETRY ALIGNMENT VERDICT
                  </span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-text-primary">
                    {verdict || 'Evaluation Complete'}
                  </h3>
                </div>
              </div>

              {score !== null && (
                <div className="w-full sm:w-48 bg-bg-elevated rounded-full h-3 border border-border-subtle overflow-hidden self-center">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              )}
            </div>
          );
        }

        // Header 1: # Text
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-base sm:text-lg font-black tracking-tight text-text-primary mt-6 mb-2 border-b border-border-subtle pb-2">
              {parseBold(trimmed.substring(2))}
            </h2>
          );
        }

        // Header 2: ## Text
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-bold tracking-tight text-accent mt-5 mb-2 border-b border-border-subtle pb-1 font-sans uppercase">
              {parseBold(trimmed.substring(3))}
            </h3>
          );
        }

        // Header 3: ### Text
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary mt-4 mb-1.5 font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{parseBold(trimmed.substring(4))}</span>
            </h4>
          );
        }

        // List item: - Text or * Text
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2">
              <span className="text-accent text-xs mt-1 shrink-0">▸</span>
              <p className="flex-1 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {parseBold(trimmed.substring(2))}
              </p>
            </div>
          );
        }

        // Numbered list item: 1. Text
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2">
              <span className="text-accent font-sans text-xs font-bold min-w-[20px]">{numMatch[1]}.</span>
              <p className="flex-1 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {parseBold(numMatch[2])}
              </p>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {parseBold(line)}
          </p>
        );
      })}
    </div>
  );
}

function parseBold(text) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="font-bold text-text-primary">
          {part}
        </strong>
      );
    }
    return part;
  });
}

// Sample templates for quick recruiter/visitor test drive
const SAMPLE_JOB = {
  title: 'Full-Stack Software Engineer (IoT & Web Systems)',
  description: `We are looking for an ambitious Full-Stack Software Engineer to build resilient web architectures and connected IoT sensor dashboards. 
Key responsibilities:
- Design and engineer responsive, high-performance web applications using React, Next.js, and modern CSS.
- Build robust backend APIs (Node.js/Express) and manage relational databases (MySQL/PostgreSQL) with structured schema design.
- Integrate IoT microcontrollers (ESP32/Arduino) and environmental telemetry sensors (pH, turbidity, entry sensors) with cloud services.
- Apply algorithmic problem solving (Data Structures & Algorithms) to optimize system latency and throughput.
- Collaborate on end-to-end software delivery, automated testing, and deployment pipelines.`,
  qualifications: `• Bachelor's Degree in Computer Science, Engineering, or related technical discipline (or equivalent practical experience).
• Demonstrated competency in C/C++, JavaScript/TypeScript, Python, and SQL.
• Practical portfolio projects demonstrating full-stack development and hardware/software integration.
• Strong foundation in Data Structures, Algorithms, and Object-Oriented Design.
• Familiarity with Git version control, REST APIs, and responsive design systems.`
};

const SAMPLE_BENCHMARK_CANDIDATE = `Alex Morgan
B.S. in Computer Science (2024) — GPA: 3.7 / 4.0
Email: alex.morgan.dev@example.com | GitHub: github.com/alex-sample

TECHNICAL SKILLS:
- Languages: Python, Java, JavaScript, HTML, CSS
- Frameworks & Libraries: Django, Flask, React.js, Bootstrap
- Databases: PostgreSQL, SQLite
- Cloud & Tools: Docker, Git, Linux, Postman

EXPERIENCE:
Junior Web Developer — CloudSphere Solutions (Dec 2024 - Present)
- Developed and maintained microservices using Django REST framework and PostgreSQL.
- Implemented user authentication workflows and role-based access control.
- Created internal dashboard views in React.js for operational analytics.

ACADEMIC PROJECTS:
1. Smart Task Organizer: Full-stack productivity tool with task scheduling, tagging, and priority metrics.
2. Automated Web Scraping Pipeline: Distributed data extraction tool utilizing Python and Redis.`;

export default function ResumeAnalyzer() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('job-fit'); // 'job-fit' | 'compare' | 'review'

  // Tab 1: Job Fit State
  const [jobTitle, setJobTitle] = useState('Full-Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [useDhamoResume, setUseDhamoResume] = useState(true);
  const [customResumeFile, setCustomResumeFile] = useState(null);
  const [jobFitLoading, setJobFitLoading] = useState(false);
  const [jobFitResult, setJobFitResult] = useState('');

  // Tab 2: Comparison State
  const [candidateInputMode, setCandidateInputMode] = useState('text'); // 'text' | 'file'
  const [candidateText, setCandidateText] = useState('');
  const [candidateFile, setCandidateFile] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResult, setCompareResult] = useState('');

  // Tab 3: General Review State
  const [reviewFile, setReviewFile] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState('');

  // Shared UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // File input refs
  const customFileRef = useRef(null);
  const compareFileRef = useRef(null);
  const reviewFileRef = useRef(null);

  // Quick preset loaders
  const loadSampleJobData = () => {
    setJobTitle(SAMPLE_JOB.title);
    setJobDescription(SAMPLE_JOB.description);
    setQualifications(SAMPLE_JOB.qualifications);
    setErrorMsg('');
  };

  const loadSampleCandidateData = () => {
    setCandidateInputMode('text');
    setCandidateText(SAMPLE_BENCHMARK_CANDIDATE);
    setErrorMsg('');
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setErrorMsg('');
    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Please upload a valid PDF or TXT document.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB limit.');
      return false;
    }
    return true;
  };

  // Copy report handler
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download report handler
  const handleDownload = (text, filename = 'AI_Evaluation_Report.txt') => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // TAB 1: SUBMIT JOB FIT
  const handleRunJobFit = async () => {
    if (!jobDescription.trim()) {
      setErrorMsg('Please enter or paste the target Job Description.');
      return;
    }
    if (!useDhamoResume && !customResumeFile) {
      setErrorMsg('Please upload a candidate resume file or enable Dhamodharan\'s verified profile.');
      return;
    }

    setJobFitLoading(true);
    setErrorMsg('');
    setJobFitResult('');

    try {
      const formData = new FormData();
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);
      formData.append('qualifications', qualifications);
      formData.append('useMyResume', useDhamoResume ? 'true' : 'false');

      if (!useDhamoResume && customResumeFile) {
        formData.append('resume', customResumeFile);
      }

      const res = await fetch(getApiUrl('/api/ai/match-job'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Job match evaluation failed');
      }

      setJobFitResult(data.analysis);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to evaluate job match.');
    } finally {
      setJobFitLoading(false);
    }
  };

  // TAB 2: SUBMIT RESUME COMPARISON
  const handleRunComparison = async () => {
    if (candidateInputMode === 'text' && !candidateText.trim()) {
      setErrorMsg('Please paste Candidate B resume text or load the sample candidate.');
      return;
    }
    if (candidateInputMode === 'file' && !candidateFile) {
      setErrorMsg('Please select or upload Candidate B resume file.');
      return;
    }

    setCompareLoading(true);
    setErrorMsg('');
    setCompareResult('');

    try {
      const formData = new FormData();
      if (candidateInputMode === 'text') {
        formData.append('candidateText', candidateText);
      } else if (candidateFile) {
        formData.append('candidateResume', candidateFile);
      }

      const res = await fetch(getApiUrl('/api/ai/compare-resumes'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Resume comparison failed');
      }

      setCompareResult(data.analysis);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to compare resumes.');
    } finally {
      setCompareLoading(false);
    }
  };

  // TAB 3: SUBMIT GENERAL REVIEW
  const handleRunReview = async () => {
    if (!reviewFile) {
      setErrorMsg('Please select a resume file to analyze.');
      return;
    }

    setReviewLoading(true);
    setErrorMsg('');
    setReviewResult('');

    try {
      const formData = new FormData();
      formData.append('resume', reviewFile);

      const res = await fetch(getApiUrl('/api/ai/analyze-resume'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Resume analysis failed');
      }

      setReviewResult(data.analysis);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze resume.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. SUITE NAVIGATION TABS                                 */}
      {/* ======================================================== */}
      <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-1.5 xs:gap-2 p-1 xs:p-1.5 rounded-2xl bg-bg-elevated/70 border border-border-subtle">
        <button
          onClick={() => {
            setActiveTab('job-fit');
            setErrorMsg('');
          }}
          className={`w-full xs:w-auto flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 xs:px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
            activeTab === 'job-fit'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
          }`}
        >
          <span>🎯</span>
          <span>Job Fit & Hireability Matcher</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('compare');
            setErrorMsg('');
          }}
          className={`w-full xs:w-auto flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 xs:px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
            activeTab === 'compare'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
          }`}
        >
          <span>⚖️</span>
          <span>Resume Comparison Matrix</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('review');
            setErrorMsg('');
          }}
          className={`w-full xs:w-auto flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 xs:px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
            activeTab === 'review'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
          }`}
        >
          <span>📄</span>
          <span>ATS Diagnostic Review</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: JOB FIT & HIREABILITY MATCHING ENGINE             */}
      {/* ======================================================== */}
      {activeTab === 'job-fit' && (
        <div className="space-y-5">
          {/* Header & Helper Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-sans tracking-wider text-accent uppercase font-bold">
                CAPABILITY & QUALIFICATION ALIGNMENT
              </span>
              <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
                Calculate Candidate Hireability Score for Any Target Role
              </h3>
              <p className="text-xs text-text-secondary mt-1 max-w-xl">
                Paste any job description and qualifications to calculate candidate alignment percentage, matched competencies, and interview preparedness.
              </p>
            </div>
            <button
              onClick={loadSampleJobData}
              className="btn-secondary text-xs py-2 px-3.5 shrink-0 self-start md:self-auto flex items-center gap-1.5 font-sans font-medium"
            >
              <span>⚡</span>
              <span>Load Sample Job Spec</span>
            </button>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Inputs: Job Title, JD, Qualifications */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-text-primary font-bold mb-1.5">
                  Target Role / Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer, IoT Specialist, Backend Architect"
                  className="w-full bg-bg-surface border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors font-sans"
                />
                {/* Role quick pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-text-muted font-sans font-medium">QUICK PRESETS:</span>
                  {[
                    'Full-Stack Developer',
                    'Software Engineer',
                    'IoT & Embedded Engineer',
                    'Frontend Architect'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setJobTitle(preset)}
                      className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-md bg-bg-elevated border border-border-subtle text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-sans uppercase tracking-wider text-text-primary font-bold">
                    Job Description & Responsibilities <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-sans text-text-muted font-medium">PASTE JD TEXT</span>
                </div>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description, primary responsibilities, and expected day-to-day deliverables..."
                  className="w-full bg-bg-surface border border-border-subtle rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors leading-relaxed resize-y font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-sans uppercase tracking-wider text-text-primary font-bold">
                    Required Qualifications & Skills (Optional)
                  </label>
                  <span className="text-[10px] font-sans text-text-muted font-medium">CRITERIA / EDUCATION</span>
                </div>
                <textarea
                  rows={3}
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, 9.0+ CGPA or equivalent, proficiency in C++, React, Node.js, REST APIs, IoT hardware..."
                  className="w-full bg-bg-surface border border-border-subtle rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors leading-relaxed resize-y font-sans"
                />
              </div>
            </div>

            {/* Right Panel: Resume Target Selector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-3.5">
                <span className="text-xs font-sans uppercase tracking-wider text-text-primary font-bold block">
                  Evaluation Target Resume
                </span>

                {/* Option 1: Dhamodharan's Verified Profile */}
                <div
                  onClick={() => setUseDhamoResume(true)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    useDhamoResume
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-border-subtle bg-bg-elevated/40 hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        useDhamoResume ? 'border-accent bg-accent' : 'border-border-hover'
                      }`}>
                        {useDhamoResume && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5 font-sans">
                          <span>Dhamodharan R</span>
                          <span className="text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            VERIFIED RESUME
                          </span>
                        </h4>
                        <p className="text-[11px] text-text-secondary mt-0.5 font-sans">
                          B.Tech CSE (9.05 CGPA) • Software, AI/ML & IoT Architect
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-border-subtle/60 flex flex-wrap gap-1 font-sans text-[10px] text-text-muted font-medium">
                    <span className="px-1.5 py-0.5 bg-bg-surface rounded">Java / Python / C++</span>
                    <span className="px-1.5 py-0.5 bg-bg-surface rounded">AI/ML & Data Science</span>
                    <span className="px-1.5 py-0.5 bg-bg-surface rounded">IoT Systems & Telemetry</span>
                    <span className="px-1.5 py-0.5 bg-bg-surface rounded">DSA & Algorithms</span>
                  </div>
                </div>

                {/* Option 2: Upload Custom Resume */}
                <div
                  onClick={() => setUseDhamoResume(false)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    !useDhamoResume
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-border-subtle bg-bg-elevated/40 hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      !useDhamoResume ? 'border-accent bg-accent' : 'border-border-hover'
                    }`}>
                      {!useDhamoResume && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary font-sans">Upload Custom Candidate Resume</h4>
                      <p className="text-[11px] text-text-secondary mt-0.5 font-sans">
                        Test another applicant&apos;s PDF/TXT against this role
                      </p>
                    </div>
                  </div>

                  {!useDhamoResume && (
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                      <input
                        ref={customFileRef}
                        type="file"
                        accept=".pdf,.txt"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            if (validateFile(e.target.files[0])) {
                              setCustomResumeFile(e.target.files[0]);
                            }
                          }
                        }}
                        className="hidden"
                      />
                      {!customResumeFile ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            customFileRef.current?.click();
                          }}
                          className="w-full py-2 px-3 border border-dashed border-border-hover rounded-lg text-xs font-sans font-semibold text-accent hover:border-accent transition-colors flex items-center justify-center gap-2"
                        >
                          <span>📁</span>
                          <span>Select PDF or TXT Document</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-bg-surface p-2 rounded-lg border border-border-subtle">
                          <span className="text-xs font-sans font-medium text-text-primary truncate max-w-[180px]">
                            {customResumeFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomResumeFile(null);
                            }}
                            className="text-xs text-rose-400 hover:underline font-sans font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Primary CTA */}
                <div className="pt-2">
                  <button
                    onClick={handleRunJobFit}
                    disabled={jobFitLoading}
                    className="w-full btn-primary text-xs py-3 px-4 font-bold flex items-center justify-center gap-2 font-sans"
                  >
                    {jobFitLoading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <span>RUNNING HIREABILITY TELEMETRY...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Calculate Hireability Alignment</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-text-muted font-sans font-medium mt-2">
                    CROSS-REFERENCES TECH STACK • PROJECT VERIFICATION • ROLE GAP ANALYSIS
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Fit Evaluation Result */}
          {jobFitResult && (
            <div className="p-6 sm:p-8 rounded-2xl bento-card space-y-5 bg-bg-surface border-accent/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-sans text-xs text-text-primary font-bold uppercase tracking-wider">
                    JOB FIT EVALUATION DOSSIER: {jobTitle.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(jobFitResult)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-sans font-medium"
                  >
                    <span>{copied ? '✓' : '📋'}</span>
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(jobFitResult, `Hireability_Evaluation_${jobTitle.replace(/\s+/g, '_')}.txt`)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-sans font-medium"
                  >
                    <span>💾</span>
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setJobFitResult('')}
                    className="text-xs text-text-muted hover:text-rose-400 font-sans font-medium px-2"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <MarkdownRenderer content={jobFitResult} />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SIDE-BY-SIDE RESUME COMPARISON MATRIX             */}
      {/* ======================================================== */}
      {activeTab === 'compare' && (
        <div className="space-y-5">
          {/* Header & Helper Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-sans tracking-wider text-accent uppercase font-bold">
                HEAD-TO-HEAD CANDIDATE COMPARISON
              </span>
              <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
                Benchmark External Profiles Against Dhamodharan&apos;s Engineering Track Record
              </h3>
              <p className="text-xs text-text-secondary mt-1 max-w-xl">
                Compare another engineer&apos;s background against Dhamodharan&apos;s verified resume across algorithms, system design, hardware integrations, and full-stack architecture.
              </p>
            </div>
            <button
              onClick={loadSampleCandidateData}
              className="btn-secondary text-xs py-2 px-3.5 shrink-0 self-start md:self-auto flex items-center gap-1.5 font-sans font-medium"
            >
              <span>⚡</span>
              <span>Load Sample Candidate</span>
            </button>
          </div>

          {/* Dual Candidate Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Candidate A: Dhamodharan R (Pre-mounted Baseline) */}
            <div className="p-5 rounded-2xl bento-card bg-bg-surface border-accent/30 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-sans font-bold text-accent uppercase tracking-wider">CANDIDATE A (BASELINE)</span>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  VERIFIED PROFILE
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-text-primary">Dhamodharan R</h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  B.Tech in Computer Science & Engineering • CGPA: 9.23
                </p>
              </div>

              <div className="space-y-2 text-xs text-text-secondary bg-bg-elevated/50 p-3.5 rounded-xl border border-border-subtle font-sans">
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">▸</span>
                  <span><strong>Core Languages:</strong> C, C++, Python, Java, JavaScript, SQL</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">▸</span>
                  <span><strong>Full-Stack & Web:</strong> React, Next.js, Node.js, Express, REST APIs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">▸</span>
                  <span><strong>Hardware / IoT:</strong> Turbidity, pH sensors, ESP32, automation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">▸</span>
                  <span><strong>Key Deployments:</strong> Zerora, InOrOut, Digilog, CSENEXUS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-text-secondary flex items-center gap-2 font-sans">
                <span className="text-accent text-sm">🔒</span>
                <span>Verified resume mounted directly from database & signed portfolio repository.</span>
              </div>
            </div>

            {/* Candidate B: Comparison Target */}
            <div className="p-5 rounded-2xl bento-card bg-bg-surface border-border-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-sans font-bold text-text-primary uppercase tracking-wider">CANDIDATE B (TARGET)</span>
                <div className="flex items-center gap-1 bg-bg-elevated p-1 rounded-lg border border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setCandidateInputMode('text')}
                    className={`text-[10px] font-sans px-2.5 py-1 rounded transition-colors ${
                      candidateInputMode === 'text' ? 'bg-accent text-white font-bold' : 'text-text-muted hover:text-text-primary font-medium'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setCandidateInputMode('file')}
                    className={`text-[10px] font-sans px-2.5 py-1 rounded transition-colors ${
                      candidateInputMode === 'file' ? 'bg-accent text-white font-bold' : 'text-text-muted hover:text-text-primary font-medium'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {candidateInputMode === 'text' ? (
                <div>
                  <textarea
                    rows={8}
                    value={candidateText}
                    onChange={(e) => setCandidateText(e.target.value)}
                    placeholder="Paste the resume text, technical summary, or LinkedIn profile of Candidate B here..."
                    className="w-full bg-bg-elevated/40 border border-border-subtle rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors leading-relaxed resize-y font-sans"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    ref={compareFileRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        if (validateFile(e.target.files[0])) {
                          setCandidateFile(e.target.files[0]);
                        }
                      }
                    }}
                    className="hidden"
                  />
                  {!candidateFile ? (
                    <div
                      onClick={() => compareFileRef.current?.click()}
                      className="border-2 border-dashed border-border-subtle hover:border-accent rounded-xl p-6 text-center cursor-pointer transition-colors bg-bg-elevated/30 flex flex-col items-center justify-center min-h-[180px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mb-2">
                        📄
                      </div>
                      <p className="text-xs font-bold text-text-primary font-sans">Click to select Candidate B resume</p>
                      <p className="text-[10px] text-text-muted font-sans font-medium mt-1">SUPPORTS PDF OR TXT (MAX 5MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-bg-elevated p-3 rounded-xl border border-border-subtle">
                      <div className="flex items-center gap-2.5 truncate font-sans">
                        <span className="text-accent text-lg">📄</span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-text-primary truncate">{candidateFile.name}</p>
                          <p className="text-[10px] text-text-muted">{(candidateFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCandidateFile(null)}
                        className="text-xs text-rose-400 hover:underline font-sans font-medium ml-2 shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleRunComparison}
                disabled={compareLoading}
                className="w-full btn-primary text-xs py-3 px-4 font-bold flex items-center justify-center gap-2 font-sans"
              >
                {compareLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>SYNCHRONIZING HEAD-TO-HEAD MATRIX...</span>
                  </>
                ) : (
                  <>
                    <span>⚖️ Run Comparative Analysis</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comparison Evaluation Result */}
          {compareResult && (
            <div className="p-6 sm:p-8 rounded-2xl bento-card space-y-5 bg-bg-surface border-accent/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-sans text-xs text-text-primary font-bold uppercase tracking-wider">
                    HEAD-TO-HEAD COMPARATIVE EVALUATION
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(compareResult)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-sans font-medium"
                  >
                    <span>{copied ? '✓' : '📋'}</span>
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(compareResult, 'Resume_Comparison_Matrix.txt')}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-sans font-medium"
                  >
                    <span>💾</span>
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setCompareResult('')}
                    className="text-xs text-text-muted hover:text-rose-400 font-sans font-medium px-2"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <MarkdownRenderer content={compareResult} />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STANDALONE ATS RESUME DIAGNOSTIC REVIEW           */}
      {/* ======================================================== */}
      {activeTab === 'review' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle">
            <span className="text-[10px] font-sans tracking-wider text-accent uppercase font-bold">
              STANDALONE AUDIT & ATS SCORING
            </span>
            <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
              Upload Any Resume for Detailed Architectural Review
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-xl">
              Comprehensive scan assessing formatting clarity, STAR impact statements, quantification metrics, and software engineering skill taxonomy.
            </p>
          </div>

          {/* Upload Zone */}
          {!reviewFile ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  if (validateFile(e.dataTransfer.files[0])) {
                    setReviewFile(e.dataTransfer.files[0]);
                  }
                }
              }}
              onClick={() => reviewFileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[190px] ${
                dragActive
                  ? 'border-accent bg-accent/10 scale-[0.99]'
                  : 'border-border-subtle hover:border-accent/50 bg-bg-surface hover:bg-bg-elevated/50'
              }`}
            >
              <input
                ref={reviewFileRef}
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    if (validateFile(e.target.files[0])) {
                      setReviewFile(e.target.files[0]);
                    }
                  }
                }}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3.5 shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <p className="text-sm font-bold text-text-primary mb-1 font-sans">
                Drag & drop candidate resume here, or <span className="text-accent underline underline-offset-4">browse file</span>
              </p>
              <p className="text-[11px] text-text-muted font-sans font-medium tracking-wide">SUPPORTS PDF OR TXT • MAXIMUM 5MB</p>
            </div>
          ) : (
            /* Selected File Card */
            <div className="p-4 rounded-xl bento-card flex flex-col sm:flex-row items-center justify-between gap-3 bg-bg-surface border-border-hover">
              <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto font-sans">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs truncate text-text-primary">{reviewFile.name}</h4>
                  <p className="text-[11px] text-text-muted">
                    {(reviewFile.size / 1024 / 1024).toFixed(2)} MB • READY FOR AUDIT
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setReviewFile(null);
                    setReviewResult('');
                  }}
                  disabled={reviewLoading}
                  className="btn-secondary text-xs py-2 px-3.5 font-sans font-medium"
                >
                  Remove
                </button>
                {!reviewResult && (
                  <button
                    onClick={handleRunReview}
                    disabled={reviewLoading}
                    className="btn-primary text-xs py-2 px-5 font-sans font-bold"
                  >
                    Run Evaluation →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* General Review Evaluation Result */}
          {reviewResult && (
            <div className="p-6 sm:p-8 rounded-2xl bento-card space-y-5 bg-bg-surface border-accent/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-sans text-xs text-text-primary font-bold uppercase tracking-wider">
                    STANDALONE ATS AUDIT & RECOMMENDATIONS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(reviewResult)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-sans font-medium"
                  >
                    <span>{copied ? '✓' : '📋'}</span>
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(reviewResult, 'ATS_Resume_Audit.txt')}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-sans font-medium"
                  >
                    <span>💾</span>
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => {
                      setReviewFile(null);
                      setReviewResult('');
                    }}
                    className="text-xs text-text-muted hover:text-rose-400 font-sans font-medium px-2"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <MarkdownRenderer content={reviewResult} />
            </div>
          )}
        </div>
      )}

      {/* Shared Error Display */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-sans font-medium flex items-center gap-2">
          <span>⚠</span>
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
