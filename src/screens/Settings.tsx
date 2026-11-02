import { useStore } from '../store';

export default function Settings() {
  const { sound, setSound, clearPlayers, go } = useStore();

  return (
    <>
      <header className="top">
        <button className="icon" aria-label="Back" onClick={() => go({ name: 'home' })}>←</button>
        <h1>Settings</h1>
      </header>

      <label className="setting">
        <span>Sound effects</span>
        <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
      </label>

      <button className="btn ghost wide" onClick={clearPlayers}>Clear all players</button>
    </>
  );
}
