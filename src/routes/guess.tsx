import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/GameShell";

export const Route = createFileRoute("/guess")({
  head: () => ({
    meta: [
      { title: "Sayı Tahmin — QwertzV2" },
      { name: "description", content: "1-100 arası gizli sayıyı tahmin et." },
    ],
  }),
  component: Guess,
});

const rand = () => Math.floor(Math.random() * 100) + 1;

function Guess() {
  const [target, setTarget] = useState(rand());
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("1 ile 100 arasında bir sayı tahmin et.");
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(val);
    if (isNaN(n)) return;
    setTries((t) => t + 1);
    if (n === target) { setMsg(`🎉 Doğru! ${tries + 1} denemede buldun.`); setDone(true); }
    else if (n < target) setMsg("⬆️ Daha büyük bir sayı dene.");
    else setMsg("⬇️ Daha küçük bir sayı dene.");
    setVal("");
  };

  const reset = () => { setTarget(rand()); setMsg("1 ile 100 arasında bir sayı tahmin et."); setTries(0); setDone(false); setVal(""); };

  return (
    <GameShell title="Sayı Tahmin">
      <div className="max-w-md rounded-2xl border border-border bg-card p-6">
        <p className="font-mono text-sm text-primary mb-2">Deneme: {tries}</p>
        <p className="text-lg mb-6">{msg}</p>
        {!done ? (
          <form onSubmit={submit} className="flex gap-2">
            <input
              type="number"
              min="1" max="100"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="1-100"
              autoFocus
            />
            <button type="submit" className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90">
              Tahmin
            </button>
          </form>
        ) : (
          <button onClick={reset} className="rounded-lg bg-accent px-6 py-2 font-medium text-accent-foreground hover:opacity-90">
            Tekrar Oyna
          </button>
        )}
      </div>
    </GameShell>
  );
}
