import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

function WristIllustration({ veinColor = "#7c3aed" }) {
  return (
    <svg viewBox="0 0 260 180" className="h-full w-full">
      <defs>
        <linearGradient id="skinSoft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8e6da" />
          <stop offset="50%" stopColor="#f1d3c3" />
          <stop offset="100%" stopColor="#e7c0ad" />
        </linearGradient>
        <linearGradient id="skinGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f7e9e0" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="14" y="16" rx="26" ry="26" width="232" height="148" fill="url(#skinSoft)" />
      <rect x="32" y="36" rx="20" ry="20" width="196" height="108" fill="url(#skinGlow)" />
      <path d="M70 98 C98 64, 122 126, 144 94 S192 100, 216 72" stroke={veinColor} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M86 122 C108 104, 130 128, 154 114 S198 112, 214 98" stroke={veinColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const veinOptions = [
  {
    key: "cool",
    label: "Blue / Purple Veins",
    toneLabel: "Cool Undertone",
    toneName: "Cool Glow",
    veinColor: "#6366f1",
    badge: "bg-blue-600",
    glow: "ring-blue-300/80 shadow-[0_18px_40px_rgba(37,99,235,0.45)]",
    cards: "from-blue-600 via-indigo-600 to-purple-600"
  },
  {
    key: "warm",
    label: "Green Veins",
    toneLabel: "Warm Undertone",
    toneName: "Warm Glow",
    veinColor: "#22c55e",
    badge: "bg-orange-500",
    glow: "ring-orange-300/80 shadow-[0_18px_40px_rgba(255,122,0,0.45)]",
    cards: "from-orange-500 via-rose-500 to-pink-500"
  },
  {
    key: "neutral",
    label: "Mixed / Hard to Tell",
    toneLabel: "Neutral Undertone",
    toneName: "Balanced Glow",
    veinColor: "#14b8a6",
    badge: "bg-purple-600",
    glow: "ring-purple-300/80 shadow-[0_18px_40px_rgba(108,43,217,0.45)]",
    cards: "from-purple-500 via-blue-500 to-sky-500"
  }
];

const undertoneData = {
  cool: {
    badgeText: "Cool Tone",
    notIdeal: ["Icy pink", "Muted olive", "Warm mustard"],
    best: ["Blue", "Purple", "Emerald", "Pink", "Silver"],
    palette: ["#2563eb", "#7c3aed", "#10b981", "#ec4899", "#9ca3af"],
    productColors: ["Blue", "Purple", "Pink", "Green", "Grey"],
    searchTerms: ["blue", "purple", "pink", "emerald", "silver", "navy"],
    fallbackCategories: ["Dresses", "Tops", "Shirts", "Sarees"]
  },
  warm: {
    badgeText: "Warm Tone",
    notIdeal: ["Cool pink", "Icy blue", "Ash grey"],
    best: ["Orange", "Mustard", "Olive green", "Brown", "Gold"],
    palette: ["#f97316", "#f59e0b", "#84cc16", "#a16207", "#d4af37"],
    productColors: ["Gold", "Red", "Green", "Beige"],
    searchTerms: ["orange", "mustard", "olive", "brown", "gold", "red"],
    fallbackCategories: ["Kurtis", "Sarees", "Dresses", "Tops"]
  },
  neutral: {
    badgeText: "Neutral Tone",
    notIdeal: ["Very icy tones", "Very neon tones"],
    best: ["Soft pastels", "Balanced tones", "Most colors"],
    palette: ["#f9a8d4", "#bfdbfe", "#ddd6fe", "#a7f3d0", "#fde68a"],
    productColors: ["Beige", "Pink", "Blue", "Grey"],
    searchTerms: ["beige", "cream", "pastel", "soft", "neutral", "teal"],
    fallbackCategories: ["Dresses", "Tops", "Jeans", "Handbags"]
  }
};

export function UndertoneFinder() {
  const [selected, setSelected] = useState(null);
  const selectedData = selected ? undertoneData[selected] : null;
  const selectedOption = veinOptions.find((option) => option.key === selected);

  const palette = useMemo(() => (selectedData ? selectedData.palette : []), [selectedData]);

  const handleSelect = (toneKey) => {
    setSelected(toneKey);
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
      <div className="pointer-events-none absolute left-0 top-16 -z-10 h-72 w-72 rounded-full bg-pink-300/40 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-32 -z-10 h-80 w-80 rounded-full bg-blue-300/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-6 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-300/40 blur-[160px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-20 -z-10 h-56 w-56 rounded-full bg-orange-200/50 blur-[120px]" />
      <div className="relative overflow-hidden rounded-[32px] card-gradient p-8 shadow-[0_30px_80px_rgba(37,99,235,0.25)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-pink-300/25 blur-3xl" />
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-600">
          <Sparkles size={14} /> VeinGlow Finder
        </span>
        <h1 className="display-font mt-2 text-3xl text-neutral-900">Find Your Perfect Fashion Colors</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(37,99,235,0.18)]">
          <div className="h-20 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-amber-50 to-rose-100 shadow-[0_10px_20px_rgba(139,92,246,0.12)]">
            <WristIllustration veinColor="#a855f7" />
          </div>
          <p className="text-sm text-neutral-600">
            Look at the veins on the inside of your wrist under natural light. Select the image that most closely matches your vein color.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {veinOptions.map((option) => {
          const active = selected === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSelect(option.key)}
              className={`group relative overflow-hidden rounded-3xl border bg-white p-5 text-left shadow-[0_18px_36px_rgba(139,92,246,0.12)] transition duration-300 ${
                active ? `border-white/80 ring-4 ${option.glow} scale-[1.02]` : "border-slate-100 hover:-translate-y-1 hover:border-pink-300"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${option.cards} opacity-95`} />
              <div className="relative">
                <div className="h-32 overflow-hidden rounded-2xl bg-white/70 p-2 shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
                  <WristIllustration veinColor={option.veinColor} />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-white">{option.label}</p>
                  <p className="text-xs text-white/90">{option.toneLabel}</p>
                </div>
              </div>
              {active && (
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold text-neutral-800">Your VeinGlow Style Tone</h2>
          {!selectedData ? (
            <p className="mt-3 text-sm text-neutral-500">Pick a vein image to reveal your style tone and glow colors.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 shadow-[0_12px_24px_rgba(139,92,246,0.12)]">
                <div className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${selectedOption?.badge || "bg-purple-500"}`}>
                  {selectedData.badgeText}
                </div>
                <p className="text-lg font-semibold text-neutral-900">{selectedOption?.toneName}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                  <p className="text-xs font-semibold uppercase text-rose-600">Colors that may not suit</p>
                  <div className="mt-2 space-y-1 text-sm text-neutral-700">
                    {selectedData.notIdeal.map((item) => <p key={item}>{item}</p>)}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-[0_12px_24px_rgba(16,185,129,0.2)]">
                  <p className="text-xs font-semibold uppercase text-emerald-600">Colors that make you glow</p>
                  <div className="mt-2 space-y-1 text-sm text-neutral-700">
                    {selectedData.best.map((item) => <p key={item}>{item}</p>)}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700">Recommended color palette</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {palette.map((color) => (
                    <span key={color} className="h-10 w-10 rounded-full border border-white shadow-[0_10px_20px_rgba(0,0,0,0.12)]" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
