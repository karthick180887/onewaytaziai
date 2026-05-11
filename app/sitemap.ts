import type { MetadataRoute } from 'next';
import { ALL_DISTRICTS, SERVICE_TYPES } from '@/lib/districts';
import { getAllRoutes, hasRouteOverride } from '@/lib/routes';
import { getAllBlogSlugs } from '@/lib/blog-posts';
import { hasCityOverride } from '@/lib/seo-content';

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

// ─── lastmod strategy ─────────────────────────────────────────────────
// Google uses <lastmod> as a freshness hint for re-crawl prioritization.
// Stamping every URL with `now` (the old behaviour) gives zero signal —
// indistinguishable from a site that genuinely just updated everything.
//
// We tier the dates:
//   FRESH — pages with active hand-tuned content (overrides, recently
//   shipped features). Stamps with current build time. Google sees these
//   as recently updated and re-crawls promptly.
//
//   STALE — pages on the default auto-generated template that haven't
//   been hand-tuned. Stamps with STABLE_LASTMOD — a fixed past date that
//   tells Google "this page is stable, don't bother re-crawling often."
//   When we eventually hand-tune one (add a CITY_OVERRIDES or
//   ROUTE_OVERRIDES entry), it flips to FRESH on the next build.

const FRESH_LASTMOD = new Date();
const STABLE_LASTMOD = new Date('2025-08-01'); // pre-redirect-backlog work

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://onewaytaxi.ai';

    // Homepage — always FRESH, content evolves with district/route additions
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: FRESH_LASTMOD,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
    ];

    // State hub pages — FRESH (rendered from district data which changes)
    const stateSlugs = ['tamil-nadu', 'kerala', 'karnataka', 'andhra-pradesh', 'telangana', 'pondicherry'];
    for (const stateSlug of stateSlugs) {
        routes.push({
            url: `${baseUrl}/states/${stateSlug}`,
            lastModified: FRESH_LASTMOD,
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    }

    // District × Service pages — FRESH iff CITY_OVERRIDES has an entry
    for (const district of ALL_DISTRICTS) {
        for (const st of SERVICE_TYPES) {
            const priority = district.tier === 1 ? 0.9 : district.tier === 2 ? 0.7 : 0.5;
            const isOverridden = hasCityOverride(district.slug, st.id);
            routes.push({
                url: `${baseUrl}/${st.id}-in-${district.slug}`,
                lastModified: isOverridden ? FRESH_LASTMOD : STABLE_LASTMOD,
                changeFrequency: isOverridden ? 'weekly' : 'monthly',
                priority,
            });
        }
    }

    // City-to-city route pages — FRESH iff ROUTE_OVERRIDES has an entry
    const allRouteData = getAllRoutes();
    for (const route of allRouteData) {
        const priority = (route.from.tier === 1 && route.to.tier === 1) ? 0.85
            : (route.from.tier === 1 || route.to.tier === 1) ? 0.7
                : 0.5;
        const isOverridden = hasRouteOverride(route.from.slug, route.to.slug);
        routes.push({
            url: `${baseUrl}/route/${route.slug}`,
            lastModified: isOverridden ? FRESH_LASTMOD : STABLE_LASTMOD,
            changeFrequency: isOverridden ? 'weekly' : 'monthly',
            priority,
        });
    }

    // About page — STALE (rarely updated)
    routes.push({
        url: `${baseUrl}/about`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: 'monthly',
        priority: 0.7,
    });

    // Contact page — STALE
    routes.push({
        url: `${baseUrl}/contact`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: 'monthly',
        priority: 0.7,
    });

    // Fare calculator — STALE (logic stable)
    routes.push({
        url: `${baseUrl}/fare-calculator`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: 'monthly',
        priority: 0.8,
    });

    // All-Inclusive Pricing moat manifesto — FRESH (recently shipped, may iterate)
    routes.push({
        url: `${baseUrl}/all-inclusive-pricing`,
        lastModified: FRESH_LASTMOD,
        changeFrequency: 'monthly',
        priority: 0.85,
    });

    // Book now — FRESH (primary conversion path; iterates)
    routes.push({
        url: `${baseUrl}/book-now`,
        lastModified: FRESH_LASTMOD,
        changeFrequency: 'weekly',
        priority: 0.95,
    });

    // Service category hubs — FRESH (active content + AllInclusiveBadge rollout)
    const serviceHubs: { slug: string; priority: number }[] = [
        { slug: 'drop-taxi', priority: 0.85 },
        { slug: 'one-way-taxi', priority: 0.85 },
        { slug: 'outstation-cabs', priority: 0.85 },
        { slug: 'round-trip-taxi', priority: 0.8 },
        { slug: 'airport-taxi', priority: 0.85 },
    ];
    for (const hub of serviceHubs) {
        routes.push({
            url: `${baseUrl}/${hub.slug}`,
            lastModified: FRESH_LASTMOD,
            changeFrequency: 'weekly',
            priority: hub.priority,
        });
    }

    // Vehicle-type landing pages — STALE (fleet stable)
    const vehiclePages = [
        'sedan-taxi',
        'suv-taxi',
        'innova-crysta-taxi',
        'tempo-traveller',
        'luxury-taxi',
    ];
    for (const slug of vehiclePages) {
        routes.push({
            url: `${baseUrl}/${slug}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'monthly',
            priority: 0.75,
        });
    }

    // FAQ — FRESH (questions get added)
    routes.push({
        url: `${baseUrl}/faq`,
        lastModified: FRESH_LASTMOD,
        changeFrequency: 'monthly',
        priority: 0.65,
    });

    // Reviews — FRESH (new reviews land)
    routes.push({
        url: `${baseUrl}/reviews`,
        lastModified: FRESH_LASTMOD,
        changeFrequency: 'weekly',
        priority: 0.65,
    });

    // Terms / Privacy — STALE (legal, rarely changes)
    routes.push({
        url: `${baseUrl}/terms-and-conditions`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: 'yearly',
        priority: 0.4,
    });
    routes.push({
        url: `${baseUrl}/privacy-policy`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: 'yearly',
        priority: 0.4,
    });

    // Blog listing — FRESH (new posts appear)
    routes.push({
        url: `${baseUrl}/blog`,
        lastModified: FRESH_LASTMOD,
        changeFrequency: 'weekly',
        priority: 0.75,
    });

    // Individual blog posts — FRESH (long-form, may be updated for currency)
    for (const slug of getAllBlogSlugs()) {
        routes.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: FRESH_LASTMOD,
            changeFrequency: 'monthly',
            priority: 0.65,
        });
    }

    // Airport taxi pages — FRESH (recently touched in moat-page rollout)
    for (const slug of AIRPORT_SLUGS) {
        routes.push({
            url: `${baseUrl}/airport-taxi/${slug}`,
            lastModified: FRESH_LASTMOD,
            changeFrequency: 'weekly',
            priority: 0.85,
        });
    }

    return routes;
}
