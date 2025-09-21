
import en from './en.json';
import fa from './fa.json';
import { useLanguage } from './LanguageContext';

export const languages = {
  en,
  fa,
};

export type LanguageKey = Exclude<keyof typeof en, 'direction'>;

// Return value can be string | object depending on key
export function useT() {
  const { language } = useLanguage();
  return <K extends LanguageKey>(key: K): (typeof en)[K] => {
    return (languages[language] as typeof en)[key];
  };
}
