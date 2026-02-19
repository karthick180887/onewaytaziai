import { ShieldCheck, Headphones, MapPin, Sparkles } from 'lucide-react';

const icons = {
    ShieldCheck,
    Headphones,
    MapPin,
    Sparkles
};

interface SafetyFeaturesProps {
    features: {
        title: string;
        desc: string;
        icon: string;
    }[];
}

export default function SafetyFeatures({ features }: SafetyFeaturesProps) {
    return (
        <section className="py-12 bg-gray-900 text-gray-200" aria-label="Safety features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = icons[feature.icon as keyof typeof icons] || ShieldCheck;
                        return (
                            <div key={feature.title} className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-gray-800 border border-gray-700 group-hover:bg-teal-900/50 group-hover:border-teal-700/50 transition-colors shrink-0">
                                    <Icon className="h-6 w-6 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
