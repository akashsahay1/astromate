import { Shield, Users, Clock, Target } from "lucide-react";
import vineetPortrait from "@/assets/dr-vineet-awasthi.webp";
import { useT } from "@/hooks/useLang";

const features = [
  {
    icon: Shield,
    title: "100% गोपनीयता",
    titleEn: "100% Privacy",
    description: "आपकी व्यक्तिगत जानकारी पूर्णतः सुरक्षित",
    descriptionEn: "Your personal details stay completely secure",
  },
  {
    icon: Users,
    title: "प्रमाणित ज्योतिषी",
    titleEn: "Verified Astrologers",
    description: "अनुभवी और सत्यापित विशेषज्ञों की टीम",
    descriptionEn: "A team of experienced, verified experts",
  },
  {
    icon: Clock,
    title: "24/7 उपलब्ध",
    titleEn: "Available 24/7",
    description: "कभी भी, कहीं से भी परामर्श लें",
    descriptionEn: "Consult anytime, from anywhere",
  },
  {
    icon: Target,
    title: "सटीक भविष्यवाणी",
    titleEn: "Accurate Predictions",
    description: "95% सटीकता के साथ भविष्यफल",
    descriptionEn: "Predictions with 95% accuracy",
  },
];

const WhyChooseUs = () => {
  const t = useT();
  return (
    <section className="py-10 lg:py-14 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              {t("Why Choose Us?", "हमें क्यों चुनें?")}
            </h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="flex gap-4 items-start"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t(feature.titleEn, feature.title)}</h3>
                    <p className="text-muted-foreground">{t(feature.descriptionEn, feature.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-xl"></div>
              <img
                src={vineetPortrait}
                alt={t("Dr. Vineet Awasthi", "डॉ. विनीत अवस्थी")}
                className="relative rounded-3xl shadow-xl w-full max-w-sm mx-auto object-cover aspect-[4/5]"
              />
              {/* Floating Card */}
              <div className="absolute bottom-6 left-0 right-0 mx-auto w-[90%] bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{t("Dr. Vineet Awasthi", "डॉ. विनीत अवस्थी")}</div>
                    <div className="text-sm text-muted-foreground">{t("Vedic Astrology Acharya", "वेदिक ज्योतिषाचार्य")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
