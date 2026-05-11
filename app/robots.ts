import type { MetadataRoute } from 'next';

const OLD_PATTERN_DISALLOW = [
    '/*-outstation-cab$',
    '/*-outstation-cab/$',
    '/*-outstation-cabs$',
    '/*-outstation-cabs/$',
    '/*-airport-taxi$',
    '/*-airport-taxi/$',
    '/*-one-way-taxi$',
    '/*-one-way-taxi/$',
    '/*-taxi-service$',
    '/*-taxi-service/$',
    '/*-cab-service$',
    '/*-cab-service/$',
    '/*-drop-taxi$',
    '/*-drop-taxi/$',
    '/*-call-taxi$',
    '/*-call-taxi/$',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', ...OLD_PATTERN_DISALLOW],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: OLD_PATTERN_DISALLOW,
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: OLD_PATTERN_DISALLOW,
            },
            // Allow AI crawlers for GEO (Generative Engine Optimization) — no disallow.
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
            },
        ],
        sitemap: 'https://onewaytaxi.ai/sitemap.xml',
    };
}
