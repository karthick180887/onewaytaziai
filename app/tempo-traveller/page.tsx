import type { Metadata } from "next";
import { Bus, Snowflake, Shield, Music, Users } from "lucide-react";
import VehicleLanding, { type VehicleLandingProps } from "@/components/seo/VehicleLanding";
import { getAllRoutes } from "@/lib/routes";

// Tempo Traveller is offered on request — pricing varies by configuration
// (12-seater AC vs. 17-seater non-AC, with/without push-back seats).
// The displayed rate below is the base 12-seater AC rate; final quote is
// confirmed at booking after vehicle availability check.
const TEMPO_RATE = 28; // ₹/km starting rate (12-seater AC)

export const metadata: Metadata = {
    title: "Tempo Traveller Booking | 12 & 17 Seater AC From ₹28/km | OneWayTaxi.ai",
    description:
        "Tempo Traveller booking for groups of 8-17 across South India. AC mini-bus for weddings, school trips, corporate offsites, family pilgrimages. From ₹28/km. Driver + carrier included.",
    alternates: { canonical: "https://onewaytaxi.ai/tempo-traveller" },
    openGraph: {
        title: "Tempo Traveller Booking | OneWayTaxi.ai",
        description: "12 and 17-seater AC Tempo Travellers for group travel across South India.",
        url: "https://onewaytaxi.ai/tempo-traveller",
        siteName: "OneWayTaxi.ai", type: "website", locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tempo Traveller — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "Tempo Traveller | OneWayTaxi.ai", description: "12-17 seater AC. Groups, weddings, offsites. From ₹28/km.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

const popularRoutes = getAllRoutes()
    .filter(r => r.from.tier === 1 && r.distanceKm >= 150 && r.distanceKm <= 600)
    .slice(0, 12)
    .map(r => ({ fromName: r.from.name, toName: r.to.name, slug: r.slug, distanceKm: r.distanceKm, fareEstimate: r.fareEstimate }));

const props: VehicleLandingProps = {
    pageSlug: "tempo-traveller",
    breadcrumbLabel: "Tempo Traveller",
    h1: "Tempo Traveller booking — 12 & 17 seater",
    tagline: "AC mini-bus for groups of 8-17. Force Traveller and Tata Winger configurations. Push-back seats, individual AC vents, ample luggage. Available on request — call us for instant quote.",
    intro: [
        "A Tempo Traveller (TT) is the standard group-travel vehicle in India for parties of 8 to 17 — too large for an SUV/Crysta but smaller than a full bus. Common configurations are the 12-seater (push-back, captain-style seating) and the 17-seater (regular bench seats), both with full AC and tinted windows.",
        "We offer Tempo Traveller bookings on request for one-way drops, multi-day round trips, sightseeing tours, and event transport. Common use cases include destination weddings (transferring guests between venues), school and college tours, corporate offsites, multi-family pilgrimages (Tirumala, Sabarimala, Velankanni), and Kerala backwaters trips with 10+ travellers.",
        "Pricing starts at ₹28/km for a 12-seater AC TT, with the same outstation logic as our other vehicles: tolls, driver bata, and GST included; night charges, inter-state permits, and parking extra. Because TT availability varies by city, please call us at +91 81244 76010 with your dates and route for confirmed pricing and vehicle assignment.",
    ],
    pricePerKm: TEMPO_RATE,
    seatCapacity: 12,
    typicalModels: ["Force Traveller 3700/4020", "Tata Winger", "12-seater & 17-seater AC variants"],
    bagCapacity: "12-17 bags (large boot + roof carrier)",
    headerIcon: Bus,
    keyFeatures: [
        { icon: Users, title: "12 or 17 seats", text: "Choose 12-seater (push-back captain-style) or 17-seater (bench) based on group size and comfort needs." },
        { icon: Snowflake, title: "Full cabin AC", text: "Multiple AC vents distribute cooling evenly. Critical for South Indian summer group travel." },
        { icon: Shield, title: "Experienced TT drivers", text: "Drivers trained for group dynamics, multi-stop tours, and tighter parking at temple/heritage sites." },
        { icon: Music, title: "Music + ambient lighting", text: "Bluetooth audio, USB charging across rows, ambient cabin lighting for multi-hour trips." },
    ],
    idealFor: [
        { title: "Destination weddings", text: "Transport baraat, family, and guests between hotel, mandap, reception venue. Multi-day usage common." },
        { title: "School & college tours", text: "Educational trips, NCC outings, sports team travel. CC TT operators have fleet of 17-seaters." },
        { title: "Corporate offsites", text: "Take 12-15 colleagues to a resort offsite. Single vehicle keeps the team together for the journey." },
        { title: "Multi-family pilgrimage", text: "Tirumala, Sabarimala, Madurai-Rameswaram circuits with 3-4 families travelling together." },
        { title: "Senior citizen tours", text: "Comfortable push-back seats and AC for elderly group tours, retirement community trips." },
        { title: "Event transport", text: "Conferences, exhibitions, hospital appointments for extended families. Single-vehicle convenience." },
    ],
    specs: [
        { label: "Vehicle category", value: "Tempo Traveller (mini-coach)" },
        { label: "Seating", value: "12 (push-back) or 17 (bench) + 1 driver" },
        { label: "Boot capacity", value: "Large rear boot plus roof carrier rack" },
        { label: "AC", value: "Full cabin AC with multiple vents" },
        { label: "Fuel", value: "Diesel" },
        { label: "Per-km rate", value: "From ₹28/km (12-seater AC)" },
        { label: "Higher-capacity rate", value: "17-seater varies — call for quote" },
        { label: "Outstation minimum", value: "150 km" },
        { label: "Driver bata (round trip)", value: "₹600/day" },
        { label: "Night halt", value: "₹600 per night" },
        { label: "Booking", value: "On request — call +91 81244 76010" },
    ],
    popularRoutes,
    faqs: [
        { q: "How many people fit in a Tempo Traveller?", a: "Two common configurations: 12-seater (most popular — push-back captain-style seats with individual armrests) and 17-seater (bench seats, lower per-seat cost). Choose based on group size and comfort budget. Both have full AC." },
        { q: "What does Tempo Traveller booking cost?", a: "12-seater AC TT starts at ₹28/km outstation. 17-seater rates vary by configuration. The fare includes driver bata, tolls, and GST. Inter-state permits, night halt, and parking are extras when applicable. Call us with your route and date for an exact quote." },
        { q: "Is Tempo Traveller available 24/7?", a: "Tempo Travellers are available but with less density than sedans/SUVs. We recommend 24-48 hours notice for guaranteed availability, especially during wedding season (Nov-Feb) and Sabarimala season (Nov-Jan). Same-day bookings can be tried via phone." },
        { q: "Which TT models do you provide?", a: "Most common: Force Traveller (3700 and 4020 variants — workhorse of Indian group travel) and Tata Winger. Both come in 12 and 17-seater configurations. Specific model assignment depends on city and availability." },
        { q: "Can I book a TT for a multi-day wedding?", a: "Yes — multi-day wedding bookings are very common. We can dedicate the same TT and driver for 2-5 day weddings, with daily km allowance and per-night halt charges. Request a custom quote with venue addresses and date range." },
        { q: "Does the TT have push-back seats?", a: "12-seater TTs typically have push-back captain-style seats with individual armrests — comfortable for 5+ hour journeys. 17-seaters are more often bench seats. Confirm seating type at booking." },
        { q: "Is there a luggage carrier?", a: "Yes — TTs come with rear boot plus roof carrier rack. Total luggage capacity is sufficient for 12-17 medium suitcases. For destination weddings, this handles the typical guest baggage easily." },
    ],
};

export default function TempoTravellerPage() {
    return <VehicleLanding {...props} />;
}
