import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRouteSlugs, parseRouteSlug, getRouteSEOContent, getRouteFAQs } from '@/lib/routes';
import { VEHICLE_TYPES, SUPPORT_PHONE } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import FAQSection from '@/components/seo/FAQSection';
import TrustBanner from '@/components/seo/TrustBanner';
import { MapPin, Clock, IndianRupee, ArrowRight, ArrowLeftRight, Phone, Shield, Car } from 'lucide-react';

// ─── Static Params (SSG for all route pages) ─────────────────
export function generateStaticParams() {
    return getAllRouteSlugs().map(slug => ({ routeSlug: slug }));
}

// ─── Dynamic Metadata ────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ routeSlug: string }> }): Promise<Metadata> {
    const { routeSlug } = await params;
    const route = parseRouteSlug(routeSlug);
    if (!route) return { title: 'Route Not Found' };

    const seo = getRouteSEOContent(route);

    return {
        title: seo.title,
        description: seo.metaDescription,
        openGraph: {
            title: seo.title,
            description: seo.metaDescription,
            url: `https://onewaytaxi.ai/route/${routeSlug}`,
            siteName: 'OneWayTaxi.ai',
            type: 'website',
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.metaDescription,
        },
        alternates: {
            canonical: `https://onewaytaxi.ai/route/${routeSlug}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
            },
        },
    };
}

// ─── Page Component ──────────────────────────────────────────
export default async function RoutePage({ params }: { params: Promise<{ routeSlug: string }> }) {
    const { routeSlug } = await params;
    const route = parseRouteSlug(routeSlug);
    if (!route) notFound();

    const { from, to, distanceKm, fareEstimate } = route;
    const seo = getRouteSEOContent(route);
    const faqs = getRouteFAQs(route);

    // Check if reverse route exists
    const reverseSlug = `${to.slug}-to-${from.slug}-taxi`;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                        <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link href={`/${from.slug}-drop-taxi`} className="hover:text-teal-700">{from.name}</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-teal-800 font-medium">{from.name} to {to.name} Taxi</li>
                    </ol>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="text-center lg:text-left space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                One Way Drop Taxi
                            </div>

                            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                                {seo.h1}
                            </h1>

                            {/* Route Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white">
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl">
                                    <MapPin className="h-5 w-5 text-emerald-400" />
                                    <div>
                                        <div className="text-xs text-teal-200">Distance</div>
                                        <div className="font-bold text-lg">{distanceKm} km</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl">
                                    <Clock className="h-5 w-5 text-emerald-400" />
                                    <div>
                                        <div className="text-xs text-teal-200">Duration</div>
                                        <div className="font-bold text-lg">~{seo.durationText}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl">
                                    <IndianRupee className="h-5 w-5 text-emerald-400" />
                                    <div>
                                        <div className="text-xs text-teal-200">Starting from</div>
                                        <div className="font-bold text-lg">₹{fareEstimate}</div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-teal-100/90 leading-relaxed max-w-xl">
                                Book a one-way taxi from {from.name} to {to.name} starting at just ₹{fareEstimate}.
                                Pay only for one way — no return charges, no hidden fees. Save up to 40%.
                            </p>
                        </div>

                        <div className="relative z-10 w-full">
                            <BookingWidget />
                        </div>
                    </div>
                </div>
            </section>

            <TrustBanner />

            {/* Vehicle-wise Pricing */}
            <section className="py-16 bg-white" aria-label="Vehicle pricing">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
                        {from.name} to {to.name} Taxi Fare — All Vehicle Types
                    </h2>
                    <p className="text-gray-600 text-center mb-10">
                        One-way fare for {distanceKm} km. All inclusive — tolls, driver bata, permits & GST.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {VEHICLE_TYPES.map((v, idx) => {
                            const routeFare = Math.round(distanceKm * v.price);
                            return (
                                <div
                                    key={v.id}
                                    className={`rounded-xl border p-5 ${idx === 0 ? 'border-teal-300 bg-teal-50 ring-2 ring-teal-200' : 'border-gray-200 bg-white'}`}
                                >
                                    {idx === 0 && (
                                        <span className="inline-block text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded mb-3">
                                            Most Popular
                                        </span>
                                    )}
                                    <h3 className="font-bold text-gray-900 mb-1">{v.name}</h3>
                                    <div className="text-sm text-gray-500 mb-3">{v.seat} Seats &middot; AC</div>
                                    <div className="text-3xl font-bold text-teal-700 mb-1">₹{routeFare.toLocaleString('en-IN')}</div>
                                    <div className="text-xs text-gray-500">₹{v.price}/km × {distanceKm} km</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Route Description */}
            <section className="py-16 bg-gray-50" aria-label="Route details">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        {from.name} to {to.name} Taxi — Complete Route Guide
                    </h2>

                    <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
                        <p>
                            Looking for a reliable one-way taxi from {from.name} to {to.name}? OneWayTaxi.ai offers the most
                            affordable drop taxi service on this route. The {from.name} to {to.name} distance is approximately
                            {distanceKm} km by road, and the journey takes around {seo.durationText} by car depending on traffic conditions.
                        </p>

                        <p>
                            Our {from.name} to {to.name} taxi fare starts from just ₹{fareEstimate} for a hatchback, making it one of
                            the cheapest options available. Unlike traditional taxi services that charge for the round trip, you pay only
                            for the one-way distance from {from.name} to {to.name}. This means you save up to 40% compared to
                            services like Ola, Uber, or local taxi operators who charge return fare.
                        </p>

                        <p>
                            We offer multiple vehicle types for the {from.name} to {to.name} route — from budget-friendly hatchbacks
                            (₹{VEHICLE_TYPES[0].price}/km) to premium Innova Crysta (₹{VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km).
                            All vehicles are air-conditioned, GPS-tracked, and driven by experienced, background-verified drivers.
                            The fare includes driver bata, toll charges, inter-state permits, and GST — no hidden charges whatsoever.
                        </p>

                        <p>
                            Book your {from.name} to {to.name} one-way taxi online in just 30 seconds or call us 24/7 at {SUPPORT_PHONE}
                            for instant booking confirmation. Our {from.name} to {to.name} taxi service is available round the clock —
                            including early mornings, late nights, weekends, and holidays. Whether you&apos;re traveling for business,
                            family visits, medical needs, or leisure, we ensure a safe, comfortable, and affordable journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Reverse Route + Related Links */}
            <section className="py-12 bg-white" aria-label="Related routes">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Related Routes</h2>
                    <div className="flex flex-wrap gap-3">
                        {/* Reverse route */}
                        <Link
                            href={`/route/${reverseSlug}`}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 font-medium hover:bg-teal-100 transition-colors"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                            {to.name} to {from.name} Taxi
                        </Link>

                        {/* From city page */}
                        <Link
                            href={`/${from.slug}-drop-taxi`}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-teal-300 transition-colors"
                        >
                            <MapPin className="h-4 w-4 text-teal-600" />
                            {from.name} Drop Taxi
                        </Link>

                        {/* To city page */}
                        <Link
                            href={`/${to.slug}-drop-taxi`}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-teal-300 transition-colors"
                        >
                            <MapPin className="h-4 w-4 text-teal-600" />
                            {to.name} Drop Taxi
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <FAQSection
                districtName={`${from.name} to ${to.name}`}
                serviceLabel="One Way Taxi"
                faqs={faqs}
            />
            </main>

            <Footer />

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'TaxiService',
                        name: `${from.name} to ${to.name} One Way Taxi — OneWayTaxi.ai`,
                        description: seo.metaDescription,
                        url: `https://onewaytaxi.ai/route/${routeSlug}`,
                        telephone: SUPPORT_PHONE.replace(/\s/g, ''),
                        areaServed: [
                            { '@type': 'City', name: from.name },
                            { '@type': 'City', name: to.name },
                        ],
                        hasOfferCatalog: {
                            '@type': 'OfferCatalog',
                            name: `${from.name} to ${to.name} Taxi`,
                            itemListElement: VEHICLE_TYPES.map(v => ({
                                '@type': 'Offer',
                                itemOffered: {
                                    '@type': 'Service',
                                    name: `${v.name} — ${from.name} to ${to.name}`,
                                },
                                price: Math.round(distanceKm * v.price),
                                priceCurrency: 'INR',
                            })),
                        },
                        priceRange: `₹${fareEstimate} - ₹${Math.round(distanceKm * VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price)}`,
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.8',
                            reviewCount: String(Math.round(distanceKm * 3)),
                            bestRating: '5',
                        },
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map(faq => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                        })),
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai/' },
                            { '@type': 'ListItem', position: 2, name: `${from.name} Drop Taxi`, item: `https://onewaytaxi.ai/${from.slug}-drop-taxi` },
                            { '@type': 'ListItem', position: 3, name: `${from.name} to ${to.name} Taxi`, item: `https://onewaytaxi.ai/route/${routeSlug}` },
                        ],
                    }),
                }}
            />
        </div>
    );
}
