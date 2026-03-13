import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OneWayTaxi.ai - Premium Drop Taxi Service in South India",
  description: "Book affordable one-way drop taxis in Chennai, Bangalore, Coimbatore, and across South India. Pay only for the distance traveled. 24/7 reliable service.",
  keywords: ["onewaytaxi", "drop taxi", "outstation cab", "chennai taxi", "bangalore taxi", "airport taxi"],
  verification: {
    google: "Wlg-Bsu6hr5ypQ7bOYUYMnHoWEYJwwGnCgcNhq3pkhk",
  },
};

import Script from "next/script";

// ... (existing imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased selection:bg-teal-900 selection:text-white`}>
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
