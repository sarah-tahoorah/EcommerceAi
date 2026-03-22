import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Landmark,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { resolveAssetUrl } from "../utils/assetUrl";

const paymentOptions = [
  { key: "credit", label: "Credit Card", icon: CreditCard, tint: "from-[#ffccd9] via-[#f8d7ff] to-[#e3dcff]" },
  { key: "debit", label: "Debit Card", icon: CreditCard, tint: "from-[#ffe0cf] via-[#ffe7dd] to-[#fff2ec]" },
  { key: "upi", label: "UPI", icon: QrCode, tint: "from-[#d8ecff] via-[#e4efff] to-[#f2f7ff]" },
  { key: "netbanking", label: "Net Banking", icon: Landmark, tint: "from-[#d8fff2] via-[#e6fbf3] to-[#f3fffb]" },
  { key: "cod", label: "Cash on Delivery", icon: Banknote, tint: "from-[#ffe8c9] via-[#fff1db] to-[#fff8ee]" }
];

export function CheckoutPage() {
  const { cart, setCart, user } = useApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(() => `GLM${Math.floor(10000 + Math.random() * 90000)}`);
  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const subtotal = total;
  const shipping = cart.length > 0 ? 199 : 0;
  const finalTotal = subtotal + shipping;

  useEffect(() => {
    if (!user) navigate("/profile", { state: { redirectTo: "/checkout" }, replace: true });
  }, [user, navigate]);

  const placeOrder = (e) => {
    e.preventDefault();
    setPlaced(true);
    setCart([]);
  };

  if (placed) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl overflow-hidden rounded-[32px] border border-black/5 bg-[linear-gradient(135deg,#fff7fb_0%,#f4f1ff_44%,#eef7ff_100%)] p-8 text-center shadow-[0_24px_60px_rgba(17,24,39,0.08)]"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#ff2e63] via-[#7c3aed] to-[#2563eb] text-white shadow-[0_12px_24px_rgba(124,58,237,0.28)]">
          <CheckCircle2 />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#7c3aed]">Order Confirmed</p>
        <h1 className="display-font mt-2 text-4xl text-neutral-900">Your Glamora order is placed.</h1>
        <p className="mt-3 text-neutral-600">Everything is confirmed and your order is now being prepared with care.</p>
        <div className="mt-6 rounded-[24px] border border-black/5 bg-white/80 p-5 text-left shadow-[0_14px_32px_rgba(37,99,235,0.08)]">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>
        <button onClick={() => navigate("/category")} className="mt-7 rounded-full px-7 py-3 gold-button">
          Continue Shopping
        </button>
      </motion.section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={placeOrder} className="space-y-6">
          <section className="rounded-[30px] border border-black/5 bg-white/80 p-6 shadow-[0_18px_36px_rgba(17,24,39,0.06)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">Delivery Details</p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Shipping Information</h2>
              </div>
              <div className="rounded-full bg-[#fdf2f8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#ff2e63]">
                Step 1
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input className="glam-input rounded-2xl px-4 py-3" placeholder="Full Name" required />
              <input className="glam-input rounded-2xl px-4 py-3" placeholder="Email Address" type="email" required />
              <input className="glam-input rounded-2xl px-4 py-3" placeholder="Phone Number" required />
              <input className="glam-input rounded-2xl px-4 py-3" placeholder="Delivery Address" required />
              <input className="glam-input rounded-2xl px-4 py-3" placeholder="City" required />
              <input className="glam-input rounded-2xl px-4 py-3" placeholder="Pincode" required />
            </div>
          </section>

          <section className="rounded-[30px] border border-black/5 bg-white/80 p-6 shadow-[0_18px_36px_rgba(17,24,39,0.06)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">Payment</p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Choose Your Method</h2>
              </div>
              <div className="rounded-full bg-[#eef2ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2563eb]">
                Step 2
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const active = paymentMethod === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setPaymentMethod(option.key)}
                    className={`rounded-[24px] border p-4 text-left transition ${
                      active
                        ? "border-[#7c3aed] bg-white shadow-[0_0_0_2px_rgba(124,58,237,0.14),0_16px_30px_rgba(124,58,237,0.08)]"
                        : "border-black/6 bg-white/70 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(17,24,39,0.06)]"
                    }`}
                  >
                    <div className={`rounded-[20px] bg-gradient-to-br ${option.tint} p-3`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? "bg-gradient-to-r from-[#ff2e63] to-[#7c3aed] text-white" : "bg-white/80 text-[#7c3aed]"}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{option.label}</p>
                            <p className="text-xs text-neutral-500">Fast and secure payment</p>
                          </div>
                        </div>
                        {active && <CheckCircle2 size={18} className="text-[#7c3aed]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {(paymentMethod === "credit" || paymentMethod === "debit") && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input className="glam-input rounded-2xl px-4 py-3 sm:col-span-2" placeholder="Card Number" required />
                <input className="glam-input rounded-2xl px-4 py-3" placeholder="Card Holder Name" required />
                <input className="glam-input rounded-2xl px-4 py-3" placeholder="Expiry Date (MM/YY)" required />
                <input className="glam-input rounded-2xl px-4 py-3" placeholder="CVV" required />
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="mt-6 rounded-[24px] bg-[#eef6ff] p-4">
                <input className="glam-input w-full rounded-2xl px-4 py-3" placeholder="Enter UPI ID" required />
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="mt-6 rounded-[24px] bg-[#f0fdf4] p-4">
                <select className="glam-input w-full rounded-2xl px-4 py-3" required>
                  <option value="">Select Bank</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>SBI</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="mt-6 rounded-[24px] bg-[#fff7ed] p-4 text-sm text-neutral-700">
                Pay at your doorstep when the order arrives.
              </div>
            )}
          </section>

          <button type="submit" className="w-full rounded-full px-6 py-3.5 text-lg gold-button">
            Place Order
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-[30px] border border-black/5 bg-white/85 p-6 shadow-[0_18px_36px_rgba(17,24,39,0.06)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">Order Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Your Edit</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff2e63] to-[#7c3aed] text-white shadow-[0_10px_24px_rgba(124,58,237,0.2)]">
                <ShoppingBag size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {cart.length === 0 && (
                <div className="rounded-2xl bg-[#f9fafb] p-4 text-sm text-neutral-500">Your cart is empty.</div>
              )}
              {cart.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex gap-3 rounded-[24px] border border-black/6 bg-[#fcfcfd] p-3 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
                  <img src={resolveAssetUrl(item.imagePath)} alt={item.name} className="h-20 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{item.name}</p>
                    <p className="mt-1 text-xs text-neutral-500">Size: {item.size}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#7c3aed]">Rs {item.price * item.qty}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] bg-[linear-gradient(135deg,#fff0f5_0%,#f5efff_44%,#eef6ff_100%)] p-4">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `Rs ${shipping}`}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="text-xl font-semibold text-[#7c3aed]">Rs {finalTotal}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-[linear-gradient(135deg,#fff5f8_0%,#f4f1ff_54%,#edf7ff_100%)] p-5 shadow-[0_16px_30px_rgba(17,24,39,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff2e63]">Glamora Promise</p>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7c3aed] shadow-[0_10px_20px_rgba(124,58,237,0.1)]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Secure demo checkout with style-first polish</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Your final step should feel reassuring, premium, and effortless — just like the rest of Glamora.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/5 bg-white/80 p-4 shadow-[0_12px_26px_rgba(17,24,39,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Ready to place your order?</p>
                <p className="mt-1 text-xs text-neutral-500">Quick final review before payment.</p>
              </div>
              <ChevronRight size={18} className="text-[#7c3aed]" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
