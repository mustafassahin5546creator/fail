import { useEffect } from "react";

type Dir = "U" | "D" | "L" | "R";

export function useSwipe(
  ref: React.RefObject<HTMLElement | null>,
  onSwipe: (dir: Dir) => void,
  threshold = 24
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let sx = 0,
      sy = 0,
      active = false;
    const start = (x: number, y: number) => {
      sx = x;
      sy = y;
      active = true;
    };
    const end = (x: number, y: number) => {
      if (!active) return;
      active = false;
      const dx = x - sx,
        dy = y - sy;
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
      if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? "R" : "L");
      else onSwipe(dy > 0 ? "D" : "U");
    };
    const ts = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) start(t.clientX, t.clientY);
    };
    const te = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (t) end(t.clientX, t.clientY);
    };
    const tm = (e: TouchEvent) => {
      // prevent page scroll while swiping inside the play area
      if (active) e.preventDefault();
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchmove", tm, { passive: false });
    el.addEventListener("touchend", te);
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", te);
    };
  }, [ref, onSwipe, threshold]);
}
