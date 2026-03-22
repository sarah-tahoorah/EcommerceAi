import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloudSun, Palette, Sparkles, Waves, UserRound } from "lucide-react";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useFadeIn } from "../hooks/useFadeIn";

const categoryTiles = [
  { name: "Dresses", image: "/dresses-category.jpg", position: "center top" },
  { name: "Sarees", image: "/sarees-category.jpg", position: "center top" },
  { name: "Shoes", image: "/shoes-category.jpg", position: "center center" },
  { name: "Heels", image: "/heels-category.jpg", position: "center bottom" },
  { name: "Handbags", image: "/handbags-category.jpg", position: "center center" },
  { name: "Kids Wear", image: "/kidswear-category.jpg", position: "center 18%" }
];

const aiFeatureCards = [
  {
    key: "veinglow",
    title: "VeinGlow Finder",
    description: "Discover undertone-driven colors, metals, and palette directions that flatter instantly.",
    button: "Try VeinGlow",
    accent: "from-[#ff77a8] via-[#ff2e63] to-[#7c3aed]",
    surface: "bg-[linear-gradient(180deg,#fff4f8_0%,#f7efff_100%)]",
    border: "border-[#f3c5d7]",
    buttonColor: "bg-[#ff2e63] hover:bg-[#e32659]",
    iconBg: "bg-[linear-gradient(135deg,#ffe0ec_0%,#efe2ff_100%)]",
    glow: "bg-[#ff2e63]/12",
    Icon: Waves,
    action: "link"
  },
  {
    key: "bodyshape",
    title: "AI Body Shape",
    description: "Get fit-aware guidance and silhouette-based recommendations tailored to your proportions.",
    button: "Try Body Shape AI",
    accent: "from-[#7c3aed] via-[#4f46e5] to-[#2563eb]",
    surface: "bg-[linear-gradient(180deg,#f5f3ff_0%,#eef4ff_100%)]",
    border: "border-[#cdd6ff]",
    buttonColor: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    iconBg: "bg-[linear-gradient(135deg,#ece4ff_0%,#dceaff_100%)]",
    glow: "bg-[#2563eb]/12",
    Icon: UserRound,
    action: "product"
  },
  {
    key: "weather",
    title: "Weather AI Insight",
    description: "Choose pieces with confidence using comfort-focused insights for every weather condition.",
    button: "Try Weather Insight",
    accent: "from-[#38bdf8] via-[#14b8a6] to-[#0f766e]",
    surface: "bg-[linear-gradient(180deg,#effcfb_0%,#eef8ff_100%)]",
    border: "border-[#bfe9e3]",
    buttonColor: "bg-[#14b8a6] hover:bg-[#0fa495]",
    iconBg: "bg-[linear-gradient(135deg,#dcfbf5_0%,#dff2ff_100%)]",
    glow: "bg-[#14b8a6]/12",
    Icon: CloudSun,
    action: "product"
  },
  {
    key: "style",
    title: "Find Your Fashion Style",
    description: "Reveal your signature fashion personality through a quick quiz and tailored recommendations.",
    button: "Start Style Quiz",
    accent: "from-[#ffb45f] via-[#ff7a00] to-[#ff2e63]",
    surface: "bg-[linear-gradient(180deg,#fff7ed_0%,#fff1f4_100%)]",
    border: "border-[#ffd8bb]",
    buttonColor: "bg-[#ff7a00] hover:bg-[#eb6f00]",
    iconBg: "bg-[linear-gradient(135deg,#ffe7cc_0%,#ffe2ea_100%)]",
    glow: "bg-[#ff7a00]/12",
    Icon: Sparkles,
    action: "scroll"
  }
];

export function HomePage() {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [quiz, setQuiz] = useState({
    favoriteColors: [],
    preferredStyle: "Casual",
    budgetRange: "2000-5000",
    occasion: "Daily wear",
    clothingType: "Dresses"
  });
  const [quizStep, setQuizStep] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const categoriesRef = useFadeIn();
  const trendingRef = useFadeIn();
  const arrivalsRef = useFadeIn();
  const quizRef = useFadeIn();
  const aiFeatureRef = useFadeIn();

  useEffect(() => {
    api.get("/products?sort=popularity&limit=8").then((r) => setTrending(r.data.items));
    api.get("/products?sort=newest&limit=8").then((r) => setNewArrivals(r.data.items));
  }, []);

  const toggleColor = (color) => {
    setQuiz((prev) => {
      const exists = prev.favoriteColors.includes(color);
      return {
        ...prev,
        favoriteColors: exists
          ? prev.favoriteColors.filter((c) => c !== color)
          : [...prev.favoriteColors, color]
      };
    });
  };

  const runQuiz = async () => {
    setQuizLoading(true);
    setQuizResult(null);
    try {
      const { data } = await api.post("/ai/style-quiz", quiz);
      setQuizResult(data);
    } finally {
      setQuizLoading(false);
    }
  };

  const aiFeatureTarget = trending[0]?._id || newArrivals[0]?._id;
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-12 lg:space-y-14">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[#fdf2f8] px-6 py-10 text-text-primary shadow-[0_10px_24px_rgba(0,0,0,0.08)] md:px-10 lg:min-h-[560px] lg:px-12 lg:py-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,46,99,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.08),transparent_24%)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.34em] text-[#ff2e63]">
              Glamora Edit
            </div>
            <h1 className="display-font mt-6 max-w-2xl text-5xl leading-[0.92] tracking-[-0.04em] text-text-primary md:text-6xl lg:text-[5.2rem]">
              Own the Spotlight with Glamora
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary">
              Trendy styles, AI-powered fashion, and outfits made just for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/category" className="rounded-full bg-[#ff2e63] px-7 py-3.5 text-base font-semibold text-white shadow-[0_6px_16px_rgba(255,46,99,0.18)] transition hover:scale-[1.02] hover:bg-[#e32659]">
                Shop Now
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection(aiFeatureRef)}
                className="rounded-full border border-[#7c3aed] bg-white px-7 py-3.5 text-base font-semibold text-[#7c3aed] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition hover:scale-[1.02] hover:bg-[#f5f3ff]"
              >
                Explore AI Features
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white px-4 py-2 text-[#ff2e63] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">Trending</span>
              <span className="rounded-full bg-white px-4 py-2 text-[#7c3aed] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">AI Powered</span>
              <span className="rounded-full bg-white px-4 py-2 text-[#2563eb] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">New Collection</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -left-2 top-10 hidden rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff2e63] shadow-[0_4px_12px_rgba(0,0,0,0.08)] lg:flex">
              Trending
            </div>
            <div className="absolute -right-2 bottom-14 hidden rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7c3aed] shadow-[0_4px_12px_rgba(0,0,0,0.08)] lg:flex">
              AI Powered
            </div>
            <div className="relative mx-auto max-w-[620px]">
              <div className="absolute inset-[10%] rounded-full bg-[#7c3aed]/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-black/8 bg-white p-3 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <div className="overflow-hidden rounded-[20px]">
                  <img
                    src="/hero.jpg"
                    alt="Elegant Glamora muse portrait in a luxury fashion look"
                    className="h-[460px] w-full object-cover object-top transition duration-500 hover:scale-[1.02] lg:h-[540px]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section
        ref={aiFeatureRef}
        className="fade-in relative overflow-hidden rounded-[30px] border border-black/5 bg-[linear-gradient(135deg,#fff8fb_0%,#f4f0ff_36%,#edf6ff_72%,#f1fbf6_100%)] p-6 pt-8 shadow-[0_12px_28px_rgba(17,24,39,0.08)] lg:p-8"
      >
        <div className="pointer-events-none absolute -left-12 top-10 h-36 w-36 rounded-full bg-[#ff2e63]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-6 h-28 w-28 rounded-full bg-[#7c3aed]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 left-1/3 h-28 w-28 rounded-full bg-[#14b8a6]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(17,24,39,0.06)_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">AI Edit</p>
          <h2 className="display-font mt-2 text-3xl text-text-primary lg:text-4xl">Explore AI Features</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
            Discover Glamora's smart styling tools for undertone matching, body shape guidance, weather-aware comfort insights, and style discovery.
          </p>
        </div>
        <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {aiFeatureCards.map((feature, index) => {
            const Icon = feature.Icon;
            const action =
              feature.action === "link" ? (
                <Link
                  to="/veinglow-finder"
                  className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(17,24,39,0.12)] transition hover:scale-[1.02] ${feature.buttonColor}`}
                >
                  {feature.button}
                </Link>
              ) : feature.action === "scroll" ? (
                <button
                  type="button"
                  onClick={() => scrollToSection(quizRef)}
                  className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(17,24,39,0.12)] transition hover:scale-[1.02] ${feature.buttonColor}`}
                >
                  {feature.button}
                </button>
              ) : aiFeatureTarget ? (
                <Link
                  to={`/product/${aiFeatureTarget}`}
                  className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(17,24,39,0.12)] transition hover:scale-[1.02] ${feature.buttonColor}`}
                >
                  {feature.button}
                </Link>
              ) : null;

            return (
              <motion.article
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-[24px] border ${feature.border} ${feature.surface} p-6 shadow-[0_10px_24px_rgba(17,24,39,0.08)]`}
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${feature.accent}`} />
                <div className={`pointer-events-none absolute -right-8 top-10 h-24 w-24 rounded-full ${feature.glow} blur-2xl transition duration-300 group-hover:scale-125`} />
                <div className="pointer-events-none absolute right-5 top-5 h-10 w-10 rounded-full border border-white/40 bg-white/30" />
                <div className="pointer-events-none absolute bottom-5 left-5 h-6 w-6 rounded-full border border-black/5 bg-white/40" />
                <motion.div
                  whileHover={{ rotate: 4, scale: 1.05 }}
                  className={`relative flex h-16 w-16 items-center justify-center rounded-[20px] ${feature.iconBg} text-text-primary shadow-[0_10px_22px_rgba(17,24,39,0.08)]`}
                >
                  <Icon size={28} />
                </motion.div>
                <div className="mt-5 inline-flex rounded-full border border-black/5 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  AI Feature
                </div>
                <h3 className="display-font mt-4 text-[1.9rem] leading-tight text-text-primary">{feature.title}</h3>
                <p className="mt-3 min-h-[88px] text-sm leading-7 text-text-secondary">{feature.description}</p>
                {action}
              </motion.article>
            );
          })}
        </div>
      </section>

      <section ref={categoriesRef} className="fade-in section-blue rounded-[24px] border border-black/5 p-6 pt-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] lg:p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Browse Edits</p>
            <h2 className="display-font mt-2 text-3xl text-text-primary">Categories</h2>
          </div>
          <Link to="/category" className="text-sm uppercase tracking-[0.22em] text-[#2563eb]">Explore All</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTiles.map((cat) => (
            <Link
              key={cat.name}
              className="group card-hover relative min-h-[320px] overflow-hidden rounded-[20px] border border-black/8 bg-card shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              to={`/category?category=${encodeURIComponent(cat.name)}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover contrast-[0.96] brightness-[0.9] transition duration-500 group-hover:scale-[1.02]"
                style={{ objectPosition: cat.position || "center" }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.08)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.34)_100%)] transition duration-300 group-hover:bg-[linear-gradient(180deg,rgba(37,99,235,0.14)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.42)_100%)]" />
              <div className="absolute inset-0 border border-white/10" />
              <div className="relative z-10 flex h-full items-end p-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-white/72">Collection</p>
                  <h3 className="display-font text-2xl text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section ref={trendingRef} className="fade-in px-1 py-2">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Hot Right Now</p>
            <h2 className="display-font mt-2 text-3xl text-text-primary">Trending Fashion</h2>
          </div>
          <span className="rounded-full border border-black/8 bg-[#fdf2f8] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#ff2e63]">Trending</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((item) => <ProductCard key={item._id} item={item} badge="Trending" badgeTone="hot" />)}
        </div>
      </section>

      <section ref={arrivalsRef} className="fade-in section-pink rounded-[24px] border border-black/5 p-6 pt-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] lg:p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Fresh Drop</p>
            <h2 className="display-font mt-2 text-3xl text-text-primary">New Arrivals</h2>
          </div>
          <span className="rounded-full border border-black/8 bg-[#eef2ff] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#2563eb]">New</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((item) => <ProductCard key={item._id} item={item} badge="New" badgeTone="cool" />)}
        </div>
      </section>

      <section ref={quizRef} className="fade-in section-green rounded-[24px] border border-black/5 p-6 pt-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] lg:p-8">
        <div className="mb-6">
          <h2 className="display-font text-3xl text-text-primary">Find Your Fashion Style</h2>
          <p className="mt-2 text-sm text-text-secondary">Step-by-step quiz to build your personal style profile.</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#dbe4db]">
            <div
              className="h-full rounded-full bg-[#14b8a6]"
              style={{ width: `${((quizStep + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {quizStep === 0 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="text-sm font-semibold">1. Favorite colors</p>
              <div className="flex flex-wrap gap-2">
                {["Blue", "Pink", "Purple", "Red", "Green", "Beige", "Black", "White"].map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${quiz.favoriteColors.includes(c) ? "border-transparent bg-[#7c3aed] text-white" : "border-black/8 bg-white text-text-secondary hover:text-text-primary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {quizStep === 1 && (
            <motion.label
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              2. Preferred style
              <select
                value={quiz.preferredStyle}
                onChange={(e) => setQuiz((q) => ({ ...q, preferredStyle: e.target.value }))}
                className="glam-input mt-2 w-full rounded-lg px-3 py-2 text-sm"
              >
                {["Casual", "Formal", "Streetwear", "Traditional"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </motion.label>
          )}

          {quizStep === 2 && (
            <motion.label
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              3. Budget range
              <select
                value={quiz.budgetRange}
                onChange={(e) => setQuiz((q) => ({ ...q, budgetRange: e.target.value }))}
                className="glam-input mt-2 w-full rounded-lg px-3 py-2 text-sm"
              >
                {["0-2000", "2000-5000", "5000-10000"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </motion.label>
          )}

          {quizStep === 3 && (
            <motion.label
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              4. Occasion
              <select
                value={quiz.occasion}
                onChange={(e) => setQuiz((q) => ({ ...q, occasion: e.target.value }))}
                className="glam-input mt-2 w-full rounded-lg px-3 py-2 text-sm"
              >
                {["Party", "Office", "Daily wear", "Wedding"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </motion.label>
          )}

          {quizStep === 4 && (
            <motion.label
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              5. Preferred clothing type
              <select
                value={quiz.clothingType}
                onChange={(e) => setQuiz((q) => ({ ...q, clothingType: e.target.value }))}
                className="glam-input mt-2 w-full rounded-lg px-3 py-2 text-sm"
              >
                {["Dresses", "Kurti", "Sarees", "Jeans", "Tops"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </motion.label>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setQuizStep((s) => Math.max(0, s - 1))}
            className="btn-outline rounded-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
            disabled={quizStep === 0}
          >
            Back
          </button>
          {quizStep < 4 ? (
            <button
              onClick={() => setQuizStep((s) => Math.min(4, s + 1))}
              className="rounded-full bg-[#14b8a6] px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#0fa495]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={runQuiz}
              className="rounded-full bg-[#14b8a6] px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#0fa495]"
            >
              Get My Style
            </button>
          )}
        </div>

        {quizLoading && (
          <div className="mt-5 rounded-2xl border border-black/8 bg-white p-4 text-sm text-text-secondary">
            Analyzing your style preferences...
          </div>
        )}

        {quizResult && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-black/8 bg-white p-4 text-sm text-text-primary">
              <p className="text-base font-semibold">Your Style: {quizResult.styleProfile}</p>
              <p className="mt-1 text-text-secondary">Recommended picks tailored to your quiz.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(quizResult.recommended || []).map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
