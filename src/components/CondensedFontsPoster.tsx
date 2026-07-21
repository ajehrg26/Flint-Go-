import React from "react";

interface CondensedFontsPosterProps {
  textLine1?: string;
  textLine2?: string;
}

export function CondensedFontsPoster({
  textLine1 = "CONDENSED",
  textLine2 = "FONTS",
}: CondensedFontsPosterProps) {
  // Coordinate values for the grid markers
  const horizontalCoords = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const verticalCoords = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

  return (
    <div className="w-full h-full bg-[#0D0C0A] relative flex flex-col justify-between overflow-hidden font-sans select-none border border-neutral-800">
      
      {/* 1. TECHNICAL GRID BACKDROP */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        {/* Fine background grid */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(166, 130, 38, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(166, 130, 38, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Subtle glowing center */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-amber-500/5 to-transparent pointer-events-none" />
      </div>

      {/* 2. SPECIFICATION MEASUREMENT AXES & LABELS */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10 text-[8px] font-mono text-bronze-gold/60 tracking-wider">
        
        {/* Top Coordinate Scale */}
        <div className="flex justify-between w-full border-b border-bronze-gold/20 pb-1.5 px-6">
          {horizontalCoords.map((num) => (
            <span key={`top-${num}`} className="text-center w-6">{num}</span>
          ))}
        </div>

        {/* Left Vertical Scale */}
        <div className="absolute left-1.5 top-10 bottom-10 flex flex-col justify-between items-center h-[calc(100%-80px)] border-r border-bronze-gold/20 pr-1">
          {verticalCoords.map((num) => (
            <span key={`left-${num}`} className="-rotate-90 text-[7px] my-1">{num}</span>
          ))}
        </div>

        {/* Right Vertical Scale */}
        <div className="absolute right-1.5 top-10 bottom-10 flex flex-col justify-between items-center h-[calc(100%-80px)] border-l border-bronze-gold/20 pl-1">
          {verticalCoords.map((num) => (
            <span key={`right-${num}`} className="rotate-90 text-[7px] my-1">{num}</span>
          ))}
        </div>

        {/* Bottom Coordinate Scale */}
        <div className="flex justify-between w-full border-t border-bronze-gold/20 pt-1.5 px-6 mt-auto">
          {horizontalCoords.map((num) => (
            <span key={`bottom-${num}`} className="text-center w-6">{num}</span>
          ))}
        </div>
      </div>

      {/* 3. SCATTERED TECHNICAL COMPASS SYMBOLS & ARROWS */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Custom target crosshairs/arrows at key coordinates */}
        <span className="absolute top-[20%] left-[8%] text-bronze-gold/80 text-[10px]">→</span>
        <span className="absolute top-[30%] right-[30%] text-bronze-gold/80 text-[10px]">→</span>
        <span className="absolute bottom-[35%] left-[42%] text-bronze-gold/80 text-[10px]">→</span>
        <span className="absolute bottom-[25%] right-[7%] text-bronze-gold/80 text-[10px]">→</span>
        
        {/* Corner alignment crosshairs */}
        <div className="absolute top-8 left-8 w-3 h-3 border-t border-l border-bronze-gold/30" />
        <div className="absolute top-8 right-8 w-3 h-3 border-t border-r border-bronze-gold/30" />
        <div className="absolute bottom-8 left-8 w-3 h-3 border-b border-l border-bronze-gold/30" />
        <div className="absolute bottom-8 right-8 w-3 h-3 border-b border-r border-bronze-gold/30" />
      </div>

      {/* 4. CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col justify-between p-6 pt-10 pb-8 z-20 h-full relative">
        
        {/* Top Row: Subtitle and simple decor */}
        <div className="flex justify-between items-center w-full px-2">
          <span className="text-[9px] font-mono tracking-[0.25em] text-white/90 uppercase font-medium">
            Premium Condensed Fonts
          </span>
          <span className="text-bronze-gold text-[10px] font-mono font-semibold">→</span>
        </div>

        {/* Central Bold Typography Poster - CONDENSED FONTS */}
        <div className="flex-1 flex flex-col justify-center items-center py-2">
          <div className="text-center leading-[0.78] tracking-[-0.04em] flex flex-col items-center">
            {/* LINE 1 */}
            <span 
              className="font-condensed font-bold text-[14vw] sm:text-[9.5vw] md:text-[6.5rem] uppercase block select-none leading-none tracking-[-0.03em] scale-y-[1.12]"
              style={{
                background: "linear-gradient(to bottom, #F59E0B 10%, #D97706 50%, #B45309 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
                textShadow: "0px 0px 1px rgba(245, 158, 11, 0.2)",
              }}
            >
              {textLine1}
            </span>
            
            {/* LINE 2 */}
            <span 
              className="font-condensed font-bold text-[20vw] sm:text-[14vw] md:text-[9.5rem] uppercase block select-none leading-none tracking-[-0.02em] scale-y-[1.12] -mt-1"
              style={{
                background: "linear-gradient(to bottom, #F59E0B 10%, #D97706 50%, #B45309 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
                textShadow: "0px 0px 1px rgba(245, 158, 11, 0.2)",
              }}
            >
              {textLine2}
            </span>
          </div>
        </div>

        {/* Bottom Row: Branding and slider pagination */}
        <div className="flex justify-between items-end w-full px-2">
          {/* Creator Credits */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-mono tracking-widest text-white/80 font-medium">@designeryash_</span>
            <span className="text-[7.5px] font-mono tracking-widest text-bronze-gold/70">Brand & Graphic Designer</span>
          </div>

          {/* Interactive Pagination Dots from screenshot */}
          <div className="flex gap-1.5 pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/25 block" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/25 block" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/25 block" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/25 block" />
          </div>
          
          {/* Subtle alignment marker */}
          <div className="w-5 h-5 rounded-full border border-bronze-gold/30 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full border border-dashed border-bronze-gold/40 flex items-center justify-center">
              <span className="text-[6px] text-bronze-gold/60 font-mono">+</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
