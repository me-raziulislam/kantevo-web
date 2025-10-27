// Step3CanteenDocs.jsx
// No changes, final step triggers onboarding complete

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Step3CanteenDocs = () => {
    const { completeOnboarding } = useAuth();
    const navigate = useNavigate();

    const finish = async () => {
        await completeOnboarding();
        navigate("/canteen/home", { replace: true });
    };

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-extrabold">Restaurant documents</h2>
            <p className="text-text/70">You’ll be able to add/verify PAN, FSSAI, and bank details later too.</p>

            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
                <p className="text-sm text-text/70">Upload documents (coming soon). You can skip for now.</p>
            </div>

            <button onClick={finish} className="px-5 py-2 rounded-lg bg-primary text-white">
                Finish & Go to Canteen Home
            </button>
        </div>
    );
};

export default Step3CanteenDocs;
