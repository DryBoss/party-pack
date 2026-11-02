import { useState } from 'react';
import type { Game, GameProps } from '../types';
import prompts from './prompts.json';

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function HotSeat({ players, onExit }: GameProps) {
  const [turn, setTurn] = useState(() => ({ player: pick(players), prompt: pick(prompts) }));
  const next = () => setTurn({ player: pick(players), prompt: pick(prompts) });

  return (
    <div className="stage">
      <p className="hint">Hand the phone to</p>
      <h2 className="big">{turn.player}</h2>
      <p className="prompt">{turn.prompt}</p>
      <div className="row">
        <button className="btn ghost" onClick={onExit}>End game</button>
        <button className="btn" onClick={next}>Next player</button>
      </div>
    </div>
  );
}

export const hotSeat: Game = {
  id: 'hot-seat',
  name: 'Hot Seat',
  tagline: 'One player, one question, everyone watching.',
  minPlayers: 2,
  maxPlayers: 12,
  color: '#ff6b5b',
  Component: HotSeat,
};
