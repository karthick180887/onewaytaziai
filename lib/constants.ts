
export const APP_NAME = "OneWayTaxi.ai";
export const SUPPORT_PHONE = "+91 81244 76010";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps?cid=3067858689372984107";

export const POPULAR_CITIES = [
    "Chennai",
    "Bangalore",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Salem",
    "Pondicherry",
    "Kochi",
    "Hyderabad",
    "Tirupati"
];

export const VEHICLE_TYPES = [
    { id: 'mini', name: 'Mini (3+1)', price: 13, seat: 4, icon: 'Car', image: '/images/fleet/mini.webp' },
    { id: 'sedan', name: 'Sedan (4+1)', price: 14, seat: 4, icon: 'CarFront', image: '/images/fleet/sedan.webp' },
    { id: 'etios', name: 'Etios (4+1)', price: 14, seat: 5, icon: 'CarFront', image: '/images/fleet/etios.webp' },
    { id: 'sedan_no_cng', name: 'Sedan (Non-CNG)', price: 14, seat: 5, icon: 'CarFront', image: '/images/fleet/sedan_no_cng.webp' },
    { id: 'suv', name: 'SUV (7+1) Carrier', price: 19, seat: 8, icon: 'Bus', image: '/images/fleet/suv.webp' },
    { id: 'innova', name: 'Innova (Carrier)', price: 20, seat: 7, icon: 'Bus', image: '/images/fleet/innova.webp' },
    { id: 'innova_crysta', name: 'Innova Crysta', price: 22, seat: 7, icon: 'Bus', image: '/images/fleet/crysta.webp' },
];

export const FEATURES = [
    { title: "One Way Fare", desc: "Pay only for the distance traveled. No return charges.", icon: "MapPin" },
    { title: "No Hidden Costs", desc: "Inclusive of tolls, driver allowance, and GST.", icon: "Wallet" },
    { title: "24/7 Support", desc: "Round the clock customer service for your safety.", icon: "Phone" },
    { title: "Verified Drivers", desc: "Experienced and professional drivers for safe travel.", icon: "ShieldCheck" },
];

export const TIER_1_CITIES = [
    { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu' },
    { name: 'Coimbatore', slug: 'coimbatore', state: 'Tamil Nadu' },
    { name: 'Madurai', slug: 'madurai', state: 'Tamil Nadu' },
    { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana' },
    { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram', state: 'Kerala' },
    { name: 'Kochi', slug: 'kochi', state: 'Kerala' },
    { name: 'Visakhapatnam', slug: 'visakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Vijayawada', slug: 'vijayawada', state: 'Andhra Pradesh' },
    { name: 'Tirupati', slug: 'tirupati', state: 'Andhra Pradesh' },
    { name: 'Pondicherry', slug: 'pondicherry', state: 'Pondicherry' },
];

export const EXCLUDED_ITEMS = [
    'Night charges (after 10 PM)',
    'Waiting charges (after 30 min free)',
    'Inter-state permit (if applicable)',
    'Parking fees at destination',
];
