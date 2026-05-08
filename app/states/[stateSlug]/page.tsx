import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CrossLinks from "@/components/seo/CrossLinks";
import { DISTRICTS_BY_STATE, type District } from "@/lib/districts";
import { SUPPORT_PHONE } from "@/lib/constants";
import { MapPin, Phone, Car, IndianRupee, ChevronRight, Star, Shield, Clock, Navigation } from "lucide-react";

// ─── State config ────────────────────────────────────────────
interface StateConfig {
    name: string;
    slug: string;
    description: string;
    topCities: string[]; // top 3 city names for title tag
    popularRoutes: { from: string; to: string; km: number; fare: number; fromSlug: string; toSlug: string }[];
}

const STATE_CONFIGS: Record<string, StateConfig> = {
    "tamil-nadu": {
        name: "Tamil Nadu",
        slug: "tamil-nadu",
        description:
            "Tamil Nadu is South India\u2019s largest taxi travel market, spanning from the metropolitan hub of Chennai in the north to the temple city of Madurai in the south, and the industrial centre of Coimbatore in the west. OneWayTaxi.ai connects every one of Tamil Nadu\u2019s districts with affordable one-way drop taxi service \u2014 so you never pay for the driver\u2019s return trip. Whether you\u2019re heading to a pilgrimage in Rameswaram, a hill-station retreat in Ooty or Kodaikanal, or an IT-corridor commute between Chennai and Bangalore, our one-way fare model saves you up to 40% compared to traditional round-trip cab bookings.",
        topCities: ["Chennai", "Coimbatore", "Madurai"],
        popularRoutes: [
            { from: "Chennai", to: "Bangalore", km: 346, fare: 4850, fromSlug: "chennai", toSlug: "bangalore" },
            { from: "Chennai", to: "Madurai", km: 462, fare: 6470, fromSlug: "chennai", toSlug: "madurai" },
            { from: "Chennai", to: "Coimbatore", km: 505, fare: 7070, fromSlug: "chennai", toSlug: "coimbatore" },
            { from: "Coimbatore", to: "Ooty", km: 86, fare: 1200, fromSlug: "coimbatore", toSlug: "ooty" },
            { from: "Madurai", to: "Rameswaram", km: 174, fare: 2436, fromSlug: "madurai", toSlug: "rameswaram" },
        ],
    },
    kerala: {
        name: "Kerala",
        slug: "kerala",
        description:
            "Kerala \u2014 God\u2019s Own Country \u2014 attracts millions of travellers every year to its backwaters, beaches, and hill stations. OneWayTaxi.ai covers every district in Kerala with transparent one-way taxi fares starting at just \u20b913/km. From the capital city Thiruvananthapuram to the commercial hub of Kochi, the cultural heart of Kozhikode, and the misty tea gardens of Munnar, our drop taxi service ensures you pay only for the distance you travel. Skip the return-fare surcharge that traditional outstation cabs impose, and enjoy GPS-tracked, AC vehicles with verified drivers across the entire state.",
        topCities: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
        popularRoutes: [
            { from: "Kochi", to: "Coimbatore", km: 196, fare: 2744, fromSlug: "kochi", toSlug: "coimbatore" },
            { from: "Thiruvananthapuram", to: "Kochi", km: 205, fare: 2870, fromSlug: "thiruvananthapuram", toSlug: "kochi" },
            { from: "Kochi", to: "Munnar", km: 130, fare: 1820, fromSlug: "kochi", toSlug: "munnar" },
            { from: "Kozhikode", to: "Bangalore", km: 357, fare: 4998, fromSlug: "kozhikode", toSlug: "bangalore" },
            { from: "Thiruvananthapuram", to: "Kanyakumari", km: 87, fare: 1218, fromSlug: "thiruvananthapuram", toSlug: "kanyakumari" },
        ],
    },
    karnataka: {
        name: "Karnataka",
        slug: "karnataka",
        description:
            "Karnataka is home to Bangalore \u2014 India\u2019s Silicon Valley \u2014 and a stunning diversity of heritage sites, coastal towns, and wildlife reserves. OneWayTaxi.ai provides one-way drop taxi service across every Karnataka district, from the bustling IT capital to the royal city of Mysore, the temple town of Hampi, and the coastal gem of Mangalore. Our transparent pricing starts at \u20b913/km with no return fare, no surge pricing, and no hidden charges. Whether it\u2019s a weekend trip from Bangalore to Coorg or a business commute to Hubli-Dharwad, book in 30 seconds and save up to 40%.",
        topCities: ["Bangalore", "Mysore", "Mangalore"],
        popularRoutes: [
            { from: "Bangalore", to: "Chennai", km: 346, fare: 4850, fromSlug: "bangalore", toSlug: "chennai" },
            { from: "Bangalore", to: "Mysore", km: 150, fare: 2100, fromSlug: "bangalore", toSlug: "mysore" },
            { from: "Bangalore", to: "Hyderabad", km: 570, fare: 7980, fromSlug: "bangalore", toSlug: "hyderabad" },
            { from: "Bangalore", to: "Coimbatore", km: 365, fare: 5110, fromSlug: "bangalore", toSlug: "coimbatore" },
            { from: "Bangalore", to: "Tirupati", km: 252, fare: 3528, fromSlug: "bangalore", toSlug: "tirupati" },
        ],
    },
    "andhra-pradesh": {
        name: "Andhra Pradesh",
        slug: "andhra-pradesh",
        description:
            "Andhra Pradesh stretches from the sacred hills of Tirupati in the south to the port city of Visakhapatnam on the eastern coast, with the new capital region of Amaravati in between. OneWayTaxi.ai offers one-way drop taxi service across all 26 districts, connecting major hubs like Vijayawada, Guntur, Nellore, and Rajahmundry. With fares starting at \u20b913/km and no return charges, pilgrims heading to Tirumala, tourists exploring Araku Valley, and professionals commuting across the state all save up to 40% compared to round-trip taxi services.",
        topCities: ["Visakhapatnam", "Vijayawada", "Tirupati"],
        popularRoutes: [
            { from: "Chennai", to: "Tirupati", km: 135, fare: 1890, fromSlug: "chennai", toSlug: "tirupati" },
            { from: "Hyderabad", to: "Vijayawada", km: 275, fare: 3850, fromSlug: "hyderabad", toSlug: "vijayawada" },
            { from: "Vijayawada", to: "Visakhapatnam", km: 350, fare: 4900, fromSlug: "vijayawada", toSlug: "visakhapatnam" },
            { from: "Tirupati", to: "Chennai", km: 135, fare: 1890, fromSlug: "tirupati", toSlug: "chennai" },
            { from: "Visakhapatnam", to: "Rajahmundry", km: 190, fare: 2660, fromSlug: "visakhapatnam", toSlug: "rajahmundry" },
        ],
    },
    telangana: {
        name: "Telangana",
        slug: "telangana",
        description:
            "Telangana, with its capital Hyderabad, is one of India\u2019s fastest-growing states and a major tech and pharma hub. OneWayTaxi.ai covers all 33 Telangana districts with affordable one-way drop taxi service. From Hyderabad\u2019s HITEC City to the heritage fortress of Warangal, the pilgrimage centres of Basara and Yadadri, and the industrial belt of Karimnagar, our cabs are available 24/7 at just \u20b913/km. You pay only for the one-way distance \u2014 no return fare, no surge, no hidden costs. Book online in 30 seconds or call us any time.",
        topCities: ["Hyderabad", "Warangal", "Karimnagar"],
        popularRoutes: [
            { from: "Hyderabad", to: "Bangalore", km: 570, fare: 7980, fromSlug: "hyderabad", toSlug: "bangalore" },
            { from: "Hyderabad", to: "Vijayawada", km: 275, fare: 3850, fromSlug: "hyderabad", toSlug: "vijayawada" },
            { from: "Hyderabad", to: "Warangal", km: 148, fare: 2072, fromSlug: "hyderabad", toSlug: "warangal" },
            { from: "Hyderabad", to: "Tirupati", km: 555, fare: 7770, fromSlug: "hyderabad", toSlug: "tirupati" },
            { from: "Hyderabad", to: "Chennai", km: 625, fare: 8750, fromSlug: "hyderabad", toSlug: "chennai" },
        ],
    },
    pondicherry: {
        name: "Pondicherry",
        slug: "pondicherry",
        description:
            "Pondicherry (Puducherry) is a charming coastal union territory known for its French Quarter, pristine beaches, and the Auroville township. Despite its compact size, Pondicherry attracts heavy taxi traffic from Chennai, Bangalore, and surrounding Tamil Nadu cities. OneWayTaxi.ai provides one-way drop taxi service across all Pondicherry districts \u2014 including Puducherry, Karaikal, Mahe, and Yanam \u2014 at fares starting from just \u20b913/km. Whether you\u2019re arriving from Chennai (just 150 km away) or heading to Trichy, Madurai, or Coimbatore, pay only the one-way fare and save up to 40%.",
        topCities: ["Pondicherry", "Karaikal", "Mahe"],
        popularRoutes: [
            { from: "Chennai", to: "Pondicherry", km: 150, fare: 2100, fromSlug: "chennai", toSlug: "pondicherry" },
            { from: "Pondicherry", to: "Chennai", km: 150, fare: 2100, fromSlug: "pondicherry", toSlug: "chennai" },
            { from: "Pondicherry", to: "Bangalore", km: 310, fare: 4340, fromSlug: "pondicherry", toSlug: "bangalore" },
            { from: "Pondicherry", to: "Trichy", km: 207, fare: 2898, fromSlug: "pondicherry", toSlug: "trichy" },
            { from: "Pondicherry", to: "Madurai", km: 340, fare: 4760, fromSlug: "pondicherry", toSlug: "madurai" },
        ],
    },
};

const ALL_STATE_SLUGS = Object.keys(STATE_CONFIGS);

// ─── Static params ───────────────────────────────────────────
export function generateStaticParams() {
    return ALL_STATE_SLUGS.map((slug) => ({ stateSlug: slug }));
}

// ─── Dynamic metadata ────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ stateSlug: string }>;
}): Promise<Metadata> {
    const { stateSlug } = await params;
    const config = STATE_CONFIGS[stateSlug];
    if (!config) return {};

    const districts = DISTRICTS_BY_STATE.get(stateSlug) || [];
    const title = `One Way Taxi in ${config.name} \u2014 Drop Taxi to ${config.topCities.join(", ")} | OneWayTaxi.ai`;
    const description = `Book affordable drop taxi across ${config.name}. ${districts.length} cities covered. \u20b913/km. One-way fare only. Call ${SUPPORT_PHONE}`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://onewaytaxi.ai/states/${stateSlug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://onewaytaxi.ai/states/${stateSlug}`,
            siteName: "OneWayTaxi.ai",
            type: "website",
            locale: "en_IN",
        },
        twitter: {
            card: "summary_large_image",
            title: `One Way Taxi in ${config.name} | OneWayTaxi.ai`,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// ─── Page component ──────────────────────────────────────────
export default async function StateHubPage({
    params,
}: {
    params: Promise<{ stateSlug: string }>;
}) {
    const { stateSlug } = await params;
    const config = STATE_CONFIGS[stateSlug];
    if (!config) notFound();

    const districts = DISTRICTS_BY_STATE.get(stateSlug) || [];
    const tier1 = districts.filter((d) => d.tier === 1);
    const tier2 = districts.filter((d) => d.tier === 2);
    const tier3 = districts.filter((d) => d.tier === 3);

    const breadcrumbJsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://onewaytaxi.ai",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "States",
                item: "https://onewaytaxi.ai/states",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: config.name,
                item: `https://onewaytaxi.ai/states/${stateSlug}`,
            },
        ],
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main>
                {/* Hero Section */}
                <section
                    className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden"
                    aria-label={`One way taxi in ${config.name}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium mb-6">
                            <MapPin className="h-4 w-4" />
                            {districts.length} Districts Covered
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            One Way Taxi in{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                                {config.name}
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-teal-100/90 leading-relaxed max-w-3xl mx-auto mb-8">
                            Affordable drop taxi service across {config.name}. Starting at just
                            &#8377;13/km. Pay only one way &mdash; save up to 40% on outstation travel.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {config.topCities.map((city) => (
                                <span
                                    key={city}
                                    className="bg-white/10 px-5 py-2.5 rounded-lg border border-white/20 text-white font-medium text-sm"
                                >
                                    {city}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Breadcrumb */}
                <nav
                    className="bg-white border-b border-gray-100"
                    aria-label="Breadcrumb"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-2 text-sm text-gray-500">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-teal-700 transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <li>
                                <span className="text-gray-400">States</span>
                            </li>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <li>
                                <span className="font-medium text-gray-900">
                                    {config.name}
                                </span>
                            </li>
                        </ol>
                    </div>
                </nav>

                {/* Stats Bar */}
                <section className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <MapPin className="h-5 w-5 text-teal-600" />
                                    <span className="text-2xl font-bold text-gray-900">
                                        {districts.length}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Districts Covered</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <IndianRupee className="h-5 w-5 text-teal-600" />
                                    <span className="text-2xl font-bold text-gray-900">
                                        13/km
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Starting Fare</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Star className="h-5 w-5 text-teal-600" />
                                    <span className="text-2xl font-bold text-gray-900">
                                        4.8
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Customer Rating</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <span className="text-2xl font-bold text-gray-900">
                                        24/7
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Service Available</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About State — SEO content block */}
                <section className="py-12 bg-white" aria-label={`About one way taxi in ${config.name}`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            One Way Drop Taxi Service in {config.name}
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {config.description}
                        </p>
                        <div className="mt-6 grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <Shield className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Verified Drivers</h3>
                                    <p className="text-sm text-gray-600">
                                        All drivers are background-verified, professionally trained, and rated 4.8 stars on average across {config.name}.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <Car className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">AC Fleet</h3>
                                    <p className="text-sm text-gray-600">
                                        Choose from Hatchback (&#8377;13/km), Sedan (&#8377;14/km), SUV (&#8377;19/km), or Innova Crysta (&#8377;22/km). All vehicles GPS-tracked.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tier 1 Cities — Prominent Cards */}
                {tier1.length > 0 && (
                    <section className="py-16 bg-gray-50" aria-label={`Major cities in ${config.name}`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                    Major Cities in {config.name}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Top destinations with the highest taxi demand
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {tier1.map((district) => (
                                    <Tier1Card key={district.slug} district={district} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Tier 2 Cities */}
                {tier2.length > 0 && (
                    <section className="py-16 bg-white" aria-label={`More cities in ${config.name}`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                    More Cities We Serve in {config.name}
                                </h2>
                                <p className="text-gray-600">
                                    Growing demand centres with full one-way taxi coverage
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {tier2.map((district) => (
                                    <Link
                                        key={district.slug}
                                        href={`/drop-taxi-in-${district.slug}`}
                                        title={`Drop taxi in ${district.name}`}
                                        className="group flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md hover:bg-teal-50 transition-all"
                                    >
                                        <MapPin className="h-5 w-5 text-teal-600 shrink-0 group-hover:text-teal-700" />
                                        <div>
                                            <span className="font-semibold text-gray-900 group-hover:text-teal-800 block">
                                                {district.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {district.popularRoutes.length} routes
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Tier 3 Cities — Compact Grid */}
                {tier3.length > 0 && (
                    <section className="py-12 bg-gray-50" aria-label={`All districts in ${config.name}`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">
                                All Other Districts in {config.name}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {tier3.map((district) => (
                                    <Link
                                        key={district.slug}
                                        href={`/drop-taxi-in-${district.slug}`}
                                        title={`${district.name} drop taxi`}
                                        className="px-3 py-1.5 text-sm text-gray-600 bg-white rounded-lg hover:bg-teal-50 hover:text-teal-800 transition-colors border border-gray-200 hover:border-teal-200"
                                    >
                                        {district.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Popular Routes */}
                <section className="py-16 bg-white" aria-label={`Popular routes in ${config.name}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                Popular One-Way Taxi Routes in {config.name}
                            </h2>
                            <p className="text-lg text-gray-600">
                                Most booked drop taxi routes. Book now and save up to 40%!
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {config.popularRoutes.map((route) => (
                                <Link
                                    key={`${route.fromSlug}-${route.toSlug}`}
                                    href={`/route/${route.fromSlug}-to-${route.toSlug}-taxi`}
                                    title={`${route.from} to ${route.to} one way taxi`}
                                    className="group flex items-center justify-between p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Navigation className="h-5 w-5 text-teal-600 group-hover:text-teal-700" />
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-teal-800 transition-colors">
                                                {route.from} &rarr; {route.to}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {route.km} km
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-teal-700">
                                            &#8377;{route.fare.toLocaleString("en-IN")}
                                        </div>
                                        <div className="text-xs text-gray-400">onwards</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Types — Internal Linking */}
                <section className="py-12 bg-gray-50" aria-label="Other services">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Explore Other Taxi Services in {config.name}
                        </h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {[
                                { label: "Taxi Service", prefix: "taxi-service" },
                                { label: "One Way Taxi", prefix: "one-way-taxi" },
                                { label: "Outstation Cabs", prefix: "outstation-cabs" },
                                { label: "Cab Service", prefix: "cab-service" },
                                { label: "Call Taxi", prefix: "call-taxi" },
                            ].map((svc) => {
                                const topDistrict = tier1[0] || districts[0];
                                if (!topDistrict) return null;
                                return (
                                    <Link
                                        key={svc.prefix}
                                        href={`/${svc.prefix}-in-${topDistrict.slug}`}
                                        className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-800 hover:bg-teal-50 transition-all"
                                    >
                                        <Car className="h-4 w-4" />
                                        {svc.label} in {topDistrict.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Why OneWayTaxi.ai — extra SEO content */}
                <section className="py-16 bg-white" aria-label="Why choose us">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                            Why Choose OneWayTaxi.ai for {config.name} Travel?
                        </h2>
                        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
                            <p>
                                Travelling across {config.name} by taxi should be simple, affordable, and stress-free. Traditional outstation cab services charge you for the round trip even when you only need a one-way ride &mdash; effectively doubling your fare. OneWayTaxi.ai eliminates that waste with a transparent one-way pricing model where you pay exclusively for the kilometres you travel.
                            </p>
                            <p>
                                Our fleet of over 5,000 vehicles across {config.name} includes GPS-tracked, air-conditioned cars ranging from budget hatchbacks to premium Innova Crystas. Every fare includes driver allowance (bata), toll charges, inter-state permits, and GST &mdash; so the price you see is the price you pay. No surge pricing, no hidden charges, no return fare.
                            </p>
                            <p>
                                With {districts.length} districts covered and 24/7 availability, OneWayTaxi.ai is the most comprehensive one-way taxi network in {config.name}. Book online in 30 seconds or call us at{" "}
                                <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="text-teal-700 font-semibold hover:underline">
                                    {SUPPORT_PHONE}
                                </a>{" "}
                                for instant confirmation. Join 50,000+ happy customers who have already made the switch.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Browse Other States */}
                <section className="py-12 bg-gray-50" aria-label="Browse other states">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                            One Way Taxi in Other States
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {ALL_STATE_SLUGS.filter((s) => s !== stateSlug).map((slug) => {
                                const st = STATE_CONFIGS[slug];
                                return (
                                    <Link
                                        key={slug}
                                        href={`/states/${slug}`}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-800 hover:bg-teal-50 transition-all"
                                    >
                                        {st.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900" aria-label="Book now">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Book Your One Way Taxi in {config.name} Now
                        </h2>
                        <p className="text-lg text-teal-100/90 mb-8 max-w-2xl mx-auto">
                            {districts.length} districts. Starting &#8377;13/km. No return fare.
                            No hidden charges. 24/7 availability with verified drivers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-white text-teal-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition-colors shadow-lg"
                            >
                                <Car className="h-5 w-5" />
                                Book Online Now
                            </Link>
                            <a
                                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                                className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
                            >
                                <Phone className="h-5 w-5" />
                                {SUPPORT_PHONE}
                            </a>
                        </div>
                    </div>
                </section>
                <CrossLinks />
            </main>

            <Footer />

            {/* BreadcrumbList JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
            />
        </div>
    );
}

// ─── Tier 1 City Card Component ──────────────────────────────
function Tier1Card({ district }: { district: District }) {
    const topRoutes = district.popularRoutes.slice(0, 3);

    return (
        <Link
            href={`/drop-taxi-in-${district.slug}`}
            title={`${district.name} drop taxi service`}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-teal-300 hover:shadow-xl transition-all"
        >
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 text-center">
                <MapPin className="h-10 w-10 text-teal-600 mx-auto mb-3 group-hover:text-teal-700" />
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-800">
                    {district.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{district.state}</p>
            </div>
            <div className="p-4 space-y-2">
                {topRoutes.map((route) => (
                    <div
                        key={route.toSlug}
                        className="flex items-center justify-between text-sm"
                    >
                        <span className="text-gray-600">
                            &rarr; {route.to}
                        </span>
                        <span className="font-semibold text-teal-700">
                            &#8377;{route.fareEstimate.toLocaleString("en-IN")}
                        </span>
                    </div>
                ))}
                <div className="pt-2 border-t border-gray-100 text-center">
                    <span className="text-sm font-medium text-teal-700 group-hover:text-teal-800">
                        View all services &rarr;
                    </span>
                </div>
            </div>
        </Link>
    );
}
