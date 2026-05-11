import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { ALL_DISTRICTS } from "@/lib/districts";
import { getAllRoutes } from "@/lib/routes";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, MessageCircle, ArrowRight, IndianRupee, Clock, Shield, CheckCircle2, Route } from "lucide-react";
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

export const metadata: Metadata = {
    title: "One Way Taxi Service | Cheapest One-Way Cab Across South India — OneWayTaxi.ai",
    description:
        "One way taxi service across 220+ cities. Pay one-way only. Save 40-50% vs round trip. From ₹13/km. AC sedan, SUV, Innova Crysta. 24/7 booking. Verified drivers.",
    alternates: { canonical: "https://onewaytaxi.ai/one-way-taxi" },
    openGraph: {
        title: "One Way Taxi Service | OneWayTaxi.ai",
        description: "Cheapest one-way taxi across South India. Pay only one-way. From ₹13/km.",
        url: "https://onewaytaxi.ai/one-way-taxi",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "One Way Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "One Way Taxi Service | OneWayTaxi.ai", description: "Pay only one-way. From ₹13/km. 220+ cities. 24/7.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
};

const onewayFaqs = [
    { q: "What is a one-way taxi or drop taxi?", a: "A one-way taxi (also called a drop taxi in South India) is an outstation cab service where you pay only for the one-way distance from your pickup point to your destination. You don't pay for the driver's return journey — the operator takes on that risk and recoups the cost from a return passenger. The model saves customers 40-50% compared to traditional round-trip taxis on inter-city travel." },
    { q: "How is the one-way taxi fare calculated?", a: "One-way fare = distance in km × per-km rate. Mini/hatchback ₹13/km, sedan (Etios/Dzire/Xcent) ₹14/km, SUV (Ertiga/Innova) ₹19/km, Innova Crysta ₹22/km. The fare includes tolls, ₹400/day driver bata, fuel, and 5% GST. Example: Chennai to Bangalore is 346 km × ₹14 = ₹4,850 in a sedan, all-inclusive. There is a 130 km minimum on outstation drops to cover the driver's deadhead return; below that, local-trip rates apply." },
    { q: "How much do I save with one-way vs round-trip?", a: "Typical savings range from 40% to 55% on inter-city routes. Concrete example: Chennai to Bangalore round-trip in a traditional taxi costs ₹9,500-₹10,500 (driver runs both legs + ₹400 halt charge if overnight). Our one-way drop is ₹4,850 — 51% cheaper. The savings grow on longer corridors: Chennai to Coimbatore one-way ₹7,070 vs round-trip ~₹14,500, a 51% saving. Bangalore to Mysore one-way ₹2,100 vs round-trip ~₹4,500, a 53% saving." },
    { q: "What cities and routes do you cover?", a: "We serve 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry. The most-booked corridors are Chennai-Bangalore (346 km), Bangalore-Mysore (150 km via the new expressway), Chennai-Pondicherry (150 km via ECR), Bangalore-Coorg (260 km), Kochi-Munnar (130 km), Madurai-Rameswaram (174 km), Coimbatore-Ooty (86 km), and Salem-Yercaud (32 km). For any route inside our coverage, run an instant quote on our fare calculator." },
    { q: "When is one-way taxi the right choice vs round-trip?", a: "Choose one-way when (1) you're moving cities, (2) dropping someone at an airport in another city, (3) attending a one-day business meeting where you don't need return transport, (4) doing a pilgrimage with a separate return plan, (5) starting a multi-city trip where you want flexibility for the return. Choose round-trip when (1) you need the same vehicle for sightseeing at the destination, (2) you're staying 1-3 days and need transport throughout, (3) you have a same-day medical or business appointment requiring the driver to wait. For 4+ day trips, often two separate one-ways beat a single long round-trip on cost." },
    { q: "Is there a minimum distance for one-way taxi booking?", a: "Yes — outstation one-way drops have a 130 km minimum to cover the driver's deadhead return. For shorter distances inside a city or to nearby suburbs, local-trip pricing applies (typically ₹500-1,500 minimum depending on vehicle and route). The minimum doesn't apply to airport pickups within the same city — those are billed on actuals." },
    { q: "What's included in the one-way taxi fare?", a: "Fuel, all national-highway tolls, ₹400/day driver bata, 5% GST, and the driver's deadhead return are all included. The displayed fare is what you pay — no surge, no festival multiplier, no surprise bill at the destination. Excluded items disclosed up-front: night charges (₹250-500 for trips between 10 PM-6 AM), inter-state permit fees on cross-state routes (₹150-500 typical), parking at destination, and waiting charges (₹150-250/hour) beyond the free 30-minute pickup wait." },
    { q: "Can I book a one-way taxi at night or early morning?", a: "Absolutely. We operate 24/7, 365 days. Common night-booking patterns: 4-5 AM Tirupati pilgrim runs from Chennai, 10 PM-2 AM corporate runs on Bangalore-Chennai, overnight medical drops to Bangalore super-specialty hospitals. Night charges (₹250-500 depending on vehicle) apply for trips between 10 PM and 6 AM, fully disclosed at booking." },
    { q: "Do you offer one-way taxi to airports?", a: "Yes — airport drops are one of our most-booked categories. We serve all 10 South Indian airports: Chennai (MAA), Bangalore (BLR), Hyderabad (HYD), Kochi (COK), Coimbatore (CJB), Madurai (IXM), Trichy (TRZ), Trivandrum (TRV), Mangalore (IXE), and Calicut (CCJ). Flight tracking is included; the first 60 minutes of waiting after touchdown are free. Both city-to-airport and airport-to-other-city drops are common." },
    { q: "How do I pay for a one-way taxi?", a: "We accept UPI (PhonePe, Google Pay, Paytm), debit and credit cards, net banking, and cash. A small advance (10-20% of fare) may be required for confirmation on long-distance and Tempo Traveller bookings; the balance is paid to the driver at trip end. GST-compliant invoices are available for corporate billing on request — mention your company name and GSTIN at booking." },
    { q: "What's the cancellation policy?", a: "Free cancellation more than 4 hours before pickup. Within 4 hours of pickup, a flat ₹200 service fee applies. After the driver reaches the pickup location, a ₹500 no-show fee applies. Reschedules are free up to 2 hours before pickup, subject to driver availability for the new slot. Refunds are processed within 3-5 working days to the original payment method (UPI refunds typically faster, within 24 hours)." },
    { q: "What vehicle types are available for one-way taxi?", a: "Five categories: Mini/Hatchback (4 seats, ₹13/km, best for solo or 2 passengers with light luggage), Sedan (4 seats, ₹14/km — Etios/Dzire/Xcent — most-booked for 2-4 passengers), SUV (7 seats, ₹19/km — Ertiga/Innova classic — best for families and hill-station trips), Innova Crysta (7 seats, ₹22/km — premium with captain seats variant — best for elderly/long-distance comfort), and Tempo Traveller (12-17 seats, on request — for groups, weddings, college events). Diesel preferred for ghat routes; both work on flat highways." },
    { q: "Are your drivers verified?", a: "Yes. Every driver in our network carries a valid commercial badge, has 3+ years of professional driving experience, and has been background-checked through our internal process. Driver name, photo, and badge number are shared with you 30-60 minutes before pickup. We assign drivers based on route experience — ghat-experienced drivers for hill stations, inter-state-experienced drivers for cross-border routes. Tamil-speaking drivers are default for South Indian routes; mention language preferences at booking." },
];

const tier1And2 = ALL_DISTRICTS.filter(d => d.tier === 1 || d.tier === 2).sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
const topRoutes = getAllRoutes().filter(r => r.from.tier === 1).slice(0, 16);

const escapeJsonLd = (json: string) => json.replace(/</g, '\\u003c');

const faqSchema = escapeJsonLd(JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: onewayFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
}));
const serviceSchema = escapeJsonLd(JSON.stringify({
    "@context": "https://schema.org", "@type": "TaxiService",
    name: "One Way Taxi — OneWayTaxi.ai",
    description: "One-way drop taxi service across South India. Pay only for one-way distance. All-inclusive fare includes tolls, driver bata, state permit, and 5% GST.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
    offers: {
        "@type": "Offer",
        priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 13,
            priceCurrency: "INR",
            unitText: "per km",
            referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
            valueAddedTaxIncluded: true,
        },
    },
}));
const breadcrumbSchema = escapeJsonLd(JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "One Way Taxi", item: "https://onewaytaxi.ai/one-way-taxi" },
    ],
}));

export default function OneWayTaxiHubPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">One Way Taxi</li>
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
                                    <Route className="h-4 w-4 text-emerald-300" /> One Way Taxi Service
                                </div>
                                <div className="mb-4 flex"><AllInclusiveBadge size="hero" /></div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                    One way taxi from <span className="text-emerald-300">₹13/km</span>
                                </h1>
                                <p className="text-lg text-teal-100 max-w-xl">
                                    South India&apos;s most trusted one-way taxi service. Pay only for the kilometres you travel. No return charges. No hidden fees. Across Tamil Nadu, Kerala, Karnataka, AP, Telangana, and Pondicherry.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book One Way Taxi <ArrowRight className="h-5 w-5" /></Link>
                                    <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><Phone className="h-5 w-5" /> {SUPPORT_PHONE}</a>
                                </div>
                            </div>
                            <div className="lg:sticky lg:top-24"><BookingWidget /></div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">What is a one-way drop taxi?</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                A <strong>one-way drop taxi</strong> is an outstation cab service where you pay only for the kilometres you actually travel from your pickup point to your destination — there is no return-journey charge. Unlike traditional round-trip taxis that bill you for both legs plus driver halt charges, the one-way model is built around an operator network that aggregates return-passenger demand on the same corridor. The operator (us) takes on the deadhead-return risk; you pay roughly half what a round-trip would cost.
                            </p>
                            <p>
                                The model works because South India&apos;s major corridors — Chennai-Bangalore, Bangalore-Mysore, Chennai-Pondicherry, Coimbatore-Ooty — see consistent two-way travel demand. Our system matches return-leg passengers to drivers heading back, so the per-trip economics work without overcharging the outbound passenger. For routes with one-sided demand (typically pilgrim circuits like Madurai-Rameswaram during festival peaks), we may price slightly higher — but the customer always sees a fixed all-inclusive fare at booking.
                            </p>
                            <p>
                                The math is straightforward: a Chennai to Bangalore <strong>round-trip</strong> in a sedan costs around ₹9,500-₹10,500 (driver runs both legs plus a ₹400-500 overnight halt charge). The same one-way trip on our network is just <strong>₹4,850</strong> — a 51% saving for identical vehicle quality, the same verified-driver standards, and the same fully-included tolls and bata. On longer corridors the savings grow: Chennai to Coimbatore one-way ₹7,070 versus round-trip ~₹14,500 (51% saving); Bangalore to Mysore one-way ₹2,100 versus round-trip ~₹4,500 (53% saving).
                            </p>
                            <p>
                                We&apos;ve served over 50,000 one-way drop trips across 220+ cities. Our fleet covers five vehicle categories — hatchback, sedan, SUV, Innova Crysta, and Tempo Traveller — all AC, GPS-tracked, and driven by background-verified drivers with 3+ years of professional experience. Pricing is transparent: tolls, ₹400/day driver bata, 5% GST, and the driver&apos;s deadhead return are all included in the displayed fare. There are no surge multipliers, no festival pricing, and no last-minute surprises.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-amber-50 border-y border-amber-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">One-way vs round-trip — when to choose which</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-bold text-lg text-teal-900 mb-3">Choose one-way when…</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• <strong>You&apos;re moving cities</strong> — relocations, college admissions, new-job arrivals.</li>
                                    <li>• <strong>One-way airport drop</strong> — dropping a family member at MAA, BLR, or HYD for a flight.</li>
                                    <li>• <strong>Same-day business meeting</strong> in another city where you don&apos;t need return transport.</li>
                                    <li>• <strong>Pilgrim drop with a separate return</strong> — you fly out from the destination or return on a different date.</li>
                                    <li>• <strong>Multi-city trip</strong> — Chennai → Bangalore → Mysore → return; book three one-ways for flexibility.</li>
                                    <li>• <strong>Hospital admission</strong> for an inpatient stay — drop the patient, return when discharge date is known.</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-bold text-lg text-teal-900 mb-3">Choose round-trip when…</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• <strong>Sightseeing at the destination</strong> — Munnar/Coorg/Mahabalipuram tours need the same vehicle for local trips.</li>
                                    <li>• <strong>1-3 day stays</strong> where you need transport at the destination throughout.</li>
                                    <li>• <strong>Same-day medical appointment</strong> requiring the driver to wait at the hospital.</li>
                                    <li>• <strong>Wedding-day venue circuit</strong> — multi-stop transport for a guest or family.</li>
                                    <li>• <strong>Day-trip pilgrimage</strong> like Tirupati or Rameswaram where a same-day return is the plan.</li>
                                    <li>• <strong>Group offsite</strong> with a fixed return time and no separate destination transport.</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-6 max-w-3xl mx-auto text-center">
                            <strong>Rule of thumb:</strong> for trips of 4+ days at the destination, two separate one-ways often beat a single long round-trip on cost. Run a quick comparison on our <Link href="/fare-calculator" className="text-teal-700 underline">fare calculator</Link> for your specific route.
                        </p>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">One way taxi benefits</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: IndianRupee, title: "Save up to 50%", text: "Pay one-way only. No return fare. Massive savings on inter-city routes." },
                                { icon: Clock, title: "24/7 availability", text: "Same-hour pickups in metros. 4-6 hour notice for non-metro cities." },
                                { icon: Shield, title: "Safety first", text: "Driver background checks, GPS tracking, 24/7 support helpline." },
                                { icon: CheckCircle2, title: "Fixed all-inclusive fare", text: "Tolls, driver bata, GST included. Pay exactly what you see at booking." },
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">One way taxi pricing</h2>
                        <p className="text-center text-gray-600 mb-10">Per-km rates. Tolls, GST and driver bata included.</p>
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Popular one way taxi routes</h2>
                        <p className="text-gray-600 mb-8">Click any route for instant fare and booking</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {topRoutes.map((r) => (
                                <Link key={r.slug} href={`/route/${r.slug}`} className="group bg-white hover:shadow-md rounded-xl border border-gray-200 hover:border-teal-300 p-4 transition-all">
                                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-900">
                                        <span>{r.from.name}</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">One way taxi cities</h2>
                        <p className="text-gray-600 mb-6">Tap a city for one-way taxi rates and routes from there</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {tier1And2.map((d) => (
                                <Link key={d.slug} href={`/one-way-taxi-in-${d.slug}`} className="text-sm text-gray-700 hover:text-teal-700 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    One Way Taxi {d.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">One way taxi FAQs</h2>
                        <div className="space-y-3">
                            {onewayFaqs.map((f, i) => (
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Ready for your one way taxi?</h2>
                        <p className="text-teal-100 mb-6">From ₹13/km. Drivers ready 24/7 across 220+ cities.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Now <ArrowRight className="h-5 w-5" /></Link>
                            <a href={`https://wa.me/${phoneDigits.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><MessageCircle className="h-5 w-5" /> WhatsApp</a>
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
