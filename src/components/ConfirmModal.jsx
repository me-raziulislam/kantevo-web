// src/components/ConfirmModal.jsx
// Premium confirmation modal

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmModal = ({
    title,
    children,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning" // 'warning' | 'danger' | 'success'
}) => {
    const modalRef = useRef();

    // Close modal if clicked outside content
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const variantStyles = {
        warning: {
            icon: "bg-warning/10",
            iconColor: "text-warning",
            button: "bg-warning hover:bg-warning/90"
        },
        danger: {
            icon: "bg-error/10",
            iconColor: "text-error",
            button: "bg-error hover:bg-error/90"
        },
        success: {
            icon: "bg-success/10",
            iconColor: "text-success",
            button: "bg-success hover:bg-success/90"
        }
    };

    const styles = variantStyles[variant] || variantStyles.warning;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="card w-full max-w-md p-6"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${styles.icon} flex items-center justify-center shrink-0`}>
                            <ExclamationTriangleIcon className={`w-6 h-6 ${styles.iconColor}`} />
                        </div>
                        <h2 className="text-xl font-bold text-text">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-background-subtle transition-colors text-text-muted hover:text-text"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="mb-6 text-text-secondary">{children}</div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <button
                        onClick={onClose}
                        className="btn-secondary px-5 py-2.5"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ConfirmModal;
