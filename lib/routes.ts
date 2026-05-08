// lib/routes.ts — Generate city-to-city route data for programmatic SEO pages

import { ALL_DISTRICTS, DISTRICT_BY_SLUG, District } from './districts';
import { VEHICLE_TYPES as VEHICLES, SUPPORT_PHONE } from './constants';
import { SEO_ALIASES } from './seo-aliases';

export interface RouteData {
    from: District;
    to: District;
    distanceKm: number;
    fareEstimate: number;
    slug: string; // e.g. "chennai-to-bangalore-taxi"
}

// Generate all route combinations from popularRoutes data
export function getAllRoutes(): RouteData[] {
    const routes: RouteData[] = [];
    const seen = new Set<string>();

    for (const district of ALL_DISTRICTS) {
        for (const route of district.popularRoutes) {
            const toDistrict = DISTRICT_BY_SLUG.get(route.toSlug);
            if (!toDistrict) continue;

            const slug = `${district.slug}-to-${toDistrict.slug}-taxi`;
            if (seen.has(slug)) continue;
            seen.add(slug);

            routes.push({
                from: district,
                to: toDistrict,
                distanceKm: route.distanceKm,
                fareEstimate: route.fareEstimate,
                slug,
            });
        }
    }

    return routes;
}

// Get all route slugs for static generation
export function getAllRouteSlugs(): string[] {
    return getAllRoutes().map(r => r.slug);
}

// Resolve a city slug, applying SEO_ALIASES if no direct District match exists.
// Returns the canonical slug (or null if neither the input nor its alias resolves).
function resolveCitySlug(slug: string): string | null {
    if (DISTRICT_BY_SLUG.has(slug)) return slug;
    const aliased = SEO_ALIASES[slug];
    if (aliased && DISTRICT_BY_SLUG.has(aliased)) return aliased;
    return null;
}

// Parse a route slug. Applies alias resolution to both from and to slugs.
// The returned `slug` field is always the CANONICAL form (using District slugs),
// not the input — so callers can detect alias use by comparing to the input.
export function parseRouteSlug(slug: string): RouteData | null {
    const match = slug.match(/^(.+?)-to-(.+?)-taxi$/);
    if (!match) return null;

    const [, rawFrom, rawTo] = match;
    const fromSlug = resolveCitySlug(rawFrom);
    const toSlug = resolveCitySlug(rawTo);
    if (!fromSlug || !toSlug) return null;

    const fromDistrict = DISTRICT_BY_SLUG.get(fromSlug);
    const toDistrict = DISTRICT_BY_SLUG.get(toSlug);
    if (!fromDistrict || !toDistrict) return null;

    // Find the fare from popularRoutes
    const routeEntry = fromDistrict.popularRoutes.find(r => r.toSlug === toSlug);
    if (!routeEntry) return null;

    const canonicalSlug = `${fromSlug}-to-${toSlug}-taxi`;

    return {
        from: fromDistrict,
        to: toDistrict,
        distanceKm: routeEntry.distanceKm,
        fareEstimate: routeEntry.fareEstimate,
        slug: canonicalSlug,
    };
}

// Known highway routes for major corridors
const HIGHWAY_DATA: Record<string, { highway: string; via: string[]; tips: string[] }> = {
    'chennai-bangalore': { highway: 'NH48 (Old NH4)', via: ['Sriperumbudur', 'Vellore', 'Krishnagiri', 'Hosur'], tips: ['Best to start early morning (5-6 AM) to avoid Bangalore traffic', 'Vellore bypass saves ~30 min', 'Multiple food stops available near Krishnagiri'] },
    'bangalore-chennai': { highway: 'NH48 (Old NH4)', via: ['Hosur', 'Krishnagiri', 'Vellore', 'Sriperumbudur'], tips: ['Hosur toll plaza can be congested during peak hours', 'Ambur biryani is a popular food stop', 'Electronics City traffic — leave before 6 AM or after 10 AM'] },
    'chennai-madurai': { highway: 'NH45 / NH38', via: ['Chengalpattu', 'Villupuram', 'Trichy', 'Dindigul'], tips: ['Route via Trichy is the most popular', 'Night travel is smooth with less traffic', 'Dindigul has famous biryani stops'] },
    'chennai-coimbatore': { highway: 'NH544 (Salem–Coimbatore) via NH48', via: ['Vellore', 'Salem', 'Erode', 'Tiruppur'], tips: ['Salem bypass road is well-maintained', 'Erode to Coimbatore stretch has scenic views', 'Total journey takes 8-9 hours with breaks'] },
    'chennai-pondicherry': { highway: 'ECR (East Coast Road)', via: ['Mahabalipuram', 'Kalpakkam', 'Cuddalore'], tips: ['ECR route is scenic along the coastline', 'Mahabalipuram is a great midway stop', 'Avoid weekends for less traffic on ECR'] },
    'chennai-trichy': { highway: 'NH45', via: ['Chengalpattu', 'Villupuram', 'Ulundurpettai', 'Perambalur'], tips: ['6-hour drive with good road conditions', 'Multiple dhaba options along NH45', 'Trichy traffic can be heavy near Srirangam'] },
    'coimbatore-ooty': { highway: 'NH181 (Ghat Road)', via: ['Mettupalayam', 'Coonoor'], tips: ['36 hairpin bends — experienced drivers recommended', 'Start early to avoid afternoon mist', 'Coonoor is a beautiful tea garden stopover'] },
    'madurai-rameswaram': { highway: 'NH49', via: ['Ramanathapuram', 'Pamban Bridge'], tips: ['Pamban Bridge offers stunning sea views', 'Road is well-maintained throughout', 'Visit Dhanushkodi if time permits'] },
    'bangalore-mysore': { highway: 'NH275 (Mysore Expressway)', via: ['Ramanagara', 'Mandya', 'Srirangapatna'], tips: ['Expressway makes it a 2.5-hour smooth drive', 'Maddur vada is a must-try at Kamat restaurants', 'Srirangapatna fort is worth a quick detour'] },
    'hyderabad-bangalore': { highway: 'NH44', via: ['Jadcherla', 'Kurnool', 'Anantapur', 'Penukonda'], tips: ['10-hour drive — plan for overnight or early start', 'Kurnool has good food and rest stops', 'Road quality is excellent on NH44'] },
    'chennai-tirupati': { highway: 'NH48 / NH71', via: ['Tiruvallur', 'Sri City', 'Renigunta'], tips: ['2.5-hour drive on good highway', 'Early morning departure helps avoid temple rush', 'Pre-book darshan tickets separately'] },
    'kochi-munnar': { highway: 'NH85', via: ['Kothamangalam', 'Adimali', 'Neriamangalam'], tips: ['Scenic route through tea plantations', 'Neriamangalam to Munnar has beautiful waterfalls', 'Carry warm clothes — Munnar can be cold'] },
};

// Get highway data for a route (check both directions)
function getHighwayInfo(fromSlug: string, toSlug: string) {
    return HIGHWAY_DATA[`${fromSlug}-${toSlug}`] || HIGHWAY_DATA[`${toSlug}-${fromSlug}`] || null;
}

// Pickup point data for major cities
const PICKUP_POINTS: Record<string, string[]> = {
    'chennai': ['Chennai Airport (MAA)', 'Chennai Central Railway Station', 'CMBT Bus Stand', 'T. Nagar', 'Adyar', 'Velachery', 'Tambaram', 'Porur', 'Anna Nagar', 'OMR (IT Corridor)'],
    'bangalore': ['Bangalore Airport (KIA)', 'Majestic Bus Stand', 'Bangalore City Railway Station', 'Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Yeshwanthpur', 'Marathahalli'],
    'coimbatore': ['Coimbatore Airport', 'Gandhipuram Bus Stand', 'Coimbatore Junction Railway Station', 'RS Puram', 'Saibaba Colony', 'Singanallur', 'Ukkadam'],
    'madurai': ['Madurai Airport', 'Mattuthavani Bus Stand', 'Madurai Junction', 'Periyar Bus Stand', 'Tallakulam', 'Anna Nagar', 'KK Nagar'],
    'hyderabad': ['Hyderabad Airport (RGIA)', 'Secunderabad Railway Station', 'MGBS Bus Stand', 'HITEC City', 'Gachibowli', 'Ameerpet', 'Banjara Hills', 'Madhapur'],
    'kochi': ['Kochi Airport (COK)', 'Ernakulam Junction', 'Ernakulam Town', 'MG Road', 'Edappally', 'Kakkanad', 'Fort Kochi', 'Aluva'],
    'trichy': ['Trichy Airport', 'Trichy Junction', 'Central Bus Stand', 'Srirangam', 'Thillai Nagar', 'Woraiyur'],
    'tirupati': ['Tirupati Railway Station', 'Tirupati Bus Stand', 'Tirumala', 'Renigunta Junction', 'Alipiri'],
    'pondicherry': ['Pondicherry Bus Stand', 'Pondicherry Railway Station', 'White Town', 'Auroville', 'ECR Junction'],
    'mysore': ['Mysore Railway Station', 'KSRTC Bus Stand', 'Chamundi Hills', 'Vijayanagar', 'Nazarbad'],
    'salem': ['Salem Junction', 'Salem New Bus Stand', 'Omalur', 'Hasthampatti', 'Fairlands'],
    'thiruvananthapuram': ['Trivandrum Airport', 'Trivandrum Central Station', 'Thampanoor Bus Stand', 'Technopark', 'Kovalam'],
    'vijayawada': ['Vijayawada Junction', 'Pandit Nehru Bus Station', 'Benz Circle', 'Kanuru', 'Gunadala'],
};

// Generate route-specific SEO content
export function getRouteSEOContent(route: RouteData) {
    const { from, to, distanceKm, fareEstimate } = route;
    const durationHrs = Math.floor(distanceKm / 55);
    const durationMins = Math.round((distanceKm / 55 - durationHrs) * 60);
    const durationText = durationHrs > 0
        ? `${durationHrs}h ${durationMins > 0 ? `${durationMins}m` : ''}`
        : `${durationMins}m`;

    const highway = getHighwayInfo(from.slug, to.slug);
    const fromPickups = PICKUP_POINTS[from.slug] || [];
    const toPickups = PICKUP_POINTS[to.slug] || [];

    return {
        title: `${from.name} to ${to.name} Taxi ₹${fareEstimate} | One Way Cab`,
        metaDescription: `Book ${from.name} to ${to.name} one way taxi from ₹${fareEstimate}. ${distanceKm}km, ~${durationText}. AC vehicles, verified drivers, no return fare. Save 40%. Book now!`,
        h1: `${from.name} to ${to.name} One Way Taxi`,
        durationText,
        durationHrs,
        durationMins,
        highway,
        fromPickups,
        toPickups,
    };
}

// ─── Per-route hand-tuned overrides for high-priority SERP routes ─────
// Adding a key here enriches the route page with a custom 50-word lede,
// drop points, best-time guidance, sample timeline, route highlights,
// and a custom FAQ list (replacing the generic 6 FAQs).
//
// Slug format: "{fromSlug}-to-{toSlug}" (no "-taxi" suffix).
export type RouteOverride = {
    snippetLede?: string;
    intro?: string; // "About this route" paragraph
    bestTime?: string;
    sampleTimeline?: { time: string; activity: string }[];
    dropPoints?: string[]; // popular drop locations at the destination
    routeHighlights?: { title: string; detail: string }[];
    customFaqs?: { question: string; answer: string }[];
};

const ROUTE_OVERRIDES: Record<string, RouteOverride> = {
    "kochi-to-munnar": {
        snippetLede:
            "Kochi to Munnar by taxi is approximately 130 km via NH85 through Kothamangalam, Adimali and Neriamangalam. The drive takes 3.5 to 4.5 hours depending on traffic on the ghat section. One-way drop taxi fares start at ₹1,820 for a sedan, ₹2,470 for an SUV and ₹2,730 for an Innova Crysta — all-inclusive of tolls, driver bata and GST.",
        intro:
            "The Kochi to Munnar route is one of South India's most-booked outstation drives. Travellers landing at Kochi airport, on a backwaters break in Alleppey, or visiting family in Ernakulam often head straight up to Munnar's tea-clad hills. The route climbs steadily from sea level at Kochi to about 1,600 metres at Munnar, with the steepest gradients in the final 40 km between Adimali and Munnar town.",
        bestTime:
            "Start from Kochi between 7 AM and 9 AM to reach Munnar by lunchtime, beat the afternoon mist on the ghat, and have a full evening for tea-estate sightseeing. Avoid arriving after 6 PM — the last 30 km from Adimali to Munnar has limited streetlights and the ghat curves get visibility-tricky after sundown. June through September is monsoon season; the route is open but ghat road can be slippery — leave 30-45 minutes earlier than dry-season planning.",
        sampleTimeline: [
            { time: "Departure", activity: "Pickup from Kochi (airport, Ernakulam Junction, Fort Kochi or your hotel)" },
            { time: "+1.5 hrs", activity: "Reach Kothamangalam — last major town before the ghat begins. Tea/coffee stop." },
            { time: "+2.5 hrs", activity: "Pass Neriamangalam bridge, enter the dramatic Idamalayar valley road." },
            { time: "+3 hrs", activity: "Cheeyappara and Valara waterfalls visible from the road — 5-min photo halt if not in a rush." },
            { time: "+3.5 hrs", activity: "Reach Adimali — base of the final climb to Munnar. Restaurants and clean restrooms." },
            { time: "+4 to 4.5 hrs", activity: "Arrive Munnar town. Drop at hotel, Mattupetty Dam, Tata Tea Museum, or your booked address." },
        ],
        dropPoints: [
            "Munnar town centre (Old Munnar bus stand)",
            "KDHP Tea Museum (Tata Tea estate)",
            "Mattupetty Dam (10 km from town)",
            "Top Station / Echo Point",
            "Eravikulam National Park entry (Rajamala)",
            "Resorts at Chinnakanal, Suryanelli, Anachal",
        ],
        routeHighlights: [
            { title: "NH85 ghat road", detail: "Smooth 4-lane ghat with regular guardrails — a modern upgrade from the older two-lane road. Most cars cruise at 40-60 km/h on the climb." },
            { title: "Cheeyappara and Valara waterfalls", detail: "Two roadside waterfalls between Neriamangalam and Adimali. Best views during and just after monsoon (July-November). Visible from the highway with safe pull-over spots." },
            { title: "Spice plantations near Adimali", detail: "Pepper, cardamom and clove gardens line the approach to Munnar. Several shops let you sample fresh spices and oils en route." },
            { title: "Tea estate viewpoints", detail: "From 5 km before Munnar town, the tea estates open up dramatically. Most drivers pull over for a 10-minute photo stop on request." },
        ],
        customFaqs: [
            {
                question: "How much does a taxi from Kochi to Munnar cost in 2026?",
                answer: "A one-way drop taxi from Kochi to Munnar costs around ₹1,820 in a sedan (Etios/Dzire), ₹2,470 in an SUV (Ertiga/Innova), and ₹2,730 in an Innova Crysta — based on 130 km × per-km rates of ₹14, ₹19 and ₹21 respectively. The fare includes tolls, ₹400/day driver bata and GST. There is no extra return-journey charge.",
            },
            {
                question: "How long does the Kochi to Munnar drive actually take?",
                answer: "Plan for 3 hours 30 minutes to 4 hours 30 minutes door-to-door. The first 50 km from Kochi to Kothamangalam moves quickly; the next 80 km is ghat road with average speeds of 40-50 km/h. Heavy monsoon and weekend afternoon traffic can stretch the trip to 5 hours.",
            },
            {
                question: "What is the best route from Kochi to Munnar?",
                answer: "The standard and shortest route is via NH85 through Kothamangalam, Neriamangalam and Adimali — approximately 130 km. An alternate route via Thodupuzha is about 145 km but offers a less-busy ghat. Most taxi drivers default to NH85 for road quality.",
            },
            {
                question: "Is Uber or Ola available from Kochi airport to Munnar?",
                answer: "Uber Intercity covers this route on demand but with intermittent availability outside Kochi metro. For guaranteed pickup at the airport with a Munnar-experienced driver, dedicated drop-taxi operators give better consistency on this corridor — especially for monsoon-season bookings when ghat experience matters.",
            },
            {
                question: "Can I do a same-day Kochi-Munnar-Kochi round trip by taxi?",
                answer: "It is possible if you start by 6-7 AM and limit Munnar sightseeing to a half-day. A round trip covers 260 km and 8-10 hours of travel time on top of your sightseeing window. Most travellers prefer a one-way drop with an overnight halt — easier on driver fatigue and gives you proper Munnar time.",
            },
            {
                question: "Is the Kochi to Munnar road safe during monsoon (June-September)?",
                answer: "Yes, the highway is fully operational year-round. The ghat surface is well-maintained but can be slippery during heavy rain. We avoid landslide-warning days and add 30-45 minutes to estimated arrival during monsoon. Carry warm layers — Munnar can drop to 14-16°C even on monsoon afternoons.",
            },
            {
                question: "Are there good food stops between Kochi and Munnar?",
                answer: "Yes — Kothamangalam (1.5 hours from Kochi) and Adimali (3.5 hours) are the two best-equipped towns for meals and clean restrooms. Saravana Bhavan-style vegetarian restaurants and Kerala cuisine spots line the highway in both. Drivers know the standard halts.",
            },
            {
                question: "What vehicle should I book for Kochi to Munnar?",
                answer: "For 2-3 passengers with light luggage: Sedan (Etios/Dzire) at ₹1,820 is best value. For 4-7 passengers or families with elderly travellers: SUV (Ertiga/Innova) at ₹2,470 gives more legroom and ground clearance for the ghat. For premium comfort with captain seats: Innova Crysta at ₹2,730 is the smoothest ride for the climb.",
            },
            {
                question: "Will the driver wait at Munnar attractions while I sightsee?",
                answer: "Not on a one-way drop — the trip ends at your booked drop point. For sightseeing on arrival, book a round trip or a multi-day Munnar package where the same driver and vehicle stay with you. Mention the planned itinerary at booking so we can quote driver bata and per-day kilometre allowance accurately.",
            },
            {
                question: "What is the cancellation policy for a Kochi-Munnar taxi booking?",
                answer: "Cancellations more than 4 hours before pickup are free. Within 4 hours, a flat ₹200 service fee applies. After driver reaches the pickup location, a ₹500 no-show fee applies. Reschedules are free up to 2 hours before pickup. Refunds are processed within 3-5 working days to the original payment method.",
            },
        ],
    },
};

export function getRouteOverride(route: RouteData): RouteOverride | null {
    return ROUTE_OVERRIDES[`${route.from.slug}-to-${route.to.slug}`] ?? null;
}

// Generate route-specific FAQs.
// If a route has a per-route override with customFaqs defined, those replace the generic set.
export function getRouteFAQs(route: RouteData) {
    const override = getRouteOverride(route);
    if (override?.customFaqs && override.customFaqs.length > 0) {
        return override.customFaqs;
    }
    const { from, to, distanceKm, fareEstimate } = route;
    const seo = getRouteSEOContent(route);

    return [
        {
            question: `What is the taxi fare from ${from.name} to ${to.name}?`,
            answer: `The one-way taxi fare from ${from.name} to ${to.name} starts at ₹${fareEstimate} for a hatchback (₹${VEHICLES[0].price}/km × ${distanceKm} km). Sedan fare: ~₹${Math.round(distanceKm * VEHICLES[1].price)}. SUV/Innova: ~₹${Math.round(distanceKm * (VEHICLES[4]?.price || 19))}. All fares include driver bata, tolls, permits, and GST.`,
        },
        {
            question: `How far is ${from.name} from ${to.name} by taxi?`,
            answer: `The distance from ${from.name} to ${to.name} by road is approximately ${distanceKm} km. The taxi journey takes about ${seo.durationText} depending on traffic and route conditions.`,
        },
        {
            question: `Is one-way taxi available from ${from.name} to ${to.name}?`,
            answer: `Yes! OneWayTaxi.ai offers one-way taxi service from ${from.name} to ${to.name} starting at just ₹${fareEstimate}. You pay only for the one-way distance — no return charges. Book online or call us 24/7 at ${SUPPORT_PHONE}.`,
        },
        {
            question: `What types of cabs are available for ${from.name} to ${to.name}?`,
            answer: `We offer multiple vehicle types for the ${from.name} to ${to.name} route: Mini/Hatchback (4 seats, ₹${VEHICLES[0].price}/km), Sedan (4 seats, ₹${VEHICLES[1].price}/km), SUV (7 seats, ₹${VEHICLES[4]?.price || 19}/km), and Innova Crysta (7 seats, ₹${VEHICLES[VEHICLES.length - 1].price}/km). All vehicles are AC and GPS-tracked.`,
        },
        {
            question: `Can I book a ${from.name} to ${to.name} taxi for early morning or late night?`,
            answer: `Yes, our ${from.name} to ${to.name} taxi service is available 24/7, 365 days a year — including early mornings, late nights, weekends, and holidays. Book at any time through our website or call ${SUPPORT_PHONE}.`,
        },
        {
            question: `Is the ${from.name} to ${to.name} taxi fare fixed or metered?`,
            answer: `Our ${from.name} to ${to.name} taxi fare is fixed and pre-booked. The fare you see at booking is what you pay — no meter, no surge pricing, no hidden charges. All inclusive of tolls, driver bata, and GST.`,
        },
    ];
}
