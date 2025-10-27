// pages/onboarding/PendingApproval.jsx
// Simple holding screen for unverified canteen owners

const PendingApproval = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 text-text bg-background">
            <h1 className="text-3xl font-bold mb-4">Awaiting Admin Approval</h1>
            <p className="text-text/70 max-w-lg mb-6">
                Your canteen registration is complete, but it’s currently pending verification by the
                Kantevo admin team. You’ll be notified once approved.
            </p>
            <div className="animate-pulse text-primary font-semibold">Please check back later.</div>
        </div>
    );
};

export default PendingApproval;
