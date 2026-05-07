import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { ALL_DISTRICTS } from "@/lib/districts";
import { getAllRoutes } from "@/lib/routes";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, MessageCircle, ArrowRight, IndianRupee, Clock, Shield, CheckCircle2, Route } from "lucide-react";

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
    { q: "What is a one-way taxi?", a: "A one-way taxi is a cab booked for a single direction trip — from your pickup point to your drop location only. You don't pay for the return journey, making it 40-50% cheaper than traditional round-trip taxis. It's also called a 'drop taxi' in South India." },
    { q: "How much does a one-way taxi cost?", a: `One-way taxi fare = distance (km) × per-km rate. Hatchback starts at ₹13/km, Sedan ₹14/km, SUV ₹19/km, Innova Crysta ₹22/km. For example, Chennai to Bangalore (346 km) is ₹4,850 in a sedan — all-inclusive of tolls, driver bata, and GST.` },
    { q: "Why is one-way taxi cheaper than round-trip?", a: "In a round trip, you pay for both directions plus the driver's halt charges if you stay overnight. In a one-way taxi, the operator absorbs the return-trip cost by finding a return passenger. You save 40-50% by paying only for the kilometres you actually use." },
    { q: "Is there a minimum distance for one-way taxi booking?", a: "Yes — outstation one-way trips have a 130-km minimum billing to cover the driver's deadhead return. For shorter distances, local taxi or per-trip pricing applies. Local one-way trips within a city start from ₹500 (sedan)." },
    { q: "Can I book a one-way taxi at night or early morning?", a: "Absolutely. We operate 24/7. Early morning (3-6 AM) and late-night (after 10 PM) bookings attract a small night charge of ₹250-₹500, but service availability is the same as daytime hours." },
    { q: "Do you offer one-way taxi to airports?", a: "Yes — one-way airport drops are one of our most common bookings. We serve Chennai, Bangalore, Hyderabad, Kochi, Coimbatore, Madurai, Trichy, Trivandrum, Mangalore, and Calicut airports with flight tracking and 60-minute free waiting." },
    { q: "How do I pay for a one-way taxi?", a: "Pay by UPI, debit/credit card, net banking, or cash. A small advance may be required for confirmation; the balance is paid to the driver at trip end. GST invoices are available for corporate billing." },
];

const tier1And2 = ALL_DISTRICTS.filter(d => d.tier === 1 || d.tier === 2).sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
const topRoutes = getAllRoutes().filter(r => r.from.tier === 1).slice(0, 16);

const faqSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: onewayFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const serviceSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "TaxiService",
    name: "One Way Taxi — OneWayTaxi.ai",
    description: "One-way drop taxi service across South India. Pay only for one-way distance.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
});
const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "One Way Taxi", item: "https://onewaytaxi.ai/one-way-taxi" },
    ],
});

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
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">Why one way taxi makes sense</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                A <strong>one way taxi</strong> service is the smartest choice for any single-direction trip — whether you&apos;re moving cities, dropping a family member at the airport in another city, attending a one-day business meeting, or making a pilgrimage trip where you don&apos;t need the same vehicle for the return.
                            </p>
                            <p>
                                The math is simple: in a round-trip taxi you pay for both directions, plus the driver&apos;s halt charges if your trip extends overnight. In a one way taxi, you pay <strong>only for the actual one-way distance</strong>. The operator (us) bears the risk of finding a return passenger from your destination — usually possible because of the consistent two-way demand on most South Indian corridors.
                            </p>
                            <p>
                                For perspective: a Chennai to Bangalore round trip in a sedan typically costs around ₹9,500-₹10,500 (with halt charges). The same one-way trip on our network is just ₹4,850 — roughly half the price for the same comfort, same vehicle, same driver standards.
                            </p>
                            <p>
                                We&apos;ve served over 50,000 one-way trips across 220+ cities. Our drivers are background-verified, our fleet is AC and GPS-tracked, and our pricing is transparent — you see the full all-inclusive fare at booking, with no surge pricing and no hidden charges.
                            </p>
                        </div>
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
