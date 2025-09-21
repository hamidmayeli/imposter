import { Link } from 'react-router-dom';
import { useT } from '../i18n/texts';
import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const t = useT();
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center mt-24 gap-10 text-gray-900 dark:text-gray-100 px-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">{t('selectGame')}</h1>
        <div className="flex flex-col items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
          <span>{t('language')}:</span>
          <div className="inline-flex gap-3">
            {(['en','fa'] as const).map(lang => {
              const active = language === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded text-sm font-semibold transition border ${active ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                >
                  {lang.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center">
        <div className="flex flex-col gap-3 items-stretch bg-white dark:bg-gray-900 rounded-lg p-6 shadow dark:shadow-gray-800 w-full md:w-1/2 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{t('imposterGame')}</h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/imposter"
              className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-700 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            >
              {t('newGame')}
            </Link>
            <Link
              to="/how-to-play/Imposter"
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              {t('howToPlay')}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-stretch bg-white dark:bg-gray-900 rounded-lg p-6 shadow dark:shadow-gray-800 w-full md:w-1/2 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">{t('wordWhizGame')}</h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/wordwhiz"
              className="px-4 py-2 rounded bg-purple-600 dark:bg-purple-700 text-white font-semibold hover:bg-purple-700 dark:hover:bg-purple-800 transition"
            >
              {t('newGame')}
            </Link>
            <Link
              to="/how-to-play/WordWhiz"
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              {t('howToPlay')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
