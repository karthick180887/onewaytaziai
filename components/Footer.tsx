import Link from "next/link";
import { Car, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { APP_NAME, SUPPORT_PHONE } from "@/lib/constants";
import { DISTRICTS_BY_STATE, SERVICE_TYPES } from "@/lib/districts";

const WHATSAPP_URL = 'https://wa.me/918124476010?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi.';

const states = [
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Karnataka', slug: 'karnataka' },
    { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
    { name: 'Telangana', slug: 'telangana' },
    { name: 'Pondicherry', slug: 'pondicherry' },
];

const topCitySlugs = ['chennai', 'bangalore', 'hyderabad', 'kochi', 'coimbatore'];

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
                    <div className="flex gap-3">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold hover:bg-[#20BD5A] transition-colors shadow-lg text-sm"
                        >
                            <MessageCircle className="h-5 w-5" />
                            WhatsApp
                        </a>
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="flex items-center gap-2 bg-white text-teal-900 px-5 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors shadow-lg text-sm"
                        >
                            <Phone className="h-5 w-5" />
                            {SUPPORT_PHONE}
                        </a>
                    </div>
                </div>
            </div>

            {/* Service Types — Top cities with CORRECT URL pattern */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Our Services</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {SERVICE_TYPES.map(st => (
                            <div key={st.id}>
                                <h4 className="font-bold text-teal-400 text-xs uppercase tracking-wider mb-2">{st.label}</h4>
                                <ul className="space-y-1">
                                    {topCitySlugs.map(slug => {
                                        const cityName = slug.charAt(0).toUpperCase() + slug.slice(1);
                                        return (
                                            <li key={slug}>
                                                <Link
                                                    href={`/${st.id}-in-${slug}`}
                                                    className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
                                                >
                                                    {cityName}
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

            {/* District Links by State — only show tier 1 & 2 to reduce clutter, link to state page for full list */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h3 className="text-lg font-bold text-white mb-6">
                        Cities We Serve
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {states.map(s => {
                            const districts = DISTRICTS_BY_STATE.get(s.slug) || [];
                            const tier12 = districts.filter(d => d.tier <= 2);
                            const tier3Count = districts.length - tier12.length;
                            return (
                                <div key={s.slug}>
                                    <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {s.name}
                                    </h4>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        {tier12.map(d => (
                                            <Link
                                                key={d.slug}
                                                href={`/drop-taxi-in-${d.slug}`}
                                                className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
                                            >
                                                {d.name}
                                            </Link>
                                        ))}
                                        {tier3Count > 0 && (
                                            <Link
                                                href={`/states/${s.slug}`}
                                                className="text-xs text-teal-500 hover:text-teal-400 font-medium"
                                            >
                                                +{tier3Count} more
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="space-y-3 col-span-2 sm:col-span-3 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="bg-teal-500 p-1.5 rounded-lg">
                                <Car className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">{APP_NAME}</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            South India&apos;s leading one-way drop taxi service. 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana &amp; Pondicherry.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Services</h3>
                        <ul className="space-y-2">
                            {[
                                { label: "Drop Taxi", href: "/drop-taxi" },
                                { label: "One Way Taxi", href: "/one-way-taxi" },
                                { label: "Outstation Cabs", href: "/outstation-cabs" },
                                { label: "Round Trip Taxi", href: "/round-trip-taxi" },
                                { label: "Airport Taxi", href: "/airport-taxi" },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Vehicles */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Vehicles</h3>
                        <ul className="space-y-2">
                            {[
                                { label: "Sedan Taxi", href: "/sedan-taxi" },
                                { label: "SUV Taxi", href: "/suv-taxi" },
                                { label: "Innova Crysta", href: "/innova-crysta-taxi" },
                                { label: "Tempo Traveller", href: "/tempo-traveller" },
                                { label: "Luxury Taxi", href: "/luxury-taxi" },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { label: "Book Now", href: "/book-now" },
                                { label: "Fare Calculator", href: "/fare-calculator" },
                                { label: "All-Inclusive Pricing", href: "/all-inclusive-pricing" },
                                { label: "FAQ", href: "/faq" },
                                { label: "Reviews", href: "/reviews" },
                                { label: "About Us", href: "/about" },
                                { label: "Contact", href: "/contact" },
                                { label: "Blog", href: "/blog" },
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
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-teal-500 shrink-0" />
                                <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="hover:text-teal-400 transition-colors text-sm">{SUPPORT_PHONE}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                                <a href="mailto:booking@onewaytaxi.ai" className="hover:text-teal-400 transition-colors text-sm">booking@onewaytaxi.ai</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="h-4 w-4 text-[#25D366] shrink-0" />
                                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors text-sm">WhatsApp Booking</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-400">
                                    Chennai, Tamil Nadu, India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. | One-Way Drop Taxi Across South India</p>
                    <div className="flex items-center gap-4">
                        <Link href="/terms-and-conditions" className="hover:text-teal-400 transition-colors">Terms & Conditions</Link>
                        <Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
                        <Link href="/sitemap.xml" className="hover:text-teal-400 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
