"use client";

import { createElement, Fragment, useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/Button";

// Minimal local stand-ins for framer-motion, which is not installed in this repo.
type Target = Record<string, unknown>;
type MotionProps = Omit<HTMLAttributes<HTMLElement>, "style"> & {
  initial?: Target | string | false;
  animate?: Target | string;
  exit?: Target;
  transition?: Target;
  variants?: Record<string, Target>;
  style?: Record<string, unknown>;
};
function motionTag(tag: string) {
  return function MotionElement({ initial, animate, exit, transition, variants, style, ...rest }: MotionProps) {
    void [initial, animate, exit, transition, variants];
    return createElement(tag, { ...rest, style });
  };
}
const motion = { div: motionTag("div"), ul: motionTag("ul"), li: motionTag("li"), h1: motionTag("h1") };
function MotionConfig({ children }: { children: ReactNode; reducedMotion?: "user" | "always" | "never" }) {
  return createElement(Fragment, null, children);
}
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduce;
}
function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; setScrollY(window.scrollY); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return { scrollY };
}
function useTransform(value: number, input: [number, number], output: [number, number]) {
  const t = Math.min(Math.max((value - input[0]) / (input[1] - input[0]), 0), 1);
  return output[0] + (output[1] - output[0]) * t;
}

const features = [
  { title: "Bank feeds", body: "Transactions arrive every morning from 2,400 banks." },
  { title: "Auto-matching", body: "Rules pair most entries before you open the app." },
  { title: "Receipt capture", body: "Forward an email or snap a photo and it is attached." },
  { title: "Close checklist", body: "Every task, owner and due date for month-end." },
];

const logos = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Hooli"];

export default function LandingPage() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 500], [0, -120]);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        html { scroll-behavior: smooth; }
        .marquee { overflow: hidden; }
        .marquee-track { animation: marquee 40s linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .reveal { opacity: 0; transition: opacity 250ms ease-out; }
        .reveal.in-view { opacity: 1; }
        .feature-card { transition: transform 200ms ease-out; }
        .feature-card:hover { transform: translateY(-2px); }
      `}</style>

      <div className="bg-surface text-ink">
        <header className="relative overflow-hidden">
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-brand/10 blur-lg" style={{ y: glowY }} />
          <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-8">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="max-w-2xl text-xl font-semibold">Close the books in days, not weeks</motion.h1>
            <p className="mt-4 max-w-xl text-md text-ink-muted">
              Reconcile accounts, chase receipts and review entries in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="active:scale-[0.97]">Start free trial</Button>
              <Button
                variant="secondary"
                className="active:scale-[0.97]"
                onClick={() => document.getElementById("features")?.scrollIntoView()}
              >
                See features
              </Button>
            </div>
          </div>
        </header>

        <section aria-label="Customers" className="marquee border-y border-ink/10 py-6">
          <div className="marquee-track flex w-max gap-12">
            {[...logos, ...logos].map((logo, i) => (
              <a
                key={`${logo}-${i}`}
                href={`/customers/${logo.toLowerCase()}`}
                tabIndex={i >= logos.length ? -1 : undefined}
                aria-hidden={i >= logos.length ? true : undefined}
                className="text-md font-medium text-ink-muted hover:text-ink"
              >
                {logo}
              </a>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-5xl px-4 py-20 sm:px-8">
          <h2 className="text-lg font-semibold">Everything month-end needs</h2>
          <motion.ul initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-8 grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <motion.li key={f.title} className="feature-card rounded-lg bg-surface-raised p-6">
                <h3 className="text-md font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{f.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section className="reveal mx-auto max-w-5xl px-4 py-20 text-center sm:px-8">
          <h2 className="text-lg font-semibold">Ready for month-end?</h2>
          <p className="mt-2 text-md text-ink-muted">Start free. No card needed.</p>
          <Button className="mt-6 active:scale-[0.97]">Start free trial</Button>
        </section>
      </div>
    </MotionConfig>
  );
}
