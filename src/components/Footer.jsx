import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-background border-t border-gray-200 dark:border-gray-700 text-text py-10 px-6 md:px-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* ===== Top Section ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-extrabold text-primary mb-3">Kantevo</h2>
                        <p className="text-sm text-text/80 leading-relaxed">
                            Order food easily from your college canteen — fast, reliable, and
                            contactless. Built for students and canteen owners alike.
                        </p>
                    </div>

                    {/* Company / About */}
                    <div>
                        <h3 className="text-lg font-semibold text-text mb-3">Company</h3>
                        <ul className="space-y-2 text-sm text-text/80">
                            <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Policies Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-text mb-3">Policies</h3>
                        <ul className="space-y-2 text-sm text-text/80">
                            <li><Link to="/privacy-policy" className="hover:text-primary transition">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-use" className="hover:text-primary transition">Terms of Use</Link></li>
                            <li><Link to="/return-policy" className="hover:text-primary transition">Return Policy</Link></li>
                            <li><Link to="/refund-policy" className="hover:text-primary transition">Refund Policy</Link></li>
                            {/* <li><Link to="/disclaimer" className="hover:text-primary transition">Disclaimer</Link></li> */}
                        </ul>
                    </div>

                    {/* For Students / Canteen Owners */}
                    <div>
                        <h3 className="text-lg font-semibold text-text mb-3">For You</h3>
                        <ul className="space-y-2 text-sm text-text/80">
                            <li><Link to="/register" className="hover:text-primary transition">For Students</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition">For Canteen Owners</Link></li>
                            {/* <li><Link to="/help" className="hover:text-primary transition">Help Center</Link></li>
                            <li><Link to="/faqs" className="hover:text-primary transition">FAQs</Link></li> */}
                        </ul>
                    </div>
                </div>

                {/* ===== Divider ===== */}
                <div className="border-t border-gray-300 dark:border-gray-700 mb-6"></div>

                {/* ===== Bottom Section ===== */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-text/70 text-center md:text-left">
                        © {new Date().getFullYear()} <span className="font-semibold text-primary">Kantevo</span>. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text/70">
                        <Link to="/privacy-policy" className="hover:text-primary transition">Privacy Policy</Link>
                        <span>|</span>
                        <Link to="/terms-of-use" className="hover:text-primary transition">Terms of Use</Link>
                        <span>|</span>
                        <Link to="/return-policy" className="hover:text-primary transition">Return Policy</Link>
                        <span>|</span>
                        <Link to="/refund-policy" className="hover:text-primary transition">Refund Policy</Link>
                        {/* <span>|</span>
                        <Link to="/disclaimer" className="hover:text-primary transition">Disclaimer</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
