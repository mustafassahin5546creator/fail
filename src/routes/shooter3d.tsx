import { createFileRoute, Link } from "@tanstack/react-router";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/shooter3d")({
  head: () => ({
    meta: [
      { title: "3D Atış Talimi — QwertzV2" },
      { name: "description", content: "3D hedefleri tıkla, puan topla." },
    ],
  }),
  component: Page,
});

function Target({ position, onHit }: { position: [number, number, number]; onHit: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 2;
      ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 3) * 0.3;
    }
  });
  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onHit();
      }}
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = "crosshair"))}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <torusGeometry args={[0.6, 0.2, 16, 32]} />
      <meshStandardMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.6} />
    </mesh>
  );
}

type T = { id: number; pos: [number, number, number] };

function Page() {
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [targets, setTargets] = useState<T[]>([]);
  const idRef = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (time <= 0) return;
    const t = setInterval(() => setTime((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [time]);

  useEffect(() => {
    if (time <= 0) {
      setTargets([]);
      return;
    }
    const spawn = () => {
      idRef.current += 1;
      const pos: [number, number, number] = [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.3) * 3,
        -3 - Math.random() * 3,
      ];
      setTargets((p) => [...p, { id: idRef.current, pos }]);
    };
    const t = setInterval(spawn, 900);
    return () => clearInterval(t);
  }, [time]);

  const restart = () => {
    setScore(0);
    setTime(30);
    setTargets([]);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="font-mono text-xs text-primary">← geri</Link>
        <h1 className="mt-4 text-4xl font-bold gradient-text">3D Atış Talimi</h1>
        <p className="mt-2 text-sm text-muted-foreground">Halkalara tıkla. 30 saniyede en yüksek skoru yap.</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="font-mono text-2xl">Skor: {score}</div>
          <div className="font-mono text-2xl">Süre: {time}s</div>
          {time <= 0 && (
            <button onClick={restart} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-mono">
              Tekrar
            </button>
          )}
        </div>

        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1.5} />
              <color attach="background" args={["#0f172a"]} />
              {targets.map((t) => (
                <Target
                  key={t.id}
                  position={t.pos}
                  onHit={() => {
                    setTargets((p) => p.filter((x) => x.id !== t.id));
                    setScore((s) => s + 10);
                  }}
                />
              ))}
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}
