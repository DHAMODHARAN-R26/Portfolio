'use client';
import { useEffect } from 'react';
import { getUploadUrl } from '../lib/api';

export default function ProjectModal({ project, onClose, onImageClick }) {
  const formatFileName = (url) => {
    if (!url) return '';
    const filename = url.split('/').pop();
    const match = filename.match(/^\w+-\d+-\d+-(.+)$/);
    return match ? match[1] : filename;
  };

  let imageUrls = project.imageUrls || (project.imageUrl ? [project.imageUrl] : []);
  let reportUrls = project.reportUrls || (project.reportUrl ? [project.reportUrl] : []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2.5 xs:p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bento-card glass-panel bg-bg-surface flex flex-col shadow-2xl border-white/15 dark:border-white/10 rounded-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full border border-border-subtle bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent transition-colors cursor-pointer shrink-0"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Preview Carousel */}
        {imageUrls.length > 0 && (
          <div className="flex overflow-x-auto gap-3 p-3 xs:p-4 sm:p-6 border-b border-border-subtle bg-bg-elevated snap-x no-scrollbar">
            {imageUrls.map((url, idx) => (
              <div 
                key={idx}
                className="relative min-w-[200px] xs:min-w-[260px] sm:min-w-[380px] max-w-[85vw] h-40 xs:h-48 sm:h-60 rounded-xl cursor-zoom-in overflow-hidden shrink-0 snap-center border border-border-subtle bg-bg-surface group"
                onClick={() => onImageClick && onImageClick(getUploadUrl(url), project.title)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getUploadUrl(url)}
                  alt={`${project.title} - Preview ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-bg-main/80 backdrop-blur-md border border-white/10 font-sans font-semibold text-[9px] xs:text-[10px] text-accent">
                  ZOOM PREVIEW
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-4 xs:p-6 sm:p-8 space-y-4 xs:space-y-5 sm:space-y-6">
          <div className={imageUrls.length === 0 ? 'pr-10' : ''}>
            <span className="tech-badge">SYSTEM ARCHITECTURE SPECIFICATION</span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-text-primary mt-2 break-words">
              {project.title}
            </h2>
            
            <div className="flex flex-wrap gap-1 xs:gap-1.5 mt-3">
              {project.techStack?.map((tech, idx) => (
                <span key={idx} className="px-2 xs:px-2.5 py-0.5 xs:py-1 text-[10px] xs:text-[11px] font-sans font-medium rounded-md bg-bg-elevated border border-border-subtle text-text-secondary uppercase">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 border-t border-border-subtle pt-4">
            <h3 className="font-sans text-xs uppercase tracking-wider text-accent font-bold">System Scope & Functionality</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {(project.githubUrl || project.demoUrl || reportUrls.length > 0) && (
            <div className="pt-4 border-t border-border-subtle flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-4"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  <span>Repository</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span>Launch Live Demo</span>
                </a>
              )}
              {reportUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={getUploadUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={formatFileName(url)}
                  className="btn-secondary text-xs py-2 px-4 text-emerald-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{reportUrls.length > 1 ? `Documentation ${idx + 1}` : 'Project Report'}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
