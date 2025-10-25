// pages/RefundPolicy.jsx

import SEO from "../components/SEO";

export default function RefundPolicy() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">

            <SEO
                title="Refund Policy"
                description="Learn about Kantevo’s refund process and conditions for transactions made on our platform."
                canonicalPath="/refund-policy"
            />

            {/* Hero Section */}
            <section className="text-center mt-10 max-w-4xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
                    💰 Refund Policy
                </h1>
                <p className="mt-4 text-lg text-text/80 leading-relaxed">
                    Clear and fair guidelines for students and canteen partners.
                </p>
            </section>

            {/* For Students */}
            <section className="mt-16 max-w-5xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Students</h2>
                <p className="text-text/80 leading-relaxed mb-4">
                    Kantevo and our canteen partners strive to provide you with accurate, fresh, and timely food orders.
                    Refunds are applicable only under specific conditions, as outlined below.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">✅ Eligible for Refund</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>The payment was made, but the order did not get confirmed due to a system error.</li>
                    <li>The order was cancelled by the canteen before preparation began (e.g., item unavailable).</li>
                    <li>The student received the wrong order or spoiled/contaminated food, verified by the Kantevo support team.</li>
                    <li>The order was charged multiple times accidentally.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">❌ Not Eligible for Refund</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Change of mind or wrong item selection by the student.</li>
                    <li>Late pickup leading to food cooling or spoilage.</li>
                    <li>Partial consumption of food before raising a complaint.</li>
                    <li>Disputes raised after 1 hour of order collection.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">🧾 Refund Process</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    Report the issue via the Kantevo App/Website or by emailing{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>{" "} within 30 minutes of receiving the order.
                    Provide your Order ID, payment reference, and (if applicable) a clear photo of the item.
                    The Kantevo support team will verify the claim with the canteen.
                    Once approved, the refund will be processed within 5–7 business days to your original payment method (UPI, card, wallet, etc.).
                    If the payment was made using the Kantevo Wallet, the refund will be credited back to your wallet balance.
                </p>
            </section>

            {/* For Canteen Owners */}
            <section className="mt-16 max-w-5xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Canteen Owners</h2>
                <p className="text-text/80 leading-relaxed mb-4">
                    Canteen Owners are valued partners on the Kantevo platform and receive payments for every confirmed order they fulfill.
                    Refunds or payment adjustments for canteen owners apply only under certain verified circumstances.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">✅ Eligible for Refund / Compensation</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>The student fails to collect a prepaid order, despite the canteen preparing it correctly and on time.</li>
                    <li>A system error or app malfunction resulted in an invalid or duplicate order.</li>
                    <li>The payment from a student failed due to a technical glitch, even though the canteen prepared the order as per confirmation.</li>
                    <li>Kantevo may issue a compensation credit or reverse the platform commission after verifying the situation.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">❌ Not Eligible for Refund / Compensation</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Orders cancelled by the student after preparation has started.</li>
                    <li>Verified food quality or hygiene complaints raised by students.</li>
                    <li>Claims submitted after 24 hours of the transaction.</li>
                    <li>Misuse or manipulation of the refund/compensation system, which may lead to account review or suspension.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">🧾 Refund / Adjustment Process</h3>
                <p className="text-text/80 leading-relaxed mb-10">
                    Report any concern to{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>{" "} within 24 hours of the incident.
                    Provide your Order ID, date/time, and any supporting evidence (such as photos or order logs).
                    The Kantevo Support Team will review the issue, verify the data, and communicate the outcome.
                    Approved refunds or adjustments will be processed as credits to the canteen’s Kantevo account or as deductions/adjustments in the next payout cycle.
                </p>
            </section>
        </div>
    );
}