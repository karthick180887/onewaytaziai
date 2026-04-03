import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
    title: 'One Way Taxi Blog — Travel Guides, Fare Tips & Intercity Cab Advice',
    description: 'Expert articles on one-way taxi booking, intercity cab fares, drop taxi guides, South India route tips, and how to save money on outstation travel.',
    keywords: [
        'one way taxi blog', 'drop taxi guide India', 'intercity cab tips',
        'outstation taxi advice', 'one way cab fare guide', 'South India travel tips',
    ],
    alternates: {
        canonical: 'https://onewaytaxi.ai/blog',
    },
    openGraph: {
        title: 'OneWayTaxi.ai Blog — Drop Taxi Guides & Intercity Travel Tips',
        description: 'Expert guides on one-way taxi booking, route fares, hidden charges, and how to save 40% on your next outstation trip.',
        url: 'https://onewaytaxi.ai/blog',
        siteName: 'OneWayTaxi.ai',
        type: 'website',
        locale: 'en_IN',
        images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'OneWayTaxi.ai Blog' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Drop Taxi Guides & Travel Tips | OneWayTaxi.ai Blog',
        description: 'Expert guides on one-way taxi booking and saving 40% on outstation travel.',
        images: ['/opengraph-image'],
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

const CATEGORY_COLORS: Record<string, string> = {
    'Guide': 'bg-teal-100 text-teal-800',
    'Comparison': 'bg-blue-100 text-blue-800',
    'Routes': 'bg-orange-100 text-orange-800',
};

export default function BlogListPage() {
    const sortedPosts = [...BLOG_POSTS].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onewaytaxi.ai/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://onewaytaxi.ai/blog' },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Header />
            <main>
                {/* Hero */}
                <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-2">
                            OneWayTaxi.ai Blog
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Drop Taxi Guides & Intercity Travel Tips
                        </h1>
                        <p className="text-teal-100 text-lg max-w-2xl mx-auto">
                            Expert advice on one-way cab booking, fare comparisons, route guides,
                            and how to save 40% on your next outstation trip.
                        </p>
                    </div>
                </section>

                {/* Breadcrumb */}
                <nav className="bg-white border-b border-gray-200 py-3 px-4" aria-label="Breadcrumb">
                    <div className="max-w-6xl mx-auto">
                        <ol className="flex items-center gap-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li aria-hidden="true">/</li>
                            <li className="text-gray-900 font-medium">Blog</li>
                        </ol>
                    </div>
                </nav>

                {/* Posts Grid */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedPosts.map(post => (
                            <article
                                key={post.slug}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col"
                            >
                                <div className="p-6 flex flex-col flex-1">
                                    {/* Category + Read time */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-gray-400">{post.readTimeMinutes} min read</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="hover:text-teal-700 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <time
                                            dateTime={post.publishedAt}
                                            className="text-xs text-gray-400"
                                        >
                                            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            })}
                                        </time>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                                            aria-label={`Read: ${post.title}`}
                                        >
                                            Read more →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="bg-teal-50 border-y border-teal-100 py-12 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-teal-900 mb-3">
                            Ready to Book Your One Way Taxi?
                        </h2>
                        <p className="text-teal-700 mb-6">
                            Pay only for one way. No return charges. 115+ cities across South India.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/"
                                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                            >
                                Book a Taxi Now
                            </Link>
                            <Link
                                href="/fare-calculator"
                                className="border border-teal-700 text-teal-700 hover:bg-teal-50 font-semibold py-3 px-8 rounded-lg transition-colors"
                            >
                                Calculate Fare
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
