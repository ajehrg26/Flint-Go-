import React, { useState, useMemo } from "react";
import { LighterProduct } from "../types";
import { PRODUCTS, FINISHES } from "../data";
import { Compass, Weight, Ruler, Flame, Volume2, SlidersHorizontal, Star, Sparkles } from "lucide-react";

interface ProductCatalogProps {
  products: LighterProduct[];
  onSelectProduct: (product: LighterProduct) => void;
  onlyTopSelling?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onSelectProduct, onlyTopSelling = false }) => {
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "popularity">("default");

  const sortedProducts = useMemo(() => {
    let list = [...products];
    if (onlyTopSelling) {
      list = list.filter((p) => p.popularity >= 80);
    }
    if (sortBy === "price-asc") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "popularity") {
      return list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [products, sortBy, onlyTopSelling]);

  return (
    <div id="curated-collection-grid" className="flex flex-col gap-8">
      
      {/* Header & Sorting Section */}
      <div data-reveal style={{ transitionDuration: "600ms" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/50 pb-6">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-serif text-[#1F1E1A] tracking-wide">
              {onlyTopSelling ? "Maison Best Sellers" : "The Paris Collection"}
            </h2>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              {onlyTopSelling 
                ? "Our highly-coveted, acoustically aligned masterworks chosen by elite collectors worldwide."
                : "Four distinct architectures of mechanical excellence. Each lighter is individually numbered, hand-assembled, and acoustically tuned in France."}
            </p>
          </div>

          {/* Premium Sorting Controller */}
          <div className="flex items-center gap-2.5 bg-white px-3.5 py-2.5 rounded-xl border border-neutral-200/80 self-center sm:self-auto group hover:border-bronze-gold/20 transition-all shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-bronze-gold" />
            <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase whitespace-nowrap">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[11px] font-sans font-semibold text-neutral-800 tracking-wide focus:outline-none cursor-pointer pr-1 select-none border-none outline-none text-right"
            >
              <option value="default" className="bg-white text-neutral-700">Featured Heritage</option>
              <option value="price-asc" className="bg-white text-neutral-700">Price: Low to High</option>
              <option value="price-desc" className="bg-white text-neutral-700">Price: High to Low</option>
              <option value="popularity" className="bg-white text-neutral-700">Popularity Rank</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((prod, idx) => (
          <ProductCard
            key={prod.id}
            prod={prod}
            idx={idx}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};

interface ProductCardProps {
  prod: LighterProduct;
  idx: number;
  onSelectProduct: (product: LighterProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ prod, idx, onSelectProduct }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const firstFinish = FINISHES.find((f) => f.id === prod.finishes[0]);
  const finishGradient = firstFinish ? firstFinish.bgGradient : "from-neutral-300 to-neutral-400";

  return (
    <div data-reveal style={{ transitionDelay: `${(idx % 3) * 120}ms`, transitionDuration: "800ms" }} className="flex flex-col">
      <div
        onClick={() => onSelectProduct(prod)}
        className="flex flex-col justify-between bg-white border border-neutral-200/80 hover:border-bronze-gold/50 rounded-2xl p-4 sm:p-5 transition-all duration-500 ease-out relative group/card shadow-sm hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-1 cursor-pointer flex-1"
      >
        {/* Product Card Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">{prod.sku}</span>
              {prod.category && (
                <span className="px-2 py-0.5 rounded-full text-[7px] font-mono uppercase tracking-widest bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white border border-neutral-950/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.4)] font-semibold backdrop-blur-md">
                  {prod.category}
                </span>
              )}
              {prod.popularity >= 90 && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[7px] font-mono font-bold uppercase tracking-widest bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 text-white border border-rose-950/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md">
                  <Sparkles className="w-2 h-2" /> Hot
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {prod.finishes.map((fId) => {
                const finish = FINISHES.find((fin) => fin.id === fId);
                if (!finish) return null;
                return (
                  <div
                    key={fId}
                    className={`w-3 h-3 rounded-full border border-neutral-200 bg-gradient-to-tr ${finish.bgGradient}`}
                    title={finish.name}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-baseline mt-1">
            <h3 className="text-base sm:text-lg font-serif font-medium text-neutral-900 tracking-wide">{prod.name}</h3>
          </div>
          <span className="text-[11px] text-bronze-gold/90 italic tracking-wide mt-0.5">{prod.tagline}</span>
          <p className="text-xs text-neutral-500 leading-relaxed mt-1.5 line-clamp-2">{prod.description}</p>
        </div>

        {/* Central Abstract Art Piece representing metallurgy or custom product image */}
        <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-tr from-[#FAF9F6] to-[#EFECE4] border border-neutral-200 my-4 overflow-hidden flex items-center justify-center">
          {prod.images && prod.images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={prod.images[activeImageIdx] || prod.images[0]}
                alt={prod.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover/card:scale-102"
                referrerPolicy="no-referrer"
              />
              {/* Thumbnail overlay for switching images */}
              {prod.images.length > 1 && (
                <div 
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/55 backdrop-blur px-2.5 py-1.5 rounded-full z-10 transition-colors pointer-events-auto" 
                  onClick={(e) => e.stopPropagation()}
                >
                  {prod.images.map((imgUrl, imageIdx) => (
                    <button
                      key={imageIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx(imageIdx);
                      }}
                      className={`w-7 h-5 rounded overflow-hidden border transition-all ${
                        activeImageIdx === imageIdx 
                          ? "border-amber-400 scale-110 shadow-md shadow-black/50" 
                          : "border-white/20 opacity-55 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Embedded luxury radial waves */}
              <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-tr ${finishGradient} opacity-20 blur-lg animate-pulse`} />
              
              {/* Stylized wireframe lighter */}
              <div className="absolute w-[42px] h-[80px] rounded border border-neutral-200 bg-white shadow-sm flex flex-col justify-between p-1.5">
                <div className="w-full h-[18px] border-b border-neutral-100 flex justify-between">
                  <div className="w-1 h-1 rounded-full bg-neutral-200" />
                  <div className="w-2 h-0.5 bg-neutral-100 rounded-sm" />
                </div>
                <div className="w-full h-[45px] flex flex-col items-center justify-center opacity-45">
                  <Compass className="w-4 h-4 text-bronze-gold stroke-[1.5]" />
                </div>
              </div>
            </>
          )}

          {/* Technical badge overlay */}
          <div className="absolute bottom-2 right-2 bg-gradient-to-b from-[#bfa260] via-[#a38038] to-[#8c6c2b] px-2 py-0.5 rounded-full text-[7px] font-mono tracking-widest text-white uppercase border border-[#8c6c2b]/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.25)] font-bold">
            Handmade France
          </div>
        </div>

        {/* Technical specifications strip */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-neutral-100 pt-2.5 mb-3 text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1"><Weight className="w-2.5 h-2.5" /> {prod.weight}</span>
          <span className="text-neutral-200">•</span>
          <span className="flex items-center gap-1"><Ruler className="w-2.5 h-2.5" /> {prod.dimensions}</span>
          <span className="text-neutral-200">•</span>
          <span className="flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> {prod.fuel.split(" ")[1] || "Gas"} Gas</span>
        </div>

        {/* Price block at the bottom */}
        <div className="flex justify-between items-center mb-3 mt-auto border-t border-neutral-100 pt-2.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">Heritage Price</span>
          <span className="text-sm font-mono text-[#a68226] font-bold">${prod.price}</span>
        </div>

        {/* Purchase / Add to Vault button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(prod);
          }}
          className="w-full py-2.5 bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white rounded-xl text-[10px] font-sans tracking-[0.15em] font-bold uppercase transition-all duration-300 border border-neutral-950/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.45)] hover:from-neutral-700 hover:via-neutral-900 hover:to-neutral-950 hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_6px_20px_rgba(0,0,0,0.55)] active:scale-[0.98] cursor-pointer"
        >
          Bespoke Selection
        </button>
      </div>
    </div>
  );
};
