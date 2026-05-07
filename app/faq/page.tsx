import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, MessageCircle, ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Drop Taxi FAQ | One Way Taxi Booking, Fare & Cancellation — OneWayTaxi.ai",
    description:
        "Answers to 25+ common questions about one-way drop taxi booking, fare, cancellation, payment, drivers, vehicles, tolls, night charges and more across South India.",
    alternates: { canonical: "https://onewaytaxi.ai/faq" },
    openGraph: {
        title: "Drop Taxi FAQ | OneWayTaxi.ai",
        description: "Booking, fare, cancellation, payment, drivers, vehicles — all the answers in one place.",
        url: "https://onewaytaxi.ai/faq",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "OneWayTaxi.ai FAQ" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Drop Taxi FAQ | OneWayTaxi.ai",
        description: "All your one-way taxi questions answered. Booking, fare, cancellation, drivers and more.",
        images: ["/opengraph-image"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
};

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");
const sedanRate = VEHICLE_TYPES.find(v => v.id === "sedan")?.price ?? 14;
const innovaRate = VEHICLE_TYPES.find(v => v.id === "innova_crysta")?.price ?? 22;

type FaqItem = { q: string; a: string };
type FaqGroup = { heading: string; items: FaqItem[] };

const faqGroups: FaqGroup[] = [
    {
        heading: "Booking",
        items: [
            {
                q: "How do I book a one-way drop taxi with OneWayTaxi.ai?",
                a: `You can book in three ways: (1) use the booking form on our homepage or any city/route page, (2) call our 24/7 helpline at ${SUPPORT_PHONE}, or (3) message us on WhatsApp. Bookings are confirmed instantly with driver details shared 30–60 minutes before pickup.`,
            },
            {
                q: "How far in advance should I book a taxi?",
                a: "We recommend booking at least 4–6 hours in advance for outstation trips, and 1–2 hours for airport pickups. Last-minute bookings are also accepted subject to vehicle availability — call us directly for fastest confirmation.",
            },
            {
                q: "Do you provide taxis 24/7, including holidays and late nights?",
                a: "Yes. Our service runs 24/7, 365 days a year, including Sundays, public holidays, and festival days. Early morning (3–6 AM) and late-night drops are available across all serviced cities.",
            },
            {
                q: "Can I book a taxi for someone else (parent, friend, child)?",
                a: "Absolutely. During booking, share the traveller's name and contact number. Our driver will coordinate with the actual traveller, while billing details remain with you.",
            },
            {
                q: "Is there a mobile app for OneWayTaxi.ai?",
                a: "Currently bookings are handled through our website, phone, and WhatsApp — which keeps the process simple and avoids app installation friction. A native app is on our roadmap.",
            },
        ],
    },
    {
        heading: "Pricing & Fare",
        items: [
            {
                q: "How is the fare calculated for a one-way drop taxi?",
                a: `One-way fares are calculated as: distance (km) × per-km rate. Sedan starts at ₹${sedanRate}/km, SUV at ₹19/km, and Innova Crysta at ₹${innovaRate}/km. Driver bata, GST and tolls are included unless explicitly listed as extra (e.g. inter-state permits or parking).`,
            },
            {
                q: "Why is one-way taxi cheaper than a round trip?",
                a: "In a round trip, you pay for both directions plus driver halt charges. With OneWayTaxi.ai, you pay only for the kilometres you actually travel — typically 40–50% cheaper than round-trip operators. We bear the risk of finding a return passenger.",
            },
            {
                q: "Are tolls and driver bata included in the fare?",
                a: "Yes — tolls, driver allowance (bata), and GST are included in the displayed fare. The only extras (when applicable) are: night charges after 10 PM, inter-state permit fees, parking at the destination, and waiting charges beyond the free 30-minute window.",
            },
            {
                q: "Are there hidden charges I should know about?",
                a: "No hidden charges. The only situational add-ons are: (1) night charges (₹250–₹500) for trips after 10 PM, (2) waiting charges (₹150/hour after 30 free minutes), (3) inter-state permit on cross-border routes, and (4) parking fees at the destination. All of these are disclosed up-front during booking.",
            },
            {
                q: "Do you offer round-trip taxi services as well?",
                a: "Yes. While our specialty is one-way drop service, we also offer round-trip cabs, multi-day rentals, and local sightseeing packages. Round-trip pricing includes driver bata, halt charges, and a daily kilometre allowance.",
            },
            {
                q: "What is the minimum charge for a short trip?",
                a: "For one-way drops, we have a 130-km minimum billing on outstation routes. Local trips within a city are charged on actuals with a minimum of ₹500 (sedan).",
            },
        ],
    },
    {
        heading: "Vehicles & Drivers",
        items: [
            {
                q: "What types of vehicles do you offer?",
                a: `We offer 7 vehicle categories: Mini/Hatchback (4 seats, ₹13/km), Sedan (4–5 seats, ₹${sedanRate}/km — Etios, Dzire, Xcent), SUV with carrier (7+1 seats, ₹19/km — Ertiga, Innova), and Innova Crysta (premium, 7 seats, ₹${innovaRate}/km). All vehicles are AC, GPS-tracked, and well-maintained.`,
            },
            {
                q: "Are the drivers verified and trained?",
                a: "Every driver in our network is background-verified, holds a valid commercial driving licence with badge, and has at least 3 years of professional experience. Drivers undergo behaviour and route-knowledge briefings before joining our network.",
            },
            {
                q: "Can I request a specific vehicle model?",
                a: "You can request a category (Sedan, SUV, Crysta), but specific models within a category are subject to availability. If a particular model is critical (e.g. Innova Crysta vs. older Innova), call us before booking to confirm availability and any price difference.",
            },
            {
                q: "Will the driver speak my language?",
                a: "Most of our drivers speak Tamil, Kannada, Malayalam, Telugu, Hindi, and basic English. Drivers familiar with the destination state are preferred — for cross-state trips we typically assign drivers comfortable in both languages.",
            },
        ],
    },
    {
        heading: "Payment, Cancellation & Refund",
        items: [
            {
                q: "What payment methods do you accept?",
                a: "We accept UPI (PhonePe, Google Pay, Paytm), debit/credit cards, net banking, and cash. For booking confirmation, we typically take a small advance via UPI or a card hold. The balance can be paid to the driver in cash or UPI at trip end.",
            },
            {
                q: "Is there a cancellation fee?",
                a: "Cancellations made more than 4 hours before pickup are free. Cancellations within 4 hours incur a ₹200 service charge. No-show or cancellations after the driver reaches pickup attract a ₹500 charge.",
            },
            {
                q: "How do I get a refund if I cancel?",
                a: "Refunds for eligible cancellations are processed within 3–5 working days to the original payment source. UPI refunds are typically faster (within 24 hours). Contact our support team for refund tracking.",
            },
            {
                q: "Can I reschedule my booking?",
                a: "Yes — you can reschedule once for free up to 2 hours before pickup, subject to driver availability for the new slot. Call our support line to reschedule.",
            },
        ],
    },
    {
        heading: "Trip Experience",
        items: [
            {
                q: "What about night charges?",
                a: "Trips that begin or end between 10 PM and 6 AM attract a night charge of ₹250 (Sedan) to ₹500 (Innova Crysta). This is the same rate the driver pays for night halt and is non-negotiable per industry norms.",
            },
            {
                q: "How much waiting time is included?",
                a: "30 minutes of waiting time is included free at pickup. Beyond that, ₹150/hour applies for sedans and ₹250/hour for SUVs. For multi-stop trips, plan stops in advance to avoid waiting charges.",
            },
            {
                q: "Can I make multiple stops on the way?",
                a: "Yes — we offer up to 2 short stops on outstation drops free of charge (e.g. food break, restroom). Longer stops or major detours may add to the kilometre count and fare. Mention any planned stops at booking time.",
            },
            {
                q: "What if my flight is delayed for an airport pickup?",
                a: "We track flight arrivals automatically. Up to 60 minutes of free wait time is included for delayed arrivals (vs. the standard 30 mins). Beyond that, the standard waiting charge applies.",
            },
            {
                q: "Are inter-state permits handled by the driver?",
                a: "Yes — the driver handles all permit paperwork. For cross-border routes (e.g. TN→KA), inter-state permit fees may apply (typically ₹300–₹800 depending on the corridor). These are added to the final bill if applicable.",
            },
        ],
    },
    {
        heading: "Coverage & Support",
        items: [
            {
                q: "Which cities and states do you cover?",
                a: "We serve 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Puducherry. Major routes include Chennai-Bangalore, Bangalore-Coimbatore, Chennai-Madurai, Bangalore-Mysore, Chennai-Pondicherry and pilgrimage circuits to Tirupati, Sabarimala, Velankanni, and Rameswaram.",
            },
            {
                q: "Do you offer airport taxi service?",
                a: "Yes — we serve all major South Indian airports: Chennai, Bangalore, Hyderabad, Kochi, Coimbatore, Madurai, Trichy, Trivandrum, Mangalore, and Calicut. Airport pickups include flight tracking and 60-minute free waiting.",
            },
            {
                q: "How do I contact support during a trip?",
                a: `For any issue mid-trip — driver concern, route deviation, vehicle problem — call our 24/7 helpline at ${SUPPORT_PHONE} or message us on WhatsApp. Most issues are resolved within 10 minutes.`,
            },
            {
                q: "Do you provide GST invoices for corporate billing?",
                a: "Yes — we issue GST-compliant invoices on request, suitable for company reimbursement. Mention your company name and GSTIN at booking, or email us after the trip with trip details to receive an invoice.",
            },
        ],
    },
];

const allFaqs = faqGroups.flatMap(g => g.items);

const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
    })),
});

const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "FAQ", item: "https://onewaytaxi.ai/faq" },
    ],
});

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">FAQ</li>
                        </ol>
                    </div>
                </nav>

                <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900" />
                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium mb-6">
                            <HelpCircle className="h-4 w-4 text-emerald-300" />
                            Frequently Asked Questions
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
                            Answers to your one-way taxi questions
                        </h1>
                        <p className="text-lg text-teal-100 max-w-2xl mx-auto">
                            Booking, fare, cancellation, drivers, vehicles, tolls — everything you need to know before you ride.
                        </p>
                    </div>
                </section>

                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
                    {faqGroups.map((group) => (
                        <div key={group.heading}>
                            <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">{group.heading}</h2>
                            <div className="space-y-3">
                                {group.items.map((item, i) => (
                                    <details
                                        key={i}
                                        className="group bg-white rounded-xl border border-gray-200 hover:border-teal-300 transition-colors"
                                    >
                                        <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                                            <span className="font-semibold text-gray-900 group-open:text-teal-800">{item.q}</span>
                                            <ArrowRight className="h-5 w-5 mt-0.5 text-teal-700 transition-transform group-open:rotate-90 shrink-0" />
                                        </summary>
                                        <div className="px-5 pb-5 text-gray-700 leading-relaxed">{item.a}</div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="bg-gradient-to-br from-teal-50 to-emerald-50 border-y border-teal-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Still have a question?</h2>
                        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                            Our team is available 24/7 to help with bookings, route advice, and trip changes.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a
                                href={`tel:${phoneDigits}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors"
                            >
                                <Phone className="h-5 w-5" />
                                Call {SUPPORT_PHONE}
                            </a>
                            <a
                                href={`https://wa.me/${phoneDigits.replace("+", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-teal-700 text-teal-800 font-semibold hover:bg-teal-50 transition-colors"
                            >
                                <MessageCircle className="h-5 w-5" />
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}
