import { Link } from "react-router-dom";
import { FaUtensils, FaShoppingCart, FaClock, FaUsers, FaMobileAlt, FaChartLine } from "react-icons/fa";

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-16 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold">Welcome to Foodyo 🍽</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    Your campus food ordering made simple, fast, and hassle-free.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        to="/login"
                        className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-green-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition"
                    >
                        Register
                    </Link>
                </div>
                <img
                    src="https://via.placeholder.com/800x400"
                    alt="Foodyo Preview"
                    className="mt-10 rounded-lg shadow-lg mx-auto"
                />
            </section>

            {/* Problem Section */}
            <section className="py-16 px-6 max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">The Problem</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                    Long queues, unclear menus, unavailable items, and wasted time are a daily struggle for students.
                    Canteen owners face difficulty managing orders, keeping track of stock, and serving efficiently.
                </p>
            </section>

            {/* Solution Section */}
            <section className="bg-gray-50 py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-10">
                        Foodyo bridges the gap between students and canteens with a smart, real-time ordering platform.
                        Students order from their phones, skip the queue, and enjoy fresh meals. Canteens manage orders,
                        update availability, and serve faster than ever.
                    </p>
                    <img
                        src="https://via.placeholder.com/800x400"
                        alt="Solution Preview"
                        className="rounded-lg shadow-lg mx-auto"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Features You'll Love</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={<FaUtensils className="text-green-500 text-4xl" />}
                        title="Browse Menus"
                        description="View complete menus from your campus canteens, updated in real-time."
                    />
                    <FeatureCard
                        icon={<FaShoppingCart className="text-green-500 text-4xl" />}
                        title="Easy Ordering"
                        description="Place orders from your phone in seconds without standing in line."
                    />
                    <FeatureCard
                        icon={<FaClock className="text-green-500 text-4xl" />}
                        title="Save Time"
                        description="Skip the queues and get notified when your food is ready."
                    />
                    <FeatureCard
                        icon={<FaUsers className="text-green-500 text-4xl" />}
                        title="Canteen Management"
                        description="Owners can manage inventory, track orders, and reduce waste."
                    />
                    <FeatureCard
                        icon={<FaMobileAlt className="text-green-500 text-4xl" />}
                        title="Mobile Friendly"
                        description="Designed to work seamlessly on all devices for students on the go."
                    />
                    <FeatureCard
                        icon={<FaChartLine className="text-green-500 text-4xl" />}
                        title="Insights & Reports"
                        description="Track sales, peak hours, and popular items to grow your business."
                    />
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-green-600 text-white py-16 text-center">
                <h2 className="text-3xl font-bold">Ready to Transform Campus Dining?</h2>
                <p className="mt-4 text-lg">Join Foodyo today and make ordering food simple & fast.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        to="/register"
                        className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                        Login
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <div className="mb-4">{icon}</div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}
