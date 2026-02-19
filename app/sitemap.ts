import type { MetadataRoute } from 'next';
import { ALL_DISTRICTS, SERVICE_TYPES } from '@/lib/districts';

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

    // District × Service pages
    for (const district of ALL_DISTRICTS) {
        for (const st of SERVICE_TYPES) {
            const priority = district.tier === 1 ? 0.9 : district.tier === 2 ? 0.7 : 0.5;
            routes.push({
                url: `${baseUrl}/${district.slug}-${st.id}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority,
            });
        }
    }

    return routes;
}
