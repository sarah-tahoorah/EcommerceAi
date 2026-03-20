import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "..", "public");

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(morgan("dev"));
app.use("/products", express.static(path.join(publicDir, "products")));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "sellora-api" }));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/glamora";
connectDB(uri).then(() => {
  app.listen(port, () => console.log(`Glamora API running at http://localhost:${port}`));
});
