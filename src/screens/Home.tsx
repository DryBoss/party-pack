import type { CSSProperties } from 'react';
import { games } from '../games';
import { useStore } from '../store';

export default function Home() {
  const { players, go } = useStore();
  const count = players.length;

  return (
    <>
      <header className="top">
        <h1>Party Pack</h1>
        <button className="icon" aria-label="Settings" onClick={() => go({ name: 'settings' })}>⚙</button>
      </header>

      <button className="players-bar" onClick={() => go({ name: 'players' })}>
        <span>{count === 0 ? 'Add players to start' : `${count} player${count > 1 ? 's' : ''}`}</span>
        <span className="chips">{players.slice(0, 4).join(', ')}{count > 4 ? '…' : ''}</span>
      </button>

      <ul className="games">
        {games.map((g) => {
          const short = count < g.minPlayers;
          const long = count > g.maxPlayers;
          const locked = short || long;
          return (
            <li key={g.id}>
              <button
                className="game"
                style={{ "--accent": g.color } as CSSProperties}
                disabled={locked}
                onClick={() => go({ name: 'play', gameId: g.id })}
              >
                <strong>{g.name}</strong>
                <span>{g.tagline}</span>
                <small>
                  {locked
                    ? short ? `Needs ${g.minPlayers}+ players` : `Max ${g.maxPlayers} players`
                    : `${g.minPlayers}–${g.maxPlayers} players`}
                </small>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
