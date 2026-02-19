import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ComparisonTableProps {
    data: {
        feature: string;
        oneway: string;
        normal: string;
        bus: string;
    }[];
}

export default function ComparisonTable({ data }: ComparisonTableProps) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose OneWayTaxi.ai?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See how we stack up against regular two-way taxis and public transport. Save money without compromising on comfort.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="py-5 px-6 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider w-1/4">Feature</th>
                                <th className="py-5 px-6 text-center bg-teal-50 border-x border-teal-100 text-teal-900 font-bold text-lg w-1/4 relative">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500"></div>
                                    OneWayTaxi.ai
                                    <span className="block text-xs font-normal text-teal-600 mt-1">Recommended</span>
                                </th>
                                <th className="py-5 px-6 text-center text-gray-700 font-semibold w-1/4">Regular Taxi</th>
                                <th className="py-5 px-6 text-center text-gray-700 font-semibold w-1/4">Bus / Train</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-5 px-6 font-medium text-gray-900">{row.feature}</td>

                                    {/* OneWayTaxi Column */}
                                    <td className="py-5 px-6 bg-teal-50/30 border-x border-teal-100/50 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <CheckCircle2 className="h-6 w-6 text-teal-600" />
                                            <span className="font-bold text-gray-900 text-sm md:text-base">{row.oneway}</span>
                                        </div>
                                    </td>

                                    {/* Normal Taxi */}
                                    <td className="py-5 px-6 text-center">
                                        <div className="flex flex-col items-center gap-1.5 opacity-75">
                                            {row.feature === 'Price Type' ? <XCircle className="h-5 w-5 text-red-400" /> : <Info className="h-5 w-5 text-gray-400" />}
                                            <span className="text-gray-600 text-sm md:text-base">{row.normal}</span>
                                        </div>
                                    </td>

                                    {/* Bus */}
                                    <td className="py-5 px-6 text-center">
                                        <div className="flex flex-col items-center gap-1.5 opacity-75">
                                            {row.feature === 'Comfort' ? <AlertTriangle className="h-5 w-5 text-amber-400" /> : <Info className="h-5 w-5 text-gray-400" />}
                                            <span className="text-gray-600 text-sm md:text-base">{row.bus}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
