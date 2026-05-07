import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_PHONE, APP_NAME } from "@/lib/constants";

const SUPPORT_EMAIL = "bharatonewaytaxi@gmail.com";
const EFFECTIVE_DATE = "May 7, 2026";
const REGISTERED_ADDRESS = "Chennai, Tamil Nadu, India"; // TODO replace with full registered office address

export const metadata: Metadata = {
    title: `Privacy Policy | ${APP_NAME}`,
    description: `How ${APP_NAME} collects, uses, stores, and protects your personal data when you book one-way taxi services. Compliant with Indian DPDP Act 2023.`,
    alternates: { canonical: "https://onewaytaxi.ai/privacy-policy" },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
};

const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://onewaytaxi.ai/privacy-policy" },
    ],
});

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Privacy Policy</li>
                        </ol>
                    </div>
                </nav>

                <section className="bg-gradient-to-br from-teal-900 to-emerald-900 py-16 lg:py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl lg:text-5xl font-bold text-white">Privacy Policy</h1>
                        <p className="text-teal-100 mt-3">Effective {EFFECTIVE_DATE}</p>
                    </div>
                </section>

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 prose prose-teal">
                    <p>
                        {APP_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This Privacy Policy explains what personal data we collect when you use our website and taxi booking services, how we use it, who we share it with, and the rights you have under Indian law including the Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;).
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect the following categories of information:</p>
                    <ul>
                        <li><strong>Booking details:</strong> name, mobile number, email, pickup and drop addresses, travel date and time, vehicle preference, traveller details (if booking on behalf of someone else).</li>
                        <li><strong>Payment data:</strong> last four digits of cards, UPI handle (transaction reference only), invoice address, GSTIN for corporate billing. We do not store full card numbers, CVV, or banking credentials — these are handled directly by our PCI-compliant payment gateways.</li>
                        <li><strong>Trip data:</strong> route, distance, duration, fare, driver and vehicle assigned, GPS-derived location during the active trip.</li>
                        <li><strong>Communication records:</strong> WhatsApp messages, call logs, and emails exchanged for booking, support, or feedback purposes.</li>
                        <li><strong>Website analytics:</strong> IP address, browser type, device type, referrer URL, pages viewed, session duration, and approximate geographic location (city level). Collected via cookies and analytics tools.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <ul>
                        <li>To confirm bookings, dispatch drivers, and complete trips.</li>
                        <li>To send transactional updates via SMS, email, and WhatsApp (driver assignment, ETA, fare reconciliation, invoices).</li>
                        <li>To process payments, refunds, and GST invoicing.</li>
                        <li>To provide 24/7 customer support, resolve grievances, and handle disputes.</li>
                        <li>To improve our service quality through aggregated analysis of trip patterns, route demand, and driver performance.</li>
                        <li>To send promotional communications, only if you have opted in. You can opt out at any time.</li>
                        <li>To comply with legal obligations such as tax filings, regulatory reporting, and lawful requests from authorities.</li>
                    </ul>

                    <h2>3. Legal Basis for Processing</h2>
                    <p>
                        Under the DPDP Act, we process your personal data primarily on the basis of (a) <strong>consent</strong> you provide at booking, (b) the <strong>legitimate uses</strong> permitted by the Act for performing the contract you entered into, and (c) <strong>legal compliance</strong> requirements such as tax and motor vehicle regulations.
                    </p>

                    <h2>4. Sharing Your Information</h2>
                    <p>We share personal data only as necessary to deliver the Services:</p>
                    <ul>
                        <li><strong>Driver-partners:</strong> name, contact number, pickup/drop addresses (only the driver assigned to your trip).</li>
                        <li><strong>Payment gateways:</strong> billing details required to process the transaction.</li>
                        <li><strong>Communication providers:</strong> SMS, email, and WhatsApp Business API providers to deliver booking updates.</li>
                        <li><strong>Cloud hosting and analytics:</strong> trusted vendors who process data on our behalf under data-processing agreements.</li>
                        <li><strong>Government / regulatory authorities:</strong> when compelled by law, court order, or to protect against fraud and safety threats.</li>
                    </ul>
                    <p>We do not sell your personal data to third parties for advertising or any other purpose.</p>

                    <h2>5. Cookies & Tracking</h2>
                    <p>
                        Our Website uses cookies for: (a) essential site functioning (session, security), (b) analytics (anonymised page-level traffic), and (c) optional remarketing if you have consented. You can disable cookies through your browser; however, some features such as fare calculator memory may not work as expected.
                    </p>

                    <h2>6. Data Retention</h2>
                    <ul>
                        <li>Booking and trip records: retained for <strong>7 years</strong> in compliance with tax and motor vehicle regulations.</li>
                        <li>Marketing preferences and consent records: retained until you withdraw consent.</li>
                        <li>Analytics data: retained in aggregated, anonymised form for up to 26 months.</li>
                    </ul>

                    <h2>7. Your Rights Under the DPDP Act</h2>
                    <p>As a Data Principal, you have the right to:</p>
                    <ul>
                        <li><strong>Access</strong> a summary of personal data we hold about you and how we use it.</li>
                        <li><strong>Correction</strong> of inaccurate or outdated personal data.</li>
                        <li><strong>Erasure</strong> of personal data when no longer needed for the purpose collected, subject to legal retention.</li>
                        <li><strong>Withdrawal of consent</strong> for processing where consent is the legal basis. Withdrawal does not affect prior lawful processing.</li>
                        <li><strong>Grievance redressal</strong> through our designated officer below.</li>
                        <li><strong>Nomination</strong> of another person to exercise these rights in case of incapacity or death.</li>
                    </ul>
                    <p>To exercise any right, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the subject &quot;Privacy Request&quot;. We will respond within 30 days as required by the Act.</p>

                    <h2>8. Security Safeguards</h2>
                    <p>
                        We implement industry-standard safeguards including TLS encryption for data in transit, encrypted storage at rest, access controls, audit logs, and regular security reviews. Despite these measures, no system is completely immune to risk; please use a strong password and protect your devices.
                    </p>

                    <h2>9. Children&apos;s Data</h2>
                    <p>
                        Our Services are not directed at children under 18. We do not knowingly collect personal data from children except as part of a parent or guardian&apos;s booking on their behalf. If you believe we have collected such data inadvertently, please contact us for prompt deletion.
                    </p>

                    <h2>10. Cross-Border Transfers</h2>
                    <p>
                        Personal data is primarily stored in data centres located in India. If we transfer data outside India for hosting or processing, we will ensure such transfers are made only to jurisdictions notified as permissible by the Government of India under the DPDP Act.
                    </p>

                    <h2>11. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Material changes will be communicated via the Website with an updated effective date. We encourage you to review the Policy periodically.
                    </p>

                    <h2>12. Grievance Officer</h2>
                    <p>
                        In accordance with the Information Technology Act, 2000 and the DPDP Act, 2023, our Grievance Officer can be reached at:
                    </p>
                    <ul>
                        <li><strong>Email:</strong> {SUPPORT_EMAIL}</li>
                        <li><strong>Phone:</strong> {SUPPORT_PHONE}</li>
                        <li><strong>Address:</strong> {REGISTERED_ADDRESS}</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-12">
                        TODO: Once the registered legal entity name is finalised, replace &quot;{APP_NAME}&quot; references and the registered address placeholder above.
                    </p>
                </article>
            </main>
            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}
