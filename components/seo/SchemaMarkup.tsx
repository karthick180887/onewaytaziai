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


export default function SchemaMarkup({ district, serviceType, serviceLabel, faqs, avgRating, reviewCount }: SchemaMarkupProps) {
    const pageUrl = `https://onewaytaxi.ai/${serviceType}-in-${district.slug}`;

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


    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai/' },
            { '@type': 'ListItem', position: 2, name: `Drop Taxi in ${district.name}`, item: `https://onewaytaxi.ai/drop-taxi-in-${district.slug}` },
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
            url: `https://onewaytaxi.ai/drop-taxi-in-${route.toSlug}`,
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
