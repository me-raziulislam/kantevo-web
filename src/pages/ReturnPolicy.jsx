// pages/ReturnPolicy.jsx

import SEO from "../components/SEO";

export default function ReturnPolicy() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">

            <SEO
                title="Return Policy"
                description="Understand Kantevo’s return policy for canteen orders and payments."
                canonicalPath="/return-policy"
            />

            {/* Hero Section */}
            <section className="text-center mt-10 max-w-4xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
                    📝 Return Policy
                </h1>
                <p className="mt-4 text-lg text-text/80 leading-relaxed">
                    Ensuring fairness and transparency for both students and canteen owners.
                </p>
            </section>

            {/* For Students */}
            <section className="mt-16 max-w-5xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Students</h2>
                <p className="text-text/80 leading-relaxed mb-4">
                    Once an order is placed and payment is confirmed, the canteen begins preparing your meal immediately.
                    To maintain freshness and hygiene, orders cannot be returned or refunded after collection, except in specific cases.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">✅ Eligible for Return/Replacement</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>The wrong item was prepared or provided.</li>
                    <li>The food is spoiled, cold, or contaminated at the time of pickup.</li>
                    <li>The order was charged but not prepared due to technical or system errors.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">❌ Not Eligible for Return</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Change of mind or taste preference.</li>
                    <li>Delay in pickup leading to cold or stale food.</li>
                    <li>Food consumed partially or completely.</li>
                    <li>Incorrect customization due to user entry errors.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">🧾 Resolution Process</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    Visit the Help/Support section or contact{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>{" "} within 30 minutes of pickup.
                    Provide your Order ID, issue description, and (if applicable) a photo of the received food.
                    The canteen and Kantevo team will review your request. If approved, you may receive a replacement or refund (at the canteen’s discretion).
                </p>
            </section>

            {/* For Canteen Owners */}
            <section className="mt-16 max-w-5xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Canteen Owners</h2>
                <p className="text-text/80 leading-relaxed mb-4">
                    Canteen Owners prepare food based on confirmed and prepaid orders from students.
                    Since ingredients and preparation costs are incurred immediately, it’s important that returns and cancellations are handled fairly.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">✅ Eligible Vendor Returns/Adjustments</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>The student fails to collect the order after preparation (and the canteen followed pickup timing correctly).</li>
                    <li>A system error caused duplicate or invalid orders.</li>
                    <li>Food was prepared but payment failed on the student’s end due to a platform issue.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">❌ Not Eligible for Return or Compensation</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Orders cancelled by the student after preparation has started.</li>
                    <li>Errors in food quality or hygiene that result in verified student complaints.</li>
                    <li>Misreporting or failure to prepare food within the specified time.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">🧾 Resolution Process</h3>
                <p className="text-text/80 leading-relaxed mb-10">
                    Report any issue to{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>{" "} within 24 hours.
                    Provide order details and supporting proof (like photos or logs).
                    Kantevo will mediate between the student and canteen for a fair outcome.
                </p>
            </section>
        </div>
    );
}