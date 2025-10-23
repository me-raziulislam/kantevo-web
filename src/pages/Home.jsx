import { Link } from "react-router-dom";
import { FaUtensils, FaMobileAlt, FaClock, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";

export default function Home() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="text-center mt-10 max-w-4xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
                    Welcome to Kantevo 🍽️
                </h1>
                <p className="mt-4 text-lg text-text/80">
                    Your campus food ordering made simple! Order from your college canteen
                    with just a few clicks.
                </p>
                <div
                    className="mt-6 flex justify-center gap-4"
                    data-aos="zoom-in"
                    data-aos-delay="200"
                >
                    <Link
                        to="/login"
                        className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded shadow-md transition"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-2 bg-background border border-gray-300 dark:border-gray-600 text-text rounded shadow-md transition hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Register
                    </Link>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="mt-20 max-w-5xl text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">
                    The Problem We Solve
                </h2>
                <p className="text-text/80 leading-relaxed">
                    Students often face long queues, lack of menu visibility, and
                    uncertainty about food availability. Canteen owners struggle with
                    managing rush hours and tracking orders effectively.
                </p>
            </section>

            {/* Features Section */}
            <section className="mt-20 max-w-6xl w-full">
                <h2
                    className="text-3xl font-bold text-center mb-12 text-text"
                    data-aos="fade-up"
                >
                    Why Choose Kantevo?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div
                        className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <FaUtensils className="text-primary text-4xl mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-text">Easy Ordering</h3>
                        <p className="text-text/80 text-sm">
                            Browse menus and place orders from your device without leaving your seat.
                        </p>
                    </div>
                    <div
                        className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <FaMobileAlt className="text-primary text-4xl mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-text">Mobile Friendly</h3>
                        <p className="text-text/80 text-sm">
                            Access Kantevo anytime, anywhere with our fully responsive platform.
                        </p>
                    </div>
                    <div
                        className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <FaClock className="text-primary text-4xl mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-text">Save Time</h3>
                        <p className="text-text/80 text-sm">
                            Avoid long queues and get notified when your order is ready.
                        </p>
                    </div>
                    <div
                        className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        <FaUsers className="text-primary text-4xl mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-text">For Everyone</h3>
                        <p className="text-text/80 text-sm">
                            Built to make life easier for both students and canteen owners.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="mt-20 mb-20 text-center" data-aos="zoom-in">
                <h2 className="text-2xl font-bold mb-4 text-text">
                    Ready to make your campus dining effortless?
                </h2>
                <p className="text-text/80 mb-6">
                    Be among the first to experience hassle-free canteen orders with Kantevo.
                </p>
                <Link
                    to="/register"
                    className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded shadow-lg transition"
                >
                    Get Started
                </Link>
            </section>
        </div>
    );
}
