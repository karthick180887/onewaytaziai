import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { getAllRoutes } from "@/lib/routes";
import { ALL_DISTRICTS } from "@/lib/districts";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, MessageCircle, ArrowRight, IndianRupee, Clock, CheckCircle2, RefreshCw, MapPin } from "lucide-react";
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

export const metadata: Metadata = {
    title: "Round Trip Taxi | Outstation Round Trip Cabs From ₹13/km — OneWayTaxi.ai",
    description:
        "Round trip taxi service for same-day or multi-day outstation trips across South India. AC sedan, SUV, Innova Crysta. Driver bata + 250 km/day allowance. Verified drivers, 24/7 support.",
    alternates: { canonical: "https://onewaytaxi.ai/round-trip-taxi" },
    openGraph: {
        title: "Round Trip Taxi Service | OneWayTaxi.ai",
        description: "Round-trip cabs for business trips, weekend tours, and pilgrimages across South India.",
        url: "https://onewaytaxi.ai/round-trip-taxi",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Round Trip Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Round Trip Taxi | OneWayTaxi.ai", description: "Round-trip cabs from ₹13/km. 220+ cities.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

const roundTripFaqs = [
    { q: "When should I book a round-trip taxi instead of one-way?", a: "Book round-trip when you need the same vehicle for the return — same-day business meetings, 1-3 day weekend getaways, sightseeing tours where you'll visit multiple stops, and trips where local transport at the destination is unreliable. For one-direction relocations or one-way airport drops, a one-way drop taxi is cheaper." },
    { q: "How is round-trip taxi fare calculated?", a: "Round-trip = (per-km rate × actual round-trip distance) + driver bata + night halt charges (if applicable). For multi-day trips, a daily kilometre allowance of 250 km applies. The fare includes tolls, GST, and standard fuel/maintenance." },
    { q: "What is driver bata for round-trip taxi?", a: "Driver bata is a fixed daily allowance for the driver — typically ₹300-₹500/day depending on vehicle category. It covers the driver's food and out-of-pocket expenses during the trip. For overnight trips, an additional night-halt charge of ₹250-₹500 applies for each night." },
    { q: "What if my round-trip exceeds the daily kilometre allowance?", a: "If you exceed 250 km on any single day, the additional kilometres are billed at the standard per-km rate. We track distance via GPS and reconcile at the end of the trip — fully transparent, no surprise bills." },
    { q: "Can I have multiple stops or sightseeing in a round trip?", a: "Yes — round trips are perfect for sightseeing because you have the same driver throughout. Plan multiple stops, take photo breaks, visit multiple temples or attractions. Just inform the driver of major detours so we can update the trip estimate." },
    { q: "What's the minimum booking duration for round-trip?", a: "Minimum 1 day (300 km). For day trips of less than 250 km round-trip, we charge the 250-km daily minimum. Longer trips (3+ days) often work out as great value because the per-day cost reduces with longer durations." },
    { q: "Are round-trip cabs available 24/7?", a: "Yes — bookings can be made any time. Pickups are available 24/7 with night charges (₹250-₹500) applicable for trips starting 10 PM-6 AM." },
];

const popularRoundRoutes = getAllRoutes().filter(r => r.from.tier === 1 && r.distanceKm >= 130 && r.distanceKm <= 350).slice(0, 12);
const tier1And2Cities = ALL_DISTRICTS.filter(d => d.tier <= 2).sort((a, b) => a.name.localeCompare(b.name));

const faqSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: roundTripFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const serviceSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "TaxiService",
    name: "Round Trip Taxi — OneWayTaxi.ai",
    description: "Round-trip cab service for same-day and multi-day outstation travel.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
});
const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Round Trip Taxi", item: "https://onewaytaxi.ai/round-trip-taxi" },
    ],
});

export default function RoundTripHubPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Round Trip Taxi</li>
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
                                    <RefreshCw className="h-4 w-4 text-emerald-300" /> Round Trip Service
                                </div>
                                <div className="mb-4 flex"><AllInclusiveBadge size="hero" /></div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                    Round trip taxi for your <span className="text-emerald-300">whole journey</span>
                                </h1>
                                <p className="text-lg text-teal-100 max-w-xl">
                                    Same-day business trips, weekend getaways, multi-day tours and sightseeing — same vehicle, same driver from start to finish. Round-trip cabs across 220+ South Indian cities.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Round Trip <ArrowRight className="h-5 w-5" /></Link>
                                    <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><Phone className="h-5 w-5" /> {SUPPORT_PHONE}</a>
                                </div>
                            </div>
                            <div className="lg:sticky lg:top-24"><BookingWidget /></div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">When to choose round trip over one-way</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                A <strong>round trip taxi</strong> keeps the same vehicle and driver with you for the entire journey — outbound, halt at destination, and return. It&apos;s ideal when you need transport at your destination (sightseeing, multiple meetings, hospital visits) or when the same-vehicle continuity matters (luggage stays in the boot, family members can rest in the car, no re-booking hassle).
                            </p>
                            <p>
                                The trade-off compared to a one-way drop: you pay for the return distance, and for any overnight halts you also pay driver bata and night-halt charges. For trips where you&apos;ll be at the destination 1-3 days, round-trip is usually cheaper than booking two separate one-ways. For longer stays (4+ days), consider booking a one-way out, using local transport at destination, and a one-way back — often the lowest total cost.
                            </p>
                            <p>
                                Round-trip cabs are most popular for: <strong>weekend Coorg/Munnar/Ooty trips</strong>, <strong>same-day Chennai-Tirupati or Chennai-Pondicherry runs</strong>, <strong>Madurai temple circuits</strong>, <strong>sightseeing tours of Hampi or Mahabalipuram</strong>, and <strong>multi-day Kerala backwaters tours</strong>.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">How round-trip pricing works</h2>
                        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Transparent breakdown of your round-trip fare</p>
                        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3"><IndianRupee className="h-5 w-5 text-teal-700" /> <h3 className="font-bold text-lg">Distance × per-km rate</h3></div>
                                <p className="text-sm text-gray-700 leading-relaxed">Charged on actual round-trip kilometres. Daily minimum of 250 km applies. Same per-km rate as one-way: ₹13/km hatchback, ₹14/km sedan, ₹19/km SUV, ₹22/km Crysta.</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3"><Clock className="h-5 w-5 text-teal-700" /> <h3 className="font-bold text-lg">Driver bata</h3></div>
                                <p className="text-sm text-gray-700 leading-relaxed">Fixed daily allowance: ₹300/day (sedan), ₹400/day (SUV), ₹500/day (Crysta). Covers the driver&apos;s food and personal expenses during the trip.</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3"><MapPin className="h-5 w-5 text-teal-700" /> <h3 className="font-bold text-lg">Night halt</h3></div>
                                <p className="text-sm text-gray-700 leading-relaxed">For overnight trips: ₹250-₹500 per night halt at destination. Compensates the driver for sleeping at the destination instead of returning home.</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3"><CheckCircle2 className="h-5 w-5 text-teal-700" /> <h3 className="font-bold text-lg">Tolls + GST included</h3></div>
                                <p className="text-sm text-gray-700 leading-relaxed">All highway tolls and 5% GST are included in the displayed fare. Inter-state permits (cross-border) are extra and disclosed at booking.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Round-trip vehicle options</h2>
                        <p className="text-center text-gray-600 mb-10">Same per-km rate as one-way; daily bata applies</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {VEHICLE_TYPES.slice(0, 4).map((v) => (
                                <div key={v.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-center">
                                    <div className="font-bold text-lg text-gray-900">{v.name}</div>
                                    <div className="text-3xl font-extrabold text-teal-700 mt-2">₹{v.price}<span className="text-base text-gray-500">/km</span></div>
                                    <div className="text-sm text-gray-500 mt-1">{v.seat} seats</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Popular round-trip routes</h2>
                        <p className="text-gray-600 mb-8">Same-day and weekend round-trip favourites</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {popularRoundRoutes.map((r) => (
                                <Link key={r.slug} href={`/route/${r.slug}`} className="group bg-white hover:shadow-md rounded-xl border border-gray-200 hover:border-teal-300 p-4 transition-all">
                                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-900">
                                        <span>{r.from.name}</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
                                        <span>{r.to.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{r.distanceKm} km one-way</span>
                                        <span className="font-bold text-teal-700">RT from ₹{(r.fareEstimate * 2).toLocaleString("en-IN")}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Round-trip taxi cities</h2>
                        <p className="text-gray-600 mb-6">Round-trip pickups available in {tier1And2Cities.length}+ major cities</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {tier1And2Cities.slice(0, 30).map((d) => (
                                <Link key={d.slug} href={`/outstation-cabs-in-${d.slug}`} className="text-sm text-gray-700 hover:text-teal-700 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    {d.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Round-trip taxi FAQs</h2>
                        <div className="space-y-3">
                            {roundTripFaqs.map((f, i) => (
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Plan your round trip with us</h2>
                        <p className="text-teal-100 mb-6">Same vehicle, same driver, full-trip support — from ₹13/km.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Round Trip <ArrowRight className="h-5 w-5" /></Link>
                            <a href={`https://wa.me/${phoneDigits.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><MessageCircle className="h-5 w-5" /> WhatsApp Us</a>
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
