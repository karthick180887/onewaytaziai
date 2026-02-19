import Link from 'next/link';
import { PopularRoute } from '@/lib/districts';
import { MapPin, ArrowRight } from 'lucide-react';

interface PopularRoutesProps {
    districtName: string;
    routes: PopularRoute[];
}

export default function PopularRoutes({ districtName, routes }: PopularRoutesProps) {
    if (!routes.length) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Popular Routes from {districtName}
                    </h2>
                    <p className="text-lg text-gray-600">
                        Most booked one-way taxi routes from {districtName}. Book now and save up to 40%!
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {routes.slice(0, 10).map((route) => (
                        <div
                            key={route.toSlug}
                            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-teal-200 transition-all duration-300"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="bg-teal-100 p-2 rounded-lg shrink-0 group-hover:bg-teal-600 transition-colors">
                                    <MapPin className="h-4 w-4 text-teal-700 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{districtName} → {route.to}</div>
                                    <div className="text-sm text-gray-500">{route.distanceKm} km</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold">From</span>
                                    <div className="text-xl font-bold text-teal-700">₹{route.fareEstimate.toLocaleString('en-IN')}</div>
                                </div>
                                <Link
                                    href={`/${route.toSlug}-drop-taxi`}
                                    className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors"
                                >
                                    Book <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
