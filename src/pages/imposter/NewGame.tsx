import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/texts';
import { useStore } from '../../storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { languages } from '../../i18n/texts';

const NewGame: React.FC = () => {
  const [players, setPlayers] = useState(4);
  const [duration, setDuration] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const t = useT();
  const { wordGroups } = useStore();
  const { language, setLanguage } = useLanguage();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedCategories(options);
  };

  const handleStart = () => {
  navigate('/imposter/play', { state: { players, duration, categories: selectedCategories } });
  };

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800">
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('language')}:
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as keyof typeof languages)}
          className="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        >
          {Object.keys(languages).map(lang => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('players')}:
        <input
          type="number"
          min={3}
          max={200}
          value={players}
          onChange={e => setPlayers(Number(e.target.value))}
          className="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('duration')}:
        <input
          type="number"
          min={1}
          max={120}
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('categories')}:
        <select
          multiple
          value={selectedCategories}
          onChange={handleCategoryChange}
          className="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 h-40"
        >
          <option key='all' value='all'>{t('allCategories')}</option>
          {wordGroups.map(group => (
            <option key={group.category} value={group.category}>{group.category}</option>
          ))}
        </select>
      </label>
      <button
        onClick={handleStart}
        className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
      >
        {t('start')}
      </button>
    </div>
  );
};

export default NewGame;
