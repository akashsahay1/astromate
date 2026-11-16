import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, MessageSquare, Package, User, Wallet as WalletIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useLang";
import { AppCta, rupees } from "./shared";
import Profile from "./Profile";
import Wallet from "./Wallet";
import { Consultations, Orders } from "./History";

const Overview = () => {
  const t = useT();
  const { user } = useAuth();
  const quick = [
    { to: "wallet", icon: WalletIcon, label: t("Transactions", "लेन-देन") },
    { to: "consultations", icon: MessageSquare, label: t("Consultations", "परामर्श") },
    { to: "orders", icon: Package, label: t("My orders", "मेरे ऑर्डर") },
    { to: "profile", icon: User, label: t("Edit profile", "प्रोफ़ाइल बदलें") },
  ];
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-lg border flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{t("Wallet balance", "वॉलेट बैलेंस")}</p>
          <p className="text-3xl font-bold text-primary">{rupees(user?.wallet_balance)}</p>
        </div>
        <Button asChild variant="cta"><Link to="wallet">{t("Add money", "पैसे जोड़ें")}</Link></Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quick.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="bg-card rounded-2xl border p-4 flex flex-col items-center gap-2 text-center hover:border-primary transition-colors">
            <Icon className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
      <AppCta />
    </div>
  );
};

const Account = () => {
  const t = useT();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-background"><Navbar /></div>;
  if (!user) return <Navigate to="/auth?redirect=/account" replace />;
  if (user.user_type === "astrologer") return <Navigate to="/astrologer" replace />;

  const tabs = [
    { to: "/account", end: true, icon: LayoutDashboard, label: t("Overview", "सारांश") },
    { to: "/account/profile", icon: User, label: t("Profile", "प्रोफ़ाइल") },
    { to: "/account/wallet", icon: WalletIcon, label: t("Wallet", "वॉलेट") },
    { to: "/account/consultations", icon: MessageSquare, label: t("Consultations", "परामर्श") },
    { to: "/account/orders", icon: Package, label: t("Orders", "ऑर्डर") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            {user.profile_image
              ? <img src={user.profile_image} alt="" className="w-14 h-14 rounded-full object-cover border" />
              : <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">{(user.full_name || "?")[0].toUpperCase()}</div>}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-primary truncate">{user.full_name || t("My account", "मेरा अकाउंट")}</h1>
              <p className="text-sm text-muted-foreground truncate">{user.phone_number || user.email_address}</p>
            </div>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/", { replace: true }); }}>
              <LogOut className="w-4 h-4" /><span className="hidden sm:inline">{t("Log out", "लॉग आउट")}</span>
            </Button>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map(({ to, end, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-primary"}`}>
                <Icon className="w-4 h-4" />{label}
              </NavLink>
            ))}
          </nav>

          <Routes>
            <Route index element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="consultations" element={<Consultations />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/account" replace />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
