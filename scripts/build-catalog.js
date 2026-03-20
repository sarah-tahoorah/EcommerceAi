const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "dataset", "raw");
const outDir = path.join(root, "dataset", "processed");
const publicDir = path.join(root, "server", "public", "products");

const categoryConfig = {
  baby_clothing: { label: "Baby Clothing", basePrice: 799, colors: ["Pink", "Blue", "Cream"] },
  tshirts: { label: "T-Shirts", basePrice: 999, colors: ["Black", "White", "Navy"] },
  shirts: { label: "Shirts", basePrice: 1499, colors: ["White", "Blue", "Olive"] },
  jeans: { label: "Jeans", basePrice: 1899, colors: ["Indigo", "Black", "Grey"] },
  handbags: { label: "Handbags", basePrice: 2199, colors: ["Black", "Tan", "Maroon"] },
  heels: { label: "Heels", basePrice: 2499, colors: ["Black", "Gold", "Beige"] },
  kids_wear: { label: "Kids Wear", basePrice: 1099, colors: ["Yellow", "Blue", "Green"] },
  kurti: { label: "Kurti", basePrice: 1699, colors: ["Mustard", "Maroon", "Teal"] },
  sarees: { label: "Sarees", basePrice: 2999, colors: ["Red", "Gold", "Purple"] },
  tops: { label: "Tops", basePrice: 1399, colors: ["White", "Lilac", "Black"] },
  dresses: { label: "Dresses", basePrice: 2299, colors: ["Black", "Rose", "Emerald"] },
  shoes: { label: "Shoes", basePrice: 1999, colors: ["White", "Black", "Grey"] }
};

const patternMap = ["Solid", "Printed", "Striped", "Floral", "Textured"];
const sizesMap = {
  "Baby Clothing": ["0-6M", "6-12M", "12-24M"],
  "Kids Wear": ["2Y", "4Y", "6Y", "8Y"],
  default: ["S", "M", "L", "XL"]
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readImages(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) files.push(...readImages(full));
    if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function createProduct(categoryKey, filePath, index) {
  const cfg = categoryConfig[categoryKey];
  const category = cfg.label;
  const baseName = path.basename(filePath, path.extname(filePath));
  const name = `${category} ${index + 1}`;
  const price = cfg.basePrice + ((index % 6) * 150);
  const oldPrice = price + 500;
  const rating = Number((3.8 + (index % 12) * 0.1).toFixed(1));
  const stock = 10 + ((index * 3) % 21);
  const color = cfg.colors[index % cfg.colors.length];
  const pattern = patternMap[index % patternMap.length];
  const sizes = sizesMap[category] || sizesMap.default;
  const slug = safeSlug(`${category}-${baseName}-${index + 1}`);
  return {
    name,
    slug,
    category,
    description: `Premium ${category.toLowerCase()} designed for modern style. Fabric quality, elegant finish, and all-day comfort.`,
    price,
    oldPrice,
    discountPercent: Math.round(((oldPrice - price) / oldPrice) * 100),
    rating,
    reviewCount: 20 + ((index * 11) % 120),
    color,
    pattern,
    sizes,
    stock,
    tags: [category.toLowerCase(), color.toLowerCase(), pattern.toLowerCase()],
    imagePath: ""
  };
}

function main() {
  ensureDir(outDir);
  ensureDir(publicDir);
  if (!fs.existsSync(rawDir)) {
    throw new Error(`Missing dataset directory: ${rawDir}`);
  }

  const categories = fs.readdirSync(rawDir).filter((d) => fs.statSync(path.join(rawDir, d)).isDirectory());
  const products = [];

  for (const categoryKey of categories) {
    if (!categoryConfig[categoryKey]) continue;
    const srcCatDir = path.join(rawDir, categoryKey);
    const dstCatDir = path.join(publicDir, categoryKey);
    ensureDir(dstCatDir);

    const images = readImages(srcCatDir);
    images.forEach((img, idx) => {
      const ext = path.extname(img).toLowerCase();
      const fileName = `${safeSlug(path.basename(img, ext))}-${idx + 1}${ext}`;
      const dst = path.join(dstCatDir, fileName);
      fs.copyFileSync(img, dst);
      const product = createProduct(categoryKey, img, idx);
      product.imagePath = `/products/${categoryKey}/${fileName}`;
      products.push(product);
    });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    productCount: products.length,
    products
  };

  fs.writeFileSync(path.join(outDir, "catalog.json"), JSON.stringify(payload, null, 2));
  console.log(`Catalog generated: ${products.length} products`);
}

main();
