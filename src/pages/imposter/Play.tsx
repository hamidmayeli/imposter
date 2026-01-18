

import { useState, useEffect } from 'react';
import RoundTimer from '../../components/RoundTimer';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../storage';
import { useT } from '../../i18n/texts';

function getWords(categories: string[], wordGroups: { category: string; words: string[] }[]) {
  if (!categories || categories.length === 0 || categories.includes('all')) {
    return wordGroups.flatMap(g => g.words);
  }
  return wordGroups.filter(g => categories.includes(g.category)).flatMap(g => g.words);
}

function Play() {
  const location = useLocation();
  const { players: initialPlayers = 4, duration = 10, categories = [] } = location.state || {};
  const { wordGroups } = useStore();

  const allWords = getWords(categories, wordGroups);
  const t = useT();
  const [players, setPlayers] = useState<number>(initialPlayers);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [spyPlayer, setSpyPlayer] = useState<number>(1);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [roundSeed, setRoundSeed] = useState(0); // forces timer reset when round restarts
  const [paused, setPaused] = useState(false);
  const [spyRevealed, setSpyRevealed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Pick a new word and spy for each round
  const startRound = () => {
    let availableWords = allWords.filter(w => !usedWords.includes(w));
    if (availableWords.length === 0) {
      setUsedWords([]);
      availableWords = allWords;
    }
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(word);
    setUsedWords(prev => [...prev, word]);
    setSpyPlayer(Math.floor(Math.random() * players) + 1);
    setPlayerIndex(0);
    setShowCard(false);
    setShowTimer(false);
    setSpyRevealed(false);
    setRoundSeed(s => s + 1); // trigger timer reset
  };

  useEffect(() => {
    startRound();
    // eslint-disable-next-line
  }, []);

  // When showTimer flips true we start counting down via RoundTimer

  // Card click handler
  const handleCardClick = () => {
    if (!showCard) {
      setShowCard(true);
    } else {
      if (playerIndex < players - 1) {
        setPlayerIndex(i => i + 1);
        setShowCard(false);
      } else {
        setShowTimer(true);
      }
    }
  };

  // Next round
  const handleNextRound = () => {
    startRound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20 flex flex-col items-center relative">          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all hover:scale-105 active:scale-95"
            title="Settings"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          {!showTimer ? (
            <>
              {/* Player Card View */}
              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  {t('player')} {playerIndex + 1}
                </div>
              </div>
              
              <button
                onClick={handleCardClick}
                className="w-full max-w-md h-64 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative z-10 px-8 text-center">
                  {!showCard
                    ? t('tapToReveal')
                    : (playerIndex + 1 === spyPlayer
                      ? t('spyText')
                      : currentWord)
                  }
                </span>
              </button>
              
              <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showCard ? 'Tap again to continue' : 'Tap to reveal your role'}
              </div>
            </>
          ) : (
            <>
              {/* Timer View */}
              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('timer')}</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 mb-6 shadow-inner">
                <RoundTimer
                  key={roundSeed}
                  durationMinutes={duration}
                  className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                  paused={paused}
                  onExpire={() => { /* Could add auto-next-round logic here later */ }}
                />
              </div>
              
              <div className="flex gap-3 mb-4 flex-wrap justify-center">
                <button
                  onClick={() => setPaused(p => !p)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-yellow-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {paused ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {paused ? t('resume') : t('pause')}
                </button>
                
                <button
                  onClick={() => setSpyRevealed(true)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {t('revealSpy')}
                </button>
                
                <button
                  onClick={handleNextRound}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('nextRound')}
                </button>
              </div>
              
              {spyRevealed && (
                <div className="mb-4 px-6 py-4 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-red-300 dark:border-red-700 shadow-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-700 dark:text-red-300">
                      {t('spyWasPlayer')} {spyPlayer}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-8 px-6 py-3 bg-gray-100 dark:bg-gray-900 rounded-2xl">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold">{t('wordsUsed')}:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{usedWords.length} / {allWords.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Game Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Player Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('players')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPlayers(p => Math.max(2, p - 1))}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {players}
                    </div>
                  </div>
                  <button
                    onClick={() => setPlayers(p => Math.min(20, p + 1))}
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info about used words */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-semibold mb-1">Used words are preserved</p>
                    <p>Changing player count won't reset your progress. All {usedWords.length} used word{usedWords.length !== 1 ? 's' : ''} will remain tracked.</p>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Play;
