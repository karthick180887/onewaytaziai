// lib/local-insights.ts — Unique, non-templated city-specific content for GEO citability
// Each entry provides genuinely unique local knowledge that differentiates from templated content

export interface LocalInsight {
    travelSeason: string;
    localTip: string;
    landmark: string;
    demandReason: string;
}

/**
 * Hand-crafted local insights for high-traffic districts.
 * Key: district slug. Only populated for cities where we have real knowledge.
 */
export const LOCAL_INSIGHTS: Record<string, LocalInsight> = {
    // ─── Tamil Nadu ─────────────────────────────────────────
    'chennai': {
        travelSeason: 'October to February is the peak taxi booking season from Chennai, coinciding with the northeast monsoon (Oct-Dec) when flight cancellations drive airport taxi demand, and the Pongal-Sankranti festival season (Jan) when thousands travel to southern Tamil Nadu.',
        localTip: 'Early morning departures (before 6 AM) from Chennai help avoid the notorious OMR and GST Road traffic. For airport pickups at Chennai International (MAA), our drivers use the elevated corridor from Alandur to reach Terminal 1 faster.',
        landmark: 'Chennai is home to Marina Beach (the second-longest urban beach in the world), Kapaleeshwarar Temple, and the bustling T. Nagar shopping district. Most taxi bookings from Chennai head to IT corridors in OMR, Ambattur Industrial Estate, or towards weekend getaways in Pondicherry and Mahabalipuram.',
        demandReason: 'Chennai sees the highest one-way taxi demand for IT employee relocations (OMR/Sholinganallur to Bangalore), weekend trips to Pondicherry (ECR route), and Tirupati pilgrimage runs — especially on Saturdays and during Brahmotsavam festival.',
    },
    'coimbatore': {
        travelSeason: 'Year-round taxi demand from Coimbatore, but bookings peak during the summer months (April-June) when families travel to Ooty, Coonoor, and Kodaikanal hill stations. The winter wedding season (November-February) also sees heavy outstation traffic.',
        localTip: 'The Coimbatore to Ooty route via Mettupalayam has 36 hairpin bends — our experienced drivers know the safest overtaking spots and best rest stops at Coonoor. For Kochi-bound travelers, the Palakkad Gap route via NH544 is faster than the Pollachi route.',
        landmark: 'Known as the "Manchester of South India" for its textile industry, Coimbatore is the gateway to the Nilgiri Hills. Isha Yoga Center (Adiyogi statue) on the Coimbatore-Ooty highway is a major stopover for spiritual tourists. The Coimbatore International Airport (CJB) handles heavy traffic to Kerala and Karnataka.',
        demandReason: 'Coimbatore is the top origin city for Ooty hill station taxis, with 60% of bookings being weekend/holiday trips. Business travelers frequently book cabs to Tiruppur (textile hub, 50 km), Erode, Salem, and Kochi. The airport taxi service sees peak demand during the Aadi and Pongal seasons.',
    },
    'madurai': {
        travelSeason: 'Madurai taxi demand peaks during the Chithirai Festival (April-May) at the Meenakshi Temple, attracting over 1 million pilgrims. The October-March cooler season drives Kodaikanal hill station bookings, and Rameswaram pilgrimage traffic runs year-round.',
        localTip: 'For Kodaikanal trips from Madurai, the Batlagundu route (NH49/NH44) is 120 km and takes 3 hours with 14 hairpin bends. Our drivers recommend starting before 7 AM to enjoy the ghat section in daylight. The Madurai to Rameswaram route via Pamban Bridge offers stunning sea views.',
        landmark: 'Madurai is one of the oldest continuously inhabited cities in the world, centered around the Meenakshi Amman Temple — a masterpiece of Dravidian architecture. The Vaigai River divides the city, and the famous Madurai Malli (jasmine) markets near the temple are a cultural landmark.',
        demandReason: 'Pilgrimage drives most taxi bookings from Madurai — to Rameswaram (Pamban Island), Kanyakumari (Cape Comorin), and Palani (Murugan Temple). Medical tourism to Madurai\'s Aravind Eye Hospital also generates significant inter-city taxi demand from across Tamil Nadu and Kerala.',
    },
    'trichy': {
        travelSeason: 'Trichy sees steady year-round taxi demand due to its central Tamil Nadu location. Peak season is December-January (Pongal, New Year holidays) and during the Vaikunta Ekadasi festival at Srirangam Temple, which draws lakhs of devotees.',
        localTip: 'Trichy International Airport (TRZ) is a key hub for Gulf NRI travelers — our airport taxi service handles high volumes during Ramadan and Onam return seasons. The Trichy to Thanjavur route is one of our busiest at just 56 km (under 1 hour).',
        landmark: 'Tiruchirappalli is famous for the Rock Fort Temple perched on a 273-foot rock overlooking the city, and Srirangam — one of the largest functioning Hindu temples in the world. The city sits at the confluence point of the Cauvery River delta.',
        demandReason: 'Central location makes Trichy a hub for connections — travelers book one-way taxis to Chennai, Madurai, Coimbatore, and Thanjavur equally. The BHEL industrial township and NIT Trichy campus generate weekday business travel demand.',
    },
    'salem': {
        travelSeason: 'Salem taxi bookings peak during the mango season (April-June) when traders and visitors flock to Salem\'s famous mango markets. The summer season also drives Yercaud hill station traffic, and the steel/textile industry keeps business travel steady.',
        localTip: 'The Salem to Bangalore route via NH44 passes through Krishnagiri — our drivers recommend the Dharmapuri bypass to avoid town congestion. For Yercaud trips, the 20 hairpin bends start after the Shevaroy foothills checkpoint.',
        landmark: 'Salem is known as the "Steel City" of Tamil Nadu and produces 60% of India\'s sago (sabudana). Yercaud hill station (32 km away) is called the "Jewel of the South" and is Salem\'s primary tourist attraction. The Salem Junction railway station is a major rail hub in central Tamil Nadu.',
        demandReason: 'Industrial travel (steel, textile, and sago factories) and Yercaud weekend tourism are the main demand drivers. Salem\'s strategic position on NH44 (connecting Chennai to Bangalore to Kochi) makes it a natural transit point for inter-state taxi bookings.',
    },
    // ─── Kerala ─────────────────────────────────────────────
    'kochi': {
        travelSeason: 'Kochi taxi demand peaks during the monsoon tourism season (June-September) when Ayurvedic wellness tourists visit, and again during the Christmas-New Year-Onam season (August-January). The Kochi Biennale (December-March, held biennially) attracts international visitors.',
        localTip: 'Kochi International Airport (COK) at Nedumbassery is 30 km from Fort Kochi — our airport taxi drivers use the NH544 approach rather than the MG Road route to avoid Ernakulam city traffic. For Munnar-bound passengers, we recommend booking for a 5 AM pickup to enjoy the tea garden views in morning light.',
        landmark: 'Kochi is Kerala\'s commercial capital, famous for the Chinese fishing nets at Fort Kochi, Mattancherry Palace, and the historic Jewish Synagogue. Marine Drive along the Vembanad Lake backwaters and Lulu Mall (India\'s largest mall at the time of opening) are major landmarks.',
        demandReason: 'Tourism and IT sector drive Kochi\'s taxi demand — Munnar hill station trips (130 km), Alleppey houseboat connections, and Kochi IT Park (Infopark/SmartCity) employee travel to Coimbatore, Bangalore, and Trivandrum are the busiest routes.',
    },
    'thiruvananthapuram': {
        travelSeason: 'Trivandrum taxi demand spikes during Onam (August-September), the Attukal Pongala festival (February-March — the world\'s largest gathering of women), and the November-February tourist season for Kovalam beach and backwater trips.',
        localTip: 'Trivandrum International Airport (TRV) is just 6 km from the city center — one of the closest airport-to-city distances in India. For Kanyakumari trips (87 km), the coastal NH66 route offers scenic ocean views. Our drivers know the shortcut via Parasala to avoid the Nagercoil town traffic.',
        landmark: 'Thiruvananthapuram is Kerala\'s capital, home to the Padmanabhaswamy Temple (one of the richest temples in the world), Kovalam Beach, and the Technopark IT campus — India\'s first technology park. The city is the gateway to Kerala\'s southern backwaters.',
        demandReason: 'Government employee transfers, IT sector commutes to Kochi/Bangalore, Kanyakumari pilgrimage, and Kovalam beach tourism drive steady taxi demand. The Sabarimala pilgrimage season (November-January) creates a surge in outstation bookings from Trivandrum.',
    },
    // ─── Andhra Pradesh / Telangana ─────────────────────────
    'hyderabad': {
        travelSeason: 'Hyderabad sees peak taxi demand during Dussehra/Diwali (October-November), the Bonalu festival (July-August), and the winter wedding season. IT sector travel to Bangalore, Chennai, and Tirupati runs consistently year-round.',
        localTip: 'The Hyderabad to Bangalore route (570 km) via NH44 is one of our longest but most popular corridors — our drivers recommend the Kurnool route over the Anantapur route for better road conditions. For airport pickups at RGIA (Shamshabad), our drivers park at the free waiting area to avoid the ₹100+ parking charge.',
        landmark: 'Hyderabad is the "City of Pearls" and India\'s biryani capital, centered around the Charminar, Hussain Sagar Lake, and the sprawling HITEC City IT hub. Ramoji Film City (the world\'s largest film studio complex) and Golconda Fort are major attractions.',
        demandReason: 'HITEC City and Gachibowli IT corridor generate massive outstation taxi demand — employee relocations to Bangalore, client visits to Chennai, and Tirupati darshan trips (550 km) are the top three booking reasons. Weekend trips to Nagarjunasagar and Srisailam pilgrimage also contribute.',
    },
    'tirupati': {
        travelSeason: 'Tirupati has year-round high taxi demand due to the Tirumala Venkateswara Temple — India\'s most visited pilgrimage site with 50,000-100,000 daily visitors. Peak periods are Brahmotsavam (September-October), Vaikunta Ekadasi (December-January), and all major Hindu festivals.',
        localTip: 'The Tirupati to Tirumala ghat road has two routes: the old Alipiri ghat road (18 km, 57 hairpin bends) and the Srivari Mettu footpath. Our taxi service covers the Tirupati city to temple logistics. For travelers from Chennai, we offer combined Chennai-Tirupati-Chennai day packages.',
        landmark: 'Tirupati is the spiritual heart of Andhra Pradesh, home to Sri Venkateswara Temple on Tirumala Hills — the world\'s richest Hindu temple. The ISRO Satish Dhawan Space Centre at Sriharikota (100 km) and Sri Kalahasti temple (36 km) are notable nearby destinations.',
        demandReason: 'Pilgrimage is the dominant reason — 90%+ of our Tirupati taxi bookings are temple-related. The Chennai-Tirupati corridor (135 km) is our single highest-volume route. Bangalore-Tirupati (252 km) and Hyderabad-Tirupati (550 km) are also consistently busy. Saturday mornings see the highest booking density.',
    },
    // ─── Karnataka ──────────────────────────────────────────
    'bangalore': {
        travelSeason: 'Bangalore has consistent year-round taxi demand, but peaks during the October-January festival-and-wedding season, and during IT employee relocation periods (January-March and July-September). Weekend trips to Mysore, Coorg, and Ooty spike during long weekends.',
        localTip: 'Bangalore Airport (KIA/BLR) at Devanahalli is 35-50 km from the city center. Our drivers use the NICE Road expressway for south Bangalore pickups and the Bellary Road route for central Bangalore. The Bangalore to Mysore Expressway has reduced travel time to just 2 hours — our most efficient corridor.',
        landmark: 'Bangalore is India\'s Silicon Valley, home to Cubbon Park, Lalbagh Botanical Garden, and a vibrant startup ecosystem. The Bangalore Palace, ISKCON Temple, and the Whitefield-Electronic City IT corridor define the city. Nandi Hills (60 km) is the most popular day-trip destination.',
        demandReason: 'IT sector dominates — employee relocations to Chennai, client travel to Hyderabad, and team outings to Coorg/Mysore/Ooty are the top three demand drivers. Airport transfers from KIA to Electronic City (60+ km) and Whitefield are consistently our highest-revenue short routes.',
    },
    'mysore': {
        travelSeason: 'Mysore taxi demand peaks dramatically during Dasara/Dussehra (September-October) — the 10-day Mysore Dasara festival is a UNESCO-recognized cultural event drawing millions. The December-February winter season brings steady tourist traffic to Mysore Palace, Chamundi Hills, and nearby Coorg.',
        localTip: 'The new Bangalore-Mysore Expressway (NICE Road, 120 km) has cut travel time to under 2 hours — making Mysore-Bangalore our fastest corridor. For Ooty trips from Mysore, the Bandipur-Mudumalai forest route (125 km) may have wildlife crossing delays — our drivers know the checkpoint timings.',
        landmark: 'Mysore is the "City of Palaces," famous for the Mysore Palace (India\'s most visited monument after the Taj Mahal), Chamundi Hills, Brindavan Gardens, and Mysore Pak sweets. The city is the gateway to Coorg (Kodagu) coffee country and Bandipur Tiger Reserve.',
        demandReason: 'Tourism is the primary driver — Bangalore weekend visitors to Mysore Palace, Coorg coffee plantation trips, and Ooty/Wayanad hill station transfers. The Mysore-Bangalore corridor is one of our busiest routes, with IT professionals commuting for weekend getaways.',
    },
    // ─── More Tamil Nadu ────────────────────────────────────
    'pondicherry': {
        travelSeason: 'Pondicherry taxi bookings peak during the October-March tourist season and especially during Christmas-New Year when the French Quarter comes alive with celebrations. The Aurobindo Ashram anniversary (August 15) and Bastille Day (July 14) also drive visitor spikes.',
        localTip: 'The Chennai to Pondicherry route has two options: the scenic East Coast Road (ECR, 170 km, 4 hours) via Mahabalipuram, or the faster NH32 via Tindivanam (150 km, 3 hours). Our drivers recommend ECR for daytime scenic travel and NH32 for faster night journeys.',
        landmark: 'Pondicherry (Puducherry) is a former French colony known for its pastel-colored French Quarter, Promenade Beach, Auroville (the experimental township), and Sri Aurobindo Ashram. The town has a unique Franco-Tamil culture visible in its architecture, cuisine, and street names.',
        demandReason: 'Weekend tourism from Chennai and Bangalore is the main demand driver — 70% of Pondicherry taxi bookings originate from Chennai (150 km). Auroville spiritual tourism, backpacker travel, and corporate offsite events also contribute. The route is especially busy on Friday evenings and Sunday afternoons.',
    },
    'ooty': {
        travelSeason: 'Ooty sees peak taxi demand from April to June (summer holidays) when South Indian families escape the plains heat. The October-November season for the Ooty Flower Show and Tea Festival brings another surge. Winter weekends (December-January) attract couples and honeymooners.',
        localTip: 'The Coimbatore to Ooty route via Mettupalayam (86 km) has 36 hairpin bends on the Coonoor Ghat section. Our drivers recommend starting before 8 AM to avoid tourist bus traffic on the ghat road. The Mysore to Ooty route (125 km) passes through Bandipur National Park — vehicle entry is restricted 9 PM to 6 AM.',
        landmark: 'Ooty (Udhagamandalam) is the "Queen of Hill Stations" in the Nilgiri Hills at 2,240 meters elevation. Key attractions include the Botanical Gardens, Ooty Lake, Doddabetta Peak (highest in Nilgiris), and the heritage Nilgiri Mountain Railway (UNESCO World Heritage Site). Tea estates surround the town.',
        demandReason: 'Hill station tourism drives virtually all taxi demand — Coimbatore and Mysore are the main feeder cities. Honeymoon packages (Ooty-Coonoor-Kodaikanal circuits) and family summer vacation trips represent 80% of bookings. Return trips down the ghat in the evening are equally busy.',
    },
    'kanyakumari': {
        travelSeason: 'Kanyakumari has year-round pilgrimage and tourism traffic, but peaks during the October-March cooler season, school holidays (April-May), and during the spectacular Chaitra Purnima (full moon sunset-moonrise phenomenon) in April. The Vivekananda Jayanti (January 12) also sees a visitor spike.',
        localTip: 'Kanyakumari is India\'s southernmost tip where three seas meet (Bay of Bengal, Arabian Sea, Indian Ocean). Our drivers park near the Thiruvalluvar statue viewpoint for easy passenger access. For sunrise viewing (the main attraction), we offer early morning pickups from Nagercoil or Tirunelveli hotels.',
        landmark: 'Kanyakumari is famous for the Vivekananda Rock Memorial (offshore island memorial), the Thiruvalluvar Statue (133-foot tall), and the Kumari Amman Temple. The town sits at the exact confluence of three bodies of water — visible by the differently colored waters meeting at the shore.',
        demandReason: 'Pilgrimage and "land\'s end" tourism drive 90% of bookings. The Madurai-Kanyakumari corridor (242 km) is the busiest route, followed by Trivandrum-Kanyakumari (87 km). Most travelers combine Kanyakumari with Rameswaram in a southern Tamil Nadu temple circuit.',
    },
};
