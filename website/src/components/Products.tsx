import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useSupabaseData";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { usePick, useT } from "@/hooks/useLang";

const Products = () => {
  const { data: products, loading } = useProducts();
  const navigate = useNavigate();
  const { startBooking } = useBookingFlow();
  const t = useT();
  const pick = usePick();

  const buy = (product: any) => {
    startBooking({
      serviceType: "product",
      serviceId: product.id,
      serviceName: pick(product, "name"),
      amount: Number(product.price),
      packageName: pick(product, "category") || "Shop",
    });
  };


  if (loading) {
    return (
      <section id="products" className="py-8 lg:py-12 bg-[#FDF6E3]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-muted-foreground">Loading...</div>
      </section>
    );
  }

  return (
    <section id="products" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#171452] mb-1.5">
          {t("Shop", "शॉप")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Browse our collection of special products", "हमारे विशेष उत्पादों का संग्रह देखें")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => {
            const discount = product.original_price > product.price
              ? `${Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF`
              : null;

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/shop/${product.id}`)}
                className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-[150px] overflow-hidden">
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
                    Astromate
                  </span>
                  <Badge className="absolute top-2 right-2 bg-white/90 text-foreground hover:bg-white z-10 text-[10px]">
                    <Star className="h-3 w-3 fill-rating text-rating mr-0.5" />
                    {product.rating}
                  </Badge>
                  {product.image_url ? (
                    <img src={product.image_url} alt={pick(product, "name")} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-4xl">🛍️</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                    <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{pick(product, "name")}</p>
                    <span className="text-white/80 text-[0.62rem] block mt-0.5">{pick(product, "badge") || pick(product, "category")}</span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col">
                  <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{pick(product, "description")}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[#FF6B1A] font-bold text-[0.93rem] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                    {product.original_price > 0 && (
                      <span className="text-[0.7rem] text-muted-foreground line-through">₹{Number(product.original_price).toLocaleString()}</span>
                    )}
                    {discount && (
                      <span className="text-[0.63rem] text-[hsl(355,80%,55%)] font-bold">{discount}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
                  <button
                    onClick={(e) => { e.stopPropagation(); buy(product); }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-cta text-cta-foreground py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-cta-hover transition-colors"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {t("Buy now", "अभी खरीदें")}
                  </button>
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
