import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { useFadeIn } from "../hooks/useFadeIn";

const categories = [
  "All",
  "Baby Clothing",
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Handbags",
  "Heels",
  "Kids Wear",
  "Kurti",
  "Sarees",
  "Tops",
  "Dresses",
  "Shoes"
];

const colorOptions = ["", "Black", "White", "Blue", "Red", "Green", "Gold", "Pink", "Purple", "Grey", "Beige"];

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Price Low to High", value: "price_asc" },
  { label: "Price High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" }
];

export function CategoryPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(params.get("search") || "");
  const filtersRef = useFadeIn();
  const listRef = useFadeIn();

  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "popularity";
  const minPrice = Number(params.get("minPrice") || 0);
  const maxPrice = Number(params.get("maxPrice") || 10000);
  const color = params.get("color") || "";

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => update("search", searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { category, search, sort, minPrice, maxPrice, color, limit: 24 } })
      .then((r) => setItems(r.data.items))
      .finally(() => setLoading(false));
  }, [category, search, sort, minPrice, maxPrice, color]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value || value === 0) next.set(key, String(value));
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside ref={filtersRef} className="card-soft fade-in h-fit space-y-5 p-5 lg:sticky lg:top-24">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.24em] text-text-secondary">Curate Results</p>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Search</h2>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search kurti, jeans, saree..."
            className="glam-input w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const selected = (category || "All").toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => update("category", c === "All" ? "" : c)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${selected ? "bg-gradient-pink-purple text-text-primary" : "border border-white/10 bg-primary/65 text-text-secondary hover:text-neonPink"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Price Range</h2>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minPrice}
              onChange={(e) => update("minPrice", Math.min(Number(e.target.value), maxPrice))}
              className="w-full accent-neonPink"
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => update("maxPrice", Math.max(Number(e.target.value), minPrice))}
              className="w-full accent-electricPurple"
            />
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Rs {minPrice}</span>
              <span>Rs {maxPrice}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Color</h2>
          <select value={color} onChange={(e) => update("color", e.target.value)} className="glam-input w-full rounded-lg px-3 py-2 text-sm">
            {colorOptions.map((x) => <option key={x || "all"} value={x}>{x || "All Colors"}</option>)}
          </select>
        </div>

        <button onClick={() => setParams(new URLSearchParams())} className="glam-button w-full rounded-lg px-3 py-2 text-sm">
          Clear Filters
        </button>
      </aside>

      <section ref={listRef} className="space-y-4 fade-in">
        <div className="card-gradient flex items-center justify-between gap-4 p-4">
          <p className="text-sm text-text-secondary">{loading ? "Loading..." : `${items.length} products`}</p>
          <select value={sort} onChange={(e) => update("sort", e.target.value)} className="glam-input rounded-lg px-3 py-2 text-sm">
            {sortOptions.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </div>

        {loading ? <p className="text-text-secondary">Loading products...</p> : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => <ProductCard key={item._id} item={item} />)}
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="card-soft p-8 text-center text-text-secondary">
            No products found. Try adjusting search, category, or price range.
          </div>
        )}
      </section>
    </div>
  );
}
