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
    foodStops?: { title: string; detail: string }[]; // notable food/rest halts en route
    vehicleGuidance?: string; // route-specific vehicle recommendation (markdown-light HTML)
    monsoonAdvisory?: string; // weather/seasonal warnings + alt-route guidance
    multiDayPackage?: string; // multi-day itinerary suggestion when destination warrants 2-3 days
    destinationGuide?: { title: string; detail: string }[]; // what to do once you arrive
    customFaqs?: { question: string; answer: string }[];
};

const ROUTE_OVERRIDES: Record<string, RouteOverride> = {
    "bangalore-to-coorg": {
        snippetLede:
            "Bangalore to Coorg (Madikeri) by taxi is approximately 260 km via Mysore and Hunsur, taking 5.5 to 6.5 hours depending on Bangalore exit traffic and the final ghat climb to Madikeri. One-way drop taxi fares start at ₹3,640 for a sedan, ₹4,940 for an SUV and ₹5,460 for an Innova Crysta — all-inclusive of tolls, driver bata and GST. Coorg, officially Kodagu, sits 1,170 metres above sea level in the Western Ghats and is popular for coffee plantations, the Cauvery's source at Talakaveri, and as an extended weekend destination from Bangalore.",
        intro:
            "Coorg (Kodagu) is Karnataka's coffee country — the misty hill district that produces about 70% of India's specialty Arabica and Robusta. The drive from Bangalore is one of South India's most-booked weekend escape routes, especially November through March when the weather is dry and clear. The standard route takes the Bengaluru-Mysuru Expressway to Mysore, then NH275 west through Hunsur, Periyapatna, and Kushalnagar before climbing the final 30 km to Madikeri. A second popular drop point is the <strong>Dubare Elephant Camp</strong> at Kushalnagar, which lies before the ghat climb — useful for travellers staying at Cauvery-bank resorts who don't need to reach Madikeri itself. The journey is mostly highway with one ghat section, making it accessible in any vehicle category.",
        bestTime:
            "Best season: November to March (cool, clear, post-monsoon greenery). October sees the tail of monsoon — beautiful but landslide-risk on the Madikeri ghat. June-August is peak monsoon: the route is operational but ghat sections see fog and slipperiness. <strong>Departure timing:</strong> leave Bangalore between 5:30 AM and 7 AM to clear the city, breakfast at Mysore by 9:30 AM, and reach Coorg by 12:30 PM with time to settle into your resort. Avoid Friday 4-9 PM departures (Bangalore exit traffic) and Sunday 3-9 PM returns (Coorg-side traffic). Long weekends and Karnataka school vacations (April, October) require advance booking and ghat-climb traffic tolerance.",
        sampleTimeline: [
            { time: "5:30 AM", activity: "Pickup from Bangalore (Whitefield, Koramangala, Electronic City, Indiranagar, KIA airport, or your address)." },
            { time: "8:30 AM (+3 hrs)", activity: "Bypass Mysore via the ring road (skip the city if not stopping). Quick chai at the Mysore Ring Road service halt." },
            { time: "10:00 AM (+4.5 hrs)", activity: "Reach Hunsur — last major town before the run-up to the ghats. Optional bathroom + breakfast halt." },
            { time: "11:00 AM (+5.5 hrs)", activity: "Pass Kushalnagar — entry to Coorg district. Dubare Elephant Camp is a possible drop-off if your resort is on this side." },
            { time: "11:30 AM (+6 hrs)", activity: "Begin the Madikeri ghat — 30 km of winding climb through coffee estates and shola forest. Cooler air, mist begins." },
            { time: "12:30 PM (+6.5 hrs)", activity: "Arrive Madikeri town. Drop at Raja's Seat, Madikeri Fort, your resort, or the homestay address." },
        ],
        dropPoints: [
            "Madikeri town (Coorg's district headquarters)",
            "Dubare Elephant Camp (Kushalnagar — pre-ghat side)",
            "Tibetan Golden Temple (Bylakuppe) and Namdroling Monastery",
            "Talakaveri (origin of the Cauvery river, 48 km past Madikeri)",
            "Madikeri Fort and Raja's Seat sunset point",
            "Coffee estate resorts: Coorg Wilderness Resort, Tamara, Evolve Back, Old Kent Estates",
            "Kakkabe (Western Ghats trekking base, 35 km from Madikeri)",
            "Nagarhole / Bandipur transit (for safari-bound bookings)",
        ],
        routeHighlights: [
            { title: "Bengaluru-Mysuru Expressway", detail: "First 150 km of the route on the new 10-lane expressway opened March 2023. Smooth 110 km/h cruise, FASTag-only tolls. The single biggest reason the Bangalore-Coorg drive is now under 6.5 hours instead of the older 7-8 hours." },
            { title: "Mysore ring road bypass", detail: "Drivers heading to Coorg use the Mysore outer ring road to skip the city centre — saves 30-45 minutes versus driving through. Re-enters NH275 west of Mysore." },
            { title: "Hunsur silk and tobacco belt", detail: "65 km from Mysore — known for sericulture, tobacco curing barns, and the Hunsur tank. A practical bathroom + chai halt territory; few photo-worthy stops." },
            { title: "Kushalnagar and Tibetan Golden Temple", detail: "Entry to Coorg district. The Bylakuppe Tibetan settlement is 4 km off the main road; the Namdroling Monastery (Golden Temple) is one of the largest teaching centres of Tibetan Buddhism outside Tibet. Free entry; visit hours 9 AM-5:30 PM. Optional 60-minute detour for cultural travellers." },
            { title: "Dubare Elephant Camp (Cauvery river)", detail: "On the Cauvery just before the Madikeri ghat begins. Elephant interaction sessions (8 AM-12 PM, ₹600+); coracle rides on the river; a popular family-friendly half-day stop. Many travellers split the Bangalore-Coorg trip to start with Dubare and end at Madikeri." },
            { title: "Madikeri ghat (final 30 km climb)", detail: "Two-lane road with steady curves, climbing from ~750m to 1,170m. Coffee estates and shola forest line the road; Abbey Falls is a 3 km off-route detour halfway up. Mist and afternoon rain in monsoon; stunning sunsets in winter." },
            { title: "Raja's Seat at Madikeri", detail: "The first signature view in Coorg — a colonial-era pavilion with a panoramic mountain vista, especially at sunset. Most drivers will halt for 15-20 minutes here as part of the drop." },
        ],
        foodStops: [
            { title: "Ramanagara expressway service area (60 km)", detail: "Modern food court, McDonald's, A2B, Subway, clean restrooms, fuel. Best 20-minute halt for breakfast on the Bangalore-Mysore stretch." },
            { title: "Maddur Tiffanys / Kamat (90 km)", detail: "Maddur vada and rava idli — vegetarian heritage stop unique to this stretch. 15-minute halt." },
            { title: "Hunsur (215 km)", detail: "Last decent meals halt before the ghat begins. Vegetarian and Coorgi non-veg options available; Coorgi pandi curry (pork) is the regional speciality." },
            { title: "Kushalnagar (245 km)", detail: "Fresh coffee, chocolate, and homestay-style Coorgi snacks at roadside outlets. Choose this over Hunsur if you have time — the Coorgi flavours start showing up here." },
        ],
        vehicleGuidance:
            "The 260 km Bangalore-Coorg route is mostly expressway and highway with a 30 km hill climb at the end. Vehicle choice depends on group size and whether elderly travellers are along. <strong>Sedans (Etios/Dzire)</strong> at ₹3,640 work fine for 2-3 passengers — the ghat climb is moderate, no aggressive hairpins. <strong>SUVs (Ertiga/Innova)</strong> at ₹4,940 are preferred for 4-7 passenger family groups; better seating height for grandparents and more luggage room for 2-night stays. <strong>Innova Crysta</strong> at ₹5,460 is the smoothest pick for 6+ hour comfort and has captain seats (variant-dependent) for the return leg. <strong>Tempo Travellers</strong> handle the route well; ghat-experienced drivers should be specifically requested. Diesel preferred for the climb — better torque and fuel economy on the ghat section.",
        monsoonAdvisory:
            "Coorg's two monsoons — the Southwest (June-August, heavy) and the retreating Northeast (October-November, lighter) — keep the route operational year-round but with seasonal caution. <strong>June-August:</strong> heavy rain on the Madikeri ghat creates landslide risk; KSDMA monitors the road; closures are typically 2-12 hours when they happen. <strong>October-November:</strong> retreating monsoon with intermittent showers; slipperier than dry season but generally safe. <strong>December-March:</strong> dry, clear, mountain views at their best — peak tourism. <strong>Pack list year-round:</strong> warm layer (Madikeri is 8-10°C cooler than Bangalore in winter), umbrella, microfibre towel, mosquito repellent (coffee plantations have insects), and waterproof shoes for monsoon trekkers.",
        multiDayPackage:
            "For 3-4 day Coorg trips, our <strong>multi-day package</strong> uses the same vehicle and driver throughout. Includes daily 250 km kilometre allowance, driver bata (₹500/day), one night halt charge per night (₹350-500), tolls, GST. <strong>Day 1:</strong> Bangalore → Coorg arrival → Raja's Seat sunset, Madikeri Fort. <strong>Day 2:</strong> Talakaveri, Bhagamandala, Abbey Falls. <strong>Day 3:</strong> Dubare Elephant Camp, Tibetan Golden Temple, coffee estate visit. <strong>Day 4:</strong> Mandalpatti viewpoint, return to Bangalore. Sedan package starts at ₹14,500 for 4 days, SUV at ₹19,800, Crysta at ₹21,800. Add Wayanad or Mysore as an extension for an extra day.",
        destinationGuide: [
            { title: "Raja's Seat", detail: "Madikeri's signature sunset viewpoint — colonial-era pavilion with panoramic Western Ghats vista. Open dawn to dusk; small entry fee. Best at 5:30-6:30 PM in winter for layered cloud sunsets. Allow 30-45 minutes." },
            { title: "Abbey Falls", detail: "10 km from Madikeri; 70-foot waterfall in a coffee-plantation setting. Strongest flow July-October; trickle in March-May. Wooden suspension bridge at the viewpoint. ₹15 entry. Allow 45 minutes." },
            { title: "Talakaveri (origin of the Cauvery)", detail: "48 km from Madikeri at 1,276m. The kundike (sacred tank) is considered the source of the Cauvery river. Brahmagiri peak 350-step climb gives panoramic views. Half-day excursion." },
            { title: "Dubare Elephant Camp", detail: "Karnataka Forest Department camp on the Cauvery near Kushalnagar. Morning elephant-interaction sessions (8 AM-12 PM): bathing, feeding, riding (₹500-1,200 depending on activity). Coracle rides on the river. Allow 3-4 hours." },
            { title: "Namdroling Monastery (Bylakuppe Golden Temple)", detail: "Tibetan Buddhist monastery in Bylakuppe, 6 km from Kushalnagar. The main prayer hall has 40-foot golden Buddha statues. Free entry; visit hours 9 AM-5:30 PM. Allow 60-90 minutes." },
            { title: "Coffee plantation estate tour", detail: "Most resorts offer guided estate walks covering plant lifecycle, processing methods, and tastings. Tata Coffee, Old Kent Estate, and Evolve Back are popular for tours. Booking ahead recommended; ₹500-1,500 per person." },
            { title: "Mandalpatti viewpoint", detail: "30 km from Madikeri via 4WD jeep (taxi cars cannot do the final 8 km). Highest viewpoint in the area; spectacular at sunrise. Local jeep operators charge ₹1,500-2,000 per group. Half-day from Madikeri." },
            { title: "Madikeri Fort and Omkareshwara Temple", detail: "Madikeri's central historic complex — the Lingayat-era fort built by Mudduraja in 1681, the Omkareshwara Shiva temple, and the small museum inside the fort. Free entry; allow 60 minutes." },
        ],
        customFaqs: [
            { question: "How long does the Bangalore to Coorg taxi take?", answer: "Approximately 5.5 to 6.5 hours one-way. The Bengaluru-Mysuru Expressway (first 150 km) is fast; Mysore-Hunsur-Kushalnagar (next 80 km) is highway; the final 30 km Madikeri ghat takes about 45-60 minutes. From Bangalore central to Madikeri town centre, plan for 6 hours door-to-door on a weekday departure." },
            { question: "How much is a Bangalore to Coorg taxi?", answer: "One-way drop fares: ₹3,640 sedan, ₹4,940 SUV, ₹5,460 Innova Crysta — based on 260 km × per-km rates of ₹14, ₹19, ₹21. The fare includes tolls, driver bata (₹500/day for inter-day return logistics), and GST. There is no inter-state permit fee — Coorg is in Karnataka, same as Bangalore." },
            { question: "What's the best vehicle for Bangalore to Coorg?", answer: "For 2-3 passengers: sedan at ₹3,640 is best value. For 4-7 family travellers: SUV at ₹4,940 — better legroom on the 6-hour drive. For 6+ passengers including elderly or 2-3 day stays with full luggage: Innova Crysta at ₹5,460 — the smoothest ride for the ghat climb and captain-seat second row variant." },
            { question: "Can I do a same-day Bangalore-Coorg-Bangalore trip?", answer: "Possible but tight. A typical same-day plan: 5 AM departure, 11:30 AM Coorg arrival, 6 hours sightseeing (Madikeri + Abbey Falls + Raja's Seat), 6 PM departure, 12:30 AM return. Most travellers prefer at least one overnight halt — the 6.5-hour drive each way leaves limited Coorg time on a same-day trip." },
            { question: "Is the Madikeri ghat road safe in monsoon?", answer: "Generally yes — the ghat is well-paved and drained. Heavy monsoon (June-August) creates occasional landslide closures (typically 2-12 hours when they happen); KSDMA monitors and clears. We avoid trips on landslide-warning days. Pack a warm layer and umbrella — Coorg temperatures drop quickly during rain." },
            { question: "Do I need a permit to enter Coorg from Karnataka?", answer: "No. Coorg (Kodagu) is a district within Karnataka, so no permit is required. Inter-state permits only apply when crossing state borders (e.g. Bangalore to Coorg via Wayanad would require Kerala permits)." },
            { question: "What's the best season to visit Coorg?", answer: "November to March is the peak season — dry, clear, cool (15-22°C), and with the post-monsoon greenery still intact. October has the freshest landscapes after monsoon ends. Avoid mid-June to August unless you specifically want lush monsoon scenery (and accept landslide risk and limited outdoor activities)." },
            { question: "Is the Bangalore Airport (KIA) to Coorg distance the same?", answer: "Slightly longer — about 290 km via the airport's NICE Road link to the expressway. Drive time is 6.5-7 hours. Sedan: ₹4,060; SUV: ₹5,510; Crysta: ₹6,090. Most direct international arrivals headed to Coorg book a Crysta because the comfortable seating eases the post-flight drive." },
            { question: "Can the taxi drop me at a coffee plantation resort?", answer: "Yes — we drop at any address you provide. Many Coorg resorts (Tamara, Evolve Back, Coorg Wilderness, Old Kent) are 8-25 km off the main road via internal estate paths. Mention the exact resort name + GPS pin at booking; we share the location with the driver in advance to avoid arrival confusion." },
            { question: "Will the driver wait while I sightsee at Coorg attractions?", answer: "Not on a one-way drop — that ends at the booked drop point. For sightseeing on arrival (Madikeri + Talakaveri + Dubare), book a multi-day package where the same vehicle and driver stay with you. Mention sightseeing intent at booking; we quote the right package (round-trip vs 2-day vs 3-day) based on your itinerary." },
        ],
    },
    "bangalore-to-mysore": {
        snippetLede:
            "Bangalore to Mysore by taxi is approximately 150 km via the Bengaluru-Mysuru Expressway (NH275). The drive takes 2.5 to 3 hours on the new 10-lane access-controlled expressway. One-way drop taxi fares start at ₹2,100 for a sedan, ₹2,850 for an SUV and ₹3,150 for an Innova Crysta — all-inclusive of tolls, driver bata and GST. The Mysore Expressway has cut earlier 4-hour journey times to under 3 hours for most weekday departures.",
        intro:
            "The Bangalore to Mysore route was transformed in March 2023 when the new <strong>Bengaluru-Mysuru Expressway</strong> opened — a 119 km greenfield 10-lane access-controlled highway with 110 km/h speed limits, eliminating the older traffic-choked NH275 stretch through Ramanagara and Mandya. The expressway has dropped average journey time from 3.5-4 hours to 2.5-3 hours for sedans and SUVs leaving Bangalore city limits before 9 AM. Mysore (officially Mysuru) is Karnataka's cultural capital — home to the Mysore Palace, Chamundi Hills, the dasara processions, and Karnataka's classical music tradition. The route is South India's most-booked weekend corridor, with Bangalore city dwellers regularly making same-day round trips for the palace, KRS dam, or Srirangapatna heritage sites.",
        bestTime:
            "Depart Bangalore between 6 AM and 8 AM to clear the Electronic City and NICE Road interchange before peak traffic. Late-evening departures (after 8 PM) are also smooth — the expressway is well-lit and toll plazas have FASTag-only fast lanes. Avoid Friday 5 PM-9 PM and Sunday 4 PM-9 PM (peak return traffic from Mysore weekenders). For festival weekends (Mysore Dasara — September-October), book 7-10 days ahead and add 60-90 minutes to drive estimates. The route operates year-round; monsoon (June-September) can slow visibility but rarely closes the expressway.",
        sampleTimeline: [
            { time: "6:00 AM", activity: "Pickup from Bangalore (Whitefield, Electronic City, Koramangala, Indiranagar, Airport, or your address)." },
            { time: "6:30 AM (+30 min)", activity: "Clear NICE Road interchange or Electronic City junction. Enter the Bengaluru-Mysuru Expressway near Bidadi." },
            { time: "7:30 AM (+1.5 hrs)", activity: "Pass Ramanagara — silk-cocoon belt and the iconic granite hills. Brief halt at the Ramanagara service area for chai and bathroom break." },
            { time: "8:15 AM (+2 hrs 15 min)", activity: "Mandya district — sugarcane and paddy belt. Famous Maddur vada at Kamat or Adyar Anand Bhavan service halts." },
            { time: "8:45 AM (+2 hrs 45 min)", activity: "Exit expressway at Srirangapatna — optional 30-minute detour to the fort, Tipu Sultan's summer palace, and the Cauvery river island." },
            { time: "9:00-9:30 AM (+3 hrs)", activity: "Arrive Mysore. Drop at Mysore Palace, Chamundi Hills, KSRTC bus stand, Mysore railway station, or your booked address." },
        ],
        dropPoints: [
            "Mysore Palace (city centre)",
            "Chamundi Hills (10 km from city)",
            "Brindavan Gardens / KRS Dam (19 km from city)",
            "Srirangapatna fort and Tipu's Summer Palace",
            "Mysore Zoo (Sri Chamarajendra Zoological Gardens)",
            "Mysore Railway Station and KSRTC Bus Stand",
            "Heritage hotels: Lalith Mahal Palace Hotel, Royal Orchid Metropole",
            "Resorts at Mandakalli, Kabini direction, and Bandipur road",
        ],
        routeHighlights: [
            { title: "Bengaluru-Mysuru Expressway (NH275)", detail: "10-lane access-controlled expressway opened March 2023. 110 km/h speed limit, FASTag-only at three toll plazas (Sheshagirihalli, Ganangur, Manipura). 119 km of the 150 km route is on this expressway — the older state highway connects Bangalore inner city to the expressway entry." },
            { title: "Ramanagara", detail: "60 km from Bangalore — a granite-hill landscape made famous as the location for the 1975 film 'Sholay'. Silk-cocoon trade hub. Service area on the expressway has well-equipped restrooms, fuel stations, and a McDonalds-Subway-South Indian food court combo. 15-minute halt territory." },
            { title: "Mandya sugarcane belt", detail: "Mid-route through the Cauvery delta — sugar mills, paddy fields, and the famous Maddur Tiffanys / Maddur vada heritage at the Maddur exit. Kamat and Adyar Anand Bhavan run service-road outlets for the classic ghee-laden Maddur vada and rava idli stop." },
            { title: "Srirangapatna island fort", detail: "10 km before Mysore — the Cauvery-encircled island fort that was Tipu Sultan's capital. Worth a 30-minute detour: the Daria Daulat Bagh summer palace, the British war memorial, and the dargah at the foot of the fort. Drivers familiar with the route know the back-entry that avoids the main bottleneck." },
            { title: "Mysore Palace approach", detail: "The drive into Mysore via the Bangalore Road approach passes Karanji Lake, the zoo gates, and St. Philomena's Cathedral. The palace itself is in the heart of the old city; drop-off is on the south gate with paid parking nearby." },
            { title: "Chamundi Hills viewpoint", detail: "On the Mysore approach for those routing via the Chamundi side, the drive up to Chamundeshwari Temple offers panoramic Mysore vistas. Many drivers will accept a short Chamundi detour as part of the drop." },
        ],
        foodStops: [
            { title: "Bidadi (toddy + thatte idli, 30 km)", detail: "First Bangalore exit on the older route — famous for thatte idli (plate idli, soft and 4x normal size). Most drivers know the trustworthy stalls that survived the expressway opening. Ten-minute halt." },
            { title: "Ramanagara service area (60 km)", detail: "Modern food court with McDonald's, Subway, Café Coffee Day, A2B (Adyar Anand Bhavan), clean restrooms, and a fuel station. Best halt on the entire route for families. 20-minute halt territory." },
            { title: "Maddur Tiffanys / Kamat (90 km)", detail: "Maddur vada is the route's signature snack — a crisp ghee-onion pancake unique to this stretch. Kamat and Adyar Anand Bhavan both run highway outlets. Vegetarian only; perfect 15-minute mid-route stop." },
            { title: "Srirangapatna river-side dhabas (135 km)", detail: "Cauvery-bank restaurants near the fort entrance. Karnataka-style fish (especially silver carp) and ragi mudde + saaru at lunch. Drivers familiar with the route prefer the Hotel Mayura Cauvery view." },
        ],
        vehicleGuidance:
            "The Bangalore-Mysore Expressway is one of South India's smoothest highway runs — virtually any vehicle in our fleet handles the route comfortably. <strong>Sedans (Etios/Dzire)</strong> at ₹2,100 are the best value for 2-3 passengers; the smooth tarmac and 110 km/h cruise make engine effort minimal. <strong>SUVs (Ertiga/Innova)</strong> at ₹2,850 give more cabin headroom for families with strollers/luggage and are preferred for the elderly because the seating height makes ingress/egress easier at multiple stops. <strong>Innova Crysta</strong> at ₹3,150 is the premium pick — quieter cabin lets passengers nap on the return leg. <strong>Tempo Travellers</strong> handle the route at expressway speeds without strain. Diesel and petrol both work; the expressway's flat profile means no significant fuel-economy gap between vehicle types.",
        monsoonAdvisory:
            "The route operates year-round. <strong>Monsoon impact (June-September):</strong> the expressway has good drainage and rarely floods, but heavy rain reduces visibility and toll-plaza queues lengthen. Add 30-45 minutes to dry-season estimates during heavy downpours. <strong>October-November</strong> is the most pleasant weather. <strong>Winter fog (December-January)</strong> can affect early-morning departures (5-7 AM) — drivers slow to 60-80 km/h on visibility under 200m, adding 30-45 minutes. <strong>What to pack year-round:</strong> sunglasses (the expressway runs east-west and the morning sun is direct), light jacket (Mysore is 5°C cooler than Bangalore on average), and FASTag credit if self-driving.",
        multiDayPackage:
            "For 2-3 day Mysore trips, our <strong>multi-day Mysore package</strong> uses the same vehicle and driver throughout. The package includes daily 250 km kilometre allowance (covers Mysore + Srirangapatna + KRS + Chamundi sightseeing), driver bata (₹500/day for inter-state travel), one night halt charge (₹350-500), tolls, and GST. <strong>Day 1:</strong> Bangalore pickup → Mysore arrival → Mysore Palace, Chamundi Hills. <strong>Day 2:</strong> KRS Dam, Brindavan Gardens, Mysore Zoo, optional Srirangapatna circuit. <strong>Day 3:</strong> Mysore departure → optional Talakad/Somnathpur detour → Bangalore drop. Sedan package starts at ₹10,800 for 3 days, SUV at ₹14,500, Crysta at ₹16,200. Add Coorg or Wayanad as an extension for an extra day.",
        destinationGuide: [
            { title: "Mysore Palace (Amba Vilas)", detail: "Open 10 AM-5:30 PM. Indo-Saracenic architecture from 1912; the seat of the Wodeyar dynasty. Sunday and public holiday illuminations (7-7:45 PM) are the photography highlight. ₹70 entry; ₹50 extra for the inner halls. Allow 2 hours minimum." },
            { title: "Chamundi Hills and Chamundeshwari Temple", detail: "10 km from city, 1,062 steps or a winding road. The Mahishasura statue at the temple courtyard, the Nandi monolith on the hill, and panoramic Mysore views. Best at sunrise (cooler, fewer crowds)." },
            { title: "KRS Dam and Brindavan Gardens", detail: "19 km from Mysore on the Krishnaraja Sagar dam. Musical fountain show 7 PM-7:55 PM; check seasonality before visiting. The terraced gardens are worth a 60-90 minute walk." },
            { title: "Srirangapatna fort circuit", detail: "Daria Daulat Bagh (Tipu's Summer Palace), Jamia Masjid, Sri Ranganathaswamy temple, the British war memorial, and the dungeons. Half-day visit; combine with the drive in or out of Mysore." },
            { title: "Mysore Zoo", detail: "One of India's oldest zoos (1892), well-curated with white tigers, giraffes, and a butterfly park. ₹80 adult, ₹40 child. 2-3 hour visit." },
            { title: "St. Philomena's Cathedral", detail: "Neo-Gothic Catholic cathedral, one of India's tallest. Free entry; quiet 30-minute stop on the way back to Bangalore." },
            { title: "Mysore Sandalwood Oil Factory and Government Silk Weaving Factory", detail: "Industrial heritage tours showing traditional Mysore craft production. Booking ahead recommended for the silk factory." },
        ],
        customFaqs: [
            {
                question: "How long does the Bangalore to Mysore drive take in 2026?",
                answer: "On the Bengaluru-Mysuru Expressway (opened March 2023), the drive takes 2.5 to 3 hours from city limit to city limit. From central Bangalore (MG Road, Indiranagar) to central Mysore the door-to-door time is typically 3 to 3.5 hours including the city-traffic legs at both ends. The earlier 4-hour journey times via the old NH275 are now obsolete.",
            },
            {
                question: "How much is a Bangalore to Mysore taxi?",
                answer: "One-way drop taxi: ₹2,100 sedan (Etios/Dzire), ₹2,850 SUV (Ertiga/Innova), ₹3,150 Innova Crysta — based on 150 km × per-km rates. The fare includes tolls (~₹250 for the expressway plazas), driver bata (₹400/day), and GST. There are no surge or weekend multipliers.",
            },
            {
                question: "Is the Bengaluru-Mysuru Expressway open for taxis?",
                answer: "Yes. The expressway is fully operational since March 2023 with FASTag-only toll plazas at Sheshagirihalli, Ganangur, and Manipura. Two-wheelers and tractors are not permitted; cars, SUVs, taxis, buses, and trucks are. Speed limits: 110 km/h for cars, 80 km/h for trucks. Our taxi fares already include all expressway tolls.",
            },
            {
                question: "Can I do a same-day Bangalore-Mysore-Bangalore trip?",
                answer: "Yes. A typical same-day plan: 6 AM Bangalore departure, 9 AM Mysore arrival, sightseeing 9 AM-5 PM (palace, Chamundi, lunch, KRS), 5-8 PM return. Choose a sedan or SUV depending on group size. For comfortable Mysore Palace + Chamundi Hills + KRS Brindavan Gardens coverage, a same-day round-trip works; for adding Srirangapatna or Mysore Zoo, plan an overnight stay.",
            },
            {
                question: "Do I need an inter-state permit for Bangalore to Mysore?",
                answer: "No — Bangalore and Mysore are both in Karnataka, so there is no inter-state permit fee. This is one reason the Bangalore-Mysore corridor is among India's cheapest 150 km taxi routes. Compare with Bangalore-Coimbatore which crosses the Karnataka-Tamil Nadu border and requires an inter-state permit.",
            },
            {
                question: "Are Uber and Ola available for Bangalore to Mysore?",
                answer: "Both Uber Intercity and Ola Outstation cover this route on demand, but availability outside Bangalore metro is intermittent. For guaranteed pickup at Bangalore Airport (KIA) or Whitefield/Electronic City pickups with a Mysore-experienced driver, dedicated drop-taxi operators are more consistent.",
            },
            {
                question: "What's the Bangalore Airport to Mysore taxi fare?",
                answer: "Bangalore Airport (KIA, Devanahalli) to Mysore is approximately 185 km via the airport-NICE Road-expressway combination. Sedan: ₹2,590, SUV: ₹3,515, Crysta: ₹3,890 — all-inclusive of tolls, driver bata, GST. The drive takes 3.5-4 hours depending on Bangalore city traffic to bypass.",
            },
            {
                question: "What's the cheapest way to travel from Bangalore to Mysore?",
                answer: "By cost per person: KSRTC Volvo bus (₹350-500) is cheapest for solo travellers; train (Mysuru Shatabdi or Tipu Express, ₹150-450) is comparable. For groups of 3+, a sedan taxi at ₹2,100 split between 4 = ₹525 per head — comparable to Volvo with door-to-door convenience and flexibility for stops at Srirangapatna and Maddur.",
            },
            {
                question: "Is the route safe for night travel?",
                answer: "Yes. The Bengaluru-Mysuru Expressway has streetlights through the toll-plaza zones, ample CCTV, and 24/7 highway patrol. Service areas at Ramanagara are open all night. We assign drivers experienced on this route for night bookings — most overnight bookings are 10 PM Bangalore departure, 1 AM Mysore arrival.",
            },
            {
                question: "Will the driver wait while I sightsee at Mysore?",
                answer: "Not on a one-way drop — that ends at the booked drop point. For sightseeing on arrival (palace + Chamundi + KRS), book a round trip or our 1-day Mysore package where the same driver and vehicle stay with you 8-10 hours. Mention sightseeing intent at booking; we quote the right product (round-trip vs day-rental vs multi-day).",
            },
        ],
    },
    "kochi-to-munnar": {
        snippetLede:
            "Kochi to Munnar by taxi is approximately 130 km via NH85 through Kothamangalam, Adimali and Neriamangalam. The drive takes 3.5 to 4.5 hours depending on traffic on the ghat section. One-way drop taxi fares start at ₹1,820 for a sedan, ₹2,470 for an SUV and ₹2,730 for an Innova Crysta — all-inclusive of tolls, driver bata and GST.",
        intro:
            "The Kochi to Munnar route is one of South India's most-booked outstation drives. Travellers landing at Kochi airport, on a backwaters break in Alleppey, or visiting family in Ernakulam often head straight up to Munnar's tea-clad hills. The route climbs steadily from sea level at Kochi to about 1,600 metres at Munnar, with the steepest gradients in the final 40 km between Adimali and Munnar town. Munnar itself is a relatively young town in tourism terms — its modern identity dates to the 1870s when British planter John Daniel Munro leased the High Range from the Poonjar royal family for tea cultivation. The Kannan Devan Hills Plantations (KDHP) — now Tata-owned — still operate most of the estates you drive past in the final 30 km. The town sits at the trijunction of three streams (Muthirapuzha, Nallathanni, and Kundaly), which is the literal meaning of 'Munnar' (mun-aru: three rivers) in Malayalam.",
        bestTime:
            "Start from Kochi between 7 AM and 9 AM to reach Munnar by lunchtime, beat the afternoon mist on the ghat, and have a full evening for tea-estate sightseeing. Avoid arriving after 6 PM — the last 30 km from Adimali to Munnar has limited streetlights and the ghat curves get visibility-tricky after sundown. June through September is monsoon season; the route is open but ghat road can be slippery — leave 30-45 minutes earlier than dry-season planning.",
        dropPoints: [
            "Munnar town centre (Old Munnar bus stand)",
            "KDHP Tea Museum (Tata Tea estate)",
            "Mattupetty Dam (10 km from town)",
            "Top Station / Echo Point",
            "Eravikulam National Park entry (Rajamala)",
            "Resorts at Chinnakanal, Suryanelli, Anachal",
        ],
        routeHighlights: [
            { title: "NH85 ghat road", detail: "Smooth 4-lane ghat with regular guardrails — a modern upgrade from the older two-lane road that was the only access until 2019. Most cars cruise at 40-60 km/h on the climb. The road surface is excellent except for a 5 km stretch near Adimali that gets patchy after heavy monsoon." },
            { title: "Cheeyappara waterfalls", detail: "First major waterfall, about 8 km after Neriamangalam. Drops in seven tiers and is visible right from the highway. Best volume from July through November (post-monsoon). Designated parking pull-over and photo viewpoint." },
            { title: "Valara waterfalls", detail: "About 3 km past Cheeyappara — narrower than its neighbour but with a cleaner cascade. A small tea-stall complex at the viewpoint serves quick refreshments. Five-minute halt typical." },
            { title: "Idamalayar valley", detail: "The dramatic valley road between Neriamangalam and Adimali — bounded by forested ridges with the Periyar River at the base. Photo stops aren't sanctioned (narrow shoulders) but the cinematic stretch lasts ~20 km." },
            { title: "Spice plantations near Adimali", detail: "Pepper, cardamom and clove gardens line the approach to Munnar. Several roadside shops let you sample fresh spices, essential oils, and home-made chocolate. Most drivers know the trustworthy ones — KDHP-licensed shops carry genuine highland spices." },
            { title: "Cardamom County / Old Munnar tea estates", detail: "From 12 km before Munnar town, the landscape transitions from cardamom belts to the tea-clad slopes that the region is famous for. The change is sudden and photographable." },
            { title: "Tea estate viewpoints", detail: "From 5 km before Munnar town, the manicured Tata Tea estates open up dramatically. Most drivers pull over for a 10-minute photo stop on request — the panoramas at the Lockhart Tea Museum approach are the most-photographed in Munnar." },
            { title: "Power House waterfall (alternate stretch)", detail: "If your driver routes via the alternate Pallivasal stretch, you pass this hydroelectric-station waterfall. Smaller than Cheeyappara but always running because it's fed from the dam." },
        ],
        foodStops: [
            { title: "Kothamangalam (1.5 hours from Kochi)", detail: "Best-equipped town for a full meal. Kerala-Christian cuisine specialty: beef fry, appam-stew, fish moilee. Also strong vegetarian options. Many drivers' default lunch halt." },
            { title: "Neriamangalam roadside dhabas", detail: "Quick chai and parippu vada (lentil fritters) stops at the river-bridge area. Five-minute breaks. Clean restrooms at the larger restaurants near the bridge." },
            { title: "Adimali (3.5 hours from Kochi)", detail: "Last major town before the final climb. Saravana Bhavan-style vegetarian restaurants and Kerala biryani spots. Best for tea, snacks, and clean restrooms before the steep section. Avoid heavy meals here — the climb to Munnar is windy." },
            { title: "Pallivasal hydropower viewpoint", detail: "Small chai shops with a valley view. Ten-minute photo halt territory rather than a meal stop." },
            { title: "Devikulam (just before Munnar)", detail: "Tea-and-snacks halts overlooking Munnar town. If you arrive late and Munnar restaurants are closed, Devikulam has a few late-evening options." },
        ],
        vehicleGuidance:
            "The Kochi-Munnar climb has 80 km of continuous gradient between Kothamangalam and Munnar — manageable in any of our vehicles, but the comfort difference is real on the way up. <strong>Sedans (Etios/Dzire)</strong> handle the route fine for 2-3 passengers, but the engine works harder on the final 30 km and you may notice fading on long downhill brake applications during the return. <strong>SUVs (Ertiga, older Innova)</strong> are the sweet spot for 4-7 passengers — better torque on the climb, more cabin headroom for the bumpier sections. <strong>Innova Crysta</strong> is the smoothest ride for elderly passengers and longer-distance comfort: the 2.4L diesel has surplus torque, the suspension is calibrated for ghats, and the captain seats (where the variant has them) recline meaningfully on the descent. <strong>Tempo Travellers</strong> handle the route but require an experienced driver — request 'experienced TT driver' at booking for ghat-road comfort. Diesel variants are universally preferred over petrol for this route because the climb consumes 25-30% more fuel than highway driving.",
        monsoonAdvisory:
            "Munnar's two monsoons (Southwest June-August, Northeast October-December) make the route operational year-round but conditions vary substantially. <strong>June-August</strong> brings heavy intermittent rain, occasional landslides on the Adimali-Munnar stretch (KSEB and PWD usually clear within 4-12 hours), and reduced visibility on ghat curves after 4 PM. <strong>October-December</strong> is gentler but the Kochi-Kothamangalam section can flood during cyclone events. We monitor IMD and KSDMA advisories daily during monsoon; on landslide-warning days we reschedule rather than route-around. <strong>Kerala-Tamil Nadu border via Marayoor (alternate route)</strong> is sometimes used during landslide closures — adds 35 km but bypasses the Adimali bottleneck. <strong>What to pack:</strong> warm layer (Munnar drops to 12-15°C even in monsoon), umbrella, microfibre towel, plastic-bag for camera. Drivers experienced on this route carry a charged jumper-cable kit and emergency torch year-round.",
        multiDayPackage:
            "If your trip allows 2-3 days at Munnar instead of a one-day visit, our <strong>multi-day Munnar package</strong> works out cheaper than two separate one-way bookings. The package includes the same driver and vehicle for the duration, daily 250 km kilometre allowance (covers all standard sightseeing), driver bata (₹400/day), one night halt charge per night (₹250-500), and tolls. <strong>Day 1:</strong> Kochi pickup → Munnar arrival → Mattupetty Dam, KFDC Tea Museum. <strong>Day 2:</strong> Eravikulam National Park (Rajamala) → Top Station → Echo Point → Kundala Lake. <strong>Day 3:</strong> Pothamedu viewpoint → spice plantation visit → Kochi drop. Sedan package starts at ₹11,500 for 3 days, SUV at ₹15,800, Innova Crysta at ₹17,200 — request a quote at booking with your exact dates and pickup/drop addresses.",
        destinationGuide: [
            { title: "Eravikulam National Park (Rajamala)", detail: "12 km from Munnar town. Home to the Nilgiri Tahr — a near-threatened mountain goat species — and dense shola grasslands. Open 7 AM-5 PM (entry closes 4 PM); shuttle bus from gate to viewing zone. Best months: October-March. Closed Feb-Mar during calving season; check before visiting. Tickets ₹125 per adult, ₹95 children." },
            { title: "Mattupetty Dam and Lake", detail: "13 km from Munnar town on the Top Station road. Concrete arch dam with a placid lake suitable for boating and a Indo-Swiss dairy farm visit nearby. Speed boats and shikara rides available; expect 30-60 minute waits during weekends. The dam wall is a popular sunrise photo point." },
            { title: "Top Station and Kolukkumalai", detail: "32 km from Munnar — the highest point on the road, marking the Kerala-Tamil Nadu border. Top Station gives panoramic views of the Western Ghats; Kolukkumalai (further on) is the world's highest organic tea estate at 2,200m. The road from Suryanelli to Kolukkumalai is jeep-only and adds 1.5 hours; book a local jeep transfer rather than ask your taxi driver to attempt it." },
            { title: "KDHP Tea Museum (Tata Tea)", detail: "Inside Munnar town. Working tea-processing facility with 1-hour guided tours covering plucking, withering, rolling, fermenting, and grading. The on-site tea-tasting bar lets you sample white, green, and CTC black varieties. Open 9 AM-4 PM, closed Mondays. Tickets ₹85 per adult." },
            { title: "Echo Point and Kundala Lake", detail: "15 km from Munnar on the Top Station road. Lake-adjacent vantage where natural acoustics give a 4-5 second echo. Pedal boats and small wooden boats available. The drive itself — through the Kundala Tea Estate — is the highlight; budget 30 minutes for the road experience alone." },
            { title: "Pothamedu Viewpoint", detail: "5 km from Munnar town on the Adimali road (return-side). Panoramic vista of tea estates with a stone-walled viewpoint and roadside chai vendors. Best at sunrise (6-7 AM) for the cloud-clearing-from-valleys phenomenon. Free entry." },
            { title: "Tata Tea Plantation walks", detail: "Pre-bookable estate walks through the Lockhart and Lethem divisions — guided 90-minute tours covering tea-plucking demos, factory visit, and a strict-on-quality afternoon tea on the manager's bungalow lawn. ₹500-800 per person depending on tour. Worth the booking for tea enthusiasts." },
        ],
        sampleTimeline: [
            { time: "6:00 AM", activity: "Pickup from Kochi (airport, Ernakulam Junction, Fort Kochi or your hotel). Driver with name placard waits at terminal exit / station gate." },
            { time: "7:30 AM (+1.5 hrs)", activity: "Reach Kothamangalam — last major town before the ghat begins. 20-minute breakfast stop at a Kerala restaurant. Toilets, idli/dosa, beef fry options for non-veg eaters." },
            { time: "8:30 AM (+2.5 hrs)", activity: "Pass Neriamangalam bridge over the Periyar River; enter the dramatic Idamalayar valley road. Photo halts limited (narrow shoulders) but the cinematic stretch lasts 20 km." },
            { time: "9:00 AM (+3 hrs)", activity: "Cheeyappara waterfalls visible from the road — 5-minute photo halt at the designated viewpoint. Valara waterfalls 3 km further; second halt optional." },
            { time: "9:30 AM (+3.5 hrs)", activity: "Reach Adimali — base of the final climb to Munnar. Restaurants, spice shops, and clean restrooms. Recommended halt: tea + parippu vada for energy on the climb." },
            { time: "10:30-11:00 AM (+4.5 hrs)", activity: "Arrive Munnar town. Drop at hotel, KDHP Tea Museum, Mattupetty Dam, or your booked address. Time to unpack, lunch, and start your first afternoon attraction." },
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
