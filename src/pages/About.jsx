// pages/About.jsx
import { FaInstagram } from "react-icons/fa";
import SEO from "../components/SEO";

export default function About() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">

            <SEO
                title="About Us"
                description="Learn about Kantevo — the platform revolutionizing college canteen food ordering."
                canonicalPath="/about"
            />

            {/* Hero Section */}
            <section className="text-center mt-10 max-w-4xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
                    🍴 About Kantevo
                </h1>
                <p className="mt-4 text-lg text-text/80 leading-relaxed">
                    Smarter Meals. No Waiting. Just Scanning. 🚀
                </p>
                <p className="mt-4 text-text/80 leading-relaxed">
                    Kantevo is a smart and efficient college canteen food ordering platform designed to make campus dining faster, simpler, and more enjoyable.
                </p>
                <p className="mt-4 text-text/80 leading-relaxed">
                    We know how precious every minute is between lectures — and standing in long canteen lines just to grab a snack or meal can be frustrating. That’s where Kantevo steps in.
                </p>
            </section>

            {/* How it works */}
            <section className="mt-16 max-w-5xl text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-6 text-text">How It Works</h2>
                <ul className="text-text/80 leading-relaxed list-disc list-inside space-y-2 text-left sm:text-center sm:list-none sm:space-y-0 sm:flex sm:flex-col sm:gap-4 sm:items-center">
                    <li>Order your meals in advance directly through the website or app.</li>
                    <li>Arrive at the canteen and simply scan the QR code.</li>
                    <li>Instantly collect your freshly prepared food — no waiting, no confusion, no wasted time.</li>
                </ul>
            </section>

            {/* Vision */}
            <section className="mt-16 max-w-5xl text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">🌟 Our Vision</h2>
                <p className="text-text/80 leading-relaxed">
                    To revolutionize campus dining by combining technology and convenience — ensuring that every student can enjoy fresh food without wasting time in queues.
                    Kantevo aims to become a bridge between students and canteen owners, making the food ordering process effortless, transparent, and reliable.
                </p>
            </section>

            {/* Why Kantevo */}
            <section className="mt-16 max-w-6xl w-full">
                <h2 className="text-3xl font-bold text-center mb-8 text-text" data-aos="fade-up">
                    💡 Why Kantevo?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        "✅ No More Waiting Lines – Order before you arrive and pick up your meal instantly.",
                        "✅ Time-Saving – Focus on your classes, not queues. Your food will be ready when you are.",
                        "✅ Hassle-Free Payments – Pay online securely through UPI, wallet, or card — no need to carry cash.",
                        "✅ Fresh & Hot Meals – Since your order is scheduled in advance, the canteen prepares it just in time.",
                        "✅ Eco-Friendly & Digital – QR-based pickup means less paper, fewer receipts, and zero confusion.",
                        "✅ Fair for Everyone – Canteens manage orders efficiently, reduce crowding, and improve service quality."
                    ].map((point, index) => (
                        <div
                            key={index}
                            className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition text-text/80"
                            data-aos="fade-up"
                            data-aos-delay={100 * (index + 1)}
                        >
                            {point}
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="mt-16 max-w-5xl text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">🎯 Our Mission</h2>
                <p className="text-text/80 leading-relaxed">
                    To make every college canteen smarter, faster, and more organized, while helping students save time and canteen owners serve more efficiently — all through one seamless digital platform.
                </p>
            </section>

            {/* Contact */}
            <section className="mt-16 mb-20 max-w-4xl text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">📞 Contact Us</h2>
                <p className="text-text/80 leading-relaxed mb-2">
                    Have questions, feedback, or partnership inquiries? We’d love to hear from you!
                </p>
                {/* <p className="text-text/80 mb-1">📍 Address: Madhapur, Hyderabad, Telangana</p> */}
                <p className="text-text/80 mb-1">📧 Email:{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>{" "}</p>
                {/* <p className="text-text/80 mb-1">📞 Phone: +91-XXXXXXXXXX</p> */}
                <p className="text-text/80 mb-1">🌐 Website: www.kantevo.com</p>
                <p className="text-text/80 mb-4">⏰ Working Hours: Monday – Saturday, 9:00 AM – 4:00 PM</p>
                {/* <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark transition text-2xl"
                >
                    <FaInstagram />
                </a> */}
            </section>
        </div>
    );
}