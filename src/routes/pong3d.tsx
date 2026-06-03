import { createFileRoute, Link } from "@tanstack/react-router";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/pong3d")({
  head: () => ({
    meta: [
      { title: "3D Pong — QwertzV2" },
      { name: "description", content: "Klasik Pong'un 3D versiyonu." },
    ],
  }),
  component: Page,
});

function Scene({
  paddleXRef,
  onScore,
  resetSignal,
}: {
  paddleXRef: React.MutableRefObject<number>;
  onScore: (won: boolean) => void;
  resetSignal: number;
}) {
  const ball = useRef<THREE.Mesh>(null);
  const player = useRef<THREE.Mesh>(null);
  const ai = useRef<THREE.Mesh>(null);
  const vel = useRef<[number, number]>([6, 5]);

  useEffect(() => {
    if (ball.current) ball.current.position.set(0, 0.5, 0);
    vel.current = [Math.random() > 0.5 ? 6 : -6, Math.random() > 0.5 ? 5 : -5];
  }, [resetSignal]);

  useFrame((_, dt) => {
    if (!ball.current || !player.current || !ai.current) return;
    player.current.position.x += (paddleXRef.current - player.current.position.x) * 0.3;
    ai.current.position.x += (ball.current.position.x - ai.current.position.x) * 0.05;
    ai.current.position.x = Math.max(-3.5, Math.min(3.5, ai.current.position.x));

    ball.current.position.x += vel.current[0] * dt;
    ball.current.position.z += vel.current[1] * dt;

    if (ball.current.position.x > 4.5 || ball.current.position.x < -4.5) vel.current[0] *= -1;

    // Player paddle at z=4
    if (
      ball.current.position.z > 3.7 &&
      ball.current.position.z < 4 &&
      Math.abs(ball.current.position.x - player.current.position.x) < 1
    ) {
      vel.current[1] = -Math.abs(vel.current[1]) * 1.05;
    }
    // AI paddle at z=-4
    if (
      ball.current.position.z < -3.7 &&
      ball.current.position.z > -4 &&
      Math.abs(ball.current.position.x - ai.current.position.x) < 1
    ) {
      vel.current[1] = Math.abs(vel.current[1]) * 1.05;
    }

    if (ball.current.position.z > 5) onScore(false);
    if (ball.current.position.z < -5) onScore(true);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <color attach="background" args={["#0f172a"]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh ref={ball} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={player} position={[0, 0.5, 4]}>
        <boxGeometry args={[2, 0.5, 0.3]} />
        <meshStandardMaterial color="#22d3ee" />
      </mesh>
      <mesh ref={ai} position={[0, 0.5, -4]}>
        <boxGeometry args={[2, 0.5, 0.3]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>
    </>
  );
}

function Page() {
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState({ p: 0, a: 0 });
  const [reset, setReset] = useState(0);
  const paddleXRef = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const move = (clientX: number) => {
      if (!boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect();
      const t = (clientX - r.left) / r.width;
      paddleXRef.current = (t - 0.5) * 8;
    };
    const mm = (e: MouseEvent) => move(e.clientX);
    const tm = (e: TouchEvent) => e.touches[0] && move(e.touches[0].clientX);
    const el = boxRef.current;
    el?.addEventListener("mousemove", mm);
    el?.addEventListener("touchmove", tm);
    return () => {
      el?.removeEventListener("mousemove", mm);
      el?.removeEventListener("touchmove", tm);
    };
  }, [mounted]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="font-mono text-xs text-primary">← geri</Link>
        <h1 className="mt-4 text-4xl font-bold gradient-text">3D Pong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Fareni alanda gezdir, mavi paleti kontrol et.</p>

        <div className="mt-6 flex items-center gap-6 font-mono text-2xl">
          <span className="text-cyan-400">Sen: {score.p}</span>
          <span className="text-pink-400">AI: {score.a}</span>
        </div>

        <div
          ref={boxRef}
          className="mt-4 aspect-video w-full cursor-none overflow-hidden rounded-2xl border border-border bg-card touch-none select-none"
        >
          {mounted && (
            <Canvas camera={{ position: [0, 6, 7], fov: 55 }}>
              <Scene
                paddleXRef={paddleXRef}
                resetSignal={reset}
                onScore={(won) => {
                  setScore((s) => ({ p: s.p + (won ? 1 : 0), a: s.a + (won ? 0 : 1) }));
                  setReset((r) => r + 1);
                }}
              />
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}
