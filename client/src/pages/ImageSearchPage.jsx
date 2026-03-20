import { useState } from "react";
import { ImagePlus, ScanSearch } from "lucide-react";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { useFadeIn } from "../hooks/useFadeIn";

export function ImageSearchPage() {
  const [analysis, setAnalysis] = useState(null);
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState("");
  const sectionRef = useFadeIn();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("image", file);
    const { data } = await api.post("/ai/image-search", form);
    setAnalysis(data.analysis);
    setItems(data.items || []);
  };

  return (
    <div className="space-y-8">
      <section ref={sectionRef} className="glam-feature blue fade-in p-6 pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-brightBlue">
              <ScanSearch size={14} />
              Visual Discovery
            </p>
            <h1 className="display-font text-3xl">Image-Based Fashion Search</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">Upload any clothing image to find similar items from Glamora.</p>
          </div>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-primary/45 px-4 py-4 text-sm text-text-secondary hover:border-neonPink">
          <ImagePlus size={18} className="text-neonPink" />
          <span>Upload an image to start matching styles</span>
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
        {preview && <img src={preview} alt="Uploaded preview" className="mt-4 h-64 rounded-xl object-cover" />}
        {analysis && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-primary/60 p-4 text-sm text-text-primary">
            <p>Type: {analysis.type}</p>
            <p>Color: {analysis.color}</p>
            <p>Pattern: {analysis.pattern}</p>
          </div>
        )}
      </section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => <ProductCard key={item._id} item={item} />)}
      </div>
    </div>
  );
}
