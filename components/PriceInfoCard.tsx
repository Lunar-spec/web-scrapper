import Image from "next/image";
import React from "react";

interface Props {
    title: string;
    iconSrc: string;
    value: string;
}

const PriceInfoCard = ({ title, iconSrc, value }: Props) => {

    const borderSideColor = title === "Current Price"
        ? "border-l-[#b6dbff]"
        : title === "Average Price"
            ? "border-l-[#d7bde2]"
            : title === "Highest Price"
                ? "border-l-[#fcc]"
                : title === "Lowest Price"
                    ? "border-l-[#beffc5]"
                    : "border-l-[#b6dbff]"

    return (
        <div
            className={`price-info_card ${borderSideColor} hover:bg-black/10 transition-all duration-300 ease-out`}
        >
            <p className="text-base text-black-100">{title}</p>

            <div className="flex gap-1">
                <Image src={iconSrc} alt={title} width={24} height={24} />

                <p className="text-2xl font-bold text-secondary">{value}</p>
            </div>
        </div>
    );
};

export default PriceInfoCard;
