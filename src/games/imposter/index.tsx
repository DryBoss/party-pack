import { useState } from 'react';
import type { Game, GameProps } from '../types';
import words from './words.json';
import './imposter.css';

const data = words as Record<string, string[]>;
const categories = ['Mixed', ...Object.keys(data)];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface Round {
  word: string;
  category: string;
  imposters: string[];
  order: string[]; // reveal order
  starter: string;
}

type Phase = 'setup' | 'reveal' | 'discuss' | 'result';

function Imposter({ players, onExit }: GameProps) {
  const maxImposters = Math.max(1, Math.floor((players.length - 1) / 2));
  const [phase, setPhase] = useState<Phase>('setup');
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState('Mixed');
  const [showCategory, setShowCategory] = useState(true);
  const [round, setRound] = useState<Round | null>(null);
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(false);

  const imposterCount = Math.min(count, maxImposters);

  const start = () => {
    const cat = category === 'Mixed' ? pick(Object.keys(data)) : category;
    const order = shuffle(players);
    setRound({
      word: pick(data[cat]),
      category: cat,
      imposters: shuffle(players).slice(0, imposterCount),
      order,
      starter: pick(players),
    });
    setStep(0);
    setShown(false);
    setPhase('reveal');
  };

  if (phase === 'setup') {
    return (
      <div className="imp">
        <h2>Imposter</h2>
        <div className="imp-field">
          <span className="imp-label">Imposters</span>
          <div className="imp-stepper">
            <button className="icon" aria-label="Fewer imposters" onClick={() => setCount(Math.max(1, imposterCount - 1))}>−</button>
            <strong>{imposterCount}</strong>
            <button className="icon" aria-label="More imposters" onClick={() => setCount(Math.min(maxImposters, imposterCount + 1))}>+</button>
          </div>
        </div>
        <div className="imp-field">
          <span className="imp-label">Category</span>
          <div className="imp-cats">
            {categories.map((c) => (
              <button key={c} className="imp-cat" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>
        <label className="setting">
          <span>Imposters see the category</span>
          <input type="checkbox" checked={showCategory} onChange={(e) => setShowCategory(e.target.checked)} />
        </label>
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
    const isImposter = round.imposters.includes(name);
    const last = step === round.order.length - 1;
    const advance = () => {
      setShown(false);
      if (last) setPhase('discuss');
      else setStep(step + 1);
    };

    if (!shown) {
      return (
        <div className="imp">
          <div className="imp-card">
            <p className="hint">Pass the phone to</p>
            <p className="imp-word">{name}</p>
            <p className="hint">Make sure nobody else is looking.</p>
          </div>
          <button className="btn wide" onClick={() => setShown(true)}>Show my word</button>
        </div>
      );
    }
    return (
      <div className="imp">
        <div className={`imp-card ${isImposter ? 'bad' : 'secret'}`}>
          {isImposter ? (
            <>
              <p className="imp-word">You're the imposter</p>
              <p>{showCategory ? `Category: ${round.category}` : 'You get no hint. Blend in.'}</p>
            </>
          ) : (
            <>
              <p>Your word</p>
              <p className="imp-word">{round.word}</p>
            </>
          )}
        </div>
        <button className="btn wide" onClick={advance}>{last ? 'Hide and start talking' : 'Hide and pass'}</button>
      </div>
    );
  }

  if (phase === 'discuss') {
    return (
      <div className="imp">
        <div className="imp-card">
          <p className="hint">{round.starter} goes first</p>
          <p className="imp-word">Who's the imposter?</p>
          <p>Take turns describing the word in one sentence. Then vote.</p>
        </div>
        <button className="btn wide" onClick={() => setPhase('result')}>Reveal the imposters</button>
      </div>
    );
  }

  return (
    <div className="imp">
      <h2>{round.imposters.length > 1 ? 'The imposters were' : 'The imposter was'}</h2>
      <ul className="imp-list">
        {round.imposters.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <div className="imp-card secret">
        <p>The word was</p>
        <p className="imp-word">{round.word}</p>
        <p>{round.category}</p>
      </div>
      <div className="row">
        <button className="btn ghost" onClick={onExit}>End game</button>
        <button className="btn" style={{ flex: 1 }} onClick={() => setPhase('setup')}>New round</button>
      </div>
    </div>
  );
}

export const imposter: Game = {
  id: 'imposter',
  name: 'Imposter',
  tagline: 'Everyone gets the same word, except the imposters. Find them.',
  minPlayers: 3,
  maxPlayers: 12,
  color: '#d4f462',
  Component: Imposter,
};
