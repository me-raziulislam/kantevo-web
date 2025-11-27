// src/components/Footer.jsx
// Modern, clean footer with better layout

import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Footer navigation structure
    const footerLinks = {
        company: [
            { label: "About Us", to: "/about" },
        ],
        forYou: [
            { label: "For Students", to: "/" },
            { label: "For Canteen Owners", to: "/partner-with-us" },
        ],
        legal: [
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms of Service", to: "/terms-of-service" },
            { label: "Return Policy", to: "/return-policy" },
            { label: "Refund Policy", to: "/refund-policy" },
        ],
    };

    const socialLinks = [
        {
            name: "Instagram",
            href: "https://www.instagram.com/thekantevo",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            name: "Twitter",
            href: "https://twitter.com/thekantevo",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
    ];

    // Structured Data for SEO
    const footerStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                name: "Kantevo",
                url: "https://kantevo.com",
                logo: "https://kantevo.com/favicon-96x96.png",
                sameAs: socialLinks.map((s) => s.href),
            },
            {
                "@type": "ItemList",
                itemListElement: [
                    { "@type": "SiteNavigationElement", position: 1, name: "About Us", url: "https://kantevo.com/about" },
                    { "@type": "SiteNavigationElement", position: 2, name: "Privacy Policy", url: "https://kantekantevo.com/privacy-policy" },
                    { "@type": "SiteNavigationElement", position: 3, name: "Terms of Use", url: "https://kantevo.com/terms-of-use" },
                    { "@type": "SiteNavigationElement", position: 4, name: "Return Policy", url: "https://kantevo.com/return-policy" },
                    { "@type": "SiteNavigationElement", position: 5, name: "Refund Policy", url: "https://kantevo.com/refund-policy" },
                    { "@type": "SiteNavigationElement", position: 6, name: "For Students", url: "https://kantevo.com/" },
                    { "@type": "SiteNavigationElement", position: 7, name: "For Canteen Owners", url: "https://kantevo.com/partner-with-us" },
                ],
            },
        ],
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(footerStructuredData)}</script>
            </Helmet>

            {/* ⭐ Mobile spacing improved */}
            <footer className="bg-background-subtle border-t border-border pt-10 md:pt-12">

                {/* Main Footer Content */}
                <div className="container-app pt-12 pb-12 md:pt-20 md:pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">

                        {/* Brand Column */}
                        <div className="md:col-span-5 lg:col-span-4 mb-10 md:mb-0">
                            <Link to="/" className="inline-flex items-center gap-2 mb-5">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-lg md:text-xl">K</span>
                                </div>
                                <span className="text-xl md:text-2xl font-bold">Kantevo</span>
                            </Link>

                            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-xs md:max-w-sm">
                                Smart canteen ordering for college campuses. Skip the queue,
                                order ahead, and make the most of your break time.
                            </p>

                            {/* Social Links */}
                            <div className="flex items-center gap-3 md:gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-background border border-border 
                                                   flex items-center justify-center text-text-muted 
                                                   hover:text-primary hover:border-primary hover:shadow-md transition-all"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="md:col-span-7 lg:col-span-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-14">

                                {/* Company Links */}
                                <div>
                                    <h3 className="font-semibold text-xs md:text-sm uppercase tracking-wider text-text mb-4 md:mb-6">
                                        Company
                                    </h3>
                                    <ul className="space-y-3 md:space-y-4">
                                        {footerLinks.company.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    to={link.to}
                                                    className="text-text-secondary text-sm md:text-base hover:text-primary transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* For You Links */}
                                <div>
                                    <h3 className="font-semibold text-xs md:text-sm uppercase tracking-wider text-text mb-4 md:mb-6">
                                        For You
                                    </h3>
                                    <ul className="space-y-3 md:space-y-4">
                                        {footerLinks.forYou.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    to={link.to}
                                                    className="text-text-secondary text-sm md:text-base hover:text-primary transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Legal Links */}
                                <div>
                                    <h3 className="font-semibold text-xs md:text-sm uppercase tracking-wider text-text mb-4 md:mb-6">
                                        Legal
                                    </h3>
                                    <ul className="space-y-3 md:space-y-4">
                                        {footerLinks.legal.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    to={link.to}
                                                    className="text-text-secondary text-sm md:text-base hover:text-primary transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border">
                    <div className="container-app py-6 md:py-8">
                        <p className="text-xs md:text-sm text-text-muted text-center">
                            © {currentYear} Kantevo. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
