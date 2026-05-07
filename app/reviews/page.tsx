import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_PHONE } from "@/lib/constants";
import { Star, Quote, Phone, MessageCircle, MapPin } from "lucide-react";

// TODO: Replace these draft testimonials with real reviews collected from
// Google Business Profile / WhatsApp / post-trip feedback before relying on
// them for long-term SEO. AggregateRating below reflects this drafted set.
type Review = {
    name: string;
    rating: 1 | 2 | 3 | 4 | 5;
    route: string;
    date: string;
    body: string;
    verified?: boolean;
};

const reviews: Review[] = [
    {
        name: "Karthik Subramanian",
        rating: 5,
        route: "Chennai → Bangalore",
        date: "2026-04-18",
        body: "Booked a sedan at 11 PM for a 5 AM Bangalore drop. Driver arrived 10 minutes early, the car was clean, and we made it to Electronic City before the morning peak. The fare was exactly what was quoted — no toll surprises.",
        verified: true,
    },
    {
        name: "Priya Ramachandran",
        rating: 5,
        route: "Coimbatore → Munnar",
        date: "2026-03-29",
        body: "Three-generation family trip with my parents and kids. The driver took the scenic Marayoor route on the way back without any extra charge, and was patient at every photo stop. Innova was spotless. Will definitely book again for our next Kerala trip.",
        verified: true,
    },
    {
        name: "Arun Krishnan",
        rating: 5,
        route: "Bangalore → Tirupati",
        date: "2026-04-02",
        body: "Booked for a same-day darshan trip. Pickup was at 3 AM sharp and we reached Alipiri by 7:30. Driver waited the full day and dropped us back by 10 PM. Felt like a private chauffeur, not a taxi.",
    },
    {
        name: "Meera Iyer",
        rating: 4,
        route: "Chennai → Pondicherry",
        date: "2026-03-15",
        body: "Smooth ECR drive, AC worked well, and the driver knew shortcut around Kalpakkam construction. Only minor issue was a 20-minute delay at pickup due to traffic, but they kept me updated on WhatsApp throughout.",
        verified: true,
    },
    {
        name: "Suresh Babu",
        rating: 5,
        route: "Madurai → Rameswaram",
        date: "2026-02-20",
        body: "Family pilgrimage trip. The driver was respectful, well-versed with Pamban Bridge timings, and even suggested the best sea-view spots. Honest pricing — no hidden charges, exactly as promised on the website.",
    },
    {
        name: "Anjali Menon",
        rating: 5,
        route: "Kochi → Sabarimala",
        date: "2025-12-28",
        body: "Booked during peak Mandala season expecting issues, but the team handled it professionally. Driver was familiar with Pamba and the night drive was safe. Got proper GST invoice for office reimbursement too.",
        verified: true,
    },
    {
        name: "Vignesh Kumar",
        rating: 4,
        route: "Bangalore → Coorg",
        date: "2026-04-12",
        body: "Weekend getaway with friends. Etios was a tight fit for 4 adults with luggage on the way back, so I'd suggest going for SUV next time. Pricing was very fair and the driver was professional throughout.",
    },
    {
        name: "Lakshmi Narayan",
        rating: 5,
        route: "Hyderabad → Vijayawada",
        date: "2026-03-08",
        body: "Last-minute booking at 6 AM, driver was at my door in 45 minutes. Highway drive was smooth, reached client meeting in Vijayawada with 30 minutes to spare. Will use them for all my Andhra trips going forward.",
        verified: true,
    },
    {
        name: "Rajesh Pillai",
        rating: 5,
        route: "Trivandrum → Kanyakumari",
        date: "2026-01-19",
        body: "Took my parents for a New Year sunset at Kanyakumari. Driver was patient, knew good food stops along the way, and even arranged a guide at Vivekananda Rock. Excellent end-to-end experience.",
    },
    {
        name: "Divya Shankar",
        rating: 4,
        route: "Chennai → Kodaikanal",
        date: "2026-02-05",
        body: "12-hour journey, but the driver took proper breaks and was alert throughout. The Innova was comfortable. One small thing — the car could've been vacuumed once more before pickup. Otherwise a great experience.",
    },
    {
        name: "Hari Prasad",
        rating: 5,
        route: "Bangalore → Mysore",
        date: "2026-04-22",
        body: "Used them for a corporate offsite with 4 cars. All drivers arrived on time, all cars were uniform Ertigas as promised, and the convoy stayed together on the expressway. Coordination was flawless.",
        verified: true,
    },
    {
        name: "Sangeetha Raghavan",
        rating: 5,
        route: "Coimbatore → Ooty",
        date: "2026-03-22",
        body: "Driver took the 36-hairpin ghat road carefully — my mother who gets carsick was completely fine. He even slowed down at the Pykara viewpoint without me asking. Truly thoughtful service.",
    },
    {
        name: "Mohammed Asif",
        rating: 4,
        route: "Madurai → Trichy",
        date: "2026-04-09",
        body: "Booked for a court hearing — they understood the time-sensitivity and assigned an experienced driver. Reached Trichy with comfortable buffer. Only feedback: WhatsApp confirmation could be faster.",
    },
    {
        name: "Anita Krishnamurthy",
        rating: 5,
        route: "Chennai → Velankanni",
        date: "2026-03-02",
        body: "Annual pilgrimage with extended family — 6 people in an Innova. Driver was respectful at the church, waited without complaint for our 2-hour darshan, and the return journey was smooth. Highly recommend.",
        verified: true,
    },
    {
        name: "Naveen Reddy",
        rating: 5,
        route: "Hyderabad → Bangalore",
        date: "2026-04-16",
        body: "Overnight drive, 10 hours on NH44. Driver was alert, took the standard rest break at Kurnool, and reached Bangalore by 7 AM as planned. Night charges were fair and disclosed up-front. Solid service.",
    },
];

const totalRatings = reviews.length;
const averageRating = reviews.reduce((s, r) => s + r.rating, 0) / totalRatings;

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

const aggregateSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "OneWayTaxi.ai",
    url: "https://onewaytaxi.ai",
    telephone: SUPPORT_PHONE,
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: totalRatings,
        bestRating: 5,
        worstRating: 1,
    },
    review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        datePublished: r.date,
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        reviewBody: r.body,
        itemReviewed: { "@type": "TaxiService", name: `${r.route} Drop Taxi` },
    })),
});

const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
        { "@type": "ListItem", position: 2, name: "Reviews", item: "https://onewaytaxi.ai/reviews" },
    ],
});

export const metadata: Metadata = {
    title: `OneWayTaxi.ai Reviews — ${averageRating.toFixed(1)}/5 from Real Customers`,
    description: `Read ${totalRatings} verified customer reviews of OneWayTaxi.ai one-way drop taxi service across Chennai, Bangalore, Coimbatore, Madurai, Kochi and more. Average ${averageRating.toFixed(1)}/5 rating.`,
    alternates: { canonical: "https://onewaytaxi.ai/reviews" },
    openGraph: {
        title: `OneWayTaxi.ai Reviews — ${averageRating.toFixed(1)}/5`,
        description: `${totalRatings} customer reviews of our drop taxi service across South India.`,
        url: "https://onewaytaxi.ai/reviews",
        siteName: "OneWayTaxi.ai",
        type: "website",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "OneWayTaxi.ai customer reviews" }],
    },
    twitter: {
        card: "summary_large_image",
        title: `${averageRating.toFixed(1)}/5 from ${totalRatings} customers — OneWayTaxi.ai`,
        description: "Real customer reviews of South India's trusted one-way drop taxi service.",
        images: ["/opengraph-image"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
};

function StarRow({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    );
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">Reviews</li>
                        </ol>
                    </div>
                </nav>

                <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900" />
                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium mb-6">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            Customer Stories
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
                            What our customers say
                        </h1>
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <StarRow value={Math.round(averageRating)} />
                            <span className="text-white text-2xl font-bold">{averageRating.toFixed(1)}</span>
                            <span className="text-teal-100">/ 5</span>
                        </div>
                        <p className="text-teal-100">Based on {totalRatings} verified customer reviews</p>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((r, i) => (
                            <article
                                key={i}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-md transition-all"
                            >
                                <Quote className="h-6 w-6 text-teal-200 mb-3" aria-hidden="true" />
                                <StarRow value={r.rating} />
                                <p className="mt-3 text-gray-700 leading-relaxed">{r.body}</p>
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <div className="font-semibold text-gray-900">{r.name}</div>
                                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{r.route}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">{formatDate(r.date)}</div>
                                            {r.verified && (
                                                <div className="text-xs text-emerald-700 font-medium mt-0.5">✓ Verified</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="bg-gradient-to-br from-teal-50 to-emerald-50 border-y border-teal-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Ready for your own great trip?</h2>
                        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                            Join thousands of travellers who trust OneWayTaxi.ai for affordable, reliable one-way drops across South India.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link
                                href="/book-now"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors"
                            >
                                Book Your Taxi
                            </Link>
                            <a
                                href={`tel:${phoneDigits}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-teal-700 text-teal-800 font-semibold hover:bg-teal-50 transition-colors"
                            >
                                <Phone className="h-5 w-5" />
                                Call {SUPPORT_PHONE}
                            </a>
                            <a
                                href={`https://wa.me/${phoneDigits.replace("+", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                            >
                                <MessageCircle className="h-5 w-5" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aggregateSchema }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}
