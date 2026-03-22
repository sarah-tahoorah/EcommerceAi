import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useFadeIn } from "../hooks/useFadeIn";
import { resolveAssetUrl } from "../utils/assetUrl";

export function CartPage() {
  const { cart, setCart } = useApp();
  const navigate = useNavigate();
  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const cartRef = useFadeIn();

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const remove = (id) => setCart((prev) => prev.filter((i) => i._id !== id));

  return (
    <div className="space-y-6 fade-in" ref={cartRef}>
      <h1 className="display-font text-3xl">Cart</h1>
      {cart.map((i) => (
        <div key={i._id + i.size} className="flex items-center gap-4 rounded-2xl card-soft p-4">
          <img src={resolveAssetUrl(i.imagePath)} alt={i.name} loading="lazy" decoding="async" className="h-24 w-20 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="font-semibold text-neutral-800">{i.name}</p>
            <p className="text-sm text-neutral-500">Size: {i.size}</p>
            <p className="text-neutral-700">Rs {i.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQty(i._id, -1)} className="btn-outline rounded-full px-2">-</button>
            <span>{i.qty}</span>
            <button onClick={() => updateQty(i._id, 1)} className="btn-outline rounded-full px-2">+</button>
          </div>
          <button onClick={() => remove(i._id)} className="text-rose-500">
            Remove
          </button>
        </div>
      ))}
      <div className="rounded-2xl card-gradient p-4">
        <p className="text-neutral-700">Total: Rs {total}</p>
        <button onClick={() => navigate("/checkout")} className="mt-2 rounded-full px-4 py-2 gold-button shimmer-button">
          Checkout
        </button>
      </div>
    </div>
  );
}
