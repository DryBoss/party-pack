import { useMemo, useState } from 'react';
import type { Game, GameProps } from '../types';
import type { HangmanFullSettings } from './logic';
import Setup from './Setup';
import Play from './Play';

function HangmanFriends({ players, onExit }: GameProps) {
  const roster = useMemo(() => players.map((name) => ({ id: name, name })), [players]);
  const [settings, setSettings] = useState<HangmanFullSettings | null>(null);
  if (!settings) return <Setup players={roster} onBack={onExit} onStart={setSettings} />;
  return <Play players={roster} settings={settings} onExit={onExit} />;
}

export const hangmanFriends: Game = {
  id: 'hangman-friends',
  name: 'Hangman Friends',
  tagline: 'Pick a secret word, guess it letter by letter, judge if it counts.',
  minPlayers: 2,
  maxPlayers: 12,
  color: '#d4f462',
  layout: 'bare',
  Component: HangmanFriends,
};
