import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VEHICLE_TYPES, SUPPORT_PHONE } from '@/lib/constants';
import { Plane, MapPin, Clock, IndianRupee, Phone, Shield, Star, ChevronRight, Users, CarFront, MessageCircle } from 'lucide-react';

// ─── Airport Data ────────────────────────────────────────────
interface AirportDestination {
    name: string;
    distanceKm: number;
    fareEstimate: number;
}

interface Airport {
    slug: string;
    name: string;
    code: string;
    city: string;
    citySlug: string;
    state: string;
    stateSlug: string;
    lat: number;
    lng: number;
    distanceFromCity: number;
    popularDestinations: AirportDestination[];
}

const AIRPORTS: Airport[] = [
    {
        slug: 'chennai-airport', name: 'Chennai International Airport', code: 'MAA',
        city: 'Chennai', citySlug: 'chennai', state: 'Tamil Nadu', stateSlug: 'tamil-nadu',
        lat: 12.9941, lng: 80.1709, distanceFromCity: 15,
        popularDestinations: [
            { name: 'Bangalore', distanceKm: 346, fareEstimate: 4850 },
            { name: 'Pondicherry', distanceKm: 150, fareEstimate: 2100 },
            { name: 'Vellore', distanceKm: 136, fareEstimate: 1904 },
            { name: 'Tirupati', distanceKm: 135, fareEstimate: 1890 },
            { name: 'Madurai', distanceKm: 462, fareEstimate: 6470 },
        ],
    },
    {
        slug: 'bangalore-airport', name: 'Kempegowda International Airport', code: 'BLR',
        city: 'Bangalore', citySlug: 'bangalore', state: 'Karnataka', stateSlug: 'karnataka',
        lat: 13.1986, lng: 77.7066, distanceFromCity: 35,
        popularDestinations: [
            { name: 'Chennai', distanceKm: 346, fareEstimate: 4850 },
            { name: 'Mysore', distanceKm: 185, fareEstimate: 2590 },
            { name: 'Coimbatore', distanceKm: 365, fareEstimate: 5110 },
            { name: 'Hyderabad', distanceKm: 570, fareEstimate: 7980 },
            { name: 'Tirupati', distanceKm: 255, fareEstimate: 3570 },
        ],
    },
    {
        slug: 'hyderabad-airport', name: 'Rajiv Gandhi International Airport', code: 'HYD',
        city: 'Hyderabad', citySlug: 'hyderabad', state: 'Telangana', stateSlug: 'telangana',
        lat: 17.2403, lng: 78.4294, distanceFromCity: 24,
        popularDestinations: [
            { name: 'Warangal', distanceKm: 170, fareEstimate: 2380 },
            { name: 'Vijayawada', distanceKm: 275, fareEstimate: 3850 },
            { name: 'Bangalore', distanceKm: 570, fareEstimate: 7980 },
            { name: 'Tirupati', distanceKm: 580, fareEstimate: 8120 },
            { name: 'Nizamabad', distanceKm: 195, fareEstimate: 2730 },
        ],
    },
    {
        slug: 'kochi-airport', name: 'Cochin International Airport', code: 'COK',
        city: 'Kochi', citySlug: 'kochi', state: 'Kerala', stateSlug: 'kerala',
        lat: 10.1520, lng: 76.4019, distanceFromCity: 28,
        popularDestinations: [
            { name: 'Munnar', distanceKm: 110, fareEstimate: 1540 },
            { name: 'Alleppey', distanceKm: 75, fareEstimate: 1050 },
            { name: 'Thekkady', distanceKm: 145, fareEstimate: 2030 },
            { name: 'Trivandrum', distanceKm: 205, fareEstimate: 2870 },
            { name: 'Coimbatore', distanceKm: 196, fareEstimate: 2744 },
        ],
    },
    {
        slug: 'coimbatore-airport', name: 'Coimbatore International Airport', code: 'CJB',
        city: 'Coimbatore', citySlug: 'coimbatore', state: 'Tamil Nadu', stateSlug: 'tamil-nadu',
        lat: 11.0300, lng: 77.0434, distanceFromCity: 10,
        popularDestinations: [
            { name: 'Ooty', distanceKm: 86, fareEstimate: 1200 },
            { name: 'Bangalore', distanceKm: 365, fareEstimate: 5110 },
            { name: 'Kochi', distanceKm: 196, fareEstimate: 2744 },
            { name: 'Palakkad', distanceKm: 55, fareEstimate: 770 },
            { name: 'Madurai', distanceKm: 218, fareEstimate: 3050 },
        ],
    },
    {
        slug: 'madurai-airport', name: 'Madurai International Airport', code: 'IXM',
        city: 'Madurai', citySlug: 'madurai', state: 'Tamil Nadu', stateSlug: 'tamil-nadu',
        lat: 9.8345, lng: 78.0934, distanceFromCity: 12,
        popularDestinations: [
            { name: 'Kodaikanal', distanceKm: 120, fareEstimate: 1680 },
            { name: 'Rameswaram', distanceKm: 174, fareEstimate: 2436 },
            { name: 'Coimbatore', distanceKm: 218, fareEstimate: 3050 },
            { name: 'Trichy', distanceKm: 128, fareEstimate: 1792 },
            { name: 'Kanyakumari', distanceKm: 242, fareEstimate: 3388 },
        ],
    },
    {
        slug: 'trichy-airport', name: 'Tiruchirappalli International Airport', code: 'TRZ',
        city: 'Tiruchirappalli', citySlug: 'trichy', state: 'Tamil Nadu', stateSlug: 'tamil-nadu',
        lat: 10.7654, lng: 78.7097, distanceFromCity: 5,
        popularDestinations: [
            { name: 'Thanjavur', distanceKm: 56, fareEstimate: 784 },
            { name: 'Madurai', distanceKm: 128, fareEstimate: 1792 },
            { name: 'Chennai', distanceKm: 332, fareEstimate: 4650 },
            { name: 'Pondicherry', distanceKm: 207, fareEstimate: 2898 },
            { name: 'Salem', distanceKm: 139, fareEstimate: 1946 },
        ],
    },
    {
        slug: 'trivandrum-airport', name: 'Trivandrum International Airport', code: 'TRV',
        city: 'Thiruvananthapuram', citySlug: 'thiruvananthapuram', state: 'Kerala', stateSlug: 'kerala',
        lat: 8.4821, lng: 76.9199, distanceFromCity: 6,
        popularDestinations: [
            { name: 'Kanyakumari', distanceKm: 87, fareEstimate: 1218 },
            { name: 'Kochi', distanceKm: 205, fareEstimate: 2870 },
            { name: 'Alleppey', distanceKm: 155, fareEstimate: 2170 },
            { name: 'Kovalam', distanceKm: 16, fareEstimate: 350 },
            { name: 'Varkala', distanceKm: 50, fareEstimate: 700 },
        ],
    },
    {
        slug: 'mangalore-airport', name: 'Mangalore International Airport', code: 'IXE',
        city: 'Mangalore', citySlug: 'mangalore', state: 'Karnataka', stateSlug: 'karnataka',
        lat: 12.9614, lng: 74.8900, distanceFromCity: 12,
        popularDestinations: [
            { name: 'Bangalore', distanceKm: 350, fareEstimate: 4900 },
            { name: 'Mysore', distanceKm: 265, fareEstimate: 3710 },
            { name: 'Goa', distanceKm: 365, fareEstimate: 5110 },
            { name: 'Udupi', distanceKm: 60, fareEstimate: 840 },
            { name: 'Kasaragod', distanceKm: 50, fareEstimate: 700 },
        ],
    },
    {
        slug: 'calicut-airport', name: 'Calicut International Airport', code: 'CCJ',
        city: 'Kozhikode', citySlug: 'kozhikode', state: 'Kerala', stateSlug: 'kerala',
        lat: 11.1368, lng: 75.9553, distanceFromCity: 26,
        popularDestinations: [
            { name: 'Wayanad', distanceKm: 85, fareEstimate: 1190 },
            { name: 'Kannur', distanceKm: 92, fareEstimate: 1288 },
            { name: 'Kochi', distanceKm: 190, fareEstimate: 2660 },
            { name: 'Coimbatore', distanceKm: 165, fareEstimate: 2310 },
            { name: 'Mysore', distanceKm: 240, fareEstimate: 3360 },
        ],
    },
];

function getAirport(slug: string): Airport | undefined {
    return AIRPORTS.find(a => a.slug === slug);
}

// ─── Static Params ───────────────────────────────────────────
export function generateStaticParams() {
    return AIRPORTS.map(a => ({ airportSlug: a.slug }));
}

// ─── Metadata ────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ airportSlug: string }> }): Promise<Metadata> {
    const { airportSlug } = await params;
    const airport = getAirport(airportSlug);
    if (!airport) return { title: 'Page Not Found' };

    const title = `Airport Taxi in ${airport.city} \u2014 24/7 Pickup & Drop | \u20B913/km | OneWayTaxi.ai`;
    const description = `Book ${airport.city} airport taxi (${airport.code}) for pickup & drop at \u20B913/km. 24/7 service, flight tracking, 30 min free waiting. Call ${SUPPORT_PHONE} for instant booking. No surge pricing.`;

    return {
        title,
        description,
        keywords: [
            `${airport.city.toLowerCase()} airport taxi`,
            `${airport.code} airport cab`,
            `${airport.city.toLowerCase()} airport pickup`,
            `${airport.city.toLowerCase()} airport drop`,
            `airport taxi ${airport.city.toLowerCase()}`,
            `${airport.name.toLowerCase()} taxi`,
            `${airport.code.toLowerCase()} taxi service`,
            'airport cab booking',
            'one way airport taxi',
        ],
        openGraph: {
            title,
            description,
            url: `https://onewaytaxi.ai/airport-taxi/${airport.slug}`,
            siteName: 'OneWayTaxi.ai',
            type: 'website',
            locale: 'en_IN',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${airport.city} Airport Taxi \u2014 OneWayTaxi.ai` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${airport.city} Airport Taxi \u2014 Book Now | OneWayTaxi.ai`,
            description,
            images: ['/opengraph-image'],
        },
        alternates: {
            canonical: `https://onewaytaxi.ai/airport-taxi/${airport.slug}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large' as const,
                'max-video-preview': -1,
            },
        },
    };
}

// ─── FAQ Data ────────────────────────────────────────────────
function getAirportFAQs(airport: Airport) {
    return [
        {
            q: `How do I book an airport taxi from ${airport.name} (${airport.code})?`,
            a: `You can book a ${airport.city} airport taxi by calling ${SUPPORT_PHONE}, messaging us on WhatsApp, or using our online booking form. Share your flight details, pickup time, and destination \u2014 we confirm your cab within minutes.`,
        },
        {
            q: `What are the waiting charges at ${airport.city} airport?`,
            a: `We offer 30 minutes of free waiting time from the scheduled landing time at ${airport.code}. After that, waiting charges of \u20B92/min apply. Your driver tracks your flight in real time, so they arrive exactly when you land.`,
        },
        {
            q: `What if my flight is delayed at ${airport.code}?`,
            a: `No worries \u2014 our drivers track your flight status in real time. If your flight is delayed, we automatically adjust the pickup time. There are no cancellation or extra charges for flight delays.`,
        },
        {
            q: `Where will the driver meet me at ${airport.name}?`,
            a: `Your driver will be waiting at the arrivals exit with a name board. You will receive the driver\u2019s name, photo, vehicle number, and phone number via SMS/WhatsApp 30 minutes before your scheduled pickup.`,
        },
        {
            q: `What payment options are available for ${airport.city} airport taxi?`,
            a: `We accept cash, UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and net banking. You can pay after completing your trip. No advance payment required for airport pickups.`,
        },
    ];
}

// ─── JSON-LD Builder ─────────────────────────────────────────
function buildSchemas(airport: Airport) {
    const taxiService = {
        '@context': 'https://schema.org',
        '@type': 'TaxiService',
        name: `OneWayTaxi.ai \u2014 ${airport.city} Airport Taxi`,
        description: `24/7 airport taxi service at ${airport.name} (${airport.code}). Pickup and drop starting at \u20B913/km.`,
        url: `https://onewaytaxi.ai/airport-taxi/${airport.slug}`,
        telephone: SUPPORT_PHONE,
        areaServed: {
            '@type': 'City',
            name: airport.city,
            containedInPlace: { '@type': 'State', name: airport.state },
        },
        provider: {
            '@type': 'Organization',
            name: 'OneWayTaxi.ai',
            url: 'https://onewaytaxi.ai',
            telephone: SUPPORT_PHONE,
        },
        priceRange: '\u20B913\u2013\u20B922 per km',
        availableChannel: {
            '@type': 'ServiceChannel',
            serviceType: 'Airport Taxi',
            serviceLocation: {
                '@type': 'Airport',
                name: airport.name,
                iataCode: airport.code,
                geo: { '@type': 'GeoCoordinates', latitude: airport.lat, longitude: airport.lng },
            },
        },
    };

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai' },
            { '@type': 'ListItem', position: 2, name: 'Airport Taxi', item: 'https://onewaytaxi.ai/airport-taxi' },
            { '@type': 'ListItem', position: 3, name: `${airport.city} Airport`, item: `https://onewaytaxi.ai/airport-taxi/${airport.slug}` },
        ],
    };

    return [taxiService, breadcrumb];
}

// ─── Schema Component ────────────────────────────────────────
function AirportSchemaMarkup({ airport }: { airport: Airport }) {
    const schemas = buildSchemas(airport);
    return (
        <>
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    suppressHydrationWarning
                >
                    {JSON.stringify(schema)}
                </script>
            ))}
        </>
    );
}

// ─── Page Component ──────────────────────────────────────────
export default async function AirportTaxiPage({ params }: { params: Promise<{ airportSlug: string }> }) {
    const { airportSlug } = await params;
    const airport = getAirport(airportSlug);

    if (!airport) notFound();

    const faqs = getAirportFAQs(airport);
    const otherAirports = AIRPORTS.filter(a => a.slug !== airport.slug);
    const cityFareFromAirport = Math.round(airport.distanceFromCity * 13);
    const phoneLink = `tel:${SUPPORT_PHONE.replace(/\s/g, '')}`;
    const whatsappLink = `https://wa.me/${SUPPORT_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I need an airport taxi from ${airport.name} (${airport.code}). Please share the fare details.`)}`;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                {/* ── Breadcrumb ── */}
                <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                            <li>
                                <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
                            </li>
                            <li><ChevronRight className="w-3.5 h-3.5" /></li>
                            <li>
                                <span className="text-gray-500">Airport Taxi</span>
                            </li>
                            <li><ChevronRight className="w-3.5 h-3.5" /></li>
                            <li>
                                <span className="font-medium text-teal-800">{airport.city} Airport</span>
                            </li>
                        </ol>
                    </div>
                </nav>

                {/* ── Hero Section ── */}
                <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full border border-white/20">
                                        <Plane className="w-4 h-4" />
                                        {airport.code}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 text-sm font-medium px-3 py-1.5 rounded-full border border-emerald-400/30">
                                        <Clock className="w-3.5 h-3.5" />
                                        24/7 Service
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                                    {airport.city} Airport Taxi{' '}
                                    <span className="block text-teal-200 text-2xl sm:text-3xl md:text-4xl font-bold mt-1">
                                        24/7 Pickup &amp; Drop
                                    </span>
                                </h1>
                                <p className="text-teal-100 text-lg md:text-xl max-w-2xl mb-8">
                                    Reliable airport taxi service at {airport.name}. One-way fares starting at just <strong className="text-white">{'\u20B9'}13/km</strong>. Flight tracking, 30 min free waiting, and no surge pricing.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={phoneLink}
                                        className="inline-flex items-center justify-center gap-2 bg-white text-teal-900 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:bg-teal-50 transition-all text-base"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call {SUPPORT_PHONE}
                                    </a>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg hover:bg-green-600 transition-all text-base"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp Booking
                                    </a>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-w-[200px]">
                                <span className="text-teal-200 text-sm font-medium mb-1">Starting from</span>
                                <span className="text-4xl font-extrabold text-white">{'\u20B9'}13</span>
                                <span className="text-teal-200 text-sm">/km</span>
                                <hr className="w-full border-white/20 my-3" />
                                <span className="text-teal-200 text-xs text-center">All inclusive &mdash; tolls, GST, driver bata</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Airport Info Card ── */}
                <section className="py-12 bg-white" aria-label="Airport information">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-gray-50 to-teal-50 rounded-2xl border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                {airport.name} ({airport.code})
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                        <Plane className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">IATA Code</p>
                                        <p className="text-lg font-bold text-gray-900">{airport.code}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Location</p>
                                        <p className="text-lg font-bold text-gray-900">{airport.city}, {airport.state}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                        <CarFront className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Distance to City Center</p>
                                        <p className="text-lg font-bold text-gray-900">{airport.distanceFromCity} km</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                        <IndianRupee className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Fare to City Center</p>
                                        <p className="text-lg font-bold text-gray-900">From {'\u20B9'}{cityFareFromAirport}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Fare Table ── */}
                <section className="py-12 bg-gray-50" aria-label="Airport taxi fare table">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                            {airport.city} Airport Taxi Fare
                        </h2>
                        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                            Fares from {airport.name} ({airport.code}) to {airport.city} city center ({airport.distanceFromCity} km). All fares include tolls, GST, and driver bata.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <thead>
                                    <tr className="bg-teal-900 text-white">
                                        <th className="text-left py-4 px-5 font-semibold text-sm">Vehicle Type</th>
                                        <th className="text-center py-4 px-5 font-semibold text-sm">Seats</th>
                                        <th className="text-center py-4 px-5 font-semibold text-sm">Per Km Rate</th>
                                        <th className="text-center py-4 px-5 font-semibold text-sm">To City Center ({airport.distanceFromCity} km)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {VEHICLE_TYPES.map((v, i) => (
                                        <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="py-3.5 px-5 font-medium text-gray-900">{v.name}</td>
                                            <td className="py-3.5 px-5 text-center text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <Users className="w-4 h-4" /> {v.seat}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5 text-center font-semibold text-teal-700">{'\u20B9'}{v.price}/km</td>
                                            <td className="py-3.5 px-5 text-center font-bold text-gray-900">{'\u20B9'}{Math.round(airport.distanceFromCity * v.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            * Minimum fare applies for short distances. Night charges (10 PM &ndash; 6 AM) extra. Parking fees at airport not included.
                        </p>
                    </div>
                </section>

                {/* ── Popular Destinations from Airport ── */}
                <section className="py-12 bg-white" aria-label="Popular destinations from airport">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                            Popular Destinations from {airport.city} Airport
                        </h2>
                        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                            One-way taxi fares from {airport.name} ({airport.code}) to popular cities. Pay only for the distance traveled.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {airport.popularDestinations.map((dest) => (
                                <div key={dest.name} className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-teal-300 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                            <h3 className="font-bold text-gray-900">{airport.city} to {dest.name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{dest.distanceKm} km</span>
                                        <span className="text-lg font-bold text-teal-700">From {'\u20B9'}{dest.fareEstimate}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Sedan (4+1) fare. Toll &amp; GST included.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Why Book Airport Taxi With Us ── */}
                <section className="py-12 bg-gradient-to-br from-teal-50 to-emerald-50" aria-label="Why choose our airport taxi service">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                            Why Book {airport.city} Airport Taxi With Us
                        </h2>
                        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                            Trusted by thousands of travelers at {airport.code} every month. Here is what sets us apart.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Plane className="w-6 h-6 text-teal-700" />,
                                    title: 'Real-Time Flight Tracking',
                                    desc: `Our drivers track your flight status live. If your arrival at ${airport.code} is early or delayed, we adjust pickup time automatically \u2014 no calls needed.`,
                                },
                                {
                                    icon: <Clock className="w-6 h-6 text-teal-700" />,
                                    title: '30 Minutes Free Waiting',
                                    desc: 'We offer 30 minutes of complimentary waiting time from your flight landing. Take your time at baggage claim and immigration \u2014 your driver will be there.',
                                },
                                {
                                    icon: <IndianRupee className="w-6 h-6 text-teal-700" />,
                                    title: 'No Surge Pricing',
                                    desc: 'Unlike ride-hailing apps, our fares are fixed per km. No surge pricing during peak hours, festivals, or bad weather. The rate you see is the rate you pay.',
                                },
                                {
                                    icon: <Shield className="w-6 h-6 text-teal-700" />,
                                    title: 'Verified & Licensed Drivers',
                                    desc: 'All drivers are police-verified with valid commercial licenses. GPS-tracked vehicles with real-time location sharing for your safety.',
                                },
                                {
                                    icon: <Star className="w-6 h-6 text-teal-700" />,
                                    title: 'Clean, AC Vehicles',
                                    desc: 'Choose from Sedans, SUVs, or Innovas \u2014 all air-conditioned, sanitized after each trip, and well-maintained for a comfortable ride from the airport.',
                                },
                                {
                                    icon: <Phone className="w-6 h-6 text-teal-700" />,
                                    title: '24/7 Customer Support',
                                    desc: `Airport pickups at 2 AM or 4 AM? No problem. Our support team is available round the clock. Call ${SUPPORT_PHONE} anytime.`,
                                },
                            ].map((feature) => (
                                <div key={feature.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ Section ── */}
                <section className="py-12 bg-white" aria-label="Frequently asked questions about airport taxi">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                            {airport.city} Airport Taxi &mdash; Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Common questions about airport taxi service at {airport.name} ({airport.code}).
                        </p>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Section ── */}
                <section className="py-14 bg-gradient-to-r from-teal-900 to-teal-700 text-white" aria-label="Book your airport taxi">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            Ready to Book Your {airport.city} Airport Taxi?
                        </h2>
                        <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
                            Available 24/7 at {airport.name} ({airport.code}). One-way fares from {'\u20B9'}13/km. No hidden charges.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={phoneLink}
                                className="inline-flex items-center gap-2 bg-white text-teal-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-teal-50 transition-all text-lg"
                            >
                                <Phone className="w-5 h-5" />
                                {SUPPORT_PHONE}
                            </a>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-green-600 transition-all text-lg"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Book on WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── Related Airports ── */}
                <section className="py-12 bg-gray-50" aria-label="Related airport taxi services">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                            Airport Taxi at Other South Indian Airports
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            We serve all major airports across Tamil Nadu, Karnataka, Kerala, and Telangana.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {otherAirports.map((a) => (
                                <Link
                                    key={a.slug}
                                    href={`/airport-taxi/${a.slug}`}
                                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-teal-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                                        <Plane className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-teal-800 transition-colors">
                                            {a.city} Airport Taxi
                                        </p>
                                        <p className="text-sm text-gray-500">{a.code} &middot; {a.state}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-teal-600 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <AirportSchemaMarkup airport={airport} />
        </div>
    );
}
