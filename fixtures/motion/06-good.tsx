"use client";

import { createElement, Fragment, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/Button";

// Minimal local stand-ins for framer-motion and canvas-confetti, which are not installed in this repo.
type Target = Record<string, unknown>;
type DragInfo = { offset: { x: number; y: number }; velocity: { x: number; y: number } };
type MotionProps = Omit<HTMLAttributes<HTMLElement>, "style" | "onDragEnd" | "onAnimationStart"> & {
  initial?: Target | string | false;
  animate?: Target | string;
  exit?: Target;
  drag?: "x" | "y" | boolean;
  dragConstraints?: Target;
  onDragEnd?: (event: PointerEvent, info: DragInfo) => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  style?: Record<string, unknown>;
};
function motionTag(tag: string) {
  return function MotionElement({ initial, animate, exit, drag, dragConstraints, onDragEnd, onAnimationStart, onAnimationComplete, style, ...rest }: MotionProps) {
    void [initial, animate, exit, drag, dragConstraints, onDragEnd, onAnimationStart, onAnimationComplete];
    return createElement(tag, { ...rest, style });
  };
}
const motion = { div: motionTag("div"), aside: motionTag("aside"), p: motionTag("p") };
function AnimatePresence({ children }: { children: ReactNode; initial?: boolean; mode?: "wait" | "sync" }) {
  return createElement(Fragment, null, children);
}
function MotionConfig({ children }: { children: ReactNode; reducedMotion?: "user" | "always" | "never" }) {
  return createElement(Fragment, null, children);
}
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduce;
}
function confetti(options: { particleCount: number; spread?: number }) {
  void options;
}

const tips = [
  "Leave the parcel at the door if nobody answers.",
  "Your driver can see the building code you added.",
  "Tap the driver card to call or message them.",
];

export default function OrderTracking() {
  const reduce = useReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tip, setTip] = useState(0);
  const [rated, setRated] = useState(false);
  const peekRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const progress = 0.64;

  function next() {
    setTip((t) => (t + 1) % tips.length);
  }

  function rate() {
    setRated(true);
    if (!reduce) confetti({ particleCount: 120, spread: 70 });
  }

  function onPeekDown(e: React.PointerEvent<HTMLDivElement>) {
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "true";
  }
  function onPeekMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null || !peekRef.current) return;
    const dy = Math.min(0, e.clientY - dragStart.current);
    peekRef.current.style.transform = `translateY(${dy}px)`;
  }
  function onPeekUp(e: React.PointerEvent<HTMLDivElement>) {
    dragStart.current = null;
    delete e.currentTarget.dataset.dragging;
    e.currentTarget.style.transform = "";
  }

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        .eta-fill { transform: scaleX(var(--progress)); transform-origin: left; transition: transform 300ms ease-out; }
        .peek { transition: transform 200ms cubic-bezier(0.32, 0.72, 0, 1); touch-action: none; }
        .peek[data-dragging="true"] { transition: none; }
        .fab { transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1); }
        .fab[data-raised="true"] { transform: translateY(-72px); }
        .drawer-backdrop { backdrop-filter: blur(8px); background: rgb(17 17 17 / 0.3); transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1); }
        .drawer-backdrop[data-open="false"] { opacity: 0; pointer-events: none; transition-duration: 200ms; transition-timing-function: ease-in; }
      `}</style>

      <div className="min-h-screen bg-surface-raised text-ink">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-surface/80 px-4 backdrop-blur-md">
          <h1 className="text-md font-semibold">Order #4471</h1>
          <button type="button" className="rounded-md px-3 py-2 text-sm" onClick={() => setDetailsOpen(true)}>
            Details
          </button>
        </header>

        <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-6">
          <section className="flex flex-col gap-2 rounded-lg bg-surface p-4">
            <p className="text-sm text-ink-muted">Arriving in about 12 minutes</p>
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="eta-fill h-full bg-success" style={{ ["--progress" as string]: progress }} />
            </div>
          </section>

          <div
            ref={peekRef}
            className="peek flex items-center gap-3 rounded-lg bg-surface p-4 shadow-sm"
            onPointerDown={onPeekDown}
            onPointerMove={onPeekMove}
            onPointerUp={onPeekUp}
          >
            <div className="size-10 rounded-full bg-brand/20" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Ana · Blue Volvo XC40</span>
              <span className="text-sm text-ink-muted">Drag up to call or message</span>
            </div>
          </div>

          <section className="flex flex-col gap-3 rounded-lg bg-surface p-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={tip}
                className="text-sm"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } }}
                exit={{ opacity: 0, x: -8, transition: { duration: 0.15, ease: "easeIn" } }}
              >
                {tips[tip]}
              </motion.p>
            </AnimatePresence>
            <div>
              <Button variant="secondary" className="active:scale-[0.97]" onClick={next}>
                Next tip
              </Button>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-lg bg-surface p-4">
            <p className="text-sm">{rated ? "Thanks for rating Ana!" : "How was your last delivery?"}</p>
            <div>
              <Button className="active:scale-[0.97]" onClick={rate} disabled={rated}>
                Rate 5 stars
              </Button>
            </div>
          </section>
        </main>

        <button
          type="button"
          className="fab fixed bottom-6 end-4 z-20 rounded-full bg-ink px-4 py-3 text-sm text-surface shadow-lg active:scale-[0.97]"
          data-raised={sheetOpen}
        >
          Help
        </button>

        <AnimatePresence>
          {sheetOpen && (
            <motion.div
              key="sheet"
              className="fixed inset-x-0 bottom-0 z-10 rounded-t-lg bg-surface p-4 pb-8 shadow-lg"
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 500) setSheetOpen(false); }}
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
              exit={{ y: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/20" aria-hidden="true" />
              <p className="text-sm font-medium">2 items · Paid with Visa •••• 4242</p>
              <button type="button" className="mt-2 text-sm text-brand" onClick={() => setSheetOpen(false)}>
                Hide
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="drawer-backdrop fixed inset-0 z-30" data-open={detailsOpen} onClick={() => setDetailsOpen(false)} />
        <AnimatePresence>
          {detailsOpen && (
            <motion.aside
              key="details"
              aria-label="Order details"
              className="fixed inset-y-0 end-0 z-40 w-80 max-w-full bg-surface p-6 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
              exit={{ x: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
            >
              <h2 className="text-lg font-semibold">Order details</h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                <li>Oat milk, 1 L × 2</li>
                <li>Sourdough loaf × 1</li>
              </ul>
              <button type="button" className="mt-6 text-sm text-brand" onClick={() => setDetailsOpen(false)}>
                Close
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
