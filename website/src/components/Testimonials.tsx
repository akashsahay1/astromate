import { Star } from "lucide-react";
import { useTestimonials, useSiteContent } from "@/hooks/useSupabaseData";
import { usePick, useT } from "@/hooks/useLang";

const fallbackTestimonials = [
  {
    name: "रोहित मेहरा",
    name_en: "Rohit Mehra",
    location: "मस्कट, ओमान",
    location_en: "Muscat, Oman",
    text_en: "This app doesn't just give daily horoscopes — it also helps me work through personal and professional dilemmas. A truly useful experience.",
    text: "यह ऐप न सिर्फ़ रोज़ाना राशिफल देता है, बल्कि मेरी निजी और पेशेवर उलझनों को सुलझाने में भी मदद करता है। बेहद उपयोगी अनुभव रहा।",
  },
  {
    name: "स्नेहा कपूर",
    name_en: "Sneha Kapoor",
    location: "न्यू जर्सी, यूएसए",
    location_en: "New Jersey, USA",
    text_en: "I tried it a few months ago and was impressed from the very first answer. The way everything was explained was truly commendable.",
    text: "कुछ महीने पहले मैंने इसे आज़माया और पहले ही जवाब से प्रभावित हो गई। जिस तरह से बात समझाई गई वो वाकई सराहनीय थी।",
  },
  {
    name: "अमित देशपांडे",
    name_en: "Amit Deshpande",
    location: "सिडनी, ऑस्ट्रेलिया",
    location_en: "Sydney, Australia",
    text_en: "Whether it's online Pooja, gemstone consultation or palmistry — every service left me satisfied. The experts are genuinely knowledgeable and trustworthy.",
    text: "ऑनलाइन पूजा हो, रत्न परामर्श या हस्तरेखा — हर सेवा में संतुष्टि मिली। विशेषज्ञ सच में जानकार और भरोसेमंद हैं।",
  },
];

const Testimonials = () => {
  const { data } = useTestimonials();
  const { content } = useSiteContent();
  const t = useT();
  const pick = usePick();
  const testimonials = data.length > 0 ? data : fallbackTestimonials;
  const eyebrow = content.testimonials_eyebrow || t("What People Say", "लोग क्या कहते हैं");
  const heading = content.testimonials_heading || t("Real Stories", "असली सच");

  return (
    <section className="py-10 lg:py-14 bg-[linear-gradient(135deg,hsl(243_47%_15%)_0%,hsl(243_50%_25%)_100%)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground">
            {heading}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((r) => (
            <div
              key={r.id || r.name + r.location}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--hero-gold-light)),hsl(var(--hero-gold)))] flex items-center justify-center text-[hsl(var(--hero-dark-brown))] font-bold">
                  {String(pick(r, "name") ?? "").charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-primary-foreground">{pick(r, "name")}</div>
                  <div className="text-xs text-primary-foreground/60">{pick(r, "location")}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-rating text-rating"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-primary-foreground/80 leading-relaxed">
                “{pick(r, "text")}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
