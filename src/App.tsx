import { useState, useEffect } from "react";
import { CartItem, LighterProduct, BannerSlide, CustomSection, SectionVisibility } from "./types";
import { FINISHES, FLAMES, PRODUCTS, REVIEWS } from "./data";
import { ProductCatalog } from "./components/ProductCatalog";
import { PromoSlider } from "./components/PromoSlider";
import { CartSlider } from "./components/CartSlider";
import { CheckoutModal } from "./components/CheckoutModal";
import { AtelierMenu } from "./components/AtelierMenu";
import { AtelierDashboard } from "./components/AtelierDashboard";
import { BespokeCustomizer } from "./components/BespokeCustomizer";
import { CondensedFontsPoster } from "./components/CondensedFontsPoster";
import { BannerCarousel } from "./components/BannerCarousel";
import { BannerCustomizer } from "./components/BannerCustomizer";
import { AtelierAdmin } from "./components/AtelierAdmin";
import { 
  ShoppingBag, Compass, 
  Shield, Star, Sparkle, Heart, LayoutDashboard,
  Volume2, VolumeX, Settings
} from "lucide-react";
import { getMuteState, setMuteState } from "./utils/audio";

export default function App() {
  // Local storage cart persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("flint_and_steel_vault_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic banner slides loaded from localStorage or default presets
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem("flint_and_steel_showroom_slides");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: "opps_default", title: "STEP ON OPPS", subtitle: "Maf Teeski & Anti Da Menace", type: "preset", presetId: "opps", parentalAdvisory: true },
      { id: "drake_default", title: "IT'S ALL A BLUR", subtitle: "Live Globe Stage", type: "preset", presetId: "drake", parentalAdvisory: false },
      { id: "fault_default", title: "AIN'T MY FAULT", subtitle: "Rowdy Rebel, Doe Boy, 42 Dugg", type: "preset", presetId: "fault", parentalAdvisory: true },
      { id: "dead_default", title: "DEAD", subtitle: "Bloody Red Eye Closeup", type: "preset", presetId: "dead", parentalAdvisory: true },
      { id: "obvious_default", title: "OBVIOUS", subtitle: "Warm Eye Target", type: "preset", presetId: "obvious", parentalAdvisory: true },
      { id: "painless_default", title: "PAINLESS TO THE PEOPLE", subtitle: "Green Laser Specimen", type: "preset", presetId: "painless", parentalAdvisory: true },
    ];
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideIntervalSpeed, setSlideIntervalSpeed] = useState(() => {
    try {
      const saved = localStorage.getItem("flint_and_steel_showroom_slide_speed");
      return saved ? Number(saved) : 1500;
    } catch {
      return 1500;
    }
  });

  const [products, setProducts] = useState<LighterProduct[]>(() => {
    try {
      const saved = localStorage.getItem("flint_and_steel_products");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS;
  });

  const [customSections, setCustomSections] = useState<CustomSection[]>(() => {
    try {
      const saved = localStorage.getItem("flint_and_steel_custom_sections");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(() => {
    try {
      const saved = localStorage.getItem("flint_and_steel_section_visibility");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      promoBanner: true,
      dashboard: true,
      reviews: true,
    };
  });

  // Sync products to local storage
  useEffect(() => {
    try {
      localStorage.setItem("flint_and_steel_products", JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync custom sections to local storage
  useEffect(() => {
    try {
      localStorage.setItem("flint_and_steel_custom_sections", JSON.stringify(customSections));
    } catch (e) {
      console.error(e);
    }
  }, [customSections]);

  // Sync section visibility to local storage
  useEffect(() => {
    try {
      localStorage.setItem("flint_and_steel_section_visibility", JSON.stringify(sectionVisibility));
    } catch (e) {
      console.error(e);
    }
  }, [sectionVisibility]);

  const [showBannerCustomizer, setShowBannerCustomizer] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [customizingProduct, setCustomizingProduct] = useState<LighterProduct | null>(null);
  const [currentPage, setCurrentPage] = useState<"showroom" | "top-selling">("showroom");
  const [isMuted, setIsMuted] = useState(() => getMuteState());

  // Sync mute state changes globally
  useEffect(() => {
    setMuteState(isMuted);
  }, [isMuted]);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavigate = (page: "showroom" | "top-selling", sectionId?: string) => {
    setCurrentPage(page);
    if (sectionId) {
      setTimeout(() => {
        scrollToId(sectionId);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Sync cart with local storage
  useEffect(() => {
    localStorage.setItem("flint_and_steel_vault_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync banner slides and speed with local storage
  useEffect(() => {
    try {
      localStorage.setItem("flint_and_steel_showroom_slides", JSON.stringify(bannerSlides));
    } catch (e) {
      console.error(e);
    }
  }, [bannerSlides]);

  useEffect(() => {
    try {
      localStorage.setItem("flint_and_steel_showroom_slide_speed", String(slideIntervalSpeed));
    } catch (e) {
      console.error(e);
    }
  }, [slideIntervalSpeed]);

  // Set up global scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll("[data-reveal]:not(.revealed)");
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Open the bespoke customizer modal for configuring and buying a product
  const handleAddToCartDirect = (prodId: string) => {
    const product = products.find((p) => p.id === prodId) || products[0];
    setCustomizingProduct(product);
  };

  // Add customized item from customizer to shopping cart
  const handleBespokeAddToCart = (customItem: Omit<CartItem, "id">) => {
    const { product, finish, flame, engravingText, engravingFont } = customItem;
    const cartItemId = `${product.id}_${finish.id}_${flame.id}_${engravingText || "none"}_${engravingFont}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          finish,
          flame,
          engravingText,
          engravingFont,
          quantity: 1,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  // Add customized item and immediately checkout
  const handleBespokeCheckout = (customItem: Omit<CartItem, "id">) => {
    const { product, finish, flame, engravingText, engravingFont } = customItem;
    const cartItemId = `${product.id}_${finish.id}_${flame.id}_${engravingText || "none"}_${engravingFont}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          finish,
          flame,
          engravingText,
          engravingFont,
          quantity: 1,
        };
        return [...prev, newItem];
      }
    });

    setIsCheckoutOpen(true);
  };

  // Update quantity of cart items
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle like vote on client reviews
  const handleLikeReview = (revId: string) => {
    setLikesCount((prev) => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1,
    }));
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1E1A] font-sans antialiased pb-20 relative">
      
      {/* ATELIER HEADER BAR */}
      <header className="fixed top-0 w-full z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo in bold premium serif */}
          <div 
            onClick={() => handleNavigate("showroom")} 
            className="flex items-center cursor-pointer group select-none"
          >
            <h1 className="text-xs md:text-sm font-condensed font-bold text-[#1F1E1A] tracking-[0.3em] uppercase whitespace-nowrap">
              FLINT N STEEL
            </h1>
          </div>

          {/* Navigation link anchors */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-sans tracking-[0.25em] text-neutral-500 uppercase font-medium">
            <button 
              onClick={() => handleNavigate("showroom", "atelier-dashboard")} 
              className={`hover:text-bronze-gold transition-colors cursor-pointer pb-1 border-b ${currentPage === "showroom" ? "text-[#1F1E1A]" : "border-transparent"}`}
            >
              Atelier Dashboard
            </button>
            <button 
              onClick={() => handleNavigate("showroom", "curated-collection-grid")} 
              className="hover:text-bronze-gold transition-colors cursor-pointer pb-1 border-b border-transparent"
            >
              The Collection
            </button>
            <button 
              onClick={() => handleNavigate("top-selling")} 
              className={`hover:text-bronze-gold transition-colors cursor-pointer pb-1 border-b ${currentPage === "top-selling" ? "text-bronze-gold border-bronze-gold" : "border-transparent"}`}
            >
              Top Selling
            </button>
            <button 
              onClick={() => handleNavigate("showroom", "client-testimonials")} 
              className="hover:text-bronze-gold transition-colors cursor-pointer pb-1 border-b border-transparent"
            >
              Reviews
            </button>
          </nav>

          {/* Cart triggers */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={() => setIsAtelierOpen(true)}
              className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-full bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white border border-neutral-950/40 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.3)] hover:from-neutral-700 hover:via-neutral-900 hover:to-neutral-950 active:scale-95 transition-all duration-300 cursor-pointer text-xs font-sans tracking-widest uppercase font-medium"
              title="Open Navigation Menu"
            >
              <Sparkle className="w-3.5 h-3.5 text-amber-400 animate-pulse fill-amber-400/20" />
              <span className="hidden sm:inline text-[9px] md:text-[10px] tracking-[0.15em]">Menu</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white border border-neutral-950/40 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.3)] hover:from-neutral-700 hover:via-neutral-900 hover:to-neutral-950 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-amber-950/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.3)] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE / HERO ATELIER AREA */}
      <main className="max-w-7xl mx-auto px-6 pt-32 flex flex-col gap-12">
        
        {currentPage === "showroom" ? (
          <>
            {/* Editorial Brand Intro */}
            <div data-reveal style={{ transitionDuration: "800ms", transitionDelay: "100ms" }}>
              <div className="flex flex-col items-center text-center gap-4 mt-4">
                <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-black text-[#1F1E1A] tracking-[0.08em] max-w-full leading-none py-2 whitespace-nowrap">
                  Flint N Steel
                </h2>
                <p className="text-xs md:text-sm text-neutral-500 max-w-2xl leading-relaxed">
                  Welcome to the digital showroom of Flint N Steel, where hand-carved precious metals, pattern-welded steel, and raw gold coalesce into acoustically tuned masterpiece lighters hand-assembled in France.
                </p>

                {/* 16:13 Premium Atelier Poster with Automatic Slides */}
                <div className="w-full max-w-xl mt-8 px-2">
                  <div className="aspect-[16/13] overflow-hidden rounded-2xl border border-neutral-200/80 shadow-md bg-neutral-100/50">
                    <BannerCarousel 
                      slides={bannerSlides}
                      current={currentSlideIndex}
                      setCurrent={setCurrentSlideIndex}
                      intervalSpeed={slideIntervalSpeed}
                    />
                  </div>

                  {/* Banner customized button trigger */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => {
                        setShowBannerCustomizer(!showBannerCustomizer);
                        // Smoothly scroll down to editor if opening
                        if (!showBannerCustomizer) {
                          setTimeout(() => {
                            document.getElementById("banner-customizer-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                          }, 150);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-sans tracking-[0.18em] text-[9px] uppercase font-bold rounded-xl transition-all cursor-pointer shadow-md border border-neutral-800"
                    >
                      <Settings className={`w-3.5 h-3.5 transition-transform duration-500 ${showBannerCustomizer ? "rotate-90 text-amber-400" : ""}`} />
                      <span>{showBannerCustomizer ? "Close Banner Editor" : "Manage Banner Photos"}</span>
                    </button>
                  </div>

                  {/* Collapsible Customizer panel */}
                  {showBannerCustomizer && (
                    <div className="mt-5">
                      <BannerCustomizer
                        slides={bannerSlides}
                        onSlidesChange={setBannerSlides}
                        currentIndex={currentSlideIndex}
                        onSelectSlide={setCurrentSlideIndex}
                        intervalSpeed={slideIntervalSpeed}
                        onIntervalSpeedChange={setSlideIntervalSpeed}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* HIGH-END AUTOMATIC SLIDING BANNER */}
            {sectionVisibility.promoBanner && (
              <div data-reveal style={{ transitionDuration: "800ms", transitionDelay: "200ms" }} className="mt-64 md:mt-[400px]">
                <PromoSlider onAddToCart={handleAddToCartDirect} />
              </div>
            )}

            {/* ATELIER DASHBOARD SECTION */}
            {sectionVisibility.dashboard && (
              <section id="atelier-dashboard" className="pt-4 scroll-mt-28">
                <div data-reveal style={{ transitionDuration: "750ms" }}>
                  <AtelierDashboard
                    onNavigate={(tab) => {
                      const elementId = tab === "collection" ? "curated-collection-grid" : tab === "reviews" ? "client-testimonials" : "atelier-dashboard";
                      scrollToId(elementId);
                    }}
                    onAddToCart={handleAddToCartDirect}
                    cartCount={cartCount}
                    cartItems={cartItems}
                  />
                </div>
              </section>
            )}

            {/* Separator line */}
            {(sectionVisibility.promoBanner || sectionVisibility.dashboard) && (
              <div className="h-px bg-neutral-200/60 my-12" />
            )}

            {/* CURATED COLLECTION PRODUCTS GRID */}
            <section id="curated-collection-grid" className="pt-4 scroll-mt-28">
              <ProductCatalog 
                products={products}
                onSelectProduct={(product) => setCustomizingProduct(product)}
              />
            </section>

            {/* CUSTOM DYNAMIC SECTIONS CREATED BY ADMIN */}
            {customSections.length > 0 && (
              <>
                <div className="h-px bg-neutral-200/60 my-12" />
                <div className="flex flex-col gap-10">
                  {customSections.map((sec) => (
                    <div 
                      key={sec.id}
                      data-reveal
                      className={`p-8 md:p-12 rounded-3xl border border-neutral-200/60 shadow-md ${
                        sec.bgStyle === "luxury-gold" 
                          ? "bg-gradient-to-b from-[#F3E7C4]/30 via-[#D4AF37]/5 to-white text-[#1F1E1A] border-bronze-gold/25" 
                          : sec.bgStyle === "dark-slate" 
                          ? "bg-[#1C1C1B] text-neutral-100 border-neutral-800" 
                          : sec.bgStyle === "minimal-cream"
                          ? "bg-[#F5F2EB]/85 text-[#1F1E1A] border-neutral-200/80"
                          : "bg-white text-[#1F1E1A]"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        {sec.subtitle && (
                          <span className="text-[10px] font-mono tracking-widest text-bronze-gold uppercase font-bold">
                            {sec.subtitle}
                          </span>
                        )}
                        <h3 className="text-2xl md:text-3xl font-serif tracking-wide text-neutral-900 font-medium">
                          {sec.title}
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap mt-3 font-sans">
                          {sec.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CLIENT TESTIMONIALS & REVIEWS SECTION */}
            {sectionVisibility.reviews && (
              <>
                <div className="h-px bg-neutral-200/60 my-12" />
                <section id="client-testimonials" className="flex flex-col gap-6 pt-4 scroll-mt-28">
                  <div data-reveal style={{ transitionDuration: "600ms" }}>
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Verified Appraisals</span>
                      <h3 className="text-xl md:text-2xl font-serif text-[#1F1E1A] tracking-wide">Impressions of Our Patrons</h3>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-5 mt-3">
                    {REVIEWS.map((rev, idx) => {
                      const extraLikes = likesCount[rev.id] || 0;
                      return (
                        <div key={rev.id} data-reveal style={{ transitionDelay: `${idx * 150}ms`, transitionDuration: "800ms" }} className="flex flex-col">
                          <div 
                            className="p-5 bg-white border border-neutral-200/60 shadow-sm rounded-2xl flex flex-col justify-between gap-4 flex-1"
                          >
                            <div className="flex flex-col gap-2.5">
                              {/* Star ratings */}
                              <div className="flex items-center gap-1">
                                {[...Array(rev.rating)].map((_, idx) => (
                                  <Star key={idx} className="w-3 h-3 fill-bronze-gold text-bronze-gold" />
                                ))}
                              </div>

                              <h4 className="text-xs font-sans tracking-wide font-medium text-[#1F1E1A] uppercase">{rev.title}</h4>
                              <p className="text-[11px] text-neutral-600 leading-relaxed">"{rev.comment}"</p>
                            </div>

                            {/* Testimonial footer */}
                            <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-mono text-bronze-gold border border-neutral-200 font-bold">
                                  {rev.avatarInitials}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-sans font-medium text-neutral-800">{rev.author}</span>
                                  <span className="text-[8px] text-neutral-500 font-sans tracking-wider uppercase">Verified Patron</span>
                                </div>
                              </div>

                              {/* Support like vote button */}
                              <button
                                onClick={() => handleLikeReview(rev.id)}
                                className="flex items-center gap-1 text-[9px] text-neutral-400 hover:text-bronze-gold transition-colors cursor-pointer font-mono"
                              >
                                <Heart className="w-3 h-3 text-neutral-400 fill-current group-hover:text-bronze-gold" />
                                <span>{rev.likes + extraLikes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Breadcrumb / Back button */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => handleNavigate("showroom")}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white hover:bg-[#F5F2EB] border border-neutral-200/80 text-xs font-sans tracking-[0.15em] uppercase text-neutral-500 hover:text-bronze-gold transition-all duration-300 cursor-pointer shadow-sm group font-medium"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span>Back to Showroom</span>
              </button>
            </div>

            {/* CURATED COLLECTION PRODUCTS GRID (Only Top Selling) */}
            <section id="curated-collection-grid" className="pt-4 scroll-mt-28">
              <ProductCatalog 
                products={products}
                onSelectProduct={(product) => setCustomizingProduct(product)}
                onlyTopSelling={true}
              />
            </section>
          </div>
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-28 border-t border-neutral-200/60 bg-white/40 pt-12 pb-6 text-xs text-neutral-500 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="text-[11px] font-serif font-bold tracking-[0.2em] text-[#1F1E1A]">Flint N Steel</span>
            <span className="text-[9px] text-neutral-400 tracking-wider">Place Vendôme • London • New York • Tokyo</span>
          </div>

          <div className="flex gap-8 text-[10px] tracking-wider uppercase">
            <span className="hover:text-neutral-900 transition-colors cursor-pointer">Bespoke Orfèvrerie</span>
            <span className="hover:text-neutral-900 transition-colors cursor-pointer">Acoustic Standards</span>
            <span className="hover:text-neutral-900 transition-colors cursor-pointer">Terms of Carriage</span>
          </div>

          <span className="text-[9px] text-neutral-400 font-mono tracking-wider">© 2026 Flint N Steel. All rights reserved.</span>
        </div>
      </footer>

      {/* 3. SMALL ADMIN PANEL AT THE BOTTOM */}
      <AtelierAdmin
        products={products}
        onProductsChange={setProducts}
        bannerSlides={bannerSlides}
        onBannerSlidesChange={setBannerSlides}
        customSections={customSections}
        onCustomSectionsChange={setCustomSections}
        sectionVisibility={sectionVisibility}
        onSectionVisibilityChange={setSectionVisibility}
      />

      {/* COMPONENT DRAWER & MODAL SLIDERS */}
      <CartSlider 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onTriggerCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={() => {
          setCartItems([]);
        }}
      />

      <AtelierMenu 
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
        onNavigate={(tab) => {
          setIsAtelierOpen(false);
          if (tab === "top-selling") {
            handleNavigate("top-selling");
          } else {
            handleNavigate("showroom", tab === "collection" ? "curated-collection-grid" : "client-testimonials");
          }
        }}
        onAddToCart={(prodId) => {
          handleAddToCartDirect(prodId);
          setIsAtelierOpen(false);
        }}
      />

      <BespokeCustomizer
        isOpen={customizingProduct !== null}
        onClose={() => setCustomizingProduct(null)}
        product={customizingProduct}
        onAddToCart={handleBespokeAddToCart}
        onTriggerCheckout={handleBespokeCheckout}
      />
    </div>
  );
}
