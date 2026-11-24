type Plan = { name: string; price: number; features: string[] };

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="rounded-[14px] border border-gray-200 bg-white p-[22px] shadow-[0_8px_30px_rgba(124,58,237,0.35)] transition-all hover:scale-105">
      <h4 className="text-[17px] font-bold text-[#111827]">{plan.name}</h4>
      <div className="mt-[10px] text-[38px] font-black text-[#6366f1]">${plan.price}</div>
      <ul className="mt-[14px] space-y-[6px] text-[13px] text-gray-600">
        {plan.features.map((f) => (
          <li key={f}>✅ {f}</li>
        ))}
      </ul>
      <button className="mt-[18px] w-full rounded-[10px] bg-gradient-to-r from-purple-600 to-pink-500 py-[9px] text-white shadow-lg shadow-purple-500/50">
        Choose {plan.name}
      </button>
    </div>
  );
}
