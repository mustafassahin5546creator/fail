import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "../components/GameShell";

export const Route = createFileRoute("/rps")({
  head: () => ({ meta: [{ title: "Taş Kağıt Makas — QwertzV2" }] }),
  component: RPS,
});

type Move = "tas" | "kagit" | "makas";
const moves: Move[] = ["tas", "kagit", "makas"];
const emoji: Record<Move, string> = { tas: "✊", kagit: "✋", makas: "✌️" };

function winner(p: Move, c: Move): "p" | "c" | "d" {
  if (p === c) return "d";
  if ((p === "tas" && c === "makas") || (p === "kagit" && c === "tas") || (p === "makas" && c === "kagit")) return "p";
  return "c";
}

function RPS() {
  const [score, setScore] = useState({ p: 0, c: 0 });
  const [last, setLast] = useState<{ p: Move; c: Move; r: "p" | "c" | "d" } | null>(null);

  const play = (p: Move) => {
    const c = moves[Math.floor(Math.random() * 3)];
    const r = winner(p, c);
    setLast({ p, c, r });
    if (r === "p") setScore((s) => ({ ...s, p: s.p + 1 }));
    if (r === "c") setScore((s) => ({ ...s, c: s.c + 1 }));
  };

  return (
    <GameShell title="Taş Kağıt Makas">
      <div className="text-center">
        <div className="font-mono text-sm text-muted-foreground">
          Sen {score.p} — {score.c} Bilgisayar
        </div>
        {last && (
          <div className="mt-6 text-5xl">
            {emoji[last.p]} <span className="text-muted-foreground text-2xl">vs</span> {emoji[last.c]}
            <div className="mt-3 text-lg gradient-text font-semibold">
              {last.r === "p" ? "Kazandın!" : last.r === "c" ? "Kaybettin." : "Berabere."}
            </div>
          </div>
        )}
        <div className="mt-10 flex justify-center gap-4">
          {moves.map((m) => (
            <button
              key={m}
              onClick={() => play(m)}
              className="text-5xl rounded-2xl border border-border bg-card p-6 hover:shadow-glow transition hover:-translate-y-1"
            >
              {emoji[m]}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setScore({ p: 0, c: 0 }); setLast(null); }}
          className="mt-10 text-xs font-mono text-muted-foreground hover:text-primary"
        >
          sıfırla
        </button>
      </div>
    </GameShell>
  );
}
