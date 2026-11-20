import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Dhamodharan | Full-Stack AI Developer',
  description: 'Professional portfolio of Dhamodharan, specializing in full-stack web applications, AI API integrations, and premium interactive web design.',
  keywords: ['AI Developer', 'Full-Stack Developer', 'Next.js Portfolio', 'Gemini API', 'React 19', 'Glassmorphism UI'],
  authors: [{ name: 'Dhamodharan' }],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${poppins.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

