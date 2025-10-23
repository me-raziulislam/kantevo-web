import { useState } from "react";

const PrivacyPolicy = () => {
    const [role, setRole] = useState("student");

    return (
        <div className="max-w-4xl mx-auto p-6 text-text leading-relaxed">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="mb-6">
                At Kantevo, we are committed to safeguarding your privacy. This policy
                explains how we collect, use, and protect information of both students
                and canteen owners. By using our platform, you agree to the terms
                outlined here.
            </p>

            {/* Role Toggle */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setRole("student")}
                    className={`px-4 py-2 rounded ${role === "student" ? "bg-primary text-white" : "bg-gray-200"
                        }`}
                >
                    For Students
                </button>
                <button
                    onClick={() => setRole("canteen")}
                    className={`px-4 py-2 rounded ${role === "canteen" ? "bg-primary text-white" : "bg-gray-200"
                        }`}
                >
                    For Canteen Owners
                </button>
            </div>

            {role === "student" && (
                <div className="space-y-5">
                    <h2 className="text-xl font-semibold">Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Personal details: name, email, mobile number, college.</li>
                        <li>Order details: items purchased, transaction amounts, tokens.</li>
                        <li>Device and usage data: browser type, IP address, app usage.</li>
                    </ul>

                    <h2 className="text-xl font-semibold">How We Use Your Information</h2>
                    <p>
                        We process your information to place orders, confirm payments,
                        generate order tokens, notify about order status, and improve
                        personalization (e.g., showing your frequent items).
                    </p>

                    <h2 className="text-xl font-semibold">Sharing of Data</h2>
                    <p>
                        We only share essential order details with the respective canteen to
                        fulfill your request. We never sell your personal data to third
                        parties.
                    </p>

                    <h2 className="text-xl font-semibold">Your Rights</h2>
                    <p>
                        You can request account deletion, correction of details, or opt-out
                        from marketing communication. Contact{" "}
                        <a href="mailto:support@kantevo.com" className="text-primary">
                            support@kantevo.com
                        </a>{" "}
                        for assistance.
                    </p>
                </div>
            )}

            {role === "canteen" && (
                <div className="space-y-5">
                    <h2 className="text-xl font-semibold">Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Business details: canteen name, registration, contact info.</li>
                        <li>Menu and pricing details, operational timings.</li>
                        <li>
                            Financial details: bank/UPI account for order settlements.
                        </li>
                    </ul>

                    <h2 className="text-xl font-semibold">How We Use Your Information</h2>
                    <p>
                        Information is used to display your canteen to students, process
                        incoming orders, calculate settlements, and provide performance
                        analytics.
                    </p>

                    <h2 className="text-xl font-semibold">Data Security</h2>
                    <p>
                        We use encryption, role-based access, and secure servers. Financial
                        data is handled by trusted payment gateways and not stored by us.
                    </p>

                    <h2 className="text-xl font-semibold">Retention</h2>
                    <p>
                        Business data is retained as long as your canteen is active on our
                        platform or as required by law.
                    </p>
                </div>
            )}

            <p className="mt-10 text-sm">
                This policy may be updated from time to time. Continued use of Kantevo
                after updates constitutes acceptance of changes.
            </p>
        </div>
    );
};

export default PrivacyPolicy;