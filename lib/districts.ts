// lib/districts.ts — Central district data for all 6 South Indian states

import { tamilNaduSubDistricts } from './tamil-nadu-sub-districts';

export type ServiceType = 'drop-taxi' | 'one-way-taxi' | 'taxi-service' | 'outstation-cabs' | 'cab-service' | 'call-taxi';

export const SERVICE_TYPES: { id: ServiceType; label: string; keyword: string }[] = [
  { id: 'taxi-service', label: 'Taxi Service', keyword: 'taxi service' },
  { id: 'drop-taxi', label: 'Drop Taxi', keyword: 'drop taxi' },
  { id: 'one-way-taxi', label: 'One Way Taxi', keyword: 'one way taxi' },
  { id: 'outstation-cabs', label: 'Outstation Cabs', keyword: 'outstation cabs' },
  { id: 'cab-service', label: 'Cab Service', keyword: 'cab service' },
  { id: 'call-taxi', label: 'Call Taxi', keyword: 'call taxi' },
];

export interface PopularRoute {
  to: string;
  toSlug: string;
  distanceKm: number;
  fareEstimate: number;
}

export interface District {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  tier: 1 | 2 | 3;
  lat: number;
  lng: number;
  popularRoutes: PopularRoute[];
}

// Helper to build route objects
function r(to: string, toSlug: string, km: number, fare: number): PopularRoute {
  return { to, toSlug, distanceKm: km, fareEstimate: fare };
}

// ─── Tamil Nadu (38 districts) ───────────────────────────────
const TN_STATE = 'Tamil Nadu';
const TN_SLUG = 'tamil-nadu';

const tamilNaduDistricts: District[] = [
  { name: 'Chennai', slug: 'chennai', state: TN_STATE, stateSlug: TN_SLUG, tier: 1, lat: 13.0827, lng: 80.2707,
    popularRoutes: [r('Bangalore','bangalore',346,4850), r('Madurai','madurai',462,6470), r('Coimbatore','coimbatore',505,7070), r('Pondicherry','pondicherry',150,2100), r('Trichy','trichy',332,4650), r('Salem','salem',340,4760), r('Tirupati','tirupati',135,1890), r('Vellore','vellore',136,1904), r('Kochi','kochi',688,9630), r('Thanjavur','thanjavur',342,4790), r('Kodaikanal','kodaikanal',530,7420), r('Tiruvannamalai','tiruvannamalai',185,2590), r('Rameswaram','rameswaram',578,8092), r('Kanchipuram','kanchipuram',72,1008), r('Mahabalipuram','mahabalipuram',58,812), r('Velankanni','velankanni',360,5040), r('Tirunelveli','tirunelveli',620,8680), r('Cuddalore','cuddalore',185,2590), r('Neyveli','neyveli',220,3080), r('Kumbakonam','kumbakonam',295,4130), r('Karaikudi','karaikudi',420,5880), r('Ranipet','ranipet',117,1638)] },
  { name: 'Coimbatore', slug: 'coimbatore', state: TN_STATE, stateSlug: TN_SLUG, tier: 1, lat: 11.0168, lng: 76.9558,
    popularRoutes: [r('Chennai','chennai',505,7070), r('Bangalore','bangalore',365,5110), r('Madurai','madurai',218,3050), r('Ooty','ooty',86,1200), r('Kochi','kochi',196,2744), r('Salem','salem',160,2240), r('Trichy','trichy',213,2982), r('Palakkad','palakkad',55,770), r('Tiruppur','tiruppur',50,700), r('Coonoor','coonoor',68,952), r('Kodaikanal','kodaikanal',175,2450), r('Munnar','munnar',170,2380)] },
  { name: 'Madurai', slug: 'madurai', state: TN_STATE, stateSlug: TN_SLUG, tier: 1, lat: 9.9252, lng: 78.1198,
    popularRoutes: [r('Chennai','chennai',462,6470), r('Bangalore','bangalore',438,6130), r('Coimbatore','coimbatore',218,3050), r('Trichy','trichy',128,1792), r('Rameswaram','rameswaram',174,2436), r('Kodaikanal','kodaikanal',120,1680), r('Thanjavur','thanjavur',194,2716), r('Kanyakumari','kanyakumari',242,3388), r('Pondicherry','pondicherry',375,5250), r('Salem','salem',272,3808), r('Tiruvannamalai','tiruvannamalai',290,4060), r('Vellore','vellore',425,5950)] },
  { name: 'Tiruchirappalli', slug: 'trichy', state: TN_STATE, stateSlug: TN_SLUG, tier: 1, lat: 10.7905, lng: 78.7047,
    popularRoutes: [r('Chennai','chennai',332,4650), r('Madurai','madurai',128,1792), r('Coimbatore','coimbatore',213,2982), r('Thanjavur','thanjavur',56,784), r('Salem','salem',139,1946), r('Bangalore','bangalore',345,4830), r('Pondicherry','pondicherry',207,2898), r('Velankanni','velankanni',165,2310)] },
  { name: 'Salem', slug: 'salem', state: TN_STATE, stateSlug: TN_SLUG, tier: 1, lat: 11.6643, lng: 78.1460,
    popularRoutes: [r('Chennai','chennai',340,4760), r('Bangalore','bangalore',210,2940), r('Coimbatore','coimbatore',160,2240), r('Trichy','trichy',139,1946), r('Madurai','madurai',272,3808), r('Yercaud','yercaud',32,448), r('Vellore','vellore',207,2898), r('Pondicherry','pondicherry',285,3990)] },
  { name: 'Tirunelveli', slug: 'tirunelveli', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 8.7139, lng: 77.7567,
    popularRoutes: [r('Madurai','madurai',155,2170), r('Kanyakumari','kanyakumari',87,1218), r('Chennai','chennai',620,8680), r('Coimbatore','coimbatore',380,5320), r('Tuticorin','tuticorin',48,672)] },
  { name: 'Erode', slug: 'erode', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 11.3410, lng: 77.7172,
    popularRoutes: [r('Coimbatore','coimbatore',100,1400), r('Salem','salem',65,910), r('Chennai','chennai',390,5460), r('Bangalore','bangalore',276,3864), r('Trichy','trichy',175,2450)] },
  { name: 'Vellore', slug: 'vellore', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.9165, lng: 79.1325,
    popularRoutes: [r('Chennai','chennai',136,1904), r('Bangalore','bangalore',212,2968), r('Tirupati','tirupati',96,1344), r('Pondicherry','pondicherry',152,2128), r('Tiruvannamalai','tiruvannamalai',85,1190), r('Salem','salem',207,2898)] },
  { name: 'Thanjavur', slug: 'thanjavur', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.7870, lng: 79.1378,
    popularRoutes: [r('Trichy','trichy',56,784), r('Chennai','chennai',342,4790), r('Madurai','madurai',194,2716), r('Kumbakonam','kumbakonam',40,560)] },
  { name: 'Thoothukudi', slug: 'tuticorin', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 8.7642, lng: 78.1348,
    popularRoutes: [r('Madurai','madurai',138,1932), r('Tirunelveli','tirunelveli',48,672), r('Chennai','chennai',600,8400), r('Kanyakumari','kanyakumari',132,1848)] },
  { name: 'Dindigul', slug: 'dindigul', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.3673, lng: 77.9803,
    popularRoutes: [r('Madurai','madurai',63,882), r('Coimbatore','coimbatore',155,2170), r('Trichy','trichy',100,1400), r('Kodaikanal','kodaikanal',80,1120)] },
  { name: 'Kanyakumari', slug: 'kanyakumari', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 8.0883, lng: 77.5385,
    popularRoutes: [r('Trivandrum','thiruvananthapuram',87,1218), r('Madurai','madurai',242,3388), r('Chennai','chennai',710,9940), r('Tirunelveli','tirunelveli',87,1218)] },
  { name: 'Tiruppur', slug: 'tiruppur', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 11.1085, lng: 77.3411,
    popularRoutes: [r('Coimbatore','coimbatore',50,700), r('Chennai','chennai',460,6440), r('Bangalore','bangalore',330,4620), r('Erode','erode',50,700)] },
  { name: 'Cuddalore', slug: 'cuddalore', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.7480, lng: 79.7714,
    popularRoutes: [r('Chennai','chennai',185,2590), r('Pondicherry','pondicherry',25,350), r('Trichy','trichy',175,2450)] },
  { name: 'Nagapattinam', slug: 'nagapattinam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.7672, lng: 79.8449,
    popularRoutes: [r('Thanjavur','thanjavur',84,1176), r('Trichy','trichy',140,1960), r('Chennai','chennai',340,4760)] },
  { name: 'Kanchipuram', slug: 'kanchipuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.8342, lng: 79.7036,
    popularRoutes: [r('Chennai','chennai',72,1008), r('Vellore','vellore',70,980), r('Pondicherry','pondicherry',98,1372)] },
  { name: 'Sivaganga', slug: 'sivaganga', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.4344, lng: 78.4795,
    popularRoutes: [r('Madurai','madurai',48,672), r('Trichy','trichy',110,1540), r('Rameswaram','rameswaram',135,1890)] },
  { name: 'Virudhunagar', slug: 'virudhunagar', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.5810, lng: 77.9624,
    popularRoutes: [r('Madurai','madurai',62,868), r('Tirunelveli','tirunelveli',100,1400), r('Coimbatore','coimbatore',280,3920)] },
  { name: 'Ramanathapuram', slug: 'ramanathapuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.3639, lng: 78.8395,
    popularRoutes: [r('Madurai','madurai',119,1666), r('Trichy','trichy',245,3430), r('Chennai','chennai',562,7868), r('Rameswaram','rameswaram',56,784), r('Tirunelveli','tirunelveli',128,1792)] },
  { name: 'Namakkal', slug: 'namakkal', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.2189, lng: 78.1677,
    popularRoutes: [r('Salem','salem',35,490), r('Trichy','trichy',88,1232), r('Coimbatore','coimbatore',125,1750)] },
  { name: 'Krishnagiri', slug: 'krishnagiri', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.5186, lng: 78.2137,
    popularRoutes: [r('Bangalore','bangalore',92,1288), r('Salem','salem',95,1330), r('Chennai','chennai',255,3570)] },
  { name: 'Karur', slug: 'karur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.9601, lng: 78.0766,
    popularRoutes: [r('Trichy','trichy',75,1050), r('Coimbatore','coimbatore',140,1960), r('Madurai','madurai',145,2030)] },
  { name: 'Dharmapuri', slug: 'dharmapuri', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.1211, lng: 78.1582,
    popularRoutes: [r('Salem','salem',65,910), r('Bangalore','bangalore',180,2520), r('Chennai','chennai',305,4270)] },
  { name: 'Theni', slug: 'theni', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.0104, lng: 77.4768,
    popularRoutes: [r('Madurai','madurai',76,1064), r('Coimbatore','coimbatore',188,2632), r('Kodaikanal','kodaikanal',60,840)] },
  { name: 'Nilgiris', slug: 'ooty', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 11.4102, lng: 76.6950,
    popularRoutes: [r('Coimbatore','coimbatore',86,1200), r('Mysore','mysore',125,1750), r('Bangalore','bangalore',270,3780), r('Chennai','chennai',560,7840)] },
  { name: 'Pudukkottai', slug: 'pudukkottai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.3833, lng: 78.8001,
    popularRoutes: [r('Trichy','trichy',55,770), r('Thanjavur','thanjavur',58,812), r('Madurai','madurai',120,1680)] },
  { name: 'Ariyalur', slug: 'ariyalur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.1400, lng: 79.0800,
    popularRoutes: [r('Trichy','trichy',47,658), r('Thanjavur','thanjavur',105,1470), r('Chennai','chennai',300,4200)] },
  { name: 'Perambalur', slug: 'perambalur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.2320, lng: 78.8800,
    popularRoutes: [r('Trichy','trichy',55,770), r('Salem','salem',105,1470), r('Chennai','chennai',295,4130)] },
  { name: 'Villupuram', slug: 'villupuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.9401, lng: 79.4861,
    popularRoutes: [r('Pondicherry','pondicherry',38,532), r('Chennai','chennai',163,2282), r('Trichy','trichy',195,2730)] },
  { name: 'Tiruvannamalai', slug: 'tiruvannamalai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.2253, lng: 79.0747,
    popularRoutes: [r('Chennai','chennai',185,2590), r('Bangalore','bangalore',200,2800), r('Vellore','vellore',85,1190)] },
  { name: 'Tenkasi', slug: 'tenkasi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 8.9604, lng: 77.3152,
    popularRoutes: [r('Tirunelveli','tirunelveli',55,770), r('Madurai','madurai',180,2520), r('Kanyakumari','kanyakumari',120,1680)] },
  { name: 'Ranipet', slug: 'ranipet', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.9224, lng: 79.3330,
    popularRoutes: [r('Chennai','chennai',117,1638), r('Vellore','vellore',25,350), r('Bangalore','bangalore',190,2660)] },
  { name: 'Tirupattur', slug: 'tirupattur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.4965, lng: 78.5730,
    popularRoutes: [r('Vellore','vellore',58,812), r('Chennai','chennai',195,2730), r('Bangalore','bangalore',155,2170)] },
  { name: 'Chengalpattu', slug: 'chengalpattu', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.6819, lng: 79.9888,
    popularRoutes: [r('Chennai','chennai',56,784), r('Pondicherry','pondicherry',112,1568), r('Kanchipuram','kanchipuram',30,420)] },
  { name: 'Kallakurichi', slug: 'kallakurichi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.7386, lng: 78.9609,
    popularRoutes: [r('Salem','salem',100,1400), r('Villupuram','villupuram',55,770), r('Chennai','chennai',230,3220)] },
  { name: 'Mayiladuthurai', slug: 'mayiladuthurai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.1014, lng: 79.6625,
    popularRoutes: [r('Thanjavur','thanjavur',68,952), r('Trichy','trichy',108,1512), r('Chennai','chennai',290,4060)] },
  { name: 'Kumbakonam', slug: 'kumbakonam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.9617, lng: 79.3881,
    popularRoutes: [r('Thanjavur','thanjavur',40,560), r('Trichy','trichy',96,1344), r('Chennai','chennai',295,4130)] },
  { name: 'Kodaikanal', slug: 'kodaikanal', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.2381, lng: 77.4892,
    popularRoutes: [r('Madurai','madurai',120,1680), r('Coimbatore','coimbatore',175,2450), r('Chennai','chennai',530,7420), r('Bangalore','bangalore',465,6510)] },
];

// ─── Kerala (14 districts) ──────────────────────────────────
const KL_STATE = 'Kerala';
const KL_SLUG = 'kerala';

const keralaDistricts: District[] = [
  { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram', state: KL_STATE, stateSlug: KL_SLUG, tier: 1, lat: 8.5241, lng: 76.9366,
    popularRoutes: [r('Kochi','kochi',205,2870), r('Kanyakumari','kanyakumari',87,1218), r('Madurai','madurai',298,4172), r('Chennai','chennai',770,10780), r('Alleppey','alappuzha',155,2170), r('Munnar','munnar',285,3990)] },
  { name: 'Kochi', slug: 'kochi', state: KL_STATE, stateSlug: KL_SLUG, tier: 1, lat: 9.9312, lng: 76.2673,
    popularRoutes: [r('Trivandrum','thiruvananthapuram',205,2870), r('Coimbatore','coimbatore',196,2744), r('Munnar','munnar',130,1820), r('Alleppey','alappuzha',53,742), r('Bangalore','bangalore',555,7770), r('Chennai','chennai',688,9630), r('Sabarimala','sabarimala',180,2520), r('Thekkady','thekkady',190,2660)] },
  { name: 'Kozhikode', slug: 'kozhikode', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 11.2588, lng: 75.7804,
    popularRoutes: [r('Kochi','kochi',196,2744), r('Bangalore','bangalore',358,5012), r('Wayanad','wayanad',85,1190), r('Coimbatore','coimbatore',193,2702)] },
  { name: 'Thrissur', slug: 'thrissur', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 10.5276, lng: 76.2144,
    popularRoutes: [r('Kochi','kochi',84,1176), r('Coimbatore','coimbatore',135,1890), r('Trivandrum','thiruvananthapuram',290,4060)] },
  { name: 'Kollam', slug: 'kollam', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 8.8932, lng: 76.6141,
    popularRoutes: [r('Trivandrum','thiruvananthapuram',70,980), r('Kochi','kochi',140,1960), r('Alleppey','alappuzha',86,1204)] },
  { name: 'Alappuzha', slug: 'alappuzha', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 9.4981, lng: 76.3388,
    popularRoutes: [r('Kochi','kochi',53,742), r('Trivandrum','thiruvananthapuram',155,2170), r('Munnar','munnar',178,2492)] },
  { name: 'Palakkad', slug: 'palakkad', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 10.7867, lng: 76.6548,
    popularRoutes: [r('Coimbatore','coimbatore',55,770), r('Kochi','kochi',152,2128), r('Thrissur','thrissur',70,980)] },
  { name: 'Kannur', slug: 'kannur', state: KL_STATE, stateSlug: KL_SLUG, tier: 3, lat: 11.8745, lng: 75.3704,
    popularRoutes: [r('Kozhikode','kozhikode',92,1288), r('Bangalore','bangalore',360,5040), r('Wayanad','wayanad',100,1400)] },
  { name: 'Malappuram', slug: 'malappuram', state: KL_STATE, stateSlug: KL_SLUG, tier: 3, lat: 11.0510, lng: 76.0711,
    popularRoutes: [r('Kozhikode','kozhikode',50,700), r('Kochi','kochi',140,1960), r('Coimbatore','coimbatore',145,2030)] },
  { name: 'Kottayam', slug: 'kottayam', state: KL_STATE, stateSlug: KL_SLUG, tier: 3, lat: 9.5916, lng: 76.5222,
    popularRoutes: [r('Kochi','kochi',65,910), r('Trivandrum','thiruvananthapuram',150,2100), r('Munnar','munnar',100,1400)] },
  { name: 'Idukki', slug: 'idukki', state: KL_STATE, stateSlug: KL_SLUG, tier: 3, lat: 9.9189, lng: 76.9287,
    popularRoutes: [r('Kochi','kochi',110,1540), r('Munnar','munnar',45,630), r('Trivandrum','thiruvananthapuram',260,3640)] },
  { name: 'Wayanad', slug: 'wayanad', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 11.6854, lng: 76.1320,
    popularRoutes: [r('Kozhikode','kozhikode',85,1190), r('Mysore','mysore',105,1470), r('Bangalore','bangalore',280,3920), r('Ooty','ooty',120,1680)] },
  { name: 'Pathanamthitta', slug: 'pathanamthitta', state: KL_STATE, stateSlug: KL_SLUG, tier: 3, lat: 9.2648, lng: 76.7870,
    popularRoutes: [r('Trivandrum','thiruvananthapuram',110,1540), r('Kochi','kochi',100,1400), r('Sabarimala','sabarimala',75,1050)] },
  { name: 'Kasaragod', slug: 'kasaragod', state: KL_STATE, stateSlug: KL_SLUG, tier: 3, lat: 12.4996, lng: 74.9869,
    popularRoutes: [r('Mangalore','mangalore',50,700), r('Kannur','kannur',110,1540), r('Bangalore','bangalore',380,5320)] },
  // ─── Tourist & pilgrimage destinations (Kerala) ─────────────
  { name: 'Munnar', slug: 'munnar', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 10.0889, lng: 77.0595,
    popularRoutes: [r('Kochi','kochi',130,1820), r('Coimbatore','coimbatore',170,2380), r('Madurai','madurai',160,2240), r('Bangalore','bangalore',470,6580), r('Chennai','chennai',590,8260), r('Thekkady','thekkady',90,1260), r('Alleppey','alappuzha',175,2450), r('Thiruvananthapuram','thiruvananthapuram',285,3990), r('Idukki','idukki',45,630), r('Kottayam','kottayam',100,1400)] },
  { name: 'Thekkady', slug: 'thekkady', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 9.5916, lng: 77.1603,
    popularRoutes: [r('Madurai','madurai',140,1960), r('Kochi','kochi',190,2660), r('Munnar','munnar',90,1260), r('Bangalore','bangalore',505,7070), r('Thiruvananthapuram','thiruvananthapuram',235,3290), r('Alleppey','alappuzha',160,2240), r('Coimbatore','coimbatore',210,2940), r('Idukki','idukki',65,910)] },
  { name: 'Sabarimala', slug: 'sabarimala', state: KL_STATE, stateSlug: KL_SLUG, tier: 2, lat: 9.4363, lng: 77.0825,
    popularRoutes: [r('Kochi','kochi',180,2520), r('Thiruvananthapuram','thiruvananthapuram',175,2450), r('Madurai','madurai',235,3290), r('Coimbatore','coimbatore',310,4340), r('Chennai','chennai',700,9800), r('Bangalore','bangalore',640,8960), r('Pathanamthitta','pathanamthitta',75,1050), r('Alleppey','alappuzha',135,1890), r('Kottayam','kottayam',95,1330)] },
];

// ─── Andhra Pradesh (26 districts) ──────────────────────────
const AP_STATE = 'Andhra Pradesh';
const AP_SLUG = 'andhra-pradesh';

const andhraDistricts: District[] = [
  { name: 'Visakhapatnam', slug: 'visakhapatnam', state: AP_STATE, stateSlug: AP_SLUG, tier: 1, lat: 17.6868, lng: 83.2185,
    popularRoutes: [r('Hyderabad','hyderabad',625,8750), r('Vijayawada','vijayawada',350,4900), r('Rajahmundry','rajahmundry',187,2618), r('Araku Valley','araku',115,1610)] },
  { name: 'Vijayawada', slug: 'vijayawada', state: AP_STATE, stateSlug: AP_SLUG, tier: 1, lat: 16.5062, lng: 80.6480,
    popularRoutes: [r('Hyderabad','hyderabad',275,3850), r('Visakhapatnam','visakhapatnam',350,4900), r('Guntur','guntur',35,490), r('Tirupati','tirupati',380,5320)] },
  { name: 'Tirupati', slug: 'tirupati', state: AP_STATE, stateSlug: AP_SLUG, tier: 1, lat: 13.6288, lng: 79.4192,
    popularRoutes: [r('Chennai','chennai',135,1890), r('Bangalore','bangalore',252,3528), r('Vijayawada','vijayawada',380,5320), r('Hyderabad','hyderabad',580,8120), r('Tiruvannamalai','tiruvannamalai',220,3080)] },
  { name: 'Guntur', slug: 'guntur', state: AP_STATE, stateSlug: AP_SLUG, tier: 2, lat: 16.3067, lng: 80.4365,
    popularRoutes: [r('Vijayawada','vijayawada',35,490), r('Hyderabad','hyderabad',278,3892), r('Ongole','ongole',145,2030)] },
  { name: 'Nellore', slug: 'nellore', state: AP_STATE, stateSlug: AP_SLUG, tier: 2, lat: 14.4426, lng: 79.9865,
    popularRoutes: [r('Chennai','chennai',175,2450), r('Tirupati','tirupati',135,1890), r('Vijayawada','vijayawada',250,3500)] },
  { name: 'Kurnool', slug: 'kurnool', state: AP_STATE, stateSlug: AP_SLUG, tier: 2, lat: 15.8281, lng: 78.0373,
    popularRoutes: [r('Hyderabad','hyderabad',213,2982), r('Bangalore','bangalore',365,5110), r('Anantapur','anantapur',130,1820)] },
  { name: 'Rajahmundry', slug: 'rajahmundry', state: AP_STATE, stateSlug: AP_SLUG, tier: 2, lat: 17.0005, lng: 81.8040,
    popularRoutes: [r('Visakhapatnam','visakhapatnam',187,2618), r('Vijayawada','vijayawada',195,2730), r('Hyderabad','hyderabad',470,6580)] },
  { name: 'Kakinada', slug: 'kakinada', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 16.9891, lng: 82.2475,
    popularRoutes: [r('Rajahmundry','rajahmundry',65,910), r('Visakhapatnam','visakhapatnam',195,2730)] },
  { name: 'Anantapur', slug: 'anantapur', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 14.6819, lng: 77.6006,
    popularRoutes: [r('Bangalore','bangalore',200,2800), r('Hyderabad','hyderabad',335,4690), r('Kurnool','kurnool',130,1820)] },
  { name: 'Kadapa', slug: 'kadapa', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 14.4674, lng: 78.8241,
    popularRoutes: [r('Tirupati','tirupati',170,2380), r('Hyderabad','hyderabad',410,5740), r('Bangalore','bangalore',310,4340)] },
  { name: 'Chittoor', slug: 'chittoor', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 13.2172, lng: 79.1003,
    popularRoutes: [r('Tirupati','tirupati',70,980), r('Chennai','chennai',150,2100), r('Bangalore','bangalore',195,2730)] },
  { name: 'Prakasam', slug: 'prakasam', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 15.5030, lng: 80.0499,
    popularRoutes: [r('Vijayawada','vijayawada',185,2590), r('Hyderabad','hyderabad',325,4550)] },
  { name: 'Srikakulam', slug: 'srikakulam', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 18.3000, lng: 83.9000,
    popularRoutes: [r('Visakhapatnam','visakhapatnam',115,1610), r('Hyderabad','hyderabad',780,10920)] },
  { name: 'Vizianagaram', slug: 'vizianagaram', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 18.1067, lng: 83.3956,
    popularRoutes: [r('Visakhapatnam','visakhapatnam',55,770), r('Srikakulam','srikakulam',65,910)] },
  { name: 'West Godavari', slug: 'west-godavari', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 16.9174, lng: 81.3399,
    popularRoutes: [r('Vijayawada','vijayawada',80,1120), r('Rajahmundry','rajahmundry',50,700)] },
  { name: 'East Godavari', slug: 'east-godavari', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 17.3200, lng: 82.0100,
    popularRoutes: [r('Rajahmundry','rajahmundry',40,560), r('Visakhapatnam','visakhapatnam',170,2380)] },
  { name: 'Krishna', slug: 'krishna', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 16.6100, lng: 80.7200,
    popularRoutes: [r('Vijayawada','vijayawada',15,210), r('Hyderabad','hyderabad',280,3920)] },
  { name: 'Sri Potti Sriramulu Nellore', slug: 'spsr-nellore', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 14.4500, lng: 80.0000,
    popularRoutes: [r('Chennai','chennai',175,2450), r('Tirupati','tirupati',135,1890)] },
  { name: 'Palnadu', slug: 'palnadu', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 16.2500, lng: 79.8500,
    popularRoutes: [r('Guntur','guntur',85,1190), r('Hyderabad','hyderabad',260,3640)] },
  { name: 'Bapatla', slug: 'bapatla', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 15.9000, lng: 80.4700,
    popularRoutes: [r('Guntur','guntur',60,840), r('Vijayawada','vijayawada',95,1330)] },
  { name: 'Eluru', slug: 'eluru', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 16.7107, lng: 81.0952,
    popularRoutes: [r('Vijayawada','vijayawada',60,840), r('Rajahmundry','rajahmundry',100,1400)] },
  { name: 'Nandyal', slug: 'nandyal', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 15.4786, lng: 78.4836,
    popularRoutes: [r('Kurnool','kurnool',55,770), r('Hyderabad','hyderabad',270,3780)] },
  { name: 'Konaseema', slug: 'konaseema', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 16.7500, lng: 82.0500,
    popularRoutes: [r('Rajahmundry','rajahmundry',60,840), r('Kakinada','kakinada',45,630)] },
  { name: 'Anakapalli', slug: 'anakapalli', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 17.6910, lng: 83.0037,
    popularRoutes: [r('Visakhapatnam','visakhapatnam',30,420), r('Rajahmundry','rajahmundry',160,2240)] },
  { name: 'Alluri Sitharama Raju', slug: 'alluri-sitharama-raju', state: AP_STATE, stateSlug: AP_SLUG, tier: 3, lat: 17.7800, lng: 82.1500,
    popularRoutes: [r('Visakhapatnam','visakhapatnam',100,1400), r('Araku Valley','araku',45,630)] },
  { name: 'Tirupati Urban', slug: 'tirupati-urban', state: AP_STATE, stateSlug: AP_SLUG, tier: 2, lat: 13.6500, lng: 79.4200,
    popularRoutes: [r('Chennai','chennai',135,1890), r('Bangalore','bangalore',252,3528)] },
];

// ─── Telangana (33 districts) ───────────────────────────────
const TS_STATE = 'Telangana';
const TS_SLUG = 'telangana';

const telanganaDistricts: District[] = [
  { name: 'Hyderabad', slug: 'hyderabad', state: TS_STATE, stateSlug: TS_SLUG, tier: 1, lat: 17.3850, lng: 78.4867,
    popularRoutes: [r('Bangalore','bangalore',570,7980), r('Vijayawada','vijayawada',275,3850), r('Warangal','warangal',148,2072), r('Tirupati','tirupati',580,8120), r('Chennai','chennai',630,8820), r('Visakhapatnam','visakhapatnam',625,8750), r('Nagpur','nagpur',500,7000)] },
  { name: 'Warangal', slug: 'warangal', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 17.9784, lng: 79.5941,
    popularRoutes: [r('Hyderabad','hyderabad',148,2072), r('Vijayawada','vijayawada',225,3150), r('Karimnagar','karimnagar',80,1120)] },
  { name: 'Karimnagar', slug: 'karimnagar', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 18.4386, lng: 79.1288,
    popularRoutes: [r('Hyderabad','hyderabad',165,2310), r('Warangal','warangal',80,1120), r('Nizamabad','nizamabad',100,1400)] },
  { name: 'Nizamabad', slug: 'nizamabad', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 18.6725, lng: 78.0940,
    popularRoutes: [r('Hyderabad','hyderabad',175,2450), r('Karimnagar','karimnagar',100,1400), r('Nagpur','nagpur',350,4900)] },
  { name: 'Khammam', slug: 'khammam', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 17.2473, lng: 80.1514,
    popularRoutes: [r('Hyderabad','hyderabad',300,4200), r('Vijayawada','vijayawada',120,1680), r('Warangal','warangal',138,1932)] },
  { name: 'Mahbubnagar', slug: 'mahbubnagar', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 16.7488, lng: 77.9850,
    popularRoutes: [r('Hyderabad','hyderabad',100,1400), r('Kurnool','kurnool',150,2100)] },
  { name: 'Nalgonda', slug: 'nalgonda', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.0500, lng: 79.2700,
    popularRoutes: [r('Hyderabad','hyderabad',100,1400), r('Vijayawada','vijayawada',200,2800)] },
  { name: 'Adilabad', slug: 'adilabad', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 19.6640, lng: 78.5320,
    popularRoutes: [r('Hyderabad','hyderabad',310,4340), r('Nagpur','nagpur',220,3080)] },
  { name: 'Medak', slug: 'medak', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.0539, lng: 78.2631,
    popularRoutes: [r('Hyderabad','hyderabad',95,1330), r('Nizamabad','nizamabad',85,1190)] },
  { name: 'Rangareddy', slug: 'rangareddy', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 17.2000, lng: 78.2200,
    popularRoutes: [r('Hyderabad','hyderabad',25,350), r('Bangalore','bangalore',550,7700)] },
  { name: 'Medchal-Malkajgiri', slug: 'medchal-malkajgiri', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 17.5300, lng: 78.5400,
    popularRoutes: [r('Hyderabad','hyderabad',20,280), r('Warangal','warangal',150,2100)] },
  { name: 'Sangareddy', slug: 'sangareddy', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.6192, lng: 78.0862,
    popularRoutes: [r('Hyderabad','hyderabad',60,840), r('Medak','medak',40,560)] },
  { name: 'Siddipet', slug: 'siddipet', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.1015, lng: 78.8497,
    popularRoutes: [r('Hyderabad','hyderabad',100,1400), r('Karimnagar','karimnagar',70,980)] },
  { name: 'Mancherial', slug: 'mancherial', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.8705, lng: 79.4587,
    popularRoutes: [r('Hyderabad','hyderabad',280,3920), r('Karimnagar','karimnagar',115,1610)] },
  { name: 'Kamareddy', slug: 'kamareddy', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.3215, lng: 78.3344,
    popularRoutes: [r('Hyderabad','hyderabad',170,2380), r('Nizamabad','nizamabad',30,420)] },
  { name: 'Bhadradri Kothagudem', slug: 'bhadradri-kothagudem', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.5543, lng: 80.6177,
    popularRoutes: [r('Khammam','khammam',70,980), r('Hyderabad','hyderabad',330,4620)] },
  { name: 'Jayashankar Bhupalpally', slug: 'jayashankar-bhupalpally', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.1900, lng: 79.9900,
    popularRoutes: [r('Warangal','warangal',80,1120), r('Hyderabad','hyderabad',245,3430)] },
  { name: 'Jogulamba Gadwal', slug: 'jogulamba-gadwal', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 16.2345, lng: 77.8036,
    popularRoutes: [r('Hyderabad','hyderabad',220,3080), r('Kurnool','kurnool',95,1330)] },
  { name: 'Kumuram Bheem Asifabad', slug: 'kumuram-bheem-asifabad', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 19.3556, lng: 79.2900,
    popularRoutes: [r('Adilabad','adilabad',55,770), r('Hyderabad','hyderabad',350,4900)] },
  { name: 'Mahabubnagar', slug: 'mahabubnagar', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 16.7388, lng: 78.0013,
    popularRoutes: [r('Hyderabad','hyderabad',110,1540), r('Bangalore','bangalore',465,6510)] },
  { name: 'Mulugu', slug: 'mulugu', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.1900, lng: 79.9400,
    popularRoutes: [r('Warangal','warangal',70,980), r('Hyderabad','hyderabad',230,3220)] },
  { name: 'Nagarkurnool', slug: 'nagarkurnool', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 16.4800, lng: 78.3100,
    popularRoutes: [r('Hyderabad','hyderabad',155,2170), r('Mahbubnagar','mahbubnagar',65,910)] },
  { name: 'Narayanpet', slug: 'narayanpet', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 16.7400, lng: 77.5000,
    popularRoutes: [r('Hyderabad','hyderabad',180,2520), r('Kurnool','kurnool',115,1610)] },
  { name: 'Nirmal', slug: 'nirmal', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 19.0970, lng: 78.3445,
    popularRoutes: [r('Hyderabad','hyderabad',245,3430), r('Adilabad','adilabad',60,840)] },
  { name: 'Peddapalli', slug: 'peddapalli', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.6200, lng: 79.3800,
    popularRoutes: [r('Karimnagar','karimnagar',30,420), r('Hyderabad','hyderabad',195,2730)] },
  { name: 'Rajanna Sircilla', slug: 'rajanna-sircilla', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 18.3856, lng: 78.8396,
    popularRoutes: [r('Karimnagar','karimnagar',35,490), r('Hyderabad','hyderabad',160,2240)] },
  { name: 'Suryapet', slug: 'suryapet', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.1400, lng: 79.6300,
    popularRoutes: [r('Hyderabad','hyderabad',140,1960), r('Vijayawada','vijayawada',180,2520)] },
  { name: 'Vikarabad', slug: 'vikarabad', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.3381, lng: 77.9050,
    popularRoutes: [r('Hyderabad','hyderabad',75,1050), r('Bangalore','bangalore',500,7000)] },
  { name: 'Wanaparthy', slug: 'wanaparthy', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 16.3600, lng: 78.0600,
    popularRoutes: [r('Hyderabad','hyderabad',155,2170), r('Mahbubnagar','mahbubnagar',55,770)] },
  { name: 'Warangal Rural', slug: 'warangal-rural', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.9200, lng: 79.5800,
    popularRoutes: [r('Hyderabad','hyderabad',155,2170), r('Warangal','warangal',10,140)] },
  { name: 'Warangal Urban', slug: 'warangal-urban', state: TS_STATE, stateSlug: TS_SLUG, tier: 2, lat: 17.9784, lng: 79.5941,
    popularRoutes: [r('Hyderabad','hyderabad',148,2072), r('Vijayawada','vijayawada',225,3150)] },
  { name: 'Yadadri Bhuvanagiri', slug: 'yadadri-bhuvanagiri', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.5800, lng: 78.9600,
    popularRoutes: [r('Hyderabad','hyderabad',70,980), r('Warangal','warangal',90,1260)] },
  { name: 'Hanumakonda', slug: 'hanumakonda', state: TS_STATE, stateSlug: TS_SLUG, tier: 3, lat: 17.9971, lng: 79.5559,
    popularRoutes: [r('Hyderabad','hyderabad',148,2072), r('Karimnagar','karimnagar',82,1148)] },
];

// ─── Karnataka (31 districts) ───────────────────────────────
const KA_STATE = 'Karnataka';
const KA_SLUG = 'karnataka';

const karnatakaDistricts: District[] = [
  { name: 'Bangalore', slug: 'bangalore', state: KA_STATE, stateSlug: KA_SLUG, tier: 1, lat: 12.9716, lng: 77.5946,
    popularRoutes: [r('Chennai','chennai',346,4850), r('Mysore','mysore',150,2100), r('Hyderabad','hyderabad',570,7980), r('Coimbatore','coimbatore',365,5110), r('Tirupati','tirupati',252,3528), r('Madurai','madurai',438,6130), r('Ooty','ooty',270,3780), r('Pondicherry','pondicherry',310,4340), r('Kochi','kochi',555,7770), r('Salem','salem',210,2940), r('Vellore','vellore',212,2968), r('Trichy','trichy',345,4830), r('Hosur','hosur',38,532), r('Tiruvannamalai','tiruvannamalai',200,2800), r('Kodaikanal','kodaikanal',465,6510), r('Mangalore','mangalore',350,4900), r('Rameswaram','rameswaram',535,7490), r('Munnar','munnar',470,6580), r('Hampi','hampi',340,4760), r('Chikmagalur','chikmagalur',245,3430), r('Coorg','coorg',260,3640), r('Wayanad','wayanad',280,3920)] },
  { name: 'Mysore', slug: 'mysore', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 12.2958, lng: 76.6394,
    popularRoutes: [r('Bangalore','bangalore',150,2100), r('Ooty','ooty',125,1750), r('Coimbatore','coimbatore',210,2940), r('Wayanad','wayanad',105,1470), r('Chennai','chennai',480,6720), r('Coorg','coorg',110,1540)] },
  { name: 'Mangalore', slug: 'mangalore', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 12.9141, lng: 74.8560,
    popularRoutes: [r('Bangalore','bangalore',350,4900), r('Kasaragod','kasaragod',50,700), r('Mysore','mysore',260,3640), r('Kochi','kochi',390,5460), r('Coorg','coorg',135,1890)] },
  { name: 'Hubli', slug: 'hubli', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 15.3647, lng: 75.1240,
    popularRoutes: [r('Bangalore','bangalore',420,5880), r('Goa','goa',195,2730), r('Dharwad','dharwad',20,280), r('Belgaum','belgaum',94,1316)] },
  { name: 'Belgaum', slug: 'belgaum', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 15.8497, lng: 74.4977,
    popularRoutes: [r('Bangalore','bangalore',502,7028), r('Goa','goa',125,1750), r('Pune','pune',335,4690), r('Hubli','hubli',94,1316)] },
  { name: 'Gulbarga', slug: 'gulbarga', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 17.3297, lng: 76.8343,
    popularRoutes: [r('Hyderabad','hyderabad',220,3080), r('Bangalore','bangalore',615,8610), r('Bidar','bidar',110,1540)] },
  { name: 'Davangere', slug: 'davangere', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 14.4644, lng: 75.9218,
    popularRoutes: [r('Bangalore','bangalore',264,3696), r('Hubli','hubli',160,2240), r('Shimoga','shimoga',100,1400)] },
  { name: 'Bellary', slug: 'bellary', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 15.1394, lng: 76.9214,
    popularRoutes: [r('Bangalore','bangalore',310,4340), r('Hyderabad','hyderabad',370,5180), r('Hubli','hubli',190,2660)] },
  { name: 'Shimoga', slug: 'shimoga', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.9299, lng: 75.5681,
    popularRoutes: [r('Bangalore','bangalore',280,3920), r('Mangalore','mangalore',195,2730), r('Hubli','hubli',155,2170)] },
  { name: 'Tumkur', slug: 'tumkur', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.3379, lng: 77.1173,
    popularRoutes: [r('Bangalore','bangalore',70,980), r('Chitradurga','chitradurga',130,1820), r('Shimoga','shimoga',210,2940)] },
  { name: 'Raichur', slug: 'raichur', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 16.2120, lng: 77.3439,
    popularRoutes: [r('Hyderabad','hyderabad',310,4340), r('Bangalore','bangalore',405,5670), r('Gulbarga','gulbarga',160,2240)] },
  { name: 'Bidar', slug: 'bidar', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 17.9104, lng: 77.5199,
    popularRoutes: [r('Hyderabad','hyderabad',145,2030), r('Gulbarga','gulbarga',110,1540), r('Bangalore','bangalore',700,9800)] },
  { name: 'Hassan', slug: 'hassan', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.0033, lng: 76.1004,
    popularRoutes: [r('Bangalore','bangalore',187,2618), r('Mysore','mysore',118,1652), r('Mangalore','mangalore',175,2450)] },
  { name: 'Dharwad', slug: 'dharwad', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 15.4589, lng: 75.0078,
    popularRoutes: [r('Hubli','hubli',20,280), r('Bangalore','bangalore',440,6160), r('Goa','goa',175,2450), r('Belgaum','belgaum',74,1036)] },
  { name: 'Udupi', slug: 'udupi', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.3409, lng: 74.7421,
    popularRoutes: [r('Mangalore','mangalore',60,840), r('Bangalore','bangalore',400,5600), r('Goa','goa',280,3920)] },
  { name: 'Mandya', slug: 'mandya', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 12.5244, lng: 76.8958,
    popularRoutes: [r('Mysore','mysore',48,672), r('Bangalore','bangalore',100,1400)] },
  { name: 'Chikmagalur', slug: 'chikmagalur', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.3161, lng: 75.7720,
    popularRoutes: [r('Bangalore','bangalore',245,3430), r('Mangalore','mangalore',152,2128), r('Hassan','hassan',68,952)] },
  { name: 'Kodagu', slug: 'coorg', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 12.3375, lng: 75.8069,
    popularRoutes: [r('Mysore','mysore',110,1540), r('Bangalore','bangalore',260,3640), r('Mangalore','mangalore',135,1890)] },
  { name: 'Chitradurga', slug: 'chitradurga', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 14.2251, lng: 76.3980,
    popularRoutes: [r('Bangalore','bangalore',200,2800), r('Davangere','davangere',65,910), r('Hubli','hubli',225,3150)] },
  { name: 'Kolar', slug: 'kolar', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.1360, lng: 78.1292,
    popularRoutes: [r('Bangalore','bangalore',68,952), r('Chennai','chennai',280,3920), r('Tirupati','tirupati',185,2590)] },
  { name: 'Gadag', slug: 'gadag', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 15.4166, lng: 75.6259,
    popularRoutes: [r('Hubli','hubli',55,770), r('Bangalore','bangalore',475,6650)] },
  { name: 'Haveri', slug: 'haveri', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 14.7951, lng: 75.4001,
    popularRoutes: [r('Hubli','hubli',75,1050), r('Bangalore','bangalore',345,4830), r('Davangere','davangere',80,1120)] },
  { name: 'Bagalkot', slug: 'bagalkot', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 16.1691, lng: 75.6615,
    popularRoutes: [r('Hubli','hubli',110,1540), r('Bangalore','bangalore',530,7420), r('Belgaum','belgaum',120,1680)] },
  { name: 'Chamarajanagar', slug: 'chamarajanagar', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 11.9261, lng: 76.9437,
    popularRoutes: [r('Mysore','mysore',60,840), r('Bangalore','bangalore',210,2940)] },
  { name: 'Koppal', slug: 'koppal', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 15.3547, lng: 76.1546,
    popularRoutes: [r('Bangalore','bangalore',375,5250), r('Hubli','hubli',130,1820), r('Bellary','bellary',75,1050)] },
  { name: 'Chikballapur', slug: 'chikballapur', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 13.4355, lng: 77.7315,
    popularRoutes: [r('Bangalore','bangalore',57,798), r('Tirupati','tirupati',195,2730)] },
  { name: 'Ramanagara', slug: 'ramanagara', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 12.7159, lng: 77.2810,
    popularRoutes: [r('Bangalore','bangalore',50,700), r('Mysore','mysore',100,1400)] },
  { name: 'Yadgir', slug: 'yadgir', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 16.7700, lng: 77.1380,
    popularRoutes: [r('Gulbarga','gulbarga',80,1120), r('Raichur','raichur',75,1050), r('Hyderabad','hyderabad',280,3920)] },
  { name: 'Vijayapura', slug: 'vijayapura', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 16.8302, lng: 75.7100,
    popularRoutes: [r('Bangalore','bangalore',525,7350), r('Hubli','hubli',170,2380), r('Hyderabad','hyderabad',380,5320)] },
  { name: 'Dakshina Kannada', slug: 'dakshina-kannada', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 12.8700, lng: 75.0000,
    popularRoutes: [r('Mangalore','mangalore',15,210), r('Bangalore','bangalore',355,4970)] },
  { name: 'Uttara Kannada', slug: 'uttara-kannada', state: KA_STATE, stateSlug: KA_SLUG, tier: 3, lat: 14.6000, lng: 74.7500,
    popularRoutes: [r('Goa','goa',95,1330), r('Hubli','hubli',135,1890), r('Bangalore','bangalore',485,6790)] },
  // ─── Tourist & heritage destinations (Karnataka) ────────────
  { name: 'Hampi', slug: 'hampi', state: KA_STATE, stateSlug: KA_SLUG, tier: 2, lat: 15.3350, lng: 76.4600,
    popularRoutes: [r('Bangalore','bangalore',340,4760), r('Hubli','hubli',165,2310), r('Bellary','bellary',75,1050), r('Hyderabad','hyderabad',375,5250), r('Gulbarga','gulbarga',250,3500), r('Mangalore','mangalore',425,5950), r('Davangere','davangere',195,2730), r('Mysore','mysore',460,6440)] },
];

// ─── Pondicherry (4 districts) ──────────────────────────────
const PY_STATE = 'Pondicherry';
const PY_SLUG = 'pondicherry';

const pondicherryDistricts: District[] = [
  { name: 'Pondicherry', slug: 'pondicherry', state: PY_STATE, stateSlug: PY_SLUG, tier: 1, lat: 11.9416, lng: 79.8083,
    popularRoutes: [r('Chennai','chennai',150,2100), r('Bangalore','bangalore',310,4340), r('Trichy','trichy',207,2898), r('Madurai','madurai',375,5250), r('Cuddalore','cuddalore',25,350), r('Mahabalipuram','mahabalipuram',95,1330), r('Coimbatore','coimbatore',350,4900), r('Salem','salem',285,3990)] },
  { name: 'Karaikal', slug: 'karaikal', state: PY_STATE, stateSlug: PY_SLUG, tier: 3, lat: 10.9254, lng: 79.8380,
    popularRoutes: [r('Pondicherry','pondicherry',135,1890), r('Thanjavur','thanjavur',75,1050), r('Trichy','trichy',115,1610)] },
  { name: 'Mahe', slug: 'mahe', state: PY_STATE, stateSlug: PY_SLUG, tier: 3, lat: 11.7013, lng: 75.5355,
    popularRoutes: [r('Kozhikode','kozhikode',60,840), r('Kannur','kannur',75,1050)] },
  { name: 'Yanam', slug: 'yanam', state: PY_STATE, stateSlug: PY_SLUG, tier: 3, lat: 16.7333, lng: 82.2167,
    popularRoutes: [r('Kakinada','kakinada',20,280), r('Rajahmundry','rajahmundry',60,840)] },
];

// ─── Export all districts ───────────────────────────────────
export const ALL_DISTRICTS: District[] = [
  ...tamilNaduDistricts,
  ...tamilNaduSubDistricts,
  ...keralaDistricts,
  ...andhraDistricts,
  ...telanganaDistricts,
  ...karnatakaDistricts,
  ...pondicherryDistricts,
];

// Helper lookups
export const DISTRICT_BY_SLUG = new Map<string, District>(
  ALL_DISTRICTS.map(d => [d.slug, d])
);

export const DISTRICTS_BY_STATE = new Map<string, District[]>();
for (const d of ALL_DISTRICTS) {
  const arr = DISTRICTS_BY_STATE.get(d.stateSlug) || [];
  arr.push(d);
  DISTRICTS_BY_STATE.set(d.stateSlug, arr);
}

// Generate all slug combinations for static params
export function getAllSlugs(): string[] {
  const slugs: string[] = [];
  for (const d of ALL_DISTRICTS) {
    for (const st of SERVICE_TYPES) {
      slugs.push(`${st.id}-in-${d.slug}`);
    }
  }
  return slugs;
}

// Parse a slug into district + service type
export function parseSlug(slug: string): { district: District; serviceType: typeof SERVICE_TYPES[number] } | null {
  for (const st of SERVICE_TYPES) {
    const prefix = `${st.id}-in-`;
    if (slug.startsWith(prefix)) {
      const districtSlug = slug.slice(prefix.length);
      const district = DISTRICT_BY_SLUG.get(districtSlug);
      if (district) return { district, serviceType: st };
    }
  }
  return null;
}
