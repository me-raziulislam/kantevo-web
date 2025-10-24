import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const { loading } = useAuth();

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

  // Show footer only on non dashboard pages
  const hideFooter = location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/canteen");
  const showFooter = !hideFooter;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
