import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { GameShell } from "../components/GameShell";

export const Route = createFileRoute("/twenty48")({
  head: () => ({ meta: [{ title: "2048 — QwertzV2" }] }),
  component: Twenty48,
});

type Grid = number[][];
const SIZE = 4;

const empty = (): Grid => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

function addRandom(g: Grid): Grid {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (g[r][c] === 0) cells.push([r, c]);
  if (cells.length === 0) return g;
  const [r, c] = cells[Math.floor(Math.random() * cells.length)];
  const ng = g.map((row) => [...row]);
  ng[r][c] = Math.random() < 0.9 ? 2 : 4;
  return ng;
}

function init(): Grid {
  return addRandom(addRandom(empty()));
}

function slide(row: number[]): { row: number[]; gained: number } {
  const a = row.filter((x) => x !== 0);
  let gained = 0;
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] === a[i + 1]) {
      a[i] *= 2;
      gained += a[i];
      a.splice(i + 1, 1);
    }
  }
  while (a.length < SIZE) a.push(0);
  return { row: a, gained };
}

function rotate(g: Grid): Grid {
  const ng = empty();
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) ng[c][SIZE - 1 - r] = g[r][c];
  return ng;
}

function move(g: Grid, dir: "L" | "R" | "U" | "D"): { grid: Grid; gained: number; moved: boolean } {
  let work = g.map((r) => [...r]);
  const rotations = dir === "L" ? 0 : dir === "U" ? 1 : dir === "R" ? 2 : 3;
  for (let i = 0; i < rotations; i++) work = rotate(work);
  let gained = 0;
  const result = work.map((row) => {
    const s = slide(row);
    gained += s.gained;
    return s.row;
  });
  let out = result;
  for (let i = 0; i < (4 - rotations) % 4; i++) out = rotate(out);
  const moved = JSON.stringify(out) !== JSON.stringify(g);
  return { grid: out, gained, moved };
}

function canMove(g: Grid): boolean {
  for (const d of ["L", "R", "U", "D"] as const) if (move(g, d).moved) return true;
  return false;
}

const tileColor = (n: number): string => {
  if (n === 0) return "bg-muted/30";
  if (n <= 4) return "bg-card text-foreground";
  if (n <= 16) return "bg-secondary text-secondary-foreground";
  if (n <= 128) return "bg-primary/70 text-primary-foreground";
  return "bg-primary text-primary-foreground shadow-glow";
};

function Twenty48() {
  const [grid, setGrid] = useState<Grid>(init);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const handle = useCallback(
    (dir: "L" | "R" | "U" | "D") => {
      setGrid((g) => {
        if (over) return g;
        const { grid: ng, gained, moved } = move(g, dir);
        if (!moved) return g;
        const withNew = addRandom(ng);
        setScore((s) => s + gained);
        if (!canMove(withNew)) setOver(true);
        return withNew;
      });
    },
    [over]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowLeft") { e.preventDefault(); handle("L"); }
      else if (k === "ArrowRight") { e.preventDefault(); handle("R"); }
      else if (k === "ArrowUp") { e.preventDefault(); handle("U"); }
      else if (k === "ArrowDown") { e.preventDefault(); handle("D"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handle]);

  const reset = () => { setGrid(init()); setScore(0); setOver(false); };

  return (
    <GameShell title="2048">
      <div className="text-center">
        <div className="flex justify-center gap-6 font-mono text-sm text-muted-foreground">
          <span>Skor: <span className="text-foreground">{score}</span></span>
          {over && <span className="text-destructive">Oyun bitti!</span>}
        </div>
        <div className="mt-6 mx-auto inline-grid grid-cols-4 gap-2 p-3 bg-card rounded-2xl border border-border">
          {grid.flat().map((n, i) => (
            <div
              key={i}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center font-bold text-xl md:text-2xl ${tileColor(n)}`}
            >
              {n || ""}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs font-mono text-muted-foreground">Ok tuşlarıyla oyna</p>
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-[180px] mx-auto md:hidden">
          <div />
          <button onClick={() => handle("U")} className="rounded-md border border-border bg-card p-2">↑</button>
          <div />
          <button onClick={() => handle("L")} className="rounded-md border border-border bg-card p-2">←</button>
          <button onClick={() => handle("D")} className="rounded-md border border-border bg-card p-2">↓</button>
          <button onClick={() => handle("R")} className="rounded-md border border-border bg-card p-2">→</button>
        </div>
        <button onClick={reset} className="mt-6 text-xs font-mono text-muted-foreground hover:text-primary">
          yeni oyun
        </button>
      </div>
    </GameShell>
  );
}
