import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  SACRED_STORE_PRODUCTS,
  STORE_CATEGORIES,
} from '../data/storeData';
import type { StoreProduct, StoreCategory } from '../types';
import { TraditionVisual } from './ReligiousVisuals';
import {
  ShoppingBag,
  Search,
  Check,
  Star,
  Shield,
  BookOpen,
  CreditCard,
  Lock,
  X,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  Crown,
  GraduationCap,
} from 'lucide-react';

const TRADITION_FILTERS = [
  { id: 'christianity', label: 'Christianity', name: 'Christianity' },
  { id: 'islam', label: 'Islam', name: 'Islam' },
  { id: 'judaism', label: 'Judaism', name: 'Judaism' },
  { id: 'hinduism', label: 'Hinduism', name: 'Hinduism' },
  { id: 'buddhism', label: 'Buddhism', name: 'Buddhism' },
];

export const StoreView: React.FC = () => {
  const {
    hearthTone,
    userProfile,
    account,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    setActiveTab,
  } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  // Map user's primary tradition to store filter
  const mapUserTraditionToStore = (trad: string): 'christianity' | 'islam' | 'judaism' | 'hinduism' | 'buddhism' => {
    const s = trad.toLowerCase();
    if (s.includes('islam') || s.includes('muslim') || s.includes('sufi')) return 'islam';
    if (s.includes('juda') || s.includes('jew') || s.includes('torah')) return 'judaism';
    if (s.includes('hindu') || s.includes('vedan') || s.includes('gita')) return 'hinduism';
    if (s.includes('buddh') || s.includes('dharma') || s.includes('zen')) return 'buddhism';
    return 'christianity';
  };

  const [activeTradition, setActiveTradition] = useState<'christianity' | 'islam' | 'judaism' | 'hinduism' | 'buddhism'>(
    () => mapUserTraditionToStore(userProfile.primaryTradition)
  );

  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Filter products by selected tradition, category, and search query
  const filteredProducts = SACRED_STORE_PRODUCTS.filter((prod) => {
    const matchesTradition = prod.traditionId === activeTradition;
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTradition && matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isPilgrim = account.subscriptionTier === 'pilgrim' || account.subscriptionTier === 'congregation';

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = isPilgrim ? item.product.pilgrimPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setIsCheckoutModalOpen(false);
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* 1. Header Banner & Sacred Separation Directives */}
      <div
        className="p-6 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at top right, ${currentTone.glow} 0%, rgba(28, 25, 23, 0.95) 70%)`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border"
                style={{
                  borderColor: currentTone.primary,
                  background: currentTone.lightBg,
                  color: currentTone.primary,
                }}
              >
                Sacred Sanctuary Commerce & Study Materials
              </span>
              <span className="flex items-center gap-1 text-[11px] text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-full border border-stone-800">
                <Shield className="w-3 h-3 text-emerald-400" />
                Zero Commercial Trackers
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-stone-100 font-normal">
              Sacred Offerings & Prayer Class Resources
            </h1>
            <p className="text-stone-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Strictly segmented by faith tradition. Each religion is sovereign and sacred; materials are presented with reverence and zero unsolicited cross-marketing or theological mixing.
            </p>
          </div>

          {/* Cart Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900/90 border border-stone-700/80 hover:border-stone-500 text-stone-100 shadow-md transition"
              aria-label={`Open shopping cart with ${cartTotalItems} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-stone-300" />
                {cartTotalItems > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-stone-950"
                    style={{ backgroundColor: currentTone.primary }}
                  >
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <div className="text-left text-xs">
                <div className="font-medium text-stone-200">Cart</div>
                <div className="text-stone-400">${cartSubtotal.toFixed(2)}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Sustaining Pilgrim Discount Alert */}
        <div className="mt-5 p-3 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <Crown className="w-4 h-4" style={{ color: currentTone.primary }} />
            <span>
              {isPilgrim ? (
                <>
                  <strong className="text-stone-100 font-semibold">Sustaining Pilgrim Status Active:</strong> 15% discount applied across all sacred texts and prayer aids.
                </>
              ) : (
                <>
                  <strong className="text-stone-100 font-semibold">Sustaining Pilgrim Benefit:</strong> Enjoy 15% off all study Bibles, class workbooks, and prayer aids.
                </>
              )}
            </span>
          </div>
          {!isPilgrim && (
            <button
              onClick={() => setActiveTab('subscription')}
              className="px-3 py-1 rounded-xl text-xs font-medium text-stone-950 shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: currentTone.primary }}
            >
              Explore Patronage Plans
            </button>
          )}
        </div>
      </div>

      {/* 2. Faith Tradition Selector (Zero Cross-Contamination Guard) */}
      <div className="bg-stone-900/60 p-4 rounded-3xl border border-stone-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-medium text-stone-400 tracking-wider uppercase text-[11px]">
            Active Tradition Storefront (Showing Only Relevant Offerings)
          </span>
          <span className="text-stone-500">
            Personalized to: <strong className="text-stone-300">{userProfile.primaryTradition}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TRADITION_FILTERS.map((trad) => {
            const isSelected = activeTradition === trad.id;
            return (
              <button
                key={trad.id}
                onClick={() => setActiveTradition(trad.id as typeof activeTradition)}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-stone-800/90 shadow-sm'
                    : 'bg-stone-950/40 border-stone-800/80 hover:bg-stone-900/60'
                }`}
                style={{
                  borderColor: isSelected ? currentTone.primary : undefined,
                }}
              >
                <TraditionVisual tradition={trad.name} size={22} />
                <div className="min-w-0">
                  <div
                    className="text-xs font-medium truncate"
                    style={{ color: isSelected ? currentTone.primary : '#E7E5E4' }}
                  >
                    {trad.label}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {isSelected ? 'Active Store' : 'View Catalog'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTradition} study bibles, prayer workbooks, altar items...`}
            className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-stone-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-xl border whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-stone-800 text-stone-100 font-medium'
                : 'bg-stone-900/60 border-stone-800/80 text-stone-400 hover:text-stone-200'
            }`}
            style={{
              borderColor: selectedCategory === 'all' ? currentTone.primary : undefined,
            }}
          >
            All Sacred Items ({filteredProducts.length})
          </button>
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl border whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-stone-800 text-stone-100 font-medium'
                  : 'bg-stone-900/60 border-stone-800/80 text-stone-400 hover:text-stone-200'
              }`}
              style={{
                borderColor: selectedCategory === cat.id ? currentTone.primary : undefined,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const displayPrice = isPilgrim ? product.pilgrimPrice : product.price;

          return (
            <div
              key={product.id}
              className="bg-stone-900/70 rounded-3xl border border-stone-800 p-5 flex flex-col justify-between hover:border-stone-700 transition shadow-sm hover:shadow-md group"
            >
              <div>
                {/* Header tag & rating */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-2xl">{product.iconEmoji}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-stone-200 text-xs">
                      {product.rating.toFixed(2)}
                    </span>
                    <span className="text-stone-500 text-[10px]">({product.reviewCount})</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-serif text-stone-100 font-medium text-base group-hover:text-amber-200 transition">
                  {product.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-1">{product.subtitle}</p>

                {/* Description */}
                <p className="text-xs text-stone-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Class association badge if applicable */}
                {product.associatedStudyClass && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-950/70 border border-stone-800 text-[11px] text-stone-300">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">Companion for: {product.associatedStudyClass}</span>
                  </div>
                )}
              </div>

              {/* Footer with Price and Actions */}
              <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-lg text-stone-100 font-medium">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {isPilgrim && (
                      <span className="text-xs text-stone-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500">{product.supplierName}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 text-stone-400 hover:text-stone-200 rounded-xl hover:bg-stone-800 text-xs transition"
                    title="View details & liturgical concordance"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-950 shadow-sm transition flex items-center gap-1.5 hover:opacity-90"
                    style={{ backgroundColor: currentTone.primary }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-stone-900/30 border border-stone-800 space-y-3">
          <BookOpen className="w-8 h-8 text-stone-600 mx-auto" />
          <h3 className="font-serif text-stone-300 font-medium text-lg">No Items Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            No products matched your search or category filter in {activeTradition}. Try clearing the search or exploring all categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl text-xs border border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 5. Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedProduct.iconEmoji}</span>
                <div>
                  <h2 className="font-serif text-xl text-stone-100 font-medium">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xs text-stone-400">{selectedProduct.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-300">
              <p className="text-sm leading-relaxed text-stone-200">{selectedProduct.description}</p>

              <div>
                <h4 className="font-medium text-stone-300 uppercase tracking-wider text-[11px] mb-2">
                  Craftsmanship & Liturgical Specifications
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-stone-400">
                  {selectedProduct.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              {selectedProduct.associatedStudyClass && (
                <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4" style={{ color: currentTone.primary }} />
                    <div>
                      <div className="font-medium text-stone-200">
                        Official Prayer Class Companion
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {selectedProduct.associatedStudyClass}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setActiveTab('churches');
                    }}
                    className="text-[11px] text-stone-300 hover:underline flex items-center gap-1"
                  >
                    View Class Schedule <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Supplier & Ethics Box */}
              <div className="p-3.5 rounded-2xl bg-stone-950/40 border border-stone-800/80 text-[11px] text-stone-400 space-y-1">
                <div>
                  <strong className="text-stone-300">Ethical Fulfillment Partner:</strong>{' '}
                  {selectedProduct.supplierName} (SKU: {selectedProduct.sku})
                </div>
                <div>
                  <strong className="text-stone-300">Sanctuary Privacy:</strong> No customer data or spiritual interests are shared with third-party advertisers.
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-stone-800 flex items-center justify-between bg-stone-950/60">
              <div>
                <div className="text-xs text-stone-400">Sacred Offering Price</div>
                <div className="font-serif text-xl text-stone-100 font-medium">
                  ${(isPilgrim ? selectedProduct.pilgrimPrice : selectedProduct.price).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
                className="py-2.5 px-6 rounded-xl font-medium text-stone-950 text-xs shadow-md transition flex items-center gap-2"
                style={{ backgroundColor: currentTone.primary }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Sanctuary Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Shopping Cart Drawer */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-stone-300" />
                <h3 className="font-serif text-lg text-stone-100 font-medium">
                  Sanctuary Cart ({cartTotalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-stone-600 mx-auto" />
                  <p className="text-stone-400 text-xs">Your sanctuary cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs border border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700 transition"
                  >
                    Browse Sacred Store
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const itemPrice = isPilgrim ? item.product.pilgrimPrice : item.product.price;
                  return (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-start gap-3"
                    >
                      <span className="text-2xl mt-0.5">{item.product.iconEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-stone-200 text-xs truncate">
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          ${itemPrice.toFixed(2)} each
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border border-stone-800 rounded-lg overflow-hidden bg-stone-900">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs text-stone-200 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-500 hover:text-rose-400 transition text-[11px] flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="font-serif text-xs text-stone-200 font-medium">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-800 bg-stone-950/60 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span className="text-stone-200 font-medium">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Sacred Delivery Shipping</span>
                    <span className="text-emerald-400 font-medium">Free</span>
                  </div>
                  {isPilgrim && (
                    <div className="flex justify-between text-amber-400 text-[11px]">
                      <span>Sustaining Pilgrim 15% Savings</span>
                      <span>Included</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-100 font-serif text-sm pt-2 border-t border-stone-800/80">
                    <span>Total</span>
                    <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3 rounded-xl font-medium text-stone-950 text-xs shadow-md transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: currentTone.primary }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Sovereign Checkout</span>
                </button>

                <div className="text-[10px] text-stone-500 text-center flex items-center justify-center gap-1.5 pt-1">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>Zero commercial profiling • HIPAA PHI Shield Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Sovereign Simulated Checkout Modal */}
      {isCheckoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" style={{ color: currentTone.primary }} />
                <h3 className="font-serif text-lg text-stone-100 font-medium">
                  Sovereign Secure Checkout
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-800/80 bg-emerald-950/60"
                >
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg text-stone-100 font-medium">
                  Order Successfully Placed
                </h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  A confirmation receipt and fulfillment tracking link have been dispatched to {account.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Delivering To</label>
                  <input
                    type="text"
                    required
                    defaultValue={account.displayName}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-200 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Shipping Sanctuary Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Peace Way, City, State, ZIP"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-200 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <div className="flex justify-between text-stone-300 font-medium">
                    <span>Order Total ({cartTotalItems} items)</span>
                    <span className="font-serif text-sm">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Fulfillment handled via verified ethical guild partners. Payment tokens are processed with zero tracking telemetry.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-medium text-stone-950 shadow-md transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: currentTone.primary }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm Order (${cartSubtotal.toFixed(2)})</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
