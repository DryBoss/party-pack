import { useStore } from './store';
import { getGame } from './games';
import Home from './screens/Home';
import Players from './screens/Players';
import Settings from './screens/Settings';
import Play from './screens/Play';

export default function App() {
  const screen = useStore((s) => s.screen);

  // Games that draw their own full-screen layout skip the padded shell.
  if (screen.name === 'play' && getGame(screen.gameId)?.layout === 'bare') {
    return (
      <div className="surface">
        <Play gameId={screen.gameId} />
      </div>
    );
  }

  return (
    <main className="app">
      {screen.name === 'home' && <Home />}
      {screen.name === 'players' && <Players />}
      {screen.name === 'settings' && <Settings />}
      {screen.name === 'play' && <Play gameId={screen.gameId} />}
    </main>
  );
}
