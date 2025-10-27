// components/ScreenTransition.jsx
// Simple blur + spinner overlay used during step transitions.

const ScreenTransition = ({ show }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-30 backdrop-blur-sm bg-black/10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
    );
};

export default ScreenTransition;
