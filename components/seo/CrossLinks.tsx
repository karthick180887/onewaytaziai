import Link from 'next/link';
import { Plane, Car, Sparkles, Calculator, MessageSquareText, Star, BookOpen, ArrowRight } from 'lucide-react';

// Cities that have a corresponding /airport-taxi/{slug}-airport page.
// Keep in sync with AIRPORT_SLUGS in app/sitemap.ts.
const AIRPORT_SLUG_BY_CITY: Record<string, string> = {
    chennai: 'chennai-airport',
    bangalore: 'bangalore-airport',
    hyderabad: 'hyderabad-airport',
    kochi: 'kochi-airport',
    coimbatore: 'coimbatore-airport',
    madurai: 'madurai-airport',
    trichy: 'trichy-airport',
    thiruvananthapuram: 'trivandrum-airport',
    mangalore: 'mangalore-airport',
    kozhikode: 'calicut-airport',
};

interface CrossLinksProps {
    citySlug?: string;
    cityName?: string;
}

export default function CrossLinks({ citySlug, cityName }: CrossLinksProps) {
    const airportSlug = citySlug ? AIRPORT_SLUG_BY_CITY[citySlug] : undefined;
    const hasAirport = !!airportSlug;

    return (
        <section className="py-16 bg-white border-t border-gray-100" aria-label="Explore more">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore more on OneWayTaxi.ai</h2>
                <p className="text-gray-600 mb-8">Other ways to plan and book your {cityName ? `${cityName} taxi` : 'taxi'}.</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Service hubs */}
                    <Link
                        href="/drop-taxi"
                        className="group bg-gray-50 hover:bg-teal-50 hover:border-teal-300 hover:shadow-md rounded-xl border border-gray-200 p-4 transition-all"
                    >
                        <Sparkles className="h-5 w-5 text-teal-700 mb-2" />
                        <div className="font-semibold text-gray-900 group-hover:text-teal-800">Drop Taxi Service</div>
                        <div className="text-xs text-gray-500 mt-0.5">How one-way drops work</div>
                    </Link>
                    <Link
                        href="/outstation-cabs"
                        className="group bg-gray-50 hover:bg-teal-50 hover:border-teal-300 hover:shadow-md rounded-xl border border-gray-200 p-4 transition-all"
                    >
                        <Sparkles className="h-5 w-5 text-teal-700 mb-2" />
                        <div className="font-semibold text-gray-900 group-hover:text-teal-800">Outstation Cabs</div>
                        <div className="text-xs text-gray-500 mt-0.5">Inter-city travel guide</div>
                    </Link>
                    <Link
                        href="/round-trip-taxi"
                        className="group bg-gray-50 hover:bg-teal-50 hover:border-teal-300 hover:shadow-md rounded-xl border border-gray-200 p-4 transition-all"
                    >
                        <Sparkles className="h-5 w-5 text-teal-700 mb-2" />
                        <div className="font-semibold text-gray-900 group-hover:text-teal-800">Round Trip Taxi</div>
                        <div className="text-xs text-gray-500 mt-0.5">Same vehicle, both ways</div>
                    </Link>

                    {/* Airport (if applicable) or one-way-taxi */}
                    {hasAirport ? (
                        <Link
                            href={`/airport-taxi/${airportSlug}`}
                            className="group bg-gray-50 hover:bg-teal-50 hover:border-teal-300 hover:shadow-md rounded-xl border border-gray-200 p-4 transition-all"
                        >
                            <Plane className="h-5 w-5 text-teal-700 mb-2" />
                            <div className="font-semibold text-gray-900 group-hover:text-teal-800">{cityName} Airport Taxi</div>
                            <div className="text-xs text-gray-500 mt-0.5">Pickup & drop service</div>
                        </Link>
                    ) : (
                        <Link
                            href="/airport-taxi"
                            className="group bg-gray-50 hover:bg-teal-50 hover:border-teal-300 hover:shadow-md rounded-xl border border-gray-200 p-4 transition-all"
                        >
                            <Plane className="h-5 w-5 text-teal-700 mb-2" />
                            <div className="font-semibold text-gray-900 group-hover:text-teal-800">Airport Taxi</div>
                            <div className="text-xs text-gray-500 mt-0.5">10 South India airports</div>
                        </Link>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-10 mb-4">Pick your vehicle</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <Link
                        href="/sedan-taxi"
                        className="group bg-gray-50 hover:bg-white hover:border-teal-300 hover:shadow rounded-xl border border-gray-200 p-3 transition-all text-center"
                    >
                        <Car className="h-5 w-5 text-teal-700 mx-auto mb-1.5" />
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Sedan</div>
                        <div className="text-[11px] text-gray-500">₹14/km · 4-seat</div>
                    </Link>
                    <Link
                        href="/suv-taxi"
                        className="group bg-gray-50 hover:bg-white hover:border-teal-300 hover:shadow rounded-xl border border-gray-200 p-3 transition-all text-center"
                    >
                        <Car className="h-5 w-5 text-teal-700 mx-auto mb-1.5" />
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">SUV</div>
                        <div className="text-[11px] text-gray-500">₹19/km · 7-seat</div>
                    </Link>
                    <Link
                        href="/innova-crysta-taxi"
                        className="group bg-gray-50 hover:bg-white hover:border-teal-300 hover:shadow rounded-xl border border-gray-200 p-3 transition-all text-center"
                    >
                        <Car className="h-5 w-5 text-teal-700 mx-auto mb-1.5" />
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Innova Crysta</div>
                        <div className="text-[11px] text-gray-500">₹22/km · premium</div>
                    </Link>
                    <Link
                        href="/tempo-traveller"
                        className="group bg-gray-50 hover:bg-white hover:border-teal-300 hover:shadow rounded-xl border border-gray-200 p-3 transition-all text-center"
                    >
                        <Car className="h-5 w-5 text-teal-700 mx-auto mb-1.5" />
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Tempo Traveller</div>
                        <div className="text-[11px] text-gray-500">12-17 seat group</div>
                    </Link>
                    <Link
                        href="/luxury-taxi"
                        className="group bg-gray-50 hover:bg-white hover:border-teal-300 hover:shadow rounded-xl border border-gray-200 p-3 transition-all text-center"
                    >
                        <Car className="h-5 w-5 text-teal-700 mx-auto mb-1.5" />
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Luxury Taxi</div>
                        <div className="text-[11px] text-gray-500">Mercedes / BMW</div>
                    </Link>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-10 mb-4">Plan your trip</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Link
                        href="/fare-calculator"
                        className="group inline-flex items-center gap-2 bg-gray-50 hover:bg-teal-50 hover:border-teal-300 rounded-xl border border-gray-200 px-4 py-3 transition-all"
                    >
                        <Calculator className="h-4 w-4 text-teal-700" />
                        <span className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Fare Calculator</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-teal-600 ml-auto" />
                    </Link>
                    <Link
                        href="/faq"
                        className="group inline-flex items-center gap-2 bg-gray-50 hover:bg-teal-50 hover:border-teal-300 rounded-xl border border-gray-200 px-4 py-3 transition-all"
                    >
                        <MessageSquareText className="h-4 w-4 text-teal-700" />
                        <span className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">FAQs</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-teal-600 ml-auto" />
                    </Link>
                    <Link
                        href="/reviews"
                        className="group inline-flex items-center gap-2 bg-gray-50 hover:bg-teal-50 hover:border-teal-300 rounded-xl border border-gray-200 px-4 py-3 transition-all"
                    >
                        <Star className="h-4 w-4 text-teal-700" />
                        <span className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Customer Reviews</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-teal-600 ml-auto" />
                    </Link>
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-2 bg-gray-50 hover:bg-teal-50 hover:border-teal-300 rounded-xl border border-gray-200 px-4 py-3 transition-all"
                    >
                        <BookOpen className="h-4 w-4 text-teal-700" />
                        <span className="font-semibold text-sm text-gray-900 group-hover:text-teal-800">Travel Blog</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-teal-600 ml-auto" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
