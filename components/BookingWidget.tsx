"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

export default function BookingWidget() {
    const [tripType, setTripType] = useState<"oneway" | "round">("oneway");
    const [submitted, setSubmitted] = useState(false);

    const pickupRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLInputElement>(null);

    const [distance, setDistance] = useState<string>("");
    const pickupPlaceRef = useRef<any>(null);
    const dropPlaceRef = useRef<any>(null);

    useEffect(() => {
        const calculateDist = (origin: any, destination: any) => {
            if (!origin || !destination || !(window as any).google) return;

            const service = new (window as any).google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin.geometry.location],
                    destinations: [destination.geometry.location],
                    travelMode: 'DRIVING',
                },
                (response: any, status: string) => {
                    if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                        const dist = response.rows[0].elements[0].distance.text;
                        setDistance(dist);
                    }
                }
            );
        };

        const initAutocomplete = () => {
            if (typeof window !== 'undefined' && (window as any).google && pickupRef.current && dropRef.current) {
                const options = {
                    componentRestrictions: { country: "in" },
                    fields: ["address_components", "geometry", "icon", "name"],
                    types: ["(regions)"],
                };

                const pickupAutocomplete = new (window as any).google.maps.places.Autocomplete(pickupRef.current, options);
                const dropAutocomplete = new (window as any).google.maps.places.Autocomplete(dropRef.current, options);

                pickupAutocomplete.addListener("place_changed", () => {
                    const place = pickupAutocomplete.getPlace();
                    pickupPlaceRef.current = place;
                    if (dropPlaceRef.current) calculateDist(place, dropPlaceRef.current);
                });

                dropAutocomplete.addListener("place_changed", () => {
                    const place = dropAutocomplete.getPlace();
                    dropPlaceRef.current = place;
                    if (pickupPlaceRef.current) calculateDist(pickupPlaceRef.current, place);
                });
            }
        };

        const checkGoogleMaps = setInterval(() => {
            if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
                initAutocomplete();
                clearInterval(checkGoogleMaps);
            }
        }, 100);

        return () => clearInterval(checkGoogleMaps);
    }, []);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            pickup: pickupRef.current?.value,
            drop: dropRef.current?.value,
            distance, // Sending distance
            // Get date/time/phone from form elements directly since we didn't add refs for them yet
            date: (e.target as any).date.value,
            time: (e.target as any).time.value,
            phone: (e.target as any).phone.value,
            tripType
        };

        try {
            const res = await fetch('/api/booking-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
                (e.target as HTMLFormElement).reset();
                pickupPlaceRef.current = null;
                dropPlaceRef.current = null;
                setDistance("");
            } else {
                alert('Something went wrong. Please try again or call us directly.');
            }
        } catch (error) {
            console.error(error);
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-6 md:p-8"
        >
            <div className="flex bg-gray-100/50 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setTripType("oneway")}
                    className={clsx(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        tripType === "oneway" ? "bg-teal-900 text-white shadow-md" : "text-gray-600 hover:text-teal-900"
                    )}
                >
                    One Way Drop
                </button>
                <button
                    onClick={() => setTripType("round")}
                    className={clsx(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        tripType === "round" ? "bg-teal-900 text-white shadow-md" : "text-gray-600 hover:text-teal-900"
                    )}
                >
                    Round Trip
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-teal-700 group-focus-within:text-teal-500 transition-colors" />
                        <input
                            ref={pickupRef}
                            name="pickup"
                            type="text"
                            placeholder="Pickup City (e.g., Chennai)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-teal-700 group-focus-within:text-teal-500 transition-colors" />
                        <input
                            ref={dropRef}
                            name="drop"
                            type="text"
                            placeholder="Drop City (e.g., Bangalore)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-teal-700" />
                            <input
                                name="date"
                                type="date"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 font-medium"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Clock className="absolute left-3 top-3.5 h-5 w-5 text-teal-700" />
                            <input
                                name="time"
                                type="time"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-teal-700" />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Enter Mobile Number"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 font-medium"
                            pattern="[0-9]{10}"
                            title="10 digit mobile number"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || submitted}
                    className="w-full bg-gradient-to-r from-teal-800 to-teal-600 hover:from-teal-900 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitted ? (
                        <>
                            <CheckCircle2 className="h-5 w-5 animate-bounce" />
                            Request Sent!
                        </>
                    ) : loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Get Fare Estimate
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                    By booking, you agree to our Terms & Conditions.
                </p>
            </form>
        </motion.div>
    );
}
