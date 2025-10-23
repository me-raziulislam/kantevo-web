import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors 
                 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <MoonIcon className="w-5 h-5 text-gray-800" />
            ) : (
                <SunIcon className="w-5 h-5 text-yellow-400" />
            )}
        </button>
    );
}
