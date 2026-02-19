'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    districtName: string;
    serviceLabel: string;
    faqs: FAQ[];
}

export default function FAQSection({ districtName, serviceLabel, faqs }: FAQSectionProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        {districtName} {serviceLabel} — Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about booking a {serviceLabel.toLowerCase()} from {districtName}
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-teal-200"
                        >
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left"
                                aria-expanded={openIdx === idx}
                            >
                                <h3 className="text-base font-semibold text-gray-900 pr-4">{faq.question}</h3>
                                <ChevronDown
                                    className={`h-5 w-5 text-teal-700 shrink-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIdx === idx ? 'max-h-96 pb-5' : 'max-h-0'
                                    }`}
                            >
                                <p className="px-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
