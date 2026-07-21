import React from "react";
import { CartItem } from "../types";
import { X, Trash2, Shield, Truck, Sparkles, ShoppingBag } from "lucide-react";
import { FONTS } from "../data";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onTriggerCheckout: () => void;
}

export const CartSlider: React.FC<CartSliderProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onTriggerCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.price + item.finish.priceModifier + item.flame.priceModifier;
    return acc + itemPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal > 1500 ? 0 : 45; // Premium insured carrier (DHL Express)
  const estimatedTax = subtotal * 0.08; // 8% Luxury Excise Tax
  const grandTotal = subtotal + shippingCost + estimatedTax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide drawer panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200/80 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 bg-neutral-50/50 border-b border-neutral-150 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-bronze-gold" />
              <h3 className="text-xs font-sans tracking-[0.2em] font-medium text-neutral-800 uppercase">Your Atelier Vault ({cartItems.length})</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="flex-col flex items-center justify-center h-[280px] text-center gap-3">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-200/50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h4 className="text-xs font-sans tracking-widest text-neutral-800 uppercase">Vault is Vacant</h4>
                  <p className="text-[10px] text-neutral-500 max-w-[200px] mt-1.5 leading-relaxed">Select a masterpiece from our collection to deposit it here.</p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => {
                const singlePrice = item.product.price + item.finish.priceModifier + item.flame.priceModifier;
                const activeFont = FONTS.find((f) => f.id === item.engravingFont) || FONTS[0];

                return (
                  <div 
                    key={item.id}
                    className="p-4 bg-[#FAF9F6] border border-neutral-200/60 rounded-xl flex flex-col gap-3 relative group shadow-sm"
                  >
                    {/* Item header details */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">{item.product.sku}</span>
                        <h4 className="text-xs font-serif font-medium text-neutral-900">{item.product.name}</h4>
                        <span className="text-[10px] text-bronze-gold font-sans uppercase tracking-wider">{item.finish.name}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-900 font-semibold">${singlePrice * item.quantity}</span>
                    </div>

                    {/* Meta choices summary */}
                    <div className="flex flex-col gap-1 text-[10px] text-neutral-500 border-l border-bronze-gold/30 pl-2.5 py-0.5 font-sans leading-relaxed">
                      <div>Finish: <span className="text-neutral-800 font-medium">{item.finish.name}</span></div>
                      <div>Flame System: <span className="text-neutral-800 font-medium">{item.flame.name}</span></div>
                    </div>

                    {/* Quantity controls and removal */}
                    <div className="flex items-center justify-between mt-1 pt-3 border-t border-neutral-200/40">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 bg-white hover:bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-xs text-neutral-500 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono text-neutral-800 w-4 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 bg-white hover:bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-xs text-neutral-500 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-all duration-200 cursor-pointer"
                        title="Remove piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pricing calculations footer */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-neutral-50/50 border-t border-neutral-150 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Subtotal Vault value:</span>
                  <span className="font-mono text-neutral-800">${subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Insured Express Shipping:</span>
                  <span className="font-mono text-neutral-800">{shippingCost > 0 ? `$${shippingCost}` : "Complimentary"}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Luxury Excise Tax (8%):</span>
                  <span className="font-mono text-neutral-800">${estimatedTax.toFixed(0)}</span>
                </div>
                
                <div className="h-px bg-neutral-200/60 my-1" />
                
                <div className="flex justify-between">
                  <span className="text-xs font-sans tracking-widest text-neutral-800 uppercase font-medium">Consolidated Total:</span>
                  <span className="text-sm font-mono text-[#a68226] font-bold">${grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex flex-col gap-1.5 p-3 bg-white rounded-xl border border-neutral-200/60 text-[9px] text-neutral-500 font-sans shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-bronze-gold" />
                  <span>Insured delivery via secure bonded armored courier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-bronze-gold" />
                  <span>30-Day returns & lifetime mechanical guarantee</span>
                </div>
              </div>

              <button
                onClick={onTriggerCheckout}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-sans tracking-[0.2em] text-xs font-bold rounded-xl transition-all duration-300 shadow-sm uppercase cursor-pointer"
              >
                Secure Place Vendôme Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
