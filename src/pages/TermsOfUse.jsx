// pages/TermsOfUse.jsx

import SEO from "../components/SEO";

export default function TermsOfUse() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">

            <SEO
                title="Terms of Use"
                description="Review the terms and conditions for using Kantevo’s digital canteen ordering platform."
                canonicalPath="/terms-of-use"
            />

            {/* Hero Section */}
            <section className="text-center mt-10 max-w-4xl" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
                    📜 Terms of Use
                </h1>
                <p className="mt-4 text-lg text-text/80 leading-relaxed">
                    These Terms govern your use of the Kantevo platform. By registering, you accept and agree to comply with these Terms.
                </p>
            </section>

            {/* For Students */}
            <section className="mt-16 max-w-5xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Students</h2>

                <h3 className="text-xl font-semibold mb-2 text-text">Eligibility</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    You must be a student of a listed college/school and provide valid registration details.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Use of Platform</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    You may browse menus, place orders, make payments, and generate tokens. Misuse, fraud, or attempts to manipulate payments will lead to account suspension.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Payments & Refunds</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    Payments are processed through secure third-party gateways. Refunds are provided if an order is canceled before preparation or if the canteen fails to deliver.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Limitations</h3>
                <p className="text-text/80 leading-relaxed mb-10">
                    Kantevo is not responsible for food quality or safety. Any dispute related to product quality must be addressed with the canteen.
                </p>
            </section>

            {/* For Canteen Owners */}
            <section className="mt-16 max-w-5xl mb-20" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4 text-text">For Canteen Owners</h2>

                <h3 className="text-xl font-semibold mb-2 text-text">Eligibility</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    You must be a verified canteen owner or authorized representative of a college/school cafeteria.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Responsibilities</h3>
                <ul className="list-disc list-inside text-text/80 mb-4 space-y-1">
                    <li>Provide accurate menu, prices, and timings.</li>
                    <li>Ensure timely preparation and delivery of student orders.</li>
                    <li>Maintain hygiene and comply with food safety laws.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-text">Payments & Settlements</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    Payments are collected by Kantevo and settled periodically after deducting applicable platform fees. Disputes are subject to verification.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-text">Termination</h3>
                <p className="text-text/80 leading-relaxed mb-10">
                    Kantevo reserves the right to suspend or terminate canteen accounts in case of repeated complaints, fraud, or policy violations.
                </p>
            </section>

            <section className="mt-16 max-w-5xl mb-20" data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-2 text-text">Governing Law</h3>
                <p className="text-text/80 leading-relaxed mb-4">
                    These Terms are governed by Indian law. Any disputes shall be subject to the jurisdiction of courts located in [Your City].
                </p>

                <p className="text-text/80 text-sm mb-10">
                    For legal queries, contact us at{" "}
                    <a href="mailto:support@kantevo.com" className="text-primary">
                        support@kantevo.com
                    </a>.
                </p>
            </section>
        </div>
    );
}