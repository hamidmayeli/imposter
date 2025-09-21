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

const WordWhizPlay: React.FC = () => {
  const location = useLocation();
  const { teams = 2, turnDuration = 60, turnGap = 10, categories = [] } = location.state || {};
  const { wordGroups } = useStore();
  const allWords = getWords(categories, wordGroups);
  const t = useT();

  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [round, setRound] = useState<number>(1);
  const [activeTeam, setActiveTeam] = useState<number>(1); // 1-based team index
  const [turnActive, setTurnActive] = useState<boolean>(false); // whether timer is counting for a team
  const [paused, setPaused] = useState<boolean>(false);
  const [seed, setSeed] = useState(0); // to reset timer when starting a new turn
  const [showWord, setShowWord] = useState<boolean>(true); // initially reveal word
  const [inGap, setInGap] = useState<boolean>(false);
  const [gapSecondsLeft, setGapSecondsLeft] = useState<number>(turnGap);

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
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800 flex flex-col items-center w-full">
  <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{t('wordWhizGame')}</h1>
  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">{t('round')} {round}</div>
      {showWord && (
        <div className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">{currentWord || '...'}</div>
      )}
      {!turnActive && !inGap && !showWord && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">{t('readyForTeam1')}</div>
      )}

      {turnActive && (
        <div className="flex flex-col items-center mb-4 w-full">
          <div className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">{t('team')} {activeTeam}</div>
          <RoundTimer
            key={seed}
            durationMinutes={turnDuration / 60}
            paused={paused}
            className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4"
            onExpire={endTeamTurn}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setPaused(p => !p)}
              className="px-3 py-2 bg-yellow-500 dark:bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition"
            >
              {paused ? t('resume') : t('pause')}
            </button>
            <button
              onClick={handleSkipTurn}
              className="px-3 py-2 bg-orange-500 dark:bg-orange-600 text-white font-semibold rounded hover:bg-orange-600 dark:hover:bg-orange-700 transition"
            >
              {t('skip')}
            </button>
          </div>
        </div>
      )}

      {inGap && (
        <div className="mb-4 flex flex-col items-center text-sm text-gray-600 dark:text-gray-300">
          <div>{t('nextTeamIn')} {gapSecondsLeft}{t('secondsSuffix')}</div>
          <div className="mt-1">({t('team')} {nextTeamIndex(activeTeam, teams)} {t('prepares')})</div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {showWord && (
          <button
            onClick={handleStartRound}
            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white font-semibold rounded hover:bg-green-700 dark:hover:bg-green-800 transition"
          >
            {t('startRound')}
          </button>
        )}
        <button
          onClick={handleNextRound}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white font-semibold rounded hover:bg-purple-700 dark:hover:bg-purple-800 transition"
        >
          {t('nextRound')}
        </button>
      </div>

      <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 w-full flex flex-col items-center gap-1">
        <div>{t('wordPoolUsed')}: {usedWords.length} / {allWords.length}</div>
      </div>
    </div>
  );
};

export default WordWhizPlay;
