"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

const heroImages = [
    {
        imgUrl: '/assets/images/hero-1.svg',
        alt: 'Smartwatch'
    },
    {
        imgUrl: '/assets/images/hero-2.svg',
        alt: 'Bag'
    },
    {
        imgUrl: '/assets/images/hero-3.svg',
        alt: 'Lamp'
    },
    {
        imgUrl: '/assets/images/hero-4.svg',
        alt: 'Air Fryer'
    },
    {
        imgUrl: '/assets/images/hero-5.svg',
        alt: 'Chair'
    },
]

const HeroCarousel = () => {
    return (
        <div className="hero-carousel">
            <Carousel
                showThumbs={false}
                autoPlay
                infiniteLoop
                interval={2000}
                showArrows={false}
                showStatus={false}
            >
                {heroImages.map((image) => (
                    <Image
                        src={image.imgUrl}
                        alt={image.alt}
                        key={image.alt}
                        width={484}
                        height={484}
                        className='object-contain'
                    />
                ))}
            </Carousel>

            <Image
                src={'assets/icons/hand-drawn-arrow.svg'}
                alt="arrow"
                height={175}
                width={175}
                className=" max-xl:hidden absolute -left-[15%] bottom-10 z-0"
            />
        </div>
    )
}

export default HeroCarousel