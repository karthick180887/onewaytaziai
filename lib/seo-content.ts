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
};

const SERVICE_VERBS: Record<ServiceType, string> = {
    'drop-taxi': 'one-way drop taxi',
    'taxi-service': 'reliable taxi service',
    'outstation-cab': 'affordable outstation cab',
    'airport-taxi': 'convenient airport taxi',
};

// ─── SEO Content Generators ─────────────────────────────────

export function getSEOContent(district: District, serviceType: ServiceType): SEOContent {
    const label = SERVICE_LABELS[serviceType];
    const verb = SERVICE_VERBS[serviceType];
    const topRoute = district.popularRoutes[0];

    return {
        title: `${district.name} ${label} | Book One Way Cab — Save 40% | OneWayTaxi.ai`,
        metaDescription: `Book ${verb} in ${district.name}, ${district.state}. Starting ₹${VEHICLE_TYPES[0].price}/km. ${topRoute ? `Popular: ${district.name} to ${topRoute.to} at ₹${topRoute.fareEstimate}.` : ''} 24/7 service, verified drivers, no hidden charges.`,
        h1: `${district.name} ${label} — Book Now & Save 40%`,
        subtitle: `Premium ${verb} in ${district.name}, ${district.state}. Pay only for one way — no return fare, no hidden charges. Trusted by 50,000+ happy travelers across South India.`,
        keywords: [
            `${district.name.toLowerCase()} ${label.toLowerCase()}`,
            `${district.name.toLowerCase()} to ${topRoute?.to.toLowerCase() || 'bangalore'} taxi`,
            `${label.toLowerCase()} ${district.name.toLowerCase()}`,
            `one way taxi ${district.name.toLowerCase()}`,
            `${district.name.toLowerCase()} cab booking`,
            `outstation taxi ${district.name.toLowerCase()}`,
            `${district.name.toLowerCase()} ${district.state.toLowerCase()} taxi`,
            `cheap taxi ${district.name.toLowerCase()}`,
        ],
        serviceDescription: generateServiceDescription(district, serviceType),
    };
}

function generateServiceDescription(district: District, serviceType: ServiceType): string {
    const label = SERVICE_LABELS[serviceType];
    const verb = SERVICE_VERBS[serviceType];
    const topRoutes = district.popularRoutes.slice(0, 3);
    const routeText = topRoutes.map(r => `${district.name} to ${r.to} (${r.distanceKm} km, ~₹${r.fareEstimate})`).join(', ');

    const descriptions: Record<ServiceType, string> = {
        'drop-taxi': `Looking for a ${verb} in ${district.name}? OneWayTaxi.ai offers the most affordable one-way drop taxi service from ${district.name}, ${district.state}. Unlike round-trip taxis, you only pay for the distance you travel — saving up to 40% on your fare. Our fleet includes Hatchbacks (₹${VEHICLE_TYPES[0].price}/km), Sedans (₹${VEHICLE_TYPES[1].price}/km), SUVs (₹${VEHICLE_TYPES[2].price}/km), Innova Crysta (₹${VEHICLE_TYPES[3].price}/km), and Tempo Travellers (₹${VEHICLE_TYPES[4].price}/km). Popular routes: ${routeText}. All fares are inclusive of driver allowance, toll charges, and GST. Book your ${district.name} drop taxi now for a comfortable, safe, and budget-friendly journey.`,

        'taxi-service': `OneWayTaxi.ai is your trusted ${verb} in ${district.name}, ${district.state}. Whether you need a quick city ride or a long-distance outstation trip, we have you covered with our wide range of well-maintained, AC vehicles. Our professional, verified drivers ensure a safe and comfortable experience every time. Popular destinations from ${district.name}: ${routeText}. We offer transparent pricing with no surge charges or hidden fees. Available 24/7 for bookings.`,

        'outstation-cab': `Planning an outstation trip from ${district.name}? Book your ${verb} with OneWayTaxi.ai and enjoy hassle-free travel across ${district.state} and beyond. Our outstation cab service connects ${district.name} to major cities and tourist destinations with comfortable, AC vehicles. Top outstation routes: ${routeText}. With one-way pricing, you save significantly compared to traditional round-trip fares. All our vehicles are regularly serviced, GPS-tracked, and driven by experienced, background-verified drivers.`,

        'airport-taxi': `Need a reliable ${verb} in ${district.name}? OneWayTaxi.ai provides seamless airport transfer services with on-time pickups and drop-offs. Whether you're arriving at or departing from ${district.name}, our fleet of comfortable AC vehicles ensures a stress-free journey. Pre-book online and get instant fare estimates. Our drivers track flight timings to accommodate delays. No surge pricing, no meter tampering — just transparent, fixed-rate airport taxi service in ${district.name}, ${district.state}.`,
    };

    return descriptions[serviceType];
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

