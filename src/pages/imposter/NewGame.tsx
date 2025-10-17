import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/texts';
import { useStore } from '../../storage';

const NewGame: React.FC = () => {
  const [players, setPlayers] = useState(4);
  const [duration, setDuration] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const t = useT();
  const { wordGroups } = useStore();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedCategories(options);
  };

  const handleStart = () => {
  navigate('/imposter/play', { state: { players, duration, categories: selectedCategories } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              Imposter - {t('newGame')}
            </h1>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-6">
            <label className="flex flex-col">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('players')}
              </span>
              <input
                type="number"
                min={3}
                max={200}
                value={players}
                onChange={e => setPlayers(Number(e.target.value))}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-100 font-semibold transition-all hover:border-blue-300 dark:hover:border-blue-700"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('duration')}
              </span>
              <input
                type="number"
                min={1}
                max={120}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-100 font-semibold transition-all hover:border-blue-300 dark:hover:border-blue-700"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {t('categories')}
              </span>
              <select
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-100 font-medium h-48 transition-all hover:border-blue-300 dark:hover:border-blue-700"
              >
                <option key='all' value='all' className="py-2">{t('allCategories')}</option>
                {wordGroups.map(group => (
                  <option key={group.category} value={group.category} className="py-2">{group.category}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('holdCtrlToSelect')}</p>
            </label>

            <button
              onClick={handleStart}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('start')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGame;
