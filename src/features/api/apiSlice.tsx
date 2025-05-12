import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {Product} from "@/types/Product";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    }),
    endpoints: (builder) => ({
        createProduct: builder.mutation<{ productId: string }, FormData>({
            query: (form) => ({
                url: 'products/changeProductListing',
                method: 'POST',
                body: form,
            }),
        }),
        updateProduct: builder.mutation<{ productId: string }, FormData>({
            query: (formData) => ({
                url: 'products/changeProductListing',   // you must create this route in your backend
                method: 'POST',
                body: formData,
            }),
        }),
        getProductByProductId: builder.query<Product, string>({
            query: (productId) => ({
                url: `products/getProduct/${productId}`,
                method: 'GET',
            }),
        }),
        getProductsBySeller: builder.query<Product[], void>({
            query: () => ({
                url: 'products',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useCreateProductMutation,
    useGetProductByProductIdQuery,
    useGetProductsBySellerQuery,
    useUpdateProductMutation
} = apiSlice;