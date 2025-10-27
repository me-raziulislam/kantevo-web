import React, { useRef, useEffect } from "react";

const ConfirmModal = ({ title, children, onClose, onConfirm }) => {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div
                ref={modalRef}
                className="bg-background dark:bg-gray-900 w-full max-w-md p-6 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-text dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-semibold transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="mb-6 text-text/90 dark:text-gray-300">{children}</div>

                {/* Footer: Same row */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
