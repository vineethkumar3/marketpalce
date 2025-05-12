import {useState, useEffect} from "react";
import {
    useCreateProductMutation,
    useGetProductByProductIdQuery,
    useUpdateProductMutation
} from '@/features/api/apiSlice';

interface FormData {
    productName: string;
    category: string;
    description: string;
    quantity: number | '';
    condition: string | '';
    originalPrice: number | '';
    listingPrice: number | '';
    additionalDetails: string;
    highlights: string;
    shippingOption: string | '';
    tags: string;
    photos: File[];
    enabled: boolean;
}

interface FormErrors {
    [key: string]: string;
}

interface ListNewProductProps {
    productId?: string
}

const SellerProductPage = ({productId}: ListNewProductProps) => {
    const [createListing] = useCreateProductMutation();
    const [updateListing] = useUpdateProductMutation();


    const {data: existingProduct, isLoading: loadingProduct} = useGetProductByProductIdQuery(productId || '', {
        skip: !productId,
    });

    const [formData, setFormData] = useState<FormData>({
        productName: '',
        category: '',
        description: '',
        quantity: '',
        condition: '',
        originalPrice: '',
        listingPrice: '',
        additionalDetails: '',
        highlights: '',
        shippingOption: '',
        tags: '',
        photos: [],
        enabled: true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [images, setImages] = useState<File[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        async function loadExistingImages() {
            if (existingProduct?.media?.length) {
                const fetchedFiles = await Promise.all(
                    existingProduct.media.map(async (mediaItem) => {
                        const response = await fetch(mediaItem.url.startsWith('http')
                            ? mediaItem.url
                            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${mediaItem.url}`
                        );
                        const blob = await response.blob();
                        const fileName = mediaItem.url.split('/').pop() || `media-${Date.now()}`;
                        return new File([blob], fileName, {type: blob.type});
                    })
                );
                setImages(fetchedFiles);
            }
        }

        if (existingProduct) {
            setFormData({
                productName: existingProduct.name,
                category: existingProduct.category,
                description: existingProduct.description,
                quantity: existingProduct.quantity,
                condition: existingProduct.condition,
                originalPrice: existingProduct.originalPrice,
                listingPrice: existingProduct.listingPrice,
                additionalDetails: JSON.parse(existingProduct.additionalInfo).note || '',
                highlights: existingProduct.highlights,
                shippingOption: existingProduct.shipping,
                tags: existingProduct.tags,
                photos: [],
                enabled: existingProduct.enabled ?? true,
            });

            setTags(existingProduct.tags.split(',').map((t: string) => t.trim()).filter(Boolean));

            // ⬇️ Load media files
            loadExistingImages();
        }
    }, [existingProduct]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, files} = e.target as HTMLInputElement;
        if (name === 'photos' && files) {
            setFormData({...formData, [name]: Array.from(files)});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages([...images, ...newFiles]);
        }
    };
    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: FormErrors = {};
        if (!formData.productName) newErrors.productName = 'Product name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.condition) newErrors.condition = 'Condition is required';
        if (formData.quantity === '' || isNaN(Number(formData.quantity)) || formData.quantity < 1) {
            newErrors.quantity = 'Quantity must be a valid number';
        }
        if (formData.originalPrice === '' || isNaN(Number(formData.originalPrice))) {
            newErrors.originalPrice = 'Original price must be a valid number';
        }
        if (formData.listingPrice === '' || isNaN(Number(formData.listingPrice))) {
            newErrors.listingPrice = 'Listing price must be a valid number';
        }
        if (!formData.highlights) newErrors.highlights = 'Highlights is required';
        if (!formData.shippingOption) newErrors.shippingOption = 'Shipping Option is required';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log(errors);
            return;
        }

        const form = new FormData();
        form.append('name', formData.productName);
        form.append('category', formData.category);
        form.append('description', formData.description);
        form.append('quantity', formData.quantity.toString());
        form.append('originalPrice', formData.originalPrice.toString());
        form.append('listingPrice', formData.listingPrice.toString());
        form.append('condition', formData.condition);
        form.append('highlights', formData.highlights);
        form.append('shipping', formData.shippingOption);
        form.append('tags', tags.join(','));
        form.append('additionalInfo', JSON.stringify({note: formData.additionalDetails}));
        form.append('sellerId', '4927778f-dfb9-4854-867f-870506808578'); // hardcoded seller for now
        form.append('enabled', formData.enabled? 'true': 'false');

        if (productId) {
            form.append('productId', productId);
        }

        for (const image of images) {
            form.append('media', image);
        }

        try {
            if (productId) {
                console.log(form);
                await updateListing(form).unwrap();
                alert('Product updated successfully!');
            } else {
                await createListing(form).unwrap();
                alert('Product created successfully!');
            }
        } catch (error) {
            console.error('Submit failed:', error);
            alert('Something went wrong.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                setTags([...tags, input.trim()]);
            }
            setInput('');
        } else if (e.key === 'Backspace' && !input && tags.length) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const inputStyle = "w-full h-[46px] p-2 rounded-[6px] border border-[#D9D9D9] text-black placeholder-[#7D7D7D]";
    const labelStyle = "block font-semibold font-Montserrat text-black text-[18px] mb-[10px]";
    const errorStyle = "text-red-500 text-sm mt-1";

    if (loadingProduct && productId) {
        return <div>Loading product details...</div>;
    }

    return (
        <section className="bg-white p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-[27px]">
                    <div>
                        <label className={labelStyle}>Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            placeholder="Give your product a clear, descriptive name that stands out."
                            className={inputStyle}
                        />
                        {errors.productName && <p className={errorStyle}>{errors.productName}</p>}
                    </div>

                    <div>
                        <label className={labelStyle}>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Choose a category to help customers find your product."
                            className={inputStyle}
                        />
                        {errors.category && <p className={errorStyle}>{errors.category}</p>}
                    </div>

                    <div>
                        <label className={labelStyle}>Product Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide a detailed and engaging description. Highlight key features, materials, benefits, or unique selling points."
                            className="w-full h-[137px]  p-2 rounded-[6px] border border-[#D9D9D9] text-black placeholder-[#7D7D7D]"
                        />
                        {errors.description && <p className={errorStyle}>{errors.description}</p>}
                    </div>

                    <div>
                        <label className={labelStyle}>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    quantity: e.target.value === '' ? '' : parseInt(e.target.value)
                                })
                            }
                            placeholder="Enter some quantity"
                            className={inputStyle}
                        />
                        {errors.quantity && <p className={errorStyle}>{errors.quantity}</p>}
                    </div>

                    <div>
                        <label className={labelStyle}>Condition</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option value="" disabled>What condition is it in?</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                        {errors.condition && <p className={errorStyle}>{errors.condition}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className={labelStyle}>Original Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        originalPrice: e.target.value === '' ? '' : parseFloat(e.target.value)
                                    })
                                }
                                className={inputStyle}
                                placeholder="$0"
                            />
                            {errors.originalPrice && <p className={errorStyle}>{errors.originalPrice}</p>}
                        </div>
                        <div className="flex-1">
                            <label className={labelStyle}>Listing Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="listingPrice"
                                value={formData.listingPrice}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        listingPrice: e.target.value === '' ? '' : parseFloat(e.target.value)
                                    })
                                }
                                className={inputStyle}
                                placeholder="$0"
                            />
                            {errors.listingPrice && <p className={errorStyle}>{errors.listingPrice}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelStyle}>Additional Details</label>
                        <input
                            type="text"
                            name="additionalDetails"
                            value={formData.additionalDetails}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>
                </div>

                {/* Right half */}
                <div className="space-y-[27px]">
                    <div>
                        <label className={labelStyle}>Photos & Videos</label>
                        <div className="flex gap-2 flex-wrap">
                            {images.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`thumb-${index}`}
                                        className="w-[130px] h-[130px] rounded border object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute w-[130px] h-[130px] top-0 bg-red-900 text-white text-8xl opacity-0 group-hover:opacity-50"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label
                                className="w-[131px] h-[130px] border border-gray-300 rounded flex items-center justify-center cursor-pointer bg-white">
                                <span className="material-icons-outlined text-gray-500 text-8xl">+</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                    </div>

                    <div>
                        <label className={labelStyle}>Highlights</label>
                        <textarea
                            name="highlights"
                            value={formData.highlights}
                            onChange={handleChange}
                            placeholder="Add highlight key features, materials, benefits, or USPs for the products."
                            className="w-full h-30 p-2 rounded-[6px] border border-[#D9D9D9] text-black placeholder-[#7D7D7D]"
                        />
                        {errors.highlights && <p className={errorStyle}>{errors.highlights}</p>}
                    </div>

                    <div>
                        <label className={labelStyle}>Shipping Option</label>
                        <select
                            name="shippingOption"
                            value={formData.shippingOption}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option value="" disabled>Select your shipping option from the list.</option>
                            <option value="standard">Standard Shipping</option>
                            <option value="express">Express Shipping</option>
                        </select>
                        {errors.shippingOption && <p className={errorStyle}>{errors.shippingOption}</p>}

                    </div>

                    <div>
                        <label className={labelStyle}>Tags</label>
                        <div
                            className="w-full h-[46px] border border-[#D9D9D9] bg-white rounded-[6px] px-2 flex items-center flex-wrap gap-2 overflow-y-auto">
                            {tags.map((tag, index) => (
                                <div key={index}
                                     className="bg-[#2D2B35] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="text-white hover:text-gray-300 focus:outline-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type and press Enter"
                                className="flex-1 min-w-[100px] border-none focus:outline-none text-sm text-black"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <label className="flex items-center gap-2 text-black text-[16px] font-semibold">
                            <input
                                type="checkbox"
                                name="enabled"
                                checked={formData.enabled}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        enabled: e.target.checked,
                                    })
                                }
                                className="w-5 h-5"
                            />
                            Enabled
                        </label>
                        <button
                            type="submit"
                            className="!bg-gray-700 !text-white !px-4 !py-2 !rounded !hover:bg-gray-800 !w-full !max-w-xs !block"
                        >
                            Save your item
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default SellerProductPage;
