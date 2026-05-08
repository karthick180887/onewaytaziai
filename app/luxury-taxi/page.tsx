import type { Metadata } from "next";
import { Sparkles, Snowflake, Shield, Users } from "lucide-react";
import VehicleLanding, { type VehicleLandingProps } from "@/components/seo/VehicleLanding";
import { getAllRoutes } from "@/lib/routes";

// Luxury vehicles are offered on request only. Pricing varies significantly
// by vehicle (BMW 5 Series, Mercedes E-Class, Audi A6, Lexus ES, etc.) and
// availability is concentrated in metro cities (Chennai, Bangalore, Hyderabad).
// The displayed rate is a starting point; final quote confirmed on call.
const LUXURY_RATE = 65; // ₹/km starting rate for entry-luxury sedan

export const metadata: Metadata = {
    title: "Luxury Taxi Rental | BMW, Mercedes, Audi Hire — From ₹65/km | OneWayTaxi.ai",
    description:
        "Luxury taxi service across Chennai, Bangalore, Hyderabad. Mercedes E-Class, BMW 5 Series, Audi A6, Lexus ES from ₹65/km. Wedding cars, corporate VIP transfers, airport limo service. On request.",
    alternates: { canonical: "https://onewaytaxi.ai/luxury-taxi" },
    openGraph: {
        title: "Luxury Taxi Rental | OneWayTaxi.ai",
        description: "Premium luxury vehicles for weddings, VIP transfers, airport limo across South India.",
        url: "https://onewaytaxi.ai/luxury-taxi",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Luxury Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Luxury Taxi Rental | OneWayTaxi.ai", description: "Mercedes, BMW, Audi rentals from ₹65/km. On request.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

const popularRoutes = getAllRoutes()
    .filter(r => r.from.tier === 1 && (r.to.slug === "bangalore-airport" || r.to.tier === 1) && r.distanceKm <= 400)
    .slice(0, 8)
    .map(r => ({ fromName: r.from.name, toName: r.to.name, slug: r.slug, distanceKm: r.distanceKm, fareEstimate: r.fareEstimate }));

const props: VehicleLandingProps = {
    pageSlug: "luxury-taxi",
    breadcrumbLabel: "Luxury Taxi",
    h1: "Luxury taxi rental — premium chauffeur service",
    tagline: "Mercedes E-Class, BMW 5 Series, Audi A6, Lexus ES on request. Premium chauffeur service for weddings, VIP airport transfers, corporate hospitality, and special occasions across Chennai, Bangalore, and Hyderabad. From ₹65/km.",
    intro: [
        "When the journey itself is part of the impression — for a wedding entrance, a CXO airport pickup, an investor visit, or simply a celebration that deserves a beautiful car — our luxury taxi service delivers premium European and Japanese sedans with experienced chauffeurs in formal attire. We focus on entry-luxury (Mercedes E-Class, BMW 5 Series, Audi A6, Lexus ES) and mid-luxury (Mercedes S-Class, BMW 7 Series) for the most-requested use cases.",
        "Luxury taxi service is offered on request only because availability is concentrated in metro cities (Chennai, Bangalore, Hyderabad), and specific vehicles are reserved for specific dates. Pricing starts at ₹65/km for an entry-luxury sedan with chauffeur, with final quote confirmed once we check vehicle and driver availability for your dates. Multi-hour packages, daily rates, and wedding-day packages are also available.",
        "All luxury bookings include a chauffeur in white uniform, complimentary water bottles, vehicle decoration on request (for weddings), and zero-fuss airport meet-and-greet with name placard. For multi-day VIP visits, we offer dedicated chauffeur-vehicle pairing so the same driver and car serve you throughout the visit.",
    ],
    pricePerKm: LUXURY_RATE,
    seatCapacity: 4,
    typicalModels: ["Mercedes E-Class", "BMW 5 Series", "Audi A6", "Lexus ES (entry-luxury)", "Mercedes S-Class / BMW 7 Series (premium)"],
    bagCapacity: "2-3 medium bags (sedan boot)",
    headerIcon: Sparkles,
    keyFeatures: [
        { icon: Sparkles, title: "Premium European cars", text: "Mercedes, BMW, Audi maintained to dealer-spec. Spotless interior, polished exterior on every booking." },
        { icon: Users, title: "Uniformed chauffeur", text: "Experienced chauffeurs in formal white uniform. Trained in protocol for VIP and corporate guests." },
        { icon: Snowflake, title: "Climate control + comfort", text: "Quad-zone climate, leather upholstery, ambient lighting. Significantly quieter than regular taxis." },
        { icon: Shield, title: "Discretion & punctuality", text: "Professional chauffeurs trained for confidential business conversations and exact-time pickups." },
    ],
    idealFor: [
        { title: "Wedding cars", text: "Bride/groom entrance car, VIP family transfers, baraat reception. Decoration arranged on request." },
        { title: "VIP airport transfers", text: "CXO arrivals, board-level visits, foreign delegation pickups. Name placard and meet-and-greet included." },
        { title: "Corporate hospitality", text: "Investor visits, board meeting transfers, client entertainment. GST invoicing supported." },
        { title: "Anniversary & special occasions", text: "Surprise pickups for milestone anniversaries, proposals, romantic dinners. Vehicle setup options available." },
        { title: "Multi-day VIP visits", text: "Dedicated chauffeur and car for 2-7 day visits. Familiar with venues, restaurants, and city protocol." },
        { title: "Photoshoot & film", text: "Luxury cars for product/wedding photoshoots and film productions. Daily and half-day rates available." },
    ],
    specs: [
        { label: "Vehicle category", value: "Luxury sedan (4-seat)" },
        { label: "Typical models", value: "Mercedes E-Class, BMW 5 Series, Audi A6, Lexus ES" },
        { label: "Premium tier", value: "Mercedes S-Class, BMW 7 Series (on request)" },
        { label: "Seating", value: "3-4 passengers + chauffeur" },
        { label: "Chauffeur", value: "Uniformed, English-speaking" },
        { label: "Per-km rate", value: "From ₹65/km (entry-luxury)" },
        { label: "Premium tier rate", value: "Higher — quoted on request" },
        { label: "Outstation minimum", value: "200 km" },
        { label: "Multi-hour package", value: "Available — call for rates" },
        { label: "Cities", value: "Chennai, Bangalore, Hyderabad (other cities on request)" },
        { label: "Booking", value: "On request — call +91 81244 76010" },
    ],
    popularRoutes,
    faqs: [
        { q: "What luxury cars are available?", a: "Entry-luxury: Mercedes E-Class, BMW 5 Series, Audi A6, Lexus ES, Volvo S90 — typically ₹65-₹85/km. Premium: Mercedes S-Class, BMW 7 Series, Audi A8 — ₹120+/km. Specific availability depends on city and dates. Call us with requirements for an exact quote." },
        { q: "Which cities offer luxury taxi service?", a: "Direct availability in Chennai (MAA), Bangalore (BLR), and Hyderabad (HYD). For other cities (Kochi, Coimbatore, Trivandrum), we can arrange luxury bookings with 3-5 days notice — vehicles are typically driven from Chennai/Bangalore. Call us to confirm." },
        { q: "Is the chauffeur included in the rate?", a: "Yes — every luxury booking includes a uniformed chauffeur. Self-drive luxury rentals are not part of our service. The chauffeur is in formal white attire, English-speaking, and trained for VIP/corporate protocol." },
        { q: "Can I book for a wedding?", a: "Yes — wedding bookings are one of our most common use cases. We can decorate the car (flowers, ribbons), provide a backup vehicle, and coordinate multi-venue transfers. Wedding-day packages start at ₹15,000-₹25,000 depending on vehicle and duration. Call for full options." },
        { q: "How early should I book?", a: "For weddings: 30-45 days ahead, especially Nov-Feb season. For VIP airport transfers: 7-10 days ahead is comfortable; 24-hour notice is the minimum for guaranteed availability. Premium tier (S-Class, 7 Series) needs longer lead time." },
        { q: "What payment methods are accepted?", a: "UPI, debit/credit card, net banking, and wire transfer for corporate bookings. For wedding and multi-day bookings, a 30-50% advance is typically required to lock the vehicle. Balance is paid at trip end. GST invoicing supported for all corporate bookings." },
        { q: "Are luxury cars available for outstation drops?", a: "Yes — we provide luxury one-way drops on premium routes like Bangalore-Chennai, Bangalore-Mysore, Chennai-Pondicherry, Chennai-Tirupati, and similar premium corridors. Minimum 200 km on outstation. For longer routes (>500 km), Innova Crysta is often a more practical premium choice." },
    ],
};

export default function LuxuryTaxiPage() {
    return <VehicleLanding {...props} />;
}
