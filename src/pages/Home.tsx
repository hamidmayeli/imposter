import { Link } from 'react-router-dom';
import { useT } from '../i18n/texts';
import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const t = useT();
  const { language, setLanguage } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center pt-20 pb-12 gap-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              {t('selectGame')}
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-2xl -z-10 animate-pulse"></div>
          </div>
          
          {/* Language Selector */}
          <div className="flex flex-col items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('language')}</span>
            <div className="inline-flex gap-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
              {(['en','fa'] as const).map(lang => {
                const active = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Cards */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
          {/* Imposter Card */}
          <div className="group flex flex-col gap-4 items-stretch bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl w-full md:w-1/2 border border-gray-100 dark:border-gray-700 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">{t('imposterGame')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
              {t('imposterDescription')}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/imposter"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 text-center"
              >
                {t('newGame')}
              </Link>
              <Link
                to="/how-to-play/Imposter"
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
              >
                {t('howToPlay')}
              </Link>
            </div>
          </div>

          {/* WordWhiz Card */}
          <div className="group flex flex-col gap-4 items-stretch bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl w-full md:w-1/2 border border-gray-100 dark:border-gray-700 hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">{t('wordWhizGame')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
              {t('wordWhizDescription')}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/wordwhiz"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105 text-center"
              >
                {t('newGame')}
              </Link>
              <Link
                to="/how-to-play/WordWhiz"
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
              >
                {t('howToPlay')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
