import { useMemo, useState } from 'react';
import type { Game, GameProps } from '../types';
import type { WerewolfConfig } from './logic';
import Setup from './Setup';
import Play from './Play';

function Werewolf({ players, onExit }: GameProps) {
  const roster = useMemo(() => players.map((name) => ({ id: name, name })), [players]);
  const [config, setConfig] = useState<WerewolfConfig | null>(null);
  if (!config) return <Setup players={roster} onBack={onExit} onStart={setConfig} />;
  return <Play players={roster} config={config} onExit={onExit} />;
}

export const werewolf: Game = {
  id: 'werewolf',
  name: 'Werewolf',
  tagline: 'Werewolves hunt by night, the village votes by day. Who do you trust?',
  minPlayers: 4,
  maxPlayers: 16,
  color: '#d4f462',
  layout: 'bare',
  Component: Werewolf,
};
