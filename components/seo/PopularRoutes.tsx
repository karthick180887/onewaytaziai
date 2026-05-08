import Link from 'next/link';
import { PopularRoute } from '@/lib/districts';
import { MapPin, ArrowRight } from 'lucide-react';

interface PopularRoutesProps {
    districtName: string;
    districtSlug: string;
    routes: PopularRoute[];
}

export default function PopularRoutes({ districtName, districtSlug, routes }: PopularRoutesProps) {
    if (!routes.length) return null;

    return (
        <section className="py-16 bg-gray-50" aria-label="Popular taxi routes">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Popular One-Way Taxi Routes from {districtName}
                    </h2>
                    <p className="text-lg text-gray-600">
                        Most booked one-way drop taxi routes from {districtName}. Book now and save up to 40% vs round-trip!
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {routes.slice(0, 10).map((route) => (
                        <Link
                            key={route.toSlug}
                            href={`/route/${districtSlug}-to-${route.toSlug}-taxi`}
                            title={`${districtName} to ${route.to} drop taxi — ₹${route.fareEstimate}`}
                            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-teal-200 transition-all duration-300 block"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="bg-teal-100 p-2 rounded-lg shrink-0 group-hover:bg-teal-600 transition-colors">
                                    <MapPin className="h-4 w-4 text-teal-700 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{districtName} to {route.to} Taxi</h3>
                                    <div className="text-sm text-gray-500">{route.distanceKm} km distance</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold">From</span>
                                    <div className="text-xl font-bold text-teal-700">₹{route.fareEstimate.toLocaleString('en-IN')}</div>
                                </div>
                                <span className="flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-900 transition-colors">
                                    Book Now <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
