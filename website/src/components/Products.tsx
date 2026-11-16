import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/hooks/useLang";
import { useToast } from "@/hooks/use-toast";
import { cart, useShopProducts, useProductText, type Product } from "@/lib/cart";

const Products = () => {
  const { data: products = [], isLoading: loading, isError, refetch } = useShopProducts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = useT();
  const text = useProductText();

  const add = (product: Product) => {
    cart.add(product.product_id);
    toast({ title: t("Added to cart", "कार्ट में जोड़ा गया"), description: text(product, "name") });
  };
  const buy = (product: Product) => {
    cart.add(product.product_id);
    navigate("/cart");
  };

  if (loading || isError || products.length === 0) {
    return (
      <section id="products" className="py-8 lg:py-12 bg-[#FDF6E3]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-muted-foreground">
          {loading ? t("Loading...", "लोड हो रहा है...") : isError ? (
            <>{t("Could not load products.", "उत्पाद लोड नहीं हो सके।")}{" "}
              <button onClick={() => refetch()} className="underline text-[#1A1A1A]">{t("Try again", "फिर से कोशिश करें")}</button></>
          ) : t("No products yet.", "अभी कोई उत्पाद नहीं है।")}
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1.5">
          {t("Shop", "शॉप")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Browse our collection of special products", "हमारे विशेष उत्पादों का संग्रह देखें")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => {
            const original = Number(product.original_price) || 0;
            const discount = original > product.price
              ? `${Math.round(((original - product.price) / original) * 100)}% OFF`
              : null;
            const soldOut = product.stock_quantity <= 0;

            return (
              <div
                key={product.product_id}
                onClick={() => navigate(`/shop/${product.product_id}`)}
                className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-[150px] overflow-hidden">
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
                    Astromate
                  </span>
                  {Number(product.rating) > 0 && (
                    <Badge className="absolute top-2 right-2 bg-white/90 text-foreground hover:bg-white z-10 text-[10px]">
                      <Star className="h-3 w-3 fill-rating text-rating mr-0.5" />
                      {product.rating}
                    </Badge>
                  )}
                  {product.featured_image ? (
                    <img src={product.featured_image} alt={text(product, "name")} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-100 flex items-center justify-center">
                      <span className="text-4xl">🛍️</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                    <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{text(product, "name")}</p>
                    <span className="text-white/80 text-[0.62rem] block mt-0.5">{product.tags?.[0] || product.category}</span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col">
                  <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{text(product, "description")}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[#FF6B1A] font-bold text-[0.93rem] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                    {original > product.price && (
                      <span className="text-[0.7rem] text-muted-foreground line-through">₹{original.toLocaleString()}</span>
                    )}
                    {discount && (
                      <span className="text-[0.63rem] text-[hsl(355,80%,55%)] font-bold">{discount}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
                  {soldOut ? (
                    <span className="flex-1 text-center py-2 text-[0.86rem] font-semibold text-muted-foreground">{t("Out of stock", "स्टॉक में नहीं")}</span>
                  ) : (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); add(product); }}
                        title={t("Add to cart", "कार्ट में जोड़ें")}
                        aria-label={t("Add to cart", "कार्ट में जोड़ें")}
                        className="flex items-center justify-center gap-1 border border-[#1A1A1A] text-[#1A1A1A] px-2.5 py-2 rounded-lg text-[0.8rem] font-semibold hover:bg-[#1A1A1A]/5 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /><ShoppingCart className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); buy(product); }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-cta text-cta-foreground py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-cta-hover transition-colors"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {t("Buy now", "अभी खरीदें")}
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default Products;
