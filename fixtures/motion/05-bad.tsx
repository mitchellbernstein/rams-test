"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/Button";

type Range = "7d" | "30d" | "90d";

const series: Record<Range, number[]> = {
  "7d": [12, 18, 9, 22, 17, 25, 21],
  "30d": [40, 52, 47, 61, 58, 66, 72],
  "90d": [120, 134, 129, 150, 161, 158, 172],
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

function CountUp({ value }: { value: number }) {
  const reduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 600, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }, [value, reduce]);
  return <span>{fmt(display)}</span>;
}

function UsageMeter({ pct }: { pct: number }) {
  const bar = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    if (reduce) {
      el.style.transform = `scaleX(${pct / 100})`;
      return;
    }
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + 2, pct);
      el.style.transform = `scaleX(${current / 100})`;
      if (current >= pct) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [pct, reduce]);
  return (
    <div className="h-2 overflow-hidden rounded-full bg-ink/10" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Transactions used">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-brand" />
    </div>
  );
}

function drawGlobe(canvas: HTMLCanvasElement, angle: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < 24; i++) {
    const a = angle + (i / 24) * Math.PI * 2;
    ctx.fillStyle = "#1f4fd1";
    ctx.beginPath();
    ctx.arc(width / 2 + Math.cos(a) * 60, height / 2 + Math.sin(a * 2) * 30, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createGlobePlayer(canvas: HTMLCanvasElement) {
  let raf = 0;
  let angle = 0;
  const draw = () => {
    angle += 0.01;
    drawGlobe(canvas, angle);
    raf = requestAnimationFrame(draw);
  };
  return {
    play() {
      if (!raf) raf = requestAnimationFrame(draw);
    },
    pause() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

function LiveMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (reduce) {
      drawGlobe(canvas, 0);
      return;
    }
    const player = createGlobePlayer(canvas);
    player.play();
    return () => player.destroy();
  }, [reduce]);
  return <canvas ref={canvasRef} width={240} height={120} aria-label="Live payment activity by region" className="w-full" />;
}

function Spinner() {
  return <span aria-hidden="true" className="size-4 rounded-full border-2 border-ink/20 border-t-ink motion-safe:animate-spin" />;
}

export default function AnalyticsDashboard() {
  const reduce = usePrefersReducedMotion();
  const [range, setRange] = useState<Range>("30d");
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const refreshIcon = useRef<SVGSVGElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function selectRange(next: Range) {
    document.startViewTransition(() => setRange(next));
  }

  async function refresh() {
    const spin = [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }];
    refreshIcon.current?.animate(spin, { duration: 300, easing: "ease-out" });
    setLoading(true);
    await fetch("/api/metrics?refresh=1");
    setLoading(false);
  }

  const values = series[range];
  const max = Math.max(...values);

  return (
    <div className="min-h-screen bg-surface-raised text-ink">
      <style>{`
        .spotlight { background: radial-gradient(240px circle at var(--x, 50%) var(--y, 50%), rgb(31 79 209 / 0.08), transparent 70%), var(--color-surface); }
      `}</style>

      <header className={`sticky top-0 z-10 bg-surface transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <h1 className="text-lg font-semibold">Revenue</h1>
          <div className="flex items-center gap-3">
            {loading && <Spinner />}
            <select aria-label="Range" value={range} onChange={(e) => selectRange(e.target.value as Range)} className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-sm">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button variant="secondary" className="gap-2 active:scale-[0.97]" onClick={refresh}>
              <svg ref={refreshIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-4">
                <path d="M20 12a8 8 0 11-2.3-5.7M20 4v5h-5" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-8 md:grid-cols-3">
        <div onPointerMove={(e) => setSpot({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })} style={{ "--x": `${spot.x}px`, "--y": `${spot.y}px` } as CSSProperties} className="spotlight flex flex-col gap-2 rounded-lg p-6 shadow-sm md:col-span-2">
          <span className="text-sm text-ink-muted">Net revenue</span>
          <span className="text-xl font-semibold tabular-nums">
            <CountUp value={84210} />
          </span>
          <div className="mt-4 flex h-40 items-end gap-2">
            {values.map((v, i) => (
              <div key={i} className="flex-1 rounded-sm bg-brand/70" style={{ height: `${(v / max) * 100}%` }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-surface p-6 shadow-sm">
          <span className="text-sm text-ink-muted">Plan usage</span>
          <UsageMeter pct={68} />
          <span className="text-sm">6,800 of 10,000 transactions</span>
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-surface p-6 shadow-sm md:col-span-3">
          <span className="text-sm text-ink-muted">Live activity</span>
          <LiveMap />
        </div>
      </main>
    </div>
  );
}
