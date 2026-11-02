import type { Game } from './types';
import { hotSeat } from './hotseat';
import { imposter } from './imposter';
import { spyHunt } from './spyhunt';
import { hangmanFriends } from './hangman';
import { splitOrSteal } from './split-or-steal';
import { werewolf } from './werewolf';

// Register new games here. One folder per game, one line per registration.
export const games: Game[] = [imposter, spyHunt, werewolf, splitOrSteal, hangmanFriends, hotSeat];

export const getGame = (id: string) => games.find((g) => g.id === id);
