import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { SUPPORT_PHONE, VEHICLE_TYPES, POPULAR_CITIES } from "@/lib/constants";
import { Phone, MessageCircle, Shield, Clock, IndianRupee, MapPin, CheckCircle2, ArrowRight, Star } from "lucide-react";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

export const metadata: Metadata = {
    title: "Book Taxi Online | Instant Confirmation, From ₹13/km — OneWayTaxi.ai",
    description:
        "Book one-way drop taxi online across South India in 30 seconds. AC vehicles from ₹13/km, 24/7 service, verified drivers, no return fare. Instant confirmation via WhatsApp.",
    alternates: { canonical: "https://onewaytaxi.ai/book-now" },
    openGraph: {
        title: "Book One-Way Taxi Online | OneWayTaxi.ai",
        description: "South India's #1 one-way drop taxi. Book in 30 seconds. From ₹13/km. 24/7.",
        url: "https://onewaytaxi.ai/book-now",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Book taxi online — OneWayTaxi.ai" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Book Taxi Online — OneWayTaxi.ai",
        description: "Book one-way drop taxi in 30 seconds. From ₹13/km.",
        images: ["/opengraph-image"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
};

const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Book Now", item: "https://onewaytaxi.ai/book-now" },
    ],
});

const benefits = [
    { icon: IndianRupee, title: "Pay only one-way", text: "No return fare, no minimum days. Save up to 50% vs. round trip." },
    { icon: Clock, title: "24/7 booking", text: "Day, night, weekends, holidays. Confirmation in under 5 minutes." },
    { icon: Shield, title: "Verified drivers", text: "Background-checked, badge-licensed, 3+ years experience." },
    { icon: CheckCircle2, title: "All-inclusive fare", text: "Tolls, driver bata, GST included. No hidden charges." },
];

const popularRoutes: { from: string; to: string; slug: string }[] = [
    { from: "Chennai", to: "Bangalore", slug: "chennai-to-bangalore-taxi" },
    { from: "Bangalore", to: "Mysore", slug: "bangalore-to-mysore-taxi" },
    { from: "Chennai", to: "Pondicherry", slug: "chennai-to-pondicherry-taxi" },
    { from: "Coimbatore", to: "Munnar", slug: "coimbatore-to-munnar-taxi" },
    { from: "Chennai", to: "Tirupati", slug: "chennai-to-tirupati-taxi" },
    { from: "Bangalore", to: "Coorg", slug: "bangalore-to-coorg-taxi" },
    { from: "Madurai", to: "Rameswaram", slug: "madurai-to-rameswaram-taxi" },
    { from: "Kochi", to: "Munnar", slug: "kochi-to-munnar-taxi" },
];

export default function BookNowPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Book Now</li>
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
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Drivers available now across 220+ cities
                                </div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                    Book a one-way taxi in <span className="text-emerald-300">30 seconds</span>
                                </h1>
                                <p className="text-lg text-teal-100 max-w-xl">
                                    Fill in your pickup, drop, and travel time. Get a fixed all-inclusive fare instantly. Pay only one-way — no return charges, ever.
                                </p>

                                <div className="flex flex-wrap gap-2 lg:gap-3">
                                    <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-50 text-sm">From ₹13/km</span>
                                    <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-50 text-sm">24/7 service</span>
                                    <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-50 text-sm">Verified drivers</span>
                                    <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-50 text-sm">No hidden charges</span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={`tel:${phoneDigits}`}
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50 transition-colors"
                                    >
                                        <Phone className="h-5 w-5" />
                                        Call {SUPPORT_PHONE}
                                    </a>
                                    <a
                                        href={`https://wa.me/${phoneDigits.replace("+", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="lg:sticky lg:top-24">
                                <BookingWidget />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Why book directly with us</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {benefits.map(({ icon: Icon, title, text }) => (
                                <div key={title} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100 text-teal-700 mb-4">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1.5">{title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Popular routes</h2>
                            <p className="text-gray-600">Click any route below for instant fare and booking</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {popularRoutes.map(({ from, to, slug }) => (
                                <Link
                                    key={slug}
                                    href={`/route/${slug}`}
                                    className="group bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md p-5 transition-all"
                                >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPin className="h-4 w-4 text-teal-600" />
                                            <span className="font-semibold">{from}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                                        <span className="font-semibold text-gray-900">{to}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">View fare & book</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-2">Choose your vehicle</h2>
                        <p className="text-center text-gray-600 mb-10">Transparent per-km pricing across all categories</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {VEHICLE_TYPES.slice(0, 4).map((v) => (
                                <div key={v.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-center">
                                    <div className="font-bold text-lg text-gray-900">{v.name}</div>
                                    <div className="text-3xl font-extrabold text-teal-700 mt-2">₹{v.price}<span className="text-base text-gray-500">/km</span></div>
                                    <div className="text-sm text-gray-500 mt-1">{v.seat} seats</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Link href="/fare-calculator" className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold">
                                Use the fare calculator <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-teal-50 to-emerald-50 border-y border-teal-100 py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center gap-1 mb-3">
                            {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Trusted across {POPULAR_CITIES.length}+ major cities</h2>
                        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                            From Chennai to Trivandrum, Bangalore to Hyderabad — drivers ready when you are. Same-hour pickups available in metro cities.
                        </p>
                        <Link
                            href="/reviews"
                            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold"
                        >
                            Read customer reviews <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}
