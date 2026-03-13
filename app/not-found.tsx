import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, ArrowRight, Phone } from 'lucide-react';
import { SUPPORT_PHONE } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Page Not Found — OneWayTaxi.ai',
    description: 'The page you are looking for does not exist. Book your one-way drop taxi from our homepage.',
    robots: {
        index: false,
        follow: true,
    },
};

const popularRoutes = [
    { label: 'Chennai Drop Taxi', href: '/chennai-drop-taxi' },
    { label: 'Bangalore Taxi Service', href: '/bangalore-taxi-service' },
    { label: 'Coimbatore Outstation Cab', href: '/coimbatore-outstation-cab' },
    { label: 'Madurai Drop Taxi', href: '/madurai-drop-taxi' },
    { label: 'Hyderabad Taxi Service', href: '/hyderabad-taxi-service' },
    { label: 'Kochi Airport Taxi', href: '/kochi-airport-taxi' },
];

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-6xl font-bold text-teal-900 mb-4">404</h1>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        The page you are looking for doesn&apos;t exist or has been moved.
                        Book your one-way drop taxi from one of our popular routes below.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-teal-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-800 transition-colors mb-12"
                    >
                        Go to Homepage <ArrowRight className="h-5 w-5" />
                    </Link>

                    <div className="mt-12">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Popular Routes</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {popularRoutes.map(route => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
                                >
                                    <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                                    <span className="text-gray-700 font-medium">{route.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 p-5 bg-teal-50 border border-teal-200 rounded-xl">
                        <p className="text-sm text-teal-800">
                            Need help? Call us at{' '}
                            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="font-bold underline">
                                {SUPPORT_PHONE}
                            </a>{' '}
                            — available 24/7
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
