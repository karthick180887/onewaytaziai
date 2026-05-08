import type { Metadata } from "next";
import { CarFront, Snowflake, Shield, Music, Users } from "lucide-react";
import VehicleLanding, { type VehicleLandingProps } from "@/components/seo/VehicleLanding";
import { getAllRoutes } from "@/lib/routes";

const SEDAN_RATE = 14;

export const metadata: Metadata = {
    title: "Sedan Taxi Booking | Etios, Dzire, Xcent — From ₹14/km | OneWayTaxi.ai",
    description:
        "Sedan taxi booking across South India. Etios, Dzire, Xcent and similar 4-seat sedans from ₹14/km. AC, GPS, verified drivers. Best for couples, small families, business trips. 24/7.",
    alternates: { canonical: "https://onewaytaxi.ai/sedan-taxi" },
    openGraph: {
        title: "Sedan Taxi Booking | OneWayTaxi.ai",
        description: "AC sedan taxis from ₹14/km across 220+ South Indian cities.",
        url: "https://onewaytaxi.ai/sedan-taxi",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sedan Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Sedan Taxi | OneWayTaxi.ai", description: "Etios, Dzire, Xcent. From ₹14/km. 24/7.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

const allRoutes = getAllRoutes();
const popularRoutes = allRoutes.filter(r => r.from.tier === 1 && r.distanceKm <= 500).slice(0, 12).map(r => ({
    fromName: r.from.name, toName: r.to.name, slug: r.slug, distanceKm: r.distanceKm, fareEstimate: r.fareEstimate,
}));

const props: VehicleLandingProps = {
    pageSlug: "sedan-taxi",
    breadcrumbLabel: "Sedan Taxi",
    h1: "Sedan taxi booking — from ₹14/km",
    tagline: "South India's most-booked vehicle category. AC sedans like Etios, Dzire, and Xcent — comfortable for 4 adults with light luggage. Best value for routes up to 500 km.",
    intro: [
        "A sedan taxi is the workhorse of South India's outstation cab fleet — comfortable, fuel-efficient, and priced just right for couples, small families, and business travellers. Our sedan category includes models like the Toyota Etios, Maruti Dzire, Honda Amaze, and Hyundai Xcent — all 4+1 seater AC vehicles with sufficient boot space for 2-3 medium suitcases.",
        "Sedan taxis are billed at ₹14/km on outstation routes, with a 130-km minimum on one-way drops. The price covers fuel, driver bata, tolls, and GST — exactly what you see at booking. Sedans are the right choice for trips up to 500 km (~7-9 hours of driving), beyond which an SUV or Innova Crysta offers more comfort for long drives.",
        "Whether you need a Chennai-Bangalore corporate transfer, a Coimbatore-Madurai family trip, a Bangalore-Mysore weekend getaway, or a Madurai-Rameswaram pilgrimage drop, a sedan handles 4 adults with cabin baggage comfortably. For 5+ travellers or extended families, upgrade to our SUV or Innova categories.",
    ],
    pricePerKm: SEDAN_RATE,
    seatCapacity: 4,
    typicalModels: ["Toyota Etios", "Maruti Dzire", "Honda Amaze", "Hyundai Xcent"],
    bagCapacity: "2-3 medium bags",
    headerIcon: CarFront,
    keyFeatures: [
        { icon: Snowflake, title: "Cabin air-conditioning", text: "Full AC control. Comfortable on long highway stretches in any season." },
        { icon: Users, title: "4 adults + driver", text: "Comfortable for 2 adults front, 2-3 back. 4-seat config with seatbelts." },
        { icon: Shield, title: "Verified drivers", text: "Background-checked, badge-licensed, 3+ years professional experience." },
        { icon: Music, title: "Music system", text: "FM radio and Bluetooth/USB on most cars. Bring your own playlist for the highway." },
    ],
    idealFor: [
        { title: "Couples & small families", text: "Ideal for 2-4 travellers with light to medium luggage. Comfortable on routes up to 500 km." },
        { title: "Business travel", text: "Quick city-to-city transfers for meetings. GST invoice available for corporate billing." },
        { title: "Airport drops & pickups", text: "Standard sedans accommodate 2-3 suitcases easily. Flight tracking included on airport bookings." },
        { title: "Weekend getaways", text: "Pondicherry from Chennai, Mysore from Bangalore, Munnar from Kochi — perfect duration for a sedan." },
        { title: "Pilgrimage trips", text: "Tirupati, Velankanni, Madurai temple visits — sedans handle the typical 2-4 person pilgrimage group." },
        { title: "Solo long-distance", text: "More comfortable than bus/train for solo travellers, especially overnight runs with our verified night drivers." },
    ],
    specs: [
        { label: "Vehicle category", value: "Sedan (4-door)" },
        { label: "Seating", value: "4 passengers + 1 driver" },
        { label: "Boot capacity", value: "Approx. 400-450 litres (2-3 medium suitcases)" },
        { label: "AC", value: "Yes — front and rear" },
        { label: "Fuel", value: "Petrol / Diesel / CNG (varies by model)" },
        { label: "Per-km rate", value: "₹14/km" },
        { label: "Outstation minimum", value: "130 km" },
        { label: "Driver bata (round trip)", value: "₹300/day" },
        { label: "Night charge (10 PM-6 AM)", value: "₹250" },
    ],
    popularRoutes,
    faqs: [
        { q: "What sedan models do you offer?", a: "Our sedan fleet includes Toyota Etios, Maruti Dzire, Honda Amaze, and Hyundai Xcent. All are 4+1 seater AC sedans with comparable comfort and space. The exact model assigned depends on availability — you can request a specific model at booking but we cannot always guarantee it." },
        { q: "How many passengers can a sedan taxi seat?", a: "Sedans seat 4 passengers (typically 2 in front, 2-3 in back) plus the driver. Indian RTO regulations permit max 4 passengers in a sedan for safety. For 5+ passengers, we recommend our SUV or Innova categories." },
        { q: "How much luggage fits in a sedan?", a: "A typical sedan boot holds 2-3 medium suitcases (~400-450 litres). For groups with bulky luggage or trekking gear, an SUV with carrier is a better choice. Mention your bag count at booking so we can confirm fit." },
        { q: "Is a sedan comfortable for long-distance travel?", a: "Sedans are comfortable for trips up to 500 km (8-9 hours). For 600+ km journeys or hill routes (Munnar, Ooty, Coorg), the higher ground clearance and seat comfort of an SUV/Innova reduces fatigue significantly." },
        { q: "What is the per-km rate for a sedan taxi?", a: "Sedan rate is ₹14/km on outstation drops. The fare includes tolls, driver bata, and GST. Inter-state permits and night charges (10 PM-6 AM) are extras when applicable." },
        { q: "Can I get a non-CNG sedan?", a: "Yes — we have both CNG and non-CNG sedan variants. Non-CNG sedans (typically diesel/petrol) have full boot capacity since the CNG cylinder doesn't take boot space. Request 'Sedan Non-CNG' at booking for full luggage room." },
        { q: "Are sedan taxis available 24/7?", a: "Yes. Sedans are our most-bookable vehicle category and are available 24/7 across all 220+ cities we serve. Same-hour pickups are common in metro cities like Chennai, Bangalore, Hyderabad, and Kochi." },
    ],
};

export default function SedanTaxiPage() {
    return <VehicleLanding {...props} />;
}
