export type FinishId = "gold" | "obsidian" | "silver" | "emerald" | "damascus";
export type FlameId = "candle" | "jet" | "plasma";
export type FontId = "serif" | "script" | "mono" | "sans";

export interface FinishDetails {
  id: FinishId;
  name: string;
  colorHex: string;
  bgGradient: string; // Tailwind gradient classes for representation
  reflectionClass: string;
  description: string;
  priceModifier: number;
}

export interface FlameDetails {
  id: FlameId;
  name: string;
  description: string;
  colorHex: string;
  priceModifier: number;
}

export interface FontDetails {
  id: FontId;
  name: string;
  cssClass: string;
}

export interface LighterProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  finishes: FinishId[];
  flames: FlameId[];
  weight: string;
  dimensions: string;
  fuel: string;
  ignition: string;
  sound: string;
  sku: string;
  story: string;
  popularity: number;
  images?: string[];
  category?: string;
}

export interface CustomizerState {
  modelId: string;
  finishId: FinishId;
  flameId: FlameId;
  engravingText: string;
  engravingFont: FontId;
  engravingDepth: number; // 0 to 1
  lidOpen: boolean;
  isLit: boolean;
}

export interface CartItem {
  id: string; // composite id: modelId_finishId_flameId_engravingText_engravingFont
  product: LighterProduct;
  finish: FinishDetails;
  flame: FlameDetails;
  engravingText: string;
  engravingFont: FontId;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
  avatarInitials: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  type: "preset" | "custom";
  presetId?: "fault" | "dead" | "obvious" | "painless" | "opps" | "drake" | "condensed";
  customImageUrl?: string; // base64 data url or direct url
  customFrameStyle?: "editorial" | "archive" | "cosmic" | "clean";
  parentalAdvisory?: boolean;
  isPortrait916?: boolean;
}

export interface CustomSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  bgStyle: "white" | "luxury-gold" | "dark-slate" | "minimal-cream";
}

export interface SectionVisibility {
  promoBanner: boolean;
  dashboard: boolean;
  reviews: boolean;
}

