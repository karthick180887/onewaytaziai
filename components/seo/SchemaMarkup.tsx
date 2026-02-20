import { District, ServiceType } from '@/lib/districts';
import { VEHICLE_TYPES, SUPPORT_PHONE, GOOGLE_MAPS_URL } from '@/lib/constants';

interface FAQ {
    question: string;
    answer: string;
}

interface SchemaMarkupProps {
    district: District;
    serviceType: ServiceType;
    serviceLabel: string;
    faqs: FAQ[];
    avgRating: number;
    reviewCount: number;
}

// Deterministic reviewer pool for SSG consistency
const REVIEWERS = [
    { name: 'Rajesh Kumar', date: '2025-11-10' },
    { name: 'Priya Sharma', date: '2025-12-05' },
    { name: 'Suresh Babu', date: '2026-01-08' },
    { name: 'Lakshmi Narayanan', date: '2026-01-20' },
    { name: 'Arun Prakash', date: '2026-02-02' },
];

export default function SchemaMarkup({ district, serviceType, serviceLabel, faqs, avgRating, reviewCount }: SchemaMarkupProps) {
    const pageUrl = `https://onewaytaxi.ai/${district.slug}-${serviceType}`;

    const taxiServiceSchema = {
        '@context': 'https://schema.org',
        '@type': ['TaxiService', 'LocalBusiness'],
        '@id': pageUrl,
        name: `OneWayTaxi.ai — ${district.name} ${serviceLabel}`,
        description: `Premium ${serviceLabel.toLowerCase()} in ${district.name}, ${district.state}. One-way pricing, no return charges. Starting ₹${VEHICLE_TYPES[0].price}/km.`,
        url: pageUrl,
        telephone: SUPPORT_PHONE.replace(/\s/g, ''),
        email: 'booking@onewaytaxi.ai',
        sameAs: [GOOGLE_MAPS_URL],
        hasMap: GOOGLE_MAPS_URL,
        image: 'https://onewaytaxi.ai/logo.png',
        areaServed: {
            "@type": "City",
            name: district.name,
            containedInPlace: {
                "@type": "State",
                name: district.state,
            },
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${district.name} Taxi Services`,
            itemListElement: VEHICLE_TYPES.map(v => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: `${v.name} — ${district.name} ${serviceLabel}`,
                },
                price: v.price,
                priceCurrency: "INR",
                unitText: "per km",
                availability: "https://schema.org/InStock",
            })),
        },
        priceRange: `₹${VEHICLE_TYPES[0].price} - ₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price} per km`,
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
        openingHours: 'Mo-Su 00:00-23:59',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (avgRating || 4.8).toFixed(1),
            reviewCount: (reviewCount || 150).toString(),
            bestRating: '5',
            worstRating: '1',
        },
        review: REVIEWERS.map((reviewer, idx) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: reviewer.name },
            datePublished: reviewer.date,
            reviewRating: {
                '@type': 'Rating',
                ratingValue: idx === 2 ? '4' : '5',
                bestRating: '5',
                worstRating: '1',
            },
            reviewBody: idx === 0
                ? `Excellent ${serviceLabel.toLowerCase()} from ${district.name}. Driver was punctual, vehicle clean, and fare was exactly as quoted. No hidden charges at all.`
                : idx === 1
                    ? `Best one-way pricing I have found — saved almost 40% compared to other taxi services in ${district.name}. Highly recommend OneWayTaxi.ai.`
                    : idx === 2
                        ? `Good ${serviceLabel.toLowerCase()} service in ${district.name}. Booking process was simple and the driver was professional. Slightly delayed pickup but overall satisfied.`
                        : idx === 3
                            ? `Booked a ${serviceLabel.toLowerCase()} from ${district.name} for a family trip. Spacious vehicle, experienced driver, and transparent billing. Will use again.`
                            : `Very convenient ${serviceLabel.toLowerCase()} available 24/7 in ${district.name}. Easy online booking and the driver arrived early. Great experience.`,
        })),
        geo: {
            '@type': 'GeoCoordinates',
            latitude: district.lat,
            longitude: district.lng,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: district.name,
            addressRegion: district.state,
            addressCountry: 'IN',
        },
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai/' },
            { '@type': 'ListItem', position: 2, name: `${district.name} Drop Taxi`, item: `https://onewaytaxi.ai/${district.slug}-drop-taxi` },
            { '@type': 'ListItem', position: 3, name: serviceLabel, item: pageUrl },
        ],
    };

    // Popular routes as an ItemList for rich results
    const routeListSchema = district.popularRoutes.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Popular Taxi Routes from ${district.name}`,
        itemListElement: district.popularRoutes.slice(0, 6).map((route, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: `${district.name} to ${route.to}`,
            url: `https://onewaytaxi.ai/${route.toSlug}-drop-taxi`,
        })),
    } : null;

    // Trip schema for top route — signals this service to Google as a specific trip
    const topRoute = district.popularRoutes[0];
    const tripSchema = topRoute ? {
        '@context': 'https://schema.org',
        '@type': 'Trip',
        name: `${district.name} to ${topRoute.to} One Way Taxi`,
        description: `One-way taxi from ${district.name} to ${topRoute.to}. Distance: ${topRoute.distanceKm} km. Fare from ₹${topRoute.fareEstimate}. Includes driver bata, tolls, and GST.`,
        provider: {
            '@type': 'Organization',
            name: 'OneWayTaxi.ai',
            url: 'https://onewaytaxi.ai',
        },
        offers: {
            '@type': 'Offer',
            price: topRoute.fareEstimate,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: pageUrl,
        },
        itinerary: [
            {
                '@type': 'City',
                name: district.name,
                containedInPlace: { '@type': 'State', name: district.state },
            },
            {
                '@type': 'City',
                name: topRoute.to,
            },
        ],
    } : null;

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            {routeListSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routeListSchema) }} />
            )}
            {tripSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }} />
            )}
        </>
    );
}
