"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Car, ChevronDown, MapPin, ChevronRight, Plane, Route, BookOpen, MessageCircle } from "lucide-react";
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

const popularCities = [
    { name: 'Chennai', slug: 'chennai' },
    { name: 'Bangalore', slug: 'bangalore' },
    { name: 'Hyderabad', slug: 'hyderabad' },
    { name: 'Kochi', slug: 'kochi' },
    { name: 'Coimbatore', slug: 'coimbatore' },
    { name: 'Madurai', slug: 'madurai' },
    { name: 'Tirupati', slug: 'tirupati' },
    { name: 'Trichy', slug: 'trichy' },
    { name: 'Mysore', slug: 'mysore' },
    { name: 'Ooty', slug: 'ooty' },
];

const airports = [
    { name: 'Chennai', slug: 'chennai-airport', code: 'MAA' },
    { name: 'Bangalore', slug: 'bangalore-airport', code: 'BLR' },
    { name: 'Hyderabad', slug: 'hyderabad-airport', code: 'HYD' },
    { name: 'Kochi', slug: 'kochi-airport', code: 'COK' },
    { name: 'Coimbatore', slug: 'coimbatore-airport', code: 'CJB' },
    { name: 'Madurai', slug: 'madurai-airport', code: 'IXM' },
];

const WHATSAPP_URL = 'https://wa.me/918124476010?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi.';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeState, setActiveState] = useState(states[0].slug);
    const [activeService, setActiveService] = useState(SERVICE_TYPES[0].id);
    const [scrolled, setScrolled] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Mobile
    const [mobileSection, setMobileSection] = useState<string | null>(null);
    const [mobileState, setMobileState] = useState<string | null>(null);
    const [mobileService, setMobileService] = useState(SERVICE_TYPES[0].id);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const openDropdown = (id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveDropdown(id);
        setActiveState(states[0].slug);
    };
    const closeDropdown = () => {
        timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
    };

    const activeDistricts = DISTRICTS_BY_STATE.get(activeState) || [];

    return (
        <header className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-md shadow-sm"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group shrink-0" aria-label={APP_NAME}>
                        <Image
                            src="/logo.png"
                            alt={APP_NAME}
                            width={1400}
                            height={480}
                            priority
                            className="h-9 sm:h-11 w-auto"
                        />
                    </Link>

                    {/* ─── Desktop Nav ─── */}
                    <nav className="hidden lg:flex items-center gap-1 ml-6">
                        {/* Cities Megamenu */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('cities')}
                            onMouseLeave={closeDropdown}
                        >
                            <button className={clsx(
                                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                                activeDropdown === 'cities' ? "text-teal-900 bg-teal-50" : "text-gray-600 hover:text-teal-900 hover:bg-teal-50"
                            )}>
                                <MapPin className="h-3.5 w-3.5" />
                                Cities <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform", activeDropdown === 'cities' && "rotate-180")} />
                            </button>

                            <div className={clsx(
                                "fixed left-0 right-0 top-16 bg-white border-t border-gray-100 shadow-xl transition-all duration-200 origin-top",
                                activeDropdown === 'cities' ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
                            )}>
                                <div className="max-w-7xl mx-auto px-6 py-5">
                                    {/* Service Type Pills */}
                                    <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-gray-100">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Service:</span>
                                        {SERVICE_TYPES.map(st => (
                                            <button
                                                key={st.id}
                                                onClick={() => setActiveService(st.id)}
                                                className={clsx(
                                                    "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                                                    activeService === st.id
                                                        ? "bg-teal-900 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-800"
                                                )}
                                            >
                                                {st.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-6">
                                        {/* State Tabs */}
                                        <div className="w-48 shrink-0 border-r border-gray-100 pr-4">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select State</p>
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
                                                    <ChevronRight className={clsx("h-3 w-3", activeState === s.slug ? "text-teal-600" : "opacity-20")} />
                                                </button>
                                            ))}
                                        </div>

                                        {/* City Grid */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {SERVICE_TYPES.find(s => s.id === activeService)?.label} in {states.find(s => s.slug === activeState)?.name}
                                                </p>
                                                <Link href={`/states/${activeState}`} className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                                                    View all →
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-5 gap-x-1 gap-y-0.5 max-h-[280px] overflow-y-auto">
                                                {activeDistricts.map(d => (
                                                    <Link
                                                        key={d.slug}
                                                        href={`/${activeService}-in-${d.slug}`}
                                                        className="flex items-center gap-1 px-2 py-1.5 rounded text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-800 transition-all truncate"
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

                        {/* Airport Dropdown */}
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

                            <div className={clsx(
                                "absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-200 origin-top-right",
                                activeDropdown === 'airport' ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                            )}>
                                <div className="p-1.5">
                                    {airports.map(a => (
                                        <Link
                                            key={a.slug}
                                            href={`/airport-taxi/${a.slug}`}
                                            className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-900 rounded-lg transition-all"
                                        >
                                            <span>{a.name}</span>
                                            <span className="text-xs text-gray-400 font-mono">{a.code}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href="/fare-calculator" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-900 rounded-lg hover:bg-teal-50 transition-all">
                            Fare Calculator
                        </Link>

                        <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-900 rounded-lg hover:bg-teal-50 transition-all">
                            Blog
                        </Link>

                        <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-900 rounded-lg hover:bg-teal-50 transition-all">
                            About
                        </Link>
                    </nav>

                    {/* Desktop CTAs */}
                    <div className="hidden lg:flex items-center gap-2 ml-auto">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-2 rounded-full hover:bg-[#20BD5A] transition-all text-sm font-medium"
                        >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                        </a>
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="flex items-center gap-1.5 bg-teal-900 text-white px-3 py-2 rounded-full hover:bg-teal-800 transition-all text-sm font-medium"
                        >
                            <Phone className="h-4 w-4" />
                            {SUPPORT_PHONE}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:text-teal-900 rounded-lg hover:bg-gray-100"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* ─── Mobile Menu ─── */}
            <div className={clsx(
                "lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto transition-all duration-300 z-50",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            )}>
                <div className="px-4 pt-3 pb-32">
                    {/* Popular Cities — quick access */}
                    <div className="mb-4 pb-3 border-b border-gray-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Cities</p>
                        <div className="flex flex-wrap gap-1.5">
                            {popularCities.map(c => (
                                <Link
                                    key={c.slug}
                                    href={`/${mobileService}-in-${c.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full active:bg-teal-100 active:text-teal-900"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="space-y-0.5">
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 active:bg-teal-50 rounded-xl font-medium">
                            <Car className="h-4 w-4 text-teal-600" /> Home
                        </Link>

                        {/* Browse Cities */}
                        <div>
                            <button
                                onClick={() => setMobileSection(mobileSection === 'cities' ? null : 'cities')}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium",
                                    mobileSection === 'cities' ? "bg-teal-50 text-teal-900" : "text-gray-700"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-teal-600" /> Browse Cities
                                </span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", mobileSection === 'cities' && "rotate-180")} />
                            </button>

                            {mobileSection === 'cities' && (
                                <div className="ml-2 mt-1 border-l-2 border-teal-100 pl-2">
                                    {/* Service type selector */}
                                    <div className="flex flex-wrap gap-1.5 px-2 py-2 mb-2">
                                        {SERVICE_TYPES.map(st => (
                                            <button
                                                key={st.id}
                                                onClick={() => setMobileService(st.id)}
                                                className={clsx(
                                                    "px-2.5 py-1 text-[11px] font-medium rounded-full transition-all",
                                                    mobileService === st.id
                                                        ? "bg-teal-900 text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                )}
                                            >
                                                {st.label}
                                            </button>
                                        ))}
                                    </div>
                                    {states.map(s => {
                                        const districts = DISTRICTS_BY_STATE.get(s.slug) || [];
                                        const isOpen = mobileState === s.slug;
                                        const tier12 = districts.filter(d => d.tier <= 2);
                                        return (
                                            <div key={s.slug}>
                                                <button
                                                    onClick={() => setMobileState(isOpen ? null : s.slug)}
                                                    className={clsx(
                                                        "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg",
                                                        isOpen ? "bg-gray-50 text-teal-800 font-semibold" : "text-gray-600"
                                                    )}
                                                >
                                                    {s.name}
                                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                                        {districts.length}
                                                        <ChevronDown className={clsx("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="py-1 px-1">
                                                        <div className="grid grid-cols-3 gap-0.5">
                                                            {tier12.map(d => (
                                                                <Link
                                                                    key={d.slug}
                                                                    href={`/${mobileService}-in-${d.slug}`}
                                                                    onClick={() => setIsOpen(false)}
                                                                    className="px-2 py-1.5 text-xs text-gray-600 active:bg-teal-50 active:text-teal-900 rounded truncate"
                                                                >
                                                                    {d.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        <Link
                                                            href={`/states/${s.slug}`}
                                                            onClick={() => setIsOpen(false)}
                                                            className="block px-2 py-2 mt-1 text-xs text-teal-600 font-semibold"
                                                        >
                                                            View all {districts.length} cities in {s.name} →
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Airport */}
                        <div>
                            <button
                                onClick={() => setMobileSection(mobileSection === 'airport' ? null : 'airport')}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium",
                                    mobileSection === 'airport' ? "bg-teal-50 text-teal-900" : "text-gray-700"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Plane className="h-4 w-4 text-teal-600" /> Airport Taxi
                                </span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", mobileSection === 'airport' && "rotate-180")} />
                            </button>
                            {mobileSection === 'airport' && (
                                <div className="ml-2 mt-1 grid grid-cols-2 gap-0.5 border-l-2 border-teal-100 pl-2">
                                    {airports.map(a => (
                                        <Link
                                            key={a.slug}
                                            href={`/airport-taxi/${a.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-600 active:bg-teal-50 rounded-lg"
                                        >
                                            <span>{a.name}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">{a.code}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/fare-calculator" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 active:bg-teal-50 rounded-xl font-medium">
                            <Route className="h-4 w-4 text-teal-600" /> Fare Calculator
                        </Link>

                        <Link href="/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 active:bg-teal-50 rounded-xl font-medium">
                            <BookOpen className="h-4 w-4 text-teal-600" /> Blog
                        </Link>

                        <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 active:bg-teal-50 rounded-xl font-medium">
                            About Us
                        </Link>

                        <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 active:bg-teal-50 rounded-xl font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* Mobile CTAs */}
                    <div className="mt-5 space-y-2">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Book on WhatsApp
                        </a>
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="flex items-center justify-center gap-2 w-full bg-teal-900 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
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
