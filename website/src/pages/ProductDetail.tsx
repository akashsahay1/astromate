import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Check, Star, ShoppingCart } from "lucide-react";
import { fetchSite } from "@/hooks/useSupabaseData";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useAuth } from "@/hooks/useAuth";
import { usePick, useT } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startBooking } = useBookingFlow();
  const t = useT();
  const pick = usePick();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchSite("products", id)
      .catch(() => null)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#171452] mb-4">{t("Product not found", "उत्पाद नहीं मिला")}</h2>
          <button onClick={() => navigate("/shop")} className="text-[#171452] underline">{t("Go back", "वापस जाएं")}</button>
        </div>
      </div>
    );
  }

  const buy = () => {
    if (!user) { navigate("/auth"); return; }
    startBooking({
      serviceType: "product",
      serviceId: product.id,
      serviceName: pick(product, "name"),
      amount: Number(product.price),
      packageName: pick(product, "category") || "Shop",
    });
  };

  const discount =
    product.original_price > product.price
      ? `${Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF`
      : null;

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[#171452] text-sm font-semibold py-3 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("Go back", "वापस जाएं")}
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* LEFT */}
        <div>
          <div className="relative rounded-2xl overflow-hidden h-[280px] lg:h-[340px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-end">
            {product.image_url ? (
              <img src={product.image_url} alt={pick(product, "name")} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-7xl opacity-30">🛍️</span></div>
            )}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white text-sm font-bold">
                Astro<span className="text-[#F5D78E]">mate</span>
              </span>
            </div>
            <div className="relative z-10 p-6 lg:p-7 bg-gradient-to-t from-black/85 via-black/30 to-transparent w-full">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#FFD700] leading-tight drop-shadow-lg">{pick(product, "name")}</h1>
              <p className="text-white/90 text-sm mt-1.5">{pick(product, "badge") || pick(product, "category")}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("About this product", "उत्पाद के बारे में")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pick(product, "description")}</p>
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("Product details", "उत्पाद विवरण")}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Category", "श्रेणी")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{pick(product, "category")}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Rating", "रेटिंग")}</p>
                  <p className="font-bold text-sm text-[#2C1010] flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-rating text-rating" /> {product.rating}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Sales", "बिक्री")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{t(`${product.sold_count}+ sold`, `${product.sold_count}+ बिके`)}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Stock", "स्टॉक")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{product.stock > 0 ? t(`${product.stock} available`, `${product.stock} उपलब्ध`) : t("Available", "उपलब्ध")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("What you get", "आपको क्या मिलेगा")}</h3>
              <div className="space-y-2">
                {[
                  t("Certified and energised product", "प्रमाणित एवं अभिमंत्रित उत्पाद"),
                  t("Prana-pratishtha by Panditji", "पंडितजी द्वारा प्राण-प्रतिष्ठा"),
                  t("Safely packed, delivered to your door", "सुरक्षित पैकिंग के साथ घर तक डिलीवरी"),
                  t("Usage guide", "उपयोग विधि गाइड"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)] shadow-md sticky top-5">
            <h3 className="text-lg font-bold text-[#2C1010] mb-3.5">{t("Buy now", "अभी खरीदें")}</h3>

            <div className="bg-[#FFF8E7] rounded-[10px] p-3.5 mb-4">
              <h4 className="text-[0.82rem] font-bold text-[#2C1010] mb-2">{t("Your order includes:", "ऑर्डर में शामिल:")}</h4>
              <div className="space-y-1.5">
                {[t("Energised product", "अभिमंत्रित उत्पाद"), t("Certificate", "प्रमाणपत्र"), t("Free delivery", "फ्री डिलीवरी")].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600 flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-[#171452] bg-[#FFF5F5] rounded-xl p-4 mb-4">
              {discount && (
                <span className="inline-block bg-orange-50 text-[#FF6B1A] text-[0.72rem] font-bold px-2 py-0.5 rounded-[10px] border border-orange-200 mb-1.5">
                  {discount}
                </span>
              )}
              <span className="float-right font-bold text-lg text-[#2C1010]">₹{Number(product.price).toLocaleString()}</span>
              <span className="font-bold text-sm text-[#171452] block clear-both">{pick(product, "name")}</span>
              {product.original_price > 0 && (
                <span className="text-[0.78rem] text-muted-foreground mt-0.5 block line-through">₹{Number(product.original_price).toLocaleString()}</span>
              )}
            </div>

            <button
              onClick={buy}
              className="w-full flex items-center justify-center gap-2 bg-cta text-cta-foreground py-3.5 rounded-[10px] text-[0.95rem] font-bold hover:bg-cta-hover transition-colors mt-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {user ? t("Buy now", "अभी खरीदें") : t("Log in to buy", "लॉगिन करके खरीदें")}
            </button>
          </div>

          <div className="bg-white rounded-[14px] p-4 border border-[hsl(40,50%,85%)] shadow-sm">
            <h4 className="text-[0.95rem] font-bold mb-2.5">{t("Need help?", "सहायता चाहिए?")}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> +91 98765 43210</div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><MessageCircle className="h-4 w-4" /> {t("Chat on WhatsApp", "WhatsApp पर चैट करें")}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
