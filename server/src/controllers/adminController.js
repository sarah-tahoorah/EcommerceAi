import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { execSync } from "child_process";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";

const root = path.resolve(process.cwd(), "..");

export async function uploadZipDataset(req, res) {
  if (!req.file) return res.status(400).json({ message: "ZIP file required" });
  const category = String(req.body.category || "").toLowerCase().replace(/\s+/g, "_");
  if (!category) return res.status(400).json({ message: "Category required" });
  const outDir = path.join(root, "dataset", "raw", category);
  fs.mkdirSync(outDir, { recursive: true });
  const zip = new AdmZip(req.file.path);
  zip.extractAllTo(outDir, true);
  fs.unlink(req.file.path, () => undefined);
  execSync("node scripts/build-catalog.js", { cwd: root, stdio: "inherit" });
  res.json({ message: `Dataset uploaded and extracted to ${category}` });
}

export async function analytics(req, res) {
  const [products, users, orders, revenue] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }])
  ]);
  res.json({
    products,
    users,
    orders,
    revenue: revenue[0]?.total || 0
  });
}
