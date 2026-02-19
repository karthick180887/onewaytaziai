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
    const taxiServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'TaxiService',
        name: `OneWayTaxi.ai — ${district.name} ${serviceLabel}`,
        description: `Premium ${serviceLabel.toLowerCase()} in ${district.name}, ${district.state}. One-way pricing, no return charges. Starting ₹${VEHICLE_TYPES[0].price}/km.`,
        url: `https://onewaytaxi.ai/${district.slug}-${serviceType}`,
        telephone: SUPPORT_PHONE.replace(/\s/g, ''),
        sameAs: [GOOGLE_MAPS_URL],
        areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: district.lat,
                longitude: district.lng,
            },
            geoRadius: "50000",
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Taxi Services",
            itemListElement: [
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "One Way Drop Taxi",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Round Trip Taxi",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Airport Taxi",
                    },
                },
            ],
        },
        priceRange: `₹${VEHICLE_TYPES[0].price} - ₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price} per km`,
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
            { '@type': 'ListItem', position: 2, name: district.state, item: `https://onewaytaxi.ai/${district.stateSlug}` },
            { '@type': 'ListItem', position: 3, name: district.name, item: `https://onewaytaxi.ai/${district.slug}-drop-taxi` },
            { '@type': 'ListItem', position: 4, name: serviceLabel, item: `https://onewaytaxi.ai/${district.slug}-${serviceType}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        </>
    );
}
