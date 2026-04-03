import type { MetadataRoute } from 'next';
import { ALL_DISTRICTS, SERVICE_TYPES } from '@/lib/districts';
import { getAllRoutes } from '@/lib/routes';
import { getAllBlogSlugs } from '@/lib/blog-posts';

const AIRPORT_SLUGS = [
    'chennai-airport',
    'bangalore-airport',
    'hyderabad-airport',
    'kochi-airport',
    'coimbatore-airport',
    'madurai-airport',
    'trichy-airport',
    'trivandrum-airport',
    'mangalore-airport',
    'calicut-airport',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://onewaytaxi.ai';
    const now = new Date();

    // Homepage
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
    ];

    // State hub pages
    const stateSlugs = ['tamil-nadu', 'kerala', 'karnataka', 'andhra-pradesh', 'telangana', 'pondicherry'];
    for (const stateSlug of stateSlugs) {
        routes.push({
            url: `${baseUrl}/states/${stateSlug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    }

    // District × Service pages
    for (const district of ALL_DISTRICTS) {
        for (const st of SERVICE_TYPES) {
            const priority = district.tier === 1 ? 0.9 : district.tier === 2 ? 0.7 : 0.5;
            routes.push({
                url: `${baseUrl}/${st.id}-in-${district.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority,
            });
        }
    }

    // City-to-city route pages
    const allRouteData = getAllRoutes();
    for (const route of allRouteData) {
        const priority = (route.from.tier === 1 && route.to.tier === 1) ? 0.85
            : (route.from.tier === 1 || route.to.tier === 1) ? 0.7
                : 0.5;
        routes.push({
            url: `${baseUrl}/route/${route.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority,
        });
    }

    // About page
    routes.push({
        url: `${baseUrl}/about`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    });

    // Contact page
    routes.push({
        url: `${baseUrl}/contact`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    });

    // Fare calculator page
    routes.push({
        url: `${baseUrl}/fare-calculator`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
    });

    // Blog listing page
    routes.push({
        url: `${baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
    });

    // Individual blog posts
    for (const slug of getAllBlogSlugs()) {
        routes.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.65,
        });
    }

    // Airport taxi pages
    for (const slug of AIRPORT_SLUGS) {
        routes.push({
            url: `${baseUrl}/airport-taxi/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        });
    }

    return routes;
}
