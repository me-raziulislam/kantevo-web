// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {theme === "light" ? (
                    <MoonIcon className="w-5 h-5" />
                ) : (
                    <SunIcon className="w-5 h-5 text-accent" />
                )}
            </motion.div>
        </button>
    );
}
