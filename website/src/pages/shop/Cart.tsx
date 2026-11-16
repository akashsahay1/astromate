import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useLang";
import { cart, inr, shippingFor, useCartItems, useProductText, MAX_QTY } from "@/lib/cart";

const Cart = () => {
  const t = useT();
  const text = useProductText();
  const navigate = useNavigate();
  const { items, loading, subtotal, ok } = useCartItems();
  const shipping = shippingFor(subtotal);

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar />
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl font-bold text-[#171452] mb-6">{t("Your cart", "आपका कार्ट")}</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-[14px] p-10 text-center border border-[hsl(40,50%,85%)]">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-5">{t("Your cart is empty.", "आपका कार्ट खाली है।")}</p>
            <Button asChild className="bg-cta text-cta-foreground hover:bg-cta-hover"><Link to="/shop">{t("Browse the shop", "शॉप देखें")}</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-3">
              {items.map(({ id, qty, product, error }) => {
                const max = Math.min(MAX_QTY, product?.stock_quantity ?? MAX_QTY);
                return (
                  <div key={id} className="bg-white rounded-[14px] p-3 sm:p-4 border border-[hsl(40,50%,85%)] flex gap-3 sm:gap-4">
                    <Link to={`/shop/${id}`} className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      {product?.featured_image ? <img src={product.featured_image} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl">🛍️</span>}
                    </Link>
                    <div className="flex-1 min-w-0">
                      {product ? (
                        <>
                          <Link to={`/shop/${id}`} className="font-bold text-[#171452] hover:underline line-clamp-2">{text(product, "name")}</Link>
                          <p className="text-sm text-muted-foreground">{inr(product.price)} {t("each", "प्रति")}</p>
                          {product.stock_quantity < qty && (
                            <p className="text-xs text-destructive mt-1">
                              {product.stock_quantity > 0
                                ? t(`Only ${product.stock_quantity} in stock`, `केवल ${product.stock_quantity} स्टॉक में`)
                                : t("Out of stock — please remove", "स्टॉक में नहीं — कृपया हटाएं")}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {error ? t("This product is no longer available.", "यह उत्पाद अब उपलब्ध नहीं है।") : t("Loading...", "लोड हो रहा है...")}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded-lg">
                          <button className="p-1.5 disabled:opacity-40" disabled={qty <= 1 || !product} onClick={() => cart.set(id, qty - 1)} aria-label={t("Decrease quantity", "मात्रा घटाएं")}><Minus className="h-4 w-4" /></button>
                          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
                          <button className="p-1.5 disabled:opacity-40" disabled={qty >= max || !product} onClick={() => cart.set(id, qty + 1)} aria-label={t("Increase quantity", "मात्रा बढ़ाएं")}><Plus className="h-4 w-4" /></button>
                        </div>
                        <button onClick={() => cart.remove(id)} className="p-1.5 text-muted-foreground hover:text-destructive" aria-label={t("Remove", "हटाएं")} title={t("Remove", "हटाएं")}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {product && <div className="font-bold text-[#2C1010] whitespace-nowrap">{inr(product.price * qty)}</div>}
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)] shadow-sm h-fit lg:sticky lg:top-20">
              <h2 className="font-bold text-lg text-[#2C1010] mb-3">{t("Summary", "सारांश")}</h2>
              <div className="flex justify-between text-sm mb-1"><span>{t("Subtotal", "उप-योग")}</span><span>{inr(subtotal)}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>{t("Shipping", "शिपिंग")}</span><span>{shipping ? inr(shipping) : t("Free", "फ्री")}</span></div>
              <p className="text-xs text-muted-foreground mb-4">{t("GST is added at checkout. Free shipping on orders above ₹500.", "GST चेकआउट पर जोड़ा जाएगा। ₹500 से ऊपर फ्री शिपिंग।")}</p>
              <Button className="w-full bg-cta text-cta-foreground hover:bg-cta-hover" disabled={!ok} onClick={() => navigate("/checkout")}>
                {loading ? t("Checking prices...", "कीमतें जांच रहे हैं...") : t("Proceed to checkout", "चेकआउट करें")}
              </Button>
              {!loading && !ok && <p className="text-xs text-destructive mt-2">{t("Remove unavailable items to continue.", "आगे बढ़ने के लिए अनुपलब्ध आइटम हटाएं।")}</p>}
              <Link to="/shop" className="block text-center text-sm text-[#171452] underline mt-3">{t("Continue shopping", "खरीदारी जारी रखें")}</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
