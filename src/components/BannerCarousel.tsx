import React, { useEffect } from "react";
import { DollarSign, ShieldAlert, Sparkles, FileText, Crosshair } from "lucide-react";
import { BannerSlide } from "../types";

const ParentalAdvisory = () => (
  <div className="bg-white text-black font-sans font-black uppercase px-1 py-0.5 flex flex-col items-center leading-[1.1] border border-black select-none shadow-sm rounded-[1px]">
    <span className="text-[6px] md:text-[7px] font-black tracking-widest leading-none">PARENTAL</span>
    <span className="text-[6px] md:text-[7px] font-black tracking-widest leading-none">ADVISORY</span>
    <span className="text-[4px] md:text-[4.5px] font-bold tracking-tight border-t border-black/80 w-full text-center mt-[1px]">EXPLICIT CONTENT</span>
  </div>
);

interface BannerCarouselProps {
  slides: BannerSlide[];
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  intervalSpeed?: number;
}

export function BannerCarousel({
  slides,
  current,
  setCurrent,
  intervalSpeed = 1500,
}: BannerCarouselProps) {

  // Auto-slide effect based on intervalSpeed prop (speed of 0 means pause)
  useEffect(() => {
    if (intervalSpeed === 0 || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [slides.length, intervalSpeed, setCurrent]);

  return (
    <div className="w-full h-full relative select-none overflow-hidden bg-neutral-950 font-sans">
      
      {slides.map((slide, index) => {
        const isActive = current === index;

        // RENDER PRESETS
        if (slide.type === "preset") {
          const pid = slide.presetId;

          // Slide 1: AIN'T MY FAULT
          if (pid === "fault") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-4 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  background: "radial-gradient(circle at center, #262626 0%, #0c0c0c 100%)",
                }}
              >
                <div className="flex justify-between w-full text-[9px] md:text-[11px] font-mono tracking-[0.2em] text-white/90 px-3 pt-2">
                  <span className="font-bold">ROWDY REBEL</span>
                  <span className="font-bold">DOE BOY</span>
                  <span className="font-bold">42 DUGG</span>
                </div>

                <div className="flex-1 flex items-center justify-center relative my-1 mx-4">
                  <div className="w-full max-w-[280px] aspect-[1.5/1] bg-white rounded-md border border-neutral-700/30 p-2 flex flex-col justify-between relative shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-between px-2 py-3 pointer-events-none opacity-80">
                      {[...Array(6)].map((_, i) => {
                        const heightLabels = ["6'6\"", "6'0\"", "5'6\"", "5'0\"", "4'6\"", "4'0\""];
                        return (
                          <div key={i} className="flex items-center justify-between border-b border-neutral-300 w-full h-[1px] relative">
                            <span className="absolute left-1 text-[5.5px] font-mono text-neutral-500 -translate-y-1">{heightLabels[i]}</span>
                            <span className="absolute right-1 text-[5.5px] font-mono text-neutral-500 -translate-y-1">{heightLabels[i]}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 top-1 overflow-hidden flex justify-center items-end">
                      <img 
                        src="https://images.unsplash.com/photo-1549060263-7f97615fe1f7?auto=format&fit=crop&q=80&w=500" 
                        alt="Artists lineup" 
                        className="w-full h-[95%] object-cover grayscale contrast-[1.4] brightness-[0.85] mix-blend-multiply origin-bottom transition-all"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-white/20 backdrop-blur-[1px] rotate-2 border border-white/10" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1.5 pb-2">
                  <span 
                    className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-center block select-none scale-y-[1.1]"
                    style={{
                      color: "#E11D48",
                      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8), 0px 0px 10px rgba(225, 29, 72, 0.4)",
                      fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                    }}
                  >
                    AIN'T MY FAULT
                  </span>
                  <div className="scale-75 origin-bottom">
                    <ParentalAdvisory />
                  </div>
                </div>
              </div>
            );
          }

          // Slide 2: DEAD
          if (pid === "dead") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-4 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  background: "radial-gradient(circle at center, #180808 0%, #050101 100%)",
                }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex justify-between items-center w-full px-2 pt-1 text-[8px] font-mono text-red-500/50 uppercase tracking-widest">
                  <span>ATELIER ARCHIVE SYSTEM</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative my-1">
                  <div className="w-[140px] md:w-[170px] aspect-square rounded-full border border-red-950/40 p-1 bg-red-950/20 shadow-[0_0_40px_rgba(239,68,68,0.15)] flex items-center justify-center overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1508186227413-bb1f5cfad1a3?auto=format&fit=crop&q=80&w=400" 
                      alt="Bloody eye" 
                      className="w-full h-full object-cover rounded-full saturate-[2.4] hue-rotate-[-35deg] contrast-[1.3] brightness-[0.75]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 rounded-full bg-radial-[circle_at_center] from-transparent via-red-950/30 to-red-950/95 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/20 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-between items-end w-full px-3 pb-2">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span 
                      className="text-4xl md:text-5xl font-black uppercase select-none tracking-normal scale-y-[1.1] leading-none"
                      style={{
                        color: "#f3f3f3",
                        textShadow: "0 0 10px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.9)",
                        fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      DEAD
                    </span>
                    <span className="text-[7px] font-mono text-red-500/60 uppercase tracking-widest">CHAPTER VERIFIED</span>
                  </div>
                  <div className="scale-[0.8] origin-bottom-right">
                    <ParentalAdvisory />
                  </div>
                </div>
              </div>
            );
          }

          // Slide 3: OBVIOUS
          if (pid === "obvious") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-4 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  background: "linear-gradient(135deg, #2b1103 0%, #0d0400 100%)",
                }}
              >
                <div className="absolute inset-0 bg-radial-[circle_at_center] from-amber-500/10 to-transparent pointer-events-none" />

                <div className="flex justify-between items-center w-full px-2 pt-1">
                  <span className="text-[8px] font-mono text-amber-500/40 uppercase tracking-widest">COLLECTION</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>

                <div className="flex-1 flex items-center justify-center relative my-1">
                  <div className="w-full max-w-[280px] aspect-[1.8/1] relative overflow-hidden rounded-xl border border-amber-950/40 bg-neutral-900 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" 
                      alt="Orange eye" 
                      className="w-full h-full object-cover saturate-[1.6] contrast-[1.2] brightness-[0.7] sepia-[0.3]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 via-transparent to-amber-950/20 mix-blend-color-burn" />
                    
                    <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none scale-75">
                      <span 
                        className="font-bold text-[8px] md:text-[9px] text-amber-500/80 tracking-[0.25em] uppercase select-none rotate-3 filter blur-[0.3px]"
                        style={{
                          fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                          textShadow: "0 0 3px rgba(245, 158, 11, 0.8)",
                        }}
                      >
                        OBVIOUS
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 border border-dashed border-amber-500/25 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-amber-500/30 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full px-2 pb-2">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span 
                      className="text-2xl md:text-3xl font-black uppercase select-none tracking-widest text-[#FFF8F0] leading-none"
                      style={{
                        fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                        textShadow: "0px 2px 5px rgba(0,0,0,0.9)",
                      }}
                    >
                      OBVIOUS
                    </span>
                  </div>
                  <div className="scale-75 origin-bottom-right">
                    <ParentalAdvisory />
                  </div>
                </div>
              </div>
            );
          }

          // Slide 4: PAINLESS TO THE PEOPLE
          if (pid === "painless") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-4 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  background: "radial-gradient(circle at center, #061c0e 0%, #020703 100%)",
                }}
              >
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  <div className="absolute top-[-20%] left-[25%] w-[1.5px] h-[150%] bg-[#22C55E] shadow-[0_0_15px_#22C55E,0_0_5px_#fff] rotate-[32deg] opacity-90" />
                  <div className="absolute top-[-25%] right-[30%] w-[1.5px] h-[150%] bg-[#22C55E] shadow-[0_0_15px_#22C55E,0_0_5px_#fff] rotate-[-25deg] opacity-80" />
                </div>

                <div className="w-full flex justify-center pt-2 px-1 z-20">
                  <span 
                    className="text-xl md:text-[1.65rem] font-black uppercase tracking-tight italic select-none scale-x-[0.9] scale-y-[1.1] leading-none"
                    style={{
                      color: "#22C55E",
                      fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                      textShadow: "0 0 10px rgba(34, 197, 94, 0.7), 0 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    PAINLESS TO THE PEOPLE
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center relative my-1 mx-4 z-10">
                  <div className="w-[110px] md:w-[130px] aspect-[1/1.2] relative rounded-lg border border-emerald-950 bg-neutral-900 shadow-[0_0_30px_rgba(34,197,94,0.15)] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400" 
                      alt="Neon abstract" 
                      className="w-full h-full object-cover saturate-[1.8] brightness-[0.4] contrast-[1.4]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Crosshair className="w-10 h-10 text-emerald-500/20 animate-spin" style={{ animationDuration: "12s" }} />
                    </div>
                  </div>

                  <div className="absolute bottom-1 right-2 w-14 h-9 bg-neutral-900 border border-emerald-500/20 rounded p-1 flex items-center justify-between shadow-2xl scale-75 origin-bottom-right">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500/80" />
                    <div className="flex flex-col gap-0.5">
                      <div className="w-6 h-1 bg-emerald-500/30 rounded" />
                      <div className="w-4 h-1 bg-emerald-500/30 rounded" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-2 w-14 h-9 bg-white border border-neutral-300 rounded p-1 flex flex-col gap-0.5 shadow-2xl scale-75 origin-top-left">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-neutral-800 rounded-full" />
                      <div className="w-4 h-1 bg-neutral-300 rounded" />
                    </div>
                    <div className="w-full h-[3px] bg-neutral-200 rounded" />
                    <div className="w-[80%] h-[3px] bg-neutral-200 rounded" />
                  </div>
                </div>

                <div className="flex justify-between items-end w-full px-2 pb-2 z-20">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[7.5px] font-mono text-emerald-400/80 uppercase tracking-widest font-bold">SYSTEM ACTIVE</span>
                  </div>
                  <div className="scale-75 origin-bottom-right">
                    <ParentalAdvisory />
                  </div>
                </div>
              </div>
            );
          }

          // Slide 5: STEP ON OPPS (Maf Teeski & Anti Da Menace)
          if (pid === "opps") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-4 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  background: "radial-gradient(circle at center, #1b0933 0%, #080214 100%)",
                }}
              >
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:12px_12px]" />

                <div className="flex justify-between items-center w-full px-2 pt-1">
                  <span className="text-[8px] font-mono text-purple-400/60 uppercase tracking-widest font-bold">MAF TEESKI × ANTI DA MENACE</span>
                </div>

                <div className="flex-1 flex items-center justify-center relative my-1">
                  <div className="w-[120px] md:w-[140px] aspect-square relative rounded-xl border border-purple-950/60 bg-neutral-900 shadow-[0_0_35px_rgba(139,92,246,0.2)] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400" 
                      alt="Raw street concert" 
                      className="w-full h-full object-cover saturate-[1.4] brightness-[0.4] contrast-[1.3] sepia-[0.1]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-[30%] -left-[10%] w-[120%] h-[2px] bg-purple-500 shadow-[0_0_12px_#a855f7] rotate-[15deg] opacity-70" />
                    <div className="absolute top-[70%] -left-[10%] w-[120%] h-[2px] bg-amber-500 shadow-[0_0_12px_#f59e0b] rotate-[-12deg] opacity-40" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border border-purple-500/30 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-6 h-6 border border-dashed border-purple-500/20 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-purple-500/60 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end w-full px-3 pb-2">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span 
                      className="text-3xl md:text-4xl font-extrabold uppercase select-none tracking-tight leading-none text-[#FFF5F5]"
                      style={{
                        fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                        textShadow: "0 0 12px rgba(168,85,247,0.4), 0 2px 4px rgba(0,0,0,0.9)",
                        letterSpacing: "-0.01em"
                      }}
                    >
                      STEP ON OPPS
                    </span>
                    <span className="text-[7px] font-mono text-purple-400/50 uppercase tracking-widest">STREET EXCLUSIVE</span>
                  </div>

                  <div className="scale-75 origin-bottom-right">
                    <ParentalAdvisory />
                  </div>
                </div>
              </div>
            );
          }

          // Slide 6: IT'S ALL A BLUR (Drake Globe Concert Stage)
          if (pid === "drake") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-4 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  background: "radial-gradient(circle at center, #0a1128 0%, #02040c 100%)",
                }}
              >
                <div className="flex justify-between items-center w-full px-2 pt-1 text-[8px] font-mono text-sky-400/40 uppercase tracking-widest font-semibold">
                  <span>WORLD TOUR SPECTACLE</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative my-1">
                  <div 
                    className="absolute top-0 bottom-[35%] w-[60px] pointer-events-none z-10"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(56,189,248,0.1) 60%, transparent 100%)",
                      clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
                      filter: "blur(2px)",
                    }}
                  />

                  <div className="absolute bottom-[36%] z-20 flex flex-col items-center scale-90 translate-y-1">
                    <div className="w-4 h-8 bg-neutral-950 relative rounded-full">
                      <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2" />
                      <div className="w-1 h-3 bg-neutral-950 rotate-[-20deg] absolute left-[-2px] top-1 rounded-full" />
                      <div className="w-1 h-3 bg-neutral-950 rotate-[45deg] absolute right-[-2px] top-1.5 rounded-full" />
                    </div>
                    <div className="w-6 h-1.5 bg-white/40 blur-[1.5px] rounded-full mt-0.5" />
                  </div>

                  <div className="w-[110px] md:w-[130px] aspect-square rounded-full border border-sky-500/25 bg-sky-950/10 shadow-[0_0_40px_rgba(56,189,248,0.25)] flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 rounded-full bg-radial-[circle_at_center] from-sky-400/10 via-transparent to-sky-950/80 pointer-events-none" />
                    
                    <div className="absolute inset-2 border border-sky-400/15 rounded-full" />
                    <div className="absolute inset-5 border border-dashed border-sky-400/10 rounded-full" />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-sky-400/15" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-sky-400/15" />
                    
                    <div className="absolute inset-0 rounded-full border border-sky-400/30 animate-pulse" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 pb-2">
                  <span 
                    className="text-2xl md:text-3xl font-extrabold uppercase select-none tracking-[0.25em] text-center text-white leading-none"
                    style={{
                      fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
                      textShadow: "0 0 15px rgba(56,189,248,0.5), 0 2px 4px rgba(0,0,0,0.9)"
                    }}
                  >
                    IT'S ALL A BLUR
                  </span>
                  <span className="text-[6.5px] font-mono text-sky-400/60 uppercase tracking-widest font-semibold">ARENA LIVE EXPERIENCE</span>
                </div>
              </div>
            );
          }

          // Slide 7: CONDENSED FONTS
          if (pid === "condensed") {
            return (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-750 ease-in-out flex flex-col justify-between p-5 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  backgroundColor: "#F5F4F0",
                }}
              >
                <div className="flex justify-between items-start w-full font-mono text-[7px] text-neutral-500 uppercase tracking-widest border-b border-neutral-200/80 pb-2">
                  <span>ATELIER ARCHIVE SYSTEM</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-start pl-2 pt-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[6px] tracking-wider uppercase font-semibold rounded-[2px]">POSTER DESIGN</span>
                    <span className="text-[7px] font-mono text-neutral-400">@DESIGNERYASH_</span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter leading-none scale-y-[1.15] origin-left select-none uppercase">
                    CONDENSED
                  </h3>
                  <h3 className="text-4xl md:text-5xl font-black text-neutral-400 tracking-tighter leading-none scale-y-[1.15] origin-left select-none uppercase mt-1">
                    FONTS
                  </h3>
                </div>

                <div className="flex justify-between items-end w-full border-t border-neutral-200/80 pt-2 text-[6.5px] font-mono text-neutral-400">
                  <span className="tracking-wide">© 2026 Flint N Steel</span>
                  <span className="tracking-wide">HAND-CARVED IN FRANCE</span>
                </div>
              </div>
            );
          }
        }

        // RENDER CUSTOM UPLOAD SLIDES
        if (slide.type === "custom") {
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-750 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img 
                src={slide.customImageUrl} 
                alt={slide.title || "Custom Banner Image"} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          );
        }

        return null;
      })}

      {/* OVERLAID DYNAMIC NAVIGATION INDICATOR PIN DOTS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 bg-black/40 backdrop-blur-[2px] px-2.5 py-1 rounded-full border border-white/5 shadow-md">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              current === idx ? "bg-white scale-110" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to image slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
