import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Old service type suffixes to match against (ordered longest-first to avoid partial matches)
const OLD_SUFFIXES = [
  { suffix: '-outstation-cab', newPrefix: 'outstation-cabs-in-' },
  { suffix: '-airport-taxi', newPrefix: 'cab-service-in-' },
  { suffix: '-one-way-taxi', newPrefix: 'one-way-taxi-in-' },
  { suffix: '-taxi-service', newPrefix: 'taxi-service-in-' },
  { suffix: '-outstation-cabs', newPrefix: 'outstation-cabs-in-' },
  { suffix: '-cab-service', newPrefix: 'cab-service-in-' },
  { suffix: '-drop-taxi', newPrefix: 'drop-taxi-in-' },
  { suffix: '-call-taxi', newPrefix: 'call-taxi-in-' },
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip paths that already use the new pattern or are not location pages
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/route/') ||
    pathname.startsWith('/blog/') ||
    pathname.startsWith('/fare-calculator') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('-in-') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Check if the path matches old URL pattern: /{districtSlug}-{serviceType}
  const slug = pathname.slice(1); // remove leading /
  for (const { suffix, newPrefix } of OLD_SUFFIXES) {
    if (slug.endsWith(suffix)) {
      const districtSlug = slug.slice(0, -suffix.length);
      if (districtSlug) {
        const newUrl = new URL(`/${newPrefix}${districtSlug}`, request.url);
        return NextResponse.redirect(newUrl, 301);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all single-segment paths (location pages)
    // Skip static files, api routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|logo).*)',
  ],
};
