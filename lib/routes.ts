// lib/routes.ts — Generate city-to-city route data for programmatic SEO pages

import { ALL_DISTRICTS, DISTRICT_BY_SLUG, District } from './districts';
import { VEHICLE_TYPES as VEHICLES, SUPPORT_PHONE } from './constants';

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

// Parse a route slug
export function parseRouteSlug(slug: string): RouteData | null {
    const match = slug.match(/^(.+?)-to-(.+?)-taxi$/);
    if (!match) return null;

    const [, fromSlug, toSlug] = match;
    const fromDistrict = DISTRICT_BY_SLUG.get(fromSlug);
    const toDistrict = DISTRICT_BY_SLUG.get(toSlug);
    if (!fromDistrict || !toDistrict) return null;

    // Find the fare from popularRoutes
    const routeEntry = fromDistrict.popularRoutes.find(r => r.toSlug === toSlug);
    if (!routeEntry) return null;

    return {
        from: fromDistrict,
        to: toDistrict,
        distanceKm: routeEntry.distanceKm,
        fareEstimate: routeEntry.fareEstimate,
        slug,
    };
}

// Generate route-specific SEO content
export function getRouteSEOContent(route: RouteData) {
    const { from, to, distanceKm, fareEstimate } = route;
    const durationHrs = Math.floor(distanceKm / 55);
    const durationMins = Math.round((distanceKm / 55 - durationHrs) * 60);
    const durationText = durationHrs > 0
        ? `${durationHrs}h ${durationMins > 0 ? `${durationMins}m` : ''}`
        : `${durationMins}m`;

    return {
        title: `${from.name} to ${to.name} Taxi ₹${fareEstimate} | One Way Cab`,
        metaDescription: `Book ${from.name} to ${to.name} one way taxi from ₹${fareEstimate}. ${distanceKm}km, ~${durationText}. AC vehicles, verified drivers, no return fare. Save 40%. Book now!`,
        h1: `${from.name} to ${to.name} One Way Taxi`,
        durationText,
        durationHrs,
        durationMins,
    };
}

// Generate route-specific FAQs
export function getRouteFAQs(route: RouteData) {
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
