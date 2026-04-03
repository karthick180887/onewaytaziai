"use client";

import { Car, Phone, MessageCircle } from "lucide-react";

const WHATSAPP_LINK =
  "https://wa.me/918124476010?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi.%20Please%20share%20fare%20details.";

export default function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 block md:hidden bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around gap-2 px-3 py-2">
        {/* Book Now */}
        <a
          href="/#booking"
          className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-yellow-600 transition-colors"
        >
          <Car className="h-4 w-4" />
          <span>Book Now</span>
        </a>

        {/* Call */}
        <a
          href="tel:+918124476010"
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-red-600 transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-[#1da851] transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
