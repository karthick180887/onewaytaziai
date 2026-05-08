import type { Metadata } from "next";
import { Bus, Snowflake, Shield, Music, Users } from "lucide-react";
import VehicleLanding, { type VehicleLandingProps } from "@/components/seo/VehicleLanding";
import { getAllRoutes } from "@/lib/routes";

const CRYSTA_RATE = 22;

export const metadata: Metadata = {
    title: "Innova Crysta Taxi | Premium 7-Seater From ₹22/km | OneWayTaxi.ai",
    description:
        "Innova Crysta booking across South India. Premium 7+1 seater. AC, captain seats, quiet cabin. From ₹22/km. Best for VIP transfers, multi-day pilgrimages, long-distance hill trips.",
    alternates: { canonical: "https://onewaytaxi.ai/innova-crysta-taxi" },
    openGraph: {
        title: "Innova Crysta Taxi | OneWayTaxi.ai",
        description: "Premium Innova Crysta from ₹22/km. South India's best long-distance vehicle.",
        url: "https://onewaytaxi.ai/innova-crysta-taxi",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Innova Crysta Taxi — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Innova Crysta Taxi | OneWayTaxi.ai", description: "Premium 7-seater from ₹22/km. Captain seats, quiet cabin.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

const popularRoutes = getAllRoutes()
    .filter(r => r.from.tier === 1 && r.distanceKm >= 250)
    .slice(0, 12)
    .map(r => ({ fromName: r.from.name, toName: r.to.name, slug: r.slug, distanceKm: r.distanceKm, fareEstimate: r.fareEstimate }));

const props: VehicleLandingProps = {
    pageSlug: "innova-crysta-taxi",
    breadcrumbLabel: "Innova Crysta",
    h1: "Innova Crysta taxi — premium 7-seater",
    tagline: "South India's gold-standard long-distance vehicle. Toyota Innova Crysta with captain seats, climate control, and the smoothest ride on highway and ghat sections alike. From ₹22/km.",
    intro: [
        "The Toyota Innova Crysta is the long-distance taxi of choice across South India for one simple reason: it's the most refined vehicle in the regular taxi fleet. Quieter cabin than older Innovas, better suspension calibration than any 7-seater MPV, and second-row captain seats that make multi-hour journeys genuinely comfortable for elderly passengers and VIPs.",
        "Crysta bookings are billed at ₹22/km outstation — about 16% more than a standard SUV — but the upgrade pays off on trips longer than 300 km, on routes through hill stations, and on multi-day pilgrimages where comfort matters more than per-km cost. The captain-seat configuration in the second row gives each middle-row passenger their own armrest and recline; the third row folds flat for additional luggage when not needed.",
        "Crysta is also our most-booked vehicle for: corporate VIP transfers (CXO airport pickups, board meeting transfers), wedding family transport (where grandparents need the smoothest possible ride), Sabarimala/Tirumala pilgrimage circuits, and long-distance Kerala backwaters tours. For these use cases, requesting an Innova Crysta specifically (not just 'SUV') is worth the small premium.",
    ],
    pricePerKm: CRYSTA_RATE,
    seatCapacity: 7,
    typicalModels: ["Toyota Innova Crysta (2.4 ZX/VX/GX)"],
    bagCapacity: "4-5 medium bags + carrier",
    headerIcon: Bus,
    keyFeatures: [
        { icon: Users, title: "Captain seats (2nd row)", text: "Each middle-row passenger gets their own seat with armrest and recline. Premium-feel ride." },
        { icon: Snowflake, title: "Climate control", text: "Auto AC with rear vents. Maintains consistent temperature even on long highway stretches." },
        { icon: Shield, title: "Smoothest ride", text: "Refined suspension. Significantly less cabin noise and bump-feel vs. older Innova or Ertiga." },
        { icon: Music, title: "Premium audio", text: "Touchscreen infotainment with Bluetooth. Charging ports for all three rows." },
    ],
    idealFor: [
        { title: "VIP airport transfers", text: "First impression for visiting clients, family members, or executives. Premium feel from the airport curb." },
        { title: "Multi-day pilgrimages", text: "Tirumala-Kalahasti, Sabarimala-Pamba, Madurai-Rameswaram-Kanyakumari — comfort for elderly devotees." },
        { title: "Wedding family transport", text: "Multi-day weddings with grandparents and elderly relatives. Captain seats are kinder to old joints." },
        { title: "Long-distance hill tours", text: "Munnar-Thekkady, Ooty-Coonoor, Coorg-Mangalore. Smoothest ride on ghat hairpin sections." },
        { title: "Corporate group travel", text: "5-6 executives on a multi-stop client tour. Wifi-friendly cabin for working in transit." },
        { title: "Long-distance solo trips", text: "Solo travellers with budget for the upgrade — sleep, work, or relax in the comfortable cabin." },
    ],
    specs: [
        { label: "Vehicle", value: "Toyota Innova Crysta (current generation)" },
        { label: "Seating", value: "7 passengers + 1 driver" },
        { label: "2nd row config", value: "Captain seats (most variants)" },
        { label: "Boot capacity", value: "Approx. 300 L (3rd row up); 800+ L (3rd row folded)" },
        { label: "Roof carrier", value: "Yes" },
        { label: "AC", value: "Climate control with three-row vents" },
        { label: "Fuel", value: "Diesel (2.4L)" },
        { label: "Per-km rate", value: "₹22/km" },
        { label: "Outstation minimum", value: "130 km" },
        { label: "Driver bata (round trip)", value: "₹500/day" },
        { label: "Night charge (10 PM-6 AM)", value: "₹500" },
    ],
    popularRoutes,
    faqs: [
        { q: "How is Innova Crysta different from a regular Innova?", a: "Innova Crysta is the newer, premium generation of the Innova — launched 2016, refreshed since. Compared to the older Innova: quieter cabin, smoother ride, captain seats option in middle row, climate control AC, and significantly better long-distance comfort. Per-km rate is ₹22 vs. ₹19 for the older Innova/SUV category." },
        { q: "Why is Innova Crysta priced higher than other SUVs?", a: "The premium reflects (a) the vehicle's higher acquisition and maintenance cost for the operator, (b) better fuel economy on highways which partially offsets the rate, (c) higher comfort and reliability that justifies the upgrade for long trips. For 250+ km trips, the comfort difference is substantial." },
        { q: "Can I request Innova Crysta specifically (not SUV)?", a: "Yes — when booking, select 'Innova Crysta' as the vehicle category (not 'SUV'). This guarantees a Crysta vehicle. If you book 'SUV' you may receive a Crysta or an Ertiga/older Innova depending on availability." },
        { q: "Is Crysta worth it for short trips under 200 km?", a: "For trips under 200 km, the comfort difference vs. a sedan is mild and the cost premium is harder to justify. Crysta really shines on 250+ km journeys, hill routes, and multi-day trips. For short city/airport runs, sedan or SUV is usually sufficient." },
        { q: "Does Crysta have captain seats in the middle row?", a: "Most Crysta variants (ZX, VX) come with captain seats in the second row — two individual seats with armrests instead of a bench. Some lower variants (GX) have a bench seat. Mention 'captain seats required' at booking if it's important." },
        { q: "Is the Crysta available for outstation round trips?", a: "Yes. For 1-3 day round trips, Crysta is the standard choice for premium family/business travel. Round-trip pricing: ₹22/km × distance + ₹500/day driver bata + night halt charges if applicable." },
        { q: "How many bags fit in an Innova Crysta?", a: "With all three rows occupied: 4-5 medium suitcases in the boot plus carrier rack. With 3rd row folded (5 passengers): much more luggage space, suitable for full family relocations." },
    ],
};

export default function InnovaCrystaTaxiPage() {
    return <VehicleLanding {...props} />;
}
