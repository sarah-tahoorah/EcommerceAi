import "dotenv/config";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

const root = path.resolve(process.cwd(), "..");
const catalogPath = path.join(root, "dataset", "processed", "catalog.json");

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
  if (!fs.existsSync(catalogPath)) {
    throw new Error("catalog.json missing. Run `npm run seed:catalog` from root first.");
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sellora");
  try {
    await Product.collection.createIndex({ name: "text", description: "text", tags: "text" });
  } catch (err) {
    if (err?.codeName === "IndexOptionsConflict") {
      const indexes = await Product.collection.indexes();
      const textIndex = indexes.find((idx) => idx.key && idx.key._fts === "text");
      if (textIndex?.name) {
        await Product.collection.dropIndex(textIndex.name);
      }
      await Product.collection.createIndex({ name: "text", description: "text", tags: "text" });
    } else {
      throw err;
    }
  }
  await Product.deleteMany({});
  const withFabric = catalog.products.map((p) => ({
    ...p,
    fabric: p.fabric || inferFabric(p)
  }));
  await Product.insertMany(withFabric);
  console.log(`Seeded ${catalog.products.length} products`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
