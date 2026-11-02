import { getGame } from '../games';
import { useStore } from '../store';

export default function Play({ gameId }: { gameId: string }) {
  const { players, go } = useStore();
  const game = getGame(gameId);
  const exit = () => go({ name: 'home' });

  if (!game) {
    return (
      <div className="stage">
        <p className="prompt">That game isn't available.</p>
        <button className="btn" onClick={exit}>Back to games</button>
      </div>
    );
  }
  return <game.Component players={players} onExit={exit} />;
}
