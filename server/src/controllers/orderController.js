import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export async function createOrder(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "No items provided" });
  const ids = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const mapped = items
    .map((i) => {
      const p = products.find((x) => x._id.toString() === i.productId);
      if (!p) return null;
      return { productId: p._id, qty: i.qty, price: p.price };
    })
    .filter(Boolean);
  const total = mapped.reduce((sum, i) => sum + i.qty * i.price, 0);
  const order = await Order.create({ userId: req.user.id, items: mapped, total, status: "Placed" });
  res.status(201).json(order);
}

export async function getOrders(req, res) {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
}
