import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_PHONE, APP_NAME } from "@/lib/constants";

// TODO: Confirm legal entity name, registered address, and GSTIN, then replace
// the placeholders below before relying on these terms in court.
const LEGAL_ENTITY = APP_NAME;
const REGISTERED_ADDRESS = "Chennai, Tamil Nadu, India"; // TODO replace with full registered office address
const SUPPORT_EMAIL = "bharatonewaytaxi@gmail.com";
const JURISDICTION = "Chennai, Tamil Nadu";
const EFFECTIVE_DATE = "May 7, 2026";

export const metadata: Metadata = {
    title: `Terms & Conditions | ${APP_NAME}`,
    description: `Terms and conditions governing the use of ${APP_NAME} one-way taxi booking service across South India.`,
    alternates: { canonical: "https://onewaytaxi.ai/terms-and-conditions" },
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
        { "@type": "ListItem", position: 2, name: "Terms & Conditions", item: "https://onewaytaxi.ai/terms-and-conditions" },
    ],
});

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Terms & Conditions</li>
                        </ol>
                    </div>
                </nav>

                <section className="bg-gradient-to-br from-teal-900 to-emerald-900 py-16 lg:py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl lg:text-5xl font-bold text-white">Terms & Conditions</h1>
                        <p className="text-teal-100 mt-3">Effective {EFFECTIVE_DATE}</p>
                    </div>
                </section>

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 prose prose-teal">
                    <p>
                        These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the {LEGAL_ENTITY} website (&quot;Website&quot;), associated booking platforms, and the one-way drop taxi services we provide (collectively, the &quot;Services&quot;). By booking, using, or paying for our Services, you agree to be bound by these Terms.
                    </p>

                    <h2>1. About Us</h2>
                    <p>
                        {LEGAL_ENTITY} is a taxi booking aggregator and operator headquartered at {REGISTERED_ADDRESS}. We provide point-to-point and outstation drop taxi services across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Puducherry through a network of verified driver-partners.
                    </p>

                    <h2>2. Booking & Confirmation</h2>
                    <ul>
                        <li>Bookings can be placed via the Website, phone ({SUPPORT_PHONE}), WhatsApp, or email ({SUPPORT_EMAIL}).</li>
                        <li>A booking is confirmed only after we send written or verbal confirmation containing trip ID, vehicle category, fare estimate, and driver contact details.</li>
                        <li>You are responsible for providing accurate pickup, drop, contact, and traveller information. We are not liable for delays or missed pickups caused by inaccurate inputs.</li>
                        <li>Driver assignments are typically shared 30–60 minutes before pickup. We reserve the right to substitute the assigned driver/vehicle in case of breakdown, illness, or operational need with an equivalent or better category at no additional cost.</li>
                    </ul>

                    <h2>3. Fares, Inclusions & Exclusions</h2>
                    <p>
                        Fares are calculated as per-kilometre rate × actual road distance, with a minimum of 130 km on outstation drops. The fare displayed at booking includes:
                    </p>
                    <ul>
                        <li>Driver bata (allowance) for the trip duration</li>
                        <li>Highway tolls along the booked route</li>
                        <li>Goods and Services Tax (GST) at applicable rates</li>
                        <li>Fuel and standard vehicle maintenance costs</li>
                    </ul>
                    <p>The following are <strong>not</strong> included and will be billed separately when applicable:</p>
                    <ul>
                        <li>Night charges of ₹250–₹500 for trips between 10 PM and 6 AM</li>
                        <li>Inter-state border permit fees on cross-border routes</li>
                        <li>Parking fees at the destination</li>
                        <li>Waiting charges of ₹150–₹250/hour after the 30-minute free window</li>
                        <li>Detours, additional stops, or distance beyond the booked route</li>
                    </ul>

                    <h2>4. Payment</h2>
                    <ul>
                        <li>We accept UPI, debit/credit cards, net banking, and cash. An advance may be required for confirmation on long-haul or peak-season bookings.</li>
                        <li>Final billing is reconciled at trip end based on actual kilometres travelled, applicable extras, and any approved detours.</li>
                        <li>GST-compliant invoices are provided on request for corporate customers — share company name and GSTIN at booking time.</li>
                    </ul>

                    <h2>5. Cancellation & Refund Policy</h2>
                    <ul>
                        <li>Cancellations made <strong>more than 4 hours</strong> before scheduled pickup are free of charge.</li>
                        <li>Cancellations made <strong>within 4 hours</strong> of pickup attract a flat fee of ₹200.</li>
                        <li>No-show or cancellations after the driver reaches the pickup location attract a fee of ₹500 to cover the deadhead trip.</li>
                        <li>Refunds for eligible cancellations are processed within 3–5 working days to the original payment method.</li>
                        <li>Reschedules are free up to 2 hours before pickup, subject to driver availability.</li>
                    </ul>

                    <h2>6. Conduct & Safety</h2>
                    <ul>
                        <li>Smoking, consumption of alcohol, and carriage of inflammable, hazardous, or illegal substances inside the vehicle are strictly prohibited.</li>
                        <li>Travelling with pets requires prior intimation; some drivers/vehicles may not accept pet bookings.</li>
                        <li>Maximum passenger count is governed by the vehicle&apos;s registered seating capacity. Children must travel in age-appropriate restraints where applicable by law.</li>
                        <li>The driver may decline to continue a trip if any passenger&apos;s behaviour endangers safety, in which case the trip will be billed up to the point of refusal.</li>
                    </ul>

                    <h2>7. Liability & Insurance</h2>
                    <ul>
                        <li>All vehicles in our network carry valid commercial registration, fitness, permits, and third-party insurance as required under the Motor Vehicles Act, 1988.</li>
                        <li>Our liability for any claim arising out of the Services is limited to the fare paid for the specific trip. We are not liable for indirect, consequential, or speculative damages such as missed flights, lost business opportunities, or onward bookings.</li>
                        <li>You are responsible for the safety of personal belongings during the trip. We recommend not leaving valuables unattended in the vehicle.</li>
                    </ul>

                    <h2>8. Force Majeure</h2>
                    <p>
                        We are not liable for delays, cancellations, or non-performance caused by events beyond our reasonable control, including but not limited to: extreme weather, natural disasters, road closures, strikes, civil unrest, government restrictions, vehicle breakdowns despite reasonable maintenance, and traffic conditions.
                    </p>

                    <h2>9. Intellectual Property</h2>
                    <p>
                        All content on the Website — including text, graphics, logos, route data, fare calculators, and SEO copy — is the property of {LEGAL_ENTITY} and protected under applicable copyright and trademark laws. Reproduction, scraping, or redistribution without written consent is prohibited.
                    </p>

                    <h2>10. User Conduct on the Website</h2>
                    <ul>
                        <li>You may not use automated tools, bots, or scrapers to extract content, fares, or routes from the Website.</li>
                        <li>You may not interfere with the Website&apos;s security features or attempt to gain unauthorized access to any system.</li>
                    </ul>

                    <h2>11. Modifications</h2>
                    <p>
                        We may revise these Terms from time to time. Material changes will be notified on this page with an updated effective date. Continued use of the Services after such changes constitutes acceptance of the revised Terms.
                    </p>

                    <h2>12. Governing Law & Jurisdiction</h2>
                    <p>
                        These Terms are governed by the laws of India. Any dispute arising out of or in connection with these Terms or the Services shall be subject to the exclusive jurisdiction of courts in {JURISDICTION}.
                    </p>

                    <h2>13. Contact Us</h2>
                    <p>
                        Questions, complaints, or grievances regarding these Terms or the Services may be sent to:
                    </p>
                    <ul>
                        <li><strong>Phone:</strong> {SUPPORT_PHONE} (24/7)</li>
                        <li><strong>Email:</strong> {SUPPORT_EMAIL}</li>
                        <li><strong>Address:</strong> {REGISTERED_ADDRESS}</li>
                    </ul>

                    <p className="text-sm text-gray-500 mt-12">
                        These Terms are provided in English. In case of any conflict between this English version and any translation, the English version shall prevail.
                    </p>
                </article>
            </main>
            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}
