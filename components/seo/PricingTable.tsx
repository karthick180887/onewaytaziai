import { VEHICLE_TYPES } from '@/lib/constants';
import { Car, CarFront, Bus, Truck, Users, Snowflake } from 'lucide-react';
import AllInclusiveBadge from '@/components/seo/AllInclusiveBadge';

const ICONS: Record<string, React.ElementType> = { Car, CarFront, Bus, Truck };

interface PricingTableProps {
    districtName: string;
}

export default function PricingTable({ districtName }: PricingTableProps) {
    return (
        <section className="py-16 bg-white" id="tariff" aria-label="Taxi fare pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        {districtName} Taxi Fare — Per KM Rates
                    </h2>
                    <p className="text-lg text-gray-600">
                        Choose from our fleet of well-maintained, AC vehicles. All fares inclusive of driver bata, tolls & GST.
                    </p>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-teal-900 text-white">
                                <th className="text-left py-4 px-6 font-semibold">Vehicle Type</th>
                                <th className="text-center py-4 px-4 font-semibold">Seats</th>
                                <th className="text-center py-4 px-4 font-semibold">Per KM Rate</th>
                                <th className="text-center py-4 px-4 font-semibold">AC</th>
                                <th className="text-center py-4 px-4 font-semibold">All-Inclusive</th>
                                <th className="text-center py-4 px-4 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {VEHICLE_TYPES.map((v, idx) => (
                                <tr key={v.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {/* @ts-ignore */}
                                            <img src={v.image} alt={v.name} width={80} height={48} loading="lazy" className="h-12 w-20 object-contain bg-gray-100/50 rounded-md p-1" />
                                            <span className="font-semibold text-gray-900">{v.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-600">
                                            <Users className="h-4 w-4" /> {v.seat}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className="text-2xl font-bold text-teal-700">₹{v.price}</span>
                                        <span className="text-sm text-gray-500">/km</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <Snowflake className="h-5 w-5 text-blue-500 mx-auto" />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <AllInclusiveBadge size="compact" />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <a href="#booking" className="inline-flex items-center gap-1 bg-teal-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-teal-800 transition-colors text-sm">
                                            Book Now
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {VEHICLE_TYPES.map((v) => {
                        const Icon = ICONS[v.icon] || Car;
                        return (
                            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-teal-50 p-2 rounded-lg">
                                            {/* @ts-ignore */}
                                            <img src={v.image} alt={v.name} width={64} height={40} loading="lazy" className="h-10 w-16 object-contain" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{v.name}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <Users className="h-3.5 w-3.5" /> {v.seat} seats • <Snowflake className="h-3.5 w-3.5 text-blue-500" /> AC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-teal-700">₹{v.price}</div>
                                        <div className="text-xs text-gray-500">per km</div>
                                    </div>
                                </div>
                                <div className="mb-3 flex justify-center sm:justify-start">
                                    <AllInclusiveBadge size="compact" />
                                </div>
                                <a href="#booking" className="block text-center bg-teal-900 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors">
                                    Book Now
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Inclusions */}
                <div className="mt-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-sm text-emerald-800 font-medium">
                        ✅ <strong>All fares include:</strong> Driver bata, Toll charges, Permit fees, GST — No hidden charges!
                    </p>
                </div>
            </div>
        </section>
    );
}
