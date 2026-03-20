import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useFadeIn } from "../hooks/useFadeIn";

export function AdminPage() {
  const [stats, setStats] = useState(null);
  const [zip, setZip] = useState(null);
  const [category, setCategory] = useState("");
  const panelRef = useFadeIn();

  const load = () => api.get("/admin/analytics").then((r) => setStats(r.data));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!zip || !category) return;
    const form = new FormData();
    form.append("zip", zip);
    form.append("category", category);
    await api.post("/admin/dataset", form);
    await load();
    alert("Dataset uploaded and catalog refreshed");
  };

  return (
    <div className="space-y-6 fade-in" ref={panelRef}>
      <h1 className="display-font text-3xl">Admin Panel</h1>
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl card-soft p-4">Products: {stats.products}</div>
          <div className="rounded-xl card-soft p-4">Users: {stats.users}</div>
          <div className="rounded-xl card-soft p-4">Orders: {stats.orders}</div>
          <div className="rounded-xl card-soft p-4">Revenue: Rs {Math.round(stats.revenue)}</div>
        </div>
      )}
      <form onSubmit={upload} className="rounded-2xl card-soft p-6">
        <h2 className="mb-3 text-xl font-semibold">Upload ZIP Dataset</h2>
        <input type="text" placeholder="Category (example: kurti)" onChange={(e) => setCategory(e.target.value)} className="glam-input mb-3 w-full rounded-lg px-3 py-2" />
        <input type="file" accept=".zip" onChange={(e) => setZip(e.target.files?.[0])} />
        <button className="mt-4 rounded-lg px-4 py-2 gold-button shimmer-button">Upload</button>
      </form>
    </div>
  );
}
