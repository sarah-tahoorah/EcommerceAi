import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    oldPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    rating: { type: Number, default: 4.2 },
    reviewCount: { type: Number, default: 0 },
    fabric: { type: String, default: "" },
    color: { type: String, default: "Black", index: true },
    pattern: { type: String, default: "Solid" },
    sizes: [{ type: String }],
    stock: { type: Number, default: 10 },
    tags: [{ type: String }],
    imagePath: { type: String, required: true }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

export const Product = mongoose.model("Product", productSchema);
