'use client';

import { useGetProductByProductIdQuery } from '@/features/api/apiSlice';
import { useParams } from 'next/navigation';

export default function ProductPage() {
    const { productId } = useParams() as { productId: string }; // Assuming route is dynamic like /product/[productId]
    const { data: product, isLoading, error } = useGetProductByProductIdQuery(productId);

    if (isLoading) return <div>Loading...</div>;
    if (error || !product) return <div>Product not found</div>;

    return (
        <div className="p-6">
            {/* Top Section: Images */}
            <div className="relative flex gap-8">
                {/* Main Image (75%) */}
                <div className="w-3/4">
                    <img
                        src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + product.media?.[0]?.url}
                        alt="Main Product"
                        className="rounded-xl border h-full w-full"
                    />
                </div>

                {/* Side Images (25%) */}
                <div className="w-1/4 h-full relative flex flex-col gap-8">
                    {product.media?.slice(1, 3).map((media, idx) => (
                        <img
                            key={idx}
                            src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + media.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="rounded-xl border h-1/2"
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-6 flex gap-6">
                {/* Left Column */}
                <div className="w-3/4 pr-6 border-r">
                    {/* Tags, Title, Price */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {product.tags.split(',').map((tag) => (
                            <span key={tag.trim()} className="bg-black px-3 py-1 text-sm text-white rounded-full">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>


                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-black">{product.name}</h2>
                        <div className="flex flex-col items-end">
                            <p className="text-2xl font-bold text-black">${product.listingPrice}</p>
                            <p className="text-red-500 line-through text-lg">${product.originalPrice}</p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="mt-2 font-semibold">
                        Condition: <span className="text-black">{product.condition}</span>
                    </p>

                    {/* Description and Highlights */}
                    <div className="mt-6 flex gap-8">
                        <div className="w-1/2">
                            <h3 className="font-bold text-lg mb-1">Description</h3>
                            <p className="text-gray-700">{product.description}</p>
                        </div>

                        <div className="w-1/2">
                            <h3 className="font-bold text-lg mb-1">Highlights</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                {product.highlights.split(/\r?\n/).map((item, idx) => (
                                    <li key={idx}>{item.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Other Details */}
                    <div className="mt-6 space-y-4">
                        <details>
                            <summary className="cursor-pointer font-semibold text-gray-800 mb-2">Specifications
                            </summary>
                            <p className="text-gray-600">Details about materials, size, etc.</p>
                        </details>
                        <details>
                            <summary className="cursor-pointer font-semibold text-gray-800 mb-2">Shipping</summary>
                            <p className="text-gray-600">Ships within 3–5 business days.</p>
                        </details>
                        <details>
                            <summary className="cursor-pointer font-semibold text-gray-800 mb-2">Returns</summary>
                            <p className="text-gray-600">Returns accepted within 30 days of delivery.</p>
                        </details>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-1/4 flex flex-col gap-4 mt-2">
                    <button className="bg-gray-200 px-4 py-2 rounded-md w-full">Add to cart</button>
                    <button className="border px-4 py-2 rounded-md w-full">Make an offer</button>

                    <div className="mt-6">
                        <h4 className="font-bold">Vendor</h4>
                        <p>📍 Location TBD</p>
                    </div>

                    <div>
                        <p className="text-yellow-500 font-bold">★★★★★</p>
                        <p>4.8 / 5</p>
                    </div>

                    <div>
                        <h4 className="font-semibold">Speedy replies</h4>
                        <p className="text-sm text-gray-600">
                            Vendor reply time varies.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold">Reviews</h4>
                        <p className="text-sm text-gray-600 mb-1">Good service and quality.</p>
                        <p className="text-sm text-gray-600 mb-2">Fast shipping, recommended.</p>
                        <button className="text-blue-600 text-sm underline">All Reviews</button>
                    </div>

                    <button className="mt-4 border px-4 py-2 rounded-md">Ask a Question</button>
                </div>
            </div>
        </div>
    );
}
