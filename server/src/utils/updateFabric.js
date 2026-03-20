import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

const categoryFabricMap = {
  Dresses: ["Cotton", "Silk", "Chiffon", "Viscose"],
  Sarees: ["Silk", "Cotton", "Chiffon"],
  Kurti: ["Cotton", "Rayon", "Viscose"],
  Tops: ["Cotton", "Polyester", "Viscose"],
  Shirts: ["Cotton", "Linen", "Polyester"],
  "T-Shirts": ["Cotton", "Polyester"],
  Jeans: ["Denim"],
  Shoes: ["Leather", "Nylon"],
  Heels: ["Leather", "Polyester"],
  "Kids Wear": ["Cotton", "Polyester"],
  "Baby Clothing": ["Cotton"]
};

function hashString(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function inferFabric(product) {
  const options = categoryFabricMap[product.category] || ["Cotton", "Polyester", "Viscose"];
  const seed = String(product.slug || product.name || "");
  return options[hashString(seed) % options.length];
}

async function run() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sellora";
  await connectDB(uri);
  const products = await Product.find({});
  let updated = 0;
  for (const p of products) {
    const fabric = p.fabric?.trim();
    if (fabric) continue;
    p.fabric = inferFabric(p);
    await p.save();
    updated += 1;
  }
  console.log(`Updated fabric on ${updated} products`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
