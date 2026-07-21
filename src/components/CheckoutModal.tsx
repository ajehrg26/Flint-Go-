import React, { useState } from "react";
import { CartItem } from "../types";
import { X, CreditCard, Lock, ShieldCheck, Mail, MapPin, Sparkle, Loader, CheckCircle, Printer } from "lucide-react";
import { FONTS } from "../data";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

type CheckoutStep = "details" | "processing" | "success";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<CheckoutStep>("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [processingMsg, setProcessingMsg] = useState("");
  const [invoiceId] = useState(() => `INV-${Math.floor(100000 + Math.random() * 900000)}`);

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.price + item.finish.priceModifier + item.flame.priceModifier;
    return acc + itemPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal > 1500 ? 0 : 45;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address || !formData.cardNumber) {
      alert("Please fill in your primary delivery and security credentials.");
      return;
    }

    setStep("processing");

    // Immersive luxury processing sequence
    const logs = [
      "Securing satellite military-grade quantum keys...",
      "Registering serial certificates with French Guild standards...",
      "Routing payment verification to Place Vendôme ledger...",
      "Initializing laser monogram carving algorithms...",
      "Sealing certified custom cargo with bonded DHL couriers...",
    ];

    let currentLogIndex = 0;
    setProcessingMsg(logs[0]);

    const interval = setInterval(() => {
      currentLogIndex++;
      if (currentLogIndex < logs.length) {
        setProcessingMsg(logs[currentLogIndex]);
      } else {
        clearInterval(interval);
        setStep("success");
        onClearCart();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md transition-opacity"
        onClick={step !== "processing" ? onClose : undefined}
      />

      {/* Main modal container */}
      <div className="relative w-full max-w-2xl bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        
        {/* Header (Hidden during processing) */}
        {step !== "processing" && (
          <div className="px-6 py-5 bg-neutral-50 border-b border-neutral-150 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-bronze-gold" />
              <h3 className="text-xs font-sans tracking-[0.2em] font-medium text-neutral-800 uppercase">
                {step === "details" ? "Bespoke Secured Acquirement" : "Heirloom Acquired"}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Form Details view */}
        {step === "details" && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Left side: Bill/Ship Forms */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Delivery info */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-sans tracking-[0.15em] font-medium text-bronze-gold uppercase border-b border-neutral-200/50 pb-1">Bonded Courier Consignee</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Lord Sterling"
                      className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="connoisseur@luxe.com"
                      className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Street Address</label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="12 Place Vendôme"
                      className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">City / State</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Paris, FR"
                        className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Postal Code</label>
                      <input
                        required
                        type="text"
                        name="postal"
                        value={formData.postal}
                        onChange={handleInputChange}
                        placeholder="75001"
                        className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Payment details */}
              <div className="flex flex-col gap-3 mt-2">
                <h4 className="text-[10px] font-sans tracking-[0.15em] font-medium text-bronze-gold uppercase border-b border-neutral-200/50 pb-1">Secured Financial Terminal</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Cardholder Name</label>
                    <input
                      required
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="LORD STERLING"
                      className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Secure Card Number</label>
                    <input
                      required
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="•••• •••• •••• ••••"
                      className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">Expiry (MM/YY)</label>
                      <input
                        required
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="12/29"
                        className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-neutral-500 font-sans tracking-wide uppercase">CVC Code</label>
                      <input
                        required
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="•••"
                        maxLength={4}
                        className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-bronze-gold focus:bg-white transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Consolidated Bill Specifications */}
            <div className="w-full md:w-[220px] shrink-0 p-5 bg-[#FAF9F6] border border-neutral-200/60 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-sans tracking-[0.15em] font-medium text-bronze-gold uppercase border-b border-neutral-200/50 pb-1 mb-4">Acquisition Receipt</h4>
                
                <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const price = item.product.price + item.finish.priceModifier + item.flame.priceModifier;
                    return (
                      <div key={item.id} className="flex flex-col border-b border-neutral-200/30 pb-2">
                        <div className="flex justify-between items-start text-xs">
                          <span className="font-serif font-medium text-neutral-900 line-clamp-1">{item.product.name}</span>
                          <span className="font-mono text-[10px] text-neutral-500">x{item.quantity}</span>
                        </div>
                        <span className="text-[9px] text-bronze-gold/80 uppercase font-sans mt-0.5">{item.finish.name}</span>
                        {item.engravingText && (
                          <span className="text-[9px] text-neutral-400 font-mono italic tracking-wide">Engraving: "{item.engravingText}"</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Aggregated values */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-200">
                <div className="flex justify-between text-[10px] text-neutral-500 font-sans">
                  <span>Cart Valuation:</span>
                  <span className="font-mono text-neutral-800">${subtotal}</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 font-sans">
                  <span>Excise Tax (8%):</span>
                  <span className="font-mono text-neutral-800">${estimatedTax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 font-sans">
                  <span>DHL Delivery:</span>
                  <span className="font-mono text-neutral-800">{shippingCost > 0 ? `$${shippingCost}` : "Free"}</span>
                </div>
                
                <div className="h-px bg-neutral-200/50 my-1" />
                
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-sans tracking-wider text-neutral-800 uppercase font-medium">Bespoke Total:</span>
                  <span className="text-sm font-mono text-[#a68226] font-bold">${grandTotal.toFixed(0)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white rounded-lg text-[10px] font-sans tracking-[0.18em] font-bold uppercase transition-all duration-300 border border-neutral-950/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.45)] hover:from-neutral-700 hover:via-neutral-900 hover:to-neutral-950 hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_6px_20px_rgba(0,0,0,0.55)] active:scale-[0.98] cursor-pointer"
                >
                  Pay & Authorize
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Processing/Engraving View */}
        {step === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-[420px] gap-6">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-t border-b border-bronze-gold animate-spin" />
              <div className="absolute w-10 h-10 rounded-full border-r border-l border-neutral-200 animate-spin" style={{ animationDuration: "1.5s" }} />
              <Sparkle className="absolute w-5 h-5 text-bronze-gold animate-pulse" />
            </div>
            
            <div className="flex flex-col gap-2 max-w-sm">
              <h4 className="text-sm font-sans tracking-[0.25em] font-medium text-neutral-800 uppercase animate-pulse">Securing Order Registry</h4>
              <p className="text-xs text-neutral-500 font-mono leading-relaxed tracking-wider h-8">
                {processingMsg}
              </p>
            </div>
          </div>
        )}

        {/* Success View */}
        {step === "success" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center gap-6">
            
            <div className="w-12 h-12 bg-bronze-gold/10 border border-bronze-gold/30 rounded-full flex items-center justify-center text-bronze-gold">
              <CheckCircle className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="text-center">
              <h4 className="text-sm font-sans tracking-[0.25em] font-medium text-neutral-900 uppercase">Your Masterpiece is Certified</h4>
              <p className="text-xs text-neutral-500 mt-1">Order registered under code {invoiceId}</p>
            </div>

            {/* Immersive printable Luxury Invoice receipt */}
            <div className="w-full bg-[#FAF9F6] border border-neutral-200 rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden font-mono text-[10px] leading-relaxed max-w-md">
              {/* Gold seal watermark design in background */}
              <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-bronze-gold/[0.03] rounded-full border border-dashed border-bronze-gold/10 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full border border-dashed border-bronze-gold/10 flex items-center justify-center">
                  <Sparkle className="w-6 h-6 text-bronze-gold/10" />
                </div>
              </div>

              {/* Invoice Title */}
              <div className="flex justify-between items-start border-b border-neutral-200/60 pb-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-neutral-900 text-xs">Flint N Steel</span>
                  <span className="text-neutral-500 uppercase text-[8px]">Maison de Haute Orfèvrerie</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-neutral-800 font-bold">{invoiceId}</span>
                  <span className="text-neutral-500 uppercase text-[8px]">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>

              {/* Consignee */}
              <div className="flex flex-col gap-1 border-b border-neutral-200/60 pb-4">
                <span className="text-bronze-gold text-[8px] font-sans uppercase tracking-widest font-bold">Consigned To:</span>
                <span className="text-neutral-900 uppercase text-xs font-sans tracking-wide font-medium">{formData.name}</span>
                <span className="text-neutral-600 font-sans tracking-wide text-[10px]">{formData.address}, {formData.city}</span>
              </div>

              {/* Items Table */}
              <div className="flex flex-col gap-3 border-b border-neutral-200/60 pb-4">
                <span className="text-bronze-gold text-[8px] font-sans uppercase tracking-widest font-bold">Heirloom Details:</span>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-neutral-500 uppercase text-[8px] font-sans font-bold">
                    <span>SPECIFICATION</span>
                    <span>VALUATION</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {/* Generates serial IDs and spec tables */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-neutral-800 uppercase text-[11px] font-sans">Bespoke Orfèvre Composition</span>
                        <span className="text-neutral-500 text-[8px] uppercase">Registered Serial: LUX-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      <span className="text-neutral-900 font-bold">${grandTotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stamp / Print action */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex flex-col text-[8px] text-neutral-500 uppercase font-sans">
                  <span>Certified Genuine Metallurgy</span>
                  <span className="text-bronze-gold font-bold">100% Authentic France Guild</span>
                </div>
                
                {/* Simulated signature */}
                <div className="flex flex-col items-end italic font-serif text-neutral-600 pr-2">
                  <span className="text-xs">Sébastien</span>
                  <span className="text-[7px] font-sans font-normal uppercase text-neutral-500 tracking-widest mt-0.5">Atelier Sommelier</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-sm mt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 border border-neutral-300 rounded-xl text-[10px] font-sans tracking-wider text-neutral-800 hover:text-black uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.05)] hover:from-white hover:to-neutral-50 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-600" />
                <span>Print Certificate</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white rounded-xl text-[10px] font-sans tracking-wider font-bold uppercase transition-all duration-300 border border-neutral-950/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.45)] hover:from-neutral-700 hover:via-neutral-900 hover:to-neutral-950 hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_6px_20px_rgba(0,0,0,0.55)] active:scale-[0.98] cursor-pointer"
              >
                Return to Atelier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
