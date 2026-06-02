import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QwertzV2 — Mini Oyun Arcade" },
      { name: "description", content: "Tarayıcıda oynanan ücretsiz mini oyunlar koleksiyonu: Tic Tac Toe, Yılan, Hafıza ve daha fazlası." },
      { property: "og:title", content: "QwertzV2 — Mini Oyun Arcade" },
      { property: "og:description", content: "Tarayıcıda oynanan ücretsiz mini oyunlar koleksiyonu." },
    ],
  }),
  component: Index,
});

const games = [
  { to: "/tictactoe", title: "Tic Tac Toe", desc: "Klasik XOX. İki oyunculu.", emoji: "⭕", accent: "shadow-glow" },
  { to: "/snake", title: "Yılan", desc: "Klavyeyle kontrol et, büyümeye devam et.", emoji: "🐍", accent: "shadow-magenta" },
  { to: "/memory", title: "Hafıza", desc: "Aynı kartları eşle, hızlı bitir.", emoji: "🧠", accent: "shadow-glow" },
  { to: "/guess", title: "Sayı Tahmin", desc: "1–100 arası gizli sayıyı bul.", emoji: "🎯", accent: "shadow-magenta" },
] as const;

function Index() {
  return (
    <div className="min-h-screen px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">qwertz · v2</p>
          <h1 className="mt-4 text-6xl md:text-8xl font-bold gradient-text text-glow">
            Mini Arcade
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Tarayıcında oyna. Kayıt yok, reklam yok. Sadece oyun.
          </p>
        </header>

        <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:${g.accent}`}
            >
              <div className="text-5xl">{g.emoji}</div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">{g.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
              <span className="mt-4 inline-block text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition">
                OYNA →
              </span>
            </Link>
          ))}
        </section>

        <footer className="mt-24 text-center text-xs text-muted-foreground font-mono">
          built with ♥ — qwertz v2
        </footer>
      </div>
    </div>
  );
}
