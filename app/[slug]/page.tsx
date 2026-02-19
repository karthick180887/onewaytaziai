import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_DISTRICTS, getAllSlugs, parseSlug, SERVICE_TYPES } from '@/lib/districts';
import { resolveAlias } from '@/lib/seo-aliases';
import { getSEOContent, getFAQs, getReviews, getComparisonData, getSafetyFeatures } from '@/lib/seo-content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import DistrictHero from '@/components/seo/DistrictHero';
import PricingTable from '@/components/seo/PricingTable';
import PopularRoutes from '@/components/seo/PopularRoutes';
import ServiceHighlights from '@/components/seo/ServiceHighlights';
import FAQSection from '@/components/seo/FAQSection';
import ReviewsSection from '@/components/seo/ReviewsSection';
import RelatedDistricts from '@/components/seo/RelatedDistricts';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ComparisonTable from '@/components/seo/ComparisonTable';
import SafetyFeatures from '@/components/seo/SafetyFeatures';

// ... (existing imports and code)

// ─── Static Params (SSG for all 460+ slugs) ─────────────────
export function generateStaticParams() {
    return getAllSlugs().map(slug => ({ slug }));
}

// ─── Dynamic Metadata ────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug: rawSlug } = await params;
    const resolvedSlug = resolveAlias(rawSlug);
    const parsed = parseSlug(resolvedSlug);
    if (!parsed) return { title: 'Page Not Found' };

    const { district, serviceType } = parsed;
    const seo = getSEOContent(district, serviceType.id);

    return {
        title: seo.title,
        description: seo.metaDescription,
        keywords: seo.keywords,
        openGraph: {
            title: seo.title,
            description: seo.metaDescription,
            url: `https://onewaytaxi.ai/${district.slug}-${serviceType.id}`,
            siteName: 'OneWayTaxi.ai',
            type: 'website',
        },
        alternates: {
            canonical: `https://onewaytaxi.ai/${district.slug}-${serviceType.id}`,
        },
    };
}

// ─── Page Component ──────────────────────────────────────────
export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: rawSlug } = await params;
    const resolvedSlug = resolveAlias(rawSlug);
    const parsed = parseSlug(resolvedSlug);

    if (!parsed) notFound();

    const { district, serviceType } = parsed;
    const seo = getSEOContent(district, serviceType.id);
    const faqs = getFAQs(district, serviceType.id);
    const reviews = getReviews(district, serviceType.id);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const comparisonData = getComparisonData(district);
    const safetyFeatures = getSafetyFeatures();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <BreadcrumbNav
                state={district.state}
                stateSlug={district.stateSlug}
                districtName={district.name}
                districtSlug={district.slug}
                serviceLabel={serviceType.label}
            />
            <DistrictHero
                district={district}
                serviceType={serviceType.id}
                h1={seo.h1}
                subtitle={seo.subtitle}
            />

            <SafetyFeatures features={safetyFeatures} />

            {/* Service Description */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-gray-700 leading-relaxed text-lg">{seo.serviceDescription}</p>
                </div>
            </section>

            <PricingTable districtName={district.name} />
            <PopularRoutes districtName={district.name} routes={district.popularRoutes} />
            <ServiceHighlights />
            <ComparisonTable data={comparisonData} />
            <FAQSection districtName={district.name} serviceLabel={serviceType.label} faqs={faqs} />
            <ReviewsSection districtName={district.name} reviews={reviews} />
            <RelatedDistricts currentDistrict={district} currentServiceType={serviceType.id} />
            <Footer />
            <SchemaMarkup
                district={district}
                serviceType={serviceType.id}
                serviceLabel={serviceType.label}
                faqs={faqs}
                avgRating={avgRating}
                reviewCount={reviews.length * 250}
            />


        </div>
    );
}
