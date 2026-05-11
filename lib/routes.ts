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
    "salem-to-yercaud": {
        snippetLede:
            "Salem to Yercaud distance is approximately 32 km by road via the Yercaud ghat road, which climbs the Shevaroy Hills through 20 hairpin bends from the plains to 1,515 metres at Yercaud town. The drive takes 60 to 75 minutes for the climb. Sedan taxi fare: ₹450 one-way (₹14/km × 32 km). SUV: ₹610. Innova Crysta: ₹670. All fares include tolls, driver bata, and GST.",
        intro:
            "Yercaud is the closest hill station to Salem and one of South India's most accessible 'mini-Ooty' destinations — sitting 1,515 metres up in the <strong>Shevaroy Hills</strong>, just 32 km from the Salem plains via a well-maintained ghat road with 20 hairpin bends. The town was developed by the British as a coffee and orange plantation district in the 1820s, and unlike larger Nilgiri hill stations it remains less crowded — making it a popular weekend escape for residents of Salem, Coimbatore, Bangalore, and Chennai. The lake (Yercaud Lake), the Shevaroy Temple at the highest point, and the orange-coffee plantation views are the destination's highlights. The route is one of South India's shortest hill-station drives and a genuine half-day excursion possibility from Salem.",
        bestTime:
            "<strong>Departure timing:</strong> 7-9 AM is the most-comfortable window — clear of Salem morning traffic, beats the afternoon heat haze that obscures the ghat views, arrives at Yercaud's 1,515m altitude before noon. Avoid 4-7 PM weekend departures (heaviest ghat traffic from Salem-side day-trippers). <strong>Best season:</strong> April-June (peak summer escape from Salem heat — 25°C in Yercaud vs 38-42°C in Salem plains). October-December (post-monsoon clarity). January-February (cool, occasionally misty mornings). <strong>Avoid:</strong> peak monsoon weeks in October when ghat fog and slipperiness reduce visibility. The route is operational year-round; we monitor IMD warnings.",
        sampleTimeline: [
            { time: "8:00 AM", activity: "Pickup from Salem (junction, bus stand, Hasthampatti, Fairlands, Omalur, or your address)." },
            { time: "8:15 AM (+15 min)", activity: "Reach the base of the Yercaud ghat at the Salem-Yercaud Road junction. The 20-hairpin climb begins." },
            { time: "8:30 AM (+30 min)", activity: "Pass the first major viewpoint — panoramic views of Salem city and the Mettur reservoir. 5-minute photo halt territory." },
            { time: "8:45 AM (+45 min)", activity: "Approaching Yercaud — coffee plantations, orange groves, and shola forest line the final 5 km. Cooler air, mist often visible." },
            { time: "9:00 AM (+1 hr)", activity: "Arrive Yercaud town. Drop at Yercaud Lake, Anna Park, Shevaroy Temple, your resort, or local bus stand." },
        ],
        dropPoints: [
            "Yercaud Lake and Anna Park",
            "Shevaroy Temple (highest point in the Shevaroy Hills)",
            "Lady's Seat / Gent's Seat / Children's Seat viewpoints",
            "Pagoda Point and the Pyramid Tower",
            "Killiyur Falls (4 km from Yercaud)",
            "Hotels and resorts: Sterling Yercaud, GRT Hotels, Hotel Shevaroys, Country Estate",
            "Kilavarai (orange and coffee plantation tour starts)",
            "Yercaud bus stand and railway station (Mahaballeshwar Yercaud connection)",
        ],
        routeHighlights: [
            { title: "Yercaud Ghat Road", detail: "20 hairpin bends from Salem plains (300m) to Yercaud town (1,515m). The ghat is well-maintained, two-lane wide enough for two cars to pass at hairpins, with regular guardrails and milestone markers indicating each bend. Surface remains good year-round except for occasional monsoon-season patches." },
            { title: "Salem city exit (Omalur direction)", detail: "Salem-Yercaud Road branches off the NH44 (Salem-Bangalore highway) just past Omalur. The first 5 km is plains driving with view of the Shevaroy Hills ahead." },
            { title: "Yercaud Loop Road approach", detail: "The standard ghat road has a parallel 'loop road' for slow-moving vehicles. Buses use the loop; taxis and cars use the main hairpin route for the faster climb." },
            { title: "Coffee and orange plantations", detail: "From hairpin bend 14 onwards, the road is lined with coffee estates (Robusta and Arabica) and orange groves. The 'orange' in 'orange-coffee plantation' is genuinely the citrus orange — Yercaud is one of the few South Indian hill stations growing oranges commercially." },
            { title: "Yercaud Lake approach", detail: "The town centre is built around the lake, with the bus stand on one side and the main hotel cluster on the other. Drop addresses cluster around the lake or on the Pagoda Point road extending east." },
            { title: "Shevaroy Hills geology", detail: "The Shevaroys are an isolated granite massif rising 1,500-1,615 metres from the surrounding Salem plains. The drive showcases how dramatically vegetation changes from dry-deciduous at base to evergreen shola forest at the top." },
        ],
        foodStops: [
            { title: "Salem departure (no halt)", detail: "Most drivers prefer to clear Salem city before any halt — the climb is short enough that an in-Salem hotel-room breakfast works fine." },
            { title: "Yercaud town arrival", detail: "GRT Hotels Yercaud, Sterling Yercaud, Hotel Shevaroys, and several smaller eateries near the lake serve South Indian and basic North Indian. Yercaud is small — three or four sit-down restaurants is the entire town's dining scene." },
            { title: "Coffee plantation cafes", detail: "Several plantations along the Pagoda Point road offer cafe stops — fresh-brewed coffee, plantation tours, and snacks. Worth the visit for coffee enthusiasts. ₹100-300 per person typical." },
        ],
        vehicleGuidance:
            "The Salem-Yercaud climb is short (32 km) but steep — 20 hairpin bends compressed into the final 22 km. Vehicle choice matters more for comfort than capability. <strong>Sedans (Etios/Dzire)</strong> at ₹450 handle the climb fine for 2-3 passengers; the engine works moderately on the steepest sections but no vehicle struggles. <strong>SUVs (Ertiga/Innova)</strong> at ₹610 are the popular family pick — better seating height for elderly travellers, more luggage room for weekend stays. <strong>Innova Crysta</strong> at ₹670 is the smoothest option for motion-sensitive passengers; the suspension calibration noticeably reduces hairpin lurch. <strong>Diesel preferred for the climb</strong> — surplus low-end torque means relaxed driving. <strong>Tempo Travellers</strong> can do the climb but with more strain on hairpins; request 'experienced ghat driver' if booking a TT for Yercaud.",
        monsoonAdvisory:
            "<strong>October-December (Northeast monsoon):</strong> peak rainfall in the Shevaroy Hills. Ghat fog from 2 PM onwards; some drivers reduce speeds to 25-30 km/h during heavy rain visibility. Occasional brief road closures (1-2 hours) for tree-fall clearance. <strong>July-August (Southwest monsoon edge):</strong> short showers, cooler temperatures (20-25°C in Yercaud), beautiful post-rain greenery. <strong>March-June (peak season):</strong> Salem plains hit 38-42°C; Yercaud stays 22-28°C — most popular escape window. <strong>December-February:</strong> cold mornings (10-15°C), occasional frost on the highest stretches. <strong>Pack year-round:</strong> light warm layer (the temperature drop from Salem to Yercaud is 10-15°C), umbrella, mosquito repellent for plantation walks, motion-sickness medication for back-seat passengers prone to it.",
        destinationGuide: [
            { title: "Yercaud Lake (Big Lake)", detail: "The town's central attraction — a large freshwater lake with boating (pedal boats, motor boats, ₹100-300 per ride). The promenade has small kiosks and the Anna Park abuts the lake. Best at sunrise (6-7 AM) for the mist-rising photos. Allow 90 minutes." },
            { title: "Shevaroy Temple", detail: "1,615m — the highest point in the Shevaroy Hills, dedicated to Shevaroyan and his consort. The drive to the temple is on a side road from Yercaud town; parking + 200m walk to the shrine. Clear days offer panoramic Tamil Nadu plains views. Free entry; allow 60-90 minutes including the drive." },
            { title: "Lady's Seat, Gent's Seat, Children's Seat", detail: "Three viewpoints along the same ghat road offering panoramic Salem-plains views. Lady's Seat is the most-photographed (rocky outcrop with safety railings). Free; allow 30 minutes for all three." },
            { title: "Killiyur Falls", detail: "4 km from Yercaud town — moderate waterfall, best volume August-October. Short walk from the parking area (10-15 minutes). ₹15 entry. Allow 60 minutes." },
            { title: "Pagoda Point and Pyramid Tower", detail: "Eastern edge of Yercaud town — historic stone pyramid with panoramic views of the surrounding hills. The road continues to Pagoda Point sunset viewpoint. Free; allow 60-90 minutes." },
            { title: "Coffee and orange plantation tours", detail: "Most plantations offer guided 60-90 minute walks covering coffee processing, citrus cultivation, and homestead-style refreshments. Booking ahead recommended for the larger estates (Country Estate, Skyrocca Estate). ₹300-800 per person." },
            { title: "Anna Park and Botanical Gardens", detail: "Town-centre park beside the lake — landscaped beds, a small bird-watching corner, and amenity rest areas. Open 9 AM-6 PM. ₹10 entry. Quick 30-minute halt." },
        ],
        customFaqs: [
            { question: "What is the Salem to Yercaud distance?", answer: "Salem to Yercaud is approximately 32 km by road via the Yercaud ghat road. The straight-line distance is much shorter (~16 km) but the road climbs the Shevaroy Hills with 20 hairpin bends. The 32 km figure is what taxi fare calculations use." },
            { question: "How long does the Salem to Yercaud drive take?", answer: "About 60 to 75 minutes for the 32 km drive. The first 8-10 km from Salem is fast plains driving; the next 22 km on the ghat with 20 hairpins takes 45-55 minutes at safe speeds. Heavy weekend traffic or monsoon mist can extend this by 15-20 minutes." },
            { question: "How much is a Salem to Yercaud taxi?", answer: "One-way drop fares: ₹450 sedan (Etios/Dzire), ₹610 SUV (Ertiga/Innova), ₹670 Innova Crysta — based on 32 km × per-km rates of ₹14, ₹19, ₹21. Includes tolls (none on this short ghat), ₹400/day driver bata, and GST. The 32 km × distance is below our 130 km outstation minimum, so a small minimum-fare adjustment may apply on standalone bookings; combine with a longer outstation route for the best value." },
            { question: "Is Yercaud worth visiting from Salem?", answer: "Yes — Yercaud is the closest hill station to Salem (32 km, 1 hour drive), a genuine 1,515m altitude change with 10-15°C cooler weather. It's a popular half-day escape in summer when Salem hits 38-42°C. The lake, temple, viewpoints, and coffee/orange plantations make it a satisfying short-stay destination, especially March-June." },
            { question: "Can I do a same-day Salem-Yercaud-Salem trip?", answer: "Absolutely — same-day round-trips are the most common booking on this route. A typical plan: 8 AM Salem departure, 9 AM Yercaud arrival, 4-6 hours sightseeing (lake + temple + viewpoints + plantation), 4-5 PM departure, 6 PM Salem return. We quote round-trip pricing roughly 1.9× the one-way (₹850 sedan, ₹1,160 SUV) plus driver halt charge if you stay >5 hours at the destination." },
            { question: "Is the Yercaud ghat road safe?", answer: "Yes — the Yercaud ghat is well-maintained with regular guardrails, painted lane markings, and frequent passing zones. The 20 hairpin bends are clearly marked and not as steep as the Coimbatore-Ooty ghat. We assign drivers familiar with the ghat for all Yercaud bookings; senior drivers handle monsoon-season trips with lower speeds." },
            { question: "What's the best time to drive from Salem to Yercaud?", answer: "March-June for the temperature escape (Salem 38-42°C vs Yercaud 22-28°C). October-December for post-monsoon clarity. December-February for cold mornings and the occasional frost. Avoid peak Northeast monsoon mid-October to mid-November if you want clear ghat-road visibility." },
            { question: "Do I need a permit to enter Yercaud?", answer: "No — Yercaud is in Tamil Nadu's Salem district, no permits or e-pass system. Free vehicle entry year-round." },
            { question: "Are there hotels at Yercaud for an overnight stay?", answer: "Yes — Sterling Yercaud, GRT Hotels, Hotel Shevaroys, Country Estate, and a dozen mid-range and budget options near the lake. Heritage estate stays (Country Estate, Skyrocca Estate) offer plantation experiences. Advance booking 30-45 days during peak season (April-June, December)." },
            { question: "Will the taxi wait while I sightsee at Yercaud?", answer: "Not on a one-way drop — that ends at the booked drop point. For sightseeing on arrival (lake + temple + viewpoints), book a half-day round-trip where the driver waits 4-6 hours at the destination. Driver halt charge: ₹150-250 per hour beyond the free 30 minutes. Many same-day Yercaud trips are booked as round-trip with 5-6 hour halt." },
        ],
    },
    "chennai-to-bangalore": {
        snippetLede:
            "Chennai to Bangalore by taxi is approximately 346 km via NH48 through Sriperumbudur, Vellore, Krishnagiri and Hosur, taking 6 to 7 hours including a meal halt. One-way drop taxi fares start at ₹4,850 for a sedan, ₹6,580 for an SUV and ₹7,270 for an Innova Crysta — all-inclusive of inter-state permit, tolls, driver bata and GST. The corridor is South India's busiest business route, with corporate, family, and pilgrim traffic running 24/7.",
        intro:
            "The Chennai-Bangalore corridor — locally called <strong>NH48</strong> (formerly NH4) — is South India's most-trafficked inter-city highway and the backbone of the Chennai-Bangalore industrial belt. The route runs through Sriperumbudur (Hyundai/Ford manufacturing), the Vellore CMC Hospital corridor, Krishnagiri (mango belt), and Hosur (Bangalore-tier industrial cluster) before entering Bangalore via Electronic City. Average daily traffic includes thousands of corporate commuters, weekend family travellers, hospital appointment trips to Vellore CMC and Bangalore super-specialty hospitals, and pilgrim returns from Tirupati. The 346 km route is mostly four to six lanes with the final 20 km in Bangalore subject to peak-hour traffic. Driver familiarity with both Chennai and Bangalore exit/entry points is critical for door-to-door time efficiency.",
        bestTime:
            "<strong>Departure timing matters more than season on this route.</strong> From Chennai: 5-6 AM gets you to Bangalore by 12 PM with light traffic at both ends. 8-10 PM overnight departure reaches Bangalore by 4-5 AM, beating both city's peak traffic. <strong>Avoid:</strong> Friday 5-9 PM departures (Chennai exit + Bangalore arrival both peak), Sunday 4-9 PM (return-to-Bangalore traffic on the Hosur-Electronic City stretch — can add 60-90 minutes). <strong>Best season:</strong> November-February (cool, dry, excellent visibility). October-November can have retreating Northeast monsoon affecting the first 100 km from Chennai. June-September Southwest monsoon edge — short showers, cooler. April-May is hot (35-40°C) but the route runs without restriction.",
        sampleTimeline: [
            { time: "5:00 AM", activity: "Pickup from Chennai (T Nagar, Adyar, Velachery, OMR, Anna Nagar, Tambaram, Porur, airport, or your address)." },
            { time: "5:45 AM (+45 min)", activity: "Pass Sriperumbudur (45 km) — Hyundai/Ford manufacturing belt. The Sriperumbudur tollway is the first toll plaza." },
            { time: "7:00 AM (+2 hrs)", activity: "Reach Vellore (140 km) — CMC Hospital corridor. Most Chennai-side drivers route via the Vellore bypass to skip city traffic." },
            { time: "8:30 AM (+3 hrs 30 min)", activity: "Cross into Karnataka at the TN-KA border. Inter-state permit checkpoint (we handle the paperwork; ~5-minute halt). Krishnagiri tollway begins." },
            { time: "9:30 AM (+4 hrs 30 min)", activity: "Pass Krishnagiri (190 km) — mango belt and the route's main meal-halt cluster (Hotel Saravana Bhavan, Adyar Anand Bhavan)." },
            { time: "11:00 AM (+6 hrs)", activity: "Reach Hosur (290 km) — Bangalore-tier industrial cluster, 'Little Singapore' tag. Last toll plaza before Bangalore entry." },
            { time: "12:00-12:30 PM (+7 hrs)", activity: "Arrive Bangalore. Drop at Electronic City (most common), Whitefield, Koramangala, Indiranagar, KIA airport, or your booked address." },
        ],
        dropPoints: [
            "Bangalore IT corridors: Electronic City, Whitefield, Manyata Tech Park, Sarjapur Road",
            "Bangalore residential clusters: Koramangala, Indiranagar, HSR Layout, Marathahalli",
            "Kempegowda International Airport (KIA, Devanahalli — adds 35 km)",
            "Bangalore Cantonment, Majestic Bus Stand, Bangalore City Railway Station",
            "Major hospitals: Manipal Whitefield, Apollo Bannerghatta, Narayana Hrudayalaya, Fortis Bannerghatta",
            "Heritage hotels: ITC Gardenia, Taj West End, The Leela Palace",
            "Hosur (alternate drop — 290 km, common for industrial visitors)",
            "Krishnagiri (alternate drop for fruit-trade and mid-Tamilnadu connections)",
        ],
        routeHighlights: [
            { title: "NH48 (formerly NH4)", detail: "South India's premier inter-state highway. Four to six lanes throughout, with FASTag-only fast lanes at major plazas. Speed limits 100 km/h for cars on national-highway sections, dropping to 80 km/h in urban approach zones." },
            { title: "Sriperumbudur", detail: "45 km from Chennai — major manufacturing belt with Hyundai's Indian plant, Ford's former plant, and Saint-Gobain. The Rajiv Gandhi memorial (assassination site, 1991) is at the eastern edge of the town." },
            { title: "Vellore CMC corridor", detail: "Vellore's Christian Medical College Hospital is one of India's busiest super-specialty hospitals. The route passes through the hospital's outer corridor; many Tamil Nadu and Andhra patients use this taxi for CMC appointments. Vellore bypass saves 25-30 minutes versus city-centre driving." },
            { title: "Krishnagiri (mango belt)", detail: "190 km from Chennai — Tamil Nadu's mango capital. April-June season sees roadside fruit stalls; the cluster of Saravana Bhavan, A2B (Adyar Anand Bhavan), and Hotel Vasanta Bhavan dhabas at the Krishnagiri bypass is the route's main meal halt." },
            { title: "TN-KA inter-state border", detail: "Just north of Krishnagiri. Inter-state permit checkpoint — we handle the paperwork at booking and the cost is included in the fare. Border crossing takes 3-5 minutes for taxis with valid permits." },
            { title: "Hosur — 'Little Singapore'", detail: "290 km from Chennai, 38 km from Bangalore — Bangalore-tier industrial cluster with TVS Motors, Ashok Leyland, and dozens of MNCs. Hosur Bypass is well-maintained and avoids the town centre. The Hosur tollway connects to the Electronic City flyover." },
            { title: "Electronic City entry to Bangalore", detail: "Bangalore's first major IT corridor (Infosys, Wipro, TCS HQs). The 9 km elevated expressway from Hosur connects Electronic City directly to the Bangalore Bommasandra area, bypassing surface-road traffic." },
        ],
        foodStops: [
            { title: "Sriperumbudur (45 km)", detail: "A2B (Adyar Anand Bhavan), Hotel Saravana Bhavan, and Hotel Vrindavan are popular early-morning halts. Pure-veg breakfast (idli, dosa, ghee roast). Twenty-minute halt territory." },
            { title: "Vellore bypass area (140 km)", detail: "Hotel Saravana Bhavan and small dhabas on the Vellore bypass. Quick chai, coffee, and bathroom break — most drivers prefer to push to Krishnagiri for a proper meal." },
            { title: "Krishnagiri (190 km)", detail: "Best meal-halt cluster on the route. Saravana Bhavan, A2B, Hotel Vasanta Bhavan, and the famous Hotel Annalakshmi serve full meals (banana-leaf thali) from 11 AM. Forty-minute halt typical." },
            { title: "Ambur biryani belt (160 km mark, slight detour)", detail: "Ambur is just off the highway after Vellore. Famous for Star Biryani and Beebi Biryani — the route's culinary side-trip. Adds 25-30 minutes total but worth it for biryani lovers." },
            { title: "Hosur (290 km)", detail: "Last good food halt before Bangalore. Bangalore-tier dining — A2B, MTR, and Cafe Coffee Day. Twenty-minute halt." },
            { title: "Electronic City Phase 1 (320 km)", detail: "First Bangalore food cluster — Empire Restaurant, Nandhini, Truffles, Cafe Coffee Day. Traffic can stretch arrival times here, so most drivers prefer to push to your final drop and let you eat after arrival." },
        ],
        vehicleGuidance:
            "The Chennai-Bangalore corridor is one of South India's smoothest highway runs — virtually any vehicle handles it. <strong>Sedans (Etios/Dzire)</strong> at ₹4,850 are the most-booked option for solo and 2-3 passenger trips, especially corporate runs where cost matters. <strong>SUVs (Ertiga/Innova)</strong> at ₹6,580 are preferred for 4-7 family travellers — better legroom for the 6-7 hour drive, more luggage room. <strong>Innova Crysta</strong> at ₹7,270 is the corporate-class pick — quieter cabin lets executives work or rest in transit, captain seats (variant-dependent) ease the long ride. <strong>Tempo Travellers</strong> are common for corporate offsites, weddings, and college events. <strong>Diesel preferred for fuel economy</strong> on this 700 km round-trip — the difference adds up on long corporate-run frequencies. Both petrol and diesel handle the route's flat profile equally well otherwise.",
        monsoonAdvisory:
            "The Chennai-Bangalore corridor straddles two monsoon zones. <strong>Northeast monsoon (October-December)</strong> affects the Chennai-Vellore stretch — heavy rain, occasional ECR-side flooding (rare on NH48 itself). <strong>Southwest monsoon (June-September)</strong> affects the Krishnagiri-Bangalore stretch — short showers, cooler weather. <strong>Cyclone events:</strong> rare, but October-December cyclones in the Bay of Bengal can affect the first 100 km from Chennai. We monitor IMD warnings; trip postponement (not route changes) is the standard response. <strong>April-May:</strong> hot (35-40°C) but the AC-cabined drive is unaffected. <strong>December-February:</strong> peak comfort season — cool 18-26°C, dry, clear visibility. Hosur and Bangalore can have winter morning fog (5-7 AM) reducing visibility on the final 30 km; driver slows to 60-70 km/h for safety.",
        destinationGuide: [
            { title: "Bangalore corporate corridors", detail: "Electronic City (Infosys, Wipro, TCS), Whitefield (IBM, Dell, SAP), Manyata Tech Park (IBM, Cognizant), Outer Ring Road (Microsoft, Google). Most Chennai-Bangalore taxi customers are corporate travellers heading to one of these. We assign drivers familiar with each corridor's entry routes to avoid surface-road delays." },
            { title: "Bangalore Palace and Cubbon Park", detail: "For tourist-mode visitors, the central heritage circuit covers the Bangalore Palace, Cubbon Park, Vidhana Soudha, and the Lalbagh Botanical Garden. Half-day visit; private taxi pickup-drop the easiest way to cover all four." },
            { title: "Bangalore food and shopping circuits", detail: "MG Road, Brigade Road, Indiranagar 100 Feet Road, Koramangala Sony World — Bangalore's main retail and dining clusters. Chennai-side visitors typically extend the trip with a shopping evening." },
            { title: "Tirupati Devasthanam connections (return leg)", detail: "Many Chennai-Bangalore taxi bookings double as Tirupati pilgrim returns — request a Tirupati halt on the return for a multi-stop pilgrim package. The detour adds 100 km but combines two pilgrim destinations efficiently." },
            { title: "Bangalore Hospitals (medical tourism)", detail: "Manipal Whitefield, Apollo Bannerghatta, Narayana Hrudayalaya, Fortis Bannerghatta — the four most-booked super-specialty destinations from Chennai for cardiac and oncology consultations. We assign Crysta vehicles by default for hospital appointments where elderly patient comfort matters." },
            { title: "Coorg and Mysore extensions", detail: "Many Chennai-Bangalore travellers extend into Karnataka with Coorg or Mysore — book a multi-day package (Chennai → Bangalore → Coorg → return) for the same vehicle and driver throughout. The package typically saves 20-25% versus separate one-ways." },
        ],
        customFaqs: [
            { question: "How long does the Chennai to Bangalore drive take?", answer: "Approximately 6 to 7 hours for the 346 km drive via NH48, including a 30-40 minute meal halt at Krishnagiri or Vellore. From central Chennai (T Nagar, Adyar) to central Bangalore (MG Road, Indiranagar), plan for 7 hours door-to-door on a weekday morning departure. Friday evening and Sunday afternoon traffic can extend this by 60-90 minutes." },
            { question: "How much is a Chennai to Bangalore taxi?", answer: "One-way drop fares: ₹4,850 sedan (Etios/Dzire), ₹6,580 SUV (Ertiga/Innova), ₹7,270 Innova Crysta. Includes inter-state permit (~₹500 TN-KA crossing), tolls (~₹350-450 cumulative on NH48), driver bata (₹500/day for inter-state), and GST. No surge or weekend multipliers." },
            { question: "Do I need an inter-state permit for Chennai to Bangalore?", answer: "Yes — Tamil Nadu-registered taxis crossing into Karnataka need a TN-KA inter-state permit (~₹500 cumulative for both ways for a sedan; higher for SUVs). We handle the paperwork at booking and the cost is included in the displayed fare. Border crossing takes 3-5 minutes for taxis with valid permits." },
            { question: "What's the best vehicle for Chennai to Bangalore?", answer: "For solo/2 passengers: sedan at ₹4,850 — most economical. For 3-4 passengers with luggage: SUV at ₹6,580 — better cabin space for the 6-hour drive. For corporate/elderly travellers or 5-7 passengers: Innova Crysta at ₹7,270 — quieter cabin, captain seats (variant-dependent), best long-distance comfort." },
            { question: "Is the route safe at night?", answer: "Yes. NH48 is well-lit through major sections, well-trafficked 24/7 (heavy commercial traffic), and has 24-hour fuel stations and dhabas at Sriperumbudur, Vellore, Krishnagiri, and Hosur. Night charges (₹250-500) apply for trips between 10 PM and 6 AM; popular overnight bookings are 9-10 PM Chennai departure for 4-5 AM Bangalore arrival." },
            { question: "Can I do a same-day Chennai-Bangalore-Chennai trip?", answer: "Possible but tight — 700 km round-trip with 4-5 hours at the destination is a 14-15 hour day. Most travellers prefer at least one overnight halt. For unavoidable same-day round trips, we assign senior drivers and use SUV/Crysta categories for stamina; round-trip pricing is ~1.9× one-way + ₹500 driver halt + night charge if applicable." },
            { question: "What's the best Chennai-Bangalore route — NH48 or NH48-old (Salem)?", answer: "NH48 (Sriperumbudur-Vellore-Krishnagiri-Hosur) is the standard 346 km route — what every operator quotes. The alternate via Salem-Krishnagiri is ~410 km and only used when the direct NH48 is closed (rare). For all standard bookings we route via NH48." },
            { question: "Does the taxi pick up at Chennai Airport (MAA)?", answer: "Yes — MAA airport pickup is one of our most-booked patterns. The airport is 8 km off NH48 (via the GST Road); add ₹200-350 to the city pickup rates for the airport pickup leg. Flight tracking is included; first 60 minutes of waiting after touchdown are free." },
            { question: "Can the taxi drop at Bangalore Airport (KIA) too?", answer: "Yes — KIA Devanahalli is 35 km north of central Bangalore, total ~380 km from Chennai. Sedan ₹5,320; SUV ₹7,220; Crysta ₹7,980. Common booking pattern: 5 AM Chennai departure for 12 PM KIA international flight check-in." },
            { question: "Are there hospital-specific drop options at Bangalore?", answer: "Yes — Manipal Whitefield, Apollo Bannerghatta, Narayana Hrudayalaya, and Fortis Bannerghatta are our four most-frequent hospital drops from Chennai. We assign Innova Crysta by default for hospital bookings where elderly-patient comfort matters; mention 'medical drop' at booking for priority driver assignment and wheelchair-accessible vehicle on request." },
        ],
    },
    "chennai-to-madurai": {
        snippetLede:
            "Chennai to Madurai by taxi is approximately 462 km via NH38 through Tindivanam, Villupuram, Perambalur, Trichy, and Dindigul, taking 7 to 8 hours including a meal halt. One-way drop taxi fares start at ₹6,470 for a sedan, ₹8,780 for an SUV and ₹10,164 for an Innova Crysta — all-inclusive of five toll plazas (~₹450), driver bata (₹600 for the 400+ km trip), Tamil Nadu state permit, and 5% GST.",
        intro:
            "Madurai is one of the oldest continuously inhabited cities in India and the cultural capital of southern Tamil Nadu. The Chennai-Madurai corridor is South India's busiest pilgrimage and family-travel route, dominated by the magnetic pull of the <strong>Meenakshi Amman Temple</strong> — a 14-acre temple complex with 14 gopurams (towers), the largest of which rise 170 feet. Beyond the temple, Madurai offers <strong>Thirumalai Nayakkar Mahal</strong> (a 17th-century Indo-Saracenic palace), the Gandhi Memorial Museum (housing the blood-stained dhoti Gandhi wore when assassinated), and a city culture that wakes early and runs late. The 462 km drive via NH38 is straightforward four-lane highway for most of the length, with the route passing Trichy (the geographic mid-point and lunch stop) and Dindigul (famous for its biryani and steel locks). Most pilgrims combine the route with Madurai → Rameswaram (174 km onward) as part of a Char Dham circuit; corporate travellers fly into Chennai and use this taxi route when Madurai Airport flights are unavailable.",
        bestTime:
            "<strong>Departure timing:</strong> 4:30-6 AM is the most comfortable window — clears Chennai morning traffic, reaches Madurai by 12:30-1 PM for lunch and afternoon Meenakshi darshan (temple closes 12:30-4 PM for ritual cleaning, so a 1 PM arrival lets you check in and rest before the 4 PM reopening). A 10 PM Chennai departure gets you to Madurai by 5 AM — popular for early-morning Suprabhatam darshan and the Aadi/Pongal festival rushes. <strong>Best season:</strong> November-February (cool, 22-28°C, dry). October has retreating-monsoon character. April-June is hot (35-40°C in Madurai) but the route operates without issue. <strong>Festival peaks:</strong> Chithirai Festival (April-May, 10-day temple festival drawing 1 million+ pilgrims), Pongal (mid-January), Aadi (mid-July to mid-August). Book 30-45 days ahead during these windows.",
        sampleTimeline: [
            { time: "5:00 AM", activity: "Pickup from Chennai (airport, T Nagar, Adyar, Anna Nagar, Velachery, OMR, ECR, Tambaram, or your hotel)." },
            { time: "6:00 AM (+1 hr)", activity: "Clear Tambaram and join NH38. Highway driving begins." },
            { time: "7:30 AM (+2.5 hrs)", activity: "Tindivanam (120 km) — first major service break. Food courts on both sides of the highway, restrooms, fuel." },
            { time: "9:00 AM (+4 hrs)", activity: "Perambalur (255 km) — brief restroom + tea halt. Highway-quality dhabas." },
            { time: "10:30 AM (+5.5 hrs)", activity: "Trichy (325 km) — major lunch halt. Saravana Bhavan, A2B, or local hotels near the highway exit. 30-45 minute halt. Rockfort Temple visible from highway." },
            { time: "12:00 PM (+7 hrs)", activity: "Dindigul (415 km) — optional Dindigul biryani halt. 15-minute window." },
            { time: "12:30-1:00 PM (+7.5-8 hrs)", activity: "Arrive Madurai. Drop at Meenakshi Temple area, Madurai Junction, Madurai Airport, your hotel, or any city address." },
        ],
        dropPoints: [
            "Meenakshi Amman Temple area (Mela Veli Street, North Masi Street)",
            "Madurai Airport (IXM, 12 km from city centre)",
            "Madurai Junction Railway Station (Periyar bus terminus)",
            "Mattuthavani Integrated Bus Stand (north-east Madurai)",
            "Periyar Bus Stand (city centre, walking distance to Meenakshi Temple)",
            "Hotels near Meenakshi Temple: Heritage Madurai, Hotel Sangam, Madurai Residency, JC Residency, Hotel Park Plaza",
            "KK Nagar, Anna Nagar, Thallakulam, Goripalayam (residential suburbs)",
            "Thirumangalam, Avaniyapuram, Sholavandan, Vadipatti (outlying suburbs)",
            "Gandhi Memorial Museum (Tamukkam area)",
            "Thirumalai Nayakkar Mahal (Palace Road)",
            "Madurai Medical College and Hospital (Government complex)",
            "Apollo Speciality Hospitals (KK Nagar)",
        ],
        routeHighlights: [
            { title: "NH38 (renumbered NH45)", detail: "The full Chennai-Madurai-Kanyakumari spine — four-lane divided highway with toll-grade surface for almost all of the Chennai-Trichy section and very good two-to-four-lane mix from Trichy to Madurai. Heavy commercial traffic 24/7 keeps the highway lit and serviced overnight." },
            { title: "Tindivanam (120 km)", detail: "First major service-break town — A2B, Saravana Bhavan, KFC, multiple sit-down restaurants on both highway sides. Restroom-only halts also fine. The Tindivanam-Villupuram stretch is the busiest commercial section." },
            { title: "Trichy bypass (325 km)", detail: "The midpoint and the natural lunch stop. Trichy itself is bypassed by NH38 — visible from the highway are the Rockfort Temple atop the granite outcrop and the Ranganathaswamy Temple in Srirangam. Most drivers will accept a 30-45 minute lunch halt here; common picks: Saravana Bhavan, A2B, or local Kongu Vellala Gounder-style hotels." },
            { title: "Dindigul (415 km)", detail: "Famous for two things — Dindigul biryani (a distinctive variant cooked with seeraga samba rice and small-grain marination) and Dindigul steel locks. The highway bypasses the town; a brief 15-minute biryani halt is doable for non-veg eaters." },
            { title: "Madurai approach via Vadipatti", detail: "The final 30 km from Vadipatti into Madurai city is the slowest section — agricultural belt, narrow approach, and Madurai city traffic from Goripalayam onwards. Plan for 45-60 minutes inside Madurai depending on your exact drop address." },
            { title: "Five toll plazas (all in your fare)", detail: "Vandalur (Chennai exit), Tappur (Tindivanam stretch), Sengaliyappar (Villupuram-Perambalur), Manaparai (Trichy-Dindigul), Vadipatti (Madurai approach). Combined ~₹450 one-way for a sedan, paid via our corporate FASTag account." },
        ],
        foodStops: [
            { title: "Tindivanam (120 km, 2.5 hrs in)", detail: "Highway food courts at the Tindivanam bypass — A2B (pure-veg), Saravana Bhavan (pure-veg), KFC, McDonald's. Clean restrooms, ATMs, fuel. 15-30 minute halt typical for breakfast." },
            { title: "Trichy (325 km, the lunch stop)", detail: "The natural mid-point. Saravana Bhavan, A2B, and Hotel Sangam (Trichy) on the highway exit. Local picks: Vasanta Bhavan, Hotel Femina near junction. Many drivers know the trustworthy non-veg picks — Hotel Sangam has good biryani. 30-45 minutes." },
            { title: "Dindigul biryani halt (415 km, optional)", detail: "Venu Biryani, Thalapakatti Biryani (originated in Dindigul), and Ponram Biryani are the famous picks. Quick 15-20 minute halt for a biryani parcel-or-eat. The biryani uses the small-grain seeraga samba rice — distinctive flavour." },
            { title: "Madurai arrival options", detail: "Murugan Idli Shop (multiple branches in Madurai — the city's idli legend, ₹50-100 plates), Hotel Modern (Indo-Chinese), Konar Kadai (Tamil meals), and the small jigarthanda stalls near Meenakshi Temple are the must-try arrival picks. Most hotels also have in-house dining." },
        ],
        vehicleGuidance:
            "The 462 km Chennai-Madurai run takes 7-8 hours — comfort matters more than capability. <strong>Sedans (Etios/Dzire)</strong> at ₹6,470 are the most-booked option for 2-3 passengers with moderate luggage; perfectly adequate for the highway run. <strong>Etios</strong> (same ₹14/km) gives extra boot space for full luggage. <strong>SUVs (Ertiga/Innova)</strong> at ₹8,780 are the family pick for 4-7 passengers — better seating height for elderly relatives, more luggage, and the option to recline on the long stretch. <strong>Innova</strong> at ₹9,240 is the standard pilgrim-group pick for 6-7 passengers with temple offerings and a 7-hour ride. <strong>Innova Crysta</strong> at ₹10,164 is the premium choice — captain seats in the variant, smoother suspension on the slightly older Trichy-Dindigul stretch, quieter cabin for elderly travellers. <strong>Tempo Travellers</strong> are common for wedding parties, college reunions, and 10-15 person pilgrim groups — call for a quote. <strong>Luxury Mercedes/BMW</strong> for VIP corporate or wedding-VIP pickups arriving by Chennai Airport. <strong>Diesel preferred</strong> for the long-haul fuel economy.",
        monsoonAdvisory:
            "<strong>Northeast monsoon (October-December):</strong> the primary rainfall window for the Chennai-Madurai corridor. Chennai-side stretch (Sriperumbudur to Tindivanam) can experience flooding during cyclone events; we monitor IMD warnings and reschedule rather than route-around if a cyclone landfall is forecast for the Chennai or Cuddalore coast. The Trichy bypass occasionally has waterlogged sections during heavy rains (1-2 hour delays, not closures). <strong>Southwest monsoon (June-September):</strong> minimal impact on this corridor — short showers, cooler 28-32°C climate, good driving weather. <strong>March-June (peak summer):</strong> 35-40°C in the Madurai-Dindigul belt; route operates without issue, AC keeps the cabin comfortable. <strong>December-February:</strong> ideal — 22-28°C, dry, smooth. <strong>Festival surges:</strong> Chithirai (April-May), Pongal (January), Aadi (July-August) cause Madurai-side traffic congestion; book 30-45 days ahead.",
        multiDayPackage:
            "For pilgrim circuits combining Madurai with Rameswaram and Kanyakumari, our <strong>multi-day Char Dham package</strong> uses the same vehicle and driver throughout. Includes daily 250 km kilometre allowance, driver bata (₹600/day for the long-haul tier), night halt charges (₹400-600 per night), tolls, GST. <strong>Day 1:</strong> Chennai → Madurai (462 km, 7-8 hrs). Evening Meenakshi darshan + temple corridor walk. <strong>Day 2:</strong> Madurai → Rameswaram (174 km, 3.5 hrs) via Pamban Bridge. Agni Theertham bath, Ramanathaswamy temple, Dhanushkodi Point. Optional return to Madurai for the night, or onward halt at Rameswaram. <strong>Day 3:</strong> Rameswaram → Kanyakumari (300 km, 6 hrs) or return Chennai. <strong>Sedan package ~₹22,000-25,000, SUV ~₹30,000-33,000, Crysta ~₹35,000-38,000 for the 3-day circuit</strong> — call for an exact quote based on your route and night halts.",
        destinationGuide: [
            { title: "Meenakshi Amman Temple", detail: "The city's heart — a 14-acre temple complex with 14 gopurams, 33,000 sculptures, and the iconic Hall of Thousand Pillars. The temple is dedicated to Meenakshi (Parvati) and Sundareswarar (Shiva). <strong>Timings:</strong> 5 AM-12:30 PM and 4 PM-10 PM (closed 12:30-4 PM for ritual cleaning). <strong>Free entry, ₹50 for the camera permit.</strong> Mandatory dress code: dhoti for men in some shrines, no shorts. Allow 3-4 hours for a full visit. The pre-dawn Suprabhatam (5 AM) and the evening palki procession (9:30 PM) are the photo moments." },
            { title: "Thirumalai Nayakkar Mahal", detail: "Built 1636 by Madurai's Nayak ruler — Indo-Saracenic palace with 248 large pillars and a 75-foot domed celestial pavilion. Sound and light show in the evenings narrating the Silappadikaram epic (₹20-30 per person). Open 9 AM-1 PM and 2 PM-5 PM. ₹50 entry per Indian. 60-90 minutes." },
            { title: "Gandhi Memorial Museum", detail: "In Tamukkam district, near the Madurai Race Course. Houses the blood-stained dhoti Gandhi wore at the time of his assassination — a powerful artefact. Photographic exhibits trace the freedom struggle. Open 10 AM-5:45 PM, closed Friday. Free entry. Allow 60-90 minutes." },
            { title: "Vaigai Dam and River boating", detail: "55 km north-west of Madurai on the way to Kodaikanal. Vaigai Dam reservoir offers boating and a small garden. Half-day side trip; combines well with a Kodaikanal stopover. ₹50 entry, boating ₹100-200." },
            { title: "Kazimar Big Mosque", detail: "300+ year old historic mosque in the Kazimar street area — one of the oldest in Tamil Nadu. Open during prayer times for non-Muslim visitors; modest dress required. 30-minute halt." },
            { title: "Murugan Idli Shop and Konar Kadai", detail: "The Madurai food trail — Murugan Idli (multiple branches; the Goripalayam outlet is iconic), Konar Kadai for Tamil meals on banana leaves, and the jigarthanda stalls near Meenakshi Temple (Madurai's signature cold dessert). ₹50-300 typical bill." },
            { title: "Alagar Koyil (Azhagar Temple)", detail: "21 km north-east of Madurai — temple of Vishnu (Sundara Rajan) on a hilltop. Famous for the Chithirai Festival's procession of Lord Kallazhagar entering the Vaigai. Open 5 AM-12 PM and 4 PM-9 PM. Free entry. 60-90 minute side trip." },
        ],
        customFaqs: [
            { question: "What is the Chennai to Madurai distance?", answer: "Chennai to Madurai is approximately 462 km by road via NH38 through Tindivanam, Villupuram, Perambalur, Trichy, and Dindigul. The straight-line air distance is shorter (~425 km) but the road follows the four-lane highway alignment via Trichy." },
            { question: "How long does the Chennai to Madurai drive take?", answer: "About 7 to 8 hours for the 462 km drive, including a 30-45 minute lunch halt at Trichy (the natural mid-point). Departure timing matters — a 5 AM Chennai exit reaches Madurai by 12:30-1 PM. A 10 PM departure gets you to Madurai by 5 AM for early-morning Suprabhatam darshan." },
            { question: "How much is a Chennai to Madurai taxi fare?", answer: "₹6,470 all-inclusive for a sedan (Etios/Dzire) — 462 km × ₹14/km, with tolls (~₹450 across 5 plazas), ₹600 driver bata for the 400+ km long-haul tier, Tamil Nadu state permit, and 5% GST baked in. Mini ₹6,006, SUV (Ertiga/Innova) ₹8,780, Innova (carrier) ₹9,240, Innova Crysta ₹10,164. Tempo Traveller and Luxury (Mercedes/BMW) on request." },
            { question: "What does 'all-inclusive' mean for this route?", answer: "Your quoted ₹6,470 covers all five toll plazas (Vandalur, Tappur, Sengaliyappar, Manaparai, Vadipatti), the ₹600 driver bata, Tamil Nadu state permit, and 5% GST. Nothing is added at the drop point. Only optional add-ons (Madurai Airport entry fee ₹70, private property parking, waiting beyond the 30-minute free buffer, additional stops) are billed if used. See our /all-inclusive-pricing page for the full breakdown." },
            { question: "Which vehicle is best — sedan or Innova for this trip?", answer: "Sedan (₹6,468) is ideal for 2-3 passengers with one suitcase plus cabin bags. Etios (same rate) gives extra boot space. SUV (₹8,780) is the family pick for 4-7 passengers with full luggage. Innova (₹9,240) is the pilgrim-group choice for 6-7 passengers and 7-hour comfort. Innova Crysta (₹10,164) adds captain seats and the smoothest ride for elderly travellers. For 10+ passengers (wedding parties, college reunions), book a Tempo Traveller." },
            { question: "Can I stop at Trichy on the way?", answer: "Yes — a 30-45 minute lunch halt at Trichy is the standard pattern on this route. Saravana Bhavan and A2B near the highway exit are reliable picks; Hotel Sangam offers good biryani. Longer sightseeing detours (Rockfort Temple, Srirangam Ranganathaswamy) are billed at the per-km rate of the diversion." },
            { question: "Is night travel safe on NH38?", answer: "Yes. NH38 is a major commercial corridor with heavy 24/7 truck traffic, well-lit highway sections, and fuel/dhaba availability throughout. Our drivers are NH38-experienced for night runs. Common overnight booking: 10 PM Chennai departure for 5-6 AM Madurai arrival, popular for Aadi and Pongal temple visits. Night charges (₹250-500) apply for trips between 10 PM and 6 AM." },
            { question: "How do I get a GST invoice for corporate billing?", answer: "GST is already in your ₹6,470 fare. Share your company name and GSTIN at booking; we email the GST-compliant invoice within 24 hours of trip completion. Corporate volume bookings (5+ trips/month) can request a monthly consolidated invoice with itemised trip details." },
            { question: "Can I book an early-morning trip for Meenakshi temple darshan?", answer: "Yes. A 10 PM Chennai departure gets you to Madurai by 5 AM, in time for the 5:30 AM Suprabhatam darshan. The driver can wait while you complete darshan if you pre-book a half-day package with a 3-4 hour Madurai halt. Pure-drop bookings end at the temple address; the driver returns separately." },
            { question: "Is one-way taxi cheaper than Ola/Uber Outstation for Chennai-Madurai?", answer: "Yes — Ola and Uber Outstation typically bill round-trip even for a one-way need, which doubles the cost. Our one-way drop is ₹6,470 vs their ₹11,000-13,000 round-trip equivalent. Our fares are fixed, all-inclusive, with no surge pricing — what you see at booking is what you pay at drop." },
        ],
    },
    "chennai-to-tirupati": {
        snippetLede:
            "Chennai to Tirupati by taxi is approximately 135 km via NH716 through Tiruvallur, Tiruttani, and Renigunta, taking about 3 hours. One-way drop taxi fares start at ₹1,890 for a sedan, ₹2,565 for an SUV and ₹2,970 for an Innova Crysta — all-inclusive of tolls (~₹120 across 2 plazas), driver bata, and 5% GST. Tirumala hill permit (₹200) is the only optional add-on for vehicles continuing uphill from Alipiri to the temple complex.",
        intro:
            "Tirupati is the gateway to <strong>Tirumala</strong> — the 853-metre hilltop home of Lord Venkateswara and one of the most-visited religious shrines in the world (50,000-100,000 pilgrims on a normal day; up to 500,000 during Brahmotsavam). The Chennai-Tirupati corridor is the dominant feeder route from Tamil Nadu; the 135 km drive via NH716 through Tiruttani's Murugan temple area takes 3 hours of straightforward four-lane highway. <strong>Critical distinction:</strong> Tirupati is the base town in Chittoor district, Andhra Pradesh; Tirumala is the temple complex 22 km uphill on a separate ghat road. Most taxi drops happen at <strong>Alipiri</strong> — the foot of the hills, where free TTD biometric hill darshan registration is issued. Vehicles continuing uphill to Tirumala need a ₹200 TTD hill permit (paid at Alipiri gate, separate from your base fare). Plan your darshan type ahead: free Sarva Darshan (4-12 hr queue), ₹300 Special Entry Darshan (1-3 hr, pre-book 60 days via tirupatibalaji.ap.gov.in), or paid Sevas like Suprabhatam (3 AM).",
        bestTime:
            "<strong>Departure timing:</strong> <strong>3 AM</strong> for the Suprabhatam Seva (6 AM Tirumala arrival, pre-booked 60 days ahead). <strong>4-5 AM</strong> for early Sarva Darshan (7-8 AM Alipiri arrival, register hill darshan, reach Tirumala by 9-10 AM, complete darshan by noon). <strong>10 PM departure</strong> for overnight pilgrims (1 AM Alipiri arrival, register early, 4 AM-6 AM darshan queue start). <strong>Avoid:</strong> Friday-Sunday peak weekends — Alipiri queues can stretch 24+ hours; pre-book SED slots. <strong>Festival blackouts:</strong> Brahmotsavam (Sep-Oct annual, 9 days) and Vaikunta Ekadasi (Dec-Jan single day) — book 30-45 days ahead; expect 18-24 hr darshan queues even with SED. <strong>Best season for the drive itself:</strong> November-February (cool, 24-28°C). Northeast monsoon (Oct-Dec) brings occasional Chennai-side rain; route operates without closures.",
        sampleTimeline: [
            { time: "4:00 AM", activity: "Pickup from Chennai (airport, T Nagar, Adyar, Anna Nagar, Velachery, OMR, ECR, Tambaram, or your hotel). Driver arrives 15 minutes early." },
            { time: "5:00 AM (+1 hr)", activity: "Periyapalayam toll plaza. Quick fuel/restroom halt if needed." },
            { time: "5:45 AM (+1 hr 45 min)", activity: "Tiruttani (75 km) — major Murugan temple town, optional 30-minute halt if combining temple visits." },
            { time: "6:30 AM (+2.5 hrs)", activity: "Nagari, Puttur — Andhra Pradesh entry. Renigunta toll plaza." },
            { time: "7:00 AM (+3 hrs)", activity: "Arrive Alipiri checkpoint (foot of Tirumala hills). Free TTD hill darshan registration here — biometric + photo capture. 30-45 min queue." },
            { time: "7:45 AM (+3 hrs 45 min)", activity: "If pre-arranged for uphill drop: pay ₹200 TTD hill permit at Alipiri gate, drive 22 km / 45 min ghat road to Tirumala. If standard Alipiri drop: trip ends; pilgrim takes TTD bus or auto uphill." },
            { time: "8:30 AM (+4.5 hrs)", activity: "Tirumala arrival. Vaikuntham Q complex, dress check, darshan queue." },
        ],
        dropPoints: [
            "Alipiri checkpoint (default — free TTD hill darshan registration here)",
            "Tirumala temple complex (₹200 hill permit required, pre-arrange with driver)",
            "Tirupati Railway Station (main town, opposite RTC bus stand)",
            "Tirupati RTC Central Bus Stand",
            "Tirupati Airport (Renigunta TIR, 15 km from Tirupati town)",
            "TTD Cottages near Tirumala (advance booking required via TTD)",
            "Padmavathi Devi Temple, Tiruchanur (5 km from Tirupati — Sri Padmavathi is Lord Venkateswara's consort)",
            "Sri Govindaraja Swamy Temple, Tirupati town",
            "Hotels near Tirupati Bus Stand — Marasa Sarovar, Bliss Hotel, Hotel Tirumala, Minerva Grand",
            "Kanipakam Ganesha Temple (50 km onward — pilgrim circuit extension)",
            "Sri Kalahasti Temple (35 km onward — Vayu Sthala, one of Pancha Bhoota Stalas)",
        ],
        routeHighlights: [
            { title: "NH716 (formerly NH205)", detail: "Four-lane divided highway from Chennai (Periyapalayam) to Renigunta. The first 80 km is Tamil Nadu side through Tiruvallur and Tiruttani; the final 55 km crosses into Andhra Pradesh's Chittoor district. Surface is consistently good; toll-grade quality." },
            { title: "Tiruttani Murugan Temple (75 km)", detail: "One of the six abodes of Lord Murugan (Arupadai Veedu). Many pilgrims combine the route with a 30-minute Tiruttani halt — the temple is on a small hillock at the highway's edge. Open 5:30 AM-1 PM and 4 PM-8:30 PM. Free entry; small ₹50 abhishekam tickets available." },
            { title: "Alipiri checkpoint", detail: "The pivot point of every Tirupati pilgrimage. Free TTD biometric darshan registration issued here — biometric is mandatory for all hill visits since 2017. The Galigopuram pedestrian path (3,550 steps to Tirumala) also starts here for traditional pilgrims doing the climb on foot. Free; allow 30-90 min for registration queue depending on time of day." },
            { title: "Two toll plazas (in your fare)", detail: "Periyapalayam (Chennai-Tiruttani direction, ~₹70 sedan) and Renigunta (Andhra entry, ~₹50 sedan). Combined ~₹120 — already in the quoted fare via our corporate FASTag account." },
            { title: "Tirumala ghat road", detail: "22 km from Alipiri to Tirumala temple complex, climbing from 200 m to 853 m through 13 hairpin bends. Takes 45 minutes. Vehicle entry requires the ₹200 TTD hill permit (NOT in base fare). Permit-holding taxis can drop right at the temple gates; non-permit taxis drop at Alipiri only." },
            { title: "Renigunta junction", detail: "120 km from Chennai — Tirupati's railway hub and the location of Tirupati Airport (TIR). Many flight pilgrims book Chennai → Tirupati Airport one-way drops, then take the 15-min TTD bus uphill from Tirupati to Tirumala." },
        ],
        foodStops: [
            { title: "Periyapalayam (35 km)", detail: "First major service halt on NH716 — A2B and small Tamil meals hotels. 15-minute breakfast halt typical for 4-5 AM Chennai departures." },
            { title: "Tiruttani (75 km)", detail: "Many small temple-pilgrim restaurants serving pure-veg South Indian. The 'temple meals' tradition — banana-leaf thali for ₹80-150. Most drivers know reliable picks; combine with the optional Murugan temple visit." },
            { title: "Renigunta / Tirupati town (130 km arrival)", detail: "Saravana Bhavan Tirupati, Komala Vilas, and the TTD-run cottages have in-house dining. For Tirumala pilgrims, the temple complex itself serves free TTD meals (Annaprasadam) — open lunch 12 PM-3 PM, dinner 7 PM-10 PM. The famous Tirupati Laddu prasadam is given as 2-laddu set per person after darshan at ₹50 total." },
            { title: "Inside Tirumala temple complex", detail: "Free Annaprasadam meals at TTD bhojanasala (3 sittings — breakfast, lunch, dinner). Quality is consistent and clean; no rush. The free meals are open to all darshan pilgrims regardless of seva class." },
        ],
        vehicleGuidance:
            "The 135 km Chennai-Tirupati drive is short and comfortable — vehicle choice depends on pilgrim group size and comfort priority. <strong>Sedans (Etios/Dzire)</strong> at ₹1,890 are the most-booked for 2-3 pilgrims with light luggage. <strong>SUVs (Ertiga/Innova)</strong> at ₹2,565 are the family pick for 4-7 pilgrims carrying offerings, dhotis (mandatory dress at Tirumala), and the prasadam containers people bring back. <strong>Innova Crysta</strong> at ₹2,970 is the preferred choice for <strong>elderly pilgrims</strong> — quieter cabin matters on the 3 AM Suprabhatam runs and the early-morning Alipiri queues take a toll. <strong>Tempo Travellers</strong> are common for 10-15 pilgrim parties (residential association tours, extended-family circuits). For <strong>Tirumala uphill drop</strong> (skipping Alipiri-only): arrange the ₹200 hill permit at booking; not all our vehicles have hill permit pre-paid, so confirm 24 hours ahead. <strong>Diesel preferred</strong> for the climb if going uphill — the 22 km ghat has 13 hairpin bends but is gentle compared to Ooty or Kodaikanal.",
        monsoonAdvisory:
            "<strong>Northeast monsoon (October-December):</strong> moderate impact — Chennai-side stretch (Periyapalayam direction) can have occasional waterlogged sections during heavy rains; we monitor IMD warnings. The Tirupati-side approach (Renigunta, Alipiri) is generally drier and less affected. <strong>Brahmotsavam season (September-October, 9-day festival):</strong> peak pilgrim surge. Alipiri queues stretch 24+ hours; SED slots fill 60 days ahead. Book 30-45 days early; expect Tirumala uphill traffic restrictions. <strong>Vaikunta Ekadasi (December-January, single day):</strong> the most-crowded day of the year. Some operators decline same-day Chennai bookings; we run them but flag 8-12 hour Alipiri queues even with SED. <strong>March-June (peak summer):</strong> hot at Tirupati base (38-42°C) but cooler 28-32°C at Tirumala's 853 m altitude. <strong>Best darshan season:</strong> January (post-Vaikunta Ekadasi calm), February-March (cool, dry, manageable queues).",
        multiDayPackage:
            "For combined pilgrim circuits, our <strong>multi-day Tirupati package</strong> uses the same vehicle and driver throughout. Includes daily 250 km kilometre allowance, driver bata (₹400/day for standard tier under 400 km), night halt charges (₹400-500 per night), tolls, GST. <strong>2-day Tirupati + Padmavathi:</strong> Day 1 Chennai → Tirupati → Alipiri darshan registration → Tirumala darshan → Tirupati halt. Day 2 Padmavathi Devi Temple (Tiruchanur) → return Chennai. Sedan ~₹6,500, Innova ~₹9,500. <strong>3-day Pancha Sthala circuit:</strong> Chennai → Tirupati → Tirumala → Kanipakam Ganesha → Sri Kalahasti → Srikalahasti → return. Sedan ~₹10,000, Innova ~₹14,000. <strong>1-day combo Chennai → Tirupati → Kanchipuram → Chennai:</strong> 350 km round-trip with two temples. Sedan ~₹6,500, Innova ~₹9,500.",
        destinationGuide: [
            { title: "Tirumala Sri Venkateswara Swamy Temple", detail: "The main shrine atop the hills, dedicated to Lord Venkateswara (Balaji, Srinivasa). <strong>Darshan options:</strong> Sarva Darshan (free, 4-12 hr queue), Special Entry Darshan SED (₹300, 1-3 hr, pre-book 60 days online), Suprabhatam Seva (3 AM, ₹120, advance booking). <strong>Dress code strict:</strong> men in dhoti or pant-shirt, women in saree or salwar — no shorts, no jeans, no skirts above ankle. Foreigners declaration form required. <strong>Laddu prasad</strong> ₹50 per 2-laddu set, 2-set cap per person. Allow 4-12 hours total depending on darshan type and queue length." },
            { title: "Padmavathi Devi Temple, Tiruchanur", detail: "5 km from Tirupati town. Sri Padmavathi is Lord Venkateswara's consort; traditional pilgrim wisdom says darshan here is incomplete without first visiting Padmavathi. Less crowded than Tirumala; 30-60 minute queue typical. Open 4:30 AM-9 PM. Free entry; ₹100 archana tickets." },
            { title: "Sri Govindaraja Swamy Temple, Tirupati", detail: "In Tirupati town, dedicated to Govindaraja (reclining Vishnu). One of the largest temple complexes in Tirupati; popular for families with limited time who skip the Tirumala uphill trip. Open 5 AM-1 PM and 3 PM-9 PM. Free entry." },
            { title: "Kapila Theertham", detail: "3 km from Tirupati town, at the base of the Tirumala hills. Lord Shiva temple with a small natural waterfall and sacred tank. Less crowded; brief 30-minute halt. Open 5 AM-9 PM. Free." },
            { title: "Sri Kalahasti Temple (35 km onward)", detail: "One of the Pancha Bhoota Stalas (Vayu element). Famous for Rahu-Ketu Pooja for those with astrological doshams. 90-minute drive from Tirupati; combine on day 2 of a multi-day package." },
            { title: "Kanipakam Vinayaka Temple (50 km)", detail: "Famous self-manifested Ganesha temple. The deity is believed to be growing in size each year. Open 4 AM-9 PM. Popular as a first-stop pilgrim circuit start." },
            { title: "TTD Hill Cottages and Choultries", detail: "TTD runs accommodation at Tirumala for pilgrims — rooms from ₹200 dorms to ₹1,500 deluxe. Advance booking required via tirupatibalaji.ap.gov.in; demand exceeds supply during festivals. Free annaprasadam meals included." },
        ],
        customFaqs: [
            { question: "What is the Chennai to Tirupati distance?", answer: "Chennai to Tirupati town is approximately 135 km via NH716 through Tiruvallur, Tiruttani, and Renigunta. Tirumala — the hilltop temple — is an additional 22 km uphill from Tirupati via the ghat road from Alipiri." },
            { question: "How long does the Chennai to Tirupati drive take?", answer: "About 3 hours from central Chennai to Tirupati / Alipiri. Add 45 minutes for the 22 km ghat climb to Tirumala if your vehicle has the TTD hill permit. Plan an additional 30-90 minutes at Alipiri for the free hill darshan registration (biometric + photo capture mandatory since 2017)." },
            { question: "How much is a Chennai to Tirupati taxi?", answer: "₹1,890 all-inclusive for a sedan (Etios/Dzire) — 135 km × ₹14/km, with tolls (~₹120 across 2 plazas), ₹400 driver bata, 5% GST baked in. Mini ₹1,755, SUV (Ertiga/Innova) ₹2,565, Innova (carrier) ₹2,700, Innova Crysta ₹2,970. TTD hill permit (₹200) is the only optional add-on if your vehicle goes uphill to Tirumala — not in the base fare." },
            { question: "What's the difference between Alipiri drop and Tirumala drop?", answer: "Alipiri is the foot of the Tirumala hills — free TTD hill darshan registration is issued here, and most pilgrims complete biometric capture before continuing uphill. From Alipiri, you can either take the free TTD bus uphill (every 5-10 min), walk the 3,550-step pedestrian path, or have your taxi continue uphill if pre-arranged. Tirumala drop means your vehicle continues 22 km uphill — requires a ₹200 TTD hill permit (paid at Alipiri gate, not in base fare). Most Chennai-side bookings drop at Alipiri unless specifically arranged for uphill drop." },
            { question: "Can the taxi wait at Alipiri or Tirumala while we complete darshan?", answer: "Yes — for round-trip bookings. Driver halt charge ₹150-250/hour beyond the free 30-minute buffer; many pilgrim round-trips book with a 6-10 hour halt covering registration + darshan queue + return. For Suprabhatam Seva (3 AM Chennai pickup → 6 AM Tirumala), drivers typically wait at Alipiri/Tirumala until your darshan completes and drive you back to Chennai by afternoon." },
            { question: "Which vehicle is best for elderly pilgrims?", answer: "Innova Crysta (₹2,970) is the preferred pick for elderly parents/grandparents — quieter cabin, captain seats in the variant, smoother suspension for the 3-hour drive and the 22 km ghat climb. SUV (₹2,565) is the next choice if budget matters. Avoid Mini and Sedan for elderly groups carrying offerings — boot space is tight." },
            { question: "Are there toll plazas on the route?", answer: "Two: Periyapalayam (Chennai-Tiruttani direction, ~₹70 sedan) and Renigunta (Andhra entry, ~₹50). Combined ~₹120 — already in your quoted fare via our corporate FASTag account. No extra payment from you." },
            { question: "What's the dress code for Tirumala?", answer: "Strict traditional dress mandatory at Tirumala temple complex. Men: dhoti or pant-shirt (no shorts, no bermudas, no tank tops). Women: saree or salwar-kameez (no jeans, no skirts above ankle, no sleeveless tops). Many pilgrim shops at Alipiri rent dhotis for ₹50-100 if you arrive in unsuitable clothing. Foreigners must sign a declaration form at the Vaikuntham Q complex affirming faith in Lord Venkateswara." },
            { question: "How do I get a Sarva or Special Entry Darshan slot?", answer: "Sarva Darshan (free) — no advance booking, just queue at Tirumala. Queue time varies: 4-6 hours on weekdays, 8-12 hours on weekends, 18-24 hours during Brahmotsavam and Vaikunta Ekadasi. Special Entry Darshan (₹300/person, 1-3 hr queue) — pre-book online at tirupatibalaji.ap.gov.in 60 days ahead. Suprabhatam Seva (3 AM start, ₹120) — also pre-book via TTD website, daily slots limited to ~80 pilgrims." },
            { question: "Can I do same-day Chennai-Tirupati-Chennai?", answer: "Absolutely — same-day round-trips are the most common booking pattern. Typical plan: 4 AM Chennai pickup → 7 AM Alipiri arrival → register hill darshan → 9 AM Tirumala → 11 AM darshan + laddu → 12 PM lunch (free Annaprasadam) → 1:30 PM Tirumala departure → 5 PM Chennai. Book round-trip; pricing is roughly 2× one-way + driver halt charge for 6-8 hours at the destination. Crysta or Innova recommended for elderly travellers on this long day." },
        ],
    },
    "coimbatore-to-ooty": {
        snippetLede:
            "Coimbatore to Ooty by taxi is approximately 86 km via NH181 through Mettupalayam, with the famous 36-hairpin-bend ghat road climbing from Mettupalayam to Coonoor and Ooty. The drive takes 2.5 to 3 hours. One-way drop taxi fares start at ₹1,200 for a sedan, ₹1,640 for an SUV and ₹1,810 for an Innova Crysta — all-inclusive of tolls, driver bata and GST.",
        intro:
            "Ooty (officially Udhagamandalam) is the 'Queen of Hill Stations' — the British-era summer capital of the Madras Presidency, sitting at 2,240 metres in the Nilgiri Mountains. The Coimbatore-Ooty route is one of South India's most-photographed drives, with the climb from Mettupalayam to Coonoor running 36 hairpin bends through eucalyptus and shola forests. The route shares its alignment with the UNESCO-listed <strong>Nilgiri Mountain Railway</strong> (the 'toy train'), which you'll see crossing the road and snaking up the mountain at several points. Travellers from Kerala (especially Wayanad and Kochi) often route via Coimbatore for the Ooty drive because the Mettupalayam ghat is gentler than the alternative Gudalur ghat from Wayanad.",
        bestTime:
            "<strong>Departure timing:</strong> 6-8 AM is ideal — clear of Coimbatore traffic, beats the afternoon mist that often envelopes the ghat from 2 PM onwards. Avoid 4 PM-7 PM weekend departures (school-and-tourist exodus from Ooty). <strong>Best season:</strong> March-June (peak summer escape from plains, best weather), September-November (post-monsoon clarity, fewer crowds), December-January (cold, occasionally frosty mornings). <strong>Avoid:</strong> July-August peak monsoon (ghat fog reduces visibility, occasional landslide closures), and the school-holiday weeks of April-May (heavy traffic, accommodation pricing 2-3x normal). The route is operational year-round; we monitor IMD warnings during monsoon.",
        sampleTimeline: [
            { time: "7:00 AM", activity: "Pickup from Coimbatore (CJB airport, Gandhipuram, RS Puram, Saibaba Colony, junction, or your hotel)." },
            { time: "8:00 AM (+1 hr)", activity: "Reach Mettupalayam (35 km) — base of the Nilgiri ghat. Last fuel and good restaurants before the climb." },
            { time: "8:15 AM (+1 hr 15 min)", activity: "Begin the 36-hairpin ghat climb. Eucalyptus forest, monkeys at viewpoints, and Nilgiri Mountain Railway tracks visible. Most drivers cruise at 25-35 km/h on the climb." },
            { time: "9:00 AM (+2 hrs)", activity: "Reach Coonoor — the lower of the two main hill towns. Tea estates, Sim's Park, and the Lamb's Rock viewpoint. Optional 30-minute halt." },
            { time: "9:45 AM (+2 hrs 45 min)", activity: "Continue the gentler climb from Coonoor to Ooty (18 km). Wenlock Downs and the Ooty Lake become visible." },
            { time: "10:00 AM (+3 hrs)", activity: "Arrive Ooty. Drop at Ooty Lake, Botanical Gardens, Doddabetta peak, Charing Cross, or your booked hotel/resort address." },
        ],
        dropPoints: [
            "Ooty town centre (Charing Cross / Bus Stand)",
            "Ooty Lake and Boat House",
            "Government Botanical Gardens",
            "Doddabetta Peak (10 km from town, highest in Nilgiris)",
            "Coonoor (alternate drop — 18 km below Ooty)",
            "Hotels and resorts: Taj Savoy, Sterling Ooty Elk Hill, Welcom Heritage Fern Hill",
            "Wenlock Downs / Ooty Golf Course",
            "Pykara Falls and Lake (20 km from Ooty)",
        ],
        routeHighlights: [
            { title: "NH181 (Coimbatore-Ooty national highway)", detail: "Generally smooth two-lane road with the famous 36-hairpin-bend ghat section between Mettupalayam and Coonoor. Surface is well-maintained except for occasional monsoon-season patches near the higher elevations." },
            { title: "Mettupalayam (35 km)", detail: "Base of the Nilgiri ghat. The Mettupalayam Railway Station is the starting point of the UNESCO-listed Nilgiri Mountain Railway (toy train) to Ooty — many travellers combine a one-way taxi to Mettupalayam with a one-way toy-train return for the full Nilgiri experience." },
            { title: "36 hairpin bends", detail: "The signature driving experience of the route. Each bend is numbered with milestone markers. Eucalyptus and shola forest line the road; monkey troops at several viewpoints; and the Nilgiri Mountain Railway crosses the road at multiple points. Speed limits are 30-40 km/h enforced." },
            { title: "Hillgrove and Adderley railway crossings", detail: "Two photogenic spots where the toy train crosses the road on the climb. Drivers often pause for 5 minutes if a train is approaching — a popular video-taking moment for tourists." },
            { title: "Coonoor", detail: "The lower hill station (1,800m), 18 km below Ooty. Sim's Park (botanical garden), Lamb's Rock viewpoint, Dolphin's Nose, and the Highfield Tea Factory tour are the main attractions. Many travellers prefer Coonoor for a quieter Nilgiri experience than Ooty." },
            { title: "Wenlock Downs", detail: "Open grasslands between Coonoor and Ooty — used in countless Bollywood movie shoots. The 9th Mile Shooting Spot and 6th Mile Shooting Point have parking and viewpoints." },
            { title: "Ooty Lake approach", detail: "The descent into Ooty town offers the first views of Ooty Lake and the Government Botanical Gardens. Drivers usually take the Charing Cross route into the town centre." },
        ],
        foodStops: [
            { title: "Coimbatore to Mettupalayam (first 35 km)", detail: "Hotel Annapoorna at Saibaba Colony, A2B / Sangeetha at Gandhipuram, or Kovai's Restaurant at the airport are the standard pre-departure breakfast spots. Most drivers won't halt within Coimbatore." },
            { title: "Mettupalayam (35 km)", detail: "Last good restaurant cluster before the ghat. Junior Kuppanna (Kongunadu non-veg), Hotel Saravana Bhavan (pure-veg), and several small dhabas. Twenty-minute halt territory." },
            { title: "Hairpin viewpoints (no food, photo halts)", detail: "Several pull-overs along the climb — small chai shops at viewpoints serve hot tea, vada, and bun butter. Five-minute halts." },
            { title: "Coonoor (in town)", detail: "Hotel Hill Side, Taste of China, Garden Restaurant — Coonoor's food scene is more atmospheric than Ooty's. Lamb's Rock café serves excellent filter coffee with the namesake viewpoint." },
            { title: "Ooty arrival", detail: "Earl's Secret (heritage cafe), Modern Stores (heritage delicatessen), Adyar Anand Bhavan and Sangeetha for South Indian, Hotel Junior Kuppanna for Kongu non-veg. Most resort hotels have in-house dining." },
        ],
        vehicleGuidance:
            "The Coimbatore-Ooty ghat with 36 hairpins is a real test of vehicle comfort, even though it's only 86 km. <strong>Sedans (Etios/Dzire)</strong> at ₹1,200 handle the climb but feel underwhelmed on the steep gradients with 4 passengers — fine for 2-3 with light luggage. <strong>SUVs (Ertiga/Innova)</strong> at ₹1,640 are the sweet spot — better torque, less clutch-work, more cabin headroom for the bumpy sections, and significantly less motion-sickness risk for back-seat passengers. <strong>Innova Crysta</strong> at ₹1,810 is the premium pick — quiet cabin, captain seats (variant-dependent) help on the descent return; strongly preferred for elderly travellers and pregnant passengers. <strong>Diesel preferred for the climb</strong> — the surplus low-end torque means the engine doesn't strain. Petrol sedans and SUVs work but consume 25-30% more fuel on this stretch. Tempo Travellers handle the route — request 'experienced ghat driver' specifically.",
        monsoonAdvisory:
            "The Nilgiris receive both monsoons but the Southwest (June-September) is dominant. <strong>July-August:</strong> heavy rain, ghat fog from noon onwards, occasional landslide closures (typically 4-12 hours when they happen). The Nilgiri Mountain Railway suspends service on heavy-rain days; taxis continue with caution. <strong>October-November:</strong> retreating Northeast monsoon — gentler rain, beautiful post-monsoon green landscapes, occasional cyclone weather affecting the lower reaches. <strong>December-February:</strong> dry, cold, frosty mornings. Ooty drops to 4-8°C overnight; pack heavy woollens. <strong>March-May:</strong> ideal weather, peak tourist season. <strong>Pack year-round:</strong> warm layer (Ooty is 12-15°C cooler than Coimbatore), umbrella, motion-sickness medication for the hairpins (Avomine, Stemetil — consult doctor), and waterproof footwear.",
        multiDayPackage:
            "For 2-3 day Nilgiris trips, our <strong>multi-day Ooty package</strong> uses the same vehicle and driver throughout. Includes daily 250 km kilometre allowance (covers Ooty + Coonoor + Pykara + Doddabetta), driver bata (₹400/day for intra-state), one night halt charge per night (₹250-400), and tolls. <strong>Day 1:</strong> Coimbatore → Mettupalayam → Ooty arrival → Botanical Gardens, Charing Cross. <strong>Day 2:</strong> Doddabetta peak, Pykara Falls and Lake (boating), Tea Plantation visit. <strong>Day 3:</strong> Coonoor sightseeing (Sim's Park, Lamb's Rock, Dolphin's Nose) → return to Coimbatore. Sedan package starts at ₹6,800 for 3 days, SUV at ₹9,200, Crysta at ₹10,400.",
        destinationGuide: [
            { title: "Ooty Botanical Gardens", detail: "55-acre Government Botanical Gardens established 1848. Italian-style terraces, fern house, fossil tree, and the annual May flower show. Open 7 AM-6:30 PM. ₹50 entry. Allow 90 minutes." },
            { title: "Ooty Lake", detail: "Artificial lake created in 1824 by Sir John Sullivan. Boating (pedal, motor, shikara) at the boathouse, ₹120-450 per ride. Surrounding gardens include the Boat House Park. Allow 90-120 minutes." },
            { title: "Doddabetta Peak", detail: "10 km from Ooty — highest point in the Nilgiris (2,637m). Telescope house (₹10) for distant views including Coimbatore plains on a clear day. Open 7 AM-6 PM. Allow 60 minutes." },
            { title: "Pykara Falls and Lake", detail: "20 km from Ooty on the Mysore road. The falls are a 5-minute walk from the parking; the lake offers boating with shola-forest backdrop. ₹35 entry to the falls; ₹100-300 for boating. Allow 3-4 hours including drive." },
            { title: "Government Rose Garden", detail: "Asia's largest rose garden — 20,000+ rose plants, 2,000 varieties. Open 7 AM-6:30 PM. ₹30 entry. Best in April-May for full bloom. Allow 60-90 minutes." },
            { title: "Coonoor (Sim's Park, Dolphin's Nose, Lamb's Rock)", detail: "18 km from Ooty — the lower hill station. Sim's Park is a botanical garden in Coonoor town; Dolphin's Nose viewpoint and Lamb's Rock offer panoramic Nilgiri vistas. Half-day excursion typically combined with a tea-factory visit." },
            { title: "Nilgiri Mountain Railway (toy train)", detail: "UNESCO World Heritage Railway. Mettupalayam-Ooty route (5 hours each way) or shorter Coonoor-Ooty section (1.5 hours). Tickets ₹15-205 (general to first class). Book via IRCTC; advance booking essential during peak season. Many travellers combine a one-way taxi with a one-way toy train for the full experience." },
            { title: "Ooty tea factories and chocolate shops", detail: "Glenmorgan Tea Factory, Highfield Tea Factory at Coonoor — both run paid tours covering the tea-making process. Ooty's homemade chocolate shops at Charing Cross are popular souvenir stops." },
        ],
        customFaqs: [
            { question: "How long does the Coimbatore to Ooty drive take?", answer: "Approximately 2.5 to 3 hours for the 86 km drive. The first 35 km from Coimbatore to Mettupalayam is fast highway (40-45 minutes); the next 51 km on the ghat with 36 hairpin bends takes 1.75-2 hours at safe driving speeds. Heavy mist or weekend traffic can extend this by 30-45 minutes." },
            { question: "How much is a Coimbatore to Ooty taxi?", answer: "One-way drop fares: ₹1,200 sedan (Etios/Dzire), ₹1,640 SUV (Ertiga/Innova), ₹1,810 Innova Crysta — based on 86 km × per-km rates. Includes tolls (~₹65-100 cumulative on NH181), driver bata (₹400/day), and GST. No inter-state permit since both cities are in Tamil Nadu." },
            { question: "Is the Coimbatore-Ooty ghat road safe?", answer: "Yes. The 36-hairpin ghat is well-maintained with regular guardrails, painted lane markings, and frequent passing zones. Speed limits are 30-40 km/h on the climb, enforced by local police. Drivers experienced on this route handle the hairpins comfortably; we assign senior ghat-experienced drivers to all Ooty bookings during monsoon season." },
            { question: "What's the best vehicle for Coimbatore to Ooty?", answer: "For 2-3 passengers: sedan at ₹1,200 is fine; for 4-7 family travellers or anyone with motion-sickness sensitivity: SUV at ₹1,640 — better cabin space and less hairpin lurch in the back seats; for premium comfort or elderly: Innova Crysta at ₹1,810 with smooth suspension on the descent. Diesel preferred for the climb." },
            { question: "Can I combine the toy train with a taxi?", answer: "Yes — popular combination. Two common patterns: (1) One-way taxi Coimbatore → Mettupalayam, then one-way toy train Mettupalayam → Ooty (5 hours scenic); next-day taxi return from Ooty. (2) One-way taxi Coimbatore → Ooty, then toy train Ooty → Mettupalayam → taxi to Coimbatore the next day. Both work; tickets via IRCTC must be booked 30+ days ahead during peak season." },
            { question: "Can the taxi take me to Coonoor instead of Ooty?", answer: "Yes — Coonoor is at the 35-mile mark on the same ghat, 18 km below Ooty. Coimbatore-Coonoor sedan fare is ₹980; SUV ₹1,330; Crysta ₹1,470. Many travellers prefer Coonoor for a quieter Nilgiri experience or shorter ghat exposure (just 25 hairpins instead of 36)." },
            { question: "What's the best time of year to visit Ooty by taxi?", answer: "March-June (peak summer escape from plains, weather 12-25°C, all attractions open). September-November (post-monsoon clarity, fewer crowds, 10-22°C). December-February (cold, occasionally frosty, 4-18°C; pack heavy woollens). Avoid mid-July to mid-August peak monsoon — ghat fog and occasional landslides." },
            { question: "Will the driver wait while I sightsee at Ooty?", answer: "Not on a one-way drop — that ends at the booked drop point. For a 1-day Ooty package (Botanical Gardens + Lake + Doddabetta + return), book a round-trip with a 6-8 hour halt. For 2-3 day Nilgiris coverage, book our multi-day package — same driver/vehicle stays throughout." },
            { question: "Are there restrictions on entering Ooty during peak season?", answer: "Yes — during the April-June peak season, the Tamil Nadu government enforces an e-pass system at the Ooty entry (Pykara checkpoint) limiting vehicle inflow on weekend peaks. We obtain the e-pass during booking confirmation; you don't need to arrange anything separately. Off-season the entry is unrestricted." },
            { question: "Is Coimbatore Airport (CJB) to Ooty different in distance?", answer: "Slightly less — CJB to Ooty is approximately 80 km via NH181 since the airport sits south-west of Coimbatore city. Sedan: ₹1,120; SUV: ₹1,520; Crysta: ₹1,680. Many international and Bangalore arrivals book CJB-to-Ooty directly, saving the city detour." },
        ],
    },
    "chennai-to-pondicherry": {
        snippetLede:
            "Chennai to Pondicherry by taxi is approximately 150 km via the East Coast Road (ECR), taking 3 to 3.5 hours. The ECR is South India's most scenic coastal highway, running parallel to the Bay of Bengal through Mahabalipuram, Kalpakkam, and Cuddalore. One-way drop taxi fares start at ₹2,100 for a sedan, ₹2,850 for an SUV and ₹3,150 for an Innova Crysta — all-inclusive of tolls, driver bata and GST.",
        intro:
            "The Chennai to Pondicherry route is South India's most-booked weekend getaway corridor and one of the country's most scenic coastal drives. The <strong>East Coast Road (ECR)</strong> hugs the Bay of Bengal coastline for most of the 150 km, passing the UNESCO World Heritage shore temples at <strong>Mahabalipuram</strong>, the planned-port town of <strong>Kalpakkam</strong>, the Madras Crocodile Bank, and dozens of beach resorts. Pondicherry (officially Puducherry) is a former French colony with a still-distinct French Quarter — yellow walls, French street names, croissants at the boulangeries, and a relaxed Mediterranean pace that makes it the most-different city you can reach in 3 hours from Chennai. Chennai-side residents make this a same-day trip; out-of-state visitors typically combine it with 1-2 nights at Auroville or White Town hotels.",
        bestTime:
            "<strong>Departure:</strong> 6-8 AM weekdays for the smoothest run, with a Mahabalipuram breakfast halt. Avoid Friday 5 PM-9 PM and Saturday 9 AM-1 PM (ECR weekend exodus). For Sunday returns, leave Pondicherry by 2 PM or after 8 PM to skip the rush. <strong>Best season:</strong> November-February (cool, 22-28°C, calm beach weather). October has retreating-monsoon mood — beautiful but occasional showers. April-May is hot (35-38°C) but the ECR breeze keeps it bearable. June-September brings the Southwest edge with showers; the route is operational year-round but ECR scenery is at its dullest in peak summer.",
        sampleTimeline: [
            { time: "6:00 AM", activity: "Pickup from Chennai (airport, T Nagar, Adyar, OMR, Velachery, Anna Nagar, or your hotel)." },
            { time: "7:00 AM (+1 hr)", activity: "Reach the ECR start at Thiruvanmiyur. The two-lane scenic drive begins, with sea on the left." },
            { time: "7:45 AM (+1 hr 45 min)", activity: "Mahabalipuram (54 km from Chennai) — UNESCO Shore Temple complex. Optional 60-90 minute halt for the Pancha Rathas, Arjuna's Penance, and the Shore Temple itself." },
            { time: "9:00 AM (+3 hrs)", activity: "Pass Kalpakkam (the nuclear research township) and Sadras Dutch Fort. Brief photo halt territory." },
            { time: "9:30 AM (+3 hrs 30 min)", activity: "Cross into Tamil Nadu's Cuddalore district. The road remains coastal but the fishing village character takes over from the resort belt." },
            { time: "10:00 AM (+4 hrs)", activity: "Arrive Pondicherry. Drop at Promenade Beach, Aurobindo Ashram, French Quarter / White Town, Auroville, or your hotel." },
        ],
        dropPoints: [
            "Promenade Beach and Rock Beach (White Town)",
            "Aurobindo Ashram and Matrimandir at Auroville (12 km from city)",
            "French Quarter (Rue Suffren, Romain Rolland Street)",
            "Hotels: Hyatt Regency Pondicherry, Le Pondy, Promenade Hotel, La Villa, Maison Perumal",
            "Mahabalipuram (en-route drop for combined trips)",
            "Pondicherry Bus Stand and Railway Station",
            "Paradise Beach and Serenity Beach (north of Pondicherry)",
            "Sri Aurobindo Ashram main building (Marine Street)",
        ],
        routeHighlights: [
            { title: "East Coast Road (ECR)", detail: "South India's most scenic coastal highway, running 150 km from Chennai's Thiruvanmiyur to Pondicherry's Cuddalore approach. Two-lane mostly with frequent overtaking opportunities, sea views on much of the stretch, and an established ecosystem of beach resorts, restaurants, and amusement parks along the route." },
            { title: "Mahabalipuram (UNESCO Heritage)", detail: "54 km from Chennai — the 7th-8th century Pallava-era port city, with the Shore Temple, Pancha Rathas, Arjuna's Penance bas-relief, and the Krishna Butter Ball balanced rock. Most ECR drivers will accept a 60-90 minute Mahabalipuram halt — combine your taxi to Pondy with the heritage visit. Open 6 AM-6 PM; ₹40 entry per Indian, ₹600 for foreigners." },
            { title: "Sadras (Dutch Fort)", detail: "60 km from Chennai — small ruined Dutch fort dating to 1612. Free-entry archaeological site with sea views; 30-minute halt for history-minded travellers. Often skipped by drivers in a hurry." },
            { title: "Kalpakkam nuclear township", detail: "70 km from Chennai — India's pioneering nuclear power and research complex. The road passes through the township perimeter (no entry to public); the seafront south of the township is unrestricted with quiet beaches." },
            { title: "Auroville approach", detail: "12 km before Pondicherry the road passes the Auroville settlement — the experimental international township founded by Mirra Alfassa in 1968. Visitor centre opens 9 AM-5:30 PM with free entry; the Matrimandir requires advance booking via the Auroville website." },
            { title: "White Town arrival", detail: "Pondicherry's French Quarter, marked by colonial mustard-yellow buildings, Rue (street) names like Suffren and Romain Rolland, and the Promenade Beach (Beach Road). Most hotels and the Aurobindo Ashram are in this 1.5 km × 2 km zone." },
        ],
        foodStops: [
            { title: "Akshaya Restaurant ECR (15 km from Chennai)", detail: "Pure-veg breakfast spot popular with Chennai families heading south. Idli, dosa, ghee roast, filter coffee. Clean restrooms. 15-minute halt." },
            { title: "Mahabalipuram (54 km)", detail: "Best food halt on the route — Moonrakers (seafood), GRT Temple Bay (luxury), Sea Garden (mid-range), and Mamalla Heritage Restaurant. Allow 60 minutes if combining with sightseeing." },
            { title: "Kovalam fishing village (62 km)", detail: "Roadside fish-fry shacks if you want regional non-veg — fresh-caught seer, prawn, kingfish. Drivers know the trustworthy stalls. Twenty-minute halt." },
            { title: "Cholamandal Artists' Village (65 km)", detail: "Small bakery + cafe at the artists' colony with quiet outdoor seating. Worth a stop if you have art-museum interest as well as food." },
            { title: "Pondicherry arrival", detail: "Promenade Beach has the iconic ice cream stalls; Cafe des Arts and Le Cafe Madras serve French-Tamil fusion; Surguru and Sarvana Bhavan handle classic South Indian. Many resorts have in-house dining for arrival." },
        ],
        vehicleGuidance:
            "The 150 km ECR run is one of South India's smoothest highway drives — virtually any vehicle in our fleet handles the route. <strong>Sedans (Etios/Dzire)</strong> at ₹2,100 are the most-booked option for couples and small groups. <strong>SUVs (Ertiga/Innova)</strong> at ₹2,850 are preferred for 4-7 family travellers, especially with elderly relatives or beach gear/luggage. <strong>Innova Crysta</strong> at ₹3,150 is the smoothest pick for the comfortable 3-hour ride. <strong>Tempo Travellers</strong> are common for college groups and corporate offsites. Diesel and petrol both work; the route is flat with no significant fuel-economy gap. Pondicherry has narrow streets in the French Quarter — sedan/SUV fits all common drop addresses; Tempo Travellers may need to drop at the Promenade and let passengers walk in.",
        monsoonAdvisory:
            "The Tamil Nadu coast is most affected by the <strong>Northeast monsoon</strong> (October-December) — the region's primary rainfall window. <strong>October-November:</strong> intermittent heavy rain; ECR can flood at low-lying stretches near Mahabalipuram and Cuddalore (typically 4-12 hour closures during cyclone events). <strong>December-March:</strong> peak season; clear, cool, beach-friendly. <strong>April-May:</strong> hot inland but the ECR breeze keeps coastal drives bearable. <strong>June-September:</strong> Southwest monsoon edge — short showers, calm seas, and a 28-32°C climate; route operates without restrictions. <strong>Cyclone season (October-December):</strong> we monitor IMD warnings and reschedule rather than route-around if a cyclone is forecast for the Chennai-Cuddalore stretch.",
        multiDayPackage:
            "For 2-3 day Pondicherry trips, our <strong>multi-day package</strong> uses the same vehicle and driver throughout. Includes daily 250 km kilometre allowance, driver bata (₹400/day for intra-state), one night halt charge per night (₹250-500), tolls, GST. <strong>Day 1:</strong> Chennai → Mahabalipuram heritage halt → Pondicherry arrival → Promenade evening walk. <strong>Day 2:</strong> Auroville Matrimandir, Paradise Beach (boat ride), French Quarter walking tour, Aurobindo Ashram. <strong>Day 3:</strong> Optional Sri Aurobindo's Cazanove garden, return via ECR with second Mahabalipuram halt. Sedan package ₹8,200, SUV ₹11,000, Crysta ₹12,500 for 3 days.",
        destinationGuide: [
            { title: "Promenade Beach and Rock Beach", detail: "1.5 km seafront in the French Quarter — pedestrianised in the evenings (6 PM onwards). The Gandhi statue, the war memorial, and the iconic 19th-century Old Lighthouse line the walk. Sunrise (6 AM) and sunset (6 PM in winter, 6:45 PM in summer) are the photo windows. Free." },
            { title: "Sri Aurobindo Ashram", detail: "On Marine Street in White Town. The samadhi shrine (open 8 AM-12 PM, 2 PM-6 PM) is the centre of the ashram. Quiet meditation space; respectful dress code. Free entry but no photos inside the samadhi." },
            { title: "Auroville and Matrimandir", detail: "12 km from Pondicherry; the experimental township founded 1968. The Matrimandir 'Mother's Temple' is open 9 AM-12:30 PM and 1:30 PM-5 PM; advance pass required via aurovilleonline.com — book 2-3 days ahead. Visitor centre + viewpoint + cafe + bookstore. Allow 3-4 hours." },
            { title: "French Quarter walking tour", detail: "Rue Romain Rolland, Rue Suffren, Rue Dumas, and Rue Saint Louis cover most of the colonial-yellow heritage zone. Cafés (Cafe des Arts, Bistro des Arts, Le Dupleix), boutique shops, the Pondicherry Museum, and the Notre Dame des Anges church. Best at 5-7 PM. Free; pay-as-you-go for café stops." },
            { title: "Paradise Beach (Chunnambar)", detail: "8 km north of Pondicherry — accessible only by boat from Chunnambar boathouse. Quiet sandy beach with fishing-boat character; the boat ride itself (₹250-400 round trip) is half the experience. Allow 4-5 hours with the boat journey." },
            { title: "Serenity Beach", detail: "5 km north of Pondicherry on the ECR. Surf-friendly beach with surf rental shacks; the Serenity Beach Resort area has cleaner sand than the central Promenade. Half-day visit." },
            { title: "Mahabalipuram (en-route or as side trip)", detail: "Combine with the ECR drive — most drivers will accept the 90-minute halt as part of your booking. The Shore Temple, Pancha Rathas, Krishna's Butter Ball, and Arjuna's Penance are all within 1 km of each other." },
            { title: "Pondicherry food and shopping", detail: "Le Cafe (riverside French-Tamil), Surguru (Tamil meals), Cafe Xtasi (wood-fired pizza), and the Goubert Market (Sunday morning organic farm produce) are the standard food circuit. Shopping: Hidesign, Kalki, Sri Aurobindo Ashram bookstore, and the Sunday market for paper-handmade and incense products." },
        ],
        customFaqs: [
            { question: "How long does the Chennai to Pondicherry drive take?", answer: "Approximately 3 to 3.5 hours via the ECR (East Coast Road) for the 150 km distance. From central Chennai (T Nagar, Adyar) to Pondicherry's White Town, plan for 3.5 hours door-to-door including the 30-minute Chennai exit traffic. With a 60-90 minute Mahabalipuram halt, the trip extends to 5 hours total — typical for a sightseeing-combined run." },
            { question: "How much does a Chennai to Pondicherry taxi cost?", answer: "One-way drop fares: ₹2,100 sedan (Etios/Dzire), ₹2,850 SUV (Ertiga/Innova), ₹3,150 Innova Crysta — based on 150 km × per-km rates of ₹14, ₹19, ₹21. Includes tolls, ₹400/day driver bata, GST. The ECR has small toll plazas at Sholinganallur and Tiruporur (₹35-65 each) included in the displayed fare." },
            { question: "Is the ECR or NH32 (GST Road) faster?", answer: "ECR is the standard route — 150 km, mostly two-lane scenic coastal. The alternate NH32/Tindivanam route is ~165 km and slightly longer; it's used only when ECR is closed (rare cyclone events). For all standard bookings we route via ECR for the better drive experience." },
            { question: "Can I do same-day Chennai-Pondicherry-Chennai?", answer: "Yes — same-day round-trips are extremely common. A typical plan: 6 AM Chennai departure, 9 AM Pondy arrival, 6 hours in Pondy + Auroville, 4 PM Pondy departure, 7-8 PM Chennai return. Sedan or SUV depending on group; round-trip pricing is roughly 2× one-way + ₹500 driver halt charge if you stay >6 hours at the destination." },
            { question: "What's the best time to depart Chennai for Pondicherry?", answer: "6-8 AM weekdays for the smoothest drive — clear of Chennai morning traffic, good Mahabalipuram halt timing for breakfast, arrival in Pondy ahead of mid-day heat. Friday afternoon and Saturday morning departures hit ECR weekend traffic — add 30-60 minutes." },
            { question: "Can the taxi stop at Mahabalipuram on the way?", answer: "Yes — most drivers will accept a 60-90 minute Mahabalipuram halt as part of the Chennai-Pondicherry drop. Mention it at booking; we add a small driver-wait charge (₹150-250) if the halt extends beyond 90 minutes. For a longer Mahabalipuram visit, book a separate Chennai-Mahabalipuram-Pondicherry multi-stop package." },
            { question: "Is Pondicherry a separate state? Do I need a permit?", answer: "Pondicherry (Puducherry) is a Union Territory, but for taxi-permit purposes it's treated like a separate state — Tamil Nadu-registered taxis crossing into Puducherry require a small inter-state permit (typically ₹100-200) which we handle and include in the fare. No paperwork needed from your end." },
            { question: "Are there hotels at Pondicherry for an overnight stay?", answer: "Yes — Hyatt Regency Pondicherry (luxury, on the Cuddalore road), Le Pondy, La Villa (heritage boutique in White Town), Maison Perumal (heritage), Promenade Hotel, and dozens of mid-range and budget options. The French Quarter (Rue Suffren area) has the most atmospheric heritage stays; advance booking 30+ days during peak season (Dec-Feb)." },
            { question: "Is the ECR road safe at night?", answer: "Yes for the Chennai-Mahabalipuram stretch (well-trafficked, lit). The Mahabalipuram-Pondicherry stretch has fewer streetlights and lighter traffic — drivers reduce speed to 60-70 km/h for safety. Night bookings are common (10 PM-2 AM departure for weekend escapers); night charges (₹250-500) apply for trips between 10 PM and 6 AM." },
            { question: "Can the taxi take us to Auroville Matrimandir directly?", answer: "Yes — most drivers know the Auroville visitor centre route from the ECR (12 km off the main highway). Drop at the visitor centre car park; from there visitors walk or take the in-Auroville electric shuttle to the Matrimandir (advance pass required). Mention Auroville at booking so the driver routes via the Bommayarpalayam exit." },
        ],
    },
    "madurai-to-rameswaram": {
        snippetLede:
            "Madurai to Rameswaram by taxi is approximately 174 km via NH87 (formerly NH49) through Manamadurai, Paramakudi, and Ramanathapuram, taking about 3.5 to 4 hours. The drive crosses the iconic Pamban Bridge connecting Pamban Island to mainland Tamil Nadu. One-way drop taxi fares start at ₹2,440 for a sedan, ₹3,310 for an SUV and ₹3,650 for an Innova Crysta — all-inclusive of tolls, driver bata and GST.",
        intro:
            "Rameswaram is one of the four <strong>Char Dham</strong> pilgrimage sites and is sacred to both Vaishnavites and Shaivites. The town sits on Pamban Island in the Gulf of Mannar, connected to the mainland only by the <strong>Pamban Bridge</strong> — India's first sea bridge (opened 1914) and the second-longest sea bridge in India. Most pilgrims combine the route with a Madurai Meenakshi Amman temple visit, making the Madurai-Rameswaram drive the busiest pilgrim corridor in southern Tamil Nadu. The route is mostly two-lane highway with one ghat-free climb to the Pamban Bridge approach. The new vertical-lift Pamban Bridge (which replaces the 1914 cantilever bridge) is being commissioned — the route is operational year-round on the parallel road bridge.",
        bestTime:
            "Plan an early-morning Madurai departure (5-7 AM) to reach Rameswaram by 9-10 AM, ahead of the Ramanathaswamy temple's mid-morning closure (12:30 PM-3:30 PM). Pilgrims doing Agni Theertham bath (sea bath at Ramanathaswamy) start at sunrise — book your taxi for 4 AM departure to be at the beach by 7:30. Best season: November-February (cool, dry, calm sea). Avoid June-August (monsoon swells, occasional Pamban Bridge wind closures). Cyclone season (October-December) requires advance weather check; if a cyclone is forecast, drivers reschedule.",
        sampleTimeline: [
            { time: "5:00 AM", activity: "Pickup from Madurai (airport, junction, Mattuthavani bus stand, Anna Nagar, KK Nagar, or your hotel)." },
            { time: "6:00 AM (+1 hr)", activity: "Pass Madurai outskirts → Manamadurai (45 km) — last sizable town before the route opens up." },
            { time: "7:00 AM (+2 hrs)", activity: "Reach Paramakudi (90 km). Quick chai/idli halt at the highway dhabas." },
            { time: "7:45 AM (+2 hrs 45 min)", activity: "Pass Ramanathapuram — the district headquarters and the historical Sethupathi capital. Last good fuel/restroom break." },
            { time: "8:30 AM (+3 hrs 30 min)", activity: "Cross the Pamban Bridge — the iconic 2 km sea bridge linking the mainland to Pamban Island. Photo halt at the viewpoint." },
            { time: "9:00 AM (+4 hrs)", activity: "Arrive Rameswaram. Drop at Ramanathaswamy temple, your hotel, Agni Theertham beach, or Dhanushkodi onward booking." },
        ],
        dropPoints: [
            "Ramanathaswamy Temple (Rameswaram town centre)",
            "Agni Theertham (sacred sea-bath beach beside temple)",
            "Pamban Bridge viewpoint",
            "Dhanushkodi (18 km — accessible only by taxi/jeep, no train)",
            "Rameswaram Railway Station and bus stand",
            "Kothandaramaswamy Temple (12 km from town)",
            "Hotels: Hyatt Regency Rameswaram, TN Tourism Hotel Tamilnadu, Rama's Garden",
            "APJ Abdul Kalam Memorial (Pei Karumbu)",
        ],
        routeHighlights: [
            { title: "NH87 (formerly NH49)", detail: "Two-lane highway through southern Tamil Nadu — well-maintained, sparsely populated, with steady 60-80 km/h cruise possible. Few traffic snags except in town crossings at Manamadurai and Ramanathapuram." },
            { title: "Manamadurai", detail: "Junction town 45 km from Madurai. Historic Manamadurai Bridge over the Vaigai River and the Periyalvar shrine. Practical breakfast halt territory." },
            { title: "Ramanathapuram (Ramnad) heritage", detail: "Former capital of the Sethupathi (Bridge Lord) dynasty that historically maintained the Pamban approach. The Ramalinga Vilasam palace museum is worth a 30-minute halt for heritage-minded travellers." },
            { title: "Pamban Bridge", detail: "India's first sea bridge, opened 1914 and operational continuously except during the 1964 cyclone that washed away the rail link. The new vertical-lift bridge (under commissioning) replaces the older cantilever rail bridge. The road bridge runs parallel and remains the route taxis use. Photography from the viewpoint at the mainland end is the route's signature shot." },
            { title: "Gulf of Mannar coastline", detail: "From the bridge onward to Rameswaram town, the road skirts the shallow Gulf of Mannar — sand dunes, fishing villages, and the unique flat-sea horizon characteristic of this stretch of coast." },
            { title: "Dhanushkodi ghost town", detail: "18 km past Rameswaram on a sandy road usable only by taxi/jeep. Site of the 1964 Rameswaram cyclone that destroyed the entire town. Now a partly-rebuilt fishing settlement with the famous 'land's end' viewpoint where the Bay of Bengal meets the Indian Ocean." },
        ],
        foodStops: [
            { title: "Madurai Mattuthavani area (departure)", detail: "Most drivers won't halt within Madurai — they prefer to clear the city first. If you need a pre-departure breakfast, hotel-room delivery is faster than highway halts in the first 30 km." },
            { title: "Manamadurai (45 km)", detail: "First substantial highway halt — Tamil-style breakfast (idli, dosa, pongal) at clean dhabas. Restrooms acceptable. Ten-minute stop." },
            { title: "Paramakudi (90 km)", detail: "Larger town with multiple dhaba options. Tamil meals (banana-leaf thali) available from 11 AM. Stop here if your departure is later than 7 AM." },
            { title: "Ramanathapuram (130 km)", detail: "Last meals halt before Pamban. Heritage Chettinad-style restaurants in the town centre serve regional non-veg specialities (kozhi varuval, mutton sukka). Twenty-minute halt territory if you have time." },
            { title: "Rameswaram (arrival)", detail: "Pure-vegetarian temple-town cuisine post-arrival. Hotel Tamilnadu (TTDC) and Hyatt are the cleanest sit-down meals; small idli-dosa stalls near the temple are the local favourite for pilgrims." },
        ],
        vehicleGuidance:
            "The 174 km Madurai-Rameswaram route is mostly flat highway — virtually any vehicle in our fleet handles it. <strong>Sedans (Etios/Dzire)</strong> at ₹2,440 are the most-booked option for 2-3 pilgrims with light luggage. <strong>SUVs (Ertiga/Innova)</strong> at ₹3,310 are the popular family pilgrimage choice — easier ingress for elderly devotees and more cabin space for prasadam containers and pilgrim luggage. <strong>Innova Crysta</strong> at ₹3,650 is the smoothest option for Char Dham circuits where this route is one leg of a longer pilgrimage; the captain seats (variant-dependent) help post-darshan rest. <strong>Tempo Travellers</strong> are common for multi-family pilgrim groups; mention your group size at booking. All vehicles cross the Pamban Bridge without restriction; no special permits needed since both ends are in Tamil Nadu.",
        monsoonAdvisory:
            "The Tamil Nadu coast is most affected by the <strong>Northeast monsoon</strong> (October-December). Rameswaram itself sits in a low-rainfall zone (~700mm annually) but cyclone events in the Bay of Bengal can trigger <strong>Pamban Bridge wind closures</strong> (gusts above 60 km/h trigger SR-level warnings). When a closure happens, taxi trips are rescheduled rather than diverted — there is no alternate vehicle route to Rameswaram. <strong>April-May</strong> is hot (35-40°C) but consistently clear and bridge-safe. <strong>July-September</strong> brings the Southwest monsoon edge — short showers, calm seas, and a 25-35°C climate. <strong>Pack year-round:</strong> sunscreen (the Pamban approach has no shade), light cotton clothing, modest temple-appropriate wear (veshti for men, saree/salwar for women) for darshan, and small-cash for prasadam.",
        destinationGuide: [
            { title: "Ramanathaswamy Temple", detail: "One of the 12 Jyotirlingas and one of the four Char Dhams. Famous for its 1,000+ pillar corridors — the longest temple corridor in India (over 1.2 km). Open 5 AM-1 PM, 3 PM-9 PM. The 22 sacred wells (theerthams) inside the temple require a separate ₹25 ticket; bring a change of clothes for the bath ritual. Allow 3-4 hours minimum." },
            { title: "Agni Theertham", detail: "The sea-bath spot directly opposite the temple — pilgrims traditionally bathe here before darshan. Best at sunrise (5:30-6:30 AM); changing rooms and showers at the temple's eastern entrance. Free." },
            { title: "Dhanushkodi (land's end)", detail: "18 km drive on a sandy beach road past Rameswaram town. The 1964 cyclone-destroyed ghost town, the temple ruins, and the geographic 'tip' where the Bay of Bengal meets the Indian Ocean. Best at sunrise or sunset. Local taxis and jeeps shuttle from Rameswaram (₹500-800 per group). Allow 3-4 hours." },
            { title: "Kothandaramaswamy Temple", detail: "12 km from Rameswaram on the Dhanushkodi road. Legend has it Vibhishana surrendered to Rama here. The only temple in the area to have survived the 1964 cyclone. Atmospheric beach-temple visit. Free entry." },
            { title: "APJ Abdul Kalam Memorial (Pei Karumbu)", detail: "Memorial to India's 11th President, born in Rameswaram. Architectural blend of Mughal and South Indian styles. Free entry; allow 60 minutes. Worth the visit for non-pilgrim travellers as well." },
            { title: "Lakshmana Theertham, Rama Theertham, and Sita Theertham", detail: "Smaller theertham (sacred-water-body) sites scattered around Rameswaram, each with its mythological connection to the Ramayana. Most pilgrims visit these as part of an extended Rameswaram circuit; budget half a day." },
            { title: "Pamban Bridge sunrise/sunset photography", detail: "The bridge is the route's photogenic highlight. The mainland-side viewpoint has parking and a railed walkway. Best at sunrise (6 AM) or just before sunset. Allow 30 minutes for photos." },
        ],
        customFaqs: [
            { question: "How far is Rameswaram from Madurai by road?", answer: "Approximately 174 km via NH87 (formerly NH49) through Manamadurai, Paramakudi, and Ramanathapuram. The drive takes 3.5 to 4 hours in normal traffic. The route is two-lane highway with one significant feature — crossing the Pamban Bridge to reach the island." },
            { question: "What is the Madurai to Rameswaram taxi fare?", answer: "Sedan ₹2,440, SUV ₹3,310, Innova Crysta ₹3,650 — based on 174 km × per-km rates. The fare includes tolls, ₹400/day driver bata, and GST. No inter-state permit applies since both cities are in Tamil Nadu. There is no extra Pamban Bridge crossing charge for taxis." },
            { question: "Is the Pamban Bridge open for taxis?", answer: "Yes. The original 1914 road bridge (and parallel rail bridge) handles vehicular traffic year-round. The new vertical-lift bridge under commissioning is for rail traffic; taxi traffic continues on the existing road bridge. The bridge can be wind-closed during cyclone events (rare, typically October-December)." },
            { question: "Can I do same-day Madurai-Rameswaram-Madurai?", answer: "Yes. A typical same-day plan: 4-5 AM Madurai departure, 8-9 AM Rameswaram arrival, 6-8 hours for darshan + Dhanushkodi + Pamban photos, 5-6 PM return departure, 10 PM Madurai return. Choose a sedan or SUV depending on group; the 350 km round-trip on a same day is comfortably doable." },
            { question: "Do I need to book darshan tickets in advance for Ramanathaswamy?", answer: "Standard darshan is free with no advance booking. The ₹25 special ticket for the 22 theerthams is available at the temple. For festival days (Mahashivratri, Karthikai) and weekend pilgrim peaks, online booking via the Tamil Nadu HRCE website saves 1-2 hour queue time." },
            { question: "Is it worth doing Dhanushkodi on the same day as Rameswaram?", answer: "Yes — Dhanushkodi is the route's most distinctive sight (the 'land's end' geography is unique in India). Allow 3-4 hours for the round trip from Rameswaram by local jeep/taxi. Many one-day pilgrim itineraries cover Ramanathaswamy temple → Agni Theertham → Pamban Bridge → Dhanushkodi → return." },
            { question: "What's the best time to visit Rameswaram?", answer: "November to February — cool (24-30°C), dry, calm seas, clear skies for Pamban Bridge photography. December has the least crowds outside major festivals. April-May is hot (35-40°C) but pilgrim-friendly. June-September is the Southwest monsoon edge — short rains, calm seas. October-December cyclone season requires weather-watch." },
            { question: "Are there hotels at Rameswaram for an overnight stay?", answer: "Yes — Hyatt Regency Rameswaram (luxury), Hotel Tamilnadu by TTDC (heritage budget), Rama's Garden, Daiwik Rameshwaram (premium pilgrim-focused), and dozens of mid-range options near the temple. Book 30-45 days ahead during festival peaks (Mahashivratri, Karthikai)." },
            { question: "Can the taxi take us to Dhanushkodi?", answer: "Most full-size taxis (sedan, Innova) can reach Dhanushkodi via the new sealed road that opened in 2017. The earlier sandy stretch is now metalled. Some drivers prefer to drop you at Rameswaram and have you take a local Dhanushkodi tour jeep — confirm at booking. We can quote a single combined Madurai → Rameswaram → Dhanushkodi → Madurai package if you want one driver throughout." },
            { question: "Is the route safe for solo female travellers?", answer: "Yes. The route is well-trafficked daily by pilgrim families, and Rameswaram is a major pilgrimage town with heavy police presence. We assign drivers with verified ID and 3+ years of pilgrim-route experience. For solo bookings we share driver name, photo, and badge number 30-60 minutes before pickup; you can also request a female-friendly driver subset that we maintain." },
        ],
    },
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
