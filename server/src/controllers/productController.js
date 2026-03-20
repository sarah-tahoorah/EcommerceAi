import { Product } from "../models/Product.js";

const sortMap = {
  popularity: { rating: -1, reviewCount: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 }
};

const categoryGroups = {
  women: ["Kurti", "Sarees", "Tops", "Dresses", "Heels", "Handbags"],
  men: ["T-Shirts", "Shirts", "Jeans", "Shoes"],
  kids: ["Kids Wear", "Baby Clothing"]
};

function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProducts(req, res) {
  const {
    category,
    minPrice,
    maxPrice,
    color,
    size,
    search,
    sort = "popularity",
    page = 1,
    limit = 16
  } = req.query;

  const query = {};
  if (category && category.toLowerCase() !== "all") {
    const group = categoryGroups[category.toLowerCase()];
    if (group) query.category = { $in: group };
    else query.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  }
  if (color) query.color = new RegExp(`^${escapeRegex(color)}$`, "i");
  if (size) query.sizes = size;
  if (search) {
    const text = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: text }, { category: text }, { description: text }];
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice !== undefined && minPrice !== "") query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== "") query.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const items = await Product.find(query)
    .sort(sortMap[sort] || sortMap.popularity)
    .skip(skip)
    .limit(Number(limit));
  const total = await Product.countDocuments(query);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
}

export async function getProductById(req, res) {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  res.json(item);
}
