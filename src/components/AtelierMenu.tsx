import React from "react";
import { 
  X, Sparkles, BookOpen, Star, Crown, ArrowRight, ArrowUpRight, Award
} from "lucide-react";

interface AtelierMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: "collection" | "reviews" | "top-selling") => void;
  onAddToCart?: (prodId: string) => void;
}

export const AtelierMenu: React.FC<AtelierMenuProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onAddToCart 
}) => {
  if (!isOpen) return null;

  const handleSelectOption = (action: () => void) => {
    action();
    onClose();
  };

  const handleScrollToSpecial = () => {
    // Navigate to collection first
    if (onNavigate) {
      onNavigate("collection");
    }
    
    // Smooth scroll to Dynasty Urushi or Damascus product in the list
    setTimeout(() => {
      const grid = document.getElementById("curated-collection-grid");
      if (grid) {
        grid.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Find and highlight special edition lighters (dynasty or damascus)
        const elements = document.querySelectorAll(`[key="dynasty"], [key="overlord"]`);
        elements.forEach((el) => {
          el.classList.add("ring-2", "ring-bronze-gold", "scale-[1.01]", "duration-1000");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-bronze-gold", "scale-[1.01]");
          }, 3000);
        });
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Soft luxury backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Menu Side Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200/80 flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="px-6 py-6 bg-neutral-50/50 border-b border-neutral-150 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-bronze-gold" />
              <span className="text-[10px] font-sans tracking-[0.25em] font-semibold text-neutral-800 uppercase">
                Maison Navigation
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer border border-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Content - Scrollable on short viewports */}
          <div className="flex-1 overflow-y-auto px-6 py-10 gap-6 flex flex-col justify-start">
            
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-[9px] font-mono tracking-widest text-bronze-gold uppercase">Exclusive Directory</span>
              <h4 className="text-xl font-serif text-neutral-900 tracking-wide">Select Destination</h4>
            </div>

            {/* Option 1: The Collection */}
            <button
              onClick={() => handleSelectOption(() => onNavigate?.("collection"))}
              className="group p-5 bg-[#FAF9F6] hover:bg-neutral-50 border border-neutral-200/60 hover:border-bronze-gold/30 rounded-2xl transition-all duration-300 text-left cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white border border-neutral-200/50 text-bronze-gold group-hover:text-bronze-gold transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h5 className="text-[13px] font-serif text-neutral-900 font-medium group-hover:text-bronze-gold transition-colors">
                    The Collection
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-sans max-w-[200px]">
                    Explore our masterwork acoustic lighters hand-assembled in France.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-bronze-gold transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Option: Top Selling */}
            <button
              onClick={() => handleSelectOption(() => onNavigate?.("top-selling"))}
              className="group p-5 bg-[#FAF9F6] hover:bg-neutral-50 border border-neutral-200/60 hover:border-bronze-gold/30 rounded-2xl transition-all duration-300 text-left cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white border border-neutral-200/50 text-amber-500 group-hover:text-amber-600 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h5 className="text-[13px] font-serif text-neutral-900 font-medium group-hover:text-bronze-gold transition-colors">
                    Top Selling
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-sans max-w-[200px]">
                    Discover our highest ranked, most popular, and absolute best-selling masterpieces.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-bronze-gold transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Option 2: Patron Reviews */}
            <button
              onClick={() => handleSelectOption(() => onNavigate?.("reviews"))}
              className="group p-5 bg-[#FAF9F6] hover:bg-neutral-50 border border-neutral-200/60 hover:border-bronze-gold/30 rounded-2xl transition-all duration-300 text-left cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white border border-neutral-200/50 text-bronze-gold group-hover:text-bronze-gold transition-colors">
                  <Star className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h5 className="text-[13px] font-serif text-neutral-900 font-medium group-hover:text-bronze-gold transition-colors">
                    Patron Reviews
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-sans max-w-[200px]">
                    Read verified testimonials from distinguished collectors worldwide.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-bronze-gold transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Option 3: Special Collection */}
            <button
              onClick={() => handleSelectOption(handleScrollToSpecial)}
              className="group p-5 bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6] border border-bronze-gold/25 hover:border-bronze-gold/50 rounded-2xl transition-all duration-300 text-left cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white border border-neutral-200/50 text-amber-500 group-hover:text-amber-600 transition-colors">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h5 className="text-[13px] font-serif text-neutral-900 font-medium group-hover:text-bronze-gold transition-colors">
                    Special Collection
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-sans max-w-[200px]">
                    Discover our rare limited edition Kyoto Urushi and Solid Damascus masterpieces.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-bronze-gold transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

          </div>

          {/* Footer */}
          <div className="p-6 bg-neutral-50/50 border-t border-neutral-150 flex flex-col gap-1 text-center">
            <span className="text-[9px] font-mono text-neutral-500 tracking-widest">
              Flint N Steel
            </span>
            <span className="text-[8px] font-mono text-neutral-400">
              EST. 1872 • PLACE VENDÔME
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
