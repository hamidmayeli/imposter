import React, { useEffect, useRef, useState, useCallback } from 'react';

interface RoundTimerProps {
  durationMinutes: number; // initial minutes to count down
  onExpire?: () => void;   // callback when timer hits zero
  className?: string;
  paused?: boolean; // pause countdown
}

// Minimal type for experimental Wake Lock API
interface WakeLockSentinel {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({ durationMinutes, onExpire, className, paused = false }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false); // avoid minute beep on initial mount

  // Ensure AudioContext (lazy to respect user gesture policies)
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        interface WithWebkit extends Window { webkitAudioContext?: typeof AudioContext }
        const win = window as WithWebkit;
        const Ctor = window.AudioContext || win.webkitAudioContext;
        if (Ctor) {
          audioCtxRef.current = new Ctor();
        } else {
          return null;
        }
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback((opts: { freq?: number; duration?: number; type?: OscillatorType; volume?: number; ramp?: boolean }) => {
    const { freq = 880, duration = 0.12, type = 'sine', volume = 0.4, ramp = true } = opts;
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    if (ramp) {
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    }
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [getAudioCtx]);

  const playDoubleBeep = useCallback(() => {
    playBeep({ freq: 880, duration: 0.1 });
    setTimeout(() => playBeep({ freq: 660, duration: 0.12 }), 160);
  }, [playBeep]);

  const playFinalBeep = useCallback(() => {
    // Distinct: lower then higher glide
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1040, ctx.currentTime + 0.9);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.05);
  }, [getAudioCtx]);

  // Reset if durationMinutes changes
  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
  }, [durationMinutes]);

  // Countdown logic
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (secondsLeft <= 0) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      onExpire?.();
      playFinalBeep();
      return;
    }
    intervalRef.current = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [secondsLeft, onExpire, playFinalBeep, paused]);

  // Beep logic (runs after secondsLeft update) — skip very first render
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      return;
    }
    if (secondsLeft <= 0 || paused) return; // final handled in countdown effect

    // Last 10 seconds: beep every second
    if (secondsLeft <= 10) {
      playBeep({ freq: secondsLeft === 1 ? 1000 : 900, duration: secondsLeft === 1 ? 0.25 : 0.12, type: 'square', volume: 0.5, ramp: true });
      return;
    }

    // 30 second mark: double beep
    if (secondsLeft === 30) {
      playDoubleBeep();
      return;
    }

    // Every full minute boundary (excluding starting full duration): when secondsLeft % 60 === 0
    if (secondsLeft % 60 === 0) {
      playBeep({ freq: 820, duration: 0.12 });
    }
  }, [secondsLeft, playBeep, playDoubleBeep, paused]);

  // Wake Lock management
  useEffect(() => {
    let releasedByEffect = false;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && secondsLeft > 0 && !paused) {
          if (!wakeLockRef.current) {
            interface WLApi { wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinel> } }
            const wl = await (navigator as unknown as WLApi).wakeLock.request('screen');
            wakeLockRef.current = wl;
            wakeLockRef.current.addEventListener('release', () => {
              wakeLockRef.current = null;
            });
          }
        }
      } catch {
        // Ignore errors silently
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    if (secondsLeft > 0 && !paused) {
      requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibility);
    } else {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        releasedByEffect = true;
      }
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (!releasedByEffect && wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [secondsLeft, paused]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className={className}>{minutes}:{seconds}</div>
  );
};

export default RoundTimer;
