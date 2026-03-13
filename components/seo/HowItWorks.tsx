import { MapPin, Car, CreditCard } from 'lucide-react';

const steps = [
    {
        step: 1,
        icon: MapPin,
        title: 'Enter Pickup & Drop',
        desc: 'Enter your pickup city, drop city, travel date, and time. Get an instant fare estimate — no signup required.',
    },
    {
        step: 2,
        icon: Car,
        title: 'Choose Vehicle & Confirm',
        desc: 'Select from our fleet — Hatchback, Sedan, SUV, or Innova Crysta. Confirm your booking in 30 seconds.',
    },
    {
        step: 3,
        icon: CreditCard,
        title: 'Travel & Pay',
        desc: 'Your verified driver arrives at your doorstep. Travel comfortably and pay via Cash, UPI, or Card at the end.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 bg-gray-50" aria-label="How to book a taxi">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Book Your One-Way Taxi in 3 Simple Steps
                    </h2>
                    <p className="text-lg text-gray-600">
                        No app download needed. Book online in 30 seconds or call us 24/7.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map(({ step, icon: Icon, title, desc }) => (
                        <div key={step} className="relative text-center group">
                            {/* Connector line (hidden on mobile, shown on md+) */}
                            {step < 3 && (
                                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-300 to-teal-100"></div>
                            )}

                            <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-2xl mb-5 group-hover:bg-teal-600 transition-colors duration-300">
                                <Icon className="h-8 w-8 text-teal-700 group-hover:text-white transition-colors" />
                                <span className="absolute -top-2 -right-2 w-7 h-7 bg-teal-900 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                    {step}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-600 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
