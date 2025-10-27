// Step3StudentConfirm.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Step3StudentConfirm = () => {
    const { completeOnboarding } = useAuth();
    const navigate = useNavigate();

    const finish = async () => {
        await completeOnboarding();
        navigate("/student/home", { replace: true });
    };

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-extrabold">All set!</h2>
            <p className="text-text/70">
                Your profile is complete. You can now browse menus and order.
            </p>

            <button
                onClick={finish}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:brightness-110"
            >
                Go to Student Home
            </button>
        </div>
    );
};

export default Step3StudentConfirm;
