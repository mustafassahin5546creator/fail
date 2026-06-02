import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { GameShell } from "../components/GameShell";

export const Route = createFileRoute("/reaction")({
  head: () => ({ meta: [{ title: "Reaksiyon — QwertzV2" }] }),
  component: Reaction,
});

type State = "idle" | "waiting" | "go" | "done" | "early";

function Reaction() {
  const [state, setState] = useState<State>("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const begin = () => {
    setState("waiting");
    const delay = 1000 + Math.random() * 3000;
    timerRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setState("go");
    }, delay);
  };

  const click = () => {
    if (state === "idle" || state === "done" || state === "early") {
      begin();
    } else if (state === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("early");
    } else if (state === "go") {
      const t = Math.round(performance.now() - startRef.current);
      setMs(t);
      setBest((b) => (b === null || t < b ? t : b));
      setState("done");
    }
  };

  const bg =
    state === "waiting" ? "bg-destructive" :
    state === "go" ? "bg-primary" :
    state === "early" ? "bg-secondary" : "bg-card";

  const label =
    state === "idle" ? "Başlamak için tıkla" :
    state === "waiting" ? "Bekle... yeşili bekle" :
    state === "go" ? "TIKLA!" :
    state === "early" ? "Çok erken! tekrar dene" :
    `${ms} ms — tekrar?`;

  return (
    <GameShell title="Reaksiyon">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {best !== null ? `En iyi: ${best} ms` : "İlk denemeni yap."}
        </p>
        <button
          onClick={click}
          className={`mt-6 w-full h-80 rounded-3xl border border-border ${bg} text-2xl font-semibold text-foreground transition`}
        >
          {label}
        </button>
      </div>
    </GameShell>
  );
}
