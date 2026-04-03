"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, Car, ChevronDown, MapPin, ChevronRight, Plane, ArrowRightLeft, Spline } from "lucide-react";
import { clsx } from "clsx";
import { APP_NAME, SUPPORT_PHONE } from "@/lib/constants";
import { ALL_DISTRICTS, DISTRICTS_BY_STATE, SERVICE_TYPES } from "@/lib/districts";

const states = [
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
    { name: 'Telangana', slug: 'telangana' },
    { name: 'Karnataka', slug: 'karnataka' },
    { name: 'Pondicherry', slug: 'pondicherry' },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    // Desktop: Track which service menu is open (null = none)
    const [openServiceId, setOpenServiceId] = useState<string | null>(null);
    const [activeState, setActiveState] = useState(states[0].slug);

    // Mobile: Track expanded sections
    const [mobileExpandedService, setMobileExpandedService] = useState<string | null>(null);
    const [mobileActiveState, setMobileActiveState] = useState<string | null>(null);

    const activeDistricts = DISTRICTS_BY_STATE.get(activeState) || [];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0 mr-8">
                        <div className="bg-teal-900 p-2 rounded-lg group-hover:bg-teal-800 transition-colors">
                            <Car className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-900 to-teal-600">
                            {APP_NAME}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-teal-900 font-medium transition-colors text-sm">Home</Link>
                        <Link href="/#tariff" className="text-gray-600 hover:text-teal-900 font-medium transition-colors text-sm">Tariff</Link>

                        {/* 4 Separate Megamenus */}
                        {SERVICE_TYPES.map(st => (
                            <div
                                key={st.id}
                                className="relative h-20 flex items-center"
                                onMouseEnter={() => setOpenServiceId(st.id)}
                                onMouseLeave={() => setOpenServiceId(null)}
                            >
                                <button className={clsx(
                                    "flex items-center gap-1 font-medium transition-colors text-sm",
                                    openServiceId === st.id ? "text-teal-900" : "text-gray-600 hover:text-teal-900"
                                )}>
                                    {st.label} <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform", openServiceId === st.id && "rotate-180")} />
                                </button>

                                {/* Generic Megamenu Panel */}
                                <div className={clsx(
                                    "fixed left-0 right-0 top-20 bg-white border-t border-gray-100 shadow-xl transition-all duration-200 origin-top",
                                    openServiceId === st.id ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
                                )}>
                                    <div className="max-w-7xl mx-auto px-6 py-8">
                                        <div className="flex gap-8">
                                            {/* State Sidebar */}
                                            <div className="w-56 shrink-0 border-r border-gray-100 pr-6">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Select State</h3>
                                                <ul className="space-y-1">
                                                    {states.map(s => (
                                                        <li key={s.slug}>
                                                            <button
                                                                onMouseEnter={() => setActiveState(s.slug)}
                                                                onClick={() => setActiveState(s.slug)}
                                                                className={clsx(
                                                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                                                    activeState === s.slug
                                                                        ? "bg-teal-50 text-teal-900 border-l-2 border-teal-600 shadow-sm"
                                                                        : "text-gray-600 hover:bg-gray-50"
                                                                )}
                                                            >
                                                                {s.name}
                                                                <ChevronRight className={clsx("h-3.5 w-3.5", activeState === s.slug ? "text-teal-600" : "opacity-30")} />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* District Grid */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-2">
                                                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-teal-600" />
                                                        {states.find(s => s.slug === activeState)?.name} — {st.label}
                                                    </h3>
                                                    <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                                        {activeDistricts.length} Locations
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-x-2 gap-y-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {activeDistricts.map(d => (
                                                        <Link
                                                            key={d.slug}
                                                            href={`/${st.id}-in-${d.slug}`}
                                                            className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-800 transition-all group border border-transparent hover:border-teal-100"
                                                        >
                                                            <span className="truncate mr-2">{d.name}</span>
                                                            {d.tier === 1 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Top City"></span>}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href="/#contact" className="text-gray-600 hover:text-teal-900 font-medium transition-colors text-sm">Contact</Link>
                    </nav>

                    {/* Call CTA */}
                    <div className="hidden xl:block ml-auto pl-6">
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="flex items-center gap-2 bg-teal-900 text-white px-5 py-2.5 rounded-full hover:bg-teal-800 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                        >
                            <Phone className="h-4 w-4" />
                            <span>{SUPPORT_PHONE}</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2 text-gray-600 hover:text-teal-900 transition-colors">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* ─── Mobile Navigation ─── */}
            <div className={clsx(
                "xl:hidden fixed top-20 left-0 right-0 bottom-0 bg-white overflow-y-auto transition-all duration-300 origin-top z-50",
                isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
            )}>
                <div className="px-4 pt-2 pb-24 space-y-1">
                    <Link href="/" className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/#tariff" className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Tariff</Link>

                    {/* Mobile Services Accordions */}
                    {SERVICE_TYPES.map(st => {
                        const isServiceExpanded = mobileExpandedService === st.id;
                        return (
                            <div key={st.id}>
                                <button
                                    onClick={() => {
                                        setMobileExpandedService(isServiceExpanded ? null : st.id);
                                        setMobileActiveState(null); // Reset state selection when switching services
                                    }}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors",
                                        isServiceExpanded ? "bg-teal-50 text-teal-900" : "text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {st.label}
                                    <ChevronDown className={clsx("h-4 w-4 transition-transform", isServiceExpanded && "rotate-180")} />
                                </button>

                                {isServiceExpanded && (
                                    <div className="ml-4 mt-1 border-l-2 border-teal-100 pl-2 space-y-1">
                                        {states.map(s => {
                                            const stateDistricts = DISTRICTS_BY_STATE.get(s.slug) || [];
                                            const isStateExpanded = mobileActiveState === s.slug;
                                            return (
                                                <div key={s.slug}>
                                                    <button
                                                        onClick={() => setMobileActiveState(isStateExpanded ? null : s.slug)}
                                                        className={clsx(
                                                            "w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all",
                                                            isStateExpanded ? "bg-gray-50 text-teal-800" : "text-gray-600 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        {s.name}
                                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            {stateDistricts.length}
                                                            <ChevronDown className={clsx("h-3 w-3 transition-transform", isStateExpanded && "rotate-180")} />
                                                        </span>
                                                    </button>

                                                    {isStateExpanded && (
                                                        <div className="grid grid-cols-2 gap-1 py-1 pl-2">
                                                            {stateDistricts.map(d => (
                                                                <Link
                                                                    key={d.slug}
                                                                    href={`/${st.id}-in-${d.slug}`}
                                                                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500 hover:text-teal-800 rounded transition-colors truncate"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    <span className="truncate">{d.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <Link href="/#contact" className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Contact</Link>

                    <a
                        href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-2 w-full bg-teal-900 text-white px-4 py-3 rounded-xl mt-4 font-bold active:scale-95 transition-transform"
                    >
                        <Phone className="h-5 w-5" />
                        Call {SUPPORT_PHONE}
                    </a>
                </div>
            </div>
        </header>
    );
}
