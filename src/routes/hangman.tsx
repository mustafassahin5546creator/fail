import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GameShell } from "../components/GameShell";

export const Route = createFileRoute("/hangman")({
  head: () => ({ meta: [{ title: "Adam Asmaca — QwertzV2" }] }),
  component: Hangman,
});

const words = [
  "istanbul", "elma", "bilgisayar", "kahve", "yildiz",
  "okyanus", "muzik", "kitap", "kelebek", "gunes",
  "kalem", "pencere", "orman", "arkadas", "telefon",
];
const alphabet = "abcçdefgğhıijklmnoöprsştuüvyz".split("");
const MAX_WRONG = 6;

function Hangman() {
  const [word, setWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const wrong = useMemo(() => [...picked].filter((l) => !word.includes(l)).length, [picked, word]);
  const won = useMemo(() => word.split("").every((l) => picked.has(l)), [picked, word]);
  const lost = wrong >= MAX_WRONG;
  const done = won || lost;

  const pick = (l: string) => {
    if (done || picked.has(l)) return;
    setPicked(new Set([...picked, l]));
  };

  const reset = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setPicked(new Set());
  };

  return (
    <GameShell title="Adam Asmaca">
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-mono">
          Yanlış: {wrong} / {MAX_WRONG}
        </p>
        <div className="mt-8 flex justify-center gap-2 text-3xl md:text-4xl font-mono tracking-widest">
          {word.split("").map((l, i) => (
            <span key={i} className="border-b-2 border-border w-8 md:w-10 inline-block">
              {picked.has(l) || lost ? l : "\u00A0"}
            </span>
          ))}
        </div>
        {done && (
          <p className="mt-6 text-lg gradient-text font-semibold">
            {won ? "Kazandın!" : `Kaybettin — kelime: ${word}`}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
          {alphabet.map((l) => {
            const used = picked.has(l);
            const correct = used && word.includes(l);
            return (
              <button
                key={l}
                onClick={() => pick(l)}
                disabled={used || done}
                className={`w-9 h-9 rounded-md border border-border font-mono uppercase transition ${
                  used
                    ? correct
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground opacity-50"
                    : "bg-card hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
        <button
          onClick={reset}
          className="mt-8 text-xs font-mono text-muted-foreground hover:text-primary"
        >
          yeni kelime
        </button>
      </div>
    </GameShell>
  );
}
