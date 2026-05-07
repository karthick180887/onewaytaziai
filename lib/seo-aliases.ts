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
    'arunachalam': 'tiruvannamalai',
    'arunachala': 'tiruvannamalai',

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

    // Karnataka aliases
    'bengaluru': 'bangalore',
    'bangaluru': 'bangalore',

    // Telangana aliases
    'secunderabad': 'hyderabad',
    'cyberabad': 'hyderabad',

    // Pondicherry aliases
    'puducherry': 'pondicherry',
    'pondy': 'pondicherry',
};

/**
 * Resolve a slug, checking aliases first.
 * Handles new URL pattern: {serviceType}-in-{districtSlug}
 * Returns the canonical slug if an alias matches, otherwise returns the input slug.
 */
export function resolveAlias(slug: string): string {
    // Direct alias match (bare district slug)
    if (SEO_ALIASES[slug]) return SEO_ALIASES[slug];

    // New pattern: service-type-in-{districtSlug}
    // Check if the district part (after "-in-") is an alias
    const inIndex = slug.lastIndexOf('-in-');
    if (inIndex !== -1) {
        const districtPart = slug.slice(inIndex + 4);
        if (SEO_ALIASES[districtPart]) {
            return slug.slice(0, inIndex + 4) + SEO_ALIASES[districtPart];
        }
    }

    return slug;
}
