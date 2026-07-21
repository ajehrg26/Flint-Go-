import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Flame, Sparkle, Volume2, ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data";

interface SlideData {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  accentColor: string;
  bgGradient: string;
  bgImage: string;
  badge: string;
  highlightSpec: string;
  specIcon: React.ReactNode;
}

const SLIDES: SlideData[] = [
  {
    id: "slide-imperator",
    productId: "imperator",
    title: "Le Grand Imperator",
    subtitle: "The Signature Sound of Place Vendôme",
    tagline: "Sovereign Gold Orfèvrerie",
    description: "Impeccably hand-sculpted in France. Equipped with our proprietary dual-resonance internal soundboard, ringing a flawless crystal 1.4kHz ping upon release.",
    accentColor: "#D4AF37", // luxury-gold
    bgGradient: "from-amber-900/10 via-white/95 to-white",
    bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600",
    badge: "Acoustic Icon",
    highlightSpec: "1.4kHz Ping Crystal Resonance",
    specIcon: <Volume2 className="w-4 h-4 text-bronze-gold" />,
  },
  {
    id: "slide-stealth",
    productId: "stealth",
    title: "Obsidian V-12 Stealth",
    subtitle: "Aeronautic Titanium Engineering",
    tagline: "Windproof Double Jet Stream",
    description: "Coated in dark PVD physical vapor deposition. Meticulously built with pressurized airflow channels to sustain direct, laser-focused dual jets in extreme weather.",
    accentColor: "#3FA9FF", // jet flame blue
    bgGradient: "from-slate-900/10 via-white/95 to-white",
    bgImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1600",
    badge: "Aerospace Grade",
    highlightSpec: "Wind-Resistant Piezo Jet Stream",
    specIcon: <Flame className="w-4 h-4 text-blue-500" />,
  },
  {
    id: "slide-dynasty",
    productId: "dynasty",
    title: "The Dynasty Urushi",
    subtitle: "Living Japanese Lacquer Artistry",
    tagline: "Charcoal Hand-Polished Resin",
    description: "Each masterpiece undergoes 15 coating sessions using organic Urushi sap, imported from Kyoto, and detailed with delicate raw 24K gold powder veins.",
    accentColor: "#105D38", // emerald lacquer
    bgGradient: "from-emerald-900/10 via-white/95 to-white",
    bgImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1600",
    badge: "High Artisanry",
    highlightSpec: "Authentic Kyoto Urushi Craft",
    specIcon: <Sparkle className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "slide-archon",
    productId: "archon",
    title: "Sterling Archon 925",
    subtitle: "Artisanal Baroque Hand-Engravings",
    tagline: "Solid Sterling Silver Sculpture",
    description: "Carved from solid raw blocks of .925 sterling silver by a single Parisian silversmith. Over time, it gains an elegant antique patina tailored to your grasp.",
    accentColor: "#C0C0C0", // Sterling silver
    bgGradient: "from-zinc-900/10 via-white/95 to-white",
    bgImage: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=1600",
    badge: "Patrician Heritage",
    highlightSpec: "Individually Hand-Chiseled Rococo",
    specIcon: <Sparkle className="w-4 h-4 text-zinc-400" />,
  },
];

interface PromoSliderProps {
  onAddToCart: (prodId: string) => void;
}

export const PromoSlider: React.FC<PromoSliderProps> = ({ onAddToCart }) => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const slideDuration = 5500; // 5.5s
  const stepTime = 50; // Update progress bar every 50ms

  // Handles auto-play progress logic
  useEffect(() => {
    if (isPlaying) {
      const totalSteps = slideDuration / stepTime;
      let elapsedSteps = (progress / 100) * totalSteps;

      progressIntervalRef.current = setInterval(() => {
        elapsedSteps += 1;
        const newProgress = (elapsedSteps / totalSteps) * 100;
        
        if (newProgress >= 100) {
          setProgress(0);
          handleNext();
        } else {
          setProgress(newProgress);
        }
      }, stepTime);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, current, progress]);

  const handleNext = () => {
    setProgress(0);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleSelectSlide = (index: number) => {
    setProgress(0);
    setCurrent(index);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleExploreProduct = (prodId: string) => {
    // Scroll to the curated-collection-grid section
    const grid = document.getElementById("curated-collection-grid");
    if (grid) {
      grid.scrollIntoView({ behavior: "smooth" });
      
      // Temporarily add a gold pulse animation class to the corresponding card if found
      setTimeout(() => {
        const elements = document.querySelectorAll(`[key="${prodId}"]`);
        elements.forEach((el) => {
          el.classList.add("ring-2", "ring-bronze-gold", "duration-1000");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-bronze-gold");
          }, 3000);
        });
      }, 600);
    }
  };

  const activeSlide = SLIDES[current];

  return (
    <div 
      id="promo-sliding-banner"
      className="relative w-full aspect-[9/16] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-neutral-200/80 bg-white shadow-xl group/slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* BACKGROUND IMAGE WITH PREMIUM TRANSITIONS */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-55 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
          );
        })}

        {/* Ambient Light/Color Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-r ${activeSlide.bgGradient} mix-blend-normal transition-colors duration-1000`} />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/10" />
      </div>

      {/* CORE CAROUSEL CONTENT CONTAINER */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12">
        {/* Top bar header of active slide */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-bronze-gold animate-ping" />
            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-neutral-800 uppercase">
              {activeSlide.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-neutral-500 hover:text-neutral-800 border border-neutral-200 transition-all text-xs cursor-pointer flex items-center justify-center shadow-sm"
              title={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Dynamic Staggered Animations for Text Content */}
        <div className="max-w-2xl flex flex-col gap-3 md:gap-4 my-auto">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === current;
            if (!isActive) return null;
            return (
              <div
                key={slide.id}
                className="flex flex-col gap-2.5 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.25em] font-sans text-bronze-gold font-semibold uppercase">
                  <span>{slide.tagline}</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-serif text-neutral-900 tracking-wide leading-tight font-semibold">
                  {slide.title}
                </h2>

                <p className="text-[11px] md:text-sm text-neutral-700 italic font-serif leading-relaxed">
                  "{slide.subtitle}"
                </p>

                <p className="text-xs text-neutral-500 max-w-xl leading-relaxed font-sans hidden sm:block">
                  {slide.description}
                </p>

                {/* Spec Tag */}
                <div className="flex items-center gap-2 mt-1 py-1.5 px-3 bg-neutral-50 border border-neutral-200/60 rounded-lg w-fit text-[10px] font-mono text-neutral-600">
                  {slide.specIcon}
                  <span>{slide.highlightSpec}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel actions and Pagination Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAddToCart(activeSlide.productId)}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-sans tracking-[0.20em] uppercase font-bold rounded-xl transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Add to Vault</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleExploreProduct(activeSlide.productId)}
              className="px-5 py-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-[10px] font-sans tracking-[0.20em] uppercase font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Configure Details
            </button>
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    current === idx ? "w-6 bg-bronze-gold" : "w-1.5 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-4 text-neutral-400">
              <span className="text-[10px] font-mono">{String(current + 1).padStart(2, '0')}</span>
              <span className="text-[9px] font-mono text-neutral-200">/</span>
              <span className="text-[10px] font-mono">{String(SLIDES.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEFT & RIGHT NAVIGATION CHEVRONS */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-neutral-200/80 text-neutral-500 hover:text-neutral-800 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-neutral-200/80 text-neutral-500 hover:text-neutral-800 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* BOTTOM REALTIME GOLD PROGRESS LINE */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 h-[3px] bg-neutral-100 z-20 w-full">
          <div 
            className="h-full bg-gradient-to-r from-bronze-gold to-luxury-gold transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
