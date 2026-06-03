import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { GameShell } from "@/components/GameShell";
import { useSwipe } from "@/hooks/useSwipe";

export const Route = createFileRoute("/snake")({
  head: () => ({
    meta: [
      { title: "Yılan — QwertzV2" },
      { name: "description", content: "Klasik yılan oyunu, ok tuşlarıyla oyna." },
    ],
  }),
  component: SnakeGame,
});

const SIZE = 20;
const INITIAL = [{ x: 10, y: 10 }];

type Pt = { x: number; y: number };
type Dir = "U" | "D" | "L" | "R";

const randFood = (snake: Pt[]): Pt => {
  while (true) {
    const f = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
};

function SnakeGame() {
  const [snake, setSnake] = useState<Pt[]>(INITIAL);
  const [dir, setDir] = useState<Dir>("R");
  const [food, setFood] = useState<Pt>({ x: 5, y: 5 });
  const [dead, setDead] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const boardRef = useRef<HTMLDivElement>(null);

  const turn = useCallback((nd: Dir) => {
    const d = dirRef.current;
    if (nd === "U" && d !== "D") setDir("U");
    else if (nd === "D" && d !== "U") setDir("D");
    else if (nd === "L" && d !== "R") setDir("L");
    else if (nd === "R" && d !== "L") setDir("R");
  }, []);

  const reset = useCallback(() => {
    setSnake(INITIAL); setDir("R"); setFood(randFood(INITIAL)); setDead(false);
  }, []);

  useSwipe(boardRef, turn);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d !== "D") setDir("U");
      else if (e.key === "ArrowDown" && d !== "U") setDir("D");
      else if (e.key === "ArrowLeft" && d !== "R") setDir("L");
      else if (e.key === "ArrowRight" && d !== "L") setDir("R");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (dead) return;
    const id = setInterval(() => {
      setSnake((s) => {
        const head = s[0];
        const d = dirRef.current;
        const nh = {
          x: head.x + (d === "L" ? -1 : d === "R" ? 1 : 0),
          y: head.y + (d === "U" ? -1 : d === "D" ? 1 : 0),
        };
        if (nh.x < 0 || nh.x >= SIZE || nh.y < 0 || nh.y >= SIZE || s.some((p) => p.x === nh.x && p.y === nh.y)) {
          setDead(true);
          return s;
        }
        const ate = nh.x === food.x && nh.y === food.y;
        const next = [nh, ...s];
        if (!ate) next.pop();
        else setFood(randFood(next));
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [dead, food]);

  return (
    <GameShell title="Yılan">
      <p className="mb-4 font-mono text-sm text-primary">
        Skor: {snake.length - 1} {dead && "— ÖLDÜN!"}
      </p>
      <div
        className="grid bg-card border border-border rounded-xl p-2 mx-auto"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, width: "min(90vw, 500px)", aspectRatio: "1" }}
      >
      <div
        ref={boardRef}
        className="grid bg-card border border-border rounded-xl p-2 mx-auto touch-none select-none"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, width: "min(90vw, 500px)", aspectRatio: "1" }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          const isSnake = snake.some((p) => p.x === x && p.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={`rounded-sm ${isHead ? "bg-primary shadow-glow" : isSnake ? "bg-primary/70" : isFood ? "bg-accent shadow-magenta" : ""}`}
            />
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Ok tuşlarıyla veya tahtada kaydırarak oyna</p>
      <div className="mt-4 grid grid-cols-3 gap-2 max-w-[180px] mx-auto md:hidden">
        <div />
        <button onClick={() => turn("U")} className="rounded-md border border-border bg-card p-3 text-lg">↑</button>
        <div />
        <button onClick={() => turn("L")} className="rounded-md border border-border bg-card p-3 text-lg">←</button>
        <button onClick={() => turn("D")} className="rounded-md border border-border bg-card p-3 text-lg">↓</button>
        <button onClick={() => turn("R")} className="rounded-md border border-border bg-card p-3 text-lg">→</button>
      </div>
      {dead && (
        <button onClick={reset} className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90">
          Yeniden Başla
        </button>
      )}
    </GameShell>
  );
}
