'use client';
import { useState, useRef } from 'react';
import { apiFetch, getApiUrl } from '../lib/api';

/**
 * A lightweight custom component to render basic Markdown blocks.
 * Parses headers (##, ###), lists (*, -), bold (**), and paragraph tags.
 */
function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
      {lines.map((line, idx) => {
        let trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Header 2: ## Text
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-lg font-bold text-accent tracking-wide mt-6 mb-2 border-b border-card-border pb-1.5 font-display">
              {parseBold(trimmed.substring(3))}
            </h3>
          );
        }

        // Header 3: ### Text
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-base font-semibold text-foreground/80 tracking-wide mt-4 mb-2 font-display">
              {parseBold(trimmed.substring(4))}
            </h4>
          );
        }

        // Bold line: **Text**
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('**', 2)) {
          return (
            <h5 key={idx} className="font-semibold text-foreground mt-3 font-display">
              {trimmed.replace(/\*\*/g, '')}
            </h5>
          );
        }

        // List item: - Text or * Text
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-4">
              <span className="text-accent mt-1.5 text-xs">•</span>
              <p className="flex-1">{parseBold(trimmed.substring(2))}</p>
            </div>
          );
        }

        // Numbered list item: 1. Text
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-4">
              <span className="text-accent font-semibold min-w-[18px] text-right">{numMatch[1]}.</span>
              <p className="flex-1">{parseBold(numMatch[2])}</p>
            </div>
          );
        }

        // Standard Paragraph
        return <p key={idx}>{parseBold(line)}</p>;
      })}
    </div>
  );
}

// Simple regex parse for **bold** text blocks
function parseBold(text) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    // Odd parts are the text captured inside the ** **
    if (index % 2 === 1) {
      return <strong key={index} className="font-semibold text-accent">{part}</strong>;
    }
    return part;
  });
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMsg('');
    setAnalysis('');

    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMsg('Unsupported format. Please upload a PDF or TXT file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum allowed size is 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setErrorMsg('');
    setAnalysis('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const url = getApiUrl('/api/ai/analyze-resume');
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header so browser appends boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setAnalysis('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] ${
            dragActive 
              ? 'border-accent bg-accent/5' 
              : 'border-card-border hover:border-accent hover:bg-card/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="font-semibold text-sm mb-1">Drag and drop your resume here</p>
          <p className="text-xs text-foreground/60 mb-2">PDF or Plain Text (.txt) formats, up to 5MB</p>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/15 text-accent hover:bg-accent-hover hover:text-white transition-colors">
            Browse File
          </span>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border border-card-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm truncate">{file.name}</h4>
              <p className="text-xs text-foreground/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-card-border hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              Remove
            </button>
            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                Start Analysis
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Output */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-8 border border-card-border bg-card rounded-2xl flex flex-col items-center justify-center space-y-4">
          <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div className="text-center">
            <p className="font-semibold text-sm">Analyzing Resume...</p>
            <p className="text-xs text-foreground/60">Recruiter Agent is reviewing content & comparing skill sets</p>
          </div>
        </div>
      )}

      {/* Analysis Output */}
      {analysis && (
        <div className="p-6 md:p-8 rounded-2xl border border-card-border bg-card space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <h4 className="font-bold text-sm uppercase tracking-wider font-display">Recruiter Assessment Report</h4>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-accent font-semibold hover:underline cursor-pointer"
            >
              Analyze Another
            </button>
          </div>
          <MarkdownRenderer content={analysis} />
        </div>
      )}
    </div>
  );
}
