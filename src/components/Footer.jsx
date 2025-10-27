import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";

const Footer = () => {
    // Structured Data for Google (Organization + Navigation Links)
    const footerStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "Kantevo",
                "url": "https://kantevo.com",
                "logo": "https://kantevo.com/favicon-96x96.png",
                "sameAs": [
                    "https://www.instagram.com/kantevo",
                    "https://www.linkedin.com/company/kantevo",
                    "https://twitter.com/kantevo"
                ]
            },
            {
                "@type": "ItemList",
                "itemListElement": [
                    {
                        "@type": "SiteNavigationElement",
                        "position": 1,
                        "name": "About Us",
                        "url": "https://kantevo.com/about"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 2,
                        "name": "Privacy Policy",
                        "url": "https://kantevo.com/privacy-policy"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 3,
                        "name": "Terms of Use",
                        "url": "https://kantevo.com/terms-of-use"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 4,
                        "name": "Return Policy",
                        "url": "https://kantevo.com/return-policy"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 5,
                        "name": "Refund Policy",
                        "url": "https://kantevo.com/refund-policy"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 6,
                        "name": "For Students",
                        "url": "https://kantevo.com/"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 7,
                        "name": "For Canteen Owners",
                        "url": "https://kantevo.com/partner-with-us"
                    }
                ]
            }
        ]
    };

    return (
        <>
            {/* Helmet: Inject structured data into <head> */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(footerStructuredData)}
                </script>
            </Helmet>

            <footer
                className="bg-background border-t border-gray-200 dark:border-gray-700 text-text py-10 px-6 md:px-12 transition-colors duration-300"
                itemScope
                itemType="https://schema.org/WPFooter"
            >
                <div className="max-w-7xl mx-auto">
                    {/* ===== Top Section ===== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        {/* Brand */}
                        <div itemScope itemType="https://schema.org/Organization">
                            <h2 className="text-2xl font-extrabold mb-3" itemProp="name">Kantevo</h2>
                            <p className="text-sm text-text/80 leading-relaxed" itemProp="description">
                                Order food easily from your college canteen — fast, reliable, and
                                contactless. Built for students and canteen owners alike.
                            </p>
                        </div>

                        {/* Company / About */}
                        <div>
                            <h3 className="text-lg font-semibold text-text mb-3">Company</h3>
                            <ul className="space-y-2 text-sm text-text/80" itemScope itemType="https://schema.org/SiteNavigationElement">
                                <li>
                                    <Link to="/about" className="hover:text-primary transition" itemProp="url">
                                        <span itemProp="name">About Us</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Policies Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-text mb-3">Policies</h3>
                            <ul className="space-y-2 text-sm text-text/80" itemScope itemType="https://schema.org/SiteNavigationElement">
                                <li>
                                    <Link to="/privacy-policy" className="hover:text-primary transition" itemProp="url">
                                        <span itemProp="name">Privacy Policy</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms-of-use" className="hover:text-primary transition" itemProp="url">
                                        <span itemProp="name">Terms of Use</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/return-policy" className="hover:text-primary transition" itemProp="url">
                                        <span itemProp="name">Return Policy</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="hover:text-primary transition" itemProp="url">
                                        <span itemProp="name">Refund Policy</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* For Students / Canteen Owners */}
                        <div>
                            <h3 className="text-lg font-semibold text-text mb-3">For You</h3>
                            <ul className="space-y-2 text-sm text-text/80" itemScope itemType="https://schema.org/SiteNavigationElement">
                                <li>
                                    <Link to="/" className="hover:text-primary transition" itemProp="url">
                                        <span itemProp="name">For Students</span>
                                    </Link>
                                </li>
                                <li>
                                    {/* Open in new tab */}
                                    <Link
                                        to="/partner-with-us"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition"
                                        itemProp="url"
                                    >
                                        <span itemProp="name">For Canteen Owners</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* ===== Divider ===== */}
                    <div className="border-t border-gray-300 dark:border-gray-700 mb-6"></div>

                    {/* ===== Bottom Section ===== */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-text text-center md:text-left">
                            © {new Date().getFullYear()} <span>Kantevo</span>. All rights reserved.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text/70">
                            <Link to="/privacy-policy" className="hover:text-primary transition" itemProp="url">
                                <span itemProp="name">Privacy Policy</span>
                            </Link>
                            <span>|</span>
                            <Link to="/terms-of-use" className="hover:text-primary transition" itemProp="url">
                                <span itemProp="name">Terms of Use</span>
                            </Link>
                            <span>|</span>
                            <Link to="/return-policy" className="hover:text-primary transition" itemProp="url">
                                <span itemProp="name">Return Policy</span>
                            </Link>
                            <span>|</span>
                            <Link to="/refund-policy" className="hover:text-primary transition" itemProp="url">
                                <span itemProp="name">Refund Policy</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
