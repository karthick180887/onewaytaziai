import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { SUPPORT_PHONE, VEHICLE_TYPES } from "@/lib/constants";
import { Phone, MessageCircle, ArrowRight, Plane, Clock, Shield, MapPin, Luggage } from "lucide-react";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

const airports: { slug: string; name: string; city: string; code: string; state: string }[] = [
    { slug: "chennai-airport", name: "Chennai International Airport", city: "Chennai", code: "MAA", state: "Tamil Nadu" },
    { slug: "bangalore-airport", name: "Kempegowda International Airport", city: "Bangalore", code: "BLR", state: "Karnataka" },
    { slug: "hyderabad-airport", name: "Rajiv Gandhi International Airport", city: "Hyderabad", code: "HYD", state: "Telangana" },
    { slug: "kochi-airport", name: "Cochin International Airport", city: "Kochi", code: "COK", state: "Kerala" },
    { slug: "coimbatore-airport", name: "Coimbatore International Airport", city: "Coimbatore", code: "CJB", state: "Tamil Nadu" },
    { slug: "madurai-airport", name: "Madurai International Airport", city: "Madurai", code: "IXM", state: "Tamil Nadu" },
    { slug: "trichy-airport", name: "Tiruchirappalli International Airport", city: "Trichy", code: "TRZ", state: "Tamil Nadu" },
    { slug: "trivandrum-airport", name: "Trivandrum International Airport", city: "Thiruvananthapuram", code: "TRV", state: "Kerala" },
    { slug: "mangalore-airport", name: "Mangalore International Airport", city: "Mangalore", code: "IXE", state: "Karnataka" },
    { slug: "calicut-airport", name: "Calicut International Airport", city: "Kozhikode", code: "CCJ", state: "Kerala" },
];

const airportFaqs = [
    { q: "Do you provide airport pickup with flight tracking?", a: "Yes — every airport pickup booking includes automatic flight tracking. We monitor your flight's actual arrival time and adjust the driver's arrival accordingly. You get up to 60 minutes of free waiting after touchdown (vs. the standard 30 mins for normal pickups)." },
    { q: "How early should I book an airport taxi?", a: "For airport drops, book at least 2 hours ahead so we can confirm a vehicle in your area. For airport pickups, you can book any time up to your flight arrival — we just need 1 hour notice for guaranteed availability. Booking the day before is ideal for early morning international flights." },
    { q: "What is the airport taxi fare structure?", a: "Airport taxi follows the same per-km rate as outstation cabs (₹13-₹22/km depending on vehicle). For airport drops within the same city, we charge actual kilometres with a city minimum of ₹500 (sedan). For airport-to-airport or airport-to-other-city trips, standard outstation rates apply." },
    { q: "Are airport pickup charges different at night?", a: "Pickups between 10 PM and 6 AM attract a small night charge of ₹250-₹500 depending on vehicle. Most overnight international arrivals fall in this window. The charge is disclosed at booking, never added later." },
    { q: "Will the driver wait if my flight is delayed?", a: "Yes. We track your flight in real-time and adjust the driver's arrival. The first 60 minutes after actual landing is free waiting time. Beyond that, ₹150-₹250/hour applies. For very long delays (3+ hours), call us — we'll often re-assign a fresh driver at no extra cost." },
    { q: "Can the driver help with luggage?", a: "Absolutely. Our drivers help load and unload luggage. For SUV and Innova bookings with multiple bags, please mention the number of bags at booking so we can ensure adequate boot space." },
    { q: "Do you provide airport taxis with child seats?", a: "Child seats can be requested at booking — typically available on Innova Crysta and SUV bookings. There's a small surcharge of ₹150-₹250 to cover the rental cost. Please request at booking time, not at pickup." },
    { q: "How do I find the driver at the airport?", a: "Once your flight lands, the driver will message you on WhatsApp with their location (typically the designated pickup zone or pre-paid taxi area). Major airports also have specific cab pickup points — we'll guide you via call if needed." },
];

const faqSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: airportFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const serviceSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "TaxiService",
    name: "Airport Taxi — OneWayTaxi.ai",
    description: "Airport pickup and drop taxi service across major South Indian airports.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: airports.map(a => ({ "@type": "City", name: a.city })),
});
const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Airport Taxi", item: "https://onewaytaxi.ai/airport-taxi" },
    ],
});

export const metadata: Metadata = {
    title: "Airport Taxi Service | South India Airport Pickup & Drop — OneWayTaxi.ai",
    description:
        "Airport taxi service at 10 major South Indian airports — Chennai, Bangalore, Hyderabad, Kochi, Coimbatore, Madurai, Trichy, Trivandrum, Mangalore, Calicut. Flight tracking + 60-min free wait. From ₹13/km.",
    alternates: { canonical: "https://onewaytaxi.ai/airport-taxi" },
    openGraph: {
        title: "Airport Taxi | OneWayTaxi.ai",
        description: "Reliable airport pickup and drop across 10 South Indian airports.",
        url: "https://onewaytaxi.ai/airport-taxi",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Airport Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Airport Taxi | OneWayTaxi.ai", description: "Airport pickup/drop with flight tracking. From ₹13/km.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

export default function AirportTaxiHubPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Airport Taxi</li>
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
                                    <Plane className="h-4 w-4 text-emerald-300" /> Airport Taxi Service
                                </div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                    Airport pickup & drop across <span className="text-emerald-300">South India</span>
                                </h1>
                                <p className="text-lg text-teal-100 max-w-xl">
                                    10 major airports. Flight tracking. 60-minute free wait. Verified drivers ready 24/7. Book one-way drops, pickups, or airport-to-city outstation transfers from ₹13/km.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Airport Taxi <ArrowRight className="h-5 w-5" /></Link>
                                    <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><Phone className="h-5 w-5" /> {SUPPORT_PHONE}</a>
                                </div>
                            </div>
                            <div className="lg:sticky lg:top-24"><BookingWidget /></div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">Reliable airport taxi across South India</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                Airport taxis aren&apos;t just transport — they&apos;re a critical part of your travel day. A delayed cab on the way to the airport can cost you a flight; a missing driver after a long international arrival can ruin the start of your trip. Our airport service is built around three guarantees: <strong>show up on time, track your flight automatically, and wait if you&apos;re delayed</strong>.
                            </p>
                            <p>
                                We serve all 10 major South Indian airports — Chennai (MAA), Bangalore (BLR), Hyderabad (HYD), Kochi (COK), Coimbatore (CJB), Madurai (IXM), Trichy (TRZ), Trivandrum (TRV), Mangalore (IXE), and Calicut (CCJ). Each airport has dedicated drivers familiar with the terminal layout, pickup zones, and approach routes — so you don&apos;t lose time circling looking for a driver.
                            </p>
                            <p>
                                Beyond simple pickups and drops, we&apos;re especially useful for <strong>airport-to-other-city transfers</strong>: arriving at Bangalore airport and need to reach Mysore, Coorg, or Hosur? Landing at Coimbatore and going to Munnar or Ooty? Touching down at Madurai for Rameswaram or Kodaikanal? These multi-leg one-way drops are our specialty, and the per-km pricing makes them dramatically cheaper than airport-zone taxi rates.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Why book airport taxi with us</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: Plane, title: "Flight tracking", text: "Live monitoring of your flight. Driver arrives based on actual landing time, not scheduled time." },
                                { icon: Clock, title: "60-min free wait", text: "Double the standard wait time. No charge for delays under 1 hour after touchdown." },
                                { icon: Luggage, title: "Luggage help", text: "Drivers help with loading and unloading bags. Mention bag count at booking for SUV/Crysta." },
                                { icon: Shield, title: "24/7 support", text: "Mid-trip issue? Call our 24/7 helpline. Most issues resolved in under 10 minutes." },
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Airports we serve</h2>
                        <p className="text-center text-gray-600 mb-10">10 major airports across South India. Click any airport for taxi rates and pickup details.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {airports.map((a) => (
                                <Link key={a.slug} href={`/airport-taxi/${a.slug}`} className="group bg-gray-50 hover:bg-white hover:shadow-md rounded-2xl border border-gray-200 hover:border-teal-300 p-5 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <Plane className="h-6 w-6 text-teal-700" />
                                        <span className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-100 rounded">{a.code}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{a.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                                        <MapPin className="h-3.5 w-3.5" /> {a.city}, {a.state}
                                    </div>
                                    <div className="text-sm font-semibold text-teal-700 group-hover:text-teal-900 inline-flex items-center gap-1">
                                        View airport taxi rates <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Airport taxi pricing</h2>
                        <p className="text-center text-gray-600 mb-10">Same per-km rate as outstation cabs. No surge pricing, ever.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {VEHICLE_TYPES.slice(0, 4).map((v) => (
                                <div key={v.id} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                                    <div className="font-bold text-lg text-gray-900">{v.name}</div>
                                    <div className="text-3xl font-extrabold text-teal-700 mt-2">₹{v.price}<span className="text-base text-gray-500">/km</span></div>
                                    <div className="text-sm text-gray-500 mt-1">{v.seat} seats</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Airport taxi FAQs</h2>
                        <div className="space-y-3">
                            {airportFaqs.map((f, i) => (
                                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-200 hover:border-teal-300">
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Book your airport taxi now</h2>
                        <p className="text-teal-100 mb-6">Flight tracking. 60-minute free wait. Drivers ready 24/7.</p>
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
