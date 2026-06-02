import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/GameShell";

export const Route = createFileRoute("/tictactoe")({
  head: () => ({
    meta: [
      { title: "Tic Tac Toe — QwertzV2" },
      { name: "description", content: "İki oyunculu klasik XOX oyunu." },
    ],
  }),
  component: TicTacToe,
});

type Cell = "X" | "O" | null;

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function calcWinner(b: Cell[]): Cell {
  for (const [a, c, d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xNext, setXNext] = useState(true);
  const winner = calcWinner(board);
  const draw = !winner && board.every(Boolean);

  const click = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = xNext ? "X" : "O";
    setBoard(next);
    setXNext(!xNext);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXNext(true); };

  const status = winner ? `Kazanan: ${winner}` : draw ? "Berabere!" : `Sıra: ${xNext ? "X" : "O"}`;

  return (
    <GameShell title="Tic Tac Toe">
      <p className="mb-6 font-mono text-sm text-primary">{status}</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className="aspect-square rounded-xl border border-border bg-card text-5xl font-bold transition hover:bg-secondary hover:shadow-glow"
          >
            <span className={c === "X" ? "text-primary" : "text-accent"}>{c}</span>
          </button>
        ))}
      </div>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90"
      >
        Sıfırla
      </button>
    </GameShell>
  );
}
