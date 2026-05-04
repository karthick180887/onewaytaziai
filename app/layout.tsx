import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import MobileBottomBar from "@/components/MobileBottomBar";
import Script from "next/script";
import { SUPPORT_PHONE, GOOGLE_MAPS_URL } from "@/lib/constants";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F3D3E",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://onewaytaxi.ai"),
  title: {
    default: "#1 One Way Drop Taxi South India | OneWayTaxi.ai",
    template: "%s | OneWayTaxi.ai",
  },
  description: "Book one-way drop taxis across South India — Chennai, Bangalore, Coimbatore & 120+ cities. Starting ₹13/km. Save 40%. 24/7 verified drivers.",
  keywords: ["one way taxi", "drop taxi", "outstation cab", "one way cab", "chennai taxi", "bangalore taxi", "airport taxi", "one way drop taxi south india", "cheap taxi booking"],
  authors: [{ name: "OneWayTaxi.ai" }],
  creator: "OneWayTaxi.ai",
  publisher: "OneWayTaxi.ai",
  formatDetection: {
    telephone: true,
    email: true,
  },
  verification: {
    google: "Wlg-Bsu6hr5ypQ7bOYUYMnHoWEYJwwGnCgcNhq3pkhk",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "OneWayTaxi.ai",
    title: "#1 One Way Drop Taxi South India | OneWayTaxi.ai",
    description: "Book affordable one-way drop taxis across South India. Pay only for one way — starting ₹13/km. 115+ cities, 24/7 service, verified drivers.",
    url: "https://onewaytaxi.ai",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "OneWayTaxi.ai — One Way Drop Taxi Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "#1 One Way Drop Taxi South India | OneWayTaxi.ai",
    description: "Book affordable one-way drop taxis across South India. Pay only for one way — starting ₹13/km. 24/7 service.",
    creator: "@onewaytaxi",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://onewaytaxi.ai",
    languages: {
      "en-IN": "https://onewaytaxi.ai",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Travel & Transportation",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased selection:bg-teal-900 selection:text-white pb-16 md:pb-0`}>
        {/* Organization Schema — site-wide entity identity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://onewaytaxi.ai/#organization",
              name: "OneWayTaxi.ai",
              url: "https://onewaytaxi.ai",
              logo: {
                "@type": "ImageObject",
                url: "https://onewaytaxi.ai/logo.png",
                width: 512,
                height: 512,
              },
              description: "South India's leading one-way drop taxi service covering 120+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry.",
              telephone: SUPPORT_PHONE.replace(/\s/g, ""),
              email: "booking@onewaytaxi.ai",
              sameAs: [GOOGLE_MAPS_URL],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: SUPPORT_PHONE.replace(/\s/g, ""),
                contactType: "customer service",
                areaServed: "IN",
                availableLanguage: ["en", "ta", "hi", "te", "kn", "ml"],
              },
              areaServed: {
                "@type": "Country",
                name: "India",
              },
            }),
          }}
        />
        {/* WebSite Schema — enables sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://onewaytaxi.ai/#website",
              name: "OneWayTaxi.ai",
              url: "https://onewaytaxi.ai",
              publisher: { "@id": "https://onewaytaxi.ai/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://onewaytaxi.ai/?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {children}
        <WhatsAppFAB />
        <MobileBottomBar />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18015779812"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18015779812');
          `}
        </Script>
      </body>
    </html>
  );
}
