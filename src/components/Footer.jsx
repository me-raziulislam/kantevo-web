import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-background text-text text-center py-4 text-sm transition-colors duration-300">
            <p>
                © {new Date().getFullYear()} Kantevo. All rights reserved.
            </p>
            <div className="mt-2 space-x-4">
                <Link
                    to="/privacy-policy"
                    className="hover:text-primary transition-colors"
                >
                    Privacy Policy
                </Link>
                <span>|</span>
                <Link
                    to="/terms-of-use"
                    className="hover:text-primary transition-colors"
                >
                    Terms of Use
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
