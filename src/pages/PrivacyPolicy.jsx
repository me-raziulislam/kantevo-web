// pages/PrivacyPolicy.jsx
export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="text-center mt-10 max-w-4xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
                    🔒 Privacy Policy
                </h1>
                <p className="mt-4 text-lg text-text/80 leading-relaxed">
                    At Kantevo, we are committed to safeguarding your privacy. This policy explains how we collect, use, and protect information for both students and canteen owners.
                </p>
            </section>

            {/* For Students */}
            <section className="mt-16 max-w-5xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Students</h2>

                <h3 className="text-xl font-semibold mb-2 text-text">Information We Collect</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Personal details: name, email, mobile number, college.</li>
                    <li>Order details: items purchased, transaction amounts, tokens.</li>
                    <li>Device and usage data: browser type, IP address, app usage.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">How We Use Your Information</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    We process your information to place orders, confirm payments, generate order tokens, notify about order status, and improve personalization (e.g., showing your frequent items).
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Sharing of Data</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    We only share essential order details with the respective canteen to fulfill your request. We never sell your personal data to third parties.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Your Rights</h3>
                <p>
                    You can request account deletion, correction of details, or opt-out
                    from marketing communication. Contact{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>{" "}
                    for assistance.
                </p>
            </section>

            {/* For Canteen Owners */}
            <section className="mt-16 max-w-5xl mb-20" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Canteen Owners</h2>

                <h3 className="text-xl font-semibold mb-2 text-text">Information We Collect</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Business details: canteen name, registration, contact info.</li>
                    <li>Menu and pricing details, operational timings.</li>
                    <li>Financial details: bank/UPI account for order settlements.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">How We Use Your Information</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    Information is used to display your canteen to students, process incoming orders, calculate settlements, and provide performance analytics.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Data Security</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    We use encryption, role-based access, and secure servers. Financial data is handled by trusted payment gateways and not stored by us.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Retention</h3>
                <p className="text-text/80 leading-relaxed">
                    Business data is retained as long as your canteen is active on our platform or as required by law.
                </p>
            </section>

            <p className="text-text/80 text-sm mb-10">
                This policy may be updated from time to time. Continued use of Kantevo after updates constitutes acceptance of changes.
            </p>
        </div>
    );
}