import React, { useState } from 'react';
import { useT } from '../../i18n/texts';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../storage';

// NewGame screen for Word Whiz
const WordWhizNewGame: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const [teams, setTeams] = useState(2);
  const [turnDuration, setTurnDuration] = useState(60); // seconds
  const [turnGap, setTurnGap] = useState(10); // seconds
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { wordGroups } = useStore();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedCategories(options);
  };

  const handleStart = () => {
    navigate('/wordwhiz/play', { state: { teams, turnDuration, turnGap, categories: selectedCategories } });
  };

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Word Whiz - {t('newGame')}</h1>
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('teams')}
        <input
          type="number"
          min={2}
          max={12}
          value={teams}
          onChange={e => setTeams(Number(e.target.value))}
          className="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('turnDuration')}
        <input
          type="number"
          min={10}
          max={600}
          step={5}
          value={turnDuration}
          onChange={e => setTurnDuration(Number(e.target.value))}
          className="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>
      <label className="flex flex-col text-gray-700 dark:text-gray-200 font-medium">
        {t('turnGap')}
        <input
          type="number"
          min={0}
          max={120}
          step={5}
          value={turnGap}
          onChange={e => setTurnGap(Number(e.target.value))}
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

export default WordWhizNewGame;
