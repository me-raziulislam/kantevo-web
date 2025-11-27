// components/Modal.jsx
// Premium modal with smooth animations and modern design

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = "md",
    initialFocusRef,
    hideClose = false,
}) => {
    useEffect(() => {
        if (isOpen && initialFocusRef?.current) {
            setTimeout(() => initialFocusRef.current?.focus(), 100);
        }
    }, [isOpen, initialFocusRef]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && isOpen) onClose?.();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    const maxW =
        size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-sm" : "max-w-md";

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={backdropVariants}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`relative w-full ${maxW}`}
                    >
                        <div className="bg-background-elevated rounded-2xl shadow-xl border border-border overflow-hidden">
                            {/* Header */}
                            <div className="relative px-6 pt-6 pb-4">
                                {!hideClose && (
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text hover:bg-background-subtle transition-colors"
                                        aria-label="Close"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <h3 className="text-xl font-bold pr-8">{title}</h3>
                                {subtitle && (
                                    <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-6">{children}</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
