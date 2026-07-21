import React, { useState, useRef } from "react";
import { 
  Upload, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Play, 
  Pause, 
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  HelpCircle,
  FileImage
} from "lucide-react";
import { BannerSlide } from "../types";

interface BannerCustomizerProps {
  slides: BannerSlide[];
  onSlidesChange: (newSlides: BannerSlide[]) => void;
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  intervalSpeed: number;
  onIntervalSpeedChange: (speed: number) => void;
}

export const BannerCustomizer: React.FC<BannerCustomizerProps> = ({
  slides,
  onSlidesChange,
  currentIndex,
  onSelectSlide,
  intervalSpeed,
  onIntervalSpeedChange,
}) => {
  const [activeTab, setActiveTab] = useState<"active" | "presets" | "upload">("active");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubtitle, setUploadSubtitle] = useState("");
  const [customStyle, setCustomStyle] = useState<"editorial" | "archive" | "cosmic" | "clean">("clean");
  const [hasParentalAdvisory, setHasParentalAdvisory] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ready-made design presets
  const libraryPresets: { id: string; name: string; subtitle: string; desc: string; presetId: any }[] = [
    { id: "opps", name: "STEP ON OPPS", subtitle: "Maf Teeski & Anti Da Menace", desc: "Velvet glow, double-exposure grid and gold outline titles", presetId: "opps" },
    { id: "drake", name: "IT'S ALL A BLUR", subtitle: "Live Globe Stage", desc: "Spotlight beams, 3D glowing projection globe & arena silhouettes", presetId: "drake" },
    { id: "fault", name: "AIN'T MY FAULT", subtitle: "Rowdy Rebel, Doe Boy, 42 Dugg", desc: "Monochrome police mugshot lineup height chart with spray rose red logo", presetId: "fault" },
    { id: "dead", name: "DEAD", subtitle: "Bloody Red Eye Closeup", desc: "Macro eye with deep crimson vignettes, distress grain and raw text", presetId: "dead" },
    { id: "obvious", name: "OBVIOUS", subtitle: "Warm Eye Target", desc: "Orange iris closeup with central neon target reflection details", presetId: "obvious" },
    { id: "painless", name: "PAINLESS TO THE PEOPLE", subtitle: "Green Laser Specimen", desc: "Tactical mask silhouette crossed by glowing green laser coordinates", presetId: "painless" },
    { id: "condensed", name: "CONDENSED FONTS", subtitle: "Swiss Editorial", desc: "High-contrast off-white grid with modular Swiss typography design", presetId: "condensed" },
  ];

  // Helper to trigger slide updates and localstorage save
  const updateSlides = (newSlides: BannerSlide[]) => {
    onSlidesChange(newSlides);
    // Trigger local index bounds safety
    if (currentIndex >= newSlides.length && newSlides.length > 0) {
      onSelectSlide(newSlides.length - 1);
    }
  };

  // Add a preset from library
  const handleAddPreset = (presetId: "fault" | "dead" | "obvious" | "painless" | "opps" | "drake" | "condensed") => {
    const matched = libraryPresets.find(p => p.presetId === presetId);
    if (!matched) return;

    const newSlide: BannerSlide = {
      id: `${presetId}_${Date.now()}`,
      title: matched.name,
      subtitle: matched.subtitle,
      type: "preset",
      presetId: presetId,
      parentalAdvisory: presetId !== "condensed" && presetId !== "drake"
    };

    updateSlides([...slides, newSlide]);
    // Instant focus on newly added slide
    onSelectSlide(slides.length);
  };

  // Remove slide
  const handleRemoveSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      setErrorMsg("You must keep at least one active banner slide.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    const filtered = slides.filter((_, i) => i !== index);
    updateSlides(filtered);
  };

  // Move slide up
  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index - 1];
    newSlides[index - 1] = temp;
    updateSlides(newSlides);
    onSelectSlide(index - 1);
  };

  // Move slide down
  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + 1];
    newSlides[index + 1] = temp;
    updateSlides(newSlides);
    onSelectSlide(index + 1);
  };

  // Process custom image file
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const newSlide: BannerSlide = {
        id: `custom_${Date.now()}`,
        title: uploadTitle.trim() || "ATELIER COUTURE",
        subtitle: uploadSubtitle.trim() || "BESPOKE SERIES",
        type: "custom",
        customImageUrl: dataUrl,
        customFrameStyle: customStyle,
        parentalAdvisory: hasParentalAdvisory
      };

      updateSlides([...slides, newSlide]);
      onSelectSlide(slides.length);
      
      // Reset form fields
      setUploadTitle("");
      setUploadSubtitle("");
      setHasParentalAdvisory(false);
      setActiveTab("active");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleResetDefault = () => {
    const defaults: BannerSlide[] = [
      { id: "fault_default", title: "AIN'T MY FAULT", subtitle: "Rowdy Rebel, Doe Boy, 42 Dugg", type: "preset", presetId: "fault", parentalAdvisory: true },
      { id: "dead_default", title: "DEAD", subtitle: "Bloody Red Eye Closeup", type: "preset", presetId: "dead", parentalAdvisory: true },
      { id: "obvious_default", title: "OBVIOUS", subtitle: "Warm Eye Target", type: "preset", presetId: "obvious", parentalAdvisory: true },
      { id: "painless_default", title: "PAINLESS TO THE PEOPLE", subtitle: "Green Laser Specimen", type: "preset", presetId: "painless", parentalAdvisory: true },
      { id: "opps_default", title: "STEP ON OPPS", subtitle: "Maf Teeski & Anti Da Menace", type: "preset", presetId: "opps", parentalAdvisory: true },
      { id: "drake_default", title: "IT'S ALL A BLUR", subtitle: "Live Globe Stage", type: "preset", presetId: "drake", parentalAdvisory: false },
    ];
    updateSlides(defaults);
    onSelectSlide(0);
  };

  return (
    <div id="banner-customizer-panel" className="w-full bg-white rounded-3xl border border-neutral-200/90 shadow-lg p-6 font-sans">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#1F1E1A]/10 text-[#1F1E1A] font-semibold text-[9px] uppercase tracking-wider">ATELIER STUDIO</span>
            <h4 className="text-sm font-serif font-bold text-neutral-900 tracking-wide">Banner Slide Controller</h4>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Customize photos, templates, rotation speeds, and arrange order.</p>
        </div>

        {/* Speed Adjustment and Reset */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-200/60">
            <button 
              onClick={() => onIntervalSpeedChange(intervalSpeed === 0 ? 1500 : 0)}
              className="text-neutral-500 hover:text-neutral-900 focus:outline-none transition-colors"
              title={intervalSpeed === 0 ? "Resume Automatic Rotation" : "Pause Automatic Rotation"}
            >
              {intervalSpeed === 0 ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-neutral-600 animate-pulse" />}
            </button>
            
            <select 
              value={intervalSpeed}
              onChange={(e) => onIntervalSpeedChange(Number(e.target.value))}
              className="bg-transparent border-none text-[11px] font-mono text-neutral-700 focus:ring-0 pr-6 pl-1 py-0 cursor-pointer"
            >
              <option value={0}>Paused</option>
              <option value={1000}>1.0 sec (Fast)</option>
              <option value={1500}>1.5 sec (Default)</option>
              <option value={2000}>2.0 sec</option>
              <option value={3000}>3.0 sec</option>
              <option value={5000}>5.0 sec (Slow)</option>
            </select>
          </div>

          <button 
            onClick={handleResetDefault}
            className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 rounded-xl transition-all border border-transparent hover:border-neutral-200"
            title="Reset to original high-fidelity sliders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-2xl mb-4 text-xs font-medium max-w-sm">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 text-center rounded-xl cursor-pointer transition-all ${
            activeTab === "active" 
              ? "bg-white text-neutral-950 font-semibold shadow-sm" 
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Active Slides ({slides.length})
        </button>
        <button
          onClick={() => setActiveTab("presets")}
          className={`flex-1 py-2 text-center rounded-xl cursor-pointer transition-all ${
            activeTab === "presets" 
              ? "bg-white text-neutral-950 font-semibold shadow-sm" 
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Preset Library
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 text-center rounded-xl cursor-pointer transition-all ${
            activeTab === "upload" 
              ? "bg-white text-neutral-950 font-semibold shadow-sm" 
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          ＋ Add Custom
        </button>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mb-4 text-xs bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-xl animate-fade-in flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          {errorMsg}
        </div>
      )}

      {/* Content panes */}
      {activeTab === "active" && (
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {slides.map((slide, index) => {
            const isActive = currentIndex === index;
            return (
              <div 
                key={slide.id}
                onClick={() => onSelectSlide(index)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isActive 
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-md" 
                    : "bg-neutral-50 hover:bg-neutral-100/70 border-neutral-200/80"
                }`}
              >
                {/* Left side: Thumbnail preview and details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0 border border-neutral-200/20 shadow-inner">
                    {slide.type === "preset" ? (
                      <div className="w-full h-full flex flex-col justify-center items-center p-0.5 relative text-center">
                        <span className="text-[5px] font-bold leading-none uppercase scale-75 tracking-tight text-white/90">
                          {slide.presetId === "fault" ? "FAULT" : 
                           slide.presetId === "dead" ? "DEAD" : 
                           slide.presetId === "obvious" ? "OBVIOUS" : 
                           slide.presetId === "painless" ? "PAINLESS" : 
                           slide.presetId === "opps" ? "OPPS" : 
                           slide.presetId === "drake" ? "BLUR" : "SWISS"}
                        </span>
                        <Sparkles className="w-2.5 h-2.5 text-amber-400 mt-0.5 opacity-85" />
                      </div>
                    ) : (
                      <img 
                        src={slide.customImageUrl} 
                        alt="custom preview" 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>

                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <h5 className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-neutral-800"}`}>
                        {slide.title}
                      </h5>
                      {slide.type === "custom" && (
                        <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 font-mono text-[7px] font-bold rounded">
                          CUSTOM
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] truncate ${isActive ? "text-neutral-400" : "text-neutral-500"}`}>
                      {slide.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right side: Reorder & Delete */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleMoveUp(index, e)}
                    disabled={index === 0}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "text-neutral-400 hover:text-white disabled:text-neutral-700" 
                        : "text-neutral-400 hover:text-neutral-800 disabled:text-neutral-200"
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleMoveDown(index, e)}
                    disabled={index === slides.length - 1}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "text-neutral-400 hover:text-white disabled:text-neutral-700" 
                        : "text-neutral-400 hover:text-neutral-800 disabled:text-neutral-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleRemoveSlide(index, e)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                        : "text-neutral-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                    title="Remove Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "presets" && (
        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {libraryPresets.map((preset) => {
            // Check if already active
            const isAdded = slides.some(s => s.type === "preset" && s.presetId === preset.presetId);
            return (
              <div 
                key={preset.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100/60 transition-all"
              >
                <div className="text-left min-w-0 pr-4">
                  <h5 className="text-xs font-bold text-neutral-800 truncate">{preset.name}</h5>
                  <p className="text-[10px] text-neutral-500 truncate">{preset.subtitle}</p>
                  <p className="text-[9px] text-neutral-400 italic mt-0.5 line-clamp-1">{preset.desc}</p>
                </div>

                <button
                  onClick={() => handleAddPreset(preset.presetId)}
                  className={`px-3 py-1.5 rounded-xl font-bold font-sans text-[9px] tracking-wider uppercase shrink-0 transition-all cursor-pointer ${
                    isAdded 
                      ? "bg-neutral-200 hover:bg-neutral-300 text-neutral-700" 
                      : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm flex items-center gap-1"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAdded ? "Add Copy" : "Add Slide"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "upload" && (
        <div className="flex flex-col gap-4 text-left">
          
          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Slide Title</label>
              <input 
                type="text" 
                placeholder="e.g. STEP ON OPPS"
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
                className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Subtitle / Artists</label>
              <input 
                type="text" 
                placeholder="e.g. Maf Teeski & Anti Da Menace"
                value={uploadSubtitle}
                onChange={e => setUploadSubtitle(e.target.value)}
                className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>
          </div>

          {/* Design Layout Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Atelier Poster Frame Preset</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: "clean", label: "Clean Showroom", desc: "Minimal full photo cover" },
                { id: "editorial", label: "Atelier Editorial", desc: "Cream background & serif" },
                { id: "archive", label: "Street Archive", desc: "Distressed red vignette" },
                { id: "cosmic", label: "Cosmic Sphere", desc: "Glowing blue cyber eye" }
              ].map((styleOpt) => (
                <button
                  key={styleOpt.id}
                  type="button"
                  onClick={() => setCustomStyle(styleOpt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    customStyle === styleOpt.id 
                      ? "bg-neutral-950 border-neutral-950 text-white" 
                      : "bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <h6 className="text-[10px] font-bold leading-none">{styleOpt.label}</h6>
                  <p className={`text-[8px] mt-1 leading-tight ${customStyle === styleOpt.id ? "text-neutral-400" : "text-neutral-400"}`}>
                    {styleOpt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Extra options */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="parental-adv"
              checked={hasParentalAdvisory}
              onChange={e => setHasParentalAdvisory(e.target.checked)}
              className="w-3.5 h-3.5 accent-neutral-950 border-neutral-300 rounded cursor-pointer"
            />
            <label htmlFor="parental-adv" className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold cursor-pointer select-none">
              Apply Parental Advisory Explicit Badge
            </label>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              dragActive 
                ? "border-neutral-950 bg-neutral-50 text-neutral-900" 
                : "border-neutral-200/80 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
            
            <Upload className="w-7 h-7" />
            <div className="text-center">
              <span className="text-xs font-bold block text-neutral-700">Drag your photo here, or browse</span>
              <span className="text-[10px] text-neutral-400 mt-0.5 block">Supports PNG, JPG, JPEG, WEBP files</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
