// lib/seo-content.ts — Dynamic content generation for district SEO pages

import { District, ServiceType } from './districts';
import { VEHICLE_TYPES } from './constants';

interface SEOContent {
    title: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    keywords: string[];
    serviceDescription: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface ReviewData {
    name: string;
    rating: number;
    text: string;
    route: string;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
    'drop-taxi': 'Drop Taxi',
    'taxi-service': 'Taxi Service',
    'outstation-cab': 'Outstation Cab',
    'airport-taxi': 'Airport Taxi',
    'one-way-taxi': 'One Way Taxi',
};

const SERVICE_VERBS: Record<ServiceType, string> = {
    'drop-taxi': 'one-way drop taxi',
    'taxi-service': 'reliable taxi service',
    'outstation-cab': 'affordable outstation cab',
    'airport-taxi': 'convenient airport taxi',
    'one-way-taxi': 'one-way taxi',
};

// ─── SEO Content Generators ─────────────────────────────────

export function getSEOContent(district: District, serviceType: ServiceType): SEOContent {
    const label = SERVICE_LABELS[serviceType];
    const verb = SERVICE_VERBS[serviceType];
    const topRoute = district.popularRoutes[0];
    const dn = district.name;
    const dl = district.name.toLowerCase();
    const currentYear = new Date().getFullYear();

    // Title: Optimized for <60 chars with CTR power words & Year
    const TITLE_TEMPLATES: Record<ServiceType, string> = {
        'drop-taxi': `${dn} Drop Taxi Service — Flat ₹${VEHICLE_TYPES[0].price}/km | Save 40%`,
        'taxi-service': `${dn} Taxi Service (${currentYear}) — Book @ ₹${VEHICLE_TYPES[0].price}/km`,
        'outstation-cab': `${dn} Outstation Cab — One Way Drops from ₹${VEHICLE_TYPES[0].price}/km`,
        'airport-taxi': `${dn} Airport Taxi — On-time Pickup from ₹${VEHICLE_TYPES[0].price}/km`,
        'one-way-taxi': `${dn} One Way Taxi — Pay One Way from ₹${VEHICLE_TYPES[0].price}/km`,
    };

    // Meta Description: Optimized for <155 chars with CTA
    const topRouteText = topRoute ? `${dn} to ${topRoute.to} ₹${topRoute.fareEstimate}. ` : '';
    const META_TEMPLATES: Record<ServiceType, string> = {
        'drop-taxi': `Book ${dn} drop taxi from ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}Pay one-way fare only. No return charges. Verified drivers. Book now for ${currentYear}!`,
        'taxi-service': `Best taxi service in ${dn}, ${district.state}. ${topRouteText}AC cabs from ₹${VEHICLE_TYPES[0].price}/km. 24/7 booking, verified drivers. Call now!`,
        'outstation-cab': `Book outstation cab from ${dn} at ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}One-way pricing, AC vehicles, verified drivers. Book online!`,
        'airport-taxi': `Reliable airport taxi in ${dn} from ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}On-time pickup, flight tracking, no surge. Book now!`,
        'one-way-taxi': `Book one way taxi from ${dn} at ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}Pay only one-way fare, no return charges. Book now!`,
    };

    return {
        title: TITLE_TEMPLATES[serviceType],
        metaDescription: META_TEMPLATES[serviceType],
        h1: `${dn} ${label} — Book Now & Save 40%`,
        subtitle: `Premium ${verb} in ${dn}, ${district.state}. Pay only for one way — no return fare, no hidden charges. Trusted by 50,000+ happy travelers in ${currentYear}.`,
        keywords: [
            `${dl} ${label.toLowerCase()}`,
            `${dl} to ${topRoute?.to.toLowerCase() || 'bangalore'} taxi`,
            `${label.toLowerCase()} ${dl}`,
            `one way taxi ${dl}`,
            `${dl} cab booking`,
            `outstation taxi ${dl}`,
            `${dl} ${district.state.toLowerCase()} taxi`,
            `cheap taxi ${dl}`,
            `${dl} one way cab`,
            `book taxi ${dl}`,
            `${dl} to ${topRoute?.to.toLowerCase() || 'bangalore'} cab fare`,
            `${dl} drop taxi contact number`,
            `call taxi ${dl}`,
        ],
        serviceDescription: generateServiceDescription(district, serviceType),
    };
}

function generateServiceDescription(district: District, serviceType: ServiceType): string {
    const label = SERVICE_LABELS[serviceType];
    const verb = SERVICE_VERBS[serviceType];
    const dn = district.name;
    const ds = district.state;
    const topRoutes = district.popularRoutes.slice(0, 3);
    const routeText = topRoutes.map(r => `${dn} to ${r.to} (${r.distanceKm} km, ~₹${r.fareEstimate})`).join(', ');
    const routeNames = topRoutes.map(r => r.to).join(', ');

    const descriptions: Record<ServiceType, string> = {
        'drop-taxi': `Looking for a **${verb} in ${dn}**? OneWayTaxi.ai offers the most affordable one-way drop taxi service from ${dn}, ${ds}. Unlike traditional round-trip taxis where you pay for the driver's return journey, our drop taxi model charges you only for the distance you actually travel — **saving up to 40%** on your fare compared to competitors.

### Why Book Our ${dn} Drop Taxi?
Our ${dn} drop taxi fleet includes **Mini/Hatchbacks (₹${VEHICLE_TYPES[0].price}/km)**, Sedans like Swift Dzire and Toyota Etios (₹${VEHICLE_TYPES[1].price}/km), SUVs (₹${VEHICLE_TYPES[4]?.price || 19}/km), and premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). Every vehicle is air-conditioned, GPS-tracked, and regularly serviced for your comfort and safety.

### Popular Routes
Popular one-way drop taxi routes from ${dn}: ${routeText}. Whether you're traveling for business, family visits, medical appointments, or pilgrimage, our ${dn} drop taxi service ensures a comfortable, reliable, and budget-friendly journey. All fares are inclusive of driver bata (allowance), toll charges, inter-state permits, and GST — what you see is what you pay, with absolutely zero hidden charges. Book your ${dn} drop taxi now online or call us 24/7.`,

        'taxi-service': `OneWayTaxi.ai is your trusted **${verb} in ${dn}, ${ds}**. Whether you need a local city ride, a long-distance outstation trip, or an airport transfer, we have you covered with our wide range of well-maintained, AC vehicles driven by professional, background-verified drivers.

### Best Rate Guarantee
What makes our ${dn} taxi service stand out? Transparent one-way pricing (no return charges), real-time GPS tracking, 24/7 availability, and a 4.8-star customer rating. Unlike app-based taxi services that charge surge pricing during peak hours, festivals, or rain, our ${dn} taxi fare stays fixed — no surprises at the end of your journey.

### Destinations
Popular destinations from ${dn}: ${routeText}. We also serve ${routeNames} and 115+ other cities across ${ds}, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana. Our ${dn} taxi service is available for one-way drops, round trips, multi-city tours, and corporate travel. Book online in 30 seconds or call our 24/7 helpline for instant confirmation.`,

        'outstation-cab': `Planning an outstation trip from ${dn}? Book your **${verb}** with OneWayTaxi.ai and enjoy hassle-free intercity travel across ${ds} and all of South India. Our outstation cab service is designed for travelers who want the convenience of a private vehicle at the affordability of a one-way fare structure.

### Save on Intercity Travel
Why choose OneWayTaxi.ai for outstation cabs from ${dn}? We eliminate the traditional round-trip billing model — you pay only for the distance from ${dn} to your destination. This makes our outstation cabs up to 40% cheaper than regular taxi services. Your fare includes driver allowance, toll charges, state permits, and GST.

### Fleet & Routes
Top outstation routes from ${dn}: ${routeText}. Our outstation cab fleet covers 115+ cities across 5 South Indian states with vehicles ranging from budget hatchbacks (₹${VEHICLE_TYPES[0].price}/km) to premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). All vehicles are air-conditioned, clean, GPS-tracked, and driven by experienced, verified drivers who know the best highway routes.`,

        'airport-taxi': `Need a reliable **${verb} in ${dn}**? OneWayTaxi.ai provides seamless airport transfer services with guaranteed on-time pickups and drop-offs. Whether you're arriving at or departing from ${dn} airport, our fleet of comfortable AC vehicles ensures a stress-free, hassle-free journey to or from the terminal.

### Reliability First
What sets our ${dn} airport taxi apart: our drivers actively track your flight status using real-time flight tracking. If your flight is delayed, your driver adjusts the pickup time automatically at no extra charge. We offer 30 minutes of free waiting time at the airport, so you don't need to rush through baggage claim. No surge pricing, no meter tampering.

### Upfront Pricing
Book your ${dn} airport taxi online and get an instant fare estimate. Popular airport transfer routes: ${routeText}. Available vehicle types include Hatchbacks (₹${VEHICLE_TYPES[0].price}/km), Sedans, SUVs, and Innova Crysta. All fares include driver bata, toll charges, parking fees, and GST. Our ${dn} airport taxi service operates 24/7.`,

        'one-way-taxi': `Looking for a **one-way taxi in ${dn}**? OneWayTaxi.ai offers the best one-way taxi service from ${dn}, ${ds}. Pay only for the distance you travel — no return fare, no hidden charges. Save up to 40% compared to round-trip taxis.

### Affordable One Way Taxi from ${dn}
Our ${dn} one-way taxi fleet includes **Hatchbacks (₹${VEHICLE_TYPES[0].price}/km)**, Sedans (₹${VEHICLE_TYPES[1].price}/km), SUVs, and premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). Every vehicle is air-conditioned, GPS-tracked, and driven by verified drivers.

### Popular One Way Routes
Top one-way taxi routes from ${dn}: ${routeText}. All fares include driver bata, toll charges, permits, and GST. Book your ${dn} one-way taxi online or call us 24/7.`,
    };

    return descriptions[serviceType];
}

export function getWhyChooseUs(district: District) {
    return [
        {
            title: 'Flat One-Way Rate',
            desc: `Pay only for the km you travel. No return charges. Save up to 40% on ${district.name} outstation trips.`,
            icon: 'Wallet'
        },
        {
            title: 'No Hidden Charges',
            desc: 'Prices include Tolls, Driver Bata & GST. The quote you see is the final price you pay.',
            icon: 'FileCheck'
        },
        {
            title: 'On-Time Pickup',
            desc: `Reliable pickup service in ${district.name} with 24/7 customer support and live tracking.`,
            icon: 'Clock'
        },
    ];
}

// ─── FAQ Generator ──────────────────────────────────────────

export function getFAQs(district: District, serviceType: ServiceType): FAQ[] {
    const label = SERVICE_LABELS[serviceType];
    const topRoute = district.popularRoutes[0];
    const cheapestRate = VEHICLE_TYPES[0].price;

    const baseFAQs: FAQ[] = [
        {
            question: `What is the starting fare for ${label.toLowerCase()} in ${district.name}?`,
            answer: `The starting fare for ${label.toLowerCase()} in ${district.name} is ₹${cheapestRate}/km for a hatchback. Sedan rates start at ₹${VEHICLE_TYPES[1].price}/km, SUV at ₹${VEHICLE_TYPES[2].price}/km, and Innova Crysta at ₹${VEHICLE_TYPES[3].price}/km. All fares include driver allowance, toll charges, and GST with no hidden costs.`,
        },
        {
            question: `How do I book a ${label.toLowerCase()} from ${district.name}?`,
            answer: `You can book a ${label.toLowerCase()} from ${district.name} instantly on OneWayTaxi.ai. Simply enter your pickup location, destination, date, and time. You'll get an instant fare estimate. You can also call us 24/7 at +91 81244 76010 for immediate booking.`,
        },
        {
            question: `Is ${label.toLowerCase()} from ${district.name} available 24/7?`,
            answer: `Yes, our ${label.toLowerCase()} from ${district.name} is available 24 hours a day, 7 days a week — including holidays and late nights. You can book at any time through our website or by calling our support team.`,
        },
        {
            question: `What types of vehicles are available for ${label.toLowerCase()} in ${district.name}?`,
            answer: `We offer 5 vehicle types for ${label.toLowerCase()} in ${district.name}: Mini/Hatchback (4 seats, ₹${VEHICLE_TYPES[0].price}/km), Sedan like Etios/Dzire (4 seats, ₹${VEHICLE_TYPES[1].price}/km), SUV/Innova (7 seats, ₹${VEHICLE_TYPES[2].price}/km), Innova Crysta (7 seats, ₹${VEHICLE_TYPES[3].price}/km), and Tempo Traveller (12 seats, ₹${VEHICLE_TYPES[4].price}/km).`,
        },
        {
            question: `Are there any hidden charges for ${district.name} ${label.toLowerCase()}?`,
            answer: `No, absolutely not. Our ${district.name} ${label.toLowerCase()} fares are fully transparent and include all costs — driver bata, toll charges, permit fees, and GST. The fare you see at booking is the fare you pay. There are no surge charges, no night charges, and no return-trip charges.`,
        },
    ];

    // Add route-specific FAQ
    if (topRoute) {
        baseFAQs.push({
            question: `What is the fare from ${district.name} to ${topRoute.to} by ${label.toLowerCase()}?`,
            answer: `The ${label.toLowerCase()} fare from ${district.name} to ${topRoute.to} starts at approximately ₹${topRoute.fareEstimate} for a hatchback. The distance is about ${topRoute.distanceKm} km. Sedan fare would be around ₹${Math.round(topRoute.distanceKm * VEHICLE_TYPES[1].price)}, and SUV around ₹${Math.round(topRoute.distanceKm * VEHICLE_TYPES[2].price)}. Book now for exact pricing.`,
        });
    }

    // Service-type specific FAQs
    if (serviceType === 'drop-taxi') {
        baseFAQs.push({
            question: `Why is one-way drop taxi cheaper than round-trip in ${district.name}?`,
            answer: `With a round-trip taxi, you pay for the driver's return journey even though you only travel one way. Our ${district.name} drop taxi eliminates this inefficiency — you pay only for the distance YOU travel. This saves you up to 40% compared to round-trip fares. We match return rides for our drivers, making it economical for everyone.`,
        });
    } else if (serviceType === 'airport-taxi') {
        baseFAQs.push({
            question: `Do ${district.name} airport taxi drivers track flight delays?`,
            answer: `Yes, our ${district.name} airport taxi drivers actively monitor flight arrival times. If your flight is delayed, your driver will adjust pickup time automatically at no extra charge. We recommend booking at least 2 hours before your desired departure time for outgoing flights.`,
        });
    } else {
        baseFAQs.push({
            question: `Can I book a ${district.name} ${label.toLowerCase()} for someone else?`,
            answer: `Yes, you can easily book a ${label.toLowerCase()} in ${district.name} for family members, friends, or colleagues. Just provide the passenger's name and contact number during booking. The driver will coordinate directly with the passenger for pickup.`,
        });
    }

    baseFAQs.push({
        question: `Is it safe to book ${label.toLowerCase()} in ${district.name} with OneWayTaxi.ai?`,
        answer: `Absolutely. All our ${district.name} ${label.toLowerCase()} drivers are professionally trained, background-verified, and carry valid licenses. Our vehicles are GPS-tracked in real-time, regularly serviced, and fully insured. We have served over 50,000 happy customers across South India with a 4.8-star average rating.`,
    });

    // Additional high-value FAQs for better long-tail coverage
    baseFAQs.push({
        question: `What payment methods are accepted for ${district.name} ${label.toLowerCase()}?`,
        answer: `We accept multiple payment methods for ${district.name} ${label.toLowerCase()}: Cash, UPI (Google Pay, PhonePe, Paytm), credit cards, debit cards, and net banking. You can pay the driver directly in cash or via UPI at the end of your trip. No advance payment is required for booking.`,
    });

    baseFAQs.push({
        question: `Can I cancel my ${district.name} ${label.toLowerCase()} booking?`,
        answer: `Yes, you can cancel your ${district.name} ${label.toLowerCase()} booking free of charge up to 2 hours before the scheduled pickup time. Cancellations within 2 hours may attract a nominal cancellation fee. Contact our 24/7 support at +91 81244 76010 for cancellations or rescheduling.`,
    });

    // Add second route FAQ if available
    const secondRoute = district.popularRoutes[1];
    if (secondRoute) {
        baseFAQs.push({
            question: `How much does a taxi from ${district.name} to ${secondRoute.to} cost?`,
            answer: `A one-way taxi from ${district.name} to ${secondRoute.to} costs approximately ₹${secondRoute.fareEstimate} for a hatchback (${secondRoute.distanceKm} km). Sedan fare: ~₹${Math.round(secondRoute.distanceKm * VEHICLE_TYPES[1].price)}, SUV: ~₹${Math.round(secondRoute.distanceKm * (VEHICLE_TYPES[4]?.price || 19))}. All fares include toll, driver bata, and GST.`,
        });
    }

    return baseFAQs;
}

// ─── Review Data Generator ──────────────────────────────────

const REVIEWER_NAMES = [
    'Rajesh Kumar', 'Priya Sharma', 'Suresh Babu', 'Lakshmi Narayanan', 'Arun Prakash',
    'Meera Krishnan', 'Vikram Singh', 'Anitha Devi', 'Karthik Rajan', 'Deepa Venkatesh',
];

export function getReviews(district: District, serviceType: ServiceType): ReviewData[] {
    const label = SERVICE_LABELS[serviceType];
    const topRoutes = district.popularRoutes.slice(0, 5);

    // Deterministic review generation based on district name hash
    const hash = district.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    return [
        {
            name: REVIEWER_NAMES[hash % 10],
            rating: 5,
            text: `Excellent ${label.toLowerCase()} from ${district.name}! The driver was very professional and the car was clean and comfortable. Reached on time with no hassles. Will definitely book again.`,
            route: topRoutes[0] ? `${district.name} to ${topRoutes[0].to}` : district.name,
        },
        {
            name: REVIEWER_NAMES[(hash + 3) % 10],
            rating: 5,
            text: `Best ${label.toLowerCase()} service I've used in ${district.state}. The one-way pricing saved me almost 40% compared to other taxi services. Highly recommended for anyone traveling from ${district.name}.`,
            route: topRoutes[1] ? `${district.name} to ${topRoutes[1].to}` : district.name,
        },
        {
            name: REVIEWER_NAMES[(hash + 6) % 10],
            rating: 4,
            text: `Very good experience with OneWayTaxi.ai's ${label.toLowerCase()} from ${district.name}. The booking process was quick and the fare was exactly as quoted. No hidden charges at all. The AC was working perfectly throughout the journey.`,
            route: topRoutes[2] ? `${district.name} to ${topRoutes[2].to}` : district.name,
        },
        {
            name: REVIEWER_NAMES[(hash + 1) % 10],
            rating: 5,
            text: `I was skeptical about booking online but this ${label.toLowerCase()} from ${district.name} exceeded my expectations. The driver was punctual, courteous, and drove safely. Great value for money!`,
            route: topRoutes[3] ? `${district.name} to ${topRoutes[3].to}` : district.name,
        },

    ];
}

export function getComparisonData(district: District) {
    return [
        {
            feature: "Price Type",
            oneway: "Pay ONE-WAY only",
            normal: "Return fare chargeable",
            bus: "Fixed per person",
        },
        {
            feature: "Pickup",
            oneway: `Doorstep in ${district.name}`,
            normal: "Doorstep",
            bus: "Bus Stand only",
        },
        {
            feature: "Timings",
            oneway: "Any time (24/7)",
            normal: "Any time",
            bus: "Fixed Schedule",
        },
        {
            feature: "Comfort",
            oneway: "Private AC Car",
            normal: "Private AC Car",
            bus: "Shared / Crowded",
        },
        {
            feature: "Safety",
            oneway: "GPS Tracked & Verified",
            normal: "Varies",
            bus: "Public Space",
        },
    ];
}

export function getSafetyFeatures() {
    return [
        {
            title: "Verified Drivers",
            desc: "Criminal background checked & trained chauffeurs.",
            icon: "ShieldCheck"
        },
        {
            title: "24/7 Support",
            desc: "Round-the-clock assistance for peace of mind.",
            icon: "Headphones"
        },
        {
            title: "GPS Tracking",
            desc: "Real-time trip monitoring for safety.",
            icon: "MapPin"
        },
        {
            title: "Clean Cars",
            desc: "Sanitized & well-maintained fleet.",
            icon: "Sparkles"
        },
    ];
}

