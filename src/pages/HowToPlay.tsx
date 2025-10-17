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
  
  const gameColors = {
    Imposter: 'blue',
    WordWhiz: 'purple'
  } as Record<string, string>;
  
  const currentColor = game ? gameColors[game] || 'blue' : 'blue';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-${currentColor}-600 to-${currentColor}-800 dark:from-${currentColor}-400 dark:to-${currentColor}-600 bg-clip-text text-transparent`}>
              {t('howToPlay')}
            </h1>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
              {validGames.map(g => (
                <Link 
                  key={g} 
                  to={`/how-to-play/${g}`} 
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${g === game ? `bg-gradient-to-r from-${gameColors[g] || 'blue'}-600 to-${gameColors[g] || 'blue'}-700 text-white shadow-lg` : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
          
          {!isValid && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Invalid game. Choose one:</p>
              <ul className="list-disc ps-6 text-red-600 dark:text-red-400">
                {validGames.map(g => (
                  <li key={g}><Link className="underline hover:no-underline" to={`/how-to-play/${g}`}>{g}</Link></li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {(typeof introObj === 'string') ? introObj : (game && introObj && (introObj as Record<string,string>)[game]) || ''}
          </p>
        </div>

        {/* Steps Card */}
        {isValid && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 bg-gradient-to-br from-${currentColor}-500 to-${currentColor}-600 rounded-xl shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('howToPlayStepsTitle')}</h2>
            </div>
            
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4 group">
                  <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-${currentColor}-500 to-${currentColor}-600 text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-800/50 transition-colors">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{s}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
