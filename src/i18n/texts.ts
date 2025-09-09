
import React from 'react';
import en from './en.json';
import fa from './fa.json';
import { useLanguage } from './LanguageContext';

export const languages = {
  en,
  fa,
};

export type LanguageKey = Exclude<keyof typeof en, 'direction'>;

export function useT() {
  const { language } = useLanguage();
  return (key: LanguageKey) => languages[language][key] || key;
}
