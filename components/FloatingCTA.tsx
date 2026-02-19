"use client";

import { Phone, MessageCircle } from "lucide-react";
import { SUPPORT_PHONE } from "@/lib/constants";

const phoneClean = SUPPORT_PHONE.replace(/\s/g, "");
const whatsappNumber = phoneClean.replace("+", "");

export default function FloatingCTA() {
    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-3">
            {/* WhatsApp */}
            <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    WhatsApp Us
                </span>
            </a>

            {/* Call */}
            <a
                href={`tel:${phoneClean}`}
                aria-label="Call us"
                className="group flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 animate-pulse hover:animate-none"
            >
                <Phone className="h-6 w-6" />
                <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Call Now
                </span>
            </a>
        </div>
    );
}
