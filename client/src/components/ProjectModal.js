'use client';
import { useEffect } from 'react';
import Image from 'next/image';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl flex flex-col shadow-2xl border border-card-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 hover:bg-card-border/50 text-foreground transition-colors backdrop-blur-md border border-card-border"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {imageUrls.length > 0 && (
          <div className="flex overflow-x-auto gap-4 p-4 sm:px-6 border-b border-card-border bg-background/30 snap-x">
            {imageUrls.map((url, idx) => (
              <div 
                key={idx}
                className="relative min-w-[280px] sm:min-w-[400px] h-48 sm:h-64 rounded-xl cursor-zoom-in bg-gradient-to-br from-accent/20 to-indigo-500/20 group overflow-hidden shrink-0 snap-center shadow-md border border-card-border"
                onClick={() => onImageClick && onImageClick(getUploadUrl(url), project.title)}
              >
                <img
                  src={getUploadUrl(url)}
                  alt={`${project.title} - Image ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {onImageClick && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm text-sm font-semibold flex items-center gap-2 text-foreground">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      View Image
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className={imageUrls.length === 0 ? 'pr-10 sm:pr-12' : ''}>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack?.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-semibold tracking-wider rounded-lg bg-accent/10 border border-accent/20 text-accent uppercase">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
            <h3 className="text-lg font-semibold text-foreground mb-2">Project Overview</h3>
            <p className="whitespace-pre-wrap">{project.description}</p>
          </div>

          {(project.githubUrl || project.demoUrl || reportUrls.length > 0) && (
            <div className="pt-6 border-t border-card-border flex flex-wrap gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-card-border hover:border-accent hover:text-accent transition-colors text-sm font-semibold shadow-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  Source Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors text-sm font-semibold shadow-md shadow-accent/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Live Demo
                </a>
              )}
              {reportUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={getUploadUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={formatFileName(url)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm font-semibold shadow-md shadow-emerald-500/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {reportUrls.length > 1 ? `Full Report ${idx + 1}` : 'Full Report'}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
