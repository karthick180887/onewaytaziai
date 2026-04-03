import Link from 'next/link';
import { District, DISTRICTS_BY_STATE, SERVICE_TYPES, ServiceType } from '@/lib/districts';
import { MapPin } from 'lucide-react';

interface RelatedDistrictsProps {
    currentDistrict: District;
    currentServiceType: ServiceType;
}

export default function RelatedDistricts({ currentDistrict, currentServiceType }: RelatedDistrictsProps) {
    const stateDistricts = DISTRICTS_BY_STATE.get(currentDistrict.stateSlug) || [];
    const related = stateDistricts
        .filter(d => d.slug !== currentDistrict.slug)
        .slice(0, 8);

    const otherServices = SERVICE_TYPES.filter(s => s.id !== currentServiceType);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cross-service links */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Other Services in {currentDistrict.name}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {otherServices.map(st => (
                            <Link
                                key={st.id}
                                href={`/${st.id}-in-${currentDistrict.slug}`}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-teal-300 hover:text-teal-800 hover:shadow-sm transition-all"
                            >
                                <MapPin className="h-4 w-4 text-teal-600" />
                                {currentDistrict.name} {st.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Related districts */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Explore More {currentDistrict.state} Districts
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {related.map(d => (
                            <Link
                                key={d.slug}
                                href={`/${currentServiceType}-in-${d.slug}`}
                                className="group flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
                            >
                                <div className="shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                                    <MapPin className="h-4 w-4 text-teal-700 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 group-hover:text-teal-800 transition-colors">{d.name}</div>
                                    <div className="text-xs text-gray-500">{d.state}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
