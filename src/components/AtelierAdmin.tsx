import React, { useState, useEffect } from "react";
import { 
  Lock, Unlock, Shield, Trash2, Plus, LayoutGrid, Image, Tag, 
  Settings2, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles, X, Layers, Edit3
} from "lucide-react";
import { LighterProduct, BannerSlide, CustomSection, SectionVisibility } from "../types";
import { FINISHES, FLAMES } from "../data";

interface AtelierAdminProps {
  products: LighterProduct[];
  onProductsChange: (products: LighterProduct[]) => void;
  bannerSlides: BannerSlide[];
  onBannerSlidesChange: (slides: BannerSlide[]) => void;
  customSections: CustomSection[];
  onCustomSectionsChange: (sections: CustomSection[]) => void;
  sectionVisibility: SectionVisibility;
  onSectionVisibilityChange: (visibility: SectionVisibility) => void;
}

export const AtelierAdmin: React.FC<AtelierAdminProps> = ({
  products,
  onProductsChange,
  bannerSlides,
  onBannerSlidesChange,
  customSections,
  onCustomSectionsChange,
  sectionVisibility,
  onSectionVisibilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("flint_and_steel_admin_auth") === "true";
    } catch {
      return false;
    }
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"sections" | "banner" | "products">("sections");

  // Custom Section Form state
  const [secTitle, setSecTitle] = useState("");
  const [secSubtitle, setSecSubtitle] = useState("");
  const [secContent, setSecContent] = useState("");
  const [secBgStyle, setSecBgStyle] = useState<CustomSection["bgStyle"]>("white");

  // Banner Slide Form state
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideImgUrl, setSlideImgUrl] = useState("");
  const [slideFrameStyle, setSlideFrameStyle] = useState<BannerSlide["customFrameStyle"]>("clean");
  const [slideParentalAdvisory, setSlideParentalAdvisory] = useState(false);
  const [slideIsPortrait916, setSlideIsPortrait916] = useState(false);

  // Editing slide state
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editSlideTitle, setEditSlideTitle] = useState("");
  const [editSlideSubtitle, setEditSlideSubtitle] = useState("");
  const [editSlideImgUrl, setEditSlideImgUrl] = useState("");
  const [editSlideFrameStyle, setEditSlideFrameStyle] = useState<BannerSlide["customFrameStyle"]>("clean");
  const [editSlideParentalAdvisory, setEditSlideParentalAdvisory] = useState(false);
  const [editSlideIsPortrait916, setEditSlideIsPortrait916] = useState(false);

  // Product Element Form state
  const [prodName, setProdName] = useState("");
  const [prodTagline, setProdTagline] = useState("");
  const [prodPrice, setProdPrice] = useState("850");
  const [prodSku, setProdSku] = useState("");
  const [prodWeight, setProdWeight] = useState("130g");
  const [prodDimensions, setProdDimensions] = useState("62mm x 38mm x 12mm");
  const [prodFuel, setProdFuel] = useState("Premium Pure Butane Gas");
  const [prodSound, setProdSound] = useState("Pure resonant crystal 'ping' (1.4kHz, 2.2s decay)");
  const [prodStory, setProdStory] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPopularity, setProdPopularity] = useState("85");
  const [prodCategory, setProdCategory] = useState("Paris Heritage");
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(["gold"]);
  const [selectedFlames, setSelectedFlames] = useState<string[]>(["candle"]);

  // New states for product image management and inline editing
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [editProdName, setEditProdName] = useState("");
  const [editProdTagline, setEditProdTagline] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdSku, setEditProdSku] = useState("");
  const [editProdWeight, setEditProdWeight] = useState("");
  const [editProdDimensions, setEditProdDimensions] = useState("");
  const [editProdFuel, setEditProdFuel] = useState("");
  const [editProdSound, setEditProdSound] = useState("");
  const [editProdStory, setEditProdStory] = useState("");
  const [editProdDescription, setEditProdDescription] = useState("");
  const [editProdPopularity, setEditProdPopularity] = useState("");
  const [editProdCategory, setEditProdCategory] = useState("Paris Heritage");
  const [editSelectedFinishes, setEditSelectedFinishes] = useState<string[]>([]);
  const [editSelectedFlames, setEditSelectedFlames] = useState<string[]>([]);
  const [editProdImages, setEditProdImages] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState("");

  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "admin") {
      setIsLoggedIn(true);
      setError("");
      try {
        localStorage.setItem("flint_and_steel_admin_auth", "true");
      } catch (err) {
        console.error(err);
      }
      setNotification("Successfully logged into Atelier Admin panel");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword("");
    try {
      localStorage.removeItem("flint_and_steel_admin_auth");
    } catch (err) {
      console.error(err);
    }
    setNotification("Logged out of Admin panel");
  };

  // Add custom section
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secTitle.trim() || !secContent.trim()) {
      setError("Please fill out Title and Content");
      return;
    }
    const newSec: CustomSection = {
      id: `custom_sec_${Date.now()}`,
      title: secTitle.trim(),
      subtitle: secSubtitle.trim() || undefined,
      content: secContent.trim(),
      bgStyle: secBgStyle,
    };
    onCustomSectionsChange([...customSections, newSec]);
    setSecTitle("");
    setSecSubtitle("");
    setSecContent("");
    setSecBgStyle("white");
    setError("");
    setNotification("Custom section added successfully!");
  };

  // Remove custom section
  const handleRemoveSection = (id: string) => {
    onCustomSectionsChange(customSections.filter((s) => s.id !== id));
    setNotification("Custom section removed");
  };

  // Toggle standard sections
  const handleToggleSection = (key: keyof SectionVisibility) => {
    onSectionVisibilityChange({
      ...sectionVisibility,
      [key]: !sectionVisibility[key],
    });
    setNotification("Section visibility updated");
  };

  // Add custom banner slide
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideImgUrl.trim()) {
      setError("Please fill out Title and Image URL");
      return;
    }
    const newSlide: BannerSlide = {
      id: `custom_slide_${Date.now()}`,
      title: slideTitle.trim().toUpperCase(),
      subtitle: (slideSubtitle.trim() || "ATELIER ORIGINAL").toUpperCase(),
      type: "custom",
      customImageUrl: slideImgUrl.trim(),
      customFrameStyle: slideFrameStyle,
      parentalAdvisory: slideParentalAdvisory,
      isPortrait916: slideIsPortrait916,
    };
    onBannerSlidesChange([...bannerSlides, newSlide]);
    setSlideTitle("");
    setSlideSubtitle("");
    setSlideImgUrl("");
    setSlideFrameStyle("clean");
    setSlideParentalAdvisory(false);
    setSlideIsPortrait916(false);
    setError("");
    setNotification("Banner photo added successfully!");
  };

  // Remove banner slide
  const handleRemoveSlide = (id: string) => {
    if (bannerSlides.length <= 1) {
      setError("You must keep at least one banner slide");
      return;
    }
    if (editingSlideId === id) {
      setEditingSlideId(null);
    }
    onBannerSlidesChange(bannerSlides.filter((s) => s.id !== id));
    setNotification("Banner photo removed");
  };

  // Start editing slide
  const handleStartEditSlide = (slide: BannerSlide) => {
    setEditingSlideId(slide.id);
    setEditSlideTitle(slide.title);
    setEditSlideSubtitle(slide.subtitle || "");
    setEditSlideImgUrl(slide.customImageUrl || "");
    setEditSlideFrameStyle(slide.customFrameStyle || "clean");
    setEditSlideParentalAdvisory(!!slide.parentalAdvisory);
    setEditSlideIsPortrait916(!!slide.isPortrait916);
    setError("");
  };

  const handleCancelEditSlide = () => {
    setEditingSlideId(null);
    setError("");
  };

  const handleSaveEditSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlideTitle.trim()) {
      setError("Please fill out the Title");
      return;
    }
    const updated = bannerSlides.map((s) => {
      if (s.id === editingSlideId) {
        const isCustom = s.type === "custom" || !!editSlideImgUrl.trim();
        return {
          ...s,
          title: editSlideTitle.trim().toUpperCase(),
          subtitle: editSlideSubtitle.trim().toUpperCase(),
          type: isCustom ? "custom" : "preset",
          customImageUrl: editSlideImgUrl.trim() || undefined,
          customFrameStyle: editSlideFrameStyle,
          parentalAdvisory: editSlideParentalAdvisory,
          isPortrait916: editSlideIsPortrait916,
        };
      }
      return s;
    });
    onBannerSlidesChange(updated);
    setEditingSlideId(null);
    setNotification("Banner slide updated successfully!");
    setError("");
  };

  const handleSlideLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSlideImgUrl(reader.result);
          setNotification("Uploaded and set local slide image successfully!");
          setError("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSlideLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditSlideImgUrl(reader.result);
          setNotification("Uploaded and set local edit slide image successfully!");
          setError("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add custom product element
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodTagline.trim() || !prodSku.trim() || !prodDescription.trim()) {
      setError("Please fill out all required product fields");
      return;
    }
    const newProd: LighterProduct = {
      id: `prod_${prodSku.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
      name: prodName.trim(),
      tagline: prodTagline.trim(),
      description: prodDescription.trim(),
      price: Math.max(1, Number(prodPrice) || 850),
      finishes: selectedFinishes as any[],
      flames: selectedFlames as any[],
      weight: prodWeight.trim() || "130g",
      dimensions: prodDimensions.trim() || "62mm x 38mm x 12mm",
      fuel: prodFuel.trim() || "Premium Pure Butane Gas",
      ignition: "Traditional flint roller mechanism",
      sound: prodSound.trim() || "Pure resonant crystal 'ping'",
      sku: prodSku.trim().toUpperCase(),
      story: prodStory.trim() || "Forged in our digital French atelier with absolute precision.",
      popularity: Math.min(100, Math.max(0, Number(prodPopularity) || 80)),
      images: prodImages,
      category: prodCategory.trim() || "Paris Heritage",
    };
    onProductsChange([...products, newProd]);

    // Reset Form
    setProdName("");
    setProdTagline("");
    setProdPrice("850");
    setProdSku("");
    setProdWeight("130g");
    setProdDimensions("62mm x 38mm x 12mm");
    setProdFuel("Premium Pure Butane Gas");
    setProdSound("Pure resonant crystal 'ping' (1.4kHz, 2.2s decay)");
    setProdStory("");
    setProdDescription("");
    setProdPopularity("85");
    setProdCategory("Paris Heritage");
    setSelectedFinishes(["gold"]);
    setSelectedFlames(["candle"]);
    setProdImages([]);
    setImageUrlInput("");
    setError("");
    setNotification("New product element added with photos!");
  };

  // Remove product element
  const handleRemoveProduct = (id: string) => {
    if (products.length <= 1) {
      setError("You must keep at least one product in the catalog");
      return;
    }
    if (editingProductId === id) {
      setEditingProductId(null);
    }
    onProductsChange(products.filter((p) => p.id !== id));
    setNotification("Product removed from catalog");
  };

  // Product Photo Helpers (Creation Mode)
  const handleAddProdImage = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!imageUrlInput.trim()) {
      setError("Please paste a direct image URL first, or use the 'Upload Photo' button below to select a local file.");
      return;
    }
    setProdImages([...prodImages, imageUrlInput.trim()]);
    setImageUrlInput("");
    setNotification("Photo added to new product gallery");
    setError("");
  };

  const handleImageUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProdImage();
    }
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProdImages([...prodImages, reader.result]);
          setNotification("Uploaded and added local photo successfully!");
          setError("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProdImage = (index: number) => {
    setProdImages(prodImages.filter((_, idx) => idx !== index));
    setNotification("Photo removed from new product gallery");
  };

  // Product Photo Helpers (Edit Mode)
  const handleAddEditProdImage = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!editImageUrlInput.trim()) {
      setError("Please paste a direct image URL first, or use the 'Upload Photo' button below to select a local file.");
      return;
    }
    setEditProdImages([...editProdImages, editImageUrlInput.trim()]);
    setEditImageUrlInput("");
    setNotification("Photo added to editing product");
    setError("");
  };

  const handleEditImageUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEditProdImage();
    }
  };

  const handleLocalEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditProdImages([...editProdImages, reader.result]);
          setNotification("Uploaded and added local photo successfully!");
          setError("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditProdImage = (index: number) => {
    setEditProdImages(editProdImages.filter((_, idx) => idx !== index));
    setNotification("Photo removed from editing product");
  };

  // Product Edit Handlers
  const handleStartEditProduct = (prod: LighterProduct) => {
    setEditingProductId(prod.id);
    setEditProdName(prod.name);
    setEditProdTagline(prod.tagline);
    setEditProdPrice(String(prod.price));
    setEditProdSku(prod.sku);
    setEditProdWeight(prod.weight || "130g");
    setEditProdDimensions(prod.dimensions || "62mm x 38mm x 12mm");
    setEditProdFuel(prod.fuel || "Premium Pure Butane Gas");
    setEditProdSound(prod.sound || "Pure resonant crystal 'ping'");
    setEditProdStory(prod.story || "Forged in our digital French atelier with absolute precision.");
    setEditProdDescription(prod.description);
    setEditProdPopularity(String(prod.popularity || 80));
    setEditProdCategory(prod.category || "Paris Heritage");
    setEditSelectedFinishes(prod.finishes);
    setEditSelectedFlames(prod.flames);
    setEditProdImages(prod.images || []);
    setEditImageUrlInput("");
    setError("");
  };

  const handleCancelEditProduct = () => {
    setEditingProductId(null);
    setError("");
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProdName.trim() || !editProdTagline.trim() || !editProdSku.trim() || !editProdDescription.trim()) {
      setError("Please fill out all required fields to save");
      return;
    }

    const updatedProducts = products.map((p) => {
      if (p.id === editingProductId) {
        return {
          ...p,
          name: editProdName.trim(),
          tagline: editProdTagline.trim(),
          description: editProdDescription.trim(),
          price: Math.max(1, Number(editProdPrice) || 850),
          sku: editProdSku.trim().toUpperCase(),
          weight: editProdWeight.trim() || "130g",
          dimensions: editProdDimensions.trim() || "62mm x 38mm x 12mm",
          fuel: editProdFuel.trim() || "Premium Pure Butane Gas",
          sound: editProdSound.trim() || "Pure resonant crystal 'ping'",
          story: editProdStory.trim() || "Forged in our digital French atelier with absolute precision.",
          popularity: Math.min(100, Math.max(0, Number(editProdPopularity) || 80)),
          category: editProdCategory.trim() || "Paris Heritage",
          finishes: editSelectedFinishes as any[],
          flames: editSelectedFlames as any[],
          images: editProdImages,
        };
      }
      return p;
    });

    onProductsChange(updatedProducts);
    setEditingProductId(null);
    setNotification("Product details and images successfully updated!");
    setError("");
  };

  const handleEditFinishCheckbox = (id: string) => {
    if (editSelectedFinishes.includes(id)) {
      if (editSelectedFinishes.length > 1) {
        setEditSelectedFinishes(editSelectedFinishes.filter((x) => x !== id));
      }
    } else {
      setEditSelectedFinishes([...editSelectedFinishes, id]);
    }
  };

  const handleEditFlameCheckbox = (id: string) => {
    if (editSelectedFlames.includes(id)) {
      if (editSelectedFlames.length > 1) {
        setEditSelectedFlames(editSelectedFlames.filter((x) => x !== id));
      }
    } else {
      setEditSelectedFlames([...editSelectedFlames, id]);
    }
  };

  const handleFinishCheckbox = (id: string) => {
    if (selectedFinishes.includes(id)) {
      if (selectedFinishes.length > 1) {
        setSelectedFinishes(selectedFinishes.filter((x) => x !== id));
      }
    } else {
      setSelectedFinishes([...selectedFinishes, id]);
    }
  };

  const handleFlameCheckbox = (id: string) => {
    if (selectedFlames.includes(id)) {
      if (selectedFlames.length > 1) {
        setSelectedFlames(selectedFlames.filter((x) => x !== id));
      }
    } else {
      setSelectedFlames([...selectedFlames, id]);
    }
  };

  return (
    <>
      {/* 1. SMALL ACCESS BUTTON AT BOTTOM */}
      <div className="w-full flex justify-center py-4 border-t border-neutral-150/40 bg-[#FAF9F6] mt-4">
        <button
          onClick={() => setIsOpen(true)}
          className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-400 hover:text-bronze-gold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 py-1 px-3 rounded-md hover:bg-neutral-100"
        >
          <Shield className="w-2.5 h-2.5 text-neutral-400" />
          <span>Atelier Admin Access</span>
        </button>
      </div>

      {/* 2. SYSTEM MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#FAF9F6] border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200/80 bg-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-bronze-gold animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-700">
                  Maison Flint & Steel — Control Panel
                </span>
                {isLoggedIn && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-mono text-[8px] uppercase tracking-wider font-semibold">
                    Authorized
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                }}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors border border-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification area */}
            {notification && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* Error Area */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* LOCK SCREEN */}
              {!isLoggedIn ? (
                <div className="max-w-md mx-auto py-12 flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-inner">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-serif text-neutral-900 font-semibold">Authentication Required</h3>
                    <p className="text-xs text-neutral-500 font-sans">
                      Please enter the Maison administrator password to unlock customization controls.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold pl-1">
                        System Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-bronze-gold transition-colors text-center"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-sans tracking-widest uppercase font-bold transition-all cursor-pointer shadow-md"
                    >
                      Authenticate Access
                    </button>
                    <span className="text-[9px] font-mono text-neutral-400 mt-1">
                      Hint: Use password <span className="font-bold text-neutral-600 underline">admin123</span> or <span className="font-bold text-neutral-600 underline">admin</span>
                    </span>
                  </form>
                </div>
              ) : (
                
                /* ADMIN DASHBOARD PANELS */
                <div className="flex flex-col gap-6">
                  
                  {/* Tab Selectors */}
                  <div className="flex border-b border-neutral-200/60 pb-3 gap-2">
                    <button
                      onClick={() => { setActiveTab("sections"); setError(""); }}
                      className={`px-4 py-2 rounded-lg text-xs font-sans tracking-wider uppercase font-semibold transition-all flex items-center gap-2 ${
                        activeTab === "sections" 
                          ? "bg-bronze-gold text-white shadow-sm" 
                          : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Manage Sections</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("banner"); setError(""); }}
                      className={`px-4 py-2 rounded-lg text-xs font-sans tracking-wider uppercase font-semibold transition-all flex items-center gap-2 ${
                        activeTab === "banner" 
                          ? "bg-bronze-gold text-white shadow-sm" 
                          : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>Banner Photos</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("products"); setError(""); }}
                      className={`px-4 py-2 rounded-lg text-xs font-sans tracking-wider uppercase font-semibold transition-all flex items-center gap-2 ${
                        activeTab === "products" 
                          ? "bg-bronze-gold text-white shadow-sm" 
                          : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Product Elements</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="ml-auto px-3.5 py-2 bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-500 border border-neutral-200 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                    >
                      Lock Screen
                    </button>
                  </div>

                  {/* TAB 1: SECTIONS MANAGER */}
                  {activeTab === "sections" && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Section Toggle Cards */}
                      <div className="grid md:grid-cols-3 gap-4">
                        
                        <div className="p-4 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between gap-3 shadow-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Core Component</span>
                            <h4 className="text-xs font-sans font-bold text-neutral-800">Acoustic Promo Banner</h4>
                          </div>
                          <button
                            onClick={() => handleToggleSection("promoBanner")}
                            className={`w-full py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all font-semibold ${
                              sectionVisibility.promoBanner
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            }`}
                          >
                            {sectionVisibility.promoBanner ? "Active / Visible" : "Hidden / Disabled"}
                          </button>
                        </div>

                        <div className="p-4 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between gap-3 shadow-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Core Component</span>
                            <h4 className="text-xs font-sans font-bold text-neutral-800">Atelier Quick commission</h4>
                          </div>
                          <button
                            onClick={() => handleToggleSection("dashboard")}
                            className={`w-full py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all font-semibold ${
                              sectionVisibility.dashboard
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            }`}
                          >
                            {sectionVisibility.dashboard ? "Active / Visible" : "Hidden / Disabled"}
                          </button>
                        </div>

                        <div className="p-4 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between gap-3 shadow-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Core Component</span>
                            <h4 className="text-xs font-sans font-bold text-neutral-800">Patron Appraisals / Reviews</h4>
                          </div>
                          <button
                            onClick={() => handleToggleSection("reviews")}
                            className={`w-full py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all font-semibold ${
                              sectionVisibility.reviews
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            }`}
                          >
                            {sectionVisibility.reviews ? "Active / Visible" : "Hidden / Disabled"}
                          </button>
                        </div>

                      </div>

                      {/* Add Dynamic Section Form */}
                      <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                          <Plus className="w-4 h-4 text-bronze-gold" />
                          <h4 className="text-xs font-sans font-bold text-neutral-800 uppercase tracking-wide">Forge a Custom Announcement / Section</h4>
                        </div>

                        <form onSubmit={handleAddSection} className="grid md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Section Title *</label>
                            <input
                              type="text"
                              placeholder="e.g. Exclusive Summer Vernissage"
                              value={secTitle}
                              onChange={(e) => setSecTitle(e.target.value)}
                              className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Section Subtitle / Tag</label>
                            <input
                              type="text"
                              placeholder="e.g. July 2026 Limited release"
                              value={secSubtitle}
                              onChange={(e) => setSecSubtitle(e.target.value)}
                              className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Content Text / Callout Description *</label>
                            <textarea
                              rows={2}
                              placeholder="A descriptive copy about this beautiful new section. You can describe exclusive events, private gallery exhibits or bespoke client commissions..."
                              value={secContent}
                              onChange={(e) => setSecContent(e.target.value)}
                              className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold resize-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Atmospheric Background Color</label>
                            <select
                              value={secBgStyle}
                              onChange={(e) => setSecBgStyle(e.target.value as any)}
                              className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                            >
                              <option value="white">Pristine White Card</option>
                              <option value="luxury-gold">Radiant Luxury Gold Glow</option>
                              <option value="dark-slate">Deep Dark Slate Carbon</option>
                              <option value="minimal-cream">Muted Atelier Soft Cream</option>
                            </select>
                          </div>

                          <div className="flex items-end justify-end">
                            <button
                              type="submit"
                              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer w-full md:w-auto"
                            >
                              Create Section
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Custom Sections List */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold pl-1">
                          Current Custom Dynamic Sections ({customSections.length})
                        </span>

                        {customSections.length === 0 ? (
                          <div className="p-6 bg-white border border-neutral-200 rounded-xl text-center text-xs text-neutral-400 italic">
                            No custom sections created yet. Dynamic sections render live on your digital showroom floor.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {customSections.map((sec) => (
                              <div key={sec.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between gap-4 shadow-sm">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-sans font-bold text-neutral-800">{sec.title}</h5>
                                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 uppercase tracking-wider border border-neutral-200">
                                      Style: {sec.bgStyle}
                                    </span>
                                  </div>
                                  {sec.subtitle && <p className="text-[9px] text-bronze-gold font-mono uppercase">{sec.subtitle}</p>}
                                  <p className="text-[10.5px] text-neutral-500 line-clamp-1">{sec.content}</p>
                                </div>
                                <button
                                  onClick={() => handleRemoveSection(sec.id)}
                                  className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200"
                                  title="Delete Custom Section"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: BANNER PHOTO MANAGER */}
                  {activeTab === "banner" && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Edit Banner Slide Form OR Add Custom Banner Slide Form */}
                      {editingSlideId ? (
                        <div className="p-5 bg-neutral-50 border-2 border-bronze-gold/40 rounded-xl shadow-md flex flex-col gap-4 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Edit3 className="w-4 h-4 text-bronze-gold animate-pulse" />
                              <h4 className="text-xs font-sans font-bold text-neutral-800 uppercase tracking-wide">
                                Edit Banner Photo Slide Info
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={handleCancelEditSlide}
                              className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all"
                            >
                              Cancel Edit
                            </button>
                          </div>

                          <form onSubmit={handleSaveEditSlide} className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Photo Header / Title *</label>
                              <input
                                type="text"
                                placeholder="e.g. COBALT STEEL FOCUS"
                                value={editSlideTitle}
                                onChange={(e) => setEditSlideTitle(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold uppercase font-bold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Subtitle / Location Tag</label>
                              <input
                                type="text"
                                placeholder="e.g. MONACO REGATTA"
                                value={editSlideSubtitle}
                                onChange={(e) => setEditSlideSubtitle(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold uppercase"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Image Source * (URL or Local File Upload)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/photo-... or upload locally"
                                  value={editSlideImgUrl}
                                  onChange={(e) => setEditSlideImgUrl(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                />
                                <label className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 border border-neutral-300 rounded-lg text-neutral-800 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 shrink-0">
                                  <span>Upload File</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleEditSlideLocalUpload}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Atelier Art Frame Style</label>
                              <select
                                value={editSlideFrameStyle}
                                onChange={(e) => setEditSlideFrameStyle(e.target.value as any)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              >
                                <option value="clean">Full Bleed Clean (Default)</option>
                                <option value="editorial">Traditional Book Editorial Frame</option>
                                <option value="archive">Brutalist Red Street Archive</option>
                                <option value="cosmic">Galactic Cyber Neon Blue</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-2.5 pt-1.5 md:col-span-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-700 font-medium">
                                <input
                                  type="checkbox"
                                  checked={editSlideIsPortrait916}
                                  onChange={(e) => setEditSlideIsPortrait916(e.target.checked)}
                                  className="w-4 h-4 rounded border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                />
                                <span className="flex items-center gap-1">
                                  <span>Enable 9:16 Portrait Aspect Ratio Layout</span>
                                  <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-700 font-mono text-[8px] font-bold rounded">HOT</span>
                                </span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-700 font-medium">
                                <input
                                  type="checkbox"
                                  checked={editSlideParentalAdvisory}
                                  onChange={(e) => setEditSlideParentalAdvisory(e.target.checked)}
                                  className="w-4 h-4 rounded border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                />
                                <span>Imprint Parental Advisory Label</span>
                              </label>
                            </div>

                            <div className="flex gap-3 justify-end items-end md:col-span-2 pt-2">
                              <button
                                type="button"
                                onClick={handleCancelEditSlide}
                                className="px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer flex-1 md:flex-initial"
                              >
                                Save Slide Updates
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        /* Add Custom Banner slide form */
                        <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col gap-4">
                          <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                            <Plus className="w-4 h-4 text-bronze-gold" />
                            <h4 className="text-xs font-sans font-bold text-neutral-800 uppercase tracking-wide">Add custom Banner Photo</h4>
                          </div>

                          <form onSubmit={handleAddSlide} className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Photo Header / Title *</label>
                              <input
                                type="text"
                                placeholder="e.g. COBALT STEEL FOCUS"
                                value={slideTitle}
                                onChange={(e) => setSlideTitle(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold uppercase font-bold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Subtitle / Location Tag</label>
                              <input
                                type="text"
                                placeholder="e.g. MONACO REGATTA"
                                value={slideSubtitle}
                                onChange={(e) => setSlideSubtitle(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold uppercase"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Image Source * (URL or Local File Upload)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/photo-... or upload locally"
                                  value={slideImgUrl}
                                  onChange={(e) => setSlideImgUrl(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                />
                                <label className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg text-neutral-700 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 shrink-0">
                                  <span>Upload File</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleSlideLocalUpload}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Atelier Art Frame Style</label>
                              <select
                                value={slideFrameStyle}
                                onChange={(e) => setSlideFrameStyle(e.target.value as any)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              >
                                <option value="clean">Full Bleed Clean (Default)</option>
                                <option value="editorial">Traditional Book Editorial Frame</option>
                                <option value="archive">Brutalist Red Street Archive</option>
                                <option value="cosmic">Galactic Cyber Neon Blue</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-2 pt-1.5 md:col-span-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-600">
                                <input
                                  type="checkbox"
                                  checked={slideIsPortrait916}
                                  onChange={(e) => setSlideIsPortrait916(e.target.checked)}
                                  className="w-4 h-4 rounded border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                />
                                <span className="flex items-center gap-1">
                                  <span>Enable 9:16 Portrait Aspect Ratio Layout</span>
                                  <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-700 font-mono text-[8px] font-bold rounded">9:16</span>
                                </span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-600">
                                <input
                                  type="checkbox"
                                  checked={slideParentalAdvisory}
                                  onChange={(e) => setSlideParentalAdvisory(e.target.checked)}
                                  className="w-4 h-4 rounded border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                />
                                <span>Imprint Parental Advisory Label</span>
                              </label>
                            </div>

                            <div className="flex justify-end items-end md:col-span-2 pt-2">
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer w-full md:w-auto"
                              >
                                Add Banner Photo
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Current Slides */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                            Current Slides list ({bannerSlides.length}) — Click slide to edit
                          </span>
                          <span className="text-[9px] font-sans text-neutral-400">
                            Tap slide to edit text or switch ratios
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {bannerSlides.map((slide, idx) => {
                            const isBeingEdited = editingSlideId === slide.id;
                            return (
                              <div 
                                key={slide.id} 
                                onClick={() => handleStartEditSlide(slide)}
                                className={`p-3 rounded-xl flex flex-col justify-between gap-3 shadow-sm relative group cursor-pointer transition-all duration-300 border ${
                                  isBeingEdited 
                                    ? "bg-[#FAF9F6] border-2 border-bronze-gold shadow-md" 
                                    : "bg-white border-neutral-200 hover:border-bronze-gold/60 hover:shadow-md"
                                }`}
                              >
                                {/* Photo Container with Edit Hover Overlay */}
                                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 border border-neutral-150 relative">
                                  {slide.type === "preset" ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-2">
                                      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">PRESET {idx + 1}</span>
                                      <span className="text-[11px] font-sans font-bold text-white uppercase text-center truncate w-full mt-1">{slide.title}</span>
                                    </div>
                                  ) : (
                                    <img
                                      src={slide.customImageUrl}
                                      alt={slide.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}

                                  {/* Hover overlay explaining actions */}
                                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="px-3 py-1.5 bg-white/95 text-neutral-950 text-[10px] font-mono uppercase tracking-wider rounded-md font-bold shadow">
                                      Click to Edit Info
                                    </span>
                                  </div>

                                  {/* Aspect ratio label indicator */}
                                  {slide.isPortrait916 && (
                                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-amber-500/90 text-white font-mono text-[8px] font-bold rounded shadow-sm">
                                      9:16 PORTRAIT
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1 truncate">
                                    <h5 className="text-[11px] font-sans font-bold text-neutral-800 uppercase truncate">
                                      {slide.title}
                                    </h5>
                                    {slide.type === "custom" && (
                                      <span className="px-1 bg-neutral-100 border border-neutral-200 text-neutral-500 font-mono text-[7px] rounded">
                                        CUSTOM
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[8px] font-mono text-neutral-400 tracking-wider uppercase truncate">
                                    {slide.subtitle || "ATELIER SLIDE"}
                                  </span>
                                  <span className="text-[7.5px] font-mono text-bronze-gold uppercase">
                                    {slide.customFrameStyle || "Full-Bleed"} layout
                                  </span>
                                </div>

                                {/* Remove Slide Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent opening edit form!
                                    if (confirm("Are you sure you want to remove this banner slide?")) {
                                      handleRemoveSlide(slide.id);
                                    }
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-full border border-neutral-200 shadow-md transition-colors cursor-pointer z-10"
                                  title="Remove photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: PRODUCT ELEMENTS MANAGER */}
                  {activeTab === "products" && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Add Custom Product Form OR Edit Product Form */}
                      {editingProductId ? (
                        <div className="p-5 bg-neutral-50 border-2 border-bronze-gold/40 rounded-xl shadow-md flex flex-col gap-4 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Edit3 className="w-4 h-4 text-bronze-gold animate-bounce" />
                              <h4 className="text-xs font-sans font-bold text-neutral-800 uppercase tracking-wide">
                                Edit Product Element: <span className="text-bronze-gold font-mono">{editProdSku}</span>
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={handleCancelEditProduct}
                              className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all"
                            >
                              Cancel Edit
                            </button>
                          </div>

                          <form onSubmit={handleSaveEditProduct} className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Lighter Model Name *</label>
                              <input
                                type="text"
                                value={editProdName}
                                onChange={(e) => setEditProdName(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Tagline *</label>
                              <input
                                type="text"
                                value={editProdTagline}
                                onChange={(e) => setEditProdTagline(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Price ($ USD) *</label>
                              <input
                                type="number"
                                value={editProdPrice}
                                onChange={(e) => setEditProdPrice(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">SKU *</label>
                              <input
                                type="text"
                                value={editProdSku}
                                onChange={(e) => setEditProdSku(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Category Collection *</label>
                              <select
                                value={editProdCategory}
                                onChange={(e) => setEditProdCategory(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold cursor-pointer"
                                required
                              >
                                <option value="Paris Heritage">Paris Heritage</option>
                                <option value="Modern Stealth">Modern Stealth</option>
                                <option value="Urushi Art">Urushi Art</option>
                                <option value="Grand Complications">Grand Complications</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Weight</label>
                              <input
                                type="text"
                                value={editProdWeight}
                                onChange={(e) => setEditProdWeight(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Dimensions</label>
                              <input
                                type="text"
                                value={editProdDimensions}
                                onChange={(e) => setEditProdDimensions(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Combustible Fuel</label>
                              <input
                                type="text"
                                value={editProdFuel}
                                onChange={(e) => setEditProdFuel(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Acoustic Sound Profile</label>
                              <input
                                type="text"
                                value={editProdSound}
                                onChange={(e) => setEditProdSound(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Description *</label>
                              <textarea
                                rows={2}
                                value={editProdDescription}
                                onChange={(e) => setEditProdDescription(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold resize-none"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Maison Story/Heritage Legend</label>
                              <textarea
                                rows={2}
                                value={editProdStory}
                                onChange={(e) => setEditProdStory(e.target.value)}
                                className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold resize-none"
                              />
                            </div>

                            {/* Finishes checklist */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Supported Finishes</label>
                              <div className="grid grid-cols-2 gap-2 p-2.5 bg-white border border-neutral-200 rounded-lg text-xs">
                                {FINISHES.map((fin) => (
                                  <label key={fin.id} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={editSelectedFinishes.includes(fin.id)}
                                      onChange={() => handleEditFinishCheckbox(fin.id)}
                                      className="w-3.5 h-3.5 border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                    />
                                    <span>{fin.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Flames checklist */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Supported Flames</label>
                              <div className="grid grid-cols-2 gap-2 p-2.5 bg-white border border-neutral-200 rounded-lg text-xs">
                                {FLAMES.map((flm) => (
                                  <label key={flm.id} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={editSelectedFlames.includes(flm.id)}
                                      onChange={() => handleEditFlameCheckbox(flm.id)}
                                      className="w-3.5 h-3.5 border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                    />
                                    <span>{flm.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Product Photo Sector (Edit Mode) */}
                            <div className="flex flex-col gap-2.5 md:col-span-2 border-t border-neutral-200/60 pt-4 mt-2">
                              <div className="flex items-center gap-1.5">
                                <Image className="w-4 h-4 text-bronze-gold" />
                                <h5 className="text-[10px] font-sans font-bold text-neutral-800 uppercase tracking-wide">Edit Product Photo Sector</h5>
                              </div>
                              <p className="text-[10.5px] text-neutral-500 leading-relaxed font-sans">
                                Add or remove pictures of this product. You can copy-paste direct image links, upload a file from your computer, or choose from our luxury presets below.
                              </p>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Paste picture URL here..."
                                    value={editImageUrlInput}
                                    onChange={(e) => setEditImageUrlInput(e.target.value)}
                                    onKeyDown={handleEditImageUrlKeyDown}
                                    className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleAddEditProdImage}
                                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    Add Photo
                                  </button>
                                </div>
                                <label className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 border border-neutral-300">
                                  <span>Upload File</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLocalEditImageUpload}
                                  />
                                </label>
                              </div>

                              <div className="flex flex-wrap gap-2 items-center mt-1">
                                <span className="text-[9px] font-mono uppercase text-neutral-400">Luxury Presets:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditProdImages([...editProdImages, "https://images.unsplash.com/photo-1595556164301-44755106e6bf?q=80&w=600&auto=format&fit=crop"]);
                                    setNotification("Luxury Gold Preset photo added");
                                  }}
                                  className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 text-[9px] font-mono rounded transition-colors"
                                >
                                  Gold Lighter
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditProdImages([...editProdImages, "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=600&auto=format&fit=crop"]);
                                    setNotification("Obsidian Noir Preset photo added");
                                  }}
                                  className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 text-[9px] font-mono rounded transition-colors"
                                >
                                  Noir Lighter
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditProdImages([...editProdImages, "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"]);
                                    setNotification("Silver Steel Preset photo added");
                                  }}
                                  className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 text-[9px] font-mono rounded transition-colors"
                                >
                                  Steel Lighter
                                </button>
                              </div>

                              {editProdImages.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-white border border-neutral-200 rounded-xl mt-1.5">
                                  {editProdImages.map((img, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => handleRemoveEditProdImage(idx)}
                                      className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group bg-neutral-100 shadow-sm cursor-pointer hover:border-red-500/50 transition-all"
                                      title="Click to remove photo"
                                    >
                                      <img
                                        src={img}
                                        alt={`Edit Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
                                        <Trash2 className="w-4 h-4 text-white" />
                                        <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Remove</span>
                                      </div>
                                      <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[8px] text-white font-mono leading-none z-10">
                                        #{idx + 1}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 bg-white border border-dashed border-neutral-200 rounded-xl text-neutral-400 text-xs font-mono">
                                  No custom photos uploaded. Standard stylized lighter graphics will show.
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3 justify-end items-end md:col-span-2 pt-2">
                              <button
                                type="button"
                                onClick={handleCancelEditProduct}
                                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-bronze-gold hover:bg-bronze-gold/90 text-white rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-md"
                              >
                                Save Product Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        /* Add Custom Product Form */
                        <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col gap-4">
                          <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                            <Plus className="w-4 h-4 text-bronze-gold" />
                            <h4 className="text-xs font-sans font-bold text-neutral-800 uppercase tracking-wide">Forge a New Product Element</h4>
                          </div>

                          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Lighter Model Name *</label>
                              <input
                                type="text"
                                placeholder="e.g. Grand Overlord Gold"
                                value={prodName}
                                onChange={(e) => setProdName(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Tagline *</label>
                              <input
                                type="text"
                                placeholder="e.g. Masterwork of 128 Damascus layers"
                                value={prodTagline}
                                onChange={(e) => setProdTagline(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Price ($ USD) *</label>
                              <input
                                type="number"
                                placeholder="950"
                                value={prodPrice}
                                onChange={(e) => setProdPrice(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">SKU *</label>
                              <input
                                type="text"
                                placeholder="e.g. LXP-OVL-950"
                                value={prodSku}
                                onChange={(e) => setProdSku(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Category Collection *</label>
                              <select
                                value={prodCategory}
                                onChange={(e) => setProdCategory(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold cursor-pointer"
                                required
                              >
                                <option value="Paris Heritage">Paris Heritage</option>
                                <option value="Modern Stealth">Modern Stealth</option>
                                <option value="Urushi Art">Urushi Art</option>
                                <option value="Grand Complications">Grand Complications</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Weight</label>
                              <input
                                type="text"
                                placeholder="e.g. 145g"
                                value={prodWeight}
                                onChange={(e) => setProdWeight(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Dimensions</label>
                              <input
                                type="text"
                                placeholder="e.g. 62mm x 37mm x 11mm"
                                value={prodDimensions}
                                onChange={(e) => setProdDimensions(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Combustible Fuel</label>
                              <input
                                type="text"
                                placeholder="e.g. Premium Pure Butane Gas"
                                value={prodFuel}
                                onChange={(e) => setProdFuel(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Acoustic Sound Profile</label>
                              <input
                                type="text"
                                placeholder="e.g. Pure resonant crystal 'ping' (1.4kHz)"
                                value={prodSound}
                                onChange={(e) => setProdSound(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Description *</label>
                              <textarea
                                rows={2}
                                placeholder="Detailed narrative or product description..."
                                value={prodDescription}
                                onChange={(e) => setProdDescription(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold resize-none"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Maison Story/Heritage Legend</label>
                              <textarea
                                rows={2}
                                placeholder="Meticulously crafted over months by single silver artists in Paris..."
                                value={prodStory}
                                onChange={(e) => setProdStory(e.target.value)}
                                className="px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold resize-none"
                              />
                            </div>

                            {/* Finishes checklist */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Supported Finishes</label>
                              <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs">
                                {FINISHES.map((fin) => (
                                  <label key={fin.id} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={selectedFinishes.includes(fin.id)}
                                      onChange={() => handleFinishCheckbox(fin.id)}
                                      className="w-3.5 h-3.5 border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                    />
                                    <span>{fin.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Flames checklist */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Supported Flames</label>
                              <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs">
                                {FLAMES.map((flm) => (
                                  <label key={flm.id} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={selectedFlames.includes(flm.id)}
                                      onChange={() => handleFlameCheckbox(flm.id)}
                                      className="w-3.5 h-3.5 border-neutral-300 focus:ring-bronze-gold accent-neutral-900 cursor-pointer"
                                    />
                                    <span>{flm.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Product Photo Sector */}
                            <div className="flex flex-col gap-2.5 md:col-span-2 border-t border-neutral-200/60 pt-4 mt-2">
                              <div className="flex items-center gap-1.5">
                                <Image className="w-4 h-4 text-bronze-gold" />
                                <h5 className="text-[10px] font-sans font-bold text-neutral-800 uppercase tracking-wide">Product Photo Sector</h5>
                              </div>
                              <p className="text-[10.5px] text-neutral-500 leading-relaxed font-sans">
                                Add pictures of this product. These photos will render inside the luxury catalog and bespoke detail customizer. Paste direct image URLs, upload files from your computer, or choose from our luxury presets below.
                              </p>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Paste picture URL here..."
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    onKeyDown={handleImageUrlKeyDown}
                                    className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-bronze-gold"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleAddProdImage}
                                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    Add Photo
                                  </button>
                                </div>
                                <label className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 border border-neutral-300">
                                  <span>Upload File</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLocalImageUpload}
                                  />
                                </label>
                              </div>

                              <div className="flex flex-wrap gap-2 items-center mt-1">
                                <span className="text-[9px] font-mono uppercase text-neutral-400">Luxury Presets:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProdImages([...prodImages, "https://images.unsplash.com/photo-1595556164301-44755106e6bf?q=80&w=600&auto=format&fit=crop"]);
                                    setNotification("Luxury Gold Preset photo added");
                                  }}
                                  className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 text-[9px] font-mono rounded transition-colors"
                                >
                                  Gold Lighter
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProdImages([...prodImages, "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=600&auto=format&fit=crop"]);
                                    setNotification("Obsidian Noir Preset photo added");
                                  }}
                                  className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 text-[9px] font-mono rounded transition-colors"
                                >
                                  Noir Lighter
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProdImages([...prodImages, "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"]);
                                    setNotification("Silver Steel Preset photo added");
                                  }}
                                  className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-600 hover:text-neutral-900 text-[9px] font-mono rounded transition-colors"
                                >
                                  Steel Lighter
                                </button>
                              </div>

                              {prodImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl mt-1.5">
                                  {prodImages.map((img, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => handleRemoveProdImage(idx)}
                                      className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group bg-neutral-100 shadow-sm cursor-pointer hover:border-red-500/50 transition-all"
                                      title="Click to remove photo"
                                    >
                                      <img
                                        src={img}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
                                        <Trash2 className="w-4 h-4 text-white" />
                                        <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Remove</span>
                                      </div>
                                      <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[8px] text-white font-mono leading-none z-10">
                                        #{idx + 1}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end items-end md:col-span-2">
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer w-full md:w-auto animate-pulse"
                              >
                                Forge Lighter Element
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Current products list */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold pl-1">
                          Current Products Catalog ({products.length})
                        </span>

                        <div className="flex flex-col gap-2">
                          {products.map((prod) => (
                            <div key={prod.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between gap-4 shadow-sm">
                              <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-xs font-sans font-bold text-neutral-800">{prod.name}</h5>
                                  <span className="text-[8.5px] font-mono text-bronze-gold font-semibold uppercase">{prod.sku}</span>
                                  <span className="text-xs font-mono text-neutral-700 font-bold">${prod.price}</span>
                                  {prod.images && prod.images.length > 0 && (
                                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[8px] font-mono uppercase">
                                      {prod.images.length} Photo{prod.images.length > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[9px] text-neutral-400 font-mono tracking-wide truncate">{prod.tagline}</p>
                                <p className="text-[10.5px] text-neutral-500 line-clamp-1">{prod.description}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleStartEditProduct(prod)}
                                  className="px-2.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors border border-amber-200 flex items-center gap-1 cursor-pointer text-[10px] font-mono font-bold uppercase tracking-wider"
                                  title="Edit details & photos"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleRemoveProduct(prod.id)}
                                  className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200 cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-between items-center text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              <span>Secure Connection • AES_256</span>
              <span>© {new Date().getFullYear()} Flint and Steel</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
