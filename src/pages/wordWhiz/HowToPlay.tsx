import React from 'react';
import { useT } from '../../i18n/texts';

const WordWhizHowToPlay: React.FC = () => {
  const t = useT();
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Word Whiz - {t('howToPlay')}</h1>
      <p className="text-sm text-gray-700 dark:text-gray-300">Instructions will be added here.</p>
    </div>
  );
};

export default WordWhizHowToPlay;
