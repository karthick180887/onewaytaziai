"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, Menu, X, Car, ChevronDown, MapPin, ChevronRight, Plane, Route, BookOpen, Info, PhoneCall, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { APP_NAME, SUPPORT_PHONE } from "@/lib/constants";
import { DISTRICTS_BY_STATE, SERVICE_TYPES } from "@/lib/districts";

const states = [
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Karnataka', slug: 'karnataka' },
    { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
    { name: 'Telangana', slug: 'telangana' },
    { name: 'Pondicherry', slug: 'pondicherry' },
];

const quickCities = [
    { name: 'Chennai', slug: 'chennai' },
    { name: 'Bangalore', slug: 'bangalore' },
    { name: 'Hyderabad', slug: 'hyderabad' },
    { name: 'Kochi', slug: 'kochi' },
    { name: 'Coimbatore', slug: 'coimbatore' },
    { name: 'Madurai', slug: 'madurai' },
    { name: 'Tirupati', slug: 'tirupati' },
    { name: 'Trichy', slug: 'trichy' },
];

const WHATSAPP_URL = 'https://wa.me/918124476010?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi.';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeState, setActiveState] = useState(states[0].slug);
    const [scrolled, setScrolled] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Mobile accordion
    const [mobileSection, setMobileSection] = useState<string | null>(null);
    const [mobileState, setMobileState] = useState<string | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const openDropdown = (id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveDropdown(id);
    };
    const closeDropdown = () => {
        timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
    };

    const activeDistricts = DISTRICTS_BY_STATE.get(activeState) || [];

    return (
        <header className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled
                ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
                : "bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-18">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="bg-teal-900 p-1.5 rounded-lg group-hover:bg-teal-800 transition-colors">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-900 to-teal-600">
                            {APP_NAME}
                        </span>
                    </Link>

                    {/* ─── Desktop Navigation ─── */}
                    <nav className="hidden lg:flex items-center gap-1 ml-8">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-900 rounded-lg hover:bg-teal-50 transition-all">
                            Home
                        </Link>

                        {/* Services Megamenu — single dropdown for all 6 service types */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('services')}
                            onMouseLeave={closeDropdown}
                        >
                            <button className={clsx(
                                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                                activeDropdown === 'services' ? "text-teal-900 bg-teal-50" : "text-gray-600 hover:text-teal-900 hover:bg-teal-50"
                            )}>
                                Services <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform", activeDropdown === 'services' && "rotate-180")} />
                            </button>

                            {/* Services Megamenu Panel */}
                            <div className={clsx(
                                "fixed left-0 right-0 top-16 lg:top-[72px] bg-white border-t border-gray-100 shadow-xl transition-all duration-200 origin-top",
                                activeDropdown === 'services' ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
                            )}>
                                <div className="max-w-7xl mx-auto px-6 py-6">
                                    <div className="flex gap-6">
                                        {/* Left: Service Types + States */}
                                        <div className="w-60 shrink-0 space-y-4">
                                            {/* Service Types */}
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Services</h3>
                                                <div className="space-y-0.5">
                                                    {SERVICE_TYPES.map(st => (
                                                        <Link
                                                            key={st.id}
                                                            href={`/${st.id}-in-chennai`}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-900 rounded-lg transition-all"
                                                        >
                                                            <MapPin className="h-3.5 w-3.5 text-teal-500" />
                                                            {st.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* States */}
                                            <div className="border-t border-gray-100 pt-3">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Browse by State</h3>
                                                <div className="space-y-0.5">
                                                    {states.map(s => (
                                                        <button
                                                            key={s.slug}
                                                            onMouseEnter={() => setActiveState(s.slug)}
                                                            className={clsx(
                                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                                                activeState === s.slug
                                                                    ? "bg-teal-50 text-teal-900 font-semibold"
                                                                    : "text-gray-600 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {s.name}
                                                            <ChevronRight className={clsx("h-3.5 w-3.5", activeState === s.slug ? "text-teal-600" : "opacity-30")} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Cities Grid */}
                                        <div className="flex-1 min-w-0 border-l border-gray-100 pl-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-bold text-gray-800">
                                                    {states.find(s => s.slug === activeState)?.name}
                                                </h3>
                                                <Link
                                                    href={`/states/${activeState}`}
                                                    className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                                                >
                                                    View all →
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-4 gap-x-2 gap-y-1 max-h-[320px] overflow-y-auto pr-2">
                                                {activeDistricts.map(d => (
                                                    <Link
                                                        key={d.slug}
                                                        href={`/drop-taxi-in-${d.slug}`}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-800 transition-all truncate"
                                                    >
                                                        {d.tier === 1 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                                                        <span className="truncate">{d.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Routes */}
                        <Link href="/fare-calculator" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-900 rounded-lg hover:bg-teal-50 transition-all">
                            Fare Calculator
                        </Link>

                        {/* Airport Taxi */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('airport')}
                            onMouseLeave={closeDropdown}
                        >
                            <button className={clsx(
                                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                                activeDropdown === 'airport' ? "text-teal-900 bg-teal-50" : "text-gray-600 hover:text-teal-900 hover:bg-teal-50"
                            )}>
                                <Plane className="h-3.5 w-3.5" />
                                Airport <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform", activeDropdown === 'airport' && "rotate-180")} />
                            </button>

                            {/* Airport Dropdown */}
                            <div className={clsx(
                                "absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-200 origin-top-right",
                                activeDropdown === 'airport' ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                            )}>
                                <div className="p-2">
                                    {[
                                        { name: 'Chennai Airport', slug: 'chennai-airport', code: 'MAA' },
                                        { name: 'Bangalore Airport', slug: 'bangalore-airport', code: 'BLR' },
                                        { name: 'Hyderabad Airport', slug: 'hyderabad-airport', code: 'HYD' },
                                        { name: 'Kochi Airport', slug: 'kochi-airport', code: 'COK' },
                                        { name: 'Coimbatore Airport', slug: 'coimbatore-airport', code: 'CJB' },
                                        { name: 'Madurai Airport', slug: 'madurai-airport', code: 'IXM' },
                                    ].map(a => (
                                        <Link
                                            key={a.slug}
                                            href={`/airport-taxi/${a.slug}`}
                                            className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-900 rounded-lg transition-all"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Plane className="h-3.5 w-3.5 text-teal-500" />
                                                {a.name}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">{a.code}</span>
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <Link
                                            href="/airport-taxi/chennai-airport"
                                            className="block px-3 py-2 text-xs text-teal-600 hover:text-teal-800 font-medium"
                                        >
                                            View all airports →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blog */}
                        <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-900 rounded-lg hover:bg-teal-50 transition-all">
                            Blog
                        </Link>
                    </nav>

                    {/* Desktop: Call + WhatsApp CTAs */}
                    <div className="hidden lg:flex items-center gap-2 ml-auto pl-4">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full hover:bg-[#20BD5A] transition-all text-sm font-medium"
                        >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                        </a>
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="flex items-center gap-1.5 bg-teal-900 text-white px-4 py-2 rounded-full hover:bg-teal-800 transition-all text-sm font-medium"
                        >
                            <Phone className="h-4 w-4" />
                            {SUPPORT_PHONE}
                        </a>
                    </div>

                    {/* Mobile: Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:text-teal-900 transition-colors rounded-lg hover:bg-gray-100"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* ─── Mobile Navigation ─── */}
            <div className={clsx(
                "lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto transition-all duration-300 z-50",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <div className="px-4 pt-2 pb-32">
                    {/* Quick City Chips */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Popular Cities</p>
                        <div className="flex flex-wrap gap-2">
                            {quickCities.map(c => (
                                <Link
                                    key={c.slug}
                                    href={`/drop-taxi-in-${c.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-teal-50 hover:text-teal-800 transition-colors"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main Nav Links */}
                    <div className="space-y-0.5">
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium">
                            <Car className="h-4 w-4 text-teal-600" /> Home
                        </Link>

                        {/* Services Accordion */}
                        <div>
                            <button
                                onClick={() => setMobileSection(mobileSection === 'services' ? null : 'services')}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors",
                                    mobileSection === 'services' ? "bg-teal-50 text-teal-900" : "text-gray-700"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-teal-600" /> Services
                                </span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", mobileSection === 'services' && "rotate-180")} />
                            </button>

                            {mobileSection === 'services' && (
                                <div className="ml-4 mt-1 space-y-0.5">
                                    {/* Service Types */}
                                    {SERVICE_TYPES.map(st => (
                                        <Link
                                            key={st.id}
                                            href={`/${st.id}-in-chennai`}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg"
                                        >
                                            {st.label}
                                        </Link>
                                    ))}

                                    {/* States */}
                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">By State</p>
                                        {states.map(s => {
                                            const districts = DISTRICTS_BY_STATE.get(s.slug) || [];
                                            const isExpanded = mobileState === s.slug;
                                            return (
                                                <div key={s.slug}>
                                                    <button
                                                        onClick={() => setMobileState(isExpanded ? null : s.slug)}
                                                        className={clsx(
                                                            "w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all",
                                                            isExpanded ? "bg-gray-50 text-teal-800 font-semibold" : "text-gray-600"
                                                        )}
                                                    >
                                                        {s.name}
                                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            {districts.length}
                                                            <ChevronDown className={clsx("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
                                                        </span>
                                                    </button>
                                                    {isExpanded && (
                                                        <div className="grid grid-cols-3 gap-1 px-2 py-1">
                                                            {districts.filter(d => d.tier <= 2).map(d => (
                                                                <Link
                                                                    key={d.slug}
                                                                    href={`/drop-taxi-in-${d.slug}`}
                                                                    onClick={() => setIsOpen(false)}
                                                                    className="px-2 py-1.5 text-xs text-gray-500 hover:text-teal-800 hover:bg-teal-50 rounded truncate"
                                                                >
                                                                    {d.name}
                                                                </Link>
                                                            ))}
                                                            <Link
                                                                href={`/states/${s.slug}`}
                                                                onClick={() => setIsOpen(false)}
                                                                className="px-2 py-1.5 text-xs text-teal-600 font-medium col-span-3"
                                                            >
                                                                View all {districts.length} cities →
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Airport Taxi */}
                        <div>
                            <button
                                onClick={() => setMobileSection(mobileSection === 'airport' ? null : 'airport')}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors",
                                    mobileSection === 'airport' ? "bg-teal-50 text-teal-900" : "text-gray-700"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Plane className="h-4 w-4 text-teal-600" /> Airport Taxi
                                </span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", mobileSection === 'airport' && "rotate-180")} />
                            </button>
                            {mobileSection === 'airport' && (
                                <div className="ml-4 mt-1 grid grid-cols-2 gap-1">
                                    {[
                                        { name: 'Chennai', slug: 'chennai-airport', code: 'MAA' },
                                        { name: 'Bangalore', slug: 'bangalore-airport', code: 'BLR' },
                                        { name: 'Hyderabad', slug: 'hyderabad-airport', code: 'HYD' },
                                        { name: 'Kochi', slug: 'kochi-airport', code: 'COK' },
                                        { name: 'Coimbatore', slug: 'coimbatore-airport', code: 'CJB' },
                                        { name: 'Madurai', slug: 'madurai-airport', code: 'IXM' },
                                    ].map(a => (
                                        <Link
                                            key={a.slug}
                                            href={`/airport-taxi/${a.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-900 rounded-lg"
                                        >
                                            <span>{a.name}</span>
                                            <span className="text-xs text-gray-400 font-mono">{a.code}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/fare-calculator" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium">
                            <Route className="h-4 w-4 text-teal-600" /> Fare Calculator
                        </Link>

                        <Link href="/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium">
                            <BookOpen className="h-4 w-4 text-teal-600" /> Blog
                        </Link>

                        <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium">
                            <Info className="h-4 w-4 text-teal-600" /> About
                        </Link>

                        <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium">
                            <PhoneCall className="h-4 w-4 text-teal-600" /> Contact
                        </Link>
                    </div>

                    {/* Mobile CTAs */}
                    <div className="mt-6 space-y-2">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Book on WhatsApp
                        </a>
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="flex items-center justify-center gap-2 w-full bg-teal-900 text-white px-4 py-3 rounded-xl font-bold"
                        >
                            <Phone className="h-5 w-5" />
                            Call {SUPPORT_PHONE}
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
