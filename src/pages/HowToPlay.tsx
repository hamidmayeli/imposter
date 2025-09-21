import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n/texts';

export default function HowToPlay() {
  const t = useT();
  const { game } = useParams<{ game: string }>();
  // howToPlaySteps is now an object keyed by game id
  const stepsObj = t('howToPlaySteps') as unknown as Record<string, string[]> | undefined;
  const introObj = t('howToPlayIntro') as unknown as Record<string, string> | string | undefined;
  const steps = (stepsObj && game && stepsObj[game]) || [];
  const validGames = stepsObj ? Object.keys(stepsObj) : [];
  const isValid = game && steps.length > 0;
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t('howToPlay')}</h1>
        <div className="flex items-center gap-4">
          {validGames.map(g => (
            <Link key={g} to={`/how-to-play/${g}`} className={`text-sm hover:underline ${g === game ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{g}</Link>
          ))}
        </div>
      </div>
      {!isValid && (
        <div className="mb-4 text-sm text-red-600 dark:text-red-400">
          Invalid game. Choose one:
          <ul className="list-disc ps-6">
            {validGames.map(g => (
              <li key={g}><Link className="underline" to={`/how-to-play/${g}`}>{g}</Link></li>
            ))}
          </ul>
        </div>
      )}
  <p className="mb-4">{(typeof introObj === 'string') ? introObj : (game && introObj && (introObj as Record<string,string>)[game]) || ''}</p>
      {isValid && (
        <>
          <h2 className="text-xl font-semibold mb-2">{t('howToPlayStepsTitle')}</h2>
          <ol className="list-decimal ps-6 space-y-2">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
