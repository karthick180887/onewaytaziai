import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_PHONE, GOOGLE_MAPS_URL } from "@/lib/constants";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";

const SUPPORT_EMAIL = "booking@onewaytaxi.ai";

export const metadata: Metadata = {
    title: "Contact OneWayTaxi.ai — 24/7 Taxi Booking | +91 81244 76010",
    description:
        "Contact OneWayTaxi.ai for 24/7 one-way taxi booking across South India. Call +91 81244 76010 or email booking@onewaytaxi.ai. Instant support!",
    alternates: {
        canonical: "https://onewaytaxi.ai/contact",
    },
    openGraph: {
        title: "Contact OneWayTaxi.ai — 24/7 Taxi Booking Support",
        description:
            "Reach OneWayTaxi.ai for affordable one-way drop taxi booking. Call +91 81244 76010, email booking@onewaytaxi.ai, or book online 24/7.",
        url: "https://onewaytaxi.ai/contact",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact OneWayTaxi.ai — 24/7 Taxi Booking",
        description:
            "Call +91 81244 76010 or email booking@onewaytaxi.ai for instant one-way taxi booking across South India.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

const faqs = [
    {
        question: "How do I book a taxi?",
        answer: `You can book a one-way taxi through our website by entering your pickup and drop locations, or call us directly at ${SUPPORT_PHONE}. Our team is available 24/7 to assist you with bookings.`,
    },
    {
        question: "What if I need to cancel my booking?",
        answer: "You can cancel your booking by calling our support team. Cancellations made more than 2 hours before the scheduled pickup are free. A nominal cancellation fee may apply for last-minute cancellations.",
    },
    {
        question: "Do you operate 24/7?",
        answer: "Yes! OneWayTaxi.ai operates 24 hours a day, 7 days a week, 365 days a year — including early mornings, late nights, weekends, and public holidays.",
    },
    {
        question: "Which cities do you cover?",
        answer: "We cover 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry. Major cities include Chennai, Bangalore, Coimbatore, Madurai, Kochi, Hyderabad, and many more.",
    },
];

function buildBreadcrumbJsonLd() {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://onewaytaxi.ai",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Contact",
                item: "https://onewaytaxi.ai/contact",
            },
        ],
    });
}

function buildContactPageJsonLd() {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact OneWayTaxi.ai",
        description:
            "Contact page for OneWayTaxi.ai — 24/7 one-way drop taxi service across South India.",
        url: "https://onewaytaxi.ai/contact",
        mainEntity: {
            "@type": "Organization",
            name: "OneWayTaxi.ai",
            url: "https://onewaytaxi.ai",
            telephone: SUPPORT_PHONE,
            email: SUPPORT_EMAIL,
            areaServed: [
                { "@type": "State", name: "Tamil Nadu" },
                { "@type": "State", name: "Kerala" },
                { "@type": "State", name: "Karnataka" },
                { "@type": "State", name: "Andhra Pradesh" },
                { "@type": "State", name: "Telangana" },
                { "@type": "State", name: "Pondicherry" },
            ],
            contactPoint: {
                "@type": "ContactPoint",
                telephone: SUPPORT_PHONE,
                contactType: "customer service",
                availableLanguage: ["English", "Tamil", "Hindi"],
                hoursAvailable: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ],
                    opens: "00:00",
                    closes: "23:59",
                },
            },
        },
    });
}

function buildFaqJsonLd() {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    });
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd() }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildContactPageJsonLd() }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildFaqJsonLd() }}
            />

            <main>
                {/* Hero Section */}
                <section
                    className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 overflow-hidden"
                    aria-label="Contact us"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                            Contact Us
                        </h1>
                        <p className="mt-4 text-lg lg:text-xl text-teal-100/90 max-w-2xl mx-auto">
                            We are here to help you 24/7. Reach out for bookings,
                            support, or any questions about our one-way taxi
                            service.
                        </p>
                    </div>
                </section>

                {/* Breadcrumb Navigation */}
                <nav
                    aria-label="Breadcrumb"
                    className="bg-white border-b border-gray-200"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-2 text-sm text-gray-600">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-teal-700 transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>
                                <span className="text-teal-900 font-medium">
                                    Contact
                                </span>
                            </li>
                        </ol>
                    </div>
                </nav>

                {/* Contact Cards Grid */}
                <section className="py-16 lg:py-20" aria-label="Contact information">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Phone Card */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-50">
                                    <Phone className="h-7 w-7 text-teal-900" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Phone
                                </h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    Call us for instant booking
                                </p>
                                <a
                                    href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                                    className="text-teal-900 font-bold text-lg hover:text-teal-700 transition-colors underline decoration-teal-300 underline-offset-4"
                                    aria-label={`Call us at ${SUPPORT_PHONE}`}
                                >
                                    {SUPPORT_PHONE}
                                </a>
                            </div>

                            {/* Email Card */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-50">
                                    <Mail className="h-7 w-7 text-teal-900" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Email
                                </h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    Write to us anytime
                                </p>
                                <a
                                    href={`mailto:${SUPPORT_EMAIL}`}
                                    className="text-teal-900 font-bold text-lg hover:text-teal-700 transition-colors underline decoration-teal-300 underline-offset-4"
                                    aria-label={`Email us at ${SUPPORT_EMAIL}`}
                                >
                                    {SUPPORT_EMAIL}
                                </a>
                            </div>

                            {/* Operating Hours Card */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-50">
                                    <Clock className="h-7 w-7 text-teal-900" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Operating Hours
                                </h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    Always available
                                </p>
                                <p className="text-teal-900 font-bold text-lg">
                                    24/7, 365 Days
                                </p>
                            </div>

                            {/* Service Coverage Card */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-50">
                                    <MapPin className="h-7 w-7 text-teal-900" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Service Area
                                </h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    6 states, 220+ cities
                                </p>
                                <p className="text-teal-900 font-semibold text-sm leading-relaxed">
                                    Tamil Nadu, Kerala, Karnataka, Andhra
                                    Pradesh, Telangana &amp; Pondicherry
                                </p>
                            </div>
                        </div>

                        {/* Google Maps Link */}
                        <div className="mt-8 text-center">
                            <a
                                href={GOOGLE_MAPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-teal-900 font-medium hover:text-teal-700 transition-colors"
                                aria-label="View OneWayTaxi.ai on Google Maps"
                            >
                                <MapPin className="h-5 w-5" />
                                Find us on Google Maps
                            </a>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section
                    className="py-16 lg:py-20 bg-white"
                    aria-label="Frequently asked questions"
                >
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <MessageCircle className="h-6 w-6 text-teal-900" />
                                <span className="text-sm font-semibold text-teal-900 uppercase tracking-wider">
                                    FAQs
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Frequently Asked Questions
                            </h2>
                            <p className="mt-3 text-gray-600">
                                Quick answers to common questions about our
                                service.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-gray-200 p-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    className="py-16 lg:py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900"
                    aria-label="Book a taxi"
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Book Your One-Way Taxi Now
                        </h2>
                        <p className="text-lg text-teal-100/90 mb-8 max-w-2xl mx-auto">
                            Starting from just Rs.13/km. Pay only for one way -- no
                            return fare, no hidden charges. Available 24/7 across
                            South India.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                                className="flex items-center gap-2 bg-white text-teal-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transition-colors shadow-lg"
                                aria-label={`Call ${SUPPORT_PHONE} to book a taxi`}
                            >
                                <Phone className="h-5 w-5" />
                                {SUPPORT_PHONE}
                            </a>
                            <Link
                                href="/"
                                className="flex items-center gap-2 bg-teal-700/50 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700/70 transition-colors border border-white/20"
                            >
                                Book Online
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
