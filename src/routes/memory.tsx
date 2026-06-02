import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GameShell } from "@/components/GameShell";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Hafıza Oyunu — QwertzV2" },
      { name: "description", content: "Kart eşleştirme hafıza oyunu." },
    ],
  }),
  component: Memory,
});

const EMOJIS = ["🚀", "🎮", "🎲", "🎯", "⚡", "🔥", "💎", "🌟"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

const shuffle = (): Card[] =>
  [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));

function Memory() {
  const [cards, setCards] = useState<Card[]>(shuffle());
  const [picks, setPicks] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (picks.length !== 2) return;
    const [a, b] = picks;
    setMoves((m) => m + 1);
    if (cards[a].emoji === cards[b].emoji) {
      setCards((c) => c.map((x, i) => (i === a || i === b ? { ...x, matched: true } : x)));
      setPicks([]);
    } else {
      const t = setTimeout(() => {
        setCards((c) => c.map((x, i) => (i === a || i === b ? { ...x, flipped: false } : x)));
        setPicks([]);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [picks, cards]);

  const flip = (i: number) => {
    if (picks.length === 2 || cards[i].flipped) return;
    setCards((c) => c.map((x, idx) => (idx === i ? { ...x, flipped: true } : x)));
    setPicks((p) => [...p, i]);
  };

  const won = cards.every((c) => c.matched);
  const reset = () => { setCards(shuffle()); setPicks([]); setMoves(0); };

  return (
    <GameShell title="Hafıza">
      <p className="mb-4 font-mono text-sm text-primary">
        Hamle: {moves} {won && "— KAZANDIN!"}
      </p>
      <div className="grid grid-cols-4 gap-3 max-w-md">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => flip(i)}
            className={`aspect-square rounded-xl border border-border text-4xl transition ${
              c.flipped || c.matched ? "bg-secondary shadow-glow" : "bg-card hover:bg-secondary"
            }`}
          >
            {(c.flipped || c.matched) && c.emoji}
          </button>
        ))}
      </div>
      <button onClick={reset} className="mt-6 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90">
        Yeni Oyun
      </button>
    </GameShell>
  );
}
