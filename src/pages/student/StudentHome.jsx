import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import CanteenCard from "../../components/CanteenCard";

const StudentHome = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch canteens for student's college
    useEffect(() => {
        if (!user?.college) return;
        const collegeId = user.college._id || user.college;
        (async () => {
            try {
                setLoading(true);
                const res = await api.get(`/canteens/college/${collegeId}`);
                setCanteens(res.data || []);
            } catch {
                toast.error("Failed to load canteens");
            } finally {
                setLoading(false);
            }
        })();
    }, [api, user]);

    const onSelectCanteen = (id) => {
        navigate(`/student/canteen/${id}`);
    };

    return (
        <div className="space-y-8 min-h-screen">
            <SEO
                title="Explore Canteens"
                description="Browse nearby canteens, view menus, and order your favorite dishes easily on Kantevo."
                canonicalPath="/student/home"
            />

            <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
                Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>

            <section>
                <h2 className="text-lg font-semibold mb-4">Canteens Near You</h2>
                {loading ? (
                    <p className="text-text/70">Loading canteens...</p>
                ) : canteens.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {canteens.map((c) => (
                            <CanteenCard
                                key={c._id}
                                canteen={c}
                                onSelect={onSelectCanteen}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-text/70">No canteens found in your college.</p>
                )}
            </section>
        </div>
    );
};

export default StudentHome;
