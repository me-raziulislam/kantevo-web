import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";
import { Helmet } from "@dr.pogodin/react-helmet";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    // Structured data for SEO (Google sitelinks, schema.org)
    const navStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": "Home",
                "url": "https://kantevo.com/"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": "Login",
                "url": "https://kantevo.com/login"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": "Register",
                "url": "https://kantevo.com/register"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 4,
                "name": "About",
                "url": "https://kantevo.com/about"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 5,
                "name": "Privacy Policy",
                "url": "https://kantevo.com/privacy-policy"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 6,
                "name": "Terms of Use",
                "url": "https://kantevo.com/terms-of-use"
            }
        ]
    };

    return (
        <>
            {/* Helmet for injecting schema markup for structured navigation */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(navStructuredData)}
                </script>
            </Helmet>

            <nav
                className="bg-background text-text shadow-md px-6 py-3 flex justify-between items-center transition-colors duration-300"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
            >
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold" itemProp="url">
                    <span itemProp="name">Kantevo</span>
                </Link>

                {/* Links */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="font-medium">
                                Hi, {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-700 font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-primary font-medium transition-colors"
                                itemProp="url"
                            >
                                <span itemProp="name">Login</span>
                            </Link>
                            <Link
                                to="/register"
                                className="hover:text-primary font-medium transition-colors"
                                itemProp="url"
                            >
                                <span itemProp="name">Register</span>
                            </Link>
                            <Link
                                to="/about"
                                className="hover:text-primary font-medium transition-colors hidden sm:inline"
                                itemProp="url"
                            >
                                <span itemProp="name">About</span>
                            </Link>
                        </>
                    )}

                    {/* Theme Toggle Button */}
                    <ThemeToggle />
                </div>
            </nav>
        </>
    );
};

export default Navbar;
