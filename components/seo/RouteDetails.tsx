import { District } from '@/lib/districts';
import { VEHICLE_TYPES } from '@/lib/constants';
import { MapPin, Clock, IndianRupee } from 'lucide-react';

interface RouteDetailsProps {
    district: District;
    serviceLabel: string;
}

export default function RouteDetails({ district, serviceLabel }: RouteDetailsProps) {
    const topRoutes = district.popularRoutes.slice(0, 5);
    if (topRoutes.length === 0) return null;

    return (
        <section className="py-16 bg-white" aria-label="Route details and fare estimates">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {district.name} {serviceLabel} — Route-wise Fare Details
                </h2>
                <p className="text-gray-600 mb-10">
                    Detailed fare breakdown for popular {serviceLabel.toLowerCase()} routes from {district.name}, {district.state}.
                    All fares are one-way and include driver bata, toll, and GST.
                </p>

                <div className="space-y-8">
                    {topRoutes.map((route) => {
                        const durationHrs = Math.round(route.distanceKm / 55);
                        const durationMins = Math.round((route.distanceKm / 55 - durationHrs) * 60);
                        const durationText = durationHrs > 0
                            ? `${durationHrs}h ${durationMins > 0 ? `${durationMins}m` : ''}`
                            : `${durationMins}m`;

                        return (
                            <article
                                key={route.toSlug}
                                className="border border-gray-200 rounded-xl p-6 hover:border-teal-200 transition-colors"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {district.name} to {route.to} {serviceLabel} — ₹{route.fareEstimate} Onwards
                                </h3>

                                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-teal-600" />
                                        {route.distanceKm} km
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-teal-600" />
                                        ~{durationText} drive
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <IndianRupee className="h-4 w-4 text-teal-600" />
                                        From ₹{route.fareEstimate}
                                    </span>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Book a one-way {serviceLabel.toLowerCase()} from {district.name} to {route.to} starting at just
                                    ₹{route.fareEstimate} for a hatchback ({route.distanceKm} km × ₹{VEHICLE_TYPES[0].price}/km).
                                    Sedan fare: ~₹{Math.round(route.distanceKm * VEHICLE_TYPES[1].price)}.
                                    SUV/Innova fare: ~₹{Math.round(route.distanceKm * (VEHICLE_TYPES[4]?.price || 19))}.
                                    The journey takes approximately {durationText} via the most common highway route.
                                    All fares include driver allowance, toll charges, permit fees, and GST with zero hidden costs.
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {VEHICLE_TYPES.slice(0, 4).map(v => (
                                        <span
                                            key={v.id}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700"
                                        >
                                            {v.name}: ₹{Math.round(route.distanceKm * v.price)}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
