import { Mail, Phone, MapPin, Youtube, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { SUPPORT_PHONE, SUPPORT_TEL } from "@/components/LegalPage";
import { useT } from "@/hooks/useLang";
import logoIconWhite from "@/assets/logo-icon-white.png";
import logoTextWhite from "@/assets/logo-text-white.png";

const quickLinks = [
  { name: "होम", nameEn: "Home", href: "/" },
  { name: "पूजा सेवाएं", nameEn: "Pooja Services", href: "/#pooja" },
  { name: "मंत्र जाप", nameEn: "Mantra Jaap", href: "/#mantra-jaap" },
  { name: "उत्पाद", nameEn: "Products", href: "/#products" },
  { name: "राशिफल", nameEn: "Horoscope", href: "/#zodiac" },
  { name: "हमारे बारे में", nameEn: "About Us", href: "/#about" },
];

const serviceLinks = [
  { name: "कुंडली विश्लेषण", nameEn: "Kundli Analysis", href: "/free-kundli" },
  { name: "न्यूमेरोलॉजी", nameEn: "Numerology", href: "/numerology" },
  { name: "Lo Shu Grid Calculator", nameEn: "Lo Shu Grid Calculator", href: "/loshu-grid" },
  { name: "सेवाएं", nameEn: "Services", href: "/#services" },
  { name: "वास्तु शास्त्र", nameEn: "Vastu Shastra", href: "/#services" },
];

const legalLinks = [
  { name: "गोपनीयता नीति", nameEn: "Privacy Policy", href: "/privacy-policy" },
  { name: "नियम और शर्तें", nameEn: "Terms of Use", href: "/terms-of-service" },
  { name: "अस्वीकरण", nameEn: "Disclaimer", href: "/disclaimer" },
  { name: "ज्योतिषी शर्तें", nameEn: "Astrologer Terms", href: "/astrologer-terms" },
  { name: "रिफंड नीति", nameEn: "Refund & Cancellation", href: "/refund-policy" },
  { name: "शिपिंग नीति", nameEn: "Shipping & Delivery", href: "/shipping-policy" },
  { name: "कुकी नीति", nameEn: "Cookie Policy", href: "/cookie-policy" },
  { name: "संपर्क करें", nameEn: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@astromate", color: "hover:text-rating" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/astromate", color: "hover:text-rating" },
  { name: "X (Twitter)", icon: Twitter, href: "https://x.com/astromate", color: "hover:text-rating" },
];

const Footer = () => {
  const t = useT();
  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoIconWhite} alt="Astromate Logo" className="h-10 w-10" />
              <img src={logoTextWhite} alt="Astromate" className="h-6" />
            </div>
            <p className="text-white/70 text-sm">
              {t(
                "India's most trusted astrology platform. Guide your life through Vedic astrology.",
                "भारत का सबसे भरोसेमंद ज्योतिष मंच। वैदिक ज्योतिष के माध्यम से आपके जीवन को दिशा दें।",
              )}
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/70 ${social.color} transition-colors`}
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-rating">{t("Quick Links", "त्वरित लिंक")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white/70 hover:text-rating transition-colors text-sm"
                  >
                    {t(link.nameEn, link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-rating">{t("Services", "सेवाएं")}</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white/70 hover:text-rating transition-colors text-sm"
                  >
                    {t(link.nameEn, link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-rating">{t("Contact Us", "संपर्क करें")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>support@astromate.online</span>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href={SUPPORT_TEL} className="font-semibold text-rating hover:underline">{SUPPORT_PHONE}</a>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Near- DAV Nageswar Public School,<br />
                  Tetri, Chandaghasi,<br />
                  Ranchi-834010, Jharkhand
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Astromate (Powered by NAAMRE SERVICES (OPC) PRIVATE LIMITED). All Rights Reserved
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-white/60 hover:text-rating text-sm transition-colors"
              >
                {t(link.nameEn, link.name)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
