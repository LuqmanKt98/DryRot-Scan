import { useLanguage } from '../contexts/LanguageContext';

// Helper to access nested properties from a string path
const getNestedTranslation = (obj: any, path: string): any => {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
};

export const useTranslation = () => {
  const { translations } = useLanguage();

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const rawValue = getNestedTranslation(translations, key);

    // FIX: Strict check. If it's not a string, return the key.
    if (typeof rawValue !== 'string') {
      // console.warn(`Translation key "${key}" not found.`); // Optional: Uncomment for debugging
      return key;
    }
    
    // At this point, we know rawValue is a string.
    let finalString = rawValue;

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        finalString = finalString.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }

    return finalString;
  };

  return { t };
};