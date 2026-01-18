import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RoundTimer from '../../components/RoundTimer';
import { useStore } from '../../storage';
import { useT } from '../../i18n/texts';

// This version reuses wordGroups as a source of random words (all categories combined)
function getWords(categories: string[] | undefined, wordGroups: { category: string; words: string[] }[]) {
  if (!categories || categories.length === 0 || categories.includes('all')) {
    return wordGroups.flatMap(g => g.words);
  }
  return wordGroups.filter(g => categories.includes(g.category)).flatMap(g => g.words);
}

const ConnectPlay: React.FC = () => {
  const location = useLocation();
  const { teams: initialTeams = 2, turnDuration: initialTurnDuration = 60, turnGap: initialTurnGap = 10, categories = [] } = location.state || {};
  const { wordGroups } = useStore();
  const allWords = getWords(categories, wordGroups);
  const t = useT();

  const [teams, setTeams] = useState(initialTeams);
  const [turnDuration, setTurnDuration] = useState(initialTurnDuration);
  const [turnGap, setTurnGap] = useState(initialTurnGap);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [round, setRound] = useState<number>(1);
  const [activeTeam, setActiveTeam] = useState<number>(1); // 1-based team index
  const [turnActive, setTurnActive] = useState<boolean>(false); // whether timer is counting for a team
  const [paused, setPaused] = useState<boolean>(false);
  const [seed, setSeed] = useState(0); // to reset timer when starting a new turn
  const [showWord, setShowWord] = useState<boolean>(true); // initially reveal word
  const [inGap, setInGap] = useState<boolean>(false);
  const [gapSecondsLeft, setGapSecondsLeft] = useState<number>(initialTurnGap);
  const [showSettings, setShowSettings] = useState(false);

  // Pick a new word for a round (ensuring minimal repetition until pool exhausted)
  const pickNewWord = () => {
    let available = allWords.filter(w => !usedWords.includes(w));
    if (available.length === 0) {
      setUsedWords([]);
      available = allWords;
    }
    const word = available[Math.floor(Math.random() * available.length)];
    setCurrentWord(word);
    setUsedWords(prev => [...prev, word]);
  };

  useEffect(() => {
    pickNewWord();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update gapSecondsLeft when turnGap changes
  useEffect(() => {
    if (!inGap) {
      setGapSecondsLeft(turnGap);
    }
  }, [turnGap, inGap]);

  // Manage gap countdown manually (simple second interval) when inGap true
  useEffect(() => {
    if (!inGap) return;
    if (gapSecondsLeft <= 0) {
      // Move to next team's active turn automatically
      setInGap(false);
      setGapSecondsLeft(turnGap);
      startTeamTurn(nextTeamIndex(activeTeam, teams));
      return;
    }
    const id = setTimeout(() => setGapSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [inGap, gapSecondsLeft, activeTeam, teams, turnGap]);

  const nextTeamIndex = (current: number, total: number) => (current % total) + 1;

  const startTeamTurn = (teamIndex: number) => {
    setActiveTeam(teamIndex);
    setTurnActive(true);
    setPaused(false);
    setSeed(s => s + 1); // reset timer
  };

  const endTeamTurn = () => {
    setTurnActive(false);
    const nextTeam = nextTeamIndex(activeTeam, teams);
    // If we've completed a full cycle (nextTeam wraps to 1), automatically start new cycle unless the user advances round.
    if (nextTeam === 1) {
      if (turnGap > 0) {
        // Gap then team 1 again
        setInGap(true);
        setGapSecondsLeft(turnGap);
      } else {
        startTeamTurn(1);
      }
      return;
    }
    // Otherwise normal transition
    if (turnGap > 0) {
      setInGap(true);
      setGapSecondsLeft(turnGap);
    } else {
      startTeamTurn(nextTeam);
    }
  };

  const handleSkipTurn = () => {
    endTeamTurn();
  };

  const handleStartRound = () => {
    // Hide word; auto-start first team immediately
    setShowWord(false);
    startTeamTurn(1);
  };

  const handleNextRound = () => {
    // Advance round manually, pick new word and show it. Reset cycle (word shown, waiting to start)
    setRound(r => r + 1);
    pickNewWord();
    setShowWord(true);
    setTurnActive(false);
    setInGap(false);
    setGapSecondsLeft(turnGap);
  };

  // (reserved utility for future formatting needs)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20 flex flex-col items-center relative">
          {/* Settings Button */}
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

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              {t('connectGame')}
            </h1>
          </div>
          
          <div className="mb-6 px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
            <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{t('round')} {round}</span>
          </div>

          {showWord && (
            <div className="mb-6 p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl w-full max-w-md">
              <div className="text-3xl font-bold text-white text-center">{currentWord || '...'}</div>
            </div>
          )}
          
          {!turnActive && !inGap && !showWord && (
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('readyForTeam1')}
            </div>
          )}

          {turnActive && (
            <div className="flex flex-col items-center mb-6 w-full">
              <div className="mb-4 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg animate-pulse">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('team')} {activeTeam}</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 mb-6 shadow-inner">
                <RoundTimer
                  key={seed}
                  durationMinutes={turnDuration / 60}
                  paused={paused}
                  className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                  onExpire={endTeamTurn}
                />
              </div>
              
              <div className="flex gap-3 flex-wrap justify-center">
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
                  onClick={handleSkipTurn}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('skip')}
                </button>
              </div>
            </div>
          )}

          {inGap && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {t('nextTeamIn')} <span className="text-2xl text-blue-600 dark:text-blue-400">{gapSecondsLeft}</span>{t('secondsSuffix')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('team')} {nextTeamIndex(activeTeam, teams)} {t('prepares')}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {showWord && (
              <button
                onClick={handleStartRound}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                {t('startRound')}
              </button>
            )}
            <button
              onClick={handleNextRound}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('nextRound')}
            </button>
          </div>

          <div className="mt-8 px-6 py-3 bg-gray-100 dark:bg-gray-900 rounded-2xl">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold">{t('wordPoolUsed')}:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{usedWords.length} / {allWords.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
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
              {/* Team Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('teams')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTeams((p: number) => Math.max(2, p - 1))}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {teams}
                    </div>
                  </div>
                  <button
                    onClick={() => setTeams((p: number) => Math.min(10, p + 1))}
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Turn Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('turnDuration')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTurnDuration((p: number) => Math.max(10, p - 10))}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {turnDuration}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">seconds</div>
                  </div>
                  <button
                    onClick={() => setTurnDuration((p: number) => Math.min(300, p + 10))}
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Turn Gap */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('turnGap')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTurnGap((p: number) => Math.max(0, p - 5))}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {turnGap}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">seconds</div>
                  </div>
                  <button
                    onClick={() => setTurnGap((p: number) => Math.min(60, p + 5))}
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info about used words */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-purple-800 dark:text-purple-300">
                    <p className="font-semibold mb-1">Word pool is preserved</p>
                    <p>Changing game settings won't reset your progress. All {usedWords.length} used word{usedWords.length !== 1 ? 's' : ''} will remain tracked.</p>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectPlay;
