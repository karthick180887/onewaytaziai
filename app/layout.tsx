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
              logo: "https://onewaytaxi.ai/logo.png",
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
        {/* HowTo Schema — targets 'how to book one way taxi' featured snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Book a One Way Taxi Online in India",
              description: "Book an affordable one-way intercity taxi in South India in under 3 minutes. Pay only for one way — no return charges.",
              totalTime: "PT3M",
              estimatedCost: {
                "@type": "MonetaryAmount",
                currency: "INR",
                value: "13",
                unitText: "per km",
              },
              tool: [
                { "@type": "HowToTool", name: "Smartphone or Computer" },
                { "@type": "HowToTool", name: "Internet connection" },
              ],
              step: [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "Enter your pickup and destination city",
                  text: "Go to OneWayTaxi.ai and type your pickup city (e.g. Chennai) and your destination city (e.g. Bangalore) in the booking form.",
                  url: "https://onewaytaxi.ai/#booking",
                },
                {
                  "@type": "HowToStep",
                  position: 2,
                  name: "Select travel date, time and vehicle type",
                  text: "Choose your preferred departure date and time. Select a vehicle — Mini (₹13/km), Sedan (₹14/km), SUV (₹19/km), or Innova Crysta (₹22/km).",
                  url: "https://onewaytaxi.ai/#booking",
                },
                {
                  "@type": "HowToStep",
                  position: 3,
                  name: "Review your all-inclusive one-way fare",
                  text: "See the instant fare — inclusive of driver bata, toll charges, permits, and GST. This is a ONE-WAY fare. You pay only for the distance you travel.",
                  url: "https://onewaytaxi.ai/#booking",
                },
                {
                  "@type": "HowToStep",
                  position: 4,
                  name: "Confirm booking and get driver details",
                  text: "Enter your name, phone, and confirm the booking. Your driver details (name, vehicle number, contact) are sent instantly. Pay cash or UPI at trip end.",
                  url: "https://onewaytaxi.ai/#booking",
                },
              ],
            }),
          }}
        />
        {children}
        <FloatingCTA />
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDrL9-n9B6VC3D9nfGJibVOCDkSWUyrdqo&libraries=places&loading=async"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
