import { District, ServiceType } from '@/lib/districts';
import { MapPin, Shield, Clock, BadgeCheck } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';

interface DistrictHeroProps {
    district: District;
    serviceType: ServiceType;
    h1: string;
    subtitle: string;
}

const trustBadges = [
    { icon: MapPin, label: 'One-Way Fare Only' },
    { icon: Shield, label: 'No Hidden Charges' },
    { icon: Clock, label: '24/7 Service' },
    { icon: BadgeCheck, label: 'Verified Drivers' },
];

export default function DistrictHero({ district, serviceType, h1, subtitle }: DistrictHeroProps) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Top Rated in {district.state}
                        </div>

                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                            {h1}
                        </h1>

                        <p className="text-lg text-teal-100/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {subtitle}
                        </p>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                            {trustBadges.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                    <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                                    <span className="text-white/90 text-sm font-medium">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-2 text-white/80 text-sm">
                            <div><span className="text-2xl font-bold text-white">50K+</span><br />Happy Riders</div>
                            <div><span className="text-2xl font-bold text-white">4.8★</span><br />Average Rating</div>
                            <div><span className="text-2xl font-bold text-white">115+</span><br />Cities Covered</div>
                        </div>
                    </div>

                    {/* Booking Widget */}
                    <div className="relative z-10 w-full">
                        <BookingWidget />
                    </div>
                </div>
            </div>
        </section>
    );
}
