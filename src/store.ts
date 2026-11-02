import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen =
  | { name: 'home' }
  | { name: 'players' }
  | { name: 'settings' }
  | { name: 'play'; gameId: string };

interface State {
  screen: Screen;
  players: string[];
  sound: boolean;
  go: (s: Screen) => void;
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  clearPlayers: () => void;
  setSound: (on: boolean) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      screen: { name: 'home' },
      players: [],
      sound: true,
      go: (screen) => set({ screen }),
      addPlayer: (name) =>
        set((s) => {
          const n = name.trim();
          if (!n || s.players.some((p) => p.toLowerCase() === n.toLowerCase())) return s;
          return { players: [...s.players, n] };
        }),
      removePlayer: (name) => set((s) => ({ players: s.players.filter((p) => p !== name) })),
      clearPlayers: () => set({ players: [] }),
      setSound: (sound) => set({ sound }),
    }),
    { name: 'party-pack', partialize: (s) => ({ players: s.players, sound: s.sound }) }
  )
);
