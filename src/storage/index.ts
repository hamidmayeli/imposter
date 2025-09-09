import { useLanguage } from '../i18n/LanguageContext';
import enWordGroups from './en.yml';
import faWordGroups from './fa.yml';

export type WordGroup = {
    category: string;
    words: string[];
};

export type WordGroupsData = {
    wordGroups: WordGroup[];
};

const data = {
    en: enWordGroups as WordGroupsData,
    fa: faWordGroups as WordGroupsData,
}

export function useStore(): WordGroupsData {
    const { language } = useLanguage();
    return data[language];
}
