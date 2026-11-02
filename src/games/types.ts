import type { ComponentType } from 'react';

export interface GameProps {
  players: string[];
  onExit: () => void;
}

export interface Game {
  id: string;
  name: string;
  tagline: string;
  minPlayers: number;
  maxPlayers: number;
  color: string; // accent colour
  layout?: 'padded' | 'bare'; // bare = game draws its own full-screen layout
  Component: ComponentType<GameProps>;
}
