import React from "react";
import { Sparkle, ArrowRight } from "lucide-react";

interface AtelierDashboardProps {
  onNavigate: (tab: "dashboard" | "collection" | "reviews") => void;
  onAddToCart: (prodId: string) => void;
  cartCount: number;
  cartItems: any[];
}

export const AtelierDashboard: React.FC<AtelierDashboardProps> = ({
  onNavigate,
  onAddToCart,
  cartCount,
}) => {
  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* THE ATELIER OVERVIEW */}
      <div className="max-w-xl mx-auto w-full">
        
        {/* Box: Quick Commission Call-to-Action */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-neutral-50 border border-neutral-200/80 shadow-md flex flex-col justify-between gap-6 min-h-[280px]">
          <div className="flex flex-col gap-3 items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-bronze-gold/10 border border-bronze-gold/20 flex items-center justify-center text-bronze-gold">
              <Sparkle className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-base font-serif text-neutral-900 tracking-wide mt-2 font-medium">Ready to Forge Your Masterpiece?</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans max-w-sm">
              Experience full dual-ignition custom selection, hand-chiseled monogram engraving, and acoustic alignment in our digital French atelier.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 mt-2">
            <button
              onClick={() => onNavigate("collection")}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-sans tracking-[0.18em] uppercase font-bold text-[10px] rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Enter Curated Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                const saved = localStorage.getItem("flint_and_steel_vault_cart");
                const items = saved ? JSON.parse(saved) : [];
                if (items.length > 0) {
                   onAddToCart(items[0].product.id);
                } else {
                  onNavigate("collection");
                }
              }}
              className="w-full py-2.5 bg-transparent hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 font-sans tracking-[0.18em] uppercase text-[9px] rounded-xl cursor-pointer transition-colors"
            >
              Review Active Vault ({cartCount})
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
