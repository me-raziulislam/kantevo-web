import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "@dr.pogodin/react-helmet";

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration
      easing: "ease-in-out",
      once: true, // animate only once
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-lime-500 border-solid"></div>
        <p className="text-gray-600 font-medium">Initializing session...</p>
      </div>
    );
  }

  // const publicPaths = ["/", "/login", "/register", "/privacy-policy", "/terms-of-use", "/refund-policy", "/return-policy", "/about"];
  // const showFooter = publicPaths.includes(location.pathname);

  // Hide footer on dashboard routes
  const hideFooter =
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/canteen") ||
    location.pathname.startsWith("/onboarding"); // also hide during onboarding
  const showFooter = !hideFooter;

  // Structured data (for sitelinks + search + navigation)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kantevo",
    "url": "https://kantevo.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kantevo.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const siteNavigation = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Home",
        "url": "https://kantevo.com/",
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "About",
        "url": "https://kantevo.com/about",
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Partner with Us",
        "url": "https://kantevo.com/partner-with-us",
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Privacy Policy",
        "url": "https://kantevo.com/privacy-policy",
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Terms of Use",
        "url": "https://kantevo.com/terms-of-use",
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Return Policy",
        "url": "https://kantevo.com/return-policy",
      },
      {
        "@type": "SiteNavigationElement",
        "position": 7,
        "name": "Refund Policy",
        "url": "https://kantevo.com/refund-policy",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Global Helmet: tells Google about site structure */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(siteNavigation)}
        </script>
      </Helmet>

      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
