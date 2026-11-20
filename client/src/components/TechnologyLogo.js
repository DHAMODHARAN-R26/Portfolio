'use client';
import React from 'react';

/**
 * Official Brand SVG Logos with authentic brand colors
 */
export default function TechnologyLogo({ name, className = "w-8 h-8" }) {
  const normalized = (name || '').trim().toLowerCase();

  switch (normalized) {
    case 'html':
    case 'html5':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="HTML5">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0z" fill="#E34F26" />
          <path d="M12 22.008l6.852-1.95 1.549-17.48H12v19.43z" fill="#EF652A" />
          <path d="M12 9.297H8.567l-.234-2.63H12V4.114H5.669l.713 7.828H12V9.297zm0 6.643l-.013.003-2.92-.788-.187-2.091H6.31l.369 4.129 5.32 1.477.001-.001V15.94z" fill="#EBEBEB" />
          <path d="M12 9.297h3.433l-.326 3.655-3.107.838v2.645l5.32-1.477.043-.485.603-6.757.072-.819H12v2.399zm0-5.183v2.553h5.669l.115-1.28.114-1.273H12z" fill="#FFFFFF" />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="CSS3">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0z" fill="#1572B6" />
          <path d="M12 22.008l6.852-1.95 1.549-17.48H12v19.43z" fill="#33A9DC" />
          <path d="M12 9.297H8.567l-.234-2.63H12V4.114H5.669l.713 7.828H12V9.297zm0 6.643l-.013.003-2.92-.788-.187-2.091H6.31l.369 4.129 5.32 1.477.001-.001V15.94z" fill="#EBEBEB" />
          <path d="M12 9.297h3.433l-.326 3.655-3.107.838v2.645l5.32-1.477.043-.485.603-6.757.072-.819H12v2.399zm0-5.183v2.553h5.669l.115-1.28.114-1.273H12z" fill="#FFFFFF" />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="JavaScript">
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path d="M6.48 18.5c-.75 0-1.42-.23-1.89-.63-.44-.38-.64-.95-.64-1.74h2.24c0 .35.1.58.26.71.16.12.4.18.73.18.33 0 .58-.08.73-.24.15-.16.23-.41.23-.74V9.8h2.37v6.33c0 .85-.24 1.5-.72 1.91-.48.4-1.18.61-2.08.61v-.15zm8.56.03c-1.1 0-1.99-.3-2.58-.88-.61-.59-.92-1.41-.92-2.45h2.29c0 .54.14.94.41 1.18.28.24.69.36 1.23.36.43 0 .77-.09 1-.26.24-.17.36-.42.36-.73 0-.25-.09-.45-.27-.61-.17-.16-.48-.31-.92-.46l-1.3-.44c-.95-.33-1.63-.73-2.03-1.22-.4-.49-.61-1.13-.61-1.92 0-.96.34-1.72 1.02-2.28.68-.56 1.6-.84 2.76-.84.97 0 1.77.26 2.37.79.6.53.91 1.28.93 2.25h-2.27c-.03-.43-.16-.74-.38-.93-.23-.19-.57-.29-1.04-.29-.39 0-.69.08-.89.23-.21.16-.31.37-.31.63 0 .23.09.42.27.56.17.14.47.28.89.41l1.32.44c1.07.36 1.83.79 2.27 1.3.44.51.66 1.18.66 2 0 1-.36 1.79-1.07 2.37-.71.57-1.7.86-2.97.86z" fill="#000000" />
        </svg>
      );

    case 'python':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Python">
          <path d="M11.87 0c-3.15 0-5.22.42-5.77 2.19-.58 1.88.22 3.19.22 4.67h5.66v.83H4.15c-1.5 0-2.88 1.16-3.32 2.89-.52 2.05-.53 3.32 0 5.43.39 1.55 1.48 2.84 2.97 2.84h1.72v-2.45c0-1.74 1.46-3.26 3.23-3.26h5.63c1.44 0 2.59-1.18 2.59-2.63V4.89c0-1.41-1.22-2.52-2.61-2.73C13.78.36 12.87 0 11.87 0zm-2.86 1.77c.56 0 1.02.46 1.02 1.02 0 .56-.46 1.02-1.02 1.02-.56 0-1.02-.46-1.02-1.02 0-.56.46-1.02 1.02-1.02z" fill="#387EB8" />
          <path d="M12.13 24c3.15 0 5.22-.42 5.77-2.19.58-1.88-.22-3.19-.22-4.67h-5.66v-.83h7.83c1.5 0 2.88-1.16 3.32-2.89.52-2.05.53-3.32 0-5.43-.39-1.55-1.48-2.84-2.97-2.84h-1.72v2.45c0 1.74-1.46 3.26-3.23 3.26H9.64c-1.44 0-2.59 1.18-2.59 2.63v5.67c0 1.41 1.22 2.52 2.61 2.73.59 1.8 1.5 2.16 2.47 2.16zm2.86-1.77c-.56 0-1.02-.46-1.02-1.02 0-.56.46-1.02 1.02-1.02.56 0 1.02.46 1.02 1.02 0 .56-.46 1.02-1.02 1.02z" fill="#FFE873" />
        </svg>
      );

    case 'c':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="C Language">
          <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0z" fill="#00599C" />
          <path d="M12 2.3L3.6 7.1v9.8L12 21.7l8.4-4.8V7.1L12 2.3z" fill="#659AD2" />
          <path d="M12.2 6.5c-3.3 0-5.7 2.4-5.7 5.5 0 3.1 2.4 5.5 5.7 5.5 2.1 0 3.8-1 4.7-2.6l-2-1.1c-.6 1-1.6 1.6-2.7 1.6-1.9 0-3.3-1.4-3.3-3.4s1.4-3.4 3.3-3.4c1.1 0 2.1.6 2.7 1.6l2-1.1c-.9-1.6-2.6-2.6-4.7-2.6z" fill="#FFFFFF" />
        </svg>
      );

    case 'c++':
    case 'cpp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="C++">
          <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0z" fill="#00599C" />
          <path d="M12 2.3L3.6 7.1v9.8L12 21.7l8.4-4.8V7.1L12 2.3z" fill="#659AD2" />
          <path d="M10.8 6.5c-3.1 0-5.2 2.3-5.2 5.5s2.1 5.5 5.2 5.5c1.9 0 3.4-.9 4.3-2.4l-1.8-1c-.6.9-1.4 1.4-2.5 1.4-1.7 0-3-1.3-3-3.5s1.3-3.5 3-3.5c1.1 0 1.9.5 2.5 1.4l1.8-1c-.9-1.5-2.4-2.4-4.3-2.4zm5.8 4.6v-1.6h-1v1.6H14v1h1.6v1.6h1v-1.6h1.6v-1h-1.6zm3.6 0v-1.6h-1v1.6h-1.6v1h1.6v1.6h1v-1.6H21v-1h-1.8z" fill="#FFFFFF" />
        </svg>
      );

    case 'java':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Java">
          <path d="M8.85 19.5c3.56.24 7.22-.16 9.42-1.07.72-.3 1.34-.7 1.34-.7s-.53.42-1.44.82c-2.48 1.08-6.66 1.48-10.66 1.15-1.56-.13-3.4-.46-3.4-.46s1.64.12 4.74.26z" fill="#E76F00" />
          <path d="M7.4 17.15c3.08.21 6.25-.14 8.16-.92.62-.26 1.16-.6 1.16-.6s-.46.36-1.25.7c-2.15.93-5.76 1.28-9.23.99-1.35-.11-2.94-.4-2.94-.4s1.42.1 4.1.23z" fill="#E76F00" />
          <path d="M12.92 13.9c1.98-2.28 1.07-4.3-.23-6.17-.99-1.43-1.74-2.73-1.02-4.73-1.57.51-2.96 1.76-3.23 3.63-.37 2.52 1.04 4.07 2.12 5.34.8 1.02 1.29 1.71 2.36 1.93z" fill="#5382A1" />
          <path d="M15.45 10.3c.7 1.02.73 2.1.09 3.06-.88 1.33-2.48 1.88-3.9 2.22 1.37-.37 2.76-.94 3.35-1.92.51-.85.34-1.97-.24-2.76-.4-.53-.78-.96-.78-.96s.89.5 1.48 1.36z" fill="#E76F00" />
          <path d="M10.87 22.44c3.48-.19 7.02-.9 9.07-2.02.68-.37 1.1-.73 1.1-.73s-.36.42-1.09.84c-2.28 1.3-6.16 2.08-10.3 2.16-1.7.03-3.7-.08-3.7-.08s1.86.04 4.92-.17z" fill="#E76F00" />
        </svg>
      );

    case 'mysql':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="MySQL">
          <path d="M12.8 5.6C12.4 4.1 11.2 3 9.7 2.6c-2.4-.6-4.9.7-5.8 3C3 7.8 3.5 10.4 5 12c.5.5 1.1.9 1.7 1.2-1.8 1.6-2.5 4.1-1.8 6.4.7 2.3 2.7 4 5.1 4.3 2.8.4 5.6-.9 6.8-3.4 1.1-2.3.7-5.1-.9-7.1 1.4-1.2 2-3.1 1.6-4.9-.4-1.2-1.2-2.2-2.2-2.8-.7-.5-1.6-.7-2.5-.1z" fill="#00758F" />
          <path d="M16.5 9.2c-.8 0-1.5.3-2.1.8 1.1.7 1.8 1.9 2 3.2.9-.6 1.4-1.7 1.2-2.8-.2-.7-.6-1.2-1.1-1.2z" fill="#F29111" />
        </svg>
      );

    case 'jdbc':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="JDBC">
          <rect x="2" y="3" width="20" height="18" rx="4" fill="#0E7090" />
          <path d="M6 7h12M6 12h12M6 17h8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="17" r="2.5" fill="#F29111" />
        </svg>
      );

    case 'numpy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="NumPy">
          <path d="M12 2.2L3.5 7.1v9.8L12 21.8l8.5-4.9V7.1L12 2.2z" fill="#013243" />
          <path d="M7 16V8l5 8V8l5 8" stroke="#4DABCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'pandas':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Pandas">
          <rect x="2" y="3" width="6" height="18" rx="1.5" fill="#150458" />
          <rect x="9" y="3" width="6" height="18" rx="1.5" fill="#E70488" />
          <rect x="16" y="3" width="6" height="18" rx="1.5" fill="#FFD43B" />
        </svg>
      );

    case 'matplotlib':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Matplotlib">
          <rect width="24" height="24" rx="4" fill="#11557C" />
          <path d="M4 18h16M4 18l4-8 4 5 4-11 4 14" stroke="#FFA726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="10" r="1.5" fill="#FFFFFF" />
          <circle cx="12" cy="15" r="1.5" fill="#FFFFFF" />
          <circle cx="16" cy="4" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'nltk':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="NLTK">
          <rect width="24" height="24" rx="4" fill="#1D2A44" />
          <path d="M6 8h12M6 12h8M6 16h10" stroke="#70D6E8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="12" r="2" fill="#6B8CFF" />
        </svg>
      );

    case 'apache hadoop':
    case 'hadoop':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Apache Hadoop">
          <rect width="24" height="24" rx="4" fill="#0A1828" />
          <path d="M6 16c2-4 5-6 10-6m-9 6c3 1 7 1 10-2m-11 2c1 3 4 4 8 2" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="9" r="1.5" fill="#FFCC00" />
        </svg>
      );

    case 'arduino':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Arduino">
          <circle cx="8" cy="12" r="6" stroke="#00979C" strokeWidth="2" />
          <circle cx="16" cy="12" r="6" stroke="#00979C" strokeWidth="2" />
          <path d="M6 12h4M14 12h4M16 10v4" stroke="#00979C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'raspberry pi':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Raspberry Pi">
          <rect width="24" height="24" rx="4" fill="#C51A4A" />
          <circle cx="9" cy="10" r="2.5" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="2.5" fill="#FFFFFF" />
          <circle cx="9" cy="15" r="2" fill="#FFFFFF" />
          <circle cx="15" cy="15" r="2" fill="#FFFFFF" />
          <circle cx="12" cy="13" r="2.5" fill="#FFFFFF" />
          <path d="M10 5c1 1 2 2 2 3s1-2 2-3" stroke="#467A39" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'stm32 & sensors':
    case 'stm32':
    case 'sensors':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="STM32 & Sensors">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#03234B" stroke="#00A3E0" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#00A3E0" />
          <path d="M8 2v2M12 2v2M16 2v2M8 20v2M12 20v2M16 20v2M2 8h2M2 12h2M2 16h2M20 8h2M20 12h2M20 16h2" stroke="#00A3E0" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'gsm modules':
    case 'gsm':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="GSM Modules">
          <rect width="24" height="24" rx="4" fill="#1A202C" />
          <path d="M5 18h2v-3H5v3zm4 0h2v-6H9v6zm4 0h2V9h-2v9zm4 0h2V5h-2v13z" fill="#70D6E8" />
        </svg>
      );

    case 'vs code':
    case 'vscode':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Visual Studio Code">
          <path d="M17.5 2.5L7.2 10.3 3.5 7.5 1.5 8.7v6.6l2 1.2 3.7-2.8 10.3 7.8 5-2.4V4.9l-5-2.4zm0 4.8v9.4L11.5 12l6-4.7z" fill="#007ACC" />
        </svg>
      );

    case 'pycharm':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="PyCharm">
          <rect width="24" height="24" rx="4" fill="#21D789" />
          <rect x="2" y="2" width="20" height="20" rx="3" fill="#000000" />
          <path d="M5 6h4c1.1 0 2 .9 2 2s-.9 2-2 2H7v3H5V6zm2 2.5h2c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H7v1zM13 6h2l2.5 4.5L20 6h2l-3.5 6.5V17h-2v-4.5L13 6z" fill="#FFFFFF" />
          <rect x="5" y="15" width="6" height="2" fill="#21D789" />
        </svg>
      );

    case 'git & github':
    case 'git':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Git">
          <path d="M23.5 10.9L13.1.5c-.7-.7-1.8-.7-2.5 0L8.2 2.9l3.1 3.1c.7-.2 1.5 0 2 .5.6.6.7 1.4.5 2.1l3 3c.7-.2 1.5 0 2.1.5.8.8.8 2.2 0 3-.8.8-2.2.8-3 0-.6-.6-.7-1.5-.5-2.2l-2.8-2.8v4.9c.4.3.7.8.7 1.4 0 1.1-.9 2-2 2s-2-.9-2-2c0-.6.3-1.1.7-1.4V8.5c-.4-.3-.7-.8-.7-1.4 0-.6.3-1.1.7-1.4L7 3.9.5 10.4c-.7.7-.7 1.8 0 2.5l10.4 10.4c.7.7 1.8.7 2.5 0l10.1-10.1c.7-.6.7-1.7 0-2.3z" fill="#F05032" />
        </svg>
      );

    case 'oop':
    case 'object-oriented programming':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="OOP">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#6B8CFF" strokeWidth="1.75" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#70D6E8" strokeWidth="1.75" />
          <rect x="8.5" y="14" width="7" height="7" rx="1.5" stroke="#A78BFA" strokeWidth="1.75" />
          <path d="M6.5 10v2a2 2 0 002 2h3.5m5.5-4v2a2 2 0 01-2 2H12" stroke="#687384" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'dbms':
    case 'database management systems':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="DBMS">
          <ellipse cx="12" cy="5" rx="8" ry="3" stroke="#00758F" strokeWidth="1.75" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5m-16 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#00758F" strokeWidth="1.75" />
        </svg>
      );

    case 'operating systems':
    case 'os':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Operating Systems">
          <circle cx="12" cy="12" r="9" stroke="#687384" strokeWidth="1.75" />
          <path d="M12 3v18M3 12h18" stroke="#6B8CFF" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="4" fill="#151A23" stroke="#70D6E8" strokeWidth="1.5" />
        </svg>
      );

    case 'computer networks':
    case 'cn':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Computer Networks">
          <rect x="2" y="4" width="6" height="4" rx="1" stroke="#6B8CFF" strokeWidth="1.5" />
          <rect x="16" y="4" width="6" height="4" rx="1" stroke="#6B8CFF" strokeWidth="1.5" />
          <rect x="9" y="16" width="6" height="4" rx="1" stroke="#70D6E8" strokeWidth="1.5" />
          <path d="M5 8v4h14V8M12 12v4" stroke="#687384" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'responsive web design':
    case 'responsive design':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Responsive Design">
          <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="#6B8CFF" strokeWidth="1.5" />
          <path d="M6 17h6M9 14v3" stroke="#6B8CFF" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="14" y="9" width="8" height="12" rx="1.5" fill="#151A23" stroke="#70D6E8" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="0.75" fill="#70D6E8" />
        </svg>
      );

    case 'dsa':
    case 'data structures':
    case 'algorithms':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="DSA">
          <circle cx="12" cy="5" r="3" fill="#6B8CFF" />
          <circle cx="6" cy="17" r="3" fill="#70D6E8" />
          <circle cx="18" cy="17" r="3" fill="#70D6E8" />
          <path d="M10.5 7.5L7.5 14.5M13.5 7.5L16.5 14.5M9 17h6" stroke="#687384" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case 'react':
    case 'react.js':
    case 'reactjs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="React">
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#61DAFB" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#61DAFB" strokeWidth="1.5" />
        </svg>
      );

    case 'next':
    case 'next.js':
    case 'nextjs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Next.js">
          <circle cx="12" cy="12" r="11" fill="#000000" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M15.5 8v8m-7-8v8l8.5-8.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'node':
    case 'node.js':
    case 'nodejs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Node.js">
          <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2z" fill="#339933" />
          <path d="M12 4.5l6.5 3.8v7.4L12 19.5l-6.5-3.8V8.3L12 4.5z" fill="#026E00" />
        </svg>
      );

    case 'git':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Git">
          <path d="M23.5 10.9L13.1.5c-.7-.7-1.8-.7-2.5 0L8.2 2.9l3.1 3.1c.7-.2 1.5 0 2 .5.6.6.7 1.4.5 2.1l3 3c.7-.2 1.5 0 2.1.5.8.8.8 2.2 0 3-.8.8-2.2.8-3 0-.6-.6-.7-1.5-.5-2.2l-2.8-2.8v4.9c.4.3.7.8.7 1.4 0 1.1-.9 2-2 2s-2-.9-2-2c0-.6.3-1.1.7-1.4V8.5c-.4-.3-.7-.8-.7-1.4 0-.6.3-1.1.7-1.4L7 3.9.5 10.4c-.7.7-.7 1.8 0 2.5l10.4 10.4c.7.7 1.8.7 2.5 0l10.1-10.1c.7-.6.7-1.7 0-2.3z" fill="#F05032" />
        </svg>
      );

    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="GitHub">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      );

    case 'communication skills':
    case 'communication':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Communication">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#6B8CFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'problem-solving':
    case 'problem solving':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Problem Solving">
          <circle cx="12" cy="12" r="9" stroke="#70D6E8" strokeWidth="1.75" />
          <path d="M12 7v5l3 3" stroke="#6B8CFF" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M9 3.5h6" stroke="#70D6E8" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case 'teamwork':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Teamwork">
          <circle cx="9" cy="8" r="3" stroke="#6B8CFF" strokeWidth="1.75" />
          <circle cx="17" cy="10" r="2.5" stroke="#70D6E8" strokeWidth="1.75" />
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#6B8CFF" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M16 14.5c1.8.4 3.5 1.7 3.5 4.5" stroke="#70D6E8" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case 'time management':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Time Management">
          <circle cx="12" cy="12" r="9" stroke="#E5A65E" strokeWidth="1.75" />
          <path d="M12 7v5l3.5 2" stroke="#E5A65E" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case 'adaptability':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Adaptability">
          <path d="M21.5 2v6h-6M2.5 22v-6h6" stroke="#48BB78" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 11.5a9 9 0 0115-4.5l3 3M20.5 12.5a9 9 0 01-15 4.5l-3-3" stroke="#48BB78" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'leadership':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Leadership">
          <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.1-5.5-3.1L6.5 19.4l1-6.1L3 8.9l6-.9 3-6z" stroke="#F6AD55" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'critical thinking':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Critical Thinking">
          <path d="M9 18h6M10 22h4" stroke="#70D6E8" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 2a7 7 0 00-4.5 12.3c.9.8 1.5 2 1.5 3.2v.5h6v-.5c0-1.2.6-2.4 1.5-3.2A7 7 0 0012 2z" stroke="#70D6E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'creativity':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label="Creativity">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#ED64A6" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" fill="#ED64A6" />
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" role="img" aria-label={name}>
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#687384" strokeWidth="1.75" />
          <path d="M8 12h8M12 8v8" stroke="#6B8CFF" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
  }
}
