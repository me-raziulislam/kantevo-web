// components/Modal.jsx
// A small, reusable modal used by Login/Signup/OTP. Click backdrop or X to close.

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md", // sm | md | lg
    initialFocusRef,
    hideClose = false,
}) => {
    useEffect(() => {
        if (isOpen && initialFocusRef?.current) {
            // Focus the provided element for accessibility
            initialFocusRef.current.focus();
        }
    }, [isOpen, initialFocusRef]);

    if (!isOpen) return null;

    const maxW =
        size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-sm" : "max-w-lg";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`relative w-full ${maxW} mx-4`}>
                <div className="bg-background text-text rounded-2xl shadow-xl border border-text/10 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        {!hideClose && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-text/10 transition"
                                aria-label="Close"
                            >
                                <IoClose size={22} />
                            </button>
                        )}
                    </div>

                    <div className="p-5">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
