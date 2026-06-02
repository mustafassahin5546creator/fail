import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function GameShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition">
          ← Ana sayfa
        </Link>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold gradient-text">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
