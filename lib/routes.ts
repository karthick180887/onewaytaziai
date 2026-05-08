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
