import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";
import { SUPPORT_PHONE } from "@/lib/constants";
import { Phone, MessageCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const PHONE_DIGITS = SUPPORT_PHONE.replace(/\s/g, "");
const WHATSAPP_URL = "https://wa.me/918124476010?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi.";
const CANONICAL = "https://onewaytaxi.ai/all-inclusive-pricing";
const PUBLISHED_DATE = "2026-05-12";

export const metadata: Metadata = {
    title: "All-Inclusive Taxi Pricing | No Hidden Charges | OneWayTaxi.ai",
    description:
        "OneWayTaxi.ai's fares include tolls, driver bata, state permit, and 5% GST. No surprises at drop. See real comparison math vs operators with hidden charges.",
    alternates: { canonical: CANONICAL },
    openGraph: {
        title: "All-Inclusive Taxi Pricing — OneWayTaxi.ai",
        description: "Tolls + bata + permit + GST all baked in. Quoted = paid.",
        url: CANONICAL,
        siteName: "OneWayTaxi.ai",
        type: "article",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "All-Inclusive Taxi Pricing — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "All-Inclusive Taxi Pricing | OneWayTaxi.ai", description: "Tolls + bata + permit + GST baked in. Quoted = paid.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
};

const faqs: { q: string; a: string }[] = [
    { q: "What does 'all-inclusive' actually mean at OneWayTaxi.ai?", a: "Your quoted fare covers four cost components that other operators usually bill separately: all national-highway tolls on your route, the driver's daily bata (typically ₹400/day), inter-state permit fees where applicable, and 5% GST. You pay the quoted amount at drop. Nothing else." },
    { q: "What's NOT included in the all-inclusive fare?", a: "Hill-station entry fees (Ooty ₹100, Kodaikanal ₹200, Munnar ₹200), parking inside private property (apartment basements, gated communities), waiting beyond the free 30-minute pickup buffer, and additional pickup/drop stops beyond the agreed itinerary. Any optional add-on is disclosed before booking — never billed as a surprise." },
    { q: "What if we hit an unexpected toll plaza on the way?", a: "If the route runs through a toll plaza that wasn't part of the original itinerary, you pay nothing extra — the operator absorbs it. Tolls are a fleet-wide corporate FASTag account, not a per-trip line item we pass on to you." },
    { q: "Are Kerala state-specific taxes (or other state border fees) included?", a: "Yes. Inter-state permit fees on cross-border routes (Tamil Nadu → Kerala, Karnataka → Tamil Nadu, etc.) are pre-paid by us as part of the all-inclusive fare. You won't be asked at the border." },
    { q: "What happens if GST rates change?", a: "Existing confirmed bookings honour the GST rate at booking time — you pay what was quoted. New bookings reflect the updated GST, with a re-quoted total. The 'all-inclusive' commitment is to your specific quote, not to a per-km rate floating forever." },
    { q: "Why can you offer all-inclusive when others can't?", a: "Three operational decisions: (1) corporate FASTag accounts for all national highway tolls, billed monthly to us not to drivers, (2) in-house permit and GST team handling state filings — no third-party agents marking up fees, (3) drivers paid a fixed daily bata regardless of trip length, removing the per-trip negotiation that creates hidden-charge incentives elsewhere." },
    { q: "How do I get a GST invoice for corporate billing?", a: "GST is already in your fare; we email the GST-compliant invoice within 24 hours of trip completion. Share your company name and GSTIN at booking and we'll generate the invoice in your business's name." },
    { q: "What's the cancellation policy with all-inclusive pricing?", a: "Free cancellation more than 4 hours before pickup. Within 4 hours, ₹200 service fee. After driver pickup, ₹500 no-show fee. Refunds go back to the original payment method within 3-5 working days (UPI within 24 hours). Tolls and permits we pre-paid for you are absorbed by us on cancellation — never billed back." },
];

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "All-Inclusive Taxi Pricing — Why Quoted = Paid at OneWayTaxi.ai",
    description: "How all-inclusive pricing works at OneWayTaxi.ai: tolls, driver bata, state permit, and GST baked into every quote. Real math vs competitors with hidden charges.",
    author: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai" },
    publisher: { "@type": "Organization", name: "OneWayTaxi.ai", logo: { "@type": "ImageObject", url: "https://onewaytaxi.ai/logo.png" } },
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    image: "https://onewaytaxi.ai/opengraph-image",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
};

const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "All-Inclusive Taxi Pricing — OneWayTaxi.ai",
    description: "OneWayTaxi.ai's all-inclusive pricing manifesto. Tolls, bata, permit, GST baked in.",
    url: CANONICAL,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai" },
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai/" },
        { "@type": "ListItem", position: 2, name: "All-Inclusive Pricing", item: CANONICAL },
    ],
};

const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "One Way Drop Taxi (All-Inclusive)",
    name: "All-Inclusive One Way Taxi",
    description: "One-way drop taxi with all-inclusive fares — tolls, driver bata, state permit, and 5% GST baked into the quoted price.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
    offers: {
        "@type": "Offer",
        priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 14,
            priceCurrency: "INR",
            referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
            valueAddedTaxIncluded: true,
        },
    },
};

const escape = (json: string) => json.replace(/</g, "\\u003c");

export default function AllInclusivePricingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">All-Inclusive Pricing</li>
                        </ol>
                    </div>
                </nav>

                <section className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-700 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mb-6 flex justify-center"><AllInclusiveBadge size="hero" /></div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            All-Inclusive Taxi Pricing &mdash; Why Quoted = Paid at OneWayTaxi.ai
                        </h1>
                        <p className="text-lg text-teal-50 leading-relaxed">
                            Every fare we quote includes tolls, driver bata, state permit, and 5% GST. There is no second bill at the drop point. This page explains what &quot;all-inclusive&quot; actually means at OneWayTaxi.ai, how the math compares with operators who advertise lower per-km rates, and what (honestly) is not included.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <a href={`tel:${PHONE_DIGITS}`} className="inline-flex items-center gap-2 bg-white text-teal-900 px-5 py-3 rounded-full font-bold shadow-lg hover:bg-teal-50">
                                <Phone className="h-5 w-5" /> {SUPPORT_PHONE}
                            </a>
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-[#20BD5A]">
                                <MessageCircle className="h-5 w-5" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What &quot;all-inclusive&quot; actually means here</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            The phrase &quot;all-inclusive&quot; is overused in Indian taxi marketing &mdash; most operators use it loosely, then add tolls and bata at drop. At OneWayTaxi.ai it is a specific, four-component commitment. Your quoted fare always includes:
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>All national-highway tolls</strong> on the route &mdash; billed to our corporate FASTag account, never to you.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Driver bata</strong> (~&#8377;400 per day) &mdash; the daily allowance that covers the driver&apos;s food, intermediate stops, and dead-head return.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Inter-state permit fees</strong> &mdash; Tamil Nadu &rarr; Kerala, Karnataka &rarr; Tamil Nadu, etc. &mdash; pre-paid by us, not by the driver at the border.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>5% GST</strong> &mdash; already in the quoted total; a GST-compliant invoice is emailed within 24 hours of trip completion.</span></li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed">
                            What you pay the driver at drop is exactly the number we sent you at booking. There is no second handshake about extras.
                        </p>
                    </div>
                </section>

                <section className="py-14 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">The hidden-charge tactics other operators use</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            The South Indian one-way taxi market runs on per-kilometre headline pricing &mdash; &#8377;11/km, &#8377;12/km, &#8377;13/km &mdash; that sounds cheaper than ours until you read the fine print. The three most common patterns:
                        </p>
                        <ol className="space-y-4 list-decimal list-inside text-gray-800">
                            <li><strong>&quot;&#8377;11/km&quot; with tolls and bata extra.</strong> A Chennai &rarr; Bangalore quote of &#8377;3,806 (346 km &times; &#8377;11) becomes &#8377;3,806 + &#8377;450 toll + &#8377;400 bata + &#8377;150 permit + 5% GST = &#8377;5,046. The cheapest headline rate is rarely the lowest final bill.</li>
                            <li><strong>Round-trip fare disguised as one-way.</strong> A &quot;&#8377;14/km one-way&quot; quote that secretly bills 1.5&times; the distance to cover the driver&apos;s return leg. Look for a &quot;minimum km&quot; clause buried in the booking confirmation.</li>
                            <li><strong>Festival/peak surcharges added at drop.</strong> Pongal, Onam, Tirupati Brahmotsavam &mdash; operators with no surge-protection policy bill an additional &#8377;500-1,500 at the destination.</li>
                        </ol>
                        <p className="text-gray-700 leading-relaxed mt-6">
                            None of these apply at OneWayTaxi.ai. The headline rate &#8377;14/km sedan is the all-in rate. The total you see at booking is the total you pay.
                        </p>
                    </div>
                </section>

                <section className="py-14 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Real fare math: Chennai &rarr; Bangalore, 346 km, sedan</h2>
                        <p className="text-gray-600 mb-6">Three operators on the same route. Same sedan class. Final amount you actually pay.</p>
                        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-teal-900 text-white">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold">Operator</th>
                                        <th className="text-right py-3 px-4 font-semibold">Base fare</th>
                                        <th className="text-right py-3 px-4 font-semibold">Toll</th>
                                        <th className="text-right py-3 px-4 font-semibold">Bata</th>
                                        <th className="text-right py-3 px-4 font-semibold">Permit</th>
                                        <th className="text-right py-3 px-4 font-semibold">GST</th>
                                        <th className="text-right py-3 px-4 font-semibold bg-emerald-700">Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-emerald-50">
                                        <td className="py-3 px-4 font-semibold text-emerald-900">OneWayTaxi.ai @ &#8377;14/km <span className="block text-xs font-normal text-emerald-700">All-inclusive</span></td>
                                        <td className="text-right py-3 px-4">&#8377;4,844</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 font-bold text-emerald-900 bg-emerald-100">&#8377;4,850</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-semibold text-gray-800">Generic competitor @ &#8377;11/km <span className="block text-xs font-normal text-gray-500">Headline price</span></td>
                                        <td className="text-right py-3 px-4">&#8377;3,806</td>
                                        <td className="text-right py-3 px-4">+&#8377;450</td>
                                        <td className="text-right py-3 px-4">+&#8377;400</td>
                                        <td className="text-right py-3 px-4">+&#8377;150</td>
                                        <td className="text-right py-3 px-4">+&#8377;240</td>
                                        <td className="text-right py-3 px-4 font-bold text-gray-900 bg-gray-100">&#8377;5,046</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-800">Generic competitor @ &#8377;13/km <span className="block text-xs font-normal text-gray-500">Headline price</span></td>
                                        <td className="text-right py-3 px-4">&#8377;4,498</td>
                                        <td className="text-right py-3 px-4">+&#8377;450</td>
                                        <td className="text-right py-3 px-4">+&#8377;400</td>
                                        <td className="text-right py-3 px-4">+&#8377;150</td>
                                        <td className="text-right py-3 px-4">+&#8377;275</td>
                                        <td className="text-right py-3 px-4 font-bold text-gray-900 bg-gray-100">&#8377;5,773</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-sm text-gray-700">
                            <strong>Savings vs the cheapest competitor:</strong> &#8377;196 on Chennai-Bangalore alone. Across a typical 8-12 trip year that&apos;s &#8377;1,500-&#8377;2,500 of avoided &quot;small print&quot; &mdash; but the larger value is removing the uncertainty about what the final number will be.
                        </p>
                    </div>
                </section>

                <section className="py-14 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What&apos;s not included (and why)</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            All-inclusive is a strict commitment, not a marketing line &mdash; which means being honest about what isn&apos;t covered. Four optional add-ons are billed separately, always disclosed before booking, never as a surprise at drop:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Hill-station entry fees</strong> &mdash; Ooty &#8377;100, Kodaikanal &#8377;200, Munnar &#8377;200, Coorg &#8377;200, Yercaud &#8377;50. These are paid by the driver at the entry checkpoint and added to your fare with the official receipt.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Private property parking</strong> &mdash; apartment basements, gated community visitor parking, hotel valet. National highway toll parking is free; private-property parking varies.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Extra waiting beyond 30 minutes</strong> &mdash; the first 30 minutes after the driver arrives at the pickup location are free; &#8377;150-250 per hour after that (vehicle-class dependent), tracked on the GPS log.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Additional pickup/drop stops</strong> &mdash; the agreed itinerary at booking is part of the fare. A new stop added en route is billed at the per-km rate of the diversion.</span></li>
                        </ul>
                    </div>
                </section>

                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why we can be all-inclusive when others can&apos;t</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            All-inclusive pricing isn&apos;t a discount &mdash; it&apos;s a different operating model. Three decisions make it work:
                        </p>
                        <ol className="space-y-4 list-decimal list-inside text-gray-800">
                            <li><strong>Corporate FASTag accounts.</strong> Every vehicle in our fleet uses a single corporate FASTag billed monthly to OneWayTaxi.ai. Tolls become a fleet-wide cost we absorb at the fleet level &mdash; never a per-trip negotiation between you and a driver at a plaza.</li>
                            <li><strong>In-house permit and GST team.</strong> Inter-state permits and GST filings are handled by our internal compliance team, not third-party agents who mark up fees. The fixed monthly cost spreads predictably across all bookings.</li>
                            <li><strong>Fixed daily bata.</strong> Drivers are paid a fixed daily allowance regardless of route length or destination class. Removing per-trip negotiation removes the incentive to invent &quot;extras&quot; &mdash; drivers know their take is the same whether the customer is happy or not. The natural alignment is toward happy.</li>
                        </ol>
                    </div>
                </section>

                <section className="py-14 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What customers say about no-surprise pricing</h2>
                        <p className="text-gray-600 mb-8 text-sm italic">Illustrative quotes &mdash; to be replaced with real Google reviews on next refresh.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* PLACEHOLDER: replace with real customer review */}
                            <blockquote className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-gray-800 leading-relaxed mb-4">&quot;Booked Chennai to Tirupati at &#8377;1,890 quoted. Paid &#8377;1,890 at drop. No mention of tolls, no bata extra. First Indian taxi I&apos;ve used where the number matched the booking.&quot;</p>
                                <footer className="text-sm text-gray-600">&mdash; Rajesh K., booked Chennai-Tirupati, March 2026</footer>
                            </blockquote>
                            {/* PLACEHOLDER: replace with real customer review */}
                            <blockquote className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-gray-800 leading-relaxed mb-4">&quot;My elderly parents travelled from Bangalore to Coorg. I worried about them being asked for toll money or bata at the destination &mdash; the driver didn&apos;t ask for a paisa beyond the quote. Quote-equals-paid is the actual product.&quot;</p>
                                <footer className="text-sm text-gray-600">&mdash; Priya S., booked Bangalore-Coorg, January 2026</footer>
                            </blockquote>
                            {/* PLACEHOLDER: replace with real customer review */}
                            <blockquote className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-gray-800 leading-relaxed mb-4">&quot;Corporate booking for a colleague&apos;s airport drop. GST invoice came in email next morning, exact amount as the booking confirmation. Finance team had zero questions. This is how it should work.&quot;</p>
                                <footer className="text-sm text-gray-600">&mdash; Anand M., corporate booking, February 2026</footer>
                            </blockquote>
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">The math: &#8377;11/km headline vs &#8377;14/km all-in</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            A &#8377;11/km headline looks like 21% cheaper than &#8377;14/km all-in. It almost never is. Walk through the breakdown on a typical 300 km route:
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-4">
                            <p className="text-gray-800 mb-2"><strong>&#8377;11/km &times; 300 km = &#8377;3,300 base</strong></p>
                            <p className="text-gray-700 leading-relaxed">+ &#8377;400 driver bata (industry-standard daily allowance)<br />+ &#8377;350 toll (typical state-highway segment)<br />+ &#8377;150 inter-state permit (cross-border route)<br />+ 5% GST on the above = &#8377;210<br /><strong className="text-gray-900">Effective &#8377;/km: &#8377;14.03</strong></p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            The &#8377;11/km headline becomes &#8377;14.03/km effective once the unbundled costs are added back. OneWayTaxi.ai&apos;s &#8377;14/km all-inclusive is the same effective rate without the math gymnastics &mdash; and without the anxiety that the driver might find one more &quot;extra&quot; to add at the drop point.
                        </p>
                    </div>
                </section>

                <section className="py-14 bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">தமிழில் &mdash; All-inclusive pricing</h2>
                        <div className="space-y-4 text-gray-800">
                            <p className="text-lg leading-relaxed"><strong>அனைத்து உள்ளடக்கம்</strong> &mdash; டோல், பாதா, பெர்மிட், GST. மறைக்கப்பட்ட கட்டணம் இல்லை.</p>
                            <p className="text-base leading-relaxed">&quot;All-inclusive-nu sonna enna? Toll, bata, permit, GST ellaam fare-le sernthu irukku. Drop point-le extra kekka maatom.&quot;</p>
                            <p className="text-base leading-relaxed italic text-gray-700">Voice search: <strong>&quot;என் டாக்ஸி கட்டணத்தில் GST சேர்க்கப்பட்டுள்ளதா?&quot;</strong> &mdash; 5% GST already included in your quoted fare.</p>
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
                        <div className="space-y-6">
                            {faqs.map((f, i) => (
                                <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{f.q}</h3>
                                    <p className="text-gray-700 leading-relaxed">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-teal-900 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get an all-inclusive quote &mdash; quoted = paid</h2>
                        <p className="text-teal-100 mb-8 text-lg">No surge, no surprises, no add-ons at the drop point.</p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a href={`tel:${PHONE_DIGITS}`} className="inline-flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-teal-50">
                                <Phone className="h-5 w-5" /> Call {SUPPORT_PHONE}
                            </a>
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#20BD5A]">
                                <MessageCircle className="h-5 w-5" /> WhatsApp
                            </a>
                            <Link href="/book-now" className="inline-flex items-center gap-2 bg-amber-500 text-teal-950 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-amber-400">
                                Get Estimate <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(articleSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(webPageSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(breadcrumbSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(faqPageSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(serviceSchema)) }} />
        </div>
    );
}
