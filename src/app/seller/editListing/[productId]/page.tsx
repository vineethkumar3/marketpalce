'use client';

import { useParams } from 'next/navigation';
import SellerProductPage from "@/app/seller/components/SellerProductPage";
import {useGetProductByProductIdQuery} from "@/features/api/apiSlice";

export default function EditListingPage() {
    const { productId } = useParams() as { productId: string };
    const { data: product, isLoading, error } = useGetProductByProductIdQuery(productId);
    if (isLoading) return <div>Loading...</div>;
    if (error || !product) return <div>Product not found</div>;
    if(!isLoading)
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <SellerProductPage productId={productId} />
        </main>
    );
}
