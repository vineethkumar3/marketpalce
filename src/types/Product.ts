export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    originalPrice: number;
    listingPrice: number;
    condition: string;
    highlights: string;
    shipping: string;
    tags: string;
    additionalInfo: string;
    enabled: boolean;
    sellerId: string;
    media: Media[];
}
export interface Media {
    id: string;
    url: string;
    productId: string;
}
