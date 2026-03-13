'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllRoutes } from '@/lib/routes';
import { VEHICLE_TYPES } from '@/lib/constants';

// Build a lookup map from "from-to" to distanceKm
const ALL_ROUTES = getAllRoutes();

// Collect unique city names from route data
const CITIES = Array.from(
    new Set(ALL_ROUTES.flatMap(r => [r.from.name, r.to.name]))
).sort();

function getDistance(from: string, to: string): number | null {
    const route = ALL_ROUTES.find(
        r => r.from.name === from && r.to.name === to
    ) || ALL_ROUTES.find(
        r => r.from.name === to && r.to.name === from
    );
    return route ? route.distanceKm : null;
}

export default function FareCalculatorPage() {
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [vehicleId, setVehicleId] = useState(VEHICLE_TYPES[1].id); // Default: sedan
    const [calculated, setCalculated] = useState(false);

    const selectedVehicle = VEHICLE_TYPES.find(v => v.id === vehicleId) ?? VEHICLE_TYPES[1];
    const distance = useMemo(() => getDistance(fromCity, toCity), [fromCity, toCity]);

    const baseFare = distance ? distance * selectedVehicle.price : null;
    const tollEstimate = distance ? Math.round(distance * 0.8) : null; // rough ₹0.8/km toll average
    const gst = baseFare ? Math.round(baseFare * 0.05) : null;
    const totalFare = baseFare && gst ? baseFare + gst : null;

    const durationHrs = distance ? Math.floor(distance / 55) : 0;
    const durationMins = distance ? Math.round(((distance / 55) - durationHrs) * 60) : 0;

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setCalculated(true);
    };

    const handleSwap = () => {
        setFromCity(toCity);
        setToCity(fromCity);
        setCalculated(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                {/* Hero */}
                <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-14 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-2">
                            Free Tool
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            One Way Taxi Fare Calculator
                        </h1>
                        <p className="text-teal-100 text-lg">
                            Get an instant, all-inclusive fare estimate for any South India intercity route.
                            No hidden charges. No return fare.
                        </p>
                    </div>
                </section>

                {/* Calculator Card */}
                <section className="max-w-2xl mx-auto px-4 -mt-6 pb-12">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Form */}
                        <form onSubmit={handleCalculate} className="p-6 md:p-8">
                            <div className="space-y-5">
                                {/* From ↕ To */}
                                <div className="relative flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="from-city" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            From City
                                        </label>
                                        <select
                                            id="from-city"
                                            value={fromCity}
                                            onChange={e => { setFromCity(e.target.value); setCalculated(false); }}
                                            required
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">Select pickup city</option>
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Swap button */}
                                    <button
                                        type="button"
                                        onClick={handleSwap}
                                        disabled={!fromCity && !toCity}
                                        aria-label="Swap cities"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
                                    >
                                        ⇅
                                    </button>

                                    <div>
                                        <label htmlFor="to-city" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            To City
                                        </label>
                                        <select
                                            id="to-city"
                                            value={toCity}
                                            onChange={e => { setToCity(e.target.value); setCalculated(false); }}
                                            required
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">Select destination city</option>
                                            {CITIES.filter(c => c !== fromCity).map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Vehicle Type */}
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Vehicle Type</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {VEHICLE_TYPES.slice(0, 4).map(v => (
                                            <label
                                                key={v.id}
                                                className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${vehicleId === v.id
                                                    ? 'border-teal-600 bg-teal-50 text-teal-900'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="vehicle"
                                                    value={v.id}
                                                    checked={vehicleId === v.id}
                                                    onChange={() => { setVehicleId(v.id); setCalculated(false); }}
                                                    className="sr-only"
                                                />
                                                <span className="block text-sm font-semibold truncate">{v.name.split(' ')[0]}</span>
                                                <span className="block text-xs text-gray-500 mt-0.5">₹{v.price}/km</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Calculate Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-xl text-lg transition-colors shadow-sm"
                                >
                                    Calculate Fare →
                                </button>
                            </div>
                        </form>

                        {/* Result Panel */}
                        {calculated && (
                            <div className="border-t border-gray-100 bg-gray-50 px-6 md:px-8 py-6">
                                {fromCity === toCity && (
                                    <p className="text-red-600 font-medium text-center">
                                        Pickup and destination cannot be the same city.
                                    </p>
                                )}

                                {fromCity !== toCity && !distance && (
                                    <div className="text-center">
                                        <p className="text-amber-700 font-medium mb-1">
                                            Route data not available for this city pair.
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Call us on <a href="tel:+918124476010" className="font-semibold text-teal-700">+91 81244 76010</a> for an instant quote.
                                        </p>
                                    </div>
                                )}

                                {distance && totalFare && baseFare && gst && tollEstimate && fromCity !== toCity && (
                                    <>
                                        <p className="text-sm text-gray-500 font-medium mb-4">
                                            {fromCity} → {toCity} | {distance} km | ~{durationHrs > 0 ? `${durationHrs}h ` : ''}{durationMins > 0 ? `${durationMins}m` : ''}
                                        </p>

                                        {/* Fare Breakdown */}
                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                                            <div className="px-4 py-3 bg-teal-700 text-white">
                                                <p className="text-sm font-semibold">
                                                    {selectedVehicle.name} — All-Inclusive Fare Estimate
                                                </p>
                                            </div>
                                            <table className="w-full text-sm">
                                                <tbody>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="px-4 py-3 text-gray-600">Base fare ({distance} km × ₹{selectedVehicle.price})</td>
                                                        <td className="px-4 py-3 text-right font-medium text-gray-900">₹{baseFare.toLocaleString('en-IN')}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="px-4 py-3 text-gray-600">Driver Bata (included)</td>
                                                        <td className="px-4 py-3 text-right font-medium text-green-700">✓ Included</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="px-4 py-3 text-gray-600">Toll Charges (est.)</td>
                                                        <td className="px-4 py-3 text-right font-medium text-green-700">✓ Included</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="px-4 py-3 text-gray-600">GST (5%)</td>
                                                        <td className="px-4 py-3 text-right font-medium text-gray-900">₹{gst.toLocaleString('en-IN')}</td>
                                                    </tr>
                                                    <tr className="bg-teal-50">
                                                        <td className="px-4 py-3 font-bold text-teal-900">Total One-Way Fare</td>
                                                        <td className="px-4 py-3 text-right font-bold text-2xl text-teal-700">₹{totalFare.toLocaleString('en-IN')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <p className="text-xs text-gray-400 mb-5">
                                            * Estimate based on ₹{selectedVehicle.price}/km rate. Final fare confirmed at booking. No return charge — this is a one-way fare.
                                        </p>

                                        {/* Compare All Vehicles */}
                                        <div className="mb-5">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">Compare All Vehicle Types</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {VEHICLE_TYPES.map(v => (
                                                    <div
                                                        key={v.id}
                                                        className="border border-gray-200 rounded-lg p-3 bg-white flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{v.name}</p>
                                                            <p className="text-xs text-gray-500">{v.seat} seats</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-teal-700">
                                                            ₹{Math.round(distance * v.price * 1.05).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <Link
                                            href="/"
                                            className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-center py-3.5 rounded-xl text-base transition-colors"
                                        >
                                            Book This Trip Now — ₹{totalFare.toLocaleString('en-IN')}
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Why Use This Fare Calculator */}
                <section className="max-w-3xl mx-auto px-4 pb-14">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                        How Is This Fare Calculated?
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        Our fare calculator uses real route distances and our flat per-km rates.
                        Unlike round-trip taxis, you pay <strong>only for the one-way distance</strong>.
                    </p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { icon: '📏', title: 'Real Route Distance', desc: 'We use actual road distances (not aerial), so the estimate reflects what your driver will actually travel.' },
                            { icon: '💰', title: 'All-Inclusive Rate', desc: 'The fare includes driver bata, toll charges, state permit fees, and 5% GST. What you see is what you pay.' },
                            { icon: '🔁', title: 'One-Way Only', desc: 'No return fare, ever. You pay only for the km from your pickup city to your destination.' },
                        ].map(item => (
                            <div key={item.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-white border-t border-gray-100 py-12 px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Is the fare estimate final?',
                                    a: 'The calculator gives you a highly accurate estimate. The confirmed fare is shown at booking — it\'s the same calculation with your exact pickup and drop addresses used for any minor distance adjustments.'
                                },
                                {
                                    q: 'What does the fare include?',
                                    a: 'All fares include driver bata (allowance), highway toll charges, inter-state permit fees, and 5% GST. There are no parking fees, night surcharges, or return charges added later.'
                                },
                                {
                                    q: 'What if my route is not in the calculator?',
                                    a: 'Call us on +91 81244 76010 and we\'ll give you an instant quote for any route across South India including less-common routes not in the calculator.'
                                },
                                {
                                    q: 'Is this price guaranteed once I book?',
                                    a: 'Yes. Once you confirm your booking, the fare shown is the fare you pay — no surge pricing, no dynamic pricing, and no hidden add-ons.'
                                },
                            ].map(item => (
                                <details key={item.q} className="bg-gray-50 rounded-lg border border-gray-200 p-5 group">
                                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                                        {item.q}
                                        <span className="ml-2 text-teal-600 group-open:rotate-180 transition-transform">▾</span>
                                    </summary>
                                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
