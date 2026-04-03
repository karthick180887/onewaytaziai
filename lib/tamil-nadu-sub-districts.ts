// lib/tamil-nadu-sub-districts.ts — 79 Tamil Nadu sub-districts for taxi booking

import { District, PopularRoute } from './districts';

function r(to: string, toSlug: string, km: number, fare: number): PopularRoute {
  return { to, toSlug, distanceKm: km, fareEstimate: fare };
}

const TN_STATE = 'Tamil Nadu';
const TN_SLUG = 'tamil-nadu';

export const tamilNaduSubDistricts: District[] = [
  // ─── Chennai area (3) ──────────────────────────────────────
  { name: 'Tambaram', slug: 'tambaram', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.9249, lng: 80.1000,
    popularRoutes: [r('Chennai','chennai',28,392), r('Mahabalipuram','mahabalipuram',42,588), r('Pondicherry','pondicherry',130,1820), r('Kanchipuram','kanchipuram',50,700)] },
  { name: 'Avadi', slug: 'avadi', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 13.1067, lng: 80.1099,
    popularRoutes: [r('Chennai','chennai',24,336), r('Tiruvallur','tiruvallur',28,392), r('Arakkonam','arakkonam',65,910), r('Vellore','vellore',120,1680)] },
  { name: 'Ambattur', slug: 'ambattur', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 13.0982, lng: 80.1626,
    popularRoutes: [r('Chennai','chennai',18,252), r('Avadi','avadi',8,112), r('Sriperumbudur','sriperumbudur',30,420), r('Tiruvallur','tiruvallur',35,490)] },

  // ─── Chengalpattu (2) ──────────────────────────────────────
  { name: 'Mahabalipuram', slug: 'mahabalipuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.6269, lng: 80.1927,
    popularRoutes: [r('Chennai','chennai',58,812), r('Pondicherry','pondicherry',96,1344), r('Kanchipuram','kanchipuram',65,910), r('Chengalpattu','chengalpattu',30,420)] },
  { name: 'Sriperumbudur', slug: 'sriperumbudur', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.9672, lng: 79.9419,
    popularRoutes: [r('Chennai','chennai',42,588), r('Kanchipuram','kanchipuram',28,392), r('Vellore','vellore',100,1400), r('Bangalore','bangalore',305,4270)] },

  // ─── Tiruvallur (3) ────────────────────────────────────────
  { name: 'Tiruvallur', slug: 'tiruvallur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 13.1431, lng: 79.9083,
    popularRoutes: [r('Chennai','chennai',42,588), r('Arakkonam','arakkonam',42,588), r('Vellore','vellore',95,1330)] },
  { name: 'Arakkonam', slug: 'arakkonam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 13.0794, lng: 79.6714,
    popularRoutes: [r('Chennai','chennai',74,1036), r('Vellore','vellore',68,952), r('Tiruvallur','tiruvallur',42,588), r('Kanchipuram','kanchipuram',55,770)] },
  { name: 'Tiruttani', slug: 'tiruttani', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 13.1769, lng: 79.6108,
    popularRoutes: [r('Chennai','chennai',84,1176), r('Tirupati','tirupati',68,952), r('Arakkonam','arakkonam',18,252), r('Vellore','vellore',75,1050)] },

  // ─── Vellore (2) ───────────────────────────────────────────
  { name: 'Ambur', slug: 'ambur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.7907, lng: 78.7160,
    popularRoutes: [r('Vellore','vellore',55,770), r('Vaniyambadi','vaniyambadi',16,224), r('Chennai','chennai',190,2660), r('Bangalore','bangalore',175,2450)] },
  { name: 'Gudiyatham', slug: 'gudiyatham', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.9461, lng: 78.8729,
    popularRoutes: [r('Vellore','vellore',38,532), r('Ambur','ambur',25,350), r('Chennai','chennai',170,2380), r('Tirupattur','tirupattur',40,560)] },

  // ─── Ranipet (2) ───────────────────────────────────────────
  { name: 'Walajapet', slug: 'walajapet', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.9231, lng: 79.3672,
    popularRoutes: [r('Vellore','vellore',30,420), r('Chennai','chennai',110,1540), r('Kanchipuram','kanchipuram',48,672), r('Arcot','arcot',6,84)] },
  { name: 'Arcot', slug: 'arcot', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.9064, lng: 79.3190,
    popularRoutes: [r('Vellore','vellore',28,392), r('Chennai','chennai',115,1610), r('Ranipet','ranipet',8,112), r('Kanchipuram','kanchipuram',52,728)] },

  // ─── Tirupattur (2) ────────────────────────────────────────
  { name: 'Vaniyambadi', slug: 'vaniyambadi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.6824, lng: 78.6200,
    popularRoutes: [r('Vellore','vellore',70,980), r('Ambur','ambur',16,224), r('Tirupattur','tirupattur',22,308), r('Chennai','chennai',205,2870)] },
  { name: 'Yelagiri', slug: 'yelagiri', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.5826, lng: 78.6370,
    popularRoutes: [r('Vaniyambadi','vaniyambadi',28,392), r('Vellore','vellore',90,1260), r('Chennai','chennai',228,3192), r('Bangalore','bangalore',165,2310)] },

  // ─── Tiruvannamalai (1) ────────────────────────────────────
  { name: 'Polur', slug: 'polur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.5105, lng: 79.1215,
    popularRoutes: [r('Tiruvannamalai','tiruvannamalai',34,476), r('Vellore','vellore',55,770), r('Chennai','chennai',145,2030)] },

  // ─── Villupuram (2) ────────────────────────────────────────
  { name: 'Tindivanam', slug: 'tindivanam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.2340, lng: 79.6553,
    popularRoutes: [r('Pondicherry','pondicherry',35,490), r('Chennai','chennai',120,1680), r('Villupuram','villupuram',35,490), r('Kanchipuram','kanchipuram',65,910)] },
  { name: 'Gingee', slug: 'gingee', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.2520, lng: 79.4176,
    popularRoutes: [r('Villupuram','villupuram',37,518), r('Pondicherry','pondicherry',68,952), r('Tiruvannamalai','tiruvannamalai',38,532), r('Chennai','chennai',160,2240)] },

  // ─── Cuddalore (2) ────────────────────────────────────────
  { name: 'Chidambaram', slug: 'chidambaram', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 11.3992, lng: 79.6915,
    popularRoutes: [r('Cuddalore','cuddalore',42,588), r('Pondicherry','pondicherry',68,952), r('Thanjavur','thanjavur',104,1456), r('Chennai','chennai',235,3290)] },
  { name: 'Neyveli', slug: 'neyveli', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.5475, lng: 79.4861,
    popularRoutes: [r('Cuddalore','cuddalore',38,532), r('Villupuram','villupuram',48,672), r('Pondicherry','pondicherry',68,952), r('Trichy','trichy',145,2030)] },

  // ─── Kallakurichi (1) ──────────────────────────────────────
  { name: 'Sankarapuram', slug: 'sankarapuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.8811, lng: 78.8441,
    popularRoutes: [r('Kallakurichi','kallakurichi',22,308), r('Salem','salem',85,1190), r('Villupuram','villupuram',72,1008)] },

  // ─── Salem (3) ─────────────────────────────────────────────
  { name: 'Yercaud', slug: 'yercaud', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 11.7750, lng: 78.2080,
    popularRoutes: [r('Salem','salem',32,448), r('Chennai','chennai',365,5110), r('Bangalore','bangalore',240,3360), r('Trichy','trichy',165,2310)] },
  { name: 'Mettur', slug: 'mettur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.7876, lng: 77.7991,
    popularRoutes: [r('Salem','salem',55,770), r('Erode','erode',60,840), r('Coimbatore','coimbatore',145,2030), r('Bangalore','bangalore',225,3150)] },
  { name: 'Attur', slug: 'attur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.5933, lng: 78.6000,
    popularRoutes: [r('Salem','salem',40,560), r('Trichy','trichy',100,1400), r('Chennai','chennai',310,4340), r('Namakkal','namakkal',45,630)] },

  // ─── Namakkal (2) ──────────────────────────────────────────
  { name: 'Tiruchengode', slug: 'tiruchengode', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.3784, lng: 77.8945,
    popularRoutes: [r('Namakkal','namakkal',28,392), r('Salem','salem',58,812), r('Erode','erode',42,588), r('Coimbatore','coimbatore',120,1680)] },
  { name: 'Rasipuram', slug: 'rasipuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.4597, lng: 78.1838,
    popularRoutes: [r('Namakkal','namakkal',25,350), r('Salem','salem',38,532), r('Trichy','trichy',115,1610), r('Chennai','chennai',340,4760)] },

  // ─── Krishnagiri (2) ──────────────────────────────────────
  { name: 'Hosur', slug: 'hosur', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.7409, lng: 77.8253,
    popularRoutes: [r('Bangalore','bangalore',40,560), r('Chennai','chennai',310,4340), r('Salem','salem',200,2800), r('Krishnagiri','krishnagiri',45,630)] },
  { name: 'Denkanikottai', slug: 'denkanikottai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.5282, lng: 77.7894,
    popularRoutes: [r('Hosur','hosur',30,420), r('Bangalore','bangalore',68,952), r('Krishnagiri','krishnagiri',48,672), r('Salem','salem',175,2450)] },

  // ─── Dharmapuri (1) ────────────────────────────────────────
  { name: 'Hogenakkal', slug: 'hogenakkal', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 12.1155, lng: 77.7772,
    popularRoutes: [r('Dharmapuri','dharmapuri',46,644), r('Bangalore','bangalore',130,1820), r('Salem','salem',110,1540), r('Chennai','chennai',350,4900)] },

  // ─── Erode (2) ─────────────────────────────────────────────
  { name: 'Gobichettipalayam', slug: 'gobichettipalayam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.4551, lng: 77.4407,
    popularRoutes: [r('Erode','erode',28,392), r('Coimbatore','coimbatore',80,1120), r('Salem','salem',90,1260), r('Bangalore','bangalore',300,4200)] },
  { name: 'Bhavani', slug: 'bhavani', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.4467, lng: 77.6820,
    popularRoutes: [r('Erode','erode',16,224), r('Salem','salem',55,770), r('Coimbatore','coimbatore',108,1512), r('Trichy','trichy',165,2310)] },

  // ─── Tiruppur (2) ──────────────────────────────────────────
  { name: 'Avinashi', slug: 'avinashi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.1929, lng: 77.2695,
    popularRoutes: [r('Tiruppur','tiruppur',18,252), r('Coimbatore','coimbatore',35,490), r('Erode','erode',62,868), r('Ooty','ooty',85,1190)] },
  { name: 'Udumalaipettai', slug: 'udumalaipettai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.5883, lng: 77.2481,
    popularRoutes: [r('Coimbatore','coimbatore',65,910), r('Palani','palani',42,588), r('Kodaikanal','kodaikanal',65,910), r('Tiruppur','tiruppur',60,840)] },

  // ─── Coimbatore (2) ────────────────────────────────────────
  { name: 'Pollachi', slug: 'pollachi', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.6609, lng: 77.0087,
    popularRoutes: [r('Coimbatore','coimbatore',42,588), r('Palakkad','palakkad',48,672), r('Valparai','valparai',65,910), r('Madurai','madurai',200,2800)] },
  { name: 'Valparai', slug: 'valparai', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.3268, lng: 76.9528,
    popularRoutes: [r('Coimbatore','coimbatore',105,1470), r('Pollachi','pollachi',65,910), r('Munnar','munnar',86,1204), r('Kochi','kochi',178,2492)] },

  // ─── Nilgiris (3) ──────────────────────────────────────────
  { name: 'Coonoor', slug: 'coonoor', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 11.3530, lng: 76.7959,
    popularRoutes: [r('Ooty','ooty',19,266), r('Coimbatore','coimbatore',68,952), r('Mysore','mysore',145,2030), r('Bangalore','bangalore',285,3990)] },
  { name: 'Kotagiri', slug: 'kotagiri', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.4215, lng: 76.8615,
    popularRoutes: [r('Ooty','ooty',28,392), r('Coonoor','coonoor',22,308), r('Coimbatore','coimbatore',60,840), r('Mysore','mysore',158,2212)] },
  { name: 'Gudalur', slug: 'gudalur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.5057, lng: 76.4998,
    popularRoutes: [r('Ooty','ooty',51,714), r('Mysore','mysore',92,1288), r('Wayanad','wayanad',30,420), r('Coimbatore','coimbatore',135,1890)] },

  // ─── Dindigul (2) ──────────────────────────────────────────
  { name: 'Palani', slug: 'palani', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.4505, lng: 77.5164,
    popularRoutes: [r('Madurai','madurai',120,1680), r('Coimbatore','coimbatore',100,1400), r('Dindigul','dindigul',70,980), r('Kodaikanal','kodaikanal',65,910)] },
  { name: 'Natham', slug: 'natham', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.2180, lng: 78.1870,
    popularRoutes: [r('Dindigul','dindigul',38,532), r('Madurai','madurai',55,770), r('Trichy','trichy',90,1260)] },

  // ─── Karur (1) ─────────────────────────────────────────────
  { name: 'Kulithalai', slug: 'kulithalai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.9364, lng: 78.4191,
    popularRoutes: [r('Karur','karur',30,420), r('Trichy','trichy',45,630), r('Musiri','musiri',18,252)] },

  // ─── Tiruchirappalli (2) ───────────────────────────────────
  { name: 'Srirangam', slug: 'srirangam', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.8560, lng: 78.6918,
    popularRoutes: [r('Trichy','trichy',8,112), r('Thanjavur','thanjavur',55,770), r('Madurai','madurai',135,1890), r('Chennai','chennai',330,4620)] },
  { name: 'Lalgudi', slug: 'lalgudi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.8727, lng: 78.8177,
    popularRoutes: [r('Trichy','trichy',22,308), r('Thanjavur','thanjavur',40,560), r('Kumbakonam','kumbakonam',65,910)] },

  // ─── Perambalur (1) ────────────────────────────────────────
  { name: 'Kunnam', slug: 'kunnam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.2700, lng: 79.0400,
    popularRoutes: [r('Perambalur','perambalur',20,280), r('Trichy','trichy',72,1008), r('Ariyalur','ariyalur',32,448)] },

  // ─── Ariyalur (1) ──────────────────────────────────────────
  { name: 'Jayankondam', slug: 'jayankondam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.0586, lng: 79.3380,
    popularRoutes: [r('Ariyalur','ariyalur',28,392), r('Trichy','trichy',68,952), r('Thanjavur','thanjavur',75,1050)] },

  // ─── Thanjavur (2) ─────────────────────────────────────────
  { name: 'Pattukkottai', slug: 'pattukkottai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.4244, lng: 79.3148,
    popularRoutes: [r('Thanjavur','thanjavur',55,770), r('Trichy','trichy',108,1512), r('Pudukkottai','pudukkottai',38,532)] },
  { name: 'Thiruvaiyaru', slug: 'thiruvaiyaru', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.8830, lng: 79.1040,
    popularRoutes: [r('Thanjavur','thanjavur',13,182), r('Trichy','trichy',42,588), r('Kumbakonam','kumbakonam',32,448)] },

  // ─── Mayiladuthurai (1) ────────────────────────────────────
  { name: 'Sirkazhi', slug: 'sirkazhi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.2358, lng: 79.7357,
    popularRoutes: [r('Mayiladuthurai','mayiladuthurai',18,252), r('Chidambaram','chidambaram',20,280), r('Thanjavur','thanjavur',82,1148)] },

  // ─── Nagapattinam (2) ──────────────────────────────────────
  { name: 'Velankanni', slug: 'velankanni', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.6824, lng: 79.8490,
    popularRoutes: [r('Nagapattinam','nagapattinam',12,168), r('Thanjavur','thanjavur',70,980), r('Trichy','trichy',140,1960), r('Chennai','chennai',345,4830)] },
  { name: 'Nagore', slug: 'nagore', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.8220, lng: 79.8440,
    popularRoutes: [r('Nagapattinam','nagapattinam',8,112), r('Velankanni','velankanni',18,252), r('Thanjavur','thanjavur',80,1120)] },

  // ─── Tiruvarur (2) ─────────────────────────────────────────
  { name: 'Tiruvarur', slug: 'tiruvarur-town', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.7721, lng: 79.6367,
    popularRoutes: [r('Thanjavur','thanjavur',55,770), r('Kumbakonam','kumbakonam',35,490), r('Nagapattinam','nagapattinam',30,420)] },
  { name: 'Mannargudi', slug: 'mannargudi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.6626, lng: 79.4513,
    popularRoutes: [r('Thanjavur','thanjavur',42,588), r('Tiruvarur','tiruvarur-town',25,350), r('Trichy','trichy',100,1400)] },

  // ─── Pudukkottai (1) ───────────────────────────────────────
  { name: 'Karaikudi', slug: 'karaikudi', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.0724, lng: 78.7810,
    popularRoutes: [r('Madurai','madurai',85,1190), r('Trichy','trichy',95,1330), r('Thanjavur','thanjavur',105,1470), r('Chennai','chennai',420,5880)] },

  // ─── Sivaganga (2) ─────────────────────────────────────────
  { name: 'Chettinad', slug: 'chettinad', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 10.1200, lng: 78.8000,
    popularRoutes: [r('Madurai','madurai',78,1092), r('Trichy','trichy',90,1260), r('Karaikudi','karaikudi',12,168), r('Rameswaram','rameswaram',130,1820)] },
  { name: 'Devakottai', slug: 'devakottai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.1647, lng: 78.8251,
    popularRoutes: [r('Karaikudi','karaikudi',14,196), r('Sivaganga','sivaganga',35,490), r('Madurai','madurai',92,1288), r('Trichy','trichy',100,1400)] },

  // ─── Madurai (2) ───────────────────────────────────────────
  { name: 'Melur', slug: 'melur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.0320, lng: 78.3370,
    popularRoutes: [r('Madurai','madurai',35,490), r('Trichy','trichy',138,1932), r('Sivaganga','sivaganga',48,672)] },
  { name: 'Thirumangalam', slug: 'thirumangalam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.8200, lng: 77.9830,
    popularRoutes: [r('Madurai','madurai',28,392), r('Virudhunagar','virudhunagar',35,490), r('Tirunelveli','tirunelveli',130,1820)] },

  // ─── Theni (2) ─────────────────────────────────────────────
  { name: 'Bodi', slug: 'bodi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.0100, lng: 77.3500,
    popularRoutes: [r('Theni','theni',24,336), r('Madurai','madurai',85,1190), r('Kodaikanal','kodaikanal',55,770), r('Coimbatore','coimbatore',175,2450)] },
  { name: 'Cumbum', slug: 'cumbum', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.7334, lng: 77.2832,
    popularRoutes: [r('Theni','theni',35,490), r('Madurai','madurai',108,1512), r('Coimbatore','coimbatore',195,2730), r('Kumily','kumily',32,448)] },

  // ─── Virudhunagar (2) ──────────────────────────────────────
  { name: 'Sivakasi', slug: 'sivakasi', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 9.4533, lng: 77.7978,
    popularRoutes: [r('Madurai','madurai',75,1050), r('Virudhunagar','virudhunagar',18,252), r('Tirunelveli','tirunelveli',100,1400), r('Coimbatore','coimbatore',290,4060)] },
  { name: 'Srivilliputhur', slug: 'srivilliputhur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.5122, lng: 77.6340,
    popularRoutes: [r('Madurai','madurai',80,1120), r('Virudhunagar','virudhunagar',32,448), r('Tirunelveli','tirunelveli',115,1610), r('Rajapalayam','rajapalayam',18,252)] },

  // ─── Ramanathapuram (2) ────────────────────────────────────
  { name: 'Rameswaram', slug: 'rameswaram', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 9.2885, lng: 79.3129,
    popularRoutes: [r('Madurai','madurai',174,2436), r('Trichy','trichy',262,3668), r('Chennai','chennai',578,8092), r('Kanyakumari','kanyakumari',310,4340)] },
  { name: 'Paramakudi', slug: 'paramakudi', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.5465, lng: 78.5916,
    popularRoutes: [r('Madurai','madurai',92,1288), r('Rameswaram','rameswaram',85,1190), r('Sivaganga','sivaganga',48,672)] },

  // ─── Thoothukudi (1) ───────────────────────────────────────
  { name: 'Tiruchendur', slug: 'tiruchendur', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 8.4943, lng: 78.1190,
    popularRoutes: [r('Tuticorin','tuticorin',40,560), r('Tirunelveli','tirunelveli',55,770), r('Madurai','madurai',178,2492), r('Kanyakumari','kanyakumari',105,1470)] },

  // ─── Tirunelveli (2) ───────────────────────────────────────
  { name: 'Courtallam', slug: 'courtallam', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 8.9332, lng: 77.2758,
    popularRoutes: [r('Tirunelveli','tirunelveli',50,700), r('Tenkasi','tenkasi',5,70), r('Madurai','madurai',168,2352), r('Kanyakumari','kanyakumari',115,1610)] },
  { name: 'Sankarankovil', slug: 'sankarankovil', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.1740, lng: 77.5296,
    popularRoutes: [r('Tirunelveli','tirunelveli',48,672), r('Madurai','madurai',115,1610), r('Tenkasi','tenkasi',40,560)] },

  // ─── Tenkasi (1) ───────────────────────────────────────────
  { name: 'Kadayanallur', slug: 'kadayanallur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.0726, lng: 77.3428,
    popularRoutes: [r('Tenkasi','tenkasi',18,252), r('Tirunelveli','tirunelveli',60,840), r('Courtallam','courtallam',22,308)] },

  // ─── Kanyakumari (2) ───────────────────────────────────────
  { name: 'Nagercoil', slug: 'nagercoil', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 8.1833, lng: 77.4119,
    popularRoutes: [r('Kanyakumari','kanyakumari',22,308), r('Trivandrum','thiruvananthapuram',65,910), r('Madurai','madurai',238,3332), r('Tirunelveli','tirunelveli',72,1008)] },
  { name: 'Padmanabhapuram', slug: 'padmanabhapuram', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 8.2411, lng: 77.3271,
    popularRoutes: [r('Nagercoil','nagercoil',12,168), r('Kanyakumari','kanyakumari',32,448), r('Trivandrum','thiruvananthapuram',55,770)] },

  // ─── Additional sub-districts (11) ─────────────────────────
  { name: 'Jolarpettai', slug: 'jolarpettai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.5700, lng: 78.5800,
    popularRoutes: [r('Vellore','vellore',62,868), r('Tirupattur','tirupattur',18,252), r('Bangalore','bangalore',155,2170), r('Chennai','chennai',210,2940)] },
  { name: 'Manamadurai', slug: 'manamadurai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.8900, lng: 78.4700,
    popularRoutes: [r('Madurai','madurai',48,672), r('Sivaganga','sivaganga',28,392), r('Rameswaram','rameswaram',130,1820)] },
  { name: 'Kumily', slug: 'kumily', state: TN_STATE, stateSlug: TN_SLUG, tier: 2, lat: 9.6000, lng: 77.1700,
    popularRoutes: [r('Madurai','madurai',145,2030), r('Kochi','kochi',135,1890), r('Munnar','munnar',90,1260), r('Thekkady','kumily',5,70)] },
  { name: 'Aruppukkottai', slug: 'aruppukkottai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.5132, lng: 78.0969,
    popularRoutes: [r('Madurai','madurai',68,952), r('Virudhunagar','virudhunagar',18,252), r('Tirunelveli','tirunelveli',110,1540)] },
  { name: 'Omalur', slug: 'omalur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 11.7400, lng: 78.0440,
    popularRoutes: [r('Salem','salem',32,448), r('Mettur','mettur',28,392), r('Yercaud','yercaud',42,588), r('Dharmapuri','dharmapuri',48,672)] },
  { name: 'Vandalur', slug: 'vandalur', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 12.8878, lng: 80.0813,
    popularRoutes: [r('Chennai','chennai',32,448), r('Tambaram','tambaram',8,112), r('Mahabalipuram','mahabalipuram',38,532), r('Kanchipuram','kanchipuram',40,560)] },
  { name: 'Thiruparankundram', slug: 'thiruparankundram', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.8800, lng: 78.0700,
    popularRoutes: [r('Madurai','madurai',8,112), r('Virudhunagar','virudhunagar',55,770), r('Tirunelveli','tirunelveli',148,2072)] },
  { name: 'Swamimalai', slug: 'swamimalai', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 10.9573, lng: 79.3266,
    popularRoutes: [r('Kumbakonam','kumbakonam',6,84), r('Thanjavur','thanjavur',35,490), r('Trichy','trichy',90,1260)] },
  { name: 'Rajapalayam', slug: 'rajapalayam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 9.4540, lng: 77.5560,
    popularRoutes: [r('Madurai','madurai',100,1400), r('Virudhunagar','virudhunagar',42,588), r('Tirunelveli','tirunelveli',85,1190), r('Srivilliputhur','srivilliputhur',18,252)] },
  { name: 'Kovilpatti', slug: 'kovilpatti', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 8.5186, lng: 77.8694,
    popularRoutes: [r('Tuticorin','tuticorin',35,490), r('Tirunelveli','tirunelveli',42,588), r('Madurai','madurai',140,1960)] },
  { name: 'Kayalpattinam', slug: 'kayalpattinam', state: TN_STATE, stateSlug: TN_SLUG, tier: 3, lat: 8.5718, lng: 78.1172,
    popularRoutes: [r('Tuticorin','tuticorin',18,252), r('Tiruchendur','tiruchendur',15,210), r('Tirunelveli','tirunelveli',52,728)] },
];
