import { Mail, Phone, Clock } from "lucide-react";
import { useT } from "@/hooks/useLang";

const Contact = () => {
  const t = useT();
  const contactInfo = [
    {
      icon: Mail,
      title: t("Email", "ईमेल"),
      value: "support@astromate.online",
      subtitle: "",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500"
    },
    {
      icon: Phone,
      title: t("Phone", "फोन"),
      value: "+91 98765 43210",
      subtitle: t("6 AM to 12 midnight", "सुबह 6 बजे से रात 12 बजे"),
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500"
    },
    {
      icon: Clock,
      title: t("Hours", "समय"),
      value: t("Available 24/7", "24/7 उपलब्ध"),
      subtitle: t("Open every day", "सभी दिन खुला"),
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500"
    }
  ];

  return (
    <section id="contact" className="py-10">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary via-indigo-600 to-primary py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("Contact Us", "संपर्क करें")}
          </h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            {t("We're always here to help. Reach out to us with any questions.", "हम आपकी सेवा के लिए हमेशा तैयार हैं। किसी भी प्रश्न के लिए हमसे संपर्क करें।")}
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 ${info.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <info.icon className={`w-8 h-8 ${info.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {info.title}
              </h3>
              <p className="text-primary font-medium text-lg">
                {info.value}
              </p>
              {info.subtitle && (
                <p className="text-muted-foreground text-sm mt-1">
                  {info.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
