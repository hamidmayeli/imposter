

import { useState, useEffect } from 'react';
import RoundTimer from '../components/RoundTimer';
import { useLocation } from 'react-router-dom';
import { useStore } from '../storage';
import { useT } from '../i18n/texts';

function getWords(categories: string[], wordGroups: { category: string; words: string[] }[]) {
  if (!categories || categories.length === 0 || categories.includes('all')) {
    return wordGroups.flatMap(g => g.words);
  }
  return wordGroups.filter(g => categories.includes(g.category)).flatMap(g => g.words);
}

function Play() {
  const location = useLocation();
  const { players = 4, duration = 10, categories = [] } = location.state || {};
  const { wordGroups } = useStore();

  const allWords = getWords(categories, wordGroups);
  const t = useT();
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [spyPlayer, setSpyPlayer] = useState<number>(1);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [roundSeed, setRoundSeed] = useState(0); // forces timer reset when round restarts
  const [paused, setPaused] = useState(false);

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
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800 flex flex-col items-center">
      {!showTimer ? (
        <>
          <div className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">{t('player')} {playerIndex + 1}</div>
          <button
            onClick={handleCardClick}
            className="w-64 h-32 flex items-center justify-center bg-blue-600 dark:bg-blue-700 text-white text-xl font-bold rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition"
          >
            {!showCard
              ? t('tapToReveal')
              : (playerIndex + 1 === spyPlayer
                ? t('spyText')
                : currentWord)
            }
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">{t('timer')}</div>
          <RoundTimer
            key={roundSeed} // reset when round restarts
            durationMinutes={duration}
            className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6"
            paused={paused}
            onExpire={() => { /* Could add auto-next-round logic here later */ }}
          />
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setPaused(p => !p)}
              className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition"
            >
              {paused ? t('resume') : t('pause')}
            </button>
            <button
              onClick={handleNextRound}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white font-semibold rounded hover:bg-green-700 dark:hover:bg-green-800 transition"
            >
              {t('nextRound')}
            </button>
          </div>
        </>
      )}
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">{t('wordsUsed')}: {usedWords.length} / {allWords.length}</div>
    </div>
  );
}

export default Play;
