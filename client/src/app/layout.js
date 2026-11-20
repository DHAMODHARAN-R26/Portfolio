import './globals.css';

export const metadata = {
  title: 'DHAMODHARAN R | PORTFOLIO',
  description: 'Portfolio of Dhamodharan R, specializing in software engineering, full-stack systems, and IoT integrations.',
  keywords: ['Software Developer', 'Full-Stack Developer', 'Next.js', 'React', 'IoT', 'Dhamodharan R'],
  authors: [{ name: 'Dhamodharan R' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#07090E' }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-main text-text-primary transition-colors duration-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
