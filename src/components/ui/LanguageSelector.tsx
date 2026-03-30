'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'CN' as const, name: 'Chinese', nativeName: '中文' },
  { code: 'EN' as const, name: 'English', nativeName: 'English' },
  { code: 'ES' as const, name: 'Spanish', nativeName: 'Español' },
  { code: 'FR' as const, name: 'French', nativeName: 'Français' },
  { code: 'IT' as const, name: 'Italian', nativeName: 'Italiano' },
  { code: 'JP' as const, name: 'Japanese', nativeName: '日本語' },
  { code: 'KR' as const, name: 'Korean', nativeName: '한국어' },
  { code: 'PT' as const, name: 'Portuguese', nativeName: 'Português' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (code: typeof LANGUAGES[number]['code']) => {
    setLanguage(code);
    setIsOpen(false);
    console.log('Language changed to:', code);
  };

  return (
    <div
      ref={dropdownRef}
      className="language-selector"
    >
      {/* Current Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-button"
        aria-label="Select language"
      >
        {/* Globe Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="globe-icon"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span className="language-code">{language}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`chevron ${isOpen ? 'open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="language-dropdown">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
            >
              <span className="language-code-option">{lang.code}</span>
              <span className="language-name">{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-selector {
          position: relative;
          display: inline-block;
          z-index: 1000;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(255, 51, 102, 0.3);
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .language-button:hover {
          background: rgba(30, 30, 30, 0.9);
          border-color: rgba(255, 51, 102, 0.6);
        }

        .globe-icon {
          opacity: 0.7;
        }

        .language-code {
          letter-spacing: 0.05em;
        }

        .chevron {
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .language-dropdown {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(255, 51, 102, 0.3);
          border-radius: 8px;
          padding: 8px;
          backdrop-filter: blur(10px);
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .language-option:hover {
          background: rgba(255, 51, 102, 0.1);
          color: #fff;
        }

        .language-option.active {
          background: rgba(255, 51, 102, 0.15);
          color: #FF3366;
        }

        .language-code-option {
          font-weight: 600;
          letter-spacing: 0.05em;
          min-width: 28px;
        }

        .language-name {
          font-weight: 400;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .language-button {
            padding: 8px 12px;
            font-size: 13px;
          }

          .language-dropdown {
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  );
}
