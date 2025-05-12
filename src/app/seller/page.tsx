'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const MarketPlaceLogin: React.FC = () => {
    const router = useRouter();

    const handleButtonClick = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        router.push(path);
    };

    return (
        <section className="w-full bg-white flex flex-col items-center">
            {/* Hero Section */}
            <div
                className="w-full h-screen bg-cover bg-center relative flex items-center justify-center text-white text-center"
                style={{ backgroundImage: "url('/MarketPlace/MPbackground.webp')" }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 px-6">
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 drop-shadow-md">Holiday World</h1>
                    <p className="text-lg md:text-xl max-w-xl mx-auto mb-6 drop-shadow-sm">
                        Discover, Buy and Sell Holiday Treasures Around the Globe
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => router.push('/signup')}
                            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-full text-sm font-semibold text-white shadow-lg min-w-72"
                        >
                            CREATE AN ACCOUNT
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="border border-white hover:bg-white hover:text-black px-6 py-2 rounded-full text-sm font-semibold shadow-lg min-w-72"
                        >
                            LOGIN
                        </button>
                    </div>
                </div>
            </div>

            {/* Why Sell Section */}
            <div className="text-center py-16 px-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Why Sell On Holiday World?</h2>
                <p className="text-gray-900 max-w-3xl mx-auto mb-10 text-md md:text-lg">
                    Holiday World is a hub for sharing traditions and unique holiday treasures. Whether you&aposre buying or selling, our platform offers a curated space dedicated to holiday-themed items. Celebrate the joy of holidays year-round with a community that shares your passion for festive traditions and unique finds!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                    {[
                        { label: 'Ease of Use', icon: '/MarketPlace/MPeaseofuse.webp' },
                        { label: 'Transparent Pricing', icon: '/MarketPlace/MPdollarsign.webp' },
                        { label: 'Global Reach', icon: '/MarketPlace/MPglobalreach.webp' },
                        { label: 'Marketing Boost', icon: '/MarketPlace/MPmarketingboost.webp' },
                        { label: 'Promotional Tools', icon: '/MarketPlace/MPmegaphone.webp' },
                        { label: 'Trust and Credibility', icon: '/MarketPlace/MPtrustandcred.webp' }
                    ].map(({ label, icon }, index) => (
                        <div key={index} className="flex flex-col items-center text-sm">
                            <Image src={icon} alt={label} width={48} height={48} className="mb-3" />
                            <span className="text-gray-800 font-medium text-center">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps Section */}
            <div className="w-full bg-white px-6 md:px-12 xl:px-0 xl:max-w-5xl">
                {[
                    {
                        step: 1,
                        title: 'Create An Account',
                        text: 'Join us in just a few steps! Create your account to access personalized experiences, exclusive content, and seamless interaction.',
                        button: 'SIGN UP',
                        image: '/MarketPlace/MPcreateaccount.webp',
                        link: '/signup'
                    },
                    {
                        step: 2,
                        title: 'List Your Product',
                        text: 'Bring your product to life by adding images and a description! List it now to reach a broader audience and connect with potential customers.',
                        button: 'Start Selling',
                        image: '/MarketPlace/MPlistyourproduct.webp',
                        link: 'seller/newListing'
                    },
                    {
                        step: 3,
                        title: 'Ship Your Product',
                        text: 'Package your holiday goods securely and ship them to excited buyers around the world. We provide tools to ensure a smooth, hassle-free delivery.',
                        button: 'Fulfill Orders',
                        image: '/MarketPlace/MPshipyourproduct.webp',
                        link: '/orders'
                    },
                    {
                        step: 4,
                        title: 'Receive Payment',
                        text: 'Receive secure payments directly to your account. Get paid quickly and securely once your item is sold, with multiple payment options to suit your needs.',
                        button: 'Earn Money',
                        image: '/MarketPlace/MPreceivepayment.webp',
                        link: '/payment'
                    }
                ].map(({ step, title, text, button, image, link }) => (
                    <div
                        key={step}
                        className={`flex flex-col ${step % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center my-12 gap-6`}
                    >
                        <div className="relative w-full md:w-1/2 flex justify-center">
                            <div className={`absolute -top-4 -left-4 w-[280px] h-[164px] md:w-[560px] md:h-[328px] bg-[#5dcced] rounded-xl z-0`}
                                 style={{
                                     clipPath: step % 2 === 0
                                         ? 'polygon(0 0, 100% 0, 100% 20%, 100% 20%, 100% 100%, 0 100%)'
                                         : 'polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%)'
                                 }}
                            ></div>
                            <Image
                                src={image}
                                alt={title}
                                width={560}
                                height={328}
                                className="relative w-[280px] h-[164px] md:w-[560px] md:h-[328px] object-cover rounded-xl z-10"
                            />
                        </div>
                        <div className="w-full md:w-1/2 text-left">
                            <h3 className="text-4xl font-bold text-gray-800 mb-1">{step}</h3>
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{title}</h4>
                            <p className="text-gray-600 mb-4 text-sm md:text-base">{text}</p>
                            <button
                                className="text-[#EAB308] underline font-semibold text-sm md:text-base"
                                onClick={(e) => handleButtonClick(e, link)}
                            >
                                {button}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MarketPlaceLogin;
