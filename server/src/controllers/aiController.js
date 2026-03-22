import fs from "fs/promises";
import axios from "axios";
import { Product } from "../models/Product.js";

const AI_URL = process.env.AI_SERVICE_URL || (process.env.AI_SERVICE_HOSTPORT ? `http://${process.env.AI_SERVICE_HOSTPORT}` : "http://127.0.0.1:8000");

const categoryKeywords = [
  { key: "baby clothing", value: "Baby Clothing" },
  { key: "kids wear", value: "Kids Wear" },
  { key: "t-shirt", value: "T-Shirts" },
  { key: "tshirt", value: "T-Shirts" },
  { key: "shirt", value: "Shirts" },
  { key: "jean", value: "Jeans" },
  { key: "handbag", value: "Handbags" },
  { key: "bag", value: "Handbags" },
  { key: "heel", value: "Heels" },
  { key: "kurti", value: "Kurti" },
  { key: "saree", value: "Sarees" },
  { key: "top", value: "Tops" },
  { key: "dress", value: "Dresses" },
  { key: "shoe", value: "Shoes" }
];

const colorKeywords = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "pink",
  "purple",
  "orange",
  "grey",
  "gray",
  "beige",
  "gold",
  "silver",
  "navy"
];

const outfitMap = {
  Dresses: ["Heels", "Handbags"],
  Kurti: ["Handbags", "Heels"],
  Sarees: ["Handbags", "Heels"],
  Tops: ["Jeans", "Handbags"],
  Shirts: ["Jeans", "Shoes"],
  "T-Shirts": ["Jeans", "Shoes"],
  Jeans: ["T-Shirts", "Shirts", "Shoes"],
  Shoes: ["Jeans", "Dresses"],
  Heels: ["Dresses", "Sarees", "Kurti"],
  Handbags: ["Dresses", "Sarees", "Kurti"]
};

const fabricProfiles = {
  cotton: { label: "Cotton", breathability: "High", weight: "Light", comfort: { hot: 9, warm: 8, moderate: 8, cold: 5 } },
  linen: { label: "Linen", breathability: "High", weight: "Light", comfort: { hot: 9, warm: 8, moderate: 7, cold: 4 } },
  silk: { label: "Silk", breathability: "Medium", weight: "Light", comfort: { hot: 7, warm: 8, moderate: 7, cold: 5 } },
  denim: { label: "Denim", breathability: "Low", weight: "Heavy", comfort: { hot: 4, warm: 6, moderate: 6, cold: 8 } },
  wool: { label: "Wool", breathability: "Low", weight: "Heavy", comfort: { hot: 2, warm: 4, moderate: 6, cold: 10 } },
  polyester: { label: "Polyester", breathability: "Low", weight: "Medium", comfort: { hot: 5, warm: 6, moderate: 6, cold: 7 } },
  chiffon: { label: "Chiffon", breathability: "High", weight: "Light", comfort: { hot: 8, warm: 8, moderate: 7, cold: 4 } },
  rayon: { label: "Rayon", breathability: "Medium", weight: "Light", comfort: { hot: 7, warm: 7, moderate: 7, cold: 5 } },
  viscose: { label: "Viscose", breathability: "Medium", weight: "Light", comfort: { hot: 7, warm: 7, moderate: 7, cold: 5 } },
  leather: { label: "Leather", breathability: "Low", weight: "Heavy", comfort: { hot: 3, warm: 5, moderate: 6, cold: 9 } },
  nylon: { label: "Nylon", breathability: "Low", weight: "Medium", comfort: { hot: 4, warm: 5, moderate: 6, cold: 7 } }
};

const fabricKeywords = Object.keys(fabricProfiles);

function detectFabric(text = "") {
  const lower = text.toLowerCase();
  for (const key of fabricKeywords) {
    if (lower.includes(key)) return fabricProfiles[key];
  }
  return null;
}

function normalizeFabricName(value = "") {
  const lower = value.toLowerCase().trim();
  if (!lower) return "";
  if (lower.includes("cotton")) return "cotton";
  if (lower.includes("silk")) return "silk";
  if (lower.includes("denim")) return "denim";
  if (lower.includes("wool")) return "wool";
  if (lower.includes("leather")) return "leather";
  if (lower.includes("linen")) return "linen";
  if (lower.includes("polyester")) return "polyester";
  if (lower.includes("chiffon")) return "chiffon";
  if (lower.includes("rayon")) return "rayon";
  if (lower.includes("viscose")) return "viscose";
  if (lower.includes("nylon")) return "nylon";
  return "";
}

function comfortReason(profile, weather) {
  const weight = profile.weight.toLowerCase();
  const breath = profile.breathability.toLowerCase();
  const reasons = [];
  reasons.push(`${profile.label} fabric`);
  reasons.push(`${weight} weight`);
  reasons.push(`${breath} breathability`);
  if (weather === "hot" && breath === "high") reasons.push("keeps you cool");
  if (weather === "cold" && weight === "heavy") reasons.push("keeps you warm");
  if (weather === "moderate") reasons.push("comfortable for most days");
  return reasons.join(" • ");
}

function bestSeasons(weather, weight) {
  if (weather === "hot") return ["Summer", "Daytime"];
  if (weather === "cold") return ["Winter", "Night"];
  if (weight === "Heavy") return ["Autumn", "Winter"];
  if (weight === "Light") return ["Spring", "Summer"];
  return ["Spring", "Autumn"];
}

function bestOccasions(category) {
  const map = {
    Dresses: "Party",
    Sarees: "Wedding",
    Kurti: "Daily wear",
    Tops: "Casual wear",
    Shirts: "Office",
    "T-Shirts": "Casual wear",
    Jeans: "Casual wear",
    Shoes: "Long walking",
    Heels: "Party",
    "Kids Wear": "Daily wear",
    "Baby Clothing": "Daily wear"
  };
  return map[category] || "Casual";
}

const categoryFabricMap = {
  Dresses: ["cotton", "silk", "chiffon", "viscose"],
  Sarees: ["silk", "cotton", "chiffon"],
  Kurti: ["cotton", "rayon", "viscose"],
  Tops: ["cotton", "polyester", "viscose"],
  Shirts: ["cotton", "linen", "polyester"],
  "T-Shirts": ["cotton", "polyester"],
  Jeans: ["denim"],
  Shoes: ["leather", "nylon"],
  Heels: ["leather", "polyester"],
  "Kids Wear": ["cotton", "polyester"],
  "Baby Clothing": ["cotton"]
};

function hashString(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickFabricForProduct(product) {
  const options = categoryFabricMap[product.category] || ["cotton", "polyester", "viscose"];
  const index = hashString(String(product._id || product.slug || product.name)) % options.length;
  return fabricProfiles[options[index]] || fabricProfiles.cotton;
}

function inferWeight(category = "", fabric = "") {
  const lower = `${category} ${fabric}`.toLowerCase();
  if (lower.includes("denim") || lower.includes("wool") || lower.includes("leather")) return "Heavy";
  if (lower.includes("polyester") || lower.includes("nylon")) return "Medium";
  return "Light";
}

function footwearComfort(category = "", weather = "moderate") {
  const isHeels = category.toLowerCase() === "heels";
  const walkingScore = isHeels ? 4 : 7;
  const duration = isHeels ? "Short use" : "Long walking";
  const reason = isHeels ? "Heels add height but reduce walking comfort" : "Flatter sole supports longer walking";
  const seasons = weather === "cold" ? ["Winter", "Evening"] : weather === "hot" ? ["Summer", "Daytime"] : ["Spring", "Autumn"];
  return { walkingScore, duration, reason, seasons };
}

function inferHeelHeight(text = "") {
  const lower = text.toLowerCase();
  const cmMatch = lower.match(/(\d{1,2}(?:\.\d)?)\s*cm/);
  if (cmMatch) return Number(cmMatch[1]);
  if (lower.includes("high heel") || lower.includes("stiletto")) return 9;
  if (lower.includes("block heel") || lower.includes("chunky")) return 6;
  if (lower.includes("kitten")) return 4;
  return 3;
}

function inferShoeType(text = "") {
  const lower = text.toLowerCase();
  if (lower.includes("sneaker") || lower.includes("running")) return "Running Shoes";
  if (lower.includes("loafer")) return "Loafers";
  if (lower.includes("sandal")) return "Sandals";
  if (lower.includes("boot")) return "Boots";
  if (lower.includes("heel")) return "Heels";
  return "Casual Shoes";
}

function footwearInsight(product) {
  const text = `${product.name} ${product.description} ${(product.tags || []).join(" ")} ${product.fabric || ""}`;
  const type = inferShoeType(text);
  const heelHeight = inferHeelHeight(text);
  const material = normalizeFabricName(product.fabric || "") || detectFabric(text)?.label?.toLowerCase() || "synthetic";

  let comfortScore = 7;
  let bestUse = ["Daily wear", "Casual wear"];
  let notRecommended = [];
  if (type === "Running Shoes") {
    comfortScore = 9;
    bestUse = ["Walking", "Sports", "Daily wear"];
  } else if (type === "Sandals") {
    comfortScore = 7;
    bestUse = ["Casual wear", "Short walks"];
  } else if (type === "Boots") {
    comfortScore = 6;
    bestUse = ["Cool weather", "Evening"];
  } else if (type === "Heels" || product.category === "Heels") {
    comfortScore = heelHeight >= 8 ? 5 : 6;
    bestUse = ["Parties", "Short duration"];
    notRecommended = ["Long walking"];
  }

  if (material === "leather") comfortScore += 1;
  if (material === "denim") comfortScore -= 1;
  comfortScore = Math.max(1, Math.min(10, comfortScore));

  const duration = heelHeight >= 8 ? "2–3 hours" : heelHeight >= 5 ? "3–4 hours" : "4–6 hours";

  return {
    comfortScore,
    bestUse,
    notRecommended,
    heelHeight,
    shoeType: type,
    material: material.charAt(0).toUpperCase() + material.slice(1),
    recommendedDuration: duration
  };
}

function normalizeCategory(message = "") {
  const lower = message.toLowerCase();
  for (const item of categoryKeywords) {
    if (lower.includes(item.key)) return item.value;
  }
  return "";
}

function normalizeColor(message = "") {
  const lower = message.toLowerCase();
  const hit = colorKeywords.find((c) => lower.includes(c));
  if (!hit) return "";
  return hit === "gray" ? "Grey" : hit.charAt(0).toUpperCase() + hit.slice(1);
}

function parsePrice(message = "") {
  const lower = message.toLowerCase();
  const numbers = lower.match(/\d{2,6}/g)?.map((n) => Number(n)) || [];
  if (!numbers.length) return {};

  if (lower.includes("between") && numbers.length >= 2) {
    return { minPrice: Math.min(numbers[0], numbers[1]), maxPrice: Math.max(numbers[0], numbers[1]) };
  }
  if (lower.includes("under") || lower.includes("below") || lower.includes("less than")) {
    return { maxPrice: numbers[0] };
  }
  if (lower.includes("over") || lower.includes("above") || lower.includes("more than")) {
    return { minPrice: numbers[0] };
  }
  return { maxPrice: numbers[0] };
}

function orderProducts(ids = [], products = []) {
  if (!ids.length) return products;
  const map = new Map(products.map((p) => [String(p._id), p]));
  const ordered = ids.map((id) => map.get(String(id))).filter(Boolean);
  return ordered.length ? ordered : products;
}

function fallbackStyleProfile(preferredStyle = "", occasion = "") {
  const style = (preferredStyle || "").toLowerCase();
  const occ = (occasion || "").toLowerCase();

  if (style === "traditional" && (occ === "wedding" || occ === "party")) return "Royal Traditional";
  if (style === "formal" && occ === "office") return "Power Formal";
  if (style === "streetwear") return "Urban Street";
  if (style === "casual" && (occ === "daily wear" || occ === "office")) return "Elegant Casual";
  return "Modern Minimal";
}

export async function imageSearch(req, res) {
  if (!req.file) return res.status(400).json({ message: "Image required" });

  try {
    const buffer = await fs.readFile(req.file.path);
    const payload = {
      image_base64: buffer.toString("base64"),
      file_name: req.file.originalname || req.file.filename
    };
    const { data } = await axios.post(`${AI_URL}/image-search`, payload, { timeout: 15000 });
    const matchIds = (data.matches || []).map((m) => m.product_id).filter(Boolean);
    const matchSlugs = (data.matches || []).map((m) => m.slug).filter(Boolean);

    let items = [];
    if (matchIds.length) {
      const found = await Product.find({ _id: { $in: matchIds } });
      items = orderProducts(matchIds, found);
    } else if (matchSlugs.length) {
      const found = await Product.find({ slug: { $in: matchSlugs } });
      const map = new Map(found.map((p) => [p.slug, p]));
      items = matchSlugs.map((s) => map.get(s)).filter(Boolean);
    }

    res.json({ analysis: data.analysis, items });
  } catch (error) {
    res.status(500).json({ message: "Image search failed" });
  } finally {
    fs.unlink(req.file.path).catch(() => {});
  }
}

export async function sizeAdvisor(req, res) {
  const { heightCm, weightKg, gender, bodyType } = req.body || {};
  if (!heightCm || !weightKg) return res.status(400).json({ message: "Height and weight required" });

  try {
    const payload = {
      height_cm: Number(heightCm),
      weight_kg: Number(weightKg),
      gender: gender || "female",
      body_type: bodyType || "average"
    };
    const { data } = await axios.post(`${AI_URL}/size-advisor`, payload, { timeout: 10000 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Size advisor failed" });
  }
}

export async function styleQuiz(req, res) {
  const {
    favoriteColors = [],
    preferredStyle = "",
    budgetRange = "",
    occasion = "",
    clothingType = ""
  } = req.body || {};

  const priceParts = budgetRange.split("-").map((n) => Number(n)).filter((n) => !Number.isNaN(n));
  const query = {};
  if (clothingType) query.category = clothingType;
  if (favoriteColors.length) query.color = { $in: favoriteColors };
  if (priceParts.length) {
    query.price = {};
    if (priceParts[0]) query.price.$gte = priceParts[0];
    if (priceParts[1]) query.price.$lte = priceParts[1];
  }

  try {
    const payload = {
      favorite_colors: favoriteColors,
      preferred_style: preferredStyle,
      budget_range: budgetRange,
      occasion,
      clothing_type: clothingType
    };
    const { data } = await axios.post(`${AI_URL}/style-quiz`, payload, { timeout: 10000 });

    const recommended = await Product.find(query).sort({ rating: -1 }).limit(8);
    res.json({
      styleProfile: data.style_profile || data.styleProfile || "Modern Minimal",
      recommended
    });
  } catch (error) {
    const recommended = await Product.find(query).sort({ rating: -1 }).limit(8);
    res.json({
      styleProfile: fallbackStyleProfile(preferredStyle, occasion),
      recommended,
      fallback: true
    });
  }
}

export async function outfitRecommendations(req, res) {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const picks = outfitMap[product.category] || ["Handbags", "Heels", "Shoes"];
  const items = await Product.find({
    _id: { $ne: product._id },
    category: { $in: picks }
  })
    .sort({ rating: -1 })
    .limit(8);

  res.json({ items });
}

export async function fashionChat(req, res) {
  const message = (req.body?.message || "").trim();
  if (!message) return res.json({ reply: "Tell me what you are looking for.", items: [] });

  const category = normalizeCategory(message);
  const color = normalizeColor(message);
  const { minPrice, maxPrice } = parsePrice(message);

  const query = {};
  if (category) query.category = category;
  if (color) query.color = color;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const items = await Product.find(query).sort({ rating: -1 }).limit(8);

  const parts = [];
  if (category) parts.push(category);
  if (color) parts.push(color.toLowerCase());
  if (minPrice || maxPrice) {
    const label = minPrice && maxPrice ? `Rs ${minPrice}-${maxPrice}` : minPrice ? `above Rs ${minPrice}` : `under Rs ${maxPrice}`;
    parts.push(label);
  }
  const reply = parts.length
    ? `Here are ${parts.join(" ")} picks you might like.`
    : "Here are some popular picks from Glamora.";

  res.json({ reply, items });
}

export async function comfortInsight(req, res) {
  const { productId } = req.params;
  const weather = (req.query.weather || "moderate").toLowerCase();
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const text = `${product.name} ${product.description} ${(product.tags || []).join(" ")}`;
  const fabricKey = normalizeFabricName(product.fabric || "");
  const detected = detectFabric(text);
  const profile = (fabricKey && fabricProfiles[fabricKey]) || detected || pickFabricForProduct(product);
  const weight = inferWeight(product.category, profile.label);
  const comfortScore = Math.max(1, Math.min(10, profile.comfort[weather] || 6));
  const seasons = bestSeasons(weather, weight);
  const occasion = bestOccasions(product.category);

  if (["Shoes", "Heels"].includes(product.category)) {
    const foot = footwearComfort(product.category, weather);
    const insight = footwearInsight(product);
    return res.json({
      fabric: profile.label,
      breathability: profile.breathability,
      weight,
      weather,
      walkingComfort: foot.walkingScore,
      recommendedDuration: insight.recommendedDuration,
      reason: foot.reason,
      bestFor: [...foot.seasons, occasion],
      footwear: insight
    });
  }

  res.json({
    fabric: profile.label,
    breathability: profile.breathability,
    weight,
    weather,
    comfortScore,
    reason: comfortReason(profile, weather),
    bestFor: [...seasons, occasion]
  });
}
