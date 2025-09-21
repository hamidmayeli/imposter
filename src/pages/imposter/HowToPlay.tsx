import { Link } from 'react-router-dom';
import { useT } from '../../i18n/texts';

export default function HowToPlay() {
  const t = useT();
  const steps = t('howToPlaySteps') as string[];
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('howToPlay')}</h1>
  <Link to="/imposter" className="text-blue-600 dark:text-blue-400 hover:underline">{t('newGame')}</Link>
      </div>

      <p className="mb-4">{t('howToPlayIntro')}</p>

      <h2 className="text-xl font-semibold mb-2">{t('howToPlayStepsTitle')}</h2>
      <ol className="list-decimal ps-6 space-y-2">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
