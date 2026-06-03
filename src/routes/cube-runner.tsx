import { createFileRoute, Link } from "@tanstack/react-router";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/cube-runner")({
  head: () => ({
    meta: [
      { title: "Küp Koşusu 3D — QwertzV2" },
      { name: "description", content: "3D küp koşusu. Engellerden kaç." },
    ],
  }),
  component: Page,
});

function Player({ xRef }: { xRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.position.x += (xRef.current - ref.current.position.x) * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 4]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.5} />
    </mesh>
  );
}

type Obstacle = { id: number; x: number; z: number };

function Obstacles({
  obstacles,
  speedRef,
  onPass,
  onHit,
  playerXRef,
}: {
  obstacles: Obstacle[];
  speedRef: React.MutableRefObject<number>;
  onPass: (id: number) => void;
  onHit: () => void;
  playerXRef: React.MutableRefObject<number>;
}) {
  const refs = useRef<Record<number, THREE.Mesh | null>>({});
  useFrame((_, dt) => {
    for (const o of obstacles) {
      const mesh = refs.current[o.id];
      if (!mesh) continue;
      mesh.position.z += speedRef.current * dt;
      if (mesh.position.z > 4.5) onPass(o.id);
      if (mesh.position.z > 3.5 && mesh.position.z < 4.5) {
        if (Math.abs(mesh.position.x - playerXRef.current) < 1) onHit();
      }
    }
  });
  return (
    <>
      {obstacles.map((o) => (
        <mesh
          key={o.id}
          ref={(m) => {
            refs.current[o.id] = m;
          }}
          position={[o.x, 0.5, o.z]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 200]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
  );
}

function Page() {
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const xRef = useRef(0);
  const speedRef = useRef(8);
  const idRef = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (gameOver) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") xRef.current = Math.max(-3, xRef.current - 1.5);
      if (e.key === "ArrowRight" || e.key === "d") xRef.current = Math.min(3, xRef.current + 1.5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => {
      idRef.current += 1;
      const lane = [-3, -1.5, 0, 1.5, 3][Math.floor(Math.random() * 5)];
      setObstacles((prev) => [...prev, { id: idRef.current, x: lane, z: -30 }]);
      speedRef.current = Math.min(20, speedRef.current + 0.1);
    }, 700);
    return () => clearInterval(t);
  }, [gameOver]);

  const restart = () => {
    setScore(0);
    setObstacles([]);
    setGameOver(false);
    xRef.current = 0;
    speedRef.current = 8;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="font-mono text-xs text-primary">← geri</Link>
        <h1 className="mt-4 text-4xl font-bold gradient-text">Küp Koşusu 3D</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ok tuşları, ekrana dokunma veya alttaki düğmelerle yön değiştir.</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="font-mono text-2xl text-foreground">Skor: {score}</div>
          {gameOver && (
            <button onClick={restart} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-mono">
              Tekrar oyna
            </button>
          )}
        </div>

        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card">
          {mounted && (
            <Canvas shadows camera={{ position: [0, 4, 8], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
              <fog attach="fog" args={["#0f172a", 10, 30]} />
              <Ground />
              <Player xRef={xRef} />
              <Obstacles
                obstacles={obstacles}
                speedRef={speedRef}
                playerXRef={xRef}
                onPass={(id) => {
                  setObstacles((p) => p.filter((o) => o.id !== id));
                  setScore((s) => s + 1);
                }}
                onHit={() => setGameOver(true)}
              />
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}
