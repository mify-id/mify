import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState(() => {
        return localStorage.getItem('mify_locale') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('mify_locale', locale);
    }, [locale]);

    const t = (path) => {
        const keys = path.split('.');
        let value = translations[locale];
        
        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                return path; // fallback to path string if key not found
            }
        }
        return value;
    };

    const toggleLocale = () => {
        setLocale(prev => prev === 'en' ? 'id' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
