import { Star, Users, MapPin, Calendar, ShieldCheck, Award } from 'lucide-react';

const trustStats = [
    { icon: Users, value: '50,000+', label: 'Happy Customers', color: 'text-teal-400' },
    { icon: Star, value: '4.8/5', label: 'Google Rating', color: 'text-yellow-400' },
    { icon: MapPin, value: '115+', label: 'Cities Covered', color: 'text-emerald-400' },
    { icon: Calendar, value: '5+', label: 'Years of Service', color: 'text-blue-400' },
    { icon: ShieldCheck, value: '100%', label: 'Verified Drivers', color: 'text-violet-400' },
    { icon: Award, value: '24/7', label: 'Customer Support', color: 'text-orange-400' },
];

export default function TrustBanner() {
    return (
        <section className="py-10 bg-gray-900" aria-label="Trust indicators">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                    {trustStats.map(({ icon: Icon, value, label, color }) => (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <Icon className={`h-6 w-6 ${color}`} />
                            <div className="text-2xl font-bold text-white">{value}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
