// lib/seo-aliases.ts — Maps alternate/common names to canonical district slugs

export const SEO_ALIASES: Record<string, string> = {
    // Tamil Nadu aliases
    'trivandrum': 'thiruvananthapuram',
    'trich': 'trichy',
    'tiruchi': 'trichy',
    'tiruchirappalli': 'trichy',
    'tuticorin': 'tuticorin',
    'thoothukudi': 'tuticorin',
    'ooty': 'ooty',
    'nilgiris': 'ooty',
    'udhagamandalam': 'ooty',
    'rameshwaram': 'rameswaram',
    'ramanathapuram': 'rameswaram',
    'kumbakonam': 'kumbakonam',

    // Kerala aliases
    'cochin': 'kochi',
    'calicut': 'kozhikode',
    'alleppey': 'alappuzha',
    'palghat': 'palakkad',
    'cannanore': 'kannur',
    'quilon': 'kollam',
    'trichur': 'thrissur',

    // Andhra Pradesh aliases
    'vizag': 'visakhapatnam',
    'bezawada': 'vijayawada',
    'rajamundry': 'rajahmundry',
    'kakinada': 'kakinada',
    'nellore': 'nellore',

    // Telangana aliases
    'secunderabad': 'hyderabad',
    'cyberabad': 'hyderabad',

    // Pondicherry aliases
    'puducherry': 'pondicherry',
    'pondy': 'pondicherry',
};

/**
 * Resolve a slug, checking aliases first.
 * Returns the canonical slug if an alias matches, otherwise returns the input slug.
 */
export function resolveAlias(slug: string): string {
    // First check if it's a direct alias match (without service type suffix)
    if (SEO_ALIASES[slug]) return SEO_ALIASES[slug];

    // Check if the slug has a service-type suffix and the district part is an alias
    const suffixes = ['-drop-taxi', '-taxi-service', '-outstation-cab', '-airport-taxi'];
    for (const suffix of suffixes) {
        if (slug.endsWith(suffix)) {
            const districtPart = slug.slice(0, -suffix.length);
            if (SEO_ALIASES[districtPart]) {
                return SEO_ALIASES[districtPart] + suffix;
            }
        }
    }

    return slug;
}
