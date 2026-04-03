import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_PHONE } from "@/lib/constants";
import {
  Phone,
  MapPin,
  Shield,
  IndianRupee,
  Clock,
  Car,
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Eye,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About OneWayTaxi.ai — South India's #1 One Way Drop Taxi Service",
  description:
    "Learn about OneWayTaxi.ai — South India's trusted one-way drop taxi covering 120+ cities. Save 40% vs round-trip. 24/7 service, verified drivers, from ₹13/km.",
  alternates: {
    canonical: "https://onewaytaxi.ai/about",
  },
  openGraph: {
    title: "About OneWayTaxi.ai — South India's #1 One Way Drop Taxi Service",
    description:
      "Discover why 50,000+ travellers trust OneWayTaxi.ai for affordable one-way drop taxi across Tamil Nadu, Kerala, Karnataka, AP & Telangana.",
    url: "https://onewaytaxi.ai/about",
    siteName: "OneWayTaxi.ai",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About OneWayTaxi.ai — One Way Drop Taxi Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About OneWayTaxi.ai — South India's #1 One Way Drop Taxi Service",
    description:
      "South India's most trusted one-way drop taxi. 120+ cities, from ₹13/km, save 40%. Learn our story.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

/* ── Helpers for JSON-LD (static data only — no user input) ── */
const phoneDigits = SUPPORT_PHONE.replace(/\s/g, "");

const breadcrumbSchema = JSON.stringify({
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
      name: "About Us",
      item: "https://onewaytaxi.ai/about",
    },
  ],
});

const organizationSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TaxiService"],
  "@id": "https://onewaytaxi.ai/#organization",
  name: "OneWayTaxi.ai",
  url: "https://onewaytaxi.ai",
  telephone: phoneDigits,
  email: "booking@onewaytaxi.ai",
  description:
    "South India's leading one-way drop taxi service covering 120+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry. Pay only for one way — save up to 40%.",
  logo: {
    "@type": "ImageObject",
    url: "https://onewaytaxi.ai/logo.png",
    width: 512,
    height: 512,
  },
  image: "https://onewaytaxi.ai/opengraph-image",
  priceRange: "₹13 - ₹22 per km",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
  openingHours: "Mo-Su 00:00-23:59",
  areaServed: [
    { "@type": "State", name: "Tamil Nadu" },
    { "@type": "State", name: "Kerala" },
    { "@type": "State", name: "Karnataka" },
    { "@type": "State", name: "Andhra Pradesh" },
    { "@type": "State", name: "Telangana" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600040",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "50000",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: phoneDigits,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "ta", "hi", "te", "kn", "ml"],
  },
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Trusted by 50,000+ Travellers
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                OneWayTaxi.ai
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-teal-100/90 leading-relaxed max-w-3xl mx-auto">
              South India&apos;s most trusted one-way drop taxi service.
              We connect travellers across 120+ cities in Tamil Nadu, Kerala,
              Karnataka, Andhra Pradesh, Telangana, and Pondicherry with
              safe, affordable, and transparent intercity cab rides &mdash;
              every single day.
            </p>
          </div>
        </section>

        {/* ── Mission Section ── */}
        <section className="py-20 bg-white" aria-label="Our mission">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Mission &mdash; Making Intercity Travel Affordable
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                For decades, intercity taxi travel in South India has been
                burdened by an unfair pricing model. When you book a traditional
                outstation taxi from Chennai to Bangalore, you pay not just for
                the 346 km you travel, but also for the driver&apos;s 346 km
                return journey &mdash; a trip you never take. That effectively
                doubles your fare and makes taxi travel unaffordable for
                millions of people who simply need a one-way ride between
                cities.
              </p>
              <p>
                OneWayTaxi.ai was founded to solve exactly this problem. We
                pioneered the one-way fare model in South India, where you pay
                only for the distance you actually travel. No return fare. No
                hidden surcharges. No surge pricing. Just a transparent,
                fixed rate that starts at ₹13 per kilometre for a Mini
                hatchback, ₹14/km for a comfortable sedan, ₹19/km for a
                spacious SUV, and ₹22/km for a premium Innova Crysta.
              </p>
              <p>
                Our mission is simple: to make intercity travel as affordable,
                safe, and convenient as booking a local ride. Whether you are a
                professional commuting between Chennai and Coimbatore, a family
                heading to a wedding in Madurai, a student returning to campus
                in Bangalore, or a pilgrim visiting Tirupati &mdash; you
                deserve to travel comfortably without paying twice. That is why
                we exist.
              </p>
              <p>
                Since our inception, we have completed over 50,000 rides across
                five South Indian states and the union territory of
                Pondicherry, earning a 4.8-star average rating from our
                customers. Every fare we quote includes driver bata
                (allowance), toll charges, inter-state permits, and GST.
                What you see is what you pay &mdash; no surprises at the end
                of your journey.
              </p>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-20 bg-gray-50" aria-label="How it works">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How OneWayTaxi.ai Works
              </h2>
              <p className="text-lg text-gray-600">
                Book your one-way drop taxi in under 30 seconds &mdash; it
                really is that simple.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Enter Your Trip Details",
                  desc: "Tell us your pickup city, drop city, travel date, and preferred vehicle type. Our smart fare engine instantly calculates the exact one-way fare with zero hidden costs. You can book through our website or simply call us at any time.",
                  icon: MapPin,
                },
                {
                  step: "02",
                  title: "Get Instant Confirmation",
                  desc: "Within minutes, you receive a confirmed booking with your driver's name, vehicle number, and contact details. Our 24/7 operations team assigns a background-verified driver with a GPS-tracked, air-conditioned vehicle for your journey.",
                  icon: CheckCircle,
                },
                {
                  step: "03",
                  title: "Travel & Pay One Way",
                  desc: "Your driver arrives at your doorstep at the scheduled time. Enjoy a comfortable ride to your destination and pay only the one-way fare — via cash, UPI, or card. No return fare, no waiting charges for the first 30 minutes, and no post-trip surprises.",
                  icon: Car,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-5xl font-bold text-teal-100 mb-4 group-hover:text-teal-200 transition-colors">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                    <item.icon className="h-6 w-6 text-teal-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="py-16 bg-teal-900" aria-label="Our numbers">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                OneWayTaxi.ai in Numbers
              </h2>
              <p className="text-teal-200 text-lg">
                The figures that reflect our commitment to South Indian
                travellers.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  value: "120+",
                  label: "Cities Covered",
                  icon: Globe,
                  sub: "Across 5 states",
                },
                {
                  value: "50,000+",
                  label: "Rides Completed",
                  icon: Car,
                  sub: "And counting every day",
                },
                {
                  value: "4.8",
                  label: "Customer Rating",
                  icon: Star,
                  sub: "Out of 5 stars",
                },
                {
                  value: "24/7",
                  label: "Always Available",
                  icon: Clock,
                  sub: "365 days a year",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10"
                >
                  <stat.icon className="h-8 w-8 text-teal-300 mx-auto mb-3" />
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-teal-100">
                    {stat.label}
                  </div>
                  <div className="text-xs text-teal-300 mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Values ── */}
        <section className="py-20 bg-white" aria-label="Our values">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                The Values That Drive Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every ride we operate is guided by four core principles that
                shape our service, our technology, and our relationships with
                customers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Transparency",
                  desc: "We believe you deserve to know exactly what you are paying for. Every fare quote from OneWayTaxi.ai includes the complete cost breakdown — per-km rate, driver bata, toll charges, inter-state permits, and GST. There are no hidden fees, no surge pricing, and no post-ride additions. The price you see when you book is the price you pay when you arrive. This radical transparency has earned us the trust of thousands of repeat customers across South India.",
                  icon: Eye,
                  color: "bg-blue-100 text-blue-700",
                  hoverColor: "group-hover:bg-blue-600",
                },
                {
                  title: "Safety",
                  desc: "Your safety is non-negotiable. Every driver on our platform undergoes thorough background verification, including police clearance and driving record checks. All vehicles in our fleet are equipped with real-time GPS tracking, which our 24/7 control room monitors continuously. Our cars are regularly serviced, fully insured, and air-conditioned. We also share live trip details with your emergency contacts upon request, so your family always knows where you are.",
                  icon: Shield,
                  color: "bg-green-100 text-green-700",
                  hoverColor: "group-hover:bg-green-600",
                },
                {
                  title: "Affordability",
                  desc: "Our one-way fare model saves you up to 40% compared to traditional round-trip taxis. We achieve this through intelligent fleet routing — when you travel from Chennai to Bangalore, another passenger often needs to travel from Bangalore back to Chennai. By matching these one-way demands, we eliminate dead kilometres and pass the savings on to you. Starting at just ₹13 per kilometre, our fares make intercity taxi travel accessible to everyone, not just those who can afford round-trip rates.",
                  icon: IndianRupee,
                  color: "bg-amber-100 text-amber-700",
                  hoverColor: "group-hover:bg-amber-600",
                },
                {
                  title: "Reliability",
                  desc: "When we confirm your booking, we mean it. Our fleet operates 24 hours a day, 7 days a week, 365 days a year — including holidays, festivals, and peak seasons. Whether you need an early-morning airport transfer at 4 AM or a late-night intercity ride after a function, we are there. Our driver arrives at your doorstep on time, every time. In the rare event of a delay, our support team proactively communicates and arranges alternatives within minutes.",
                  icon: Zap,
                  color: "bg-purple-100 text-purple-700",
                  hoverColor: "group-hover:bg-purple-600",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div
                    className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-6 ${value.hoverColor} transition-colors duration-300`}
                  >
                    <value.icon className="h-7 w-7 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Coverage Area ── */}
        <section className="py-20 bg-gray-50" aria-label="Coverage area">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Where We Operate
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                OneWayTaxi.ai provides comprehensive one-way drop taxi coverage
                across five South Indian states and the union territory of
                Pondicherry. Our network spans over 120 cities and districts.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  state: "Tamil Nadu",
                  districts: "38 districts",
                  cities:
                    "Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, Vellore, Erode, Tiruppur, Thanjavur",
                },
                {
                  state: "Kerala",
                  districts: "14 districts",
                  cities:
                    "Kochi, Thiruvananthapuram, Kozhikode, Thrissur, Alappuzha, Palakkad, Kollam, Wayanad, Kannur, Idukki",
                },
                {
                  state: "Karnataka",
                  districts: "31 districts",
                  cities:
                    "Bangalore, Mysore, Mangalore, Hubli, Belgaum, Shimoga, Davangere, Bellary, Gulbarga, Hassan",
                },
                {
                  state: "Andhra Pradesh",
                  districts: "26 districts",
                  cities:
                    "Visakhapatnam, Vijayawada, Tirupati, Nellore, Guntur, Rajahmundry, Kakinada, Kurnool, Anantapur, Eluru",
                },
                {
                  state: "Telangana",
                  districts: "33 districts",
                  cities:
                    "Hyderabad, Warangal, Nizamabad, Karimnagar, Khammam, Mahbubnagar, Nalgonda, Adilabad, Medak, Rangareddy",
                },
                {
                  state: "Pondicherry",
                  districts: "4 districts",
                  cities:
                    "Pondicherry, Karaikal, Mahe, Yanam",
                },
              ].map((region) => (
                <div
                  key={region.state}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {region.state}
                      </h3>
                      <span className="text-xs text-teal-600 font-medium">
                        {region.districts}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Key cities: {region.cities}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why South India Needs One-Way Taxis
              </h3>
              <p className="text-gray-700 leading-relaxed">
                South India is uniquely suited for one-way drop taxi services
                due to its dense network of mid-sized cities located 100 to 500
                kilometres apart. Millions of people travel between these cities
                daily for work, education, healthcare, pilgrimages, and family
                events. Public transport options like buses and trains are often
                overcrowded, unreliable, or unavailable at convenient times. On
                the other hand, round-trip taxis have been prohibitively
                expensive for one-way journeys because passengers bore the cost
                of the empty return leg. OneWayTaxi.ai bridges this gap by
                offering dedicated one-way cabs that are affordable, punctual,
                and door-to-door &mdash; making comfortable intercity travel
                accessible to everyone across the region.
              </p>
            </div>
          </div>
        </section>

        {/* ── Pricing Overview ── */}
        <section className="py-16 bg-white" aria-label="Pricing overview">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Transparent Pricing, No Surprises
              </h2>
              <p className="text-lg text-gray-600">
                Every fare includes driver bata, toll charges, inter-state
                permits, and GST.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: "Mini", rate: "₹13/km", seats: "3+1" },
                { type: "Sedan", rate: "₹14/km", seats: "4+1" },
                { type: "SUV", rate: "₹19/km", seats: "7+1" },
                { type: "Innova Crysta", rate: "₹22/km", seats: "6+1" },
              ].map((vehicle) => (
                <div
                  key={vehicle.type}
                  className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
                >
                  <Car className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">
                    {vehicle.type}
                  </h3>
                  <div className="text-2xl font-bold text-teal-700 mb-1">
                    {vehicle.rate}
                  </div>
                  <p className="text-xs text-gray-500">
                    {vehicle.seats} seater
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section
          className="py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 relative overflow-hidden"
          aria-label="Book now"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-400/15 rounded-full blur-[100px]" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Save 40% on Your Next Intercity Ride?
            </h2>
            <p className="text-lg text-teal-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join over 50,000 happy travellers who have switched to
              OneWayTaxi.ai. Book your one-way drop taxi today and experience
              the difference that transparency, safety, and affordability
              make.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${phoneDigits}`}
                className="flex items-center gap-3 bg-white text-teal-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transition-colors shadow-lg hover:shadow-xl"
              >
                <Phone className="h-6 w-6" />
                Call {SUPPORT_PHONE}
              </a>
              <a
                href="/"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                Book Online
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <p className="text-teal-300 text-sm mt-6">
              Available 24/7, 365 days a year. Instant confirmation.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── BreadcrumbList JSON-LD (static data, no user input) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />

      {/* ── Organization / LocalBusiness + TaxiService JSON-LD (static data, no user input) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationSchema }}
      />
    </div>
  );
}
