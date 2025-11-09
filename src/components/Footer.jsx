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
                className="bg-background border-t border-gray-200 dark:border-gray-700 text-text py-12 px-6 md:px-12 transition-colors duration-300"
                itemScope
                itemType="https://schema.org/WPFooter"
            >
                <div className="max-w-7xl mx-auto">
                    {/* ===== Top Section ===== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                        {/* Brand */}
                        <div itemScope itemType="https://schema.org/Organization" className="md:col-span-1">
                            <h2 className="text-2xl font-extrabold mb-3" itemProp="name">Kantevo</h2>
                            <p className="text-sm text-text/80 leading-relaxed" itemProp="description">
                                Order food easily from your college canteen — fast, reliable, and
                                contactless. Built for students and canteen owners alike.
                            </p>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-text mb-4 tracking-wide">Company</h3>
                            <ul className="space-y-2 text-sm text-text/80">
                                <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
                            </ul>
                        </div>

                        {/* Policies */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-text mb-4 tracking-wide">Policies</h3>
                            <ul className="space-y-2 text-sm text-text/80">
                                <li><Link to="/privacy-policy" className="hover:text-primary transition">Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className="hover:text-primary transition">Terms of Service</Link></li>
                                <li><Link to="/return-policy" className="hover:text-primary transition">Return Policy</Link></li>
                                <li><Link to="/refund-policy" className="hover:text-primary transition">Refund Policy</Link></li>
                            </ul>
                        </div>

                        {/* For You */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-text mb-4 tracking-wide">For You</h3>
                            <ul className="space-y-2 text-sm text-text/80">
                                <li><Link to="/" className="hover:text-primary transition">For Students</Link></li>
                                <li>
                                    <Link
                                        to="/partner-with-us"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition"
                                    >
                                        For Canteen Owners
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-col items-start md:items-end">
                            <h3 className="text-sm font-semibold uppercase text-text mb-4 tracking-wide">Social Links</h3>
                            <div className="flex items-center gap-4 mb-5 text-text/80">
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/thekantevo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="hover:text-primary transition"
                                >
                                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5zM18 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
                                    </svg>
                                </a>

                                {/* Twitter */}
                                <a
                                    href="https://twitter.com/thekantevo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    className="hover:text-primary transition"
                                >
                                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 0 0 1.88-2.36 8.47 8.47 0 0 1-2.7 1.04A4.23 4.23 0 0 0 16 4a4.24 4.24 0 0 0-4.23 4.23c0 .33.04.65.11.95a12 12 0 0 1-8.72-4.43 4.24 4.24 0 0 0 1.31 5.65A4.18 4.18 0 0 1 2.8 10v.05A4.24 4.24 0 0 0 6.22 14a4.26 4.26 0 0 1-1.91.07A4.25 4.25 0 0 0 8.2 17a8.5 8.5 0 0 1-5.27 1.82A8.86 8.86 0 0 1 2 18.79a12 12 0 0 0 6.5 1.9c7.8 0 12.06-6.46 12.06-12.07v-.55A8.56 8.56 0 0 0 22.46 6z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ===== Divider + Copyright ===== */}
                    <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-4 text-center">
                        <p className="text-sm text-text/70">
                            © {new Date().getFullYear()} <span>Kantevo</span>. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
