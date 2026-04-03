import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Taxi Fare Calculator — Instant One Way Fare Estimate | OneWayTaxi.ai',
    description: 'Calculate one-way taxi fare instantly. Enter pickup & drop city to get exact fare for Sedan, SUV, Innova. ₹13/km onwards. No hidden charges. Call +91 81244 76010!',
    alternates: {
        canonical: 'https://onewaytaxi.ai/fare-calculator',
    },
    openGraph: {
        title: 'Taxi Fare Calculator — Get Instant Fare Estimate',
        description: 'Calculate one-way taxi fare between any two cities in South India. Sedan from ₹14/km, SUV from ₹19/km. All-inclusive pricing.',
        url: 'https://onewaytaxi.ai/fare-calculator',
        siteName: 'OneWayTaxi.ai',
        type: 'website',
        locale: 'en_IN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Taxi Fare Calculator | OneWayTaxi.ai',
        description: 'Instant fare estimate for one-way taxis across 120+ South Indian cities.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai/' },
        { '@type': 'ListItem', position: 2, name: 'Fare Calculator', item: 'https://onewaytaxi.ai/fare-calculator' },
    ],
};

const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'One Way Taxi Fare Calculator',
    url: 'https://onewaytaxi.ai/fare-calculator',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
    },
    provider: {
        '@type': 'Organization',
        name: 'OneWayTaxi.ai',
        url: 'https://onewaytaxi.ai',
    },
};

export default function FareCalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            {children}
        </>
    );
}
