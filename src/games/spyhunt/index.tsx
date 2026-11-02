import { useEffect, useState } from 'react';
import type { Game, GameProps } from '../types';
import locations from './locations.json';
import './spyhunt.css';

const data = locations as Record<string, string[]>;
const allLocations = Object.keys(data);

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

interface Round {
  location: string;
  roles: Record<string, string>;
  spies: string[];
  order: string[];
  starter: string;
}

type Phase = 'setup' | 'reveal' | 'discuss' | 'result';

function SpyHunt({ players, onExit }: GameProps) {
  const maxSpies = Math.max(1, Math.floor((players.length - 1) / 2));
  const [phase, setPhase] = useState<Phase>('setup');
  const [spyCount, setSpyCount] = useState(1);
  const [minutes, setMinutes] = useState(6);
  const [round, setRound] = useState<Round | null>(null);
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(false);
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  const spies = Math.min(spyCount, maxSpies);

  useEffect(() => {
    if (phase !== 'discuss') return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [phase]);

  const start = () => {
    const location = pick(allLocations);
    const spyNames = shuffle(players).slice(0, spies);
    const roleList = shuffle(data[location]);
    const roles: Record<string, string> = {};
    players.filter((p) => !spyNames.includes(p)).forEach((p, i) => {
      roles[p] = roleList[i % roleList.length];
    });
    setRound({ location, roles, spies: spyNames, order: shuffle(players), starter: pick(players) });
    setStep(0);
    setShown(false);
    setPhase('reveal');
  };

  if (phase === 'setup') {
    return (
      <div className="spy">
        <h2>Spy Hunt</h2>
        <div className="spy-field">
          <strong>Spies</strong>
          <div className="spy-stepper">
            <button className="icon" aria-label="Fewer spies" onClick={() => setSpyCount(Math.max(1, spies - 1))}>−</button>
            <strong>{spies}</strong>
            <button className="icon" aria-label="More spies" onClick={() => setSpyCount(Math.min(maxSpies, spies + 1))}>+</button>
          </div>
        </div>
        <div className="spy-field">
          <strong>Round length (minutes)</strong>
          <div className="spy-stepper">
            <button className="icon" aria-label="Shorter round" onClick={() => setMinutes(Math.max(2, minutes - 1))}>−</button>
            <strong>{minutes}</strong>
            <button className="icon" aria-label="Longer round" onClick={() => setMinutes(Math.min(15, minutes + 1))}>+</button>
          </div>
        </div>
        <div className="row" style={{ marginTop: 'auto' }}>
          <button className="btn ghost" onClick={onExit}>Back</button>
          <button className="btn" style={{ flex: 1 }} onClick={start}>Start round</button>
        </div>
      </div>
    );
  }

  if (!round) return null;

  if (phase === 'reveal') {
    const name = round.order[step];
    const isSpy = round.spies.includes(name);
    const last = step === round.order.length - 1;
    const advance = () => {
      setShown(false);
      if (last) {
        const t = Date.now();
        setNow(t);
        setEndAt(t + minutes * 60000);
        setPhase('discuss');
      } else setStep(step + 1);
    };

    if (!shown) {
      return (
        <div className="spy">
          <div className="spy-card">
            <p className="hint">Pass the phone to</p>
            <p className="spy-big">{name}</p>
            <p className="hint">Make sure nobody else is looking.</p>
          </div>
          <button className="btn wide" onClick={() => setShown(true)}>Show my card</button>
        </div>
      );
    }
    return (
      <div className="spy">
        <div className={`spy-card ${isSpy ? 'bad' : 'agent'}`}>
          {isSpy ? (
            <>
              <p className="spy-big">You're the spy</p>
              <p>You don't know the location. Listen to the questions and work it out.</p>
            </>
          ) : (
            <>
              <p>Location</p>
              <p className="spy-big">{round.location}</p>
              <p>Your role: <strong>{round.roles[name]}</strong></p>
            </>
          )}
        </div>
        <button className="btn wide" onClick={advance}>{last ? 'Hide and start' : 'Hide and pass'}</button>
      </div>
    );
  }

  if (phase === 'discuss') {
    const left = Math.max(0, Math.ceil((endAt - now) / 1000));
    return (
      <div className="spy">
        <div className="spy-card">
          <p className="hint">{round.starter} asks the first question</p>
          <p className="spy-timer">{left === 0 ? "Time's up" : clock(left)}</p>
          <p>Ask each other questions about the place. Spies must blend in.</p>
          <div className="spy-locs">
            {allLocations.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
        <button className="btn wide" onClick={() => setPhase('result')}>{left === 0 ? 'Reveal the spy' : 'Vote now and reveal'}</button>
      </div>
    );
  }

  return (
    <div className="spy">
      <h2>{round.spies.length > 1 ? 'The spies were' : 'The spy was'}</h2>
      <ul className="spy-list">
        {round.spies.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <div className="spy-card agent">
        <p>The location was</p>
        <p className="spy-big">{round.location}</p>
      </div>
      <div className="row">
        <button className="btn ghost" onClick={onExit}>End game</button>
        <button className="btn" style={{ flex: 1 }} onClick={() => setPhase('setup')}>New round</button>
      </div>
    </div>
  );
}

export const spyHunt: Game = {
  id: 'spy-hunt',
  name: 'Spy Hunt',
  tagline: 'Everyone knows the place except the spy. Ask smart questions.',
  minPlayers: 3,
  maxPlayers: 12,
  color: '#ff6b5b',
  Component: SpyHunt,
};
