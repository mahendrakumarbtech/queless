import React from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'queless_lang';

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lng);
  };

  const languages = [
    { code: 'en', label: t('language:en') },
    { code: 'hi', label: t('language:hi') },
  ];

  if (variant === 'dropdown') {
    return (
      <li className="nav-item dropdown">
        <button
          type="button"
          className="nav-link dropdown-toggle hide-arrow"
          data-bs-toggle="dropdown"
          aria-label={t('language:label')}
        >
          <i className="bx bx-globe bx-sm"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {languages.map(({ code, label }) => (
            <li key={code}>
              <button
                type="button"
                className={`dropdown-item ${i18n.language === code ? 'active' : ''}`}
                onClick={() => changeLanguage(code)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <div className="d-flex align-items-center gap-1">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`btn btn-sm ${i18n.language === code ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => changeLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
