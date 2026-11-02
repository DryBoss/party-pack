import { useState } from 'react';
import { useStore } from '../store';

export default function Players() {
  const { players, addPlayer, removePlayer, go } = useStore();
  const [name, setName] = useState('');

  const add = () => {
    addPlayer(name);
    setName('');
  };

  return (
    <>
      <header className="top">
        <button className="icon" aria-label="Back" onClick={() => go({ name: 'home' })}>←</button>
        <h1>Players</h1>
      </header>

      <div className="row">
        <input
          className="input"
          value={name}
          maxLength={16}
          placeholder="Player name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="btn" onClick={add} disabled={!name.trim()}>Add</button>
      </div>

      {players.length === 0 ? (
        <p className="hint">Nobody yet. Add everyone who's playing.</p>
      ) : (
        <ul className="list">
          {players.map((p) => (
            <li key={p}>
              <span>{p}</span>
              <button className="icon" aria-label={`Remove ${p}`} onClick={() => removePlayer(p)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      <button className="btn wide" onClick={() => go({ name: 'home' })}>Done</button>
    </>
  );
}
