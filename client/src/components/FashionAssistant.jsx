import { useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import { api } from "../api/client";
import { ProductCard } from "./ProductCard";

export function FashionAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [items, setItems] = useState([]);

  const ask = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const { data } = await api.post("/ai/chat", { message });
    setReply(data.reply);
    setItems(data.items || []);
  };

  return (
    <section className="card-soft section-green space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#14b8a6]">
            <Sparkles size={14} />
            AI Styling
          </p>
          <h2 className="display-font text-3xl text-text-primary">AI Fashion Assistant</h2>
          <p className="mt-2 max-w-xl text-sm text-text-secondary">Ask for looks, budgets, outfit pairings, and trend-led suggestions in seconds.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14b8a6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.18)]">
          <WandSparkles size={20} />
        </div>
      </div>
      <form onSubmit={ask} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Try: "Show dresses under Rs 2000"'
          className="glam-input w-full rounded-full px-4 py-3 text-sm"
        />
        <button className="glam-button rounded-full px-6 py-3">Ask</button>
      </form>
      {reply && <div className="rounded-2xl border border-black/8 bg-[#ececec] p-4 text-sm text-text-secondary">{reply}</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => <ProductCard key={item._id} item={item} />)}
      </div>
    </section>
  );
}
