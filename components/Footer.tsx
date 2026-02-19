import Link from "next/link";
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { APP_NAME, SUPPORT_PHONE, GOOGLE_MAPS_URL } from "@/lib/constants";
import { DISTRICTS_BY_STATE, SERVICE_TYPES } from "@/lib/districts";

const states = [
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
    { name: 'Telangana', slug: 'telangana' },
    { name: 'Pondicherry', slug: 'pondicherry' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Top CTA Banner */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-600 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Book Your One-Way Taxi Now</h2>
                        <p className="text-teal-100 text-sm">Starting from just ₹13/km — No return fare!</p>
                    </div>
                    <a
                        href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors shadow-lg"
                    >
                        <Phone className="h-5 w-5" />
                        {SUPPORT_PHONE}
                    </a>
                </div>
            </div>

            {/* District Links by State */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h3 className="text-lg font-bold text-white mb-8">
                        Our Services Across South India — {states.reduce((sum, s) => sum + (DISTRICTS_BY_STATE.get(s.slug)?.length || 0), 0)} Districts
                    </h3>

                    <div className="space-y-10">
                        {states.map(s => {
                            const districts = DISTRICTS_BY_STATE.get(s.slug) || [];
                            return (
                                <div key={s.slug}>
                                    <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {s.name}
                                        <span className="text-gray-500 font-normal normal-case">({districts.length} districts)</span>
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1.5">
                                        {districts.map(d => (
                                            <Link
                                                key={d.slug}
                                                href={`/${d.slug}-drop-taxi`}
                                                className="text-sm text-gray-400 hover:text-teal-400 transition-colors truncate"
                                                title={`${d.name} Drop Taxi`}
                                            >
                                                {d.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Service Types Row */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Service Types</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {SERVICE_TYPES.map(st => (
                            <div key={st.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                                <h4 className="font-bold text-white text-sm mb-2">{st.label}</h4>
                                <ul className="space-y-1">
                                    {['Chennai', 'Bangalore', 'Hyderabad', 'Kochi', 'Coimbatore'].map(city => {
                                        const slug = city.toLowerCase() === 'bangalore' ? 'bangalore' : city.toLowerCase();
                                        const actualSlug = city === 'Kochi' ? 'kochi' : city === 'Bangalore' ? 'bangalore' : slug;
                                        return (
                                            <li key={city}>
                                                <Link
                                                    href={`/${actualSlug}-${st.id}`}
                                                    className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
                                                >
                                                    {city} {st.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-teal-500 p-2 rounded-lg">
                                <Car className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Premium one-way drop taxi service across South India.
                            Covering 115+ districts in Tamil Nadu, Kerala, Andhra Pradesh, Telangana, and Pondicherry.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-teal-600 hover:text-white transition-colors">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Tariff", href: "/#tariff" },
                                { label: "Contact Us", href: "/#contact" },
                                { label: "Sitemap", href: "/sitemap.xml" },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" />
                                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-teal-400 transition-colors">
                                    123, Anna Nagar, Chennai - 600040, Tamil Nadu
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-teal-500 shrink-0" />
                                <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="hover:text-teal-400 transition-colors text-sm">{SUPPORT_PHONE}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-teal-500 shrink-0" />
                                <a href="mailto:booking@onewaytaxi.ai" className="hover:text-teal-400 transition-colors text-sm">booking@onewaytaxi.ai</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. | Premium One-Way Taxi Service</p>
            </div>
        </footer>
    );
}
