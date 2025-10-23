import { useState } from "react";

const TermsOfUse = () => {
    const [role, setRole] = useState("student");

    return (
        <div className="max-w-4xl mx-auto p-6 text-text leading-relaxed">
            <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
            <p className="mb-6">
                These Terms govern your use of the Kantevo platform. By registering, you
                accept and agree to comply with these Terms. Separate provisions apply
                to Students and Canteen Owners.
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
                    <h2 className="text-xl font-semibold">Eligibility</h2>
                    <p>
                        You must be a student of a listed college/school and provide valid
                        registration details.
                    </p>

                    <h2 className="text-xl font-semibold">Use of Platform</h2>
                    <p>
                        You may browse menus, place orders, make payments, and generate
                        tokens. Misuse, fraud, or attempts to manipulate payments will lead
                        to account suspension.
                    </p>

                    <h2 className="text-xl font-semibold">Payments & Refunds</h2>
                    <p>
                        Payments are processed through secure third-party gateways. Refunds
                        are provided if an order is canceled before preparation or if the
                        canteen fails to deliver.
                    </p>

                    <h2 className="text-xl font-semibold">Limitations</h2>
                    <p>
                        Kantevo is not responsible for food quality or safety. Any dispute
                        related to product quality must be addressed with the canteen.
                    </p>
                </div>
            )}

            {role === "canteen" && (
                <div className="space-y-5">
                    <h2 className="text-xl font-semibold">Eligibility</h2>
                    <p>
                        You must be a verified canteen owner or authorized representative of
                        a college/school cafeteria.
                    </p>

                    <h2 className="text-xl font-semibold">Responsibilities</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide accurate menu, prices, and timings.</li>
                        <li>Ensure timely preparation and delivery of student orders.</li>
                        <li>Maintain hygiene and comply with food safety laws.</li>
                    </ul>

                    <h2 className="text-xl font-semibold">Payments & Settlements</h2>
                    <p>
                        Payments are collected by Kantevo and settled periodically after
                        deducting applicable platform fees. Disputes are subject to
                        verification.
                    </p>

                    <h2 className="text-xl font-semibold">Termination</h2>
                    <p>
                        Kantevo reserves the right to suspend or terminate canteen accounts
                        in case of repeated complaints, fraud, or policy violations.
                    </p>
                </div>
            )}

            <h2 className="text-xl font-semibold mt-8">Governing Law</h2>
            <p>
                These Terms are governed by Indian law. Any disputes shall be subject to
                the jurisdiction of courts located in [Your City].
            </p>

            <p className="mt-10 text-sm">
                For legal queries, contact us at{" "}
                <a href="mailto:support@kantevo.com" className="text-primary">
                    support@kantevo.com
                </a>
                .
            </p>
        </div>
    );
};

export default TermsOfUse;