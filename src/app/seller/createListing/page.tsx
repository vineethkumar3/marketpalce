'use client'

import SellerProductPage from "@/app/seller/components/SellerProductPage";

export default function CreateListingPage() {
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
            <SellerProductPage />
        </main>
    );
}