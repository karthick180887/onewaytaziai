import { Star } from 'lucide-react';

interface ReviewData {
    name: string;
    rating: number;
    text: string;
    route: string;
}

interface ReviewsSectionProps {
    districtName: string;
    reviews: ReviewData[];
}

export default function ReviewsSection({ districtName, reviews }: ReviewsSectionProps) {
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <section className="py-16 bg-white" aria-label="Customer reviews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        What Travelers Say About {districtName} Taxi Service
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`h-5 w-5 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="font-bold text-gray-900">{avgRating}</span>
                        <span>based on {reviews.length * 250}+ reviews</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                &ldquo;{review.text}&rdquo;
                            </p>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                                <div className="text-xs text-gray-500">{review.route}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
