import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BLOG_POSTS, getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blog-posts';
import { escapeJsonLd } from '@/lib/schema-utils';

// ─── Static Params ────────────────────────────────────────────
export function generateStaticParams() {
    return getAllBlogSlugs().map(slug => ({ slug }));
}

// ─── Dynamic Metadata ─────────────────────────────────────────
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) return { title: 'Article Not Found' };

    return {
        title: post.metaTitle,
        description: post.metaDescription,
        keywords: post.keywords,
        authors: [{ name: 'OneWayTaxi.ai Editorial Team' }],
        alternates: {
            canonical: `https://onewaytaxi.ai/blog/${post.slug}`,
        },
        openGraph: {
            title: post.metaTitle,
            description: post.metaDescription,
            url: `https://onewaytaxi.ai/blog/${post.slug}`,
            siteName: 'OneWayTaxi.ai',
            type: 'article',
            locale: 'en_IN',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            section: post.category,
            tags: post.keywords,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.metaTitle,
            description: post.metaDescription,
        },
    };
}

// ─── Page Component ───────────────────────────────────────────
export default async function BlogArticlePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) notFound();

    const relatedPosts = BLOG_POSTS
        .filter(p => p.slug !== post.slug)
        .slice(0, 3);

    // Article Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
            '@type': 'Organization',
            name: 'OneWayTaxi.ai Editorial Team',
            url: 'https://onewaytaxi.ai',
        },
        publisher: {
            '@type': 'Organization',
            name: 'OneWayTaxi.ai',
            logo: {
                '@type': 'ImageObject',
                url: 'https://onewaytaxi.ai/logo.png',
            },
        },
        image: {
            '@type': 'ImageObject',
            url: 'https://onewaytaxi.ai/opengraph-image',
            width: 1200,
            height: 630,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://onewaytaxi.ai/blog/${post.slug}`,
        },
        keywords: post.keywords.join(', '),
        articleSection: post.category,
        inLanguage: 'en-IN',
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://onewaytaxi.ai/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://onewaytaxi.ai/blog/${post.slug}` },
        ],
    };

    // Optional FAQPage schema (when post defines `faqs`)
    const faqSchema = post.faqs && post.faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        }
        : null;

    const CATEGORY_COLORS: Record<string, string> = {
        'Guide': 'bg-teal-100 text-teal-800',
        'Comparison': 'bg-blue-100 text-blue-800',
        'Routes': 'bg-orange-100 text-orange-800',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(articleSchema)) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbSchema)) }} />
            {faqSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(faqSchema)) }} />
            )}
            {post.additionalSchemas?.map((s, i) => (
                <script key={`extra-schema-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(s)) }} />
            ))}
            <Header />
            <main>
                {/* Breadcrumb */}
                <nav className="bg-white border-b border-gray-200 py-3 px-4" aria-label="Breadcrumb">
                    <div className="max-w-4xl mx-auto">
                        <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li aria-hidden="true">/</li>
                            <li><Link href="/blog" className="hover:text-teal-700">Blog</Link></li>
                            <li aria-hidden="true">/</li>
                            <li className="text-gray-900 font-medium truncate max-w-xs">{post.title}</li>
                        </ol>
                    </div>
                </nav>

                {/* Article Header */}
                <header className="bg-gradient-to-br from-teal-900 to-teal-700 py-14 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
                                {post.category}
                            </span>
                            <span className="text-teal-300 text-xs">{post.readTimeMinutes} min read</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                            {post.title}
                        </h1>
                        <p className="text-teal-100 text-lg mb-6">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-teal-300">
                            <span>By OneWayTaxi.ai Editorial Team</span>
                            <span>·</span>
                            <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </time>
                            {post.updatedAt !== post.publishedAt && (
                                <>
                                    <span>·</span>
                                    <span>
                                        Updated {new Date(post.updatedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Article Body + Sidebar */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Main Content */}
                        <article className="lg:flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
                            <div
                                className="prose prose-lg prose-teal max-w-none
                                    prose-headings:font-bold prose-headings:text-gray-900
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                    prose-p:text-gray-700 prose-p:leading-relaxed
                                    prose-li:text-gray-700 prose-li:leading-relaxed
                                    prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline
                                    prose-table:text-sm prose-th:bg-teal-50 prose-th:text-teal-900
                                    prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Visible FAQs (mirrors FAQPage schema for rich results) */}
                            {post.faqs && post.faqs.length > 0 && (
                                <section className="mt-10 pt-8 border-t border-gray-100" aria-label="Frequently asked questions">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
                                    <div className="space-y-3">
                                        {post.faqs.map((f, i) => (
                                            <details key={i} className="group bg-gray-50 rounded-xl border border-gray-200 hover:border-teal-300">
                                                <summary className="cursor-pointer list-none p-4 flex items-start justify-between gap-4">
                                                    <span className="font-semibold text-gray-900 group-open:text-teal-800">{f.q}</span>
                                                    <span aria-hidden className="text-teal-700 mt-0.5 transition-transform group-open:rotate-90 shrink-0">→</span>
                                                </summary>
                                                <div className="px-4 pb-4 text-gray-700 leading-relaxed">{f.a}</div>
                                            </details>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Article Tags */}
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Topics</p>
                                <div className="flex flex-wrap gap-2">
                                    {post.keywords.slice(0, 5).map(kw => (
                                        <span
                                            key={kw}
                                            className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:w-72 flex flex-col gap-6">
                            {/* Quick Booking */}
                            <div className="bg-teal-900 text-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2">Book One Way Taxi</h3>
                                <p className="text-teal-200 text-sm mb-4">
                                    Pay only for one way. No return charges. 24/7 service.
                                </p>
                                <Link
                                    href="/"
                                    className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-center py-3 rounded-lg transition-colors"
                                >
                                    Book Now — Get Instant Fare
                                </Link>
                                <a
                                    href="tel:+918124476010"
                                    className="mt-3 block w-full border border-teal-500 text-teal-200 hover:bg-teal-800 text-center py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    📞 +91 81244 76010
                                </a>
                            </div>

                            {/* Fare Calculator CTA */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-bold text-gray-900 mb-2">Estimate Your Fare</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Use our free fare calculator to get an instant price for your route.
                                </p>
                                <Link
                                    href="/fare-calculator"
                                    className="block w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-center py-2.5 rounded-lg transition-colors text-sm"
                                >
                                    Open Fare Calculator →
                                </Link>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
                                    <ul className="flex flex-col gap-4">
                                        {relatedPosts.map(related => (
                                            <li key={related.slug}>
                                                <Link
                                                    href={`/blog/${related.slug}`}
                                                    className="group block"
                                                >
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block ${CATEGORY_COLORS[related.category] ?? 'bg-gray-100 text-gray-700'}`}>
                                                        {related.category}
                                                    </span>
                                                    <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700 leading-snug transition-colors">
                                                        {related.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {related.readTimeMinutes} min read
                                                    </p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/blog"
                                        className="block text-center text-sm text-teal-700 font-medium mt-5 hover:underline"
                                    >
                                        View all articles →
                                    </Link>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
