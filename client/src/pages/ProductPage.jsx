import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Cloud, CloudRain, Info, Ruler, Snowflake, Sparkles, Sun, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { useFadeIn } from "../hooks/useFadeIn";

const sizeChart = [
  { size: "S", chest: "34-36", waist: "28-30", hips: "34-36" },
  { size: "M", chest: "36-38", waist: "30-32", hips: "36-38" },
  { size: "L", chest: "38-40", waist: "32-34", hips: "38-40" },
  { size: "XL", chest: "40-42", waist: "34-36", hips: "40-42" }
];

const shoeSizeChart = [
  { length: 22.5, uk: 3, us: 5, eu: 36 },
  { length: 23.0, uk: 4, us: 6, eu: 37 },
  { length: 24.0, uk: 5, us: 7, eu: 38 },
  { length: 24.5, uk: 6, us: 8, eu: 39 },
  { length: 25.5, uk: 7, us: 9, eu: 40 }
];

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [size, setSize] = useState("M");
  const [matches, setMatches] = useState([]);
  const [sizeForm, setSizeForm] = useState({
    heightCm: "",
    weightKg: "",
    gender: "female",
    bodyType: "rectangle"
  });
  const [sizeLoading, setSizeLoading] = useState(false);
  const [sizeResult, setSizeResult] = useState(null);
  const [comfortChoice, setComfortChoice] = useState("cool");
  const [comfortWeather, setComfortWeather] = useState("moderate");
  const [comfortData, setComfortData] = useState(null);
  const [comfortLoading, setComfortLoading] = useState(false);
  const [comfortProducts, setComfortProducts] = useState([]);
  const [comfortProductsLoading, setComfortProductsLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [footLength, setFootLength] = useState("");
  const [footWidth, setFootWidth] = useState("normal");
  const [shoeResult, setShoeResult] = useState(null);
  const { addToCart, setCart, user } = useApp();
  const productRef = useFadeIn();
  const matchRef = useFadeIn();

  const bodyShapes = [
    { key: "hourglass", label: "Hourglass", accent: "from-[#f4c7d7] via-[#e8bfd7] to-[#ddd6fe]", active: "border-pink-300 bg-[#f7d7e2]" },
    { key: "pear", label: "Pear", accent: "from-[#c7f0d8] via-[#d2f4df] to-[#e6fff1]", active: "border-emerald-300 bg-[#d7f5e3]" },
    { key: "apple", label: "Apple", accent: "from-[#f8d1b6] via-[#f7dcc7] to-[#fff1e6]", active: "border-orange-300 bg-[#f9e0cf]" },
    { key: "rectangle", label: "Rectangle", accent: "from-[#cfe0ff] via-[#dbe7ff] to-[#eef4ff]", active: "border-blue-300 bg-[#d9e6ff]" },
    { key: "petite", label: "Petite", accent: "from-[#e4d5ff] via-[#eadfff] to-[#f5efff]", active: "border-violet-300 bg-[#ece2ff]" },
    { key: "athletic", label: "Athletic", accent: "from-[#c7f1ec] via-[#d7f7f2] to-[#ecfffc]", active: "border-teal-300 bg-[#d9f7f3]" }
  ];

  const bodyAdvice = {
    hourglass: {
      recommend: ["Wrap dresses", "Belted tops", "Tailored fits"],
      avoid: ["Boxy cuts"]
    },
    pear: {
      recommend: ["A-line dresses", "High-waist skirts", "Structured tops"],
      avoid: ["Tight hip-fitting dresses"]
    },
    apple: {
      recommend: ["Empire waist", "Flowy tops", "V-neck dresses"],
      avoid: ["Clingy fabrics"]
    },
    rectangle: {
      recommend: ["Ruffle tops", "Peplum styles", "Layered looks"],
      avoid: ["Straight boxy fits"]
    },
    petite: {
      recommend: ["Monochrome outfits", "High-rise bottoms", "Shorter hemlines"],
      avoid: ["Oversized silhouettes"]
    },
    athletic: {
      recommend: ["Soft drapes", "Fit-and-flare", "Textured tops"],
      avoid: ["Super stiff fabrics"]
    }
  };

  const weatherCards = [
    {
      key: "hot",
      api: "hot",
      title: "Hot Weather",
      description: "Best for summer and high temperatures",
      icon: Sun,
      gradient: "from-orange-500 via-amber-400 to-yellow-300",
      recommendations: ["Cotton dresses", "Light t-shirts", "Linen shirts", "Shorts", "Sandals"],
      categories: ["Dresses", "T-Shirts", "Tops", "Kids Wear", "Baby Clothing"],
      tagClass: "bg-orange-500/15 text-orange-700 border-orange-200",
      glow: "ring-orange-300/80 shadow-[0_20px_40px_rgba(249,115,22,0.35)]"
    },
    {
      key: "cool",
      api: "moderate",
      title: "Cool Weather",
      description: "Perfect for mild weather",
      icon: Cloud,
      gradient: "from-blue-700 via-sky-500 to-cyan-400",
      recommendations: ["Full sleeve tops", "Light jackets", "Jeans", "Sneakers"],
      categories: ["Shirts", "Jeans", "Tops", "Shoes"],
      tagClass: "bg-blue-500/15 text-blue-700 border-blue-200",
      glow: "ring-sky-400/90 shadow-[0_24px_50px_rgba(2,132,199,0.5)]"
    },
    {
      key: "cold",
      api: "cold",
      title: "Cold Weather",
      description: "Stay warm and stylish",
      icon: Snowflake,
      gradient: "from-blue-700 via-indigo-600 to-purple-500",
      recommendations: ["Sweaters", "Hoodies", "Boots", "Wool coats"],
      categories: ["Jeans", "Shirts", "Shoes", "Dresses"],
      tagClass: "bg-indigo-500/15 text-indigo-700 border-indigo-200",
      glow: "ring-indigo-300/80 shadow-[0_20px_40px_rgba(79,70,229,0.35)]"
    },
    {
      key: "rainy",
      api: "warm",
      title: "Rainy Weather",
      description: "Comfortable outfits for rainy days",
      icon: CloudRain,
      gradient: "from-teal-500 via-cyan-500 to-blue-600",
      recommendations: ["Waterproof jackets", "Cropped pants", "Rubber sandals", "Quick-dry fabrics"],
      categories: ["Shoes", "Tops", "Jeans"],
      tagClass: "bg-teal-500/15 text-teal-700 border-teal-200",
      glow: "ring-teal-300/80 shadow-[0_20px_40px_rgba(13,148,136,0.35)]"
    }
  ];

  const selectedWeather = weatherCards.find((card) => card.key === comfortChoice) || weatherCards[1];

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      setItem(r.data);
    });
    api.get(`/ai/outfit/${id}`).then((r) => setMatches(r.data.items || []));
  }, [id]);

  const fetchComfort = async (weather = comfortWeather) => {
    if (!id) return;
    setComfortLoading(true);
    try {
      const { data } = await api.get(`/ai/comfort/${id}?weather=${encodeURIComponent(weather)}`);
      setComfortData(data);
    } finally {
      setComfortLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchComfort(comfortWeather);
  }, [id, comfortWeather]);

  useEffect(() => {
    if (!selectedWeather) return;
    setComfortWeather(selectedWeather.api);
  }, [selectedWeather?.api]);

  useEffect(() => {
    if (!selectedWeather) return;
    const loadWeatherProducts = async () => {
      setComfortProductsLoading(true);
      try {
        const results = await Promise.all(
          selectedWeather.categories.map((category) => api.get("/products", { params: { category, limit: 4 } }))
        );
        const items = results.flatMap((res) => res.data.items || []);
        const unique = Array.from(new Map(items.map((product) => [product._id, product])).values());
        setComfortProducts(unique.slice(0, 8));
      } finally {
        setComfortProductsLoading(false);
      }
    };
    loadWeatherProducts();
  }, [selectedWeather?.key]);

  const handleAddToCart = () => {
    if (!item) return;
    addToCart(item, 1, size);
  };

  const handleBuyNow = () => {
    if (!item) return;
    const checkoutItem = { ...item, qty: 1, size };
    if (!user) {
      setCart([checkoutItem]);
      navigate("/profile", { state: { redirectTo: "/checkout" } });
      return;
    }
    setCart([checkoutItem]);
    navigate("/checkout");
  };

  const handleSizeAdvisor = async () => {
    if (!sizeForm.heightCm || !sizeForm.weightKg) return;
    setSizeLoading(true);
    setSizeResult(null);
    try {
      const { data } = await api.post("/ai/size-advisor", sizeForm);
      setSizeResult(data);
    } finally {
      setSizeLoading(false);
    }
  };

  const categoryKey = (item?.category || "").toLowerCase();
  const isFootwear = ["shoes", "heels", "shoe", "heel", "sandals", "sandal"].includes(categoryKey);
  const sizeOptions = isFootwear ? ["3", "4", "5", "6", "7", "8", "9"] : (item?.sizes || ["S", "M", "L", "XL"]);

  useEffect(() => {
    if (!item) return;
    setSize(sizeOptions[0] || "M");
  }, [item, sizeOptions]);

  const suggestShoeSize = () => {
    const length = Number(footLength);
    if (!length) return;
    let closest = shoeSizeChart.reduce((prev, curr) => {
      return Math.abs(curr.length - length) < Math.abs(prev.length - length) ? curr : prev;
    }, shoeSizeChart[0]);

    if (footWidth === "wide" && closest !== shoeSizeChart[shoeSizeChart.length - 1]) {
      const index = shoeSizeChart.findIndex((row) => row.length === closest.length);
      closest = shoeSizeChart[Math.min(index + 1, shoeSizeChart.length - 1)];
    }
    if (footWidth === "narrow" && closest !== shoeSizeChart[0]) {
      const index = shoeSizeChart.findIndex((row) => row.length === closest.length);
      closest = shoeSizeChart[Math.max(index - 1, 0)];
    }

    setShoeResult({
      uk: closest.uk,
      us: closest.us,
      eu: closest.eu,
      length: closest.length
    });
  };


  if (!item) return <p>Loading...</p>;

  return (
    <div className="space-y-10">
      <section ref={productRef} className="grid gap-8 rounded-3xl card-soft p-6 md:grid-cols-2 fade-in">
        <div className="space-y-4">
          <img src={item.imagePath} alt={item.name} className="w-full rounded-2xl object-cover aspect-[4/5]" />
        </div>
        <div className="space-y-4">
          <h1 className="display-font text-4xl">{item.name}</h1>
          <p className="text-sm text-neutral-600">{item.description}</p>
          <p className="text-2xl font-bold gold-gradient">Rs {item.price}</p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full px-4 py-1 text-sm ${size === s ? "gold-button" : "btn-outline"}`}
              >
                {s}
              </button>
            ))}
            {isFootwear && (
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="btn-outline rounded-full px-4 py-1 text-sm"
              >
                Size Guide
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="rounded-full px-6 py-3 gold-button">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-outline rounded-full px-6 py-3">
              Buy Now
            </button>
          </div>

          {isFootwear && (
            <div className="rounded-2xl card-gradient p-4 text-sm">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-purple-600 border border-purple-200">
                <Ruler size={14} />
                Footwear Size Advisor
              </div>
              <p className="mb-3 text-sm text-neutral-600">
                Enter your foot length and width to get a recommended UK size.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={footLength}
                  onChange={(e) => setFootLength(e.target.value)}
                  placeholder="Foot length (cm)"
                  className="glam-input rounded-lg px-3 py-2 text-sm text-neutral-700"
                />
                <select
                  value={footWidth}
                  onChange={(e) => setFootWidth(e.target.value)}
                  className="glam-input rounded-lg px-3 py-2 text-sm text-neutral-700"
                >
                  <option value="narrow">Narrow</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
              <button onClick={suggestShoeSize} className="mt-3 w-full rounded-full px-4 py-2 text-sm gold-button">
                Recommend Shoe Size
              </button>
              {shoeResult && (
                <div className="mt-3 rounded-xl border border-purple-200 bg-white p-3 text-sm">
                  <p className="font-semibold">Recommended size: UK {shoeResult.uk}</p>
                  <p className="text-xs text-neutral-600">
                    US {shoeResult.us} | EU {shoeResult.eu} | Based on {shoeResult.length} cm
                  </p>
                  <p className="mt-2 text-xs text-neutral-600">
                    This size should provide a comfortable fit.
                  </p>
                </div>
              )}
            </div>
          )}

          {!isFootwear && (
            <div className="overflow-hidden rounded-2xl card-soft p-0">
            <div className="border-b border-purple-200 px-4 py-3">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs text-purple-600">
                <Ruler size={14} />
                AI Size Advisor
              </div>
              <h3 className="font-semibold">Find My Perfect Size</h3>
              <p className="mt-1 text-sm text-neutral-600">Enter your measurements to get the best fit.</p>
            </div>

            <div className="space-y-3 px-4 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={sizeForm.heightCm}
                  onChange={(e) => setSizeForm((s) => ({ ...s, heightCm: e.target.value }))}
                  placeholder="Height (cm)"
                  className="glam-input rounded-lg px-3 py-2 text-sm text-neutral-700"
                />
                <input
                  value={sizeForm.weightKg}
                  onChange={(e) => setSizeForm((s) => ({ ...s, weightKg: e.target.value }))}
                  placeholder="Weight (kg)"
                  className="glam-input rounded-lg px-3 py-2 text-sm text-neutral-700"
                />
                <select
                  value={sizeForm.gender}
                  onChange={(e) => setSizeForm((s) => ({ ...s, gender: e.target.value }))}
                  className="glam-input rounded-lg px-3 py-2 text-sm text-neutral-700"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">AI Body Shape Style Guide</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {bodyShapes.map((shape) => {
                      const active = sizeForm.bodyType === shape.key;
                      return (
                        <button
                          key={shape.key}
                          type="button"
                          onClick={() => setSizeForm((s) => ({ ...s, bodyType: shape.key }))}
                          className={`group relative overflow-hidden rounded-2xl border px-3 py-4 text-left transition ${
                            active
                              ? `${shape.active} text-neutral-900 shadow-[0_0_0_2px_rgba(124,58,237,0.1)]`
                              : "border-black/8 bg-[#f4f1f8] text-neutral-900 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(17,24,39,0.08)]"
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${shape.accent} opacity-90`} />
                          <div className="relative flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${active ? "border-white/60 bg-white/50 text-neutral-900" : "border-black/8 bg-white/70 text-neutral-700"}`}>
                              <svg viewBox="0 0 64 64" className="h-6 w-6">
                                {shape.key === "hourglass" && (
                                  <path d="M20 6c6 4 8 10 8 14 0 4-2 8-6 12 4 4 6 8 6 12 0 4-2 10-8 14h24c-6-4-8-10-8-14 0-4 2-8 6-12-4-4-6-8-6-12 0-4 2-10 8-14H20z" fill="currentColor" />
                                )}
                                {shape.key === "pear" && (
                                  <path d="M32 6c6 0 10 6 10 12 0 6-4 8-10 8-6 0-10-2-10-8 0-6 4-12 10-12zm-16 38c0-10 8-18 16-18s16 8 16 18c0 8-6 14-16 14S16 52 16 44z" fill="currentColor" />
                                )}
                                {shape.key === "apple" && (
                                  <path d="M32 8c10 0 18 8 18 18S42 52 32 52 14 44 14 26 22 8 32 8zm0 6c-6 0-10 6-10 12s4 12 10 12 10-6 10-12S38 14 32 14z" fill="currentColor" />
                                )}
                                {shape.key === "rectangle" && (
                                  <rect x="20" y="8" width="24" height="48" rx="10" fill="currentColor" />
                                )}
                                {shape.key === "petite" && (
                                  <path d="M32 10c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10zm-12 26h24c-2 10-6 18-12 18s-10-8-12-18z" fill="currentColor" />
                                )}
                                {shape.key === "athletic" && (
                                  <path d="M24 8h16c6 0 10 6 10 12v18c0 10-8 18-18 18S14 48 14 38V20c0-6 4-12 10-12z" fill="currentColor" />
                                )}
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">{shape.label}</p>
                              <p className="text-xs text-neutral-600">Tap to select</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 rounded-2xl border border-black/8 bg-[linear-gradient(135deg,#f8dbe6_0%,#efe3fb_34%,#dfe9ff_68%,#ddf7f1_100%)] p-3 text-xs text-neutral-800 shadow-[0_18px_36px_rgba(17,24,39,0.08)]">
                    <p className="text-sm font-semibold text-neutral-900">AI Style Advice</p>
                    <p className="mt-1 text-neutral-600">Body Shape: <strong className="text-neutral-900">{bodyShapes.find((b) => b.key === sizeForm.bodyType)?.label}</strong></p>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-emerald-600">Recommended styles</p>
                        <ul className="mt-1 space-y-1">
                          {bodyAdvice[sizeForm.bodyType]?.recommend.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="text-emerald-500">+</span>
                                <span className="text-neutral-800">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-rose-500">Avoid</p>
                        <ul className="mt-1 space-y-1">
                          {bodyAdvice[sizeForm.bodyType]?.avoid.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="text-rose-500">-</span>
                                <span className="text-neutral-800">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={handleSizeAdvisor} className="w-full rounded-full px-4 py-2 text-sm gold-button">
                Find My Perfect Size
              </button>

              {sizeLoading && (
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
                  className="rounded-lg border border-purple-200 bg-white p-3 text-sm text-neutral-600"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Sparkles size={15} />
                    Calculating your best fit...
                  </div>
                </motion.div>
              )}

              {sizeResult && (
                <div className="space-y-2 rounded-xl border border-purple-200 bg-white p-3 text-sm">
                  <p className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 size={16} />
                    Recommendation Ready
                  </p>
                  <p><strong>Recommended Size:</strong> {sizeResult.recommended_size}</p>
                  <p className="flex items-center gap-2">
                    <strong>Confidence:</strong> {sizeResult.confidence}% match
                    <span className="group relative inline-flex items-center gap-1 text-xs text-neutral-600">
                      <Info size={14} />
                      <span className="absolute -left-4 top-6 hidden w-64 rounded-lg border border-purple-200 bg-white p-2 text-xs text-neutral-600 shadow-lg group-hover:block">
                        What this means: the AI estimates how closely this size fits based on your height, weight, and body type.
                      </span>
                    </span>
                  </p>
                  <p className="text-neutral-600">{sizeResult.message}</p>
                  <div className="mt-2 overflow-hidden rounded-lg border border-purple-200 bg-white text-xs">
                    <div className="grid grid-cols-4 bg-purple-50 px-2 py-1 font-semibold text-neutral-700">
                      <span>Size</span>
                      <span>Chest</span>
                      <span>Waist</span>
                      <span>Hips</span>
                    </div>
                    {sizeChart.map((row) => (
                      <div
                        key={row.size}
                        className={`grid grid-cols-4 px-2 py-1 ${row.size === sizeResult.recommended_size ? "bg-purple-50 text-purple-600" : "text-neutral-600"}`}
                      >
                        <span>{row.size}</span>
                        <span>{row.chest}</span>
                        <span>{row.waist}</span>
                        <span>{row.hips}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600">
                    Fit note: true to size. If you prefer a relaxed fit, choose one size up.
                  </p>
                </div>
              )}
            </div>
            </div>
          )}

          <div className="rounded-2xl card-gradient p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs text-purple-600">
                  AI Comfort Insight
                </div>
                <p className="mt-2 text-sm font-semibold text-neutral-800">Dress for the Weather</p>
                <p className="text-xs text-neutral-600">Choose a weather card to personalize comfort tips.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {weatherCards.map((card) => {
                const Icon = card.icon;
                const active = comfortChoice === card.key;
                return (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setComfortChoice(card.key)}
                    className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition duration-300 ${
                      active ? `border-white/80 ring-4 ${card.glow} scale-[1.02]` : "border-white/60 hover:-translate-y-1 hover:scale-[1.01]"
                    } ${active ? "opacity-100" : "opacity-80"} shadow-[0_18px_36px_rgba(0,0,0,0.12)]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
                    <div className="relative space-y-2">
                      <div className="flex items-start justify-between text-white">
                        <div className="flex items-center gap-2">
                          <Icon size={22} />
                          <span className="text-sm font-semibold">{card.title}</span>
                        </div>
                        {active && (
                          <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white">Selected</span>
                        )}
                      </div>
                      <p className="text-xs text-white/90">{card.description}</p>
                    </div>
                    {active && (
                      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-purple-100 bg-white p-4">
              <p className="text-sm font-semibold text-neutral-800">{selectedWeather.title} Recommendations</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedWeather.recommendations.map((itemText) => (
                  <span key={itemText} className={`rounded-full border px-3 py-1 text-xs font-semibold ${selectedWeather.tagClass}`}>
                    {itemText}
                  </span>
                ))}
              </div>
            </div>

            {comfortLoading && (
              <div className="mt-3 text-xs text-neutral-600">Analyzing comfort...</div>
            )}
            {comfortData && !comfortLoading && (
              <div className="mt-4 space-y-2 text-sm">
                {"comfortScore" in comfortData && (
                  <p><strong>Comfort Score:</strong> {comfortData.comfortScore} / 10</p>
                )}
                {"walkingComfort" in comfortData && (
                  <>
                    <p><strong>Walking Comfort:</strong> {comfortData.walkingComfort} / 10</p>
                    <p><strong>Recommended Duration:</strong> {comfortData.recommendedDuration}</p>
                  </>
                )}
                {comfortData.footwear && (
                  <>
                    <p><strong>Shoe Type:</strong> {comfortData.footwear.shoeType}</p>
                    <p><strong>Heel Height:</strong> {comfortData.footwear.heelHeight} cm</p>
                    <p><strong>Material:</strong> {comfortData.footwear.material}</p>
                    <p><strong>Best Use:</strong> {comfortData.footwear.bestUse.join(" | ")}</p>
                    {comfortData.footwear.notRecommended?.length > 0 && (
                      <p><strong>Not Recommended:</strong> {comfortData.footwear.notRecommended.join(" | ")}</p>
                    )}
                  </>
                )}
                <p className="text-neutral-600">{comfortData.reason}</p>
                <p className="text-neutral-600">
                  <strong>Best For:</strong> {comfortData.bestFor.join(" | ")}
                </p>
              </div>
            )}

            </div>
          </div>
        </section>

      {isFootwear && showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 p-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Size Guide</p>
                <h3 className="display-font text-2xl">Find Your Perfect Shoe Size</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="rounded-full border border-purple-200 p-2 hover:bg-purple-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 rounded-2xl border border-purple-200 bg-white p-4">
                <h4 className="font-semibold">Shoe Size Chart</h4>
                <div className="overflow-hidden rounded-xl border border-purple-200 bg-white text-sm">
                  <div className="grid grid-cols-4 bg-purple-50 px-3 py-2 font-semibold">
                    <span>Foot Length (cm)</span>
                    <span>UK</span>
                    <span>US</span>
                    <span>EU</span>
                  </div>
                  {shoeSizeChart.map((row) => (
                    <div key={row.length} className="grid grid-cols-4 px-3 py-2">
                      <span>{row.length}</span>
                      <span>{row.uk}</span>
                      <span>{row.us}</span>
                      <span>{row.eu}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-purple-200 bg-white p-3 text-xs text-neutral-600">
                  Tip: Measure your foot from heel to toe while standing for the most accurate result.
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-purple-200 bg-white p-4">
                  <h4 className="font-semibold">Measurement Illustration</h4>
                  <div className="mt-3 flex items-center justify-center rounded-xl bg-white p-4">
                    <svg viewBox="0 0 260 120" className="h-24 w-full text-neutral-500">
                      <rect x="20" y="30" width="220" height="60" rx="18" fill="currentColor" opacity="0.12" />
                      <rect x="40" y="45" width="150" height="30" rx="14" fill="currentColor" opacity="0.25" />
                      <line x1="40" y1="95" x2="190" y2="95" stroke="currentColor" strokeWidth="3" />
                      <circle cx="40" cy="95" r="4" fill="currentColor" />
                      <circle cx="190" cy="95" r="4" fill="currentColor" />
                      <text x="105" y="112" fontSize="10" fill="currentColor">Heel to toe length</text>
                    </svg>
                  </div>
                </div>

                <div className="rounded-2xl card-gradient p-4 text-sm">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs text-purple-600">
                    <Ruler size={14} />
                    Smart Size Suggestion
                  </div>
                  <div className="space-y-2">
                    <input
                      value={footLength}
                      onChange={(e) => setFootLength(e.target.value)}
                      placeholder="Foot length (cm)"
                      className="glam-input w-full rounded-lg px-3 py-2 text-sm"
                    />
                    <select
                      value={footWidth}
                      onChange={(e) => setFootWidth(e.target.value)}
                      className="glam-input w-full rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="narrow">Narrow</option>
                      <option value="normal">Normal</option>
                      <option value="wide">Wide</option>
                    </select>
                    <button
                      onClick={suggestShoeSize}
                      className="w-full rounded-full px-4 py-2 text-sm gold-button"
                    >
                      Recommend Size
                    </button>
                  </div>

                  {shoeResult && (
                    <div className="mt-3 rounded-xl border border-purple-200 bg-white p-3 text-sm">
                      <p className="font-semibold">Recommended size: UK {shoeResult.uk}</p>
                      <p className="text-xs text-neutral-600">
                    US {shoeResult.us} | EU {shoeResult.eu} | Based on {shoeResult.length} cm
                      </p>
                      <p className="mt-2 text-xs text-neutral-600">
                        This size should provide a comfortable fit.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <section ref={matchRef} className="fade-in">
        <h2 className="display-font mb-4 text-3xl">Complete the Look</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {matches.map((m) => (
            <ProductCard key={m._id} item={m} />
          ))}
        </div>
      </section>
    </div>
  );
}




