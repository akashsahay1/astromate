import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { ForgotPassword, ResetPassword } from "./pages/PasswordReset";
import Account from "./pages/account/Account";
import AstrologerHome from "./pages/astrologer/AstrologerHome";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";
import { RefundPolicy, ShippingPolicy, CookiePolicy, ContactPage } from "./pages/Policies";
import { LangProvider } from "@/hooks/useLang";
import Numerology from "./pages/Numerology";
import LoShuGrid from "./pages/LoShuGrid";
import FreeKundli from "./pages/FreeKundli";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import AstrologerTerms from "./pages/AstrologerTerms";
import NotFound from "./pages/NotFound";
import PoojaDetail from "./pages/PoojaDetail";
import MantraJaapDetail from "./pages/MantraJaapDetail";
import Horoscope from "./pages/Horoscope";
import Nakshatra from "./pages/Nakshatra";
import AboutAstrology from "./pages/AboutAstrology";
import LoveCalculator from "./pages/LoveCalculator";
import Panchang from "./pages/Panchang";
import AstrologersPage from "./pages/Astrologers";
import LuckyNumber from "./pages/LuckyNumber";
import BlogPage from "./pages/BlogPage";
import ShopPage from "./pages/ShopPage";
import PoojaServicesPage from "./pages/PoojaServicesPage";
import VedMantraPage from "./pages/VedMantraPage";
import PricingPage from "./pages/PricingPage";
import ServiceDetail from "./pages/ServiceDetail";
import ProductDetail from "./pages/ProductDetail";

import { BookingFlowProvider } from "@/components/BookingFlowProvider";

const queryClient = new QueryClient();

const App = () => (
  <LangProvider>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <BookingFlowProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-profile" element={<Navigate to="/astrologer" replace />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/astrologer" element={<AstrologerHome />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/numerology" element={<Numerology />} />
            <Route path="/loshu-grid" element={<LoShuGrid />} />
            <Route path="/free-kundli" element={<FreeKundli />} />
            <Route path="/horoscope" element={<Horoscope />} />
            <Route path="/nakshatra" element={<Nakshatra />} />
            <Route path="/about-astrology" element={<AboutAstrology />} />
            <Route path="/love-calculator" element={<LoveCalculator />} />
            <Route path="/panchang" element={<Panchang />} />
            <Route path="/lucky-number" element={<LuckyNumber />} />
            <Route path="/astrologers" element={<AstrologersPage />} />
            <Route path="/profile" element={<Navigate to="/account" replace />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/pooja-services" element={<PoojaServicesPage />} />
            <Route path="/ved-mantra" element={<VedMantraPage />} />
            <Route path="/pricing" element={<PricingPage />} />


            <Route path="/pricing/:slug" element={<ServiceDetail />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/pooja/:id" element={<PoojaDetail />} />
            <Route path="/mantra-jaap/:id" element={<MantraJaapDetail />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/astrologer-terms" element={<AstrologerTerms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BookingFlowProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
    </LangProvider>
);

export default App;
