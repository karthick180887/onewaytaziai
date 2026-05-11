import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { SUPPORT_PHONE } from "@/lib/constants";
import { escapeJsonLd } from "@/lib/schema-utils";
import {
    Phone,
    MessageCircle,
    ArrowRight,
    Users,
    Luggage,
    Snowflake,
    Shield,
    Music,
    type LucideIcon,
} from "lucide-react";

const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

const safeJsonLd = (data: object): string => escapeJsonLd(JSON.stringify(data));

export type VehicleSpec = {
    label: string;
    value: string;
};

export type RouteLink = {
    fromName: string;
    toName: string;
    slug: string;
    distanceKm: number;
    fareEstimate: number;
};

export type VehicleFaq = { q: string; a: string };

export type VehicleLandingProps = {
    pageSlug: string; // e.g. "sedan-taxi"
    breadcrumbLabel: string;
    h1: string;
    tagline: string;
    intro: string[]; // paragraphs

    pricePerKm: number;
    seatCapacity: number;
    typicalModels: string[];
    bagCapacity: string;
    headerIcon: LucideIcon;

    keyFeatures: { icon: LucideIcon; title: string; text: string }[];
    idealFor: { title: string; text: string }[];
    specs: VehicleSpec[];
    popularRoutes: RouteLink[];
    faqs: VehicleFaq[];
};

export default function VehicleLanding(props: VehicleLandingProps) {
    const {
        pageSlug,
        breadcrumbLabel,
        h1,
        tagline,
        intro,
        pricePerKm,
        seatCapacity,
        typicalModels,
        bagCapacity,
        headerIcon: HeaderIcon,
        keyFeatures,
        idealFor,
        specs,
        popularRoutes,
        faqs,
    } = props;

    const url = `https://onewaytaxi.ai/${pageSlug}`;

    const faqSchema = safeJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
        })),
    });

    const productSchema = safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Product",
        name: h1,
        description: intro[0],
        brand: { "@type": "Organization", name: "OneWayTaxi.ai" },
        offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: pricePerKm,
            priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: pricePerKm,
                priceCurrency: "INR",
                unitText: "per km",
                referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
                valueAddedTaxIncluded: true,
            },
            availability: "https://schema.org/InStock",
            url,
        },
    });

    const breadcrumbSchema = safeJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai" },
            { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
        ],
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">{breadcrumbLabel}</li>
                        </ol>
                    </div>
                </nav>

                <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            <div className="text-center lg:text-left space-y-6 pt-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium">
                                    <HeaderIcon className="h-4 w-4 text-emerald-300" /> {breadcrumbLabel}
                                </div>
                                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">{h1}</h1>
                                <p className="text-lg text-teal-100 max-w-xl">{tagline}</p>

                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm">
                                        <Users className="h-4 w-4" /> {seatCapacity} seats
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm">
                                        <Luggage className="h-4 w-4" /> {bagCapacity}
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-sm font-bold">
                                        ₹{pricePerKm}/km
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">
                                        Book Now <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                                        <Phone className="h-5 w-5" /> {SUPPORT_PHONE}
                                    </a>
                                </div>
                            </div>
                            <div className="lg:sticky lg:top-24"><BookingWidget /></div>
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-6">About this vehicle</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            {intro.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">What you get</h2>
                        <p className="text-center text-gray-600 mb-10">Standard inclusions on every {breadcrumbLabel.toLowerCase()} booking</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {keyFeatures.map(({ icon: Icon, title, text }) => (
                                <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100 text-teal-700 mb-4">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1.5">{title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Ideal for</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                            {idealFor.map(({ title, text }) => (
                                <div key={title} className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6">
                                    <h3 className="font-bold text-lg text-teal-900 mb-2">{title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-3">Specifications</h2>
                        <p className="text-center text-gray-600 mb-10">Typical models: {typicalModels.join(", ")}</p>
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <dl className="divide-y divide-gray-100">
                                {specs.map(({ label, value }) => (
                                    <div key={label} className="grid grid-cols-2 px-5 py-4">
                                        <dt className="font-semibold text-gray-700">{label}</dt>
                                        <dd className="text-gray-900">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </section>

                {popularRoutes.length > 0 && (
                    <section className="py-12 lg:py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 mb-3">Popular routes for this vehicle</h2>
                            <p className="text-gray-600 mb-8">Route fares shown for {breadcrumbLabel.toLowerCase()} category. Click for full route details.</p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {popularRoutes.map((r) => (
                                    <Link key={r.slug} href={`/route/${r.slug}`} className="group bg-gray-50 hover:bg-white hover:shadow-md rounded-xl border border-gray-200 hover:border-teal-300 p-4 transition-all">
                                        <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-900">
                                            <span>{r.fromName}</span>
                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
                                            <span>{r.toName}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{r.distanceKm} km</span>
                                            <span className="font-bold text-teal-700">~₹{Math.round(r.distanceKm * pricePerKm).toLocaleString("en-IN")}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="py-12 lg:py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-10">Frequently asked questions</h2>
                        <div className="space-y-3">
                            {faqs.map((f, i) => (
                                <details key={i} className="group bg-white rounded-xl border border-gray-200 hover:border-teal-300">
                                    <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                                        <span className="font-semibold text-gray-900 group-open:text-teal-800">{f.q}</span>
                                        <ArrowRight className="h-5 w-5 mt-0.5 text-teal-700 transition-transform group-open:rotate-90 shrink-0" />
                                    </summary>
                                    <div className="px-5 pb-5 text-gray-700 leading-relaxed">{f.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-teal-700 to-emerald-700 py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Book your {breadcrumbLabel.toLowerCase()} now</h2>
                        <p className="text-teal-100 mb-6">From ₹{pricePerKm}/km. All-inclusive. 24/7 across 220+ cities.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/book-now" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-teal-50">Book Now <ArrowRight className="h-5 w-5" /></Link>
                            <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold"><Phone className="h-5 w-5" /> Call Us</a>
                            <a href={`https://wa.me/${phoneDigits.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"><MessageCircle className="h-5 w-5" /> WhatsApp</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            {/*
              JSON-LD structured data. Inputs are entirely server-controlled (props
              passed from page files using static lib/constants.ts data — no user
              input ever reaches these strings). `safeJsonLd` escapes "<" -> "<"
              to prevent any string field from breaking out of the script tag.
              This is the pattern Next.js docs recommend for JSON-LD.
            */}
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productSchema }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
        </div>
    );
}

// Re-export commonly used icons so individual page files don't need to import them separately
export { Snowflake, Shield, Music, Users, Luggage };
