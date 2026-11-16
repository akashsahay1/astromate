import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/hooks/useLang";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text.png";
import langIcon from "@/assets/lang-icon.png";
import loginIcon from "@/assets/login-icon.png";

type NavItem = {
  name: string;
  nameEn: string;
  href?: string;
  children?: { name: string; nameEn: string; href: string }[];
};

const navLinks: NavItem[] = [
  { name: "ज्योतिषी", nameEn: "Astrologers", href: "/astrologers" },
  {
    name: "सेवाएं",
    nameEn: "Services",
    children: [
      { name: "पूजा सेवाएं", nameEn: "Pooja Services", href: "/pooja-services" },
      { name: "वेद मंत्र जाप", nameEn: "Ved Mantra Jaap", href: "/ved-mantra" },
      { name: "मूल्य योजना", nameEn: "Pricing Plans", href: "/pricing" },
      { name: "ज्योतिष ज्ञान", nameEn: "About Astrology", href: "/about-astrology" },
    ],
  },
  {
    name: "राशिफल",
    nameEn: "Horoscope",
    children: [
      { name: "राशिफल", nameEn: "Horoscope", href: "/horoscope" },
      { name: "नक्षत्र", nameEn: "Nakshatra", href: "/nakshatra" },
      { name: "पंचांग", nameEn: "Panchang", href: "/panchang" },
    ],
  },
  {
    name: "टूल्स",
    nameEn: "Tools",
    children: [
      { name: "फ्री कुंडली", nameEn: "Free Kundli", href: "/free-kundli" },
      { name: "लव कैलकुलेटर", nameEn: "Love Calculator", href: "/love-calculator" },
      { name: "मोबाइल न्यूमेरोलॉजी", nameEn: "Mobile Numerology", href: "/numerology" },
      { name: "लो शू ग्रिड", nameEn: "Lo Shu Grid", href: "/loshu-grid" },
      { name: "लकी नंबर", nameEn: "Lucky Number", href: "/lucky-number" },
    ],
  },
  { name: "ब्लॉग", nameEn: "Blog", href: "/blog" },
  { name: "शॉप", nameEn: "Shop", href: "/shop" },
];


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang: language, setLang: setLanguage } = useLang();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const avatarUrl = "";
  const displayName = user?.email ?? "";



  const AvatarBadge = ({ size = "h-7 w-7" }: { size?: string }) =>
    avatarUrl ? (
      <img src={avatarUrl} alt={language === "hi" ? "प्रोफाइल फोटो" : "Profile photo"} className={`${size} rounded-full object-cover border border-border`} />
    ) : (
      <span className={`${size} rounded-full bg-primary/10 flex items-center justify-center`}>
        <User className="h-4 w-4 text-primary" />
      </span>
    );


  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi");
  };

  const handleJoinAstrologer = () => {
    setIsOpen(false);
    navigate("/auth?role=astrologer");
  };


  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      if (window.location.pathname === "/") {
        const element = document.querySelector(href.replace("/", ""));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoIcon} alt="Astromate Logo" className="h-10 w-auto object-contain" />
            <img src={logoText} alt="Astromate" className="h-8 hidden sm:block" />
          </Link>

          <div className="hidden xl:flex items-center gap-5 whitespace-nowrap">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.name} className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                    {language === "hi" ? link.name : link.nameEn}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-0 top-full z-50 min-w-[220px] rounded-xl border border-border bg-card p-2 shadow-lg">
                    {link.children.map((child) => (
                      <button
                        key={child.href}
                        onClick={() => handleNavClick(child.href)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      >
                        {language === "hi" ? child.name : child.nameEn}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href!)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === "hi" ? link.name : link.nameEn}
                </button>
              )
            )}
          </div>


          <div className="hidden xl:flex items-center gap-4 shrink-0 whitespace-nowrap">
            <button 
              onClick={toggleLanguage}
              title={language === "hi" ? "Switch to English" : "हिंदी में बदलें"}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <img src={langIcon} alt="Language" className="h-7 w-7 rounded-full object-contain" />
              <span>{language === "hi" ? "English" : "हिंदी"}</span>
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  title={language === "hi" ? "मेरा प्रोफाइल" : "My Profile"}
                  className="flex items-center gap-2 bg-secondary rounded-full pl-1 pr-3 py-1 hover:bg-secondary/70 transition-colors"
                >
                  <AvatarBadge />
                  <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                    {displayName || user.email?.split("@")[0]}
                  </span>
                </button>

                <Button variant="destructive" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                title={language === "hi" ? "लॉगिन" : "Login"}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <img src={loginIcon} alt="Login" className="h-7 w-7 rounded-full object-contain" />
                <span>{language === "hi" ? "लॉगिन" : "Login"}</span>
              </button>
            )}



            {!user && (
              <button
                onClick={handleJoinAstrologer}
                className="flex items-center gap-1.5 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground hover:bg-cta-hover transition-colors"
              >
                {language === "hi" ? "ज्योतिषी बनें" : "Join as Astrologer"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>


          <button className="xl:hidden p-2" aria-label="Menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="xl:hidden py-4 border-t border-border max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.name} className="px-2">
                    <div className="py-1 text-sm font-bold text-foreground">
                      {language === "hi" ? link.name : link.nameEn}
                    </div>
                    <div className="flex flex-col gap-1 border-l border-border pl-3">
                      {link.children.map((child) => (
                        <button
                          key={child.href}
                          onClick={() => handleNavClick(child.href)}
                          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1 text-left"
                        >
                          {language === "hi" ? child.name : child.nameEn}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href!)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 text-left"
                  >
                    {language === "hi" ? link.name : link.nameEn}
                  </button>
                )
              )}

              <div className="flex items-center gap-2 px-2 py-2">
                <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <img src={langIcon} alt="Language" className="h-7 w-7 rounded-full object-contain" />
                  {language === "hi" ? "English" : "हिंदी"}
                </button>
              </div>
              {user ? (
                <div className="flex items-center justify-between px-2 py-2">
                  <button onClick={() => { setIsOpen(false); navigate("/profile"); }} className="flex items-center gap-2">
                    <AvatarBadge />
                    <span className="text-sm font-medium">{displayName || user.email?.split("@")[0]}</span>
                  </button>

                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" /> Logout
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsOpen(false); navigate("/auth"); }}
                  className="mt-2 flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <img src={loginIcon} alt="Login" className="h-7 w-7 rounded-full object-contain" />
                  {language === "hi" ? "लॉगिन / साइन अप" : "Login / Sign Up"}
                </button>

              )}
              {!user && (
                <button
                  onClick={handleJoinAstrologer}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta-hover"
                >
                  {language === "hi" ? "ज्योतिषी बनें" : "Join as Astrologer"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
