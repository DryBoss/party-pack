import { useMemo, useState } from 'react';
import type { Game, GameProps } from '../types';
import Setup from './Setup';
import Play from './Play';

function SplitOrSteal({ players, onExit }: GameProps) {
  const roster = useMemo(() => players.map((name) => ({ id: name, name })), [players]);
  const [rounds, setRounds] = useState<number | null>(null);
  if (rounds === null) return <Setup players={roster} onBack={onExit} onStart={setRounds} />;
  return <Play players={roster} rounds={rounds} onExit={onExit} />;
}

export const splitOrSteal: Game = {
  id: 'split-or-steal',
  name: 'Split or Steal',
  tagline: 'Every pairing, one secret choice: split the pot, or take it all.',
  minPlayers: 2,
  maxPlayers: 12,
  color: '#ff6b5b',
  layout: 'bare',
  Component: SplitOrSteal,
};
