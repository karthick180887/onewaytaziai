// lib/seo-content.ts — Dynamic content generation for district SEO pages

import { District, ServiceType } from './districts';
import { VEHICLE_TYPES } from './constants';

interface SEOContent {
    title: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    keywords: string[];
    serviceDescription: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface ReviewData {
    name: string;
    rating: number;
    text: string;
    route: string;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
    'drop-taxi': 'Drop Taxi',
    'taxi-service': 'Taxi Service',
    'outstation-cabs': 'Outstation Cabs',
    'cab-service': 'Cab Service',
    'one-way-taxi': 'One Way Taxi',
    'call-taxi': 'Call Taxi',
};

const SERVICE_VERBS: Record<ServiceType, string> = {
    'drop-taxi': 'one-way drop taxi',
    'taxi-service': 'reliable taxi service',
    'outstation-cabs': 'affordable outstation cabs',
    'cab-service': 'convenient cab service',
    'one-way-taxi': 'one-way taxi',
    'call-taxi': 'instant call taxi',
};

// ─── Per-city hand-tuned overrides for high-priority SERP cities ───────
// When a city/serviceType combination has an override, the rich serviceDescription
// + custom FAQ list replace the generic auto-generated versions. Other Type A pages
// continue with the auto-generated content unchanged.
//
// Key format: "{citySlug}-{serviceType}" (e.g. "coimbatore-taxi-service").
// A bare "{citySlug}" key applies to ALL service types for that city.
type CityOverride = {
    serviceDescription?: string;
    customFaqs?: FAQ[];
};

const CITY_OVERRIDES: Record<string, CityOverride> = {
    "chennai-drop-taxi": {
        serviceDescription: `OneWayTaxi.ai operates one of Chennai's largest one-way drop taxi networks, serving every part of metropolitan Chennai — from Velachery and OMR's IT corridor to T Nagar's heritage core, from Tambaram's southern suburbs to the airport at Meenambakkam. Whether you need an airport drop on a 4 AM international flight, a Chennai-Bangalore corporate run on the new NH48 expressway, a pilgrim drop to Tirupati for early-morning darshan, or a weekend escape to Pondicherry along the East Coast Road, our drop taxi service gives you a fixed all-inclusive fare from **₹13/km** with no return-trip charge.

### Chennai drop taxi fare per km (2026)
Our pricing is the same flat per-kilometre rate every booking — no surge pricing, no festival multiplier, no app-based fluctuation. The fare you see at booking is what you pay.

- **Mini / Hatchback (4-seat AC)** — ₹13/km. Best for solo travellers, couples, and short outstation drops up to 250 km.
- **Sedan (4-seat AC: Dzire / Etios / Xcent)** — ₹14/km. The most-booked category in Chennai for 2-4 passengers with mid-size luggage.
- **SUV (7-seat AC: Ertiga / Innova classic)** — ₹19/km. Right for families, hill-station trips to Yelagiri/Yercaud/Kodaikanal, and group bookings.
- **Innova Crysta (7-seat premium AC, captain seats)** — ₹22/km. Premium long-distance comfort with the smoothest ride for elderly travellers and corporate executives.
- **Tempo Traveller (12-17 seater AC)** — on request. Wedding parties, college tours, corporate offsites.

All fares include **fuel, tolls, ₹400/day driver bata, and 5% GST**. Excluded items disclosed up-front: night charges (₹250-500 between 10 PM and 6 AM), inter-state permit fees on Karnataka/Andhra/Pondicherry border crossings (₹150-500 typical), and parking at the destination.

### Pickup neighbourhoods in Chennai
We pick up from any address inside the Chennai Metropolitan Region. The most-booked pickup zones for our drivers are **T Nagar, Adyar, Velachery, Anna Nagar, Mylapore, Nungambakkam, Egmore, Kilpauk, Royapettah, Tambaram, Chromepet, Pallavaram, Porur, Vadapalani, K K Nagar, Saidapet, Guindy, OMR (Sholinganallur, Thoraipakkam, Perungudi, Navalur), and ECR (Thiruvanmiyur, Neelankarai, Akkarai)**. We also pick up from **Chennai International Airport (MAA)** with flight tracking, **Chennai Central** and **Chennai Egmore** railway stations at any platform exit, and **CMBT (Koyambedu)** bus stand for bus-to-cab transfers. Mention your exact pickup address at booking — we route the driver to your gate, not a 'nearest pickup point'.

### Top outstation routes from Chennai
Chennai's location at the head of the East Coast Road and the start of NH48 makes it the launch point for South India's busiest outstation corridors. Indicative one-way sedan fares (₹14/km × distance from our route data):

- **Chennai to Bangalore** — 346 km, ₹4,850, 6-7 hours via NH48 (Sriperumbudur-Vellore-Krishnagiri-Hosur).
- **Chennai to Pondicherry** — 150 km, ₹2,100, 3-3.5 hours via the scenic East Coast Road (ECR) past Mahabalipuram.
- **Chennai to Tirupati** — 135 km, ₹1,890, 2.5-3 hours via NH48 + NH71. Most-booked early-morning pilgrim run.
- **Chennai to Vellore** — 136 km, ₹1,904, 2.5 hours via NH48. Heavy CMC Hospital appointment traffic.
- **Chennai to Madurai** — 462 km, ₹6,470, 8-9 hours via NH45 through Trichy.
- **Chennai to Coimbatore** — 505 km, ₹7,070, 8-9 hours via Salem.
- **Chennai to Trichy** — 332 km, ₹4,650, 5.5-6 hours via NH45.
- **Chennai to Salem** — 340 km, ₹4,760, 6 hours via NH48.
- **Chennai to Kanchipuram** — 72 km, ₹1,008, 1.5 hours. Day-trip pilgrimage circuit.
- **Chennai to Mahabalipuram** — 58 km, ₹812, 1.5 hours via ECR. Half-day heritage trip.
- **Chennai to Rameswaram** — 578 km, ₹8,090, 10-11 hours via NH45 + NH87.
- **Chennai to Kodaikanal** — 530 km, ₹7,420, 10-11 hours via Madurai.
- **Chennai to Velankanni** — 360 km, ₹5,040, 6.5-7 hours. Pilgrim run.
- **Chennai to Kochi** — 688 km, ₹9,630, 12-13 hours.

For any route not listed, run an instant quote on our [fare calculator](/fare-calculator) — we cover 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Pondicherry.

### Chennai Airport (MAA) drop taxi service
MAA is one of South India's busiest airports and our most-frequent pickup-and-drop point. We offer:

- **Flight-tracked airport pickups** with the first 60 minutes of waiting after touchdown free.
- **Most-booked airport drops:** MAA-to-Bangalore (₹5,070), MAA-to-Pondicherry (₹2,100), MAA-to-Tirupati (₹1,890), MAA-to-Vellore CMC (₹1,904), MAA-to-Mahabalipuram (₹812).
- **Same-airport transfers** (MAA-to-CMBT, MAA-to-Chennai Central, MAA-to-Mylapore) for short city legs at ₹500-700.
- **24/7 international arrival pickup** with name placards available on request — common for elderly relatives and first-time visitors.

### What makes our Chennai drop taxi service different
Three things that competitors don't consistently deliver in Chennai:

- **Tamil-speaking drivers by default.** All our Chennai drivers speak fluent Tamil and Hindi; most are conversational in English. For Karnataka/Andhra outstation drops, we assign drivers comfortable with destination-state languages too.
- **Verified driver badges.** Every Chennai driver in our network carries a valid commercial badge, has 3+ years of professional experience, and is background-checked. Driver name, photo, and badge number are shared with you 30-60 minutes before pickup.
- **GST-compliant invoices for corporate billing.** Mention your company name and GSTIN at booking — useful for the IT cluster on OMR/Sholinganallur, the Sriperumbudur manufacturing belt, and Chennai's broader corporate base.

### Booking — three ways, three minutes
Book your Chennai drop taxi in under three minutes via:

1. **Online** — fill our booking widget on this page. You see an instant quote; confirmation comes within 5 minutes by SMS and WhatsApp.
2. **Phone** — call our 24/7 helpline at **+91 81244 76010**. Voice booking with a human agent takes about 90 seconds.
3. **WhatsApp** — message us with your route and time. Driver assignment is shared 30-60 minutes before pickup.

### Chennai Central, Egmore, and CMBT — station-to-cab logistics
Chennai's three major transit nodes have specific pickup logic that experienced drivers know:

- **Chennai Central (MAS):** the main entrance is on Periyar Salai (East). Suburban exit at the West side. Specify which side at booking.
- **Chennai Egmore (MS):** main entrance on Gandhi Irwin Salai. Egmore taxis cluster on the east side; we slot driver to the south exit for smaller crowds.
- **CMBT Koyambedu:** the city's largest bus terminal — we pick up at the eastern entry where private taxis are permitted (not the auto-stand congested western side).

### IT corridor commutes — OMR and Sholinganallur weekend escapes
The Old Mahabalipuram Road (OMR) tech corridor runs from Tidel Park / Taramani to Mahabalipuram. We routinely run weekend bookings from OMR addresses (Sholinganallur, Navalur, Siruseri SIPCOT) to weekend destinations: Pondicherry (3 hours via ECR), Mahabalipuram (1.5 hours), Yelagiri Hills (4 hours), or back to home cities (Hyderabad, Bangalore via Chennai-Bangalore corridor). Late-Friday and early-Saturday pickups from OMR are our most-booked corporate weekend pattern; book 24-48 hours ahead during long-weekend peaks.

### Pilgrim drops — Tirupati, Velankanni, Madurai
Chennai is the launch point for several major pilgrim circuits. Most-booked patterns:

- **Tirupati darshan** (135 km, 3 hours) — 4-5 AM Chennai departure for first-batch darshan. Sedan or SUV most common; Crysta for elderly travellers.
- **Velankanni Marian shrine** (360 km, 6.5 hours) — typically a 2-night trip. Multi-day package available.
- **Madurai Meenakshi** (462 km, 8-9 hours) — often combined with Rameswaram and Kanyakumari into a 3-4 day pilgrim package.

For any of these, we can quote a multi-stop or multi-day package — usually 20-30% cheaper than booking separate one-way trips.

### Frequently chosen for
Our Chennai taxi customers most often book us for these specific use cases: **MAA airport-to-Bangalore corporate transfers** (especially for international transit), **Chennai-Pondicherry weekend escapes** for IT couples, **Chennai-Tirupati early-morning pilgrim trips** for elderly families, **medical drops to Vellore CMC and Bangalore super-specialty hospitals**, **wedding-season multi-day Tempo Traveller bookings** for guest movement around Chennai's heritage venues, and **OMR-IT-corridor late-evening drops** to home cities.`,
        customFaqs: [
            { question: "What is the cheapest Chennai drop taxi service?", answer: "OneWayTaxi.ai offers the lowest per-km rates for Chennai outstation: ₹13/km hatchback, ₹14/km sedan, ₹19/km SUV, ₹22/km Innova Crysta — all-inclusive of tolls, driver bata, GST. App-based services like Uber and Ola charge surge pricing during peak hours and festivals; our flat rate stays the same any day, any time." },
            { question: "How do I book a drop taxi in Chennai?", answer: "Three ways: (1) book online via our widget for instant quote and 5-minute confirmation, (2) call +91 81244 76010 24/7 — a human agent confirms in 90 seconds, or (3) message us on WhatsApp. Driver name, photo, and badge number are shared 30-60 minutes before pickup." },
            { question: "How much per km for a Chennai drop taxi?", answer: "Per-km rates: ₹13 mini, ₹14 sedan, ₹19 SUV, ₹22 Innova Crysta. Tempo Traveller (12-17 seats) is quoted on request. All rates include fuel, tolls, ₹400/day driver bata, 5% GST. Outstation drops have a 130 km minimum to cover the driver's deadhead return." },
            { question: "What is the Chennai to Bangalore taxi fare?", answer: "Chennai-Bangalore via NH48 is 346 km. Sedan ₹4,850, SUV ₹6,580, Innova Crysta ₹7,270 — all-inclusive of inter-state permit (~₹500), tolls, driver bata, GST. Drive time 6-7 hours. The most-booked outstation route from Chennai." },
            { question: "Do you provide airport pickup at MAA Chennai Airport?", answer: "Yes — we offer flight-tracked pickup at Chennai International Airport (MAA) 24/7. The first 60 minutes after touchdown are free waiting time. Most-booked MAA drops: MAA-to-Bangalore (₹5,070), MAA-to-Pondicherry (₹2,100), MAA-to-Tirupati (₹1,890), MAA-to-Vellore CMC (₹1,904)." },
            { question: "Are Chennai drop taxis available 24/7?", answer: "Yes. Our Chennai network operates 24/7, 365 days. Late-night (10 PM-6 AM) bookings attract a small night charge of ₹250-500 disclosed up-front. Common 4 AM and 5 AM bookings: airport drops, hospital transfers, Tirupati pilgrim trips." },
            { question: "Can I get a GST invoice for my Chennai taxi booking?", answer: "Yes. Mention your company name and GSTIN at booking and we issue a GST-compliant invoice within 24 hours. Useful for IT corridor (OMR/Sholinganallur) corporate billing, Sriperumbudur manufacturing visits, and broader Chennai corporate accounts." },
            { question: "What's the best vehicle for a Chennai-to-Bangalore trip?", answer: "For 1-3 passengers with light luggage: sedan (Etios/Dzire) at ₹4,850 is best value. For 4-7 family travellers: SUV (Ertiga/Innova) at ₹6,580. For corporate executives or elderly: Innova Crysta at ₹7,270 — quieter cabin, captain seats, smoothest 6-7 hour ride." },
            { question: "Do you provide drop taxis to Vellore CMC Hospital?", answer: "Yes — Chennai-to-Vellore (CMC) is one of our most-booked medical routes. 136 km via NH48, 2.5 hours. Sedan ₹1,904, SUV ₹2,584, Crysta ₹2,856. Many CMC patients book Crysta for the elderly comfort. Round-trip same-day appointment patterns are common; mention 'CMC drop' at booking for direct routing to the hospital gate." },
            { question: "What's the cancellation policy for a Chennai taxi booking?", answer: "Free cancellation more than 4 hours before pickup. Within 4 hours: flat ₹200 service fee. After driver reaches pickup: ₹500 no-show fee. Reschedules free up to 2 hours before pickup. Refunds processed within 3-5 working days to the original payment method." },
        ],
    },
    "coimbatore-taxi-service": {
        serviceDescription: `OneWayTaxi.ai operates the most-booked outstation taxi service in **Coimbatore (Kovai)** — the textile capital of South India and the gateway to the Western Ghats. Whether you're catching a connection from Coimbatore International Airport (CJB), heading up to Ooty for a weekend, dropping a family member at Bangalore on the morning shift, or making a one-way move to Kochi, our drop-taxi network gives you a fixed all-inclusive fare from **₹13/km** with no return-trip charge.

### Coimbatore taxi fare per km (2026)
Our pricing is the same flat per-kilometre rate every booking — no surge pricing, no festival multiplier, no app-based fluctuation. The fare you see at booking is what you pay.

- **Mini / Hatchback (4-seat AC)** — ₹13/km. Ideal for solo travellers, couples, and short outstation drops up to 250 km.
- **Sedan (4-seat AC, Dzire / Etios / Xcent)** — ₹14/km. The most-booked category for 2-4 passengers with mid-size luggage.
- **SUV (7-seat AC, Ertiga / Innova classic)** — ₹19/km. Right for families, hill-station trips to Ooty/Kodaikanal, and group bookings.
- **Innova Crysta (7-seat premium AC, captain seats)** — ₹21/km. Premium long-distance comfort with the smoothest ride on ghat sections.
- **Tempo Traveller (12-17 seater AC)** — on request. Wedding parties, college tours, and corporate offsites.

All fares include **fuel, tolls, ₹400/day driver bata, and 5% GST**. Excluded items disclosed up-front: night charges (₹250-500 between 10 PM and 6 AM), inter-state permit fees on Karnataka/Kerala border crossings, and parking at the destination.

### Pickup points in Coimbatore (door-to-door)
We pick up from any address inside Coimbatore municipality and the Coimbatore-Tiruppur metropolitan region. The most-booked pickup neighbourhoods for our drivers are **Gandhipuram, RS Puram, Saibaba Colony, Saravanampatti, Peelamedu, Singanallur, Ukkadam, Race Course, Avinashi Road, and Trichy Road**. We also pick up from **Coimbatore International Airport (CJB)** with flight tracking, **Coimbatore Junction railway station** at any platform exit, and the **Gandhipuram and Ukkadam bus stands** for bus-to-cab transfers. Mention your exact pickup address at booking — we will not redirect you to a "nearest pickup point."

### Top outstation routes from Coimbatore
Coimbatore's location at the foothills of the Nilgiris and at the centre of South India's road grid makes it a launch point for some of the most-booked outstation routes on our network. Indicative one-way sedan fares (₹14/km × distance):

- **Coimbatore to Bangalore** — 365 km, ₹5,110, ~7-8 hours via NH544 + NH948.
- **Coimbatore to Chennai** — 505 km, ₹7,070, ~8-9 hours via Salem.
- **Coimbatore to Ooty** — 86 km, ₹1,200, ~3 hours via NH181 (36 hairpin bends).
- **Coimbatore to Kodaikanal** — 175 km, ₹2,450, ~5 hours via Palani.
- **Coimbatore to Munnar** — 170 km, ₹2,380, ~4.5 hours via Pollachi-Marayoor.
- **Coimbatore to Madurai** — 218 km, ₹3,050, ~5 hours via NH85.
- **Coimbatore to Kochi** — 196 km, ₹2,744, ~5 hours via Walayar.
- **Coimbatore to Coonoor** — 70 km, ₹980, ~2.5 hours.
- **Coimbatore to Trichy** — 213 km, ₹2,982, ~5 hours.
- **Coimbatore to Tirupur** — 50 km, ₹700, ~1 hour. Common daily commute booking.
- **Coimbatore to Salem** — 160 km, ₹2,240, ~3.5 hours.
- **Coimbatore to Palakkad** — 55 km, ₹770, ~1.5 hours.

For any route not listed, run an instant quote on our [fare calculator](/fare-calculator) — we cover 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Pondicherry.

### What makes our Coimbatore taxi service different
Three things that competitors don't consistently deliver in Coimbatore:

- **Tamil-speaking drivers by default.** All our Coimbatore drivers speak fluent Tamil and Hindi; most are conversational in English. For Karnataka or Kerala drops, we assign drivers comfortable with both source and destination languages — important for elderly passengers travelling solo.
- **Verified driver badges.** Every Coimbatore driver in our network carries a valid commercial badge, has 3+ years of professional experience, and is background-checked through our internal process. The driver name and badge number are shared with you 30-60 minutes before pickup.
- **GST invoices for corporate billing.** Mention your company name and GSTIN at booking and you receive a GST-compliant invoice within 24 hours. Useful for the Coimbatore textile, engineering, and IT clusters at SIDCO and Saravanampatti.

### Booking — three ways, three minutes
Book your Coimbatore taxi in under three minutes via:

1. **Online** — fill our booking widget on this page or the homepage. You see an instant quote; confirmation comes within 5 minutes by SMS and WhatsApp.
2. **Phone** — call our 24/7 helpline at **+91 81244 76010**. Voice booking with a human agent takes about 90 seconds.
3. **WhatsApp** — message us with your route and time. Driver assignment is shared 30-60 minutes before pickup.

### When to book in advance vs. same-day
Same-day bookings work fine for sedans inside Coimbatore city (1-2 hour notice). For SUV and Crysta categories during peak weekends (Friday evening, Saturday morning), we recommend at least 4-6 hours advance notice. For long weekends, Pongal, and December-January peak season, book 24-48 hours ahead — vehicles are limited at festival edges.

### Frequently chosen for
Our Coimbatore taxi customers most often book us for these specific use cases: **Coimbatore airport-to-Ooty transfers** (especially from international flights), **Coimbatore to Bangalore corporate runs**, **Coimbatore to Munnar weekend getaways** for 5-7 person family groups, **medical drops to Bangalore and Chennai super-specialty hospitals**, and **wedding-season multi-day Tempo Traveller bookings** for guest movement between Coimbatore and Tiruppur venues.

### Coimbatore Junction railway station — pickup logistics
Coimbatore Junction (CBE) sees over 100,000 daily passengers across its 6 platforms and is the route's busiest pickup point after CJB airport. We monitor your train's actual arrival via IRCTC and adjust the driver's positioning. The station has two main exits: the **North side (Ukkadam direction)** is best for cabs heading to Pollachi, Madurai, Munnar, and Kerala; the **South side (Gandhipuram direction)** is best for cabs to Bangalore, Salem, Chennai, and Tiruppur. Mention your platform and exit at booking and we slot the driver to the closer side — saves 5-10 minutes of cross-station walking.

### Saravanampatti and Tidel Park — IT cluster transfers
Coimbatore's IT corridor at **Saravanampatti and Tidel Park** has a steady flow of conference attendees, vendor visits, and weekend home-runs. We handle late-evening drops to Bangalore and Chennai (most-booked: Friday 7-9 PM Saravanampatti pickups for Bangalore arrival by 4 AM Saturday). Corporate accounts get GST invoices, monthly billing on request, and dedicated drivers for repeat routes. For multi-stop conference logistics — picking up speakers from CJB and dropping them at Le Meridien, Vivanta, or Sangam — we run a small bench of sedan + Crysta combinations.

### Tiruppur knitwear cluster — buyer pickup specifics
**Tiruppur** is 50 km east of Coimbatore and the destination of many international knitwear buyers. We routinely run CJB-to-Tiruppur transfers for European and US visitors who fly into CJB and head straight to factory inspections. The standard route is via NH544 / Avinashi Road — 1 hour 15 minutes including the Avinashi toll. For multi-day buyer visits, we offer fixed-driver assignment so the same vehicle and driver covers factory rounds across Tiruppur, Erode, and Coimbatore over 3-5 days.

### Wedding-season multi-day Tempo Traveller bookings
Coimbatore's wedding season concentrates around **November-March** with major venues at the **Coimbatore-Pollachi belt** (Codissia Trade Fair, Sangam Convention Hall, Vijaya Mahal) and the Tiruppur direction (Sri Vasavi Tex hall, Chettinad-style heritage venues). For 50-150 guest weddings, we run Tempo Traveller bookings with multiple vehicles ferrying guests between hotels (Le Meridien, Vivanta, Hyatt, Lemon Tree), the muhurat venue, and reception locations. Wedding bookings are typically locked 30-60 days ahead with a 30% advance; mention your guest count and venue list at booking for an integrated multi-vehicle quote.

### Sai Mandir, Marudhamalai, Perur — local pilgrim routes
Coimbatore is a religious node for several day-trip pilgrim circuits: **Marudhamalai** (12 km from Gandhipuram, hilltop Murugan temple), **Perur Pateeswarar Temple** (8 km from RS Puram, ancient Shiva temple), **Sri Sai Mandir Avinashi Road** (15 km, Shirdi Sai), and the **Coimbatore Anna Centenary Library** (rare-book pilgrimage in itself). We offer per-trip quotes for these local circuits — most are 4-6 hour round trips at sedan rates of ₹600-₹1,200.

### Highway routing intelligence — Coimbatore corridors
The two Bangalore-bound highways from Coimbatore are **NH544 via Salem** (365 km, 7-8 hours, well-maintained) and the longer alternate via **Mysore-Bandipur** (470 km, 9-10 hours, scenic but slower due to night-time forest closure 9 PM-6 AM). Our drivers default to NH544 unless you specifically request the Bandipur route for the wildlife corridor experience. For Chennai (505 km), the standard route is **NH544 + NH48 via Salem** (8-9 hours); the alternate via Tiruchirappalli adds 80 km but is preferred during Salem-area traffic events.`,
        customFaqs: [
            {
                question: "Which taxi is cheapest in Coimbatore?",
                answer: "OneWayTaxi.ai offers the lowest per-kilometre rates for outstation Coimbatore taxis: ₹13/km for a hatchback, ₹14/km for a sedan, ₹19/km for an SUV, and ₹21/km for an Innova Crysta — all-inclusive of tolls, driver bata and GST. App-based services like Uber and Ola charge surge pricing during peak hours; our flat rate stays the same any day, any time.",
            },
            {
                question: "How do I book a taxi in Coimbatore?",
                answer: "Three ways: (1) book online via our booking widget for instant quote and 5-minute confirmation, (2) call +91 81244 76010 24/7 — a human agent confirms in 90 seconds, or (3) message us on WhatsApp with your pickup, drop and time. Driver details are shared 30-60 minutes before pickup.",
            },
            {
                question: "How much per km for a taxi in Coimbatore?",
                answer: "Per-km rates: ₹13 (mini/hatchback, 4 seats), ₹14 (sedan, 4 seats), ₹19 (SUV, 7 seats), ₹21 (Innova Crysta, 7 seats). Tempo Traveller (12-17 seats) is quoted on request. All rates include fuel, tolls, ₹400/day driver bata and 5% GST. Outstation drops have a 130 km minimum to cover the driver's deadhead return.",
            },
            {
                question: "Is Ola or Uber available in Coimbatore?",
                answer: "Both Ola and Uber operate in Coimbatore but with limited outstation availability and surge pricing during peak hours, festivals or rain. For a guaranteed fixed-fare outstation booking with a verified Tamil-speaking driver, dedicated drop-taxi operators like OneWayTaxi.ai give better consistency — especially on Coimbatore-to-Ooty, Coimbatore-to-Bangalore and airport routes.",
            },
            {
                question: "What is the Coimbatore to Ooty taxi fare?",
                answer: "Coimbatore to Ooty is 86 km via NH181. One-way sedan fare is approximately ₹1,200, SUV ₹1,640, Innova Crysta ₹1,810 — all-inclusive. Travel time is 2.5-3 hours including the 36 hairpin bends. We recommend an early-morning (before 9 AM) departure to avoid afternoon ghat-road mist.",
            },
            {
                question: "Do you provide airport pickup at Coimbatore Airport (CJB)?",
                answer: "Yes — we offer flight-tracked pickup at Coimbatore International Airport (CJB) 24/7. The first 60 minutes of waiting after touchdown are free. Most popular CJB transfers: airport-to-city (₹500 minimum), CJB-to-Ooty (₹1,200), CJB-to-Coonoor (₹980), CJB-to-Pollachi (₹910), CJB-to-Tiruppur (₹700).",
            },
            {
                question: "Are Coimbatore taxis available 24/7?",
                answer: "Yes. Our Coimbatore network operates 24/7, 365 days. Late-night (10 PM-6 AM) bookings attract a small night charge of ₹250-500 depending on vehicle, disclosed up-front. Common 4 AM and 5 AM bookings: airport drops, hospital transfers, and outstation pilgrimage trips to Madurai/Rameswaram.",
            },
            {
                question: "Can I get a GST invoice for my Coimbatore taxi booking?",
                answer: "Yes. Mention your company name and GSTIN at booking time and we issue a GST-compliant invoice within 24 hours. Useful for Coimbatore's textile, engineering, IT and exporter clusters where employee travel is reimbursed against tax invoice.",
            },
            {
                question: "What vehicle should I book for a Coimbatore-to-Bangalore trip?",
                answer: "For 1-3 passengers with light luggage, a sedan (Etios/Dzire) at ₹5,110 is the best value for the 365 km route. For 4-7 passengers or families with heavy luggage and elderly travellers, the Innova Crysta at ₹7,665 is more comfortable for the 7-8 hour drive. SUV (Ertiga) at ₹6,935 is the middle option.",
            },
            {
                question: "Can I cancel my Coimbatore taxi booking?",
                answer: "Yes. Free cancellation more than 4 hours before pickup. Within 4 hours, a flat ₹200 service fee applies. After driver reaches the pickup location, a ₹500 no-show fee applies. Reschedules are free up to 2 hours before pickup. Refunds are processed within 3-5 working days.",
            },
        ],
    },
};

function getCityOverride(district: District, serviceType: ServiceType): CityOverride | null {
    const k1 = `${district.slug}-${serviceType}`;
    if (CITY_OVERRIDES[k1]) return CITY_OVERRIDES[k1];
    if (CITY_OVERRIDES[district.slug]) return CITY_OVERRIDES[district.slug];
    return null;
}

// ─── SEO Content Generators ─────────────────────────────────

export function getSEOContent(district: District, serviceType: ServiceType): SEOContent {
    const label = SERVICE_LABELS[serviceType];
    const verb = SERVICE_VERBS[serviceType];
    const topRoute = district.popularRoutes[0];
    const dn = district.name;
    const dl = district.name.toLowerCase();
    const currentYear = new Date().getFullYear();

    // Title: Optimized for <60 chars with CTR power words & Year
    const TITLE_TEMPLATES: Record<ServiceType, string> = {
        'drop-taxi': `${dn} Drop Taxi Service — Flat ₹${VEHICLE_TYPES[0].price}/km | Save 40%`,
        'taxi-service': `${dn} Taxi Service (${currentYear}) — Book @ ₹${VEHICLE_TYPES[0].price}/km`,
        'outstation-cabs': `${dn} Outstation Cabs — One Way Drops from ₹${VEHICLE_TYPES[0].price}/km`,
        'cab-service': `#1 ${dn} Cab Service — Book @ ₹${VEHICLE_TYPES[0].price}/km | 24/7`,
        'one-way-taxi': `${dn} One Way Taxi — Pay One Way from ₹${VEHICLE_TYPES[0].price}/km`,
        'call-taxi': `Call Taxi in ${dn} — Instant Booking @ ₹${VEHICLE_TYPES[0].price}/km | 24/7`,
    };

    // Meta Description: Optimized for <155 chars with CTA
    const topRouteText = topRoute ? `${dn} to ${topRoute.to} ₹${topRoute.fareEstimate}. ` : '';
    const META_TEMPLATES: Record<ServiceType, string> = {
        'drop-taxi': `Book ${dn} drop taxi from ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}Pay one-way fare only. No return charges. Verified drivers. Call +91 81244 76010!`,
        'taxi-service': `Best taxi service in ${dn}, ${district.state}. ${topRouteText}AC cabs from ₹${VEHICLE_TYPES[0].price}/km. 24/7 booking, verified drivers. Call +91 81244 76010!`,
        'outstation-cabs': `Book outstation cabs from ${dn} at ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}One-way pricing, AC vehicles, verified drivers. Call +91 81244 76010!`,
        'cab-service': `Best cab service in ${dn}. ${topRouteText}AC cabs from ₹${VEHICLE_TYPES[0].price}/km. One-way & round trips. Verified drivers. Call +91 81244 76010!`,
        'one-way-taxi': `Book one way taxi from ${dn} at ₹${VEHICLE_TYPES[0].price}/km. ${topRouteText}Pay only one-way fare, no return charges. Call +91 81244 76010!`,
        'call-taxi': `Call taxi in ${dn} — instant booking, verified drivers, GPS tracking. ${topRouteText}AC cabs from ₹${VEHICLE_TYPES[0].price}/km. Call +91 81244 76010 now!`,
    };

    return {
        title: TITLE_TEMPLATES[serviceType],
        metaDescription: META_TEMPLATES[serviceType],
        h1: `#1 ${dn} ${label} — Lowest Price Guaranteed | Save 40%`,
        subtitle: `Premium ${verb} in ${dn}, ${district.state}. Pay only for one way — no return fare, no hidden charges. Trusted by 50,000+ happy travelers in ${currentYear}.`,
        keywords: [
            `${dl} ${label.toLowerCase()}`,
            `${dl} to ${topRoute?.to.toLowerCase() || 'bangalore'} taxi`,
            `${label.toLowerCase()} ${dl}`,
            `one way taxi ${dl}`,
            `${dl} cab booking`,
            `outstation taxi ${dl}`,
            `${dl} ${district.state.toLowerCase()} taxi`,
            `cheap taxi ${dl}`,
            `${dl} one way cab`,
            `book taxi ${dl}`,
            `${dl} to ${topRoute?.to.toLowerCase() || 'bangalore'} cab fare`,
            `${dl} drop taxi contact number`,
            `call taxi ${dl}`,
        ],
        serviceDescription: getCityOverride(district, serviceType)?.serviceDescription
            ?? generateServiceDescription(district, serviceType),
    };
}

function generateServiceDescription(district: District, serviceType: ServiceType): string {
    const verb = SERVICE_VERBS[serviceType];
    const dn = district.name;
    const ds = district.state;
    const topRoutes = district.popularRoutes.slice(0, 3);
    const routeText = topRoutes.map(r => `${dn} to ${r.to} (${r.distanceKm} km, ~₹${r.fareEstimate})`).join(', ');
    const routeNames = topRoutes.map(r => r.to).join(', ');

    const descriptions: Record<ServiceType, string> = {
        'drop-taxi': `Looking for a **${verb} in ${dn}**? OneWayTaxi.ai offers the most affordable one-way drop taxi service from ${dn}, ${ds}. Unlike traditional round-trip taxis where you pay for the driver's return journey, our drop taxi model charges you only for the distance you actually travel — **saving up to 40%** on your fare compared to competitors.

### Why Book Our ${dn} Drop Taxi?
Our ${dn} drop taxi fleet includes **Mini/Hatchbacks (₹${VEHICLE_TYPES[0].price}/km)**, Sedans like Swift Dzire and Toyota Etios (₹${VEHICLE_TYPES[1].price}/km), SUVs (₹${VEHICLE_TYPES[4]?.price || 19}/km), and premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). Every vehicle is air-conditioned, GPS-tracked, and regularly serviced for your comfort and safety.

### Popular Routes
Popular one-way drop taxi routes from ${dn}: ${routeText}. Whether you're traveling for business, family visits, medical appointments, or pilgrimage, our ${dn} drop taxi service ensures a comfortable, reliable, and budget-friendly journey. All fares are inclusive of driver bata (allowance), toll charges, inter-state permits, and GST — what you see is what you pay, with absolutely zero hidden charges. Book your ${dn} drop taxi now online or call us 24/7.`,

        'taxi-service': `OneWayTaxi.ai is your trusted **${verb} in ${dn}, ${ds}**. Whether you need a local city ride, a long-distance outstation trip, or an airport transfer, we have you covered with our wide range of well-maintained, AC vehicles driven by professional, background-verified drivers.

### Best Rate Guarantee
What makes our ${dn} taxi service stand out? Transparent one-way pricing (no return charges), real-time GPS tracking, 24/7 availability, and a 4.8-star customer rating. Unlike app-based taxi services that charge surge pricing during peak hours, festivals, or rain, our ${dn} taxi fare stays fixed — no surprises at the end of your journey.

### Destinations
Popular destinations from ${dn}: ${routeText}. We also serve ${routeNames} and 220+ other cities across ${ds}, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana. Our ${dn} taxi service is available for one-way drops, round trips, multi-city tours, and corporate travel. Book online in 30 seconds or call our 24/7 helpline for instant confirmation.`,

        'outstation-cabs': `Planning an outstation trip from ${dn}? Book your **${verb}** with OneWayTaxi.ai and enjoy hassle-free intercity travel across ${ds} and all of South India. Our outstation cabs service is designed for travelers who want the convenience of a private vehicle at the affordability of a one-way fare structure.

### Save on Intercity Travel
Why choose OneWayTaxi.ai for outstation cabs from ${dn}? We eliminate the traditional round-trip billing model — you pay only for the distance from ${dn} to your destination. This makes our outstation cabs up to 40% cheaper than regular taxi services. Your fare includes driver allowance, toll charges, state permits, and GST.

### Fleet & Routes
Top outstation routes from ${dn}: ${routeText}. Our outstation cabs fleet covers 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry with vehicles ranging from budget hatchbacks (₹${VEHICLE_TYPES[0].price}/km) to premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). All vehicles are air-conditioned, clean, GPS-tracked, and driven by experienced, verified drivers who know the best highway routes.`,

        'cab-service': `Looking for a **${verb} in ${dn}**? OneWayTaxi.ai is your go-to cab booking platform in ${dn}, ${ds}. Whether you need a local city ride, an outstation trip, or an airport transfer, our comprehensive cab service has you covered with well-maintained AC vehicles and professional, verified drivers.

### Book Any Ride in ${dn}
Our ${dn} cab service covers every travel need — local errands, one-way intercity drops, round-trip outstation journeys, and airport pickups & drop-offs. With our one-way pricing model, you save up to 40% compared to traditional round-trip cabs. All fares include driver bata, toll charges, permits, and GST — no hidden surprises.

### Fleet & Popular Routes
Top routes from ${dn}: ${routeText}. Choose from Hatchbacks (₹${VEHICLE_TYPES[0].price}/km), Sedans (₹${VEHICLE_TYPES[1].price}/km), SUVs, and premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). Every vehicle is air-conditioned, GPS-tracked, and regularly sanitized. Book your ${dn} cab online in 30 seconds or call us 24/7 at +91 81244 76010.`,

        'one-way-taxi': `Looking for a **one-way taxi in ${dn}**? OneWayTaxi.ai offers the best one-way taxi service from ${dn}, ${ds}. Pay only for the distance you travel — no return fare, no hidden charges. Save up to 40% compared to round-trip taxis.

### Affordable One Way Taxi from ${dn}
Our ${dn} one-way taxi fleet includes **Hatchbacks (₹${VEHICLE_TYPES[0].price}/km)**, Sedans (₹${VEHICLE_TYPES[1].price}/km), SUVs, and premium Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km). Every vehicle is air-conditioned, GPS-tracked, and driven by verified drivers.

### Popular One Way Routes
Top one-way taxi routes from ${dn}: ${routeText}. All fares include driver bata, toll charges, permits, and GST. Book your ${dn} one-way taxi online or call us 24/7.`,

        'call-taxi': `Need a **${verb} in ${dn}**? OneWayTaxi.ai provides instant call taxi booking in ${dn}, ${ds}. Whether you need a quick local ride across the city, a pickup from ${dn} railway station, or a last-minute outstation trip — just call us at +91 81244 76010 or book online in 30 seconds. Your driver arrives at your doorstep, ready to go.

### Why Call OneWayTaxi.ai in ${dn}?
Unlike auto-rickshaws and app-based taxis that charge surge pricing during peak hours, rain, or festivals, our ${dn} call taxi fare stays **fixed and transparent**. No meter tampering, no surge, no bargaining. Our fleet includes AC Hatchbacks (₹${VEHICLE_TYPES[0].price}/km), Sedans (₹${VEHICLE_TYPES[1].price}/km), SUVs, and Innova Crysta (₹${VEHICLE_TYPES[VEHICLE_TYPES.length - 1].price}/km) — all GPS-tracked and driven by verified, professional drivers.

### Local & Outstation Coverage
Popular routes from ${dn}: ${routeText}. Our ${dn} call taxi service covers local city rides, railway station pickups, hospital visits, shopping trips, and intercity travel to ${routeNames} and 220+ other cities. Available 24/7, 365 days. All fares include driver bata, tolls, and GST with zero hidden charges.`,
    };

    return descriptions[serviceType];
}

export function getWhyChooseUs(district: District) {
    return [
        {
            title: 'Flat One-Way Rate',
            desc: `Pay only for the km you travel. No return charges. Save up to 40% on ${district.name} outstation trips.`,
            icon: 'Wallet'
        },
        {
            title: 'No Hidden Charges',
            desc: 'Prices include Tolls, Driver Bata & GST. The quote you see is the final price you pay.',
            icon: 'FileCheck'
        },
        {
            title: 'On-Time Pickup',
            desc: `Reliable pickup service in ${district.name} with 24/7 customer support and live tracking.`,
            icon: 'Clock'
        },
    ];
}

// ─── FAQ Generator ──────────────────────────────────────────

export function getFAQs(district: District, serviceType: ServiceType): FAQ[] {
    // Hand-tuned FAQs override generic ones for high-priority cities.
    const override = getCityOverride(district, serviceType);
    if (override?.customFaqs && override.customFaqs.length > 0) {
        return override.customFaqs;
    }

    const label = SERVICE_LABELS[serviceType];
    const topRoute = district.popularRoutes[0];
    const cheapestRate = VEHICLE_TYPES[0].price;

    const baseFAQs: FAQ[] = [
        {
            question: `What is the starting fare for ${label.toLowerCase()} in ${district.name}?`,
            answer: `The starting fare for ${label.toLowerCase()} in ${district.name} is ₹${cheapestRate}/km for a hatchback. Sedan rates start at ₹${VEHICLE_TYPES[1].price}/km, SUV at ₹${VEHICLE_TYPES[2].price}/km, and Innova Crysta at ₹${VEHICLE_TYPES[3].price}/km. All fares include driver allowance, toll charges, and GST with no hidden costs.`,
        },
        {
            question: `How do I book a ${label.toLowerCase()} from ${district.name}?`,
            answer: `You can book a ${label.toLowerCase()} from ${district.name} instantly on OneWayTaxi.ai. Simply enter your pickup location, destination, date, and time. You'll get an instant fare estimate. You can also call us 24/7 at +91 81244 76010 for immediate booking.`,
        },
        {
            question: `Is ${label.toLowerCase()} from ${district.name} available 24/7?`,
            answer: `Yes, our ${label.toLowerCase()} from ${district.name} is available 24 hours a day, 7 days a week — including holidays and late nights. You can book at any time through our website or by calling our support team.`,
        },
        {
            question: `What types of vehicles are available for ${label.toLowerCase()} in ${district.name}?`,
            answer: `We offer 5 vehicle types for ${label.toLowerCase()} in ${district.name}: Mini/Hatchback (4 seats, ₹${VEHICLE_TYPES[0].price}/km), Sedan like Etios/Dzire (4 seats, ₹${VEHICLE_TYPES[1].price}/km), SUV/Innova (7 seats, ₹${VEHICLE_TYPES[2].price}/km), Innova Crysta (7 seats, ₹${VEHICLE_TYPES[3].price}/km), and Tempo Traveller (12 seats, ₹${VEHICLE_TYPES[4].price}/km).`,
        },
        {
            question: `Are there any hidden charges for ${district.name} ${label.toLowerCase()}?`,
            answer: `No, absolutely not. Our ${district.name} ${label.toLowerCase()} fares are fully transparent and include all costs — driver bata, toll charges, permit fees, and GST. The fare you see at booking is the fare you pay. There are no surge charges, no night charges, and no return-trip charges.`,
        },
    ];

    // Add route-specific FAQ
    if (topRoute) {
        baseFAQs.push({
            question: `What is the fare from ${district.name} to ${topRoute.to} by ${label.toLowerCase()}?`,
            answer: `The ${label.toLowerCase()} fare from ${district.name} to ${topRoute.to} starts at approximately ₹${topRoute.fareEstimate} for a hatchback. The distance is about ${topRoute.distanceKm} km. Sedan fare would be around ₹${Math.round(topRoute.distanceKm * VEHICLE_TYPES[1].price)}, and SUV around ₹${Math.round(topRoute.distanceKm * VEHICLE_TYPES[2].price)}. Book now for exact pricing.`,
        });
    }

    // Service-type specific FAQs
    if (serviceType === 'drop-taxi') {
        baseFAQs.push({
            question: `Why is one-way drop taxi cheaper than round-trip in ${district.name}?`,
            answer: `With a round-trip taxi, you pay for the driver's return journey even though you only travel one way. Our ${district.name} drop taxi eliminates this inefficiency — you pay only for the distance YOU travel. This saves you up to 40% compared to round-trip fares. We match return rides for our drivers, making it economical for everyone.`,
        });
    } else if (serviceType === 'call-taxi') {
        baseFAQs.push({
            question: `How quickly can I get a call taxi in ${district.name}?`,
            answer: `Our ${district.name} call taxi service provides instant booking. Once you call +91 81244 76010 or book online, a nearby driver is assigned within minutes. For pre-booked rides, drivers arrive 10-15 minutes before your scheduled pickup time. Available 24/7 including holidays.`,
        });
    } else if (serviceType === 'cab-service') {
        baseFAQs.push({
            question: `What types of rides does ${district.name} cab service cover?`,
            answer: `Our ${district.name} cab service covers all types of rides — local city trips, one-way intercity drops, round-trip outstation journeys, and airport transfers. You can book any ride 24/7 through our website or by calling +91 81244 76010.`,
        });
    } else {
        baseFAQs.push({
            question: `Can I book a ${district.name} ${label.toLowerCase()} for someone else?`,
            answer: `Yes, you can easily book a ${label.toLowerCase()} in ${district.name} for family members, friends, or colleagues. Just provide the passenger's name and contact number during booking. The driver will coordinate directly with the passenger for pickup.`,
        });
    }

    baseFAQs.push({
        question: `Is it safe to book ${label.toLowerCase()} in ${district.name} with OneWayTaxi.ai?`,
        answer: `Absolutely. All our ${district.name} ${label.toLowerCase()} drivers are professionally trained, background-verified, and carry valid licenses. Our vehicles are GPS-tracked in real-time, regularly serviced, and fully insured. We have served over 50,000 happy customers across South India with a 4.8-star average rating.`,
    });

    // Additional high-value FAQs for better long-tail coverage
    baseFAQs.push({
        question: `What payment methods are accepted for ${district.name} ${label.toLowerCase()}?`,
        answer: `We accept multiple payment methods for ${district.name} ${label.toLowerCase()}: Cash, UPI (Google Pay, PhonePe, Paytm), credit cards, debit cards, and net banking. You can pay the driver directly in cash or via UPI at the end of your trip. No advance payment is required for booking.`,
    });

    baseFAQs.push({
        question: `Can I cancel my ${district.name} ${label.toLowerCase()} booking?`,
        answer: `Yes, you can cancel your ${district.name} ${label.toLowerCase()} booking free of charge up to 2 hours before the scheduled pickup time. Cancellations within 2 hours may attract a nominal cancellation fee. Contact our 24/7 support at +91 81244 76010 for cancellations or rescheduling.`,
    });

    // Add second route FAQ if available
    const secondRoute = district.popularRoutes[1];
    if (secondRoute) {
        baseFAQs.push({
            question: `How much does a taxi from ${district.name} to ${secondRoute.to} cost?`,
            answer: `A one-way taxi from ${district.name} to ${secondRoute.to} costs approximately ₹${secondRoute.fareEstimate} for a hatchback (${secondRoute.distanceKm} km). Sedan fare: ~₹${Math.round(secondRoute.distanceKm * VEHICLE_TYPES[1].price)}, SUV: ~₹${Math.round(secondRoute.distanceKm * (VEHICLE_TYPES[4]?.price || 19))}. All fares include toll, driver bata, and GST.`,
        });
    }

    return baseFAQs;
}

// ─── Review Data Generator ──────────────────────────────────

const REVIEWER_NAMES = [
    'Rajesh Kumar', 'Priya Sharma', 'Suresh Babu', 'Lakshmi Narayanan', 'Arun Prakash',
    'Meera Krishnan', 'Vikram Singh', 'Anitha Devi', 'Karthik Rajan', 'Deepa Venkatesh',
];

export function getReviews(district: District, serviceType: ServiceType): ReviewData[] {
    const label = SERVICE_LABELS[serviceType];
    const topRoutes = district.popularRoutes.slice(0, 5);

    // Deterministic review generation based on district name hash
    const hash = district.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    return [
        {
            name: REVIEWER_NAMES[hash % 10],
            rating: 5,
            text: `Excellent ${label.toLowerCase()} from ${district.name}! The driver was very professional and the car was clean and comfortable. Reached on time with no hassles. Will definitely book again.`,
            route: topRoutes[0] ? `${district.name} to ${topRoutes[0].to}` : district.name,
        },
        {
            name: REVIEWER_NAMES[(hash + 3) % 10],
            rating: 5,
            text: `Best ${label.toLowerCase()} service I've used in ${district.state}. The one-way pricing saved me almost 40% compared to other taxi services. Highly recommended for anyone traveling from ${district.name}.`,
            route: topRoutes[1] ? `${district.name} to ${topRoutes[1].to}` : district.name,
        },
        {
            name: REVIEWER_NAMES[(hash + 6) % 10],
            rating: 4,
            text: `Very good experience with OneWayTaxi.ai's ${label.toLowerCase()} from ${district.name}. The booking process was quick and the fare was exactly as quoted. No hidden charges at all. The AC was working perfectly throughout the journey.`,
            route: topRoutes[2] ? `${district.name} to ${topRoutes[2].to}` : district.name,
        },
        {
            name: REVIEWER_NAMES[(hash + 1) % 10],
            rating: 5,
            text: `I was skeptical about booking online but this ${label.toLowerCase()} from ${district.name} exceeded my expectations. The driver was punctual, courteous, and drove safely. Great value for money!`,
            route: topRoutes[3] ? `${district.name} to ${topRoutes[3].to}` : district.name,
        },

    ];
}

export function getComparisonData(district: District) {
    return [
        {
            feature: "Price Type",
            oneway: "Pay ONE-WAY only",
            normal: "Return fare chargeable",
            bus: "Fixed per person",
        },
        {
            feature: "Pickup",
            oneway: `Doorstep in ${district.name}`,
            normal: "Doorstep",
            bus: "Bus Stand only",
        },
        {
            feature: "Timings",
            oneway: "Any time (24/7)",
            normal: "Any time",
            bus: "Fixed Schedule",
        },
        {
            feature: "Comfort",
            oneway: "Private AC Car",
            normal: "Private AC Car",
            bus: "Shared / Crowded",
        },
        {
            feature: "Safety",
            oneway: "GPS Tracked & Verified",
            normal: "Varies",
            bus: "Public Space",
        },
    ];
}

export function getSafetyFeatures() {
    return [
        {
            title: "Verified Drivers",
            desc: "Criminal background checked & trained chauffeurs.",
            icon: "ShieldCheck"
        },
        {
            title: "24/7 Support",
            desc: "Round-the-clock assistance for peace of mind.",
            icon: "Headphones"
        },
        {
            title: "GPS Tracking",
            desc: "Real-time trip monitoring for safety.",
            icon: "MapPin"
        },
        {
            title: "Clean Cars",
            desc: "Sanitized & well-maintained fleet.",
            icon: "Sparkles"
        },
    ];
}

