import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_DISTRICTS, getAllSlugs, parseSlug, SERVICE_TYPES } from '@/lib/districts';
import { resolveAlias } from '@/lib/seo-aliases';
import { getSEOContent, getFAQs, getReviews, getComparisonData, getSafetyFeatures, getWhyChooseUs } from '@/lib/seo-content';
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
import RouteDetails from '@/components/seo/RouteDetails';
import TrustBanner from '@/components/seo/TrustBanner';

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
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${district.name} ${serviceType.label} — Book Now | OneWayTaxi.ai`,
            description: seo.metaDescription,
        },
        alternates: {
            canonical: `https://onewaytaxi.ai/${district.slug}-${serviceType.id}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
            },
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
    const whyChooseUs = getWhyChooseUs(district);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
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

                {/* Definition Block — AI-citeable passage */}
                <section className="py-12 bg-white" aria-label={`What is ${district.name} ${serviceType.label}`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            What is {district.name} {serviceType.label}?
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {district.name} {serviceType.label.toLowerCase()} from OneWayTaxi.ai is a one-way cab service where passengers pay only for the distance traveled from {district.name}, {district.state} to their destination — no return fare charged. Fares start at ₹{13}/km for a hatchback, covering {district.popularRoutes.length > 0 ? `popular routes like ${district.name} to ${district.popularRoutes[0].to} (${district.popularRoutes[0].distanceKm} km, ~₹${district.popularRoutes[0].fareEstimate})${district.popularRoutes.length > 1 ? ` and ${district.name} to ${district.popularRoutes[1].to} (${district.popularRoutes[1].distanceKm} km, ~₹${district.popularRoutes[1].fareEstimate})` : ''}` : 'all major intercity routes'}. All vehicles are air-conditioned, GPS-tracked, and driven by background-verified drivers. Fares include driver bata, toll charges, inter-state permits, and GST with no hidden costs. Available 24/7 with booking online or at +91 81244 76010.
                        </p>
                    </div>
                </section>

                {/* Service Description */}
                <section className="py-12 bg-gray-50" aria-label="Service description">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: seo.serviceDescription
                                    .replace(/### (.+)/g, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h3>')
                                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                    .split('\n\n')
                                    .map(p => p.startsWith('<h3') ? p : `<p>${p}</p>`)
                                    .join('\n')
                            }}
                        />
                    </div>
                </section>

                <TrustBanner />

                <PricingTable districtName={district.name} />
                <PopularRoutes districtName={district.name} routes={district.popularRoutes} />
                <RouteDetails district={district} serviceLabel={serviceType.label} />
                <ServiceHighlights features={whyChooseUs} />
                <ComparisonTable data={comparisonData} />
                <FAQSection districtName={district.name} serviceLabel={serviceType.label} faqs={faqs} />
                <ReviewsSection districtName={district.name} reviews={reviews} />
                <RelatedDistricts currentDistrict={district} currentServiceType={serviceType.id} />
            </main>
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
