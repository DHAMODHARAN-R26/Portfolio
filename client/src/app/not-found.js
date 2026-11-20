import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-main text-text-primary text-center">
      <div className="max-w-md w-full p-8 carbon-card space-y-4">
        <span className="tech-label text-accent">404 Error</span>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">Page Not Found</h1>
        <p className="text-xs text-text-secondary leading-relaxed">
          The requested page could not be located or access is restricted.
        </p>
        <div className="pt-2">
          <Link href="/" className="btn-carbon-primary text-xs py-2 px-4">
            Return to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
