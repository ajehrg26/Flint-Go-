import React, { useState, useEffect, useMemo } from "react";
import { LighterProduct, CartItem, FinishDetails, FlameDetails, FontId } from "../types";
import { FINISHES, FLAMES, FONTS } from "../data";
import { 
  X, Star, ShoppingBag, CreditCard, Flame, Shield, 
  ChevronLeft, ChevronRight, Check, Truck, Info, 
  Sparkles, MapPin, HelpCircle, Lock, Gift, ArrowRight 
} from "lucide-react";
import { playLidSound, playSparkSound, playFlameSound } from "../utils/audio";

interface BespokeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  product: LighterProduct | null;
  onAddToCart: (customItem: Omit<CartItem, "id">) => void;
  onTriggerCheckout: (customItem: Omit<CartItem, "id">) => void;
}

export const BespokeCustomizer: React.FC<BespokeCustomizerProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onTriggerCheckout,
}) => {
  // Find defaults based on product specifications safely
  const availableFinishes = product ? FINISHES.filter((f) => product.finishes.includes(f.id)) : [];
  const availableFlames = product ? FLAMES.filter((f) => product.flames.includes(f.id)) : [];

  const [selectedFinish, setSelectedFinish] = useState<FinishDetails>(
    availableFinishes[0] || FINISHES[0]
  );
  const [selectedFlame, setSelectedFlame] = useState<FlameDetails>(
    availableFlames[0] || FLAMES[0]
  );
  const [engravingText, setEngravingText] = useState("");
  const [selectedFont, setSelectedFont] = useState<FontId>("serif");
  const [activeTab, setActiveTab] = useState<"specs" | "heritage">("specs");
  
  // Image Carousel Slide State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      const pFinishes = FINISHES.filter((f) => product.finishes.includes(f.id));
      const pFlames = FLAMES.filter((f) => product.flames.includes(f.id));
      setSelectedFinish(pFinishes[0] || FINISHES[0]);
      setSelectedFlame(pFlames[0] || FLAMES[0]);
      setEngravingText("");
      setSelectedFont("serif");
      setCurrentSlide(0);
      setActiveTab("specs");
    }
  }, [product]);

  // Play a premium lid opening ring of the selected finish when customizer opens
  useEffect(() => {
    if (isOpen && product) {
      const pFinishes = FINISHES.filter((f) => product.finishes.includes(f.id));
      const initialFinish = pFinishes[0] || FINISHES[0];
      playLidSound(initialFinish.id, "open");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (selectedFinish) {
      playLidSound(selectedFinish.id, "close");
    }
    onClose();
  };

  // Define dynamic slides list
  const slidesList = useMemo(() => {
    const list: { type: "image" | "mockup" | "flame" | "packaging"; url?: string; label: string }[] = [];
    if (product && product.images && product.images.length > 0) {
      product.images.forEach((url, idx) => {
        list.push({
          type: "image",
          url,
          label: product.images && product.images.length > 1 ? `Product Image ${idx + 1}` : "Curated Product Photo"
        });
      });
    } else {
      list.push({
        type: "mockup",
        label: "Front Perspective Shot"
      });
    }

    if (selectedFlame) {
      list.push({
        type: "flame",
        label: `Lit Action • ${selectedFlame.name}`
      });
    }

    list.push({
      type: "packaging",
      label: "Atelier Premium Packaging Included"
    });

    return list;
  }, [product, selectedFlame]);

  const totalSlides = slidesList.length;

  const triggerSlideSound = (slideIndex: number) => {
    if (selectedFinish) {
      const slide = slidesList[slideIndex];
      if (!slide) return;
      if (slide.type === "image" || slide.type === "mockup") {
        playLidSound(selectedFinish.id, "open");
      } else if (slide.type === "flame") {
        playSparkSound();
        setTimeout(() => {
          playFlameSound(true);
        }, 80);
      } else if (slide.type === "packaging") {
        playLidSound(selectedFinish.id, "close");
      }
    }
  };

  // Calculate live prices
  const basePrice = product ? product.price : 0;
  const finishModifier = selectedFinish ? selectedFinish.priceModifier : 0;
  const flameModifier = selectedFlame ? selectedFlame.priceModifier : 0;
  const engravingPrice = engravingText.trim().length > 0 ? 30 : 0;
  
  const totalPrice = basePrice + finishModifier + flameModifier + engravingPrice;
  // Flipkart strikethrough retail price (53% off mock math)
  const retailPrice = Math.round(totalPrice * 2.15);
  const discountPercentage = Math.round(((retailPrice - totalPrice) / retailPrice) * 100);
  const upiOfferPrice = Math.round(totalPrice * 0.9); // 10% UPI offer discount

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev === 0 ? totalSlides - 1 : prev - 1;
      triggerSlideSound(next);
      return next;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev === totalSlides - 1 ? 0 : prev + 1;
      triggerSlideSound(next);
      return next;
    });
  };

  const handleAddToVault = () => {
    if (!product) return;
    onAddToCart({
      product,
      finish: selectedFinish,
      flame: selectedFlame,
      engravingText: engravingText.trim(),
      engravingFont: selectedFont,
      quantity: 1,
    });
    handleClose();
  };

  const handleInstantBespokeCheckout = () => {
    if (!product) return;
    onTriggerCheckout({
      product,
      finish: selectedFinish,
      flame: selectedFlame,
      engravingText: engravingText.trim(),
      engravingFont: selectedFont,
      quantity: 1,
    });
    handleClose();
  };

  const activeFontDetails = FONTS.find((font) => font.id === selectedFont) || FONTS[0];

  // Early return for rendering moved after hooks
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" id="flipkart-product-detail-modal">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Main Container: Elegant split screen desktop drawer or full modal */}
      <div className="relative w-full max-w-5xl h-[95vh] md:h-[90vh] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 mx-2 md:mx-4 animate-in fade-in slide-in-from-bottom-8 duration-300">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-white shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[9px] font-mono font-semibold tracking-wider">
              {product.sku}
            </span>
            <span className="text-xs text-neutral-400">|</span>
            <span className="text-xs font-serif text-neutral-600 italic">Flint & Steel Vault</span>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Split Left Image / Right Details) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto pb-[76px]">
          
          {/* LEFT COLUMN: Flipkart-style Image Gallery with Navigation */}
          <div className="w-full md:w-[45%] bg-neutral-50 flex flex-col items-center justify-center p-4 md:p-8 relative border-b md:border-b-0 md:border-r border-neutral-100 shrink-0 select-none">
            
            {/* Main Interactive Carousel Frame */}
            <div className="relative w-full aspect-square max-w-[340px] bg-gradient-to-tr from-neutral-100/60 to-white border border-neutral-200/50 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
              
              {/* Carousel Navigation Chevrons */}
              <button 
                onClick={handlePrevSlide}
                className="absolute left-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-neutral-600 hover:text-black transition-all z-20 cursor-pointer active:scale-95 border border-neutral-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleNextSlide}
                className="absolute right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-neutral-600 hover:text-black transition-all z-20 cursor-pointer active:scale-95 border border-neutral-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Render Dynamic Slides based on type */}
              {slidesList[currentSlide]?.type === "image" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={slidesList[currentSlide].url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    {/* Monogram overlay sitting elegantly over the first custom picture */}
                    {currentSlide === 0 && engravingText.trim().length > 0 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/65 backdrop-blur px-3 py-1 rounded border border-white/10 text-white font-mono text-[10px] tracking-widest z-10">
                        Engraved: <span className={activeFontDetails.cssClass}>{engravingText}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-5">
                    {slidesList[currentSlide].label}
                  </span>
                </div>
              )}

              {slidesList[currentSlide]?.type === "mockup" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative w-28 h-48 flex flex-col justify-between items-center transition-transform duration-500 hover:scale-105 translate-y-2">
                    {/* Lighter Case structure */}
                    <div className="w-full h-full rounded-2xl border-2 border-neutral-200 shadow-xl overflow-hidden relative flex flex-col">
                      {/* Metallic variety finish gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-tr ${selectedFinish.bgGradient}`} />
                      
                      {/* Realistic vertical shimmer reflection */}
                      <div className={`absolute inset-0 ${selectedFinish.reflectionClass} pointer-events-none`} />
                      
                      {/* Horizontal hinge seam indicator */}
                      <div className="absolute top-[28%] inset-x-0 h-[3px] bg-black/15 shadow-sm z-10" />
                      
                      {/* Tiny mechanical Sound Pin details */}
                      <div className="absolute top-[24%] right-1.5 w-1.5 h-3 bg-black/10 rounded-sm z-10" />
                      
                      {/* Custom Engraving monogram text rendering overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 pointer-events-none">
                        <div 
                          className={`px-2 py-0.5 bg-black/5 rounded border border-black/10 shadow-sm backdrop-blur-[0.5px] max-w-[90px] truncate text-center leading-none text-[11px] transition-all duration-300 ${
                            activeFontDetails.cssClass
                          } ${
                            engravingText.trim() ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}
                          style={{
                            color: selectedFinish.id === "obsidian" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)",
                            textShadow: selectedFinish.id === "obsidian" ? "0px 1px 1px rgba(0,0,0,0.4)" : "0px 1px 1px rgba(255,255,255,0.4)"
                          }}
                        >
                          {engravingText || "VAULT"}
                        </div>
                      </div>

                      {/* Brand crest decoration */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
                        <Sparkles className={`w-6 h-6 ${selectedFinish.id === "obsidian" ? "text-white" : "text-black"}`} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-5">
                    {slidesList[currentSlide].label}
                  </span>
                </div>
              )}

              {slidesList[currentSlide]?.type === "flame" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-50 to-neutral-100/30 animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Glowing halo behind ignited flame variety */}
                  <div 
                    className="absolute w-44 h-44 rounded-full blur-3xl opacity-30 animate-pulse transition-colors duration-500" 
                    style={{ backgroundColor: selectedFlame.colorHex }}
                  />

                  {/* Flame mechanism structure */}
                  <div className="relative w-36 h-48 flex flex-col items-center justify-end translate-y-2">
                    
                    {/* Glowing Activated Flame Variety */}
                    <div className="absolute top-0 flex flex-col items-center justify-end pb-28 z-20">
                      <div className="relative flex flex-col items-center">
                        {/* Core Flame Shape */}
                        <div 
                          className="w-5 h-16 rounded-full opacity-90 transition-all duration-500"
                          style={{ 
                            background: `radial-gradient(circle, #ffffff 15%, ${selectedFlame.colorHex} 70%, transparent 100%)`,
                            boxShadow: `0 0 20px ${selectedFlame.colorHex}, 0 0 45px ${selectedFlame.colorHex}`
                          }}
                        >
                          {/* Inner white heat core */}
                          <div className="absolute inset-x-1.5 bottom-1 top-5 bg-white rounded-full opacity-70" />
                        </div>
                        {/* Flickering spark */}
                        <span className="w-2 h-2 rounded-full absolute -top-1 animate-ping" style={{ backgroundColor: selectedFlame.colorHex }} />
                      </div>
                    </div>

                    {/* Flushed Open Lighter Body */}
                    <div className="w-24 h-28 rounded-b-xl border border-neutral-200 overflow-hidden relative flex flex-col shadow-lg z-10">
                      <div className={`absolute inset-0 bg-gradient-to-tr ${selectedFinish.bgGradient}`} />
                      <div className={`absolute inset-0 ${selectedFinish.reflectionClass}`} />
                      
                      {/* Brass interior chimney visible when popped open */}
                      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-yellow-600 to-yellow-800 border-b border-black/20 flex items-center justify-center">
                        <div className="w-6 h-2 bg-black/40 rounded-t border-t border-white/20 flex gap-0.5 px-0.5 justify-around">
                          <span className="w-0.5 h-full bg-yellow-500/50" />
                          <span className="w-0.5 h-full bg-yellow-500/50" />
                          <span className="w-0.5 h-full bg-yellow-500/50" />
                        </div>
                      </div>
                    </div>

                    {/* Flipped-Away LID */}
                    <div 
                      className="absolute w-24 h-12 rounded-t-xl border border-neutral-200 overflow-hidden shadow-md z-10 origin-bottom-left"
                      style={{
                        transform: "rotate(-115deg) translate(-42px, -8px)",
                        left: "11px",
                        bottom: "109px"
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-tr ${selectedFinish.bgGradient}`} />
                      <div className={`absolute inset-0 ${selectedFinish.reflectionClass}`} />
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-5">
                    {slidesList[currentSlide].label}
                  </span>
                </div>
              )}

              {slidesList[currentSlide]?.type === "packaging" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-50 to-neutral-200/40 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative w-48 h-36 bg-stone-900 rounded-xl border border-stone-800 p-3 shadow-2xl flex flex-col justify-between">
                    {/* Velvet Pouch lining inside box mockup */}
                    <div className="absolute inset-1.5 bg-[#401212] rounded-lg border border-[#300a0a] shadow-inner p-2 flex items-center justify-center">
                      
                      {/* Mini angled lighter sitting inside box */}
                      <div className="w-12 h-20 rounded-lg border border-neutral-200/20 shadow-md rotate-12 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${selectedFinish.bgGradient}`} />
                        <div className="absolute top-[28%] inset-x-0 h-[1.5px] bg-black/30" />
                      </div>

                      {/* Sparkles around packaging */}
                      <div className="absolute top-2 right-4 text-amber-400 opacity-60">
                        <Sparkles className="w-4 h-4 animate-bounce" />
                      </div>
                      <div className="absolute bottom-2 left-4 text-amber-400 opacity-50">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    {/* Box clasp indicator */}
                    <div className="w-4 h-2 bg-yellow-500/80 rounded-b absolute bottom-0 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-5">
                    {slidesList[currentSlide].label}
                  </span>
                </div>
              )}

              {/* Flipkart-Style Rating Star Badge Overlay (Bottom-Left) */}
              <div className="absolute bottom-3 left-3 bg-emerald-700 text-white font-sans text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow z-20">
                <span>4.8</span>
                <Star className="w-3 h-3 fill-white stroke-none" />
                <span className="text-[9px] text-emerald-100 font-normal ml-0.5">| 48</span>
              </div>

            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {slidesList.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    triggerSlideSound(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx 
                      ? "bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border border-amber-600/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] px-2" 
                      : "bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Micro warning */}
            <p className="text-[10px] text-neutral-400 mt-4 italic text-center max-w-[280px]">
              *Each piece is acoustic-tuned and hand-serialized before dispatch.
            </p>
          </div>

          {/* RIGHT COLUMN: Flipkart-Style Product Details & Varieties Scrollable */}
          <div className="flex-1 p-5 md:p-8 flex flex-col gap-6">
            
            {/* Seller & Title Section */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-400 tracking-wide uppercase">
                Atelier Flint & Steel • Seller
              </span>
              <h2 className="text-xl md:text-2xl font-serif text-neutral-900 tracking-normal leading-snug">
                {product.name} — Luxury Windproof Pocket Lighter
              </h2>
              <p className="text-xs text-neutral-500 italic">
                "{product.tagline}"
              </p>
            </div>

            {/* FLIPKART STYLE PRICE BLOCK */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                {/* Discount Percentage Arrow */}
                <span className="text-emerald-600 font-bold text-lg flex items-center">
                  ↓ {discountPercentage}% Off
                </span>
                
                {/* Strikethrough retail original price */}
                <span className="text-sm text-neutral-400 line-through font-mono">
                  ${retailPrice}
                </span>

                {/* Final calculated price */}
                <span className="text-2xl font-bold text-neutral-900 font-mono">
                  ${totalPrice}
                </span>
              </div>

              {/* Special UPI Offer Pricing */}
              <div className="flex items-center gap-1.5 text-xs text-[#a68226] font-semibold">
                <span className="bg-bronze-gold/15 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wide uppercase">Special Deal</span>
                <span>${upiOfferPrice} with instant UPI Payment method</span>
              </div>
            </div>

            {/* BLUE WOW! DEAL COUPON SECTION */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="bg-blue-600 text-white font-sans font-black text-[10px] px-1.5 py-0.5 rounded mt-0.5 tracking-wider uppercase">
                  WOW! DEAL
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-blue-900">Buy today for maximum savings</span>
                  <span className="text-[11px] text-blue-700">Add variety accessories to get extra 10% off combo!</span>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1 shrink-0 bg-white/80 px-2.5 py-1 rounded-md border border-blue-100">
                <span>Code applied</span>
                <Check className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>

            {/* VARIETY SECTION 1: FINISH VARIETIES (CIRCULAR SELECTOR) */}
            <div className="border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">
                  Choose Metal Variety
                </span>
                <span className="text-xs text-neutral-800 font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">
                  {selectedFinish.name}
                </span>
              </div>

              {/* The clickable circle varieties swatches */}
              <div className="flex flex-wrap gap-3">
                {availableFinishes.map((finish) => {
                  const isSelected = selectedFinish.id === finish.id;
                  return (
                    <button
                      key={finish.id}
                      onClick={() => {
                        setSelectedFinish(finish);
                        playLidSound(finish.id, "open");
                        // Briefly switch to first slide to showcase the finish
                        setCurrentSlide(0);
                      }}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${
                        isSelected 
                          ? "border-bronze-gold ring-2 ring-bronze-gold/20 scale-105" 
                          : "border-neutral-300 hover:border-neutral-400"
                      }`}
                      title={`${finish.name} (+$${finish.priceModifier})`}
                    >
                      {/* Outer metallic representation */}
                      <div className={`absolute inset-0.5 rounded-full bg-gradient-to-tr ${finish.bgGradient}`} />
                      
                      {/* Active indicator mark inside the circle */}
                      {isSelected && (
                        <div className="absolute w-5 h-5 rounded-full bg-white/95 text-bronze-gold flex items-center justify-center shadow-md z-10 animate-in zoom-in duration-200">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">
                *Variety selection changes the base metal plate and acoustic tone resonance.
              </p>
            </div>

            {/* VARIETY SECTION 2: FLAME VARIETIES (CIRCULAR SELECTOR) */}
            <div className="border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">
                  Choose Flame Ignition
                </span>
                <span className="text-xs text-neutral-800 font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">
                  {selectedFlame.name}
                </span>
              </div>

              {/* Flame variety swatches */}
              <div className="flex flex-wrap gap-3">
                {availableFlames.map((flame) => {
                  const isSelected = selectedFlame.id === flame.id;
                  return (
                    <button
                      key={flame.id}
                      onClick={() => {
                        setSelectedFlame(flame);
                        playSparkSound();
                        setTimeout(() => {
                          playFlameSound(true);
                        }, 80);
                        // Jump to slide to instantly view the burning flame variety!
                        const flameIdx = slidesList.findIndex((s) => s.type === "flame");
                        if (flameIdx !== -1) {
                          setCurrentSlide(flameIdx);
                        }
                      }}
                      className={`relative px-4 py-2 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 ${
                        isSelected 
                          ? "border-bronze-gold bg-bronze-gold/5 text-neutral-900 font-semibold shadow-sm" 
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-500 bg-white"
                      }`}
                      title={flame.description}
                    >
                      {/* Variety color dot */}
                      <div 
                        className="w-3 h-3 rounded-full shadow-inner animate-pulse shrink-0" 
                        style={{ backgroundColor: flame.colorHex }}
                      />
                      <span className="text-xs tracking-wide">{flame.name.split(" ")[0]}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-bronze-gold ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PERSONALIZATION MONOGRAM SECTION (Luxury touch) */}
            <div className="border-t border-neutral-100 pt-4 bg-amber-50/20 p-3 rounded-xl border border-amber-200/40">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase text-[#a68226] tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Bespoke Monogram Engraving
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">+$30 USD</span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-3">
                Add your initials, name or a special date to be masterfully laser etched onto the body metal.
              </p>

              <div className="flex flex-col gap-2.5">
                <input
                  type="text"
                  maxLength={12}
                  value={engravingText}
                  onChange={(e) => {
                    setEngravingText(e.target.value);
                    if (currentSlide !== 0) {
                      setCurrentSlide(0); // auto switch slide to show monogram
                    }
                  }}
                  placeholder="Enter initials or name (max 12 chars)"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 focus:border-bronze-gold focus:outline-none text-xs text-neutral-800 tracking-widest placeholder:tracking-normal placeholder:text-neutral-400 font-mono"
                />

                {engravingText.trim().length > 0 && (
                  <div className="flex flex-col gap-1.5 p-2 bg-white rounded border border-neutral-200 animate-in fade-in duration-200">
                    <span className="text-[9px] uppercase font-mono text-neutral-400 tracking-widest">Select Engraving Font style:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {FONTS.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => {
                            setSelectedFont(font.id);
                            setCurrentSlide(0);
                          }}
                          className={`px-2 py-1.5 rounded text-[10px] border text-left transition-all truncate cursor-pointer ${
                            selectedFont === font.id
                              ? "border-bronze-gold bg-bronze-gold/5 text-neutral-900 font-medium"
                              : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                          }`}
                        >
                          <span className={font.cssClass}>{font.name.split(" ")[0]} style</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FLIPKART STYLE PINCODE / DELIVERY LOCATOR BLOCK */}
            <div className="border-t border-neutral-100 pt-4">
              <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider mb-2.5">
                Delivery details
              </h4>
              <div className="border border-neutral-200/80 rounded-xl p-3.5 flex flex-col gap-2 bg-neutral-50/50">
                <div className="flex items-center justify-between text-xs text-neutral-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="font-semibold text-neutral-800">HOME</span>
                    <span className="text-neutral-400 font-mono">Near Adhikari post office - 734...</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 pl-6 border-t border-neutral-100 pt-2.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Delivery by </span>
                  <span className="font-bold text-neutral-800">22 Jul, Wed</span>
                  <span className="text-emerald-600 font-semibold ml-auto">FREE shipping</span>
                </div>
              </div>
            </div>

            {/* TABBED ADDITIONAL SPECIFICATIONS ACCORDION */}
            <div className="border-t border-neutral-100 pt-4">
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider text-center border-b-2 transition-all ${
                    activeTab === "specs"
                      ? "border-bronze-gold text-neutral-900 font-bold"
                      : "border-transparent text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("heritage")}
                  className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider text-center border-b-2 transition-all ${
                    activeTab === "heritage"
                      ? "border-bronze-gold text-neutral-900 font-bold"
                      : "border-transparent text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  Heritage Story
                </button>
              </div>

              {activeTab === "specs" && (
                <div className="py-3 text-xs flex flex-col gap-1.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-400 font-medium">Model Code SKU</span>
                    <span className="text-neutral-800 font-mono text-right">{product.sku}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-400 font-medium">Weight</span>
                    <span className="text-neutral-800 font-mono text-right">{product.weight}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-400 font-medium">Dimensions</span>
                    <span className="text-neutral-800 font-mono text-right">{product.dimensions}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-400 font-medium">Combustible Fuel</span>
                    <span className="text-neutral-800 text-right">{product.fuel}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-400 font-medium">Ignition Engine</span>
                    <span className="text-neutral-800 text-right">{product.ignition}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5">
                    <span className="text-neutral-400 font-medium">Acoustic Resonance</span>
                    <span className="text-neutral-800 text-right italic">{product.sound}</span>
                  </div>
                </div>
              )}

              {activeTab === "heritage" && (
                <div className="py-3 text-xs text-neutral-600 italic leading-relaxed font-serif animate-in fade-in duration-200">
                  "{product.story}"
                  <div className="mt-2.5 font-sans not-italic text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                    Made with pride in Paris workshop
                  </div>
                </div>
              )}
            </div>

            {/* TRUST & SECURITY BADGES */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200/50">
                <Shield className="w-4 h-4 text-bronze-gold" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-800 leading-tight">2 Year Warranty</span>
                  <span className="text-[9px] text-neutral-400">Premium guarantee</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200/50">
                <Lock className="w-4 h-4 text-bronze-gold" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-800 leading-tight">Secured Payment</span>
                  <span className="text-[9px] text-neutral-400">SSL certified escrow</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PERSISTENT DUAL BOTTOM ACTION BAR (Flipkart style!) */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-neutral-200 px-4 py-3 flex gap-3 z-30 shrink-0">
          
          {/* Add to Cart button (White liquid glass style) */}
          <button
            onClick={handleAddToVault}
            className="flex-1 py-3.5 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 text-neutral-800 hover:text-black border border-neutral-300 text-neutral-800 hover:text-black font-sans font-bold text-[11px] tracking-wider uppercase rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.05)] hover:from-white hover:to-neutral-50 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-600" />
            <span>Add to cart</span>
          </button>

          {/* Buy Now button (Black liquid glass style) */}
          <button
            onClick={handleInstantBespokeCheckout}
            className="flex-1 py-3.5 bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white rounded-xl text-[11px] font-sans font-bold tracking-wider uppercase transition-all duration-300 border border-neutral-950/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.45)] hover:from-neutral-700 hover:via-neutral-900 hover:to-neutral-950 hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_6px_20px_rgba(0,0,0,0.55)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
            <span>Buy at ${totalPrice}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
