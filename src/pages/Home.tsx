import { Link } from 'react-router-dom';
import { useT } from '../i18n/texts';

export default function Home() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center mt-24 gap-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">{t('selectGame')}</h1>
      <Link
        to="/imposter"
        className="px-6 py-3 rounded bg-blue-600 dark:bg-blue-700 text-white font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition"
      >
        {t('imposterGame')}
      </Link>
      <Link
        to="/wordwhiz"
        className="px-6 py-3 rounded bg-purple-600 dark:bg-purple-700 text-white font-semibold shadow hover:bg-purple-700 dark:hover:bg-purple-800 transition"
      >
        {t('wordWhizGame')}
      </Link>
    </div>
  );
}
