import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { ALL_DISTRICTS } from "@/lib/districts";
import { getAllRoutes } from "@/lib/routes";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, ArrowRight, Briefcase, Mountain, Calendar } from "lucide-react";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

export const metadata: Metadata = {
    title: "Outstation Cabs — One Way & Round Trip Across South India | OneWayTaxi.ai",
    description:
        "Outstation cab service across Tamil Nadu, Kerala, Karnataka, AP, Telangana & Pondicherry. From ₹13/km. Sedan, SUV, Innova Crysta. 24/7 booking. 220+ cities covered.",
    alternates: { canonical: "https://onewaytaxi.ai/outstation-cabs" },
    openGraph: {
        title: "Outstation Cabs Across South India | OneWayTaxi.ai",
        description: "Outstation taxi service for business, leisure, and pilgrimage trips. From ₹13/km.",
        url: "https://onewaytaxi.ai/outstation-cabs",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Outstation Cabs — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Outstation Cabs | OneWayTaxi.ai", description: "Outstation taxi from ₹13/km. 220+ cities. 24/7.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
};

const outstationFaqs = [
    { q: "What is an outstation cab?", a: "An outstation cab is a taxi service for inter-city or long-distance trips that go beyond the city limits — typically 130 km or more. Outstation cabs are available in both one-way (drop) and round-trip formats, with vehicles equipped for multi-hour highway travel." },
    { q: "How is the outstation cab fare calculated?", a: `Outstation fares are calculated as: actual road distance × per-kilometre rate. Sedan rates start at ₹14/km, SUV at ₹19/km, and Innova Crysta at ₹22/km. The fare includes tolls, driver bata, and GST. There's a 130-km minimum on outstation drops to cover the driver's deadhead return.` },
    { q: "Do you provide outstation cabs for multi-day trips?", a: "Yes — for multi-day round trips, we charge a daily kilometre allowance (typically 250 km/day), driver bata per night halt, and the actual distance covered. For 1-3 day trips, a round-trip cab is usually most economical; longer than that, consider a daily rental." },
    { q: "What are night driving charges for outstation cabs?", a: "If your trip starts or ends between 10 PM and 6 AM, a night charge of ₹250 (sedan) to ₹500 (Crysta) applies. This compensates the driver for night-time fatigue and overnight halt at destination if applicable." },
    { q: "Can I book an outstation cab for a same-day return?", a: "Absolutely. Same-day round trips are popular for business meetings, court hearings, hospital visits, and quick weekend visits. You'll be charged for the actual round-trip distance with no halt charges since the driver returns the same day." },
    { q: "Are inter-state permits handled by the driver?", a: "Yes — the driver handles all permit paperwork at state borders. Inter-state permit fees (typically ₹300-₹800 depending on the corridor) are added to the final bill if applicable. We disclose this upfront at booking." },
    { q: "Which outstation cab is best for my trip?", a: "For 2 adults: Sedan (Etios/Dzire) is most economical. For 3-4 adults with luggage: SUV (Ertiga) gives more space. For 5-7 adults or extended families: Innova Crysta is the standard choice. For 8+ travellers: Tempo Traveller. Call us if you're unsure." },
];

const tier1Districts = ALL_DISTRICTS.filter(d => d.tier === 1).sort((a, b) => a.name.localeCompare(b.name));
const tier2Districts = ALL_DISTRICTS.filter(d => d.tier === 2).sort((a, b) => a.name.localeCompare(b.name));
const allTopRoutes = getAllRoutes().filter(r => r.from.tier === 1 && r.to.tier <= 2 && r.distanceKm >= 130).slice(0, 20);

const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: outstationFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

const serviceSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Outstation Cabs — OneWayTaxi.ai",
    description: "Outstation cab service for inter-city travel across South India.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
    offers: { "@type": "Offer", priceSpecification: { "@type": "UnitPriceSpecification", price: 13, priceCurrency: "INR", unitText: "per km" } },
});

const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Outstation Cabs", item: "https://onewaytaxi.ai/outstation-cabs" },
    ],
});

export default function OutstationCabsHubPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Outstation Cabs</li>
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
                                    <Mountain className="h-4 w-4 text-emerald-300" /> Outstation Cab Service
                                </div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                    Outstation cabs across <span className="text-emerald-300">South India</span>
                                </h1>
                                <p className="text-lg text-teal-100 max-w-xl">
                                    Inter-city taxi service for business meetings, weekend getaways, pilgrimages, and family trips. One-way and round-trip options. From ₹13/km, all-inclusive.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Outstation Cab <ArrowRight className="h-5 w-5" /></Link>
                                    <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><Phone className="h-5 w-5" /> {SUPPORT_PHONE}</a>
                                </div>
                            </div>
                            <div className="lg:sticky lg:top-24"><BookingWidget /></div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">What are outstation cabs?</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                <strong>Outstation cabs</strong> are taxis booked for inter-city or long-distance journeys, typically covering distances of 130 km or more. They&apos;re built for highway travel — all our outstation vehicles have AC, comfortable seating, ample luggage space, GPS tracking, and are driven by professional drivers familiar with major South Indian highway routes.
                            </p>
                            <p>
                                Outstation cabs come in two flavours: <strong>one-way drops</strong> (you pay only for the distance to your destination, ideal for relocations or one-way airport drops to another city) and <strong>round trips</strong> (you pay for the return journey, ideal for same-day business trips or 1-3 day weekend getaways). At OneWayTaxi.ai, both are available 24/7 with the same fleet of verified drivers.
                            </p>
                            <p>
                                We cover all major South Indian corridors — Chennai-Bangalore (NH48), Chennai-Madurai (NH45), Bangalore-Mysore (Mysore Expressway), Hyderabad-Bangalore (NH44), Coimbatore-Kochi (NH544), and dozens more. Pilgrimage circuits to Tirupati, Sabarimala, Velankanni, Rameswaram, and Madurai Meenakshi are also among our most-booked routes.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">When to choose an outstation cab</h2>
                        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                            {[
                                { icon: Briefcase, title: "Business travel", text: "Same-day or overnight client meetings, court hearings, conferences, factory visits. Book a sedan or SUV with corporate GST invoicing." },
                                { icon: Mountain, title: "Weekend getaways", text: "Hill stations like Munnar, Ooty, Kodaikanal, Coorg, Yercaud. Heritage sites like Hampi, Mahabalipuram. Beach destinations like Pondicherry, Kanyakumari." },
                                { icon: Calendar, title: "Pilgrimage trips", text: "Tirupati darshan circuits, Sabarimala (Mandala season), Velankanni Marian shrine, Rameswaram, Madurai Meenakshi, Mookambika temple." },
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Outstation cab rates</h2>
                        <p className="text-center text-gray-600 mb-10">Same per-km rate for one-way and round-trip outstation</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {VEHICLE_TYPES.slice(0, 4).map((v) => (
                                <div key={v.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-center">
                                    <div className="font-bold text-lg text-gray-900">{v.name}</div>
                                    <div className="text-3xl font-extrabold text-teal-700 mt-2">₹{v.price}<span className="text-base text-gray-500">/km</span></div>
                                    <div className="text-sm text-gray-500 mt-1">{v.seat} seats</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 max-w-3xl mx-auto mt-8 text-sm text-gray-700">
                            <strong className="text-amber-900">Inclusions:</strong> Fuel, tolls, driver bata, GST.
                            <strong className="text-amber-900 ml-3">Extras:</strong> Night charges (10 PM–6 AM), inter-state permits (cross-border), parking at destination, waiting beyond 30 mins free window.
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Top outstation routes</h2>
                        <p className="text-gray-600 mb-8">Most-booked outstation corridors across South India</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {allTopRoutes.map((r) => (
                                <Link key={r.slug} href={`/route/${r.slug}`} className="group bg-white hover:shadow-md rounded-xl border border-gray-200 hover:border-teal-300 p-4 transition-all">
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

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Outstation cabs from major cities</h2>
                        <p className="text-gray-600 mb-6">Tap a city for outstation cab rates and routes from there</p>
                        <h3 className="font-semibold text-gray-700 mb-3">Tier 1 hubs</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
                            {tier1Districts.map((d) => (
                                <Link key={d.slug} href={`/outstation-cabs-in-${d.slug}`} className="text-sm text-gray-700 hover:text-teal-700 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    Outstation Cabs {d.name}
                                </Link>
                            ))}
                        </div>
                        <h3 className="font-semibold text-gray-700 mb-3">Other major cities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {tier2Districts.map((d) => (
                                <Link key={d.slug} href={`/outstation-cabs-in-${d.slug}`} className="text-sm text-gray-700 hover:text-teal-700 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    {d.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Outstation cab FAQs</h2>
                        <div className="space-y-3">
                            {outstationFaqs.map((f, i) => (
                                <details key={i} className="group bg-white rounded-xl border border-gray-200 hover:border-teal-300">
                                    <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                                        <span className="font-semibold text-gray-900 group-open:text-teal-800">{f.q}</span>
                                        <ArrowRight className="h-5 w-5 mt-0.5 text-teal-700 transition-transform group-open:rotate-90 shrink-0" />
                                    </summary>
                                    <div className="px-5 pb-5 text-gray-700 leading-relaxed">{f.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-teal-700 to-emerald-700 py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Book your outstation cab now</h2>
                        <p className="text-teal-100 mb-6">From ₹13/km. Verified drivers. 24/7 availability across 220+ cities.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Now <ArrowRight className="h-5 w-5" /></Link>
                            <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold"><Phone className="h-5 w-5" /> Call Us</a>
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
