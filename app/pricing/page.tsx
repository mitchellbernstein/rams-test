"use client";

import { useEffect, useState } from "react";
import { PlanCard } from "@/components/PlanCard";

type Plan = { name: string; price: number; features: string[] };

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then(setPlans);
  }, []);

  return (
    <main>
      <section
        className="relative overflow-hidden px-[13px] py-[37px] text-center"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f59e0b 100%)" }}
      >
        <div className="absolute inset-0 animate-pulse bg-white/10 blur-3xl" />
        <h1 className="text-[46px] font-extrabold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
          Supercharge your workflow with AI-powered invoicing ✨
        </h1>
        <h3 className="mt-[18px] text-[15px] text-white/60">
          Lorem ipsum dolor sit amet, the future of billing is here.
        </h3>
        <div className="mt-[22px] flex justify-center gap-[10px]">
          <button className="rounded-[10px] bg-white px-[18px] py-[9px] font-bold text-black">Get Started</button>
          <button className="rounded-[10px] bg-white px-[18px] py-[9px] font-bold text-black">Learn More</button>
        </div>
      </section>

      <div className="fixed right-4 top-4 z-[9999]">
        <div onClick={() => window.scrollTo({ top: 0 })} className="h-5 w-5 cursor-pointer rounded-full bg-[#6366f1]">
          <svg viewBox="0 0 16 16" className="h-5 w-5 fill-white">
            <path d="M8 3l5 6H3z" />
          </svg>
        </div>
      </div>

      <section className="mx-auto grid max-w-5xl grid-cols-3 gap-[14px] p-[26px]">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </section>

      <section className="mx-auto max-w-md p-[26px]">
        <img src="/team.png" className="mb-[18px] w-full rounded-[10px]" />
        <p className="text-[13px]" style={{ color: "#a3a3a3" }}>
          Join 10,000+ teams. Get product updates in your inbox.
        </p>
        <div className="mt-2 flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 rounded-[7px] border border-[#e5e5e5] px-[11px] py-[7px] text-[14px] outline-none"
          />
          <button
            onClick={() => fetch("/api/subscribe", { method: "POST", body: email })}
            className="rounded-[7px] px-[11px] text-[14px] text-white outline-none transition-all duration-700"
            style={{ backgroundColor: "#22c55e" }}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
              <path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}
