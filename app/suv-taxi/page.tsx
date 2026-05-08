import type { Metadata } from "next";
import { Bus, Snowflake, Shield, Music, Users } from "lucide-react";
import VehicleLanding, { type VehicleLandingProps } from "@/components/seo/VehicleLanding";
import { getAllRoutes } from "@/lib/routes";

const SUV_RATE = 19;

export const metadata: Metadata = {
    title: "SUV Taxi Booking | Ertiga, Innova — From ₹19/km | OneWayTaxi.ai",
    description:
        "SUV taxi booking across South India. Maruti Ertiga, Mahindra Marazzo, Toyota Innova — 7+1 seater AC SUVs from ₹19/km. Best for families of 5-7, hill stations, multi-bag luggage.",
    alternates: { canonical: "https://onewaytaxi.ai/suv-taxi" },
    openGraph: {
        title: "SUV Taxi Booking | OneWayTaxi.ai",
        description: "AC SUVs (Ertiga, Innova) from ₹19/km. 220+ cities. 24/7.",
        url: "https://onewaytaxi.ai/suv-taxi",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SUV Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "SUV Taxi | OneWayTaxi.ai", description: "Ertiga, Innova. From ₹19/km. Family of 5-7.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

const popularRoutes = getAllRoutes()
    .filter(r => r.from.tier === 1 && r.distanceKm >= 200)
    .slice(0, 12)
    .map(r => ({ fromName: r.from.name, toName: r.to.name, slug: r.slug, distanceKm: r.distanceKm, fareEstimate: r.fareEstimate }));

const props: VehicleLandingProps = {
    pageSlug: "suv-taxi",
    breadcrumbLabel: "SUV Taxi",
    h1: "SUV taxi booking — from ₹19/km",
    tagline: "7+1 seater AC SUVs for families of 5-7, multi-bag luggage, and hill-station routes. Maruti Ertiga, Mahindra Marazzo, and Toyota Innova — all with carrier and full air-conditioning.",
    intro: [
        "An SUV taxi is the right choice when a sedan isn't enough — for families of 5-7 travellers, when you have multiple suitcases, when you're heading to hill stations like Munnar, Ooty, Kodaikanal, or Coorg, or when long-distance comfort matters more than the per-km cost.",
        "Our SUV category includes the Maruti Ertiga (most popular for value), Mahindra Marazzo, and Toyota Innova (the older 'classic' Innova, not the Crysta). All vehicles have full AC, carrier rack for extra luggage, individual seat configurations, and ample legroom for 7-hour-plus journeys. They're billed at ₹19/km outstation, with the same 130-km minimum on one-way drops.",
        "SUVs handle South Indian highways and hill ghat sections far better than sedans. Their higher ground clearance shrugs off broken patches near Sabarimala, Munnar, or Yercaud, while the suspension keeps things smooth for elderly passengers and children. For pilgrimage circuits, multi-day temple trips, or weekend hill-station getaways with extended family, an SUV is the standard choice.",
    ],
    pricePerKm: SUV_RATE,
    seatCapacity: 7,
    typicalModels: ["Maruti Ertiga", "Mahindra Marazzo", "Toyota Innova"],
    bagCapacity: "5-6 medium bags + carrier",
    headerIcon: Bus,
    keyFeatures: [
        { icon: Users, title: "7 adults + driver", text: "Three rows of seating. Front 2, middle 3, rear 2-3. Comfortable for extended family." },
        { icon: Snowflake, title: "Three-row AC", text: "Cooling vents reach all three rows. Critical for South Indian summer travel." },
        { icon: Shield, title: "Higher ground clearance", text: "Better for ghat roads, monsoon-flooded patches, and rural highway stretches." },
        { icon: Music, title: "Music system + USB", text: "FM, Bluetooth, USB charging ports. Keeps the family entertained on long drives." },
    ],
    idealFor: [
        { title: "Families of 5-7", text: "Three rows mean kids and grandparents can each have their own row. No squeezing." },
        { title: "Hill station trips", text: "Munnar, Ooty, Kodaikanal, Coorg — SUV's ground clearance and torque handle ghat roads better." },
        { title: "Multi-day pilgrimages", text: "Tirumala-Kanipakam-Srikalahasti circuits, Madurai temple tours, Kerala temple trails." },
        { title: "Multi-bag luggage", text: "5-6 suitcases plus a roof carrier rack. Ideal for relocations and long stays." },
        { title: "Group business travel", text: "Take 5-6 colleagues to a client site or factory visit. GST invoicing supported." },
        { title: "Wedding and event transport", text: "Comfortable for grandparents and kids at multi-day weddings spanning multiple venues." },
    ],
    specs: [
        { label: "Vehicle category", value: "SUV / MPV (3-row)" },
        { label: "Seating", value: "7 passengers + 1 driver" },
        { label: "Boot capacity", value: "Approx. 200-300 L (3rd row up); 600+ L (3rd row folded)" },
        { label: "Roof carrier", value: "Yes — for additional bulky luggage" },
        { label: "AC", value: "Three-row vent layout" },
        { label: "Fuel", value: "Diesel / Petrol (varies by model)" },
        { label: "Per-km rate", value: "₹19/km" },
        { label: "Outstation minimum", value: "130 km" },
        { label: "Driver bata (round trip)", value: "₹400/day" },
        { label: "Night charge (10 PM-6 AM)", value: "₹350" },
    ],
    popularRoutes,
    faqs: [
        { q: "What SUV models are available?", a: "Our SUV/MPV fleet includes the Maruti Ertiga (most common, great value), Mahindra Marazzo, Toyota Innova (older classic, not Crysta), and similar 7-seater MPVs. The exact model depends on availability in your pickup city." },
        { q: "Is an SUV the same as an Innova Crysta?", a: "Not exactly. SUV (₹19/km) covers Ertiga and older Innova / Marazzo. Innova Crysta is a separate, premium category at ₹22/km — newer interior, better suspension, and quieter cabin. For long pilgrimages or VIP transfers, choose Crysta. For value family travel, SUV is the pick." },
        { q: "How many people can sit in an SUV taxi?", a: "Up to 7 passengers plus the driver — typically arranged 2 (front) + 3 (middle) + 2 (rear). Some 6-seater configurations exist; we'll confirm seating layout at booking based on assigned vehicle." },
        { q: "Does the SUV come with a carrier rack?", a: "Yes — all our outstation SUV bookings include a roof carrier rack for additional bulky luggage like bicycles, large bags, or trekking gear. Mention luggage volume at booking so we can confirm fit." },
        { q: "Is an SUV better than a sedan for hill stations?", a: "Yes, significantly. Higher ground clearance helps on rough patches; better torque handles steep climbs without strain; and the higher seating position reduces motion sickness on hairpin bends. For Ooty, Munnar, Coorg, Kodaikanal — SUV is recommended." },
        { q: "What's the difference in pricing vs. a sedan?", a: "Sedan is ₹14/km, SUV is ₹19/km — about 35% more. For 5+ travellers, an SUV often works out cheaper than booking two sedans. For 7-person trips, an SUV is the only single-vehicle option besides Innova Crysta." },
        { q: "Are SUV taxis available for airport pickup?", a: "Yes — SUVs are popular for family airport pickups since they handle 4-7 travellers with full luggage in one trip. Flight tracking and 60-minute free wait apply to SUV airport bookings." },
    ],
};

export default function SuvTaxiPage() {
    return <VehicleLanding {...props} />;
}
