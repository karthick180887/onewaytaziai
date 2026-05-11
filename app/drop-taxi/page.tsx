import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { ALL_DISTRICTS } from "@/lib/districts";
import { getAllRoutes } from "@/lib/routes";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, MessageCircle, IndianRupee, Clock, Shield, MapPin, ArrowRight, CheckCircle2, Route, Calendar, CreditCard, Users } from "lucide-react";
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

export const metadata: Metadata = {
    title: "Drop Taxi — One Way Drop Service Across South India | OneWayTaxi.ai",
    description:
        "Drop taxi service across 220+ cities in Tamil Nadu, Kerala, Karnataka, AP, Telangana & Pondicherry. Pay only one-way from ₹13/km. Save 40% vs. round trip. 24/7 booking, verified drivers, all-inclusive fares.",
    alternates: { canonical: "https://onewaytaxi.ai/drop-taxi" },
    openGraph: {
        title: "Drop Taxi Service | OneWayTaxi.ai",
        description: "South India's #1 one-way drop taxi service. From ₹13/km. 220+ cities. 24/7.",
        url: "https://onewaytaxi.ai/drop-taxi",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Drop Taxi Service — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Drop Taxi Service | OneWayTaxi.ai", description: "Pay one-way only. From ₹13/km. 220+ cities.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
};

const dropTaxiFaqs = [
    { q: "What is a drop taxi?", a: "A drop taxi (also called one-way taxi) is a cab service where you pay only for the one-way distance from your pickup point to your drop location. Unlike traditional round-trip taxis, you don't pay for the return journey — making it 40-50% cheaper for outstation travel." },
    { q: "How is drop taxi cheaper than a round trip?", a: "In a round trip, you pay both ways plus driver halt charges. In a drop taxi, the operator (us) bears the risk of finding a return passenger. You pay only for the kilometres you actually travel, which translates to massive savings on outstation routes." },
    { q: "Do drop taxis charge for the return journey?", a: "No. The whole point of a drop taxi is that you pay only one-way. There's a 130-km minimum on outstation drops to cover the driver's return cost, but beyond that, you're billed exactly for the one-way distance you cover." },
    { q: "Are drop taxis available 24/7?", a: "Yes. We operate drop taxis 24 hours a day, 365 days a year, including weekends, public holidays, and festival days. Early morning (3-6 AM) and late-night drops are common bookings on our network." },
    { q: "What vehicle types are available for drop taxi?", a: `We offer 7 categories: Mini/Hatchback (₹13/km), Sedan including Etios/Dzire (₹14/km), SUV/Ertiga (₹19/km), and Innova Crysta (₹22/km). All vehicles are AC, GPS-tracked, and driven by background-verified drivers.` },
    { q: "Are tolls and driver charges included in the drop taxi fare?", a: "Yes — the displayed fare includes tolls, driver bata, and GST. The only situational extras are night charges (after 10 PM), inter-state permits (cross-border routes), parking at destination, and waiting beyond the free 30-minute window." },
    { q: "Can I book a drop taxi from any city in South India?", a: "We serve 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry. From major hubs like Chennai, Bangalore, Coimbatore, Hyderabad, Kochi, and Madurai to smaller towns, drivers are available with same-day availability in most cities." },
    { q: "How far in advance should I book a drop taxi?", a: "For best vehicle availability, book at least 4-6 hours ahead for outstation trips and 1-2 hours for airport drops. Last-minute bookings are accepted subject to availability — call us directly for fastest confirmation." },
];

const tier1And2 = ALL_DISTRICTS.filter(d => d.tier === 1 || d.tier === 2).sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
const topRoutes = getAllRoutes().filter(r => r.from.tier === 1 && r.to.tier <= 2).slice(0, 16);

const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dropTaxiFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

const serviceSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Drop Taxi — OneWayTaxi.ai",
    description: "One-way drop taxi service across South India. Pay only for one-way distance.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
    offers: { "@type": "Offer", priceSpecification: { "@type": "UnitPriceSpecification", price: 13, priceCurrency: "INR", unitText: "per km", referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 }, valueAddedTaxIncluded: true } },
});

const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Drop Taxi", item: "https://onewaytaxi.ai/drop-taxi" },
    ],
});

export default function DropTaxiHubPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Drop Taxi</li>
                        </ol>
                    </div>
                </nav>

                <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            <div className="text-center lg:text-left space-y-6 pt-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium">
                                    <Route className="h-4 w-4 text-emerald-300" /> Drop Taxi Service
                                </div>
                                <div className="mb-4 flex"><AllInclusiveBadge size="hero" /></div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                    One-way drop taxi across <span className="text-emerald-300">South India</span>
                                </h1>
                                <p className="text-lg text-teal-100 max-w-xl">
                                    Pay only one way. No return charges. Save up to 50% versus traditional round-trip taxis. 24/7 service across 220+ cities in Tamil Nadu, Kerala, Karnataka, AP, Telangana, and Pondicherry.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50 transition-colors">
                                        Book Now <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors">
                                        <Phone className="h-5 w-5" /> {SUPPORT_PHONE}
                                    </a>
                                </div>
                            </div>
                            <div className="lg:sticky lg:top-24"><BookingWidget /></div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">What is a drop taxi?</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                A <strong>drop taxi</strong> — also known as a <strong>one-way taxi</strong> — is a cab service where you pay only for the kilometres you actually travel from your pickup point to your destination. There&apos;s no return-journey charge, no driver-halt fee, and no minimum trip duration. It&apos;s the most cost-effective way to travel between South Indian cities for one-way trips like a relocation, weekend getaway, airport drop, business meeting, or pilgrimage.
                            </p>
                            <p>
                                In a traditional round-trip taxi, you pay for the journey both ways plus the driver&apos;s halt charges if you stay overnight at the destination. A drop taxi removes both of those costs because the operator bears the risk of finding a return passenger from your destination. The result: <strong>40–50% lower fares</strong> on the same route, with the same vehicle quality and driver standards.
                            </p>
                            <p>
                                At OneWayTaxi.ai, we operate one of South India&apos;s largest drop-taxi networks, serving 220+ cities across six states. Whether you need a Chennai-to-Bangalore corporate transfer, a Coimbatore-to-Munnar weekend trip, a Madurai-to-Rameswaram pilgrimage drop, or a late-night airport pickup, our drivers are available 24/7 at transparent per-kilometre rates.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Why drop taxi beats round trip</h2>
                        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Same comfort, same quality vehicles, same verified drivers — at a fraction of the round-trip price.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: IndianRupee, title: "Pay only one-way", text: "Save up to 50% on outstation trips. Billed only for actual kilometres travelled." },
                                { icon: Clock, title: "24/7 availability", text: "Drivers ready any hour, any day. Same-hour pickups in metro cities." },
                                { icon: Shield, title: "Verified drivers", text: "Background-checked, badge-licensed, 3+ years experience minimum." },
                                { icon: CheckCircle2, title: "All-inclusive fare", text: "Tolls, driver bata, GST included. Zero hidden charges." },
                            ].map(({ icon: Icon, title, text }) => (
                                <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100 text-teal-700 mb-4"><Icon className="h-6 w-6" /></div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1.5">{title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">How drop taxi works</h2>
                        <p className="text-center text-gray-600 mb-10">Four simple steps from booking to drop</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: MapPin, step: "1", title: "Enter pickup & drop", text: "Use our booking form, call us, or message on WhatsApp. Get an instant fixed fare." },
                                { icon: Calendar, step: "2", title: "Pick travel time", text: "Choose any date and time — including same-day, late night, or early morning." },
                                { icon: Users, step: "3", title: "Driver assigned", text: "Driver and vehicle details shared 30–60 minutes before pickup. Real-time tracking via WhatsApp." },
                                { icon: CreditCard, step: "4", title: "Pay only one-way", text: "Cash or UPI at trip end. GST invoice on request for corporate billing." },
                            ].map(({ icon: Icon, step, title, text }) => (
                                <div key={step} className="relative bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6">
                                    <div className="absolute -top-3 left-6 bg-teal-700 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">{step}</div>
                                    <Icon className="h-7 w-7 text-teal-700 mt-2 mb-3" />
                                    <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Drop taxi pricing</h2>
                        <p className="text-center text-gray-600 mb-10">Transparent per-kilometre rates. No surge. No hidden charges.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {VEHICLE_TYPES.slice(0, 4).map((v) => (
                                <div key={v.id} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                                    <div className="font-bold text-lg text-gray-900">{v.name}</div>
                                    <div className="text-3xl font-extrabold text-teal-700 mt-2">₹{v.price}<span className="text-base text-gray-500">/km</span></div>
                                    <div className="text-sm text-gray-500 mt-1">{v.seat} seats</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/fare-calculator" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold">
                                Calculate exact fare <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Popular drop taxi routes</h2>
                        <p className="text-gray-600 mb-8">Click any route for instant fare and booking</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {topRoutes.map((r) => (
                                <Link key={r.slug} href={`/route/${r.slug}`} className="group bg-gray-50 hover:bg-white hover:shadow-md rounded-xl border border-gray-200 hover:border-teal-300 p-4 transition-all">
                                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-900">
                                        <span>{r.from.name}</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                                        <span>{r.to.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{r.distanceKm} km</span>
                                        <span className="font-bold text-teal-700">₹{r.fareEstimate}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Drop taxi cities we serve</h2>
                        <p className="text-gray-600 mb-8">Drop taxi service available in {tier1And2.length}+ major South Indian cities. Click any city for local rates and routes.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {tier1And2.map((d) => (
                                <Link key={d.slug} href={`/drop-taxi-in-${d.slug}`} className="text-sm text-gray-700 hover:text-teal-700 hover:underline px-3 py-2 rounded-lg hover:bg-white transition-colors">
                                    Drop Taxi {d.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Frequently asked questions</h2>
                        <div className="space-y-3">
                            {dropTaxiFaqs.map((f, i) => (
                                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-200 hover:border-teal-300">
                                    <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                                        <span className="font-semibold text-gray-900 group-open:text-teal-800">{f.q}</span>
                                        <ArrowRight className="h-5 w-5 mt-0.5 text-teal-700 transition-transform group-open:rotate-90 shrink-0" />
                                    </summary>
                                    <div className="px-5 pb-5 text-gray-700 leading-relaxed">{f.a}</div>
                                </details>
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Link href="/faq" className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1">View all FAQs <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-teal-700 to-emerald-700 py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Book your drop taxi now</h2>
                        <p className="text-teal-100 mb-6 max-w-xl mx-auto">From ₹13/km, all-inclusive. Confirmation in under 5 minutes. Drivers ready 24/7.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50 transition-colors">Book Now <ArrowRight className="h-5 w-5" /></Link>
                            <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold transition-colors"><Phone className="h-5 w-5" /> {SUPPORT_PHONE}</a>
                            <a href={`https://wa.me/${phoneDigits.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"><MessageCircle className="h-5 w-5" /> WhatsApp</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceSchema }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}
