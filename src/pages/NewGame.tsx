import React from 'react';


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewGame: React.FC = () => {
  const [players, setPlayers] = useState(4);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/play', { state: { players, duration } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300, margin: '2rem auto' }}>
      <label>
        Number of players:
        <input
          type="number"
          min={3}
          max={200}
          value={players}
          onChange={e => setPlayers(Number(e.target.value))}
        />
      </label>
      <label>
        Duration (minutes):
        <input
          type="number"
          min={1}
          max={120}
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
      </label>
      <button onClick={handleStart}>Start</button>
    </div>
  );
};

export default NewGame;
