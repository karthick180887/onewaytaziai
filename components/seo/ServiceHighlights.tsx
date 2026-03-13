import { MapPin, Wallet, Phone, ShieldCheck, Snowflake, Zap, FileCheck, Clock } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = { MapPin, Wallet, Phone, ShieldCheck, Snowflake, Zap, FileCheck, Clock };

interface Highlight {
    title: string;
    desc: string;
    icon: string;
}

interface ServiceHighlightsProps {
    features?: Highlight[];
}

const DEFAULT_HIGHLIGHTS = [
    { icon: 'MapPin', title: 'One-Way Pricing', desc: 'Pay only for the distance you travel. No return charges ever.' },
    { icon: 'Wallet', title: 'No Hidden Costs', desc: 'Fare includes tolls, driver bata, permits & GST. What you see is what you pay.' },
    { icon: 'Phone', title: '24/7 Support', desc: 'Round-the-clock customer service. Call, WhatsApp, or book online anytime.' },
    { icon: 'ShieldCheck', title: 'Verified Drivers', desc: 'Background-checked, experienced & professional drivers for your safety.' },
    { icon: 'Snowflake', title: 'AC Vehicles', desc: 'All vehicles are well-maintained with working AC for a comfortable journey.' },
    { icon: 'Zap', title: 'Instant Booking', desc: 'Book in 30 seconds online. Instant confirmation with driver details.' },
];

export default function ServiceHighlights({ features }: ServiceHighlightsProps) {
    const items = features && features.length > 0 ? features : DEFAULT_HIGHLIGHTS;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Why Choose OneWayTaxi.ai?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Premium one-way taxi service trusted by 50,000+ travelers across South India
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, idx) => {
                        const Icon = ICONS[item.icon] || MapPin;
                        return (
                            <div
                                key={item.title + idx}
                                className="group flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-lg hover:border-teal-200 transition-all duration-300"
                            >
                                <div className="shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                                    <Icon className="h-6 w-6 text-teal-700 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
