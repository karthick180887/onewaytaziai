import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbNavProps {
    state: string;
    stateSlug: string;
    districtName: string;
    districtSlug: string;
    serviceLabel: string;
}

export default function BreadcrumbNav({ state, stateSlug, districtName, districtSlug, serviceLabel }: BreadcrumbNavProps) {
    const crumbs = [
        { label: 'Home', href: '/' },
        { label: state, href: `/${stateSlug}` },
        { label: districtName, href: `/${districtSlug}-drop-taxi` },
        { label: serviceLabel, href: null },
    ];

    return (
        <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                    {crumbs.map((crumb, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-teal-700 transition-colors flex items-center gap-1">
                                    {idx === 0 && <Home className="h-3.5 w-3.5" />}
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-teal-800 font-medium">{crumb.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
