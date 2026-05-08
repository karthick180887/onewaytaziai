import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { FEATURES, VEHICLE_TYPES, SUPPORT_PHONE, GOOGLE_MAPS_URL } from "@/lib/constants";
import * as LucideIcons from "lucide-react";
import TrustBanner from "@/components/seo/TrustBanner";
import HowItWorks from "@/components/seo/HowItWorks";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "#1 One Way Drop Taxi South India — ₹13/km | OneWayTaxi.ai",
    description: "Book one-way drop taxis across Chennai, Bangalore, Coimbatore & 120+ cities. ₹13/km. Pay one way only — save 40%. Call +91 81244 76010!",
    alternates: {
        canonical: "https://onewaytaxi.ai",
    },
    openGraph: {
        title: "OneWayTaxi.ai — #1 One Way Drop Taxi Service in South India",
        description: "Book affordable one-way drop taxis across South India. Starting ₹13/km. Pay only for one way — save up to 40%. 115+ cities covered.",
        url: "https://onewaytaxi.ai",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "OneWayTaxi.ai — #1 One Way Drop Taxi in South India",
        description: "Book one-way drop taxis from ₹13/km. 115+ cities. Save 40% vs round-trip. 24/7 service.",
    },
};

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" aria-label="Book one way taxi">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    {/* Animated Glow Orbs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Hero Content */}
                        <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Top Rated Drop Taxi Service
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                                One Way Drop Taxi <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                                    Pay Only One Side
                                </span>
                            </h1>

                            <p className="text-lg lg:text-xl text-teal-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Book affordable one-way drop taxi across South India — Chennai, Bangalore, Coimbatore & 115+ cities.
                                No return fare, no hidden charges. Save up to 40% on outstation travel.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-white/80 text-sm font-medium">
                                {["Chennai", "Bangalore", "Coimbatore", "Madurai"].map(city => (
                                    <span key={city} className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Booking Widget Container */}
                        <div className="relative z-10 w-full">
                            <BookingWidget />
                        </div>
                    </div>
                </div>
            </section>

            <TrustBanner />

            {/* Service Hubs — internal linking to category pages */}
            <section className="py-12 bg-gray-50 border-b border-gray-100" aria-label="Browse our services">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Browse our services</h2>
                        <p className="text-gray-600">Pick the service that fits your trip — every option covers all 220+ South Indian cities.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { label: "Drop Taxi", href: "/drop-taxi", desc: "One-way only" },
                            { label: "One Way Taxi", href: "/one-way-taxi", desc: "Pay one side" },
                            { label: "Outstation Cabs", href: "/outstation-cabs", desc: "Inter-city" },
                            { label: "Round Trip Taxi", href: "/round-trip-taxi", desc: "Same vehicle" },
                            { label: "Airport Taxi", href: "/airport-taxi", desc: "10 airports" },
                        ].map(s => (
                            <Link
                                key={s.href}
                                href={s.href}
                                className="group bg-white hover:bg-teal-50 hover:border-teal-300 hover:shadow-md rounded-2xl border border-gray-200 p-5 text-center transition-all"
                            >
                                <div className="font-bold text-gray-900 group-hover:text-teal-800 mb-1">{s.label}</div>
                                <div className="text-xs text-gray-500">{s.desc}</div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Link href="/book-now" className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-semibold">
                            Or jump straight to booking
                            <span aria-hidden>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Definition Block — optimized for AI citation (134-167 words) */}
            <section className="py-12 bg-white" aria-label="About OneWayTaxi.ai">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is OneWayTaxi.ai?</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        OneWayTaxi.ai is South India&apos;s leading one-way drop taxi service, operating across 120+ cities in Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry. Unlike traditional round-trip taxis that charge passengers for the driver&apos;s return journey, OneWayTaxi.ai uses a one-way fare model where customers pay only for the distance they actually travel — saving up to 40% on intercity cab fares. Fares start at ₹13 per kilometer for a hatchback, ₹14/km for a sedan, ₹19/km for an SUV, and ₹22/km for an Innova Crysta. All fares include driver bata (allowance), toll charges, inter-state permits, and GST with no hidden costs. The service operates 24/7 with GPS-tracked, air-conditioned vehicles driven by background-verified drivers. Passengers can book online in 30 seconds or call +91 81244 76010 for instant confirmation.
                    </p>
                </div>
            </section>

            <HowItWorks />

            {/* Features Section */}
            <section className="py-20 bg-white" aria-label="Features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose OneWayTaxi.ai?</h2>
                        <p className="text-lg text-gray-600">Experience the difference with our premium service standards</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, idx) => {
                            // Dynamically access Lucide icons
                            // @ts-expect-error -- LucideIcons is indexed by string from constants; types don't allow arbitrary keys
                            const Icon = LucideIcons[feature.icon] || LucideIcons.Check;

                            return (
                                <div key={idx} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                                        <Icon className="h-7 w-7 text-teal-700 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Fleet Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Premium Fleet</h2>
                        <p className="text-lg text-gray-600">Clean, well-maintained vehicles for every travel need</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {VEHICLE_TYPES.map((vehicle) => {
                            return (
                                <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all border border-gray-100">
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center p-6">
                                        <Image src={vehicle.image} alt={vehicle.name} width={400} height={300} loading="lazy" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                            <div className="flex items-center gap-1">
                                                <LucideIcons.Users className="h-4 w-4" />
                                                <span>{vehicle.seat} Seats</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <LucideIcons.Snowflake className="h-4 w-4" />
                                                <span>AC</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Starts From</span>
                                                <div className="text-2xl font-bold text-teal-700">₹{vehicle.price}<span className="text-sm font-normal text-gray-500">/km</span></div>
                                            </div>
                                            <button className="bg-teal-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-800 transition-colors">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Popular Routes Section */}
            <section className="py-16 bg-gray-50" aria-label="Popular taxi routes">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Popular One-Way Taxi Routes</h2>
                        <p className="text-lg text-gray-600">Most booked drop taxi routes across South India. Book now & save up to 40%!</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[
                            { from: 'Chennai', to: 'Bangalore', km: 346, fare: 4850, fromSlug: 'chennai', toSlug: 'bangalore' },
                            { from: 'Chennai', to: 'Pondicherry', km: 150, fare: 2100, fromSlug: 'chennai', toSlug: 'pondicherry' },
                            { from: 'Chennai', to: 'Madurai', km: 462, fare: 6470, fromSlug: 'chennai', toSlug: 'madurai' },
                            { from: 'Chennai', to: 'Coimbatore', km: 505, fare: 7070, fromSlug: 'chennai', toSlug: 'coimbatore' },
                            { from: 'Bangalore', to: 'Chennai', km: 346, fare: 4850, fromSlug: 'bangalore', toSlug: 'chennai' },
                            { from: 'Coimbatore', to: 'Chennai', km: 505, fare: 7070, fromSlug: 'coimbatore', toSlug: 'chennai' },
                            { from: 'Madurai', to: 'Chennai', km: 462, fare: 6470, fromSlug: 'madurai', toSlug: 'chennai' },
                            { from: 'Hyderabad', to: 'Bangalore', km: 570, fare: 7980, fromSlug: 'hyderabad', toSlug: 'bangalore' },
                            { from: 'Kochi', to: 'Coimbatore', km: 196, fare: 2744, fromSlug: 'kochi', toSlug: 'coimbatore' },
                            { from: 'Chennai', to: 'Tirupati', km: 135, fare: 1890, fromSlug: 'chennai', toSlug: 'tirupati' },
                            { from: 'Coimbatore', to: 'Ooty', km: 86, fare: 1200, fromSlug: 'coimbatore', toSlug: 'ooty' },
                            { from: 'Madurai', to: 'Rameswaram', km: 174, fare: 2436, fromSlug: 'madurai', toSlug: 'rameswaram' },
                        ].map(r => (
                            <Link
                                key={`${r.fromSlug}-${r.toSlug}`}
                                href={`/route/${r.fromSlug}-to-${r.toSlug}-taxi`}
                                title={`${r.from} to ${r.to} one way taxi — ₹${r.fare}`}
                                className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
                            >
                                <div>
                                    <div className="font-bold text-gray-900 text-sm group-hover:text-teal-800 transition-colors">{r.from} → {r.to}</div>
                                    <div className="text-xs text-gray-500">{r.km} km</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-teal-700">₹{r.fare.toLocaleString('en-IN')}</div>
                                    <div className="text-xs text-gray-400">onwards</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Cities — Internal Linking Hub */}
            <section className="py-16 bg-white" aria-label="Service cities">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">One Way Taxi Across 120+ Cities</h2>
                        <p className="text-lg text-gray-600">Affordable drop taxi service covering every district in South India</p>
                    </div>

                    {/* Tier 1 Cities — prominent */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                        {[
                            { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu' },
                            { name: 'Bangalore', slug: 'bangalore', state: 'Karnataka' },
                            { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana' },
                            { name: 'Kochi', slug: 'kochi', state: 'Kerala' },
                            { name: 'Coimbatore', slug: 'coimbatore', state: 'Tamil Nadu' },
                            { name: 'Madurai', slug: 'madurai', state: 'Tamil Nadu' },
                            { name: 'Tirupati', slug: 'tirupati', state: 'Andhra Pradesh' },
                            { name: 'Trichy', slug: 'trichy', state: 'Tamil Nadu' },
                            { name: 'Pondicherry', slug: 'pondicherry', state: 'Pondicherry' },
                            { name: 'Vijayawada', slug: 'vijayawada', state: 'Andhra Pradesh' },
                        ].map(city => (
                            <Link
                                key={city.slug}
                                href={`/drop-taxi-in-${city.slug}`}
                                title={`${city.name} Drop Taxi Service`}
                                className="group flex flex-col items-center p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md hover:bg-teal-50 transition-all"
                            >
                                <LucideIcons.MapPin className="h-6 w-6 text-teal-600 mb-2 group-hover:text-teal-700" />
                                <span className="font-bold text-gray-900 group-hover:text-teal-800">{city.name}</span>
                                <span className="text-xs text-gray-500">{city.state}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Tier 2 Cities — compact grid */}
                    <div className="border-t border-gray-100 pt-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">More Cities We Serve</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                { name: 'Salem', slug: 'salem' }, { name: 'Mysore', slug: 'mysore' },
                                { name: 'Vellore', slug: 'vellore' }, { name: 'Ooty', slug: 'ooty' },
                                { name: 'Kodaikanal', slug: 'kodaikanal' }, { name: 'Warangal', slug: 'warangal' },
                                { name: 'Thanjavur', slug: 'thanjavur' }, { name: 'Kozhikode', slug: 'kozhikode' },
                                { name: 'Thrissur', slug: 'thrissur' }, { name: 'Tirunelveli', slug: 'tirunelveli' },
                                { name: 'Mangalore', slug: 'mangalore' }, { name: 'Kanyakumari', slug: 'kanyakumari' },
                                { name: 'Trivandrum', slug: 'thiruvananthapuram' }, { name: 'Nellore', slug: 'nellore' },
                                { name: 'Erode', slug: 'erode' }, { name: 'Tiruppur', slug: 'tiruppur' },
                                { name: 'Rajahmundry', slug: 'rajahmundry' }, { name: 'Vizag', slug: 'visakhapatnam' },
                                { name: 'Wayanad', slug: 'wayanad' }, { name: 'Alleppey', slug: 'alappuzha' },
                            ].map(city => (
                                <Link
                                    key={city.slug}
                                    href={`/drop-taxi-in-${city.slug}`}
                                    title={`${city.name} Drop Taxi`}
                                    className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-teal-50 hover:text-teal-800 transition-colors border border-transparent hover:border-teal-200"
                                >
                                    {city.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Homepage FAQ */}
            <section className="py-16 bg-white" aria-label="Frequently asked questions">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                            One Way Taxi — Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600">Everything you need to know about one-way drop taxi services</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'What is a one-way drop taxi?',
                                a: 'A one-way drop taxi is a taxi service where you pay only for the distance from your pickup to your drop location. Unlike traditional round-trip taxis, there are no return charges. This saves you up to 40% on intercity travel. OneWayTaxi.ai is the leading one-way drop taxi provider across South India with 115+ cities covered.'
                            },
                            {
                                q: 'How much does a one-way taxi cost?',
                                a: 'One-way taxi fares at OneWayTaxi.ai start from just ₹13/km for a hatchback. Sedan rates start at ₹14/km, SUV at ₹19/km, and Innova Crysta at ₹22/km. All fares include driver bata, toll charges, state permits, and GST — no hidden charges.'
                            },
                            {
                                q: 'Which cities are covered by OneWayTaxi.ai?',
                                a: 'OneWayTaxi.ai covers 115+ cities across 5 South Indian states — Tamil Nadu (38 districts), Kerala (14 districts), Andhra Pradesh (26 districts), Telangana (33 districts), and Pondicherry (4 districts). Major cities include Chennai, Bangalore, Coimbatore, Madurai, Hyderabad, Kochi, Tirupati, and more.'
                            },
                            {
                                q: 'Is one-way taxi cheaper than Ola or Uber?',
                                a: 'Yes, one-way drop taxis from OneWayTaxi.ai are significantly cheaper than Ola/Uber for outstation travel. Ola and Uber charge return fare (round-trip) for outstation rides, effectively doubling the cost. We charge only for the one-way distance, saving you up to 40%. Plus, our fares are fixed — no surge pricing.'
                            },
                            {
                                q: 'How do I book a one-way taxi online?',
                                a: 'Booking a one-way taxi on OneWayTaxi.ai is simple: 1) Enter your pickup city and drop city, 2) Select your travel date and time, 3) Enter your mobile number and submit. You\'ll get an instant fare estimate and booking confirmation. You can also call us 24/7 at +91 81244 76010.'
                            },
                            {
                                q: 'Are one-way taxi drivers verified and safe?',
                                a: 'Absolutely. All OneWayTaxi.ai drivers are background-verified, professionally trained, and carry valid licenses. Every vehicle is GPS-tracked in real-time, regularly serviced, and fully insured. We have maintained a 4.8-star rating from 50,000+ happy customers.'
                            },
                        ].map((faq, idx) => (
                            <details key={idx} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden" open={idx === 0}>
                                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 hover:text-teal-800 transition-colors">
                                    {faq.q}
                                    <LucideIcons.ChevronDown className="h-5 w-5 text-teal-700 shrink-0 transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
            </main>

            <Footer />

            {/* TaxiService Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TaxiService",
                        "name": "OneWayTaxi.ai — One Way Drop Taxi",
                        "url": "https://onewaytaxi.ai",
                        "telephone": SUPPORT_PHONE.replace(/\s/g, ''),
                        "image": "https://onewaytaxi.ai/logo.png",
                        "description": "Premium one-way drop taxi service across South India. Pay only for one way — save up to 40%. 115+ cities, 24/7 service.",
                        "priceRange": "₹13 - ₹22 per km",
                        "currenciesAccepted": "INR",
                        "paymentAccepted": "Cash, UPI, Credit Card, Debit Card",
                        "openingHours": "Mo-Su 00:00-23:59",
                        "areaServed": [
                            { "@type": "State", "name": "Tamil Nadu" },
                            { "@type": "State", "name": "Kerala" },
                            { "@type": "State", "name": "Andhra Pradesh" },
                            { "@type": "State", "name": "Telangana" },
                            { "@type": "State", "name": "Puducherry" }
                        ],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Taxi Services",
                            "itemListElement": VEHICLE_TYPES.map(v => ({
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": v.name,
                                },
                                "price": v.price,
                                "priceCurrency": "INR",
                                "unitText": "per km"
                            }))
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Chennai",
                            "addressRegion": "Tamil Nadu",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 13.0827,
                            "longitude": 80.2707
                        },
                        "sameAs": [GOOGLE_MAPS_URL]
                    })
                }}
            />

        </div>
    );
}
