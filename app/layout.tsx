import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import Script from "next/script";
import { SUPPORT_PHONE, GOOGLE_MAPS_URL } from "@/lib/constants";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
    default: "OneWayTaxi.ai — #1 One Way Drop Taxi Service in South India",
    template: "%s | OneWayTaxi.ai",
  },
  description: "Book affordable one-way drop taxis across South India — Chennai, Bangalore, Coimbatore, Madurai & 115+ cities. Pay only for one way. Starting ₹13/km. 24/7 verified drivers. No hidden charges.",
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
    title: "OneWayTaxi.ai — #1 One Way Drop Taxi Service in South India",
    description: "Book affordable one-way drop taxis across South India. Pay only for one way — starting ₹13/km. 115+ cities, 24/7 service, verified drivers.",
    url: "https://onewaytaxi.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneWayTaxi.ai — #1 One Way Drop Taxi in South India",
    description: "Book affordable one-way drop taxis across South India. Pay only for one way — starting ₹13/km. 24/7 service.",
    creator: "@onewaytaxi",
  },
  alternates: {
    canonical: "https://onewaytaxi.ai",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased selection:bg-teal-900 selection:text-white`}>
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
        <FloatingCTA />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
