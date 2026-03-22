import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { resolveAssetUrl } from "../utils/assetUrl";

const categoryAccentMap = {
  Dresses: { border: "border-t-[#ff2e63]", label: "text-[#ff2e63]", surface: "bg-[#fdf2f8]" },
  Sarees: { border: "border-t-[#7c3aed]", label: "text-[#7c3aed]", surface: "bg-[#f5f3ff]" },
  Shoes: { border: "border-t-[#ff7a00]", label: "text-[#ff7a00]", surface: "bg-[#fff7ed]" },
  Heels: { border: "border-t-[#ff7a00]", label: "text-[#ff7a00]", surface: "bg-[#fff7ed]" },
  Handbags: { border: "border-t-[#2563eb]", label: "text-[#2563eb]", surface: "bg-[#eff6ff]" },
  "Kids Wear": { border: "border-t-[#14b8a6]", label: "text-[#14b8a6]", surface: "bg-[#f0fdfa]" }
};

export function ProductCard({ item, badge, badgeTone = "hot" }) {
  const { wishlist, toggleWishlist } = useApp();
  const inWishlist = wishlist.includes(item._id);
  const accent = categoryAccentMap[item.category] || { border: "border-t-[#4338ca]", label: "text-[#4338ca]", surface: "bg-[#f9fafb]" };

  return (
    <article className={`group card-hover shimmer-card overflow-hidden rounded-[20px] border border-black/8 border-t-4 ${accent.border} ${accent.surface} shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}>
      <Link to={`/product/${item._id}`} className="relative block aspect-[3/4] overflow-hidden">
        <img
          src={resolveAssetUrl(item.imagePath)}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-text-primary ${badgeTone === "cool" ? "badge-cool" : "badge-hot"}`}>
            {badge}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(item._id);
          }}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-[#f1f1f1]/95 backdrop-blur-sm"
        >
          <Heart size={18} className={inWishlist ? "fill-[#e11d48] text-[#e11d48]" : "text-text-secondary group-hover:text-text-primary"} />
        </button>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`mb-1 text-[11px] uppercase tracking-[0.28em] ${accent.label}`}>{item.category}</p>
            <h3 className="line-clamp-2 text-lg font-semibold text-text-primary">{item.name}</h3>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-black/8 bg-[#f1f1f1] px-2.5 py-1 text-xs text-text-secondary">
            <Star size={13} className="text-text-primary" /> {item.rating}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="price-pill rounded-full px-4 py-2 text-sm">Rs {item.price}</span>
          <span className="text-xs uppercase tracking-[0.22em] text-text-secondary">Shop Now</span>
        </div>
      </div>
    </article>
  );
}
