"use server";
import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDesc, extractPrice, extractRating } from "../utils";

export async function scrapeAmazonProduct(url: string) {
    if (!url) return;

    //brightdata proxy config
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: "brd.superproxy.io",
        port,
        rejectUnauthorized: false,
    };

    try {
        // fetch product page
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);

        const title = $("#productTitle").text().trim();

        const currentPrice = extractPrice(
            $(".priceToPay span.a-price-whole"),
            $("span.a-size-base.a-color-price"),
            $("a.button-selected.a-color-base")
        );

        // console.log(currentPrice)

        const originalPrice = extractPrice(
            $("#priceblock_ourprice"),
            $(".a-price.a-text-price span.a-offscreen"),
            $("#listPrice"),
            $("#priceblock_dealprice"),
            $(".a-size-base.a-color-price")
        );

        const outOfStock =
            $("#availability span").text().trim().toLowerCase() ===
            "currently unavailable";

        const images =
            $("#imgBlkFront").attr("data-a-dynamic-image") ||
            $("#landingImage").attr("data-a-dynamic-image") ||
            "{}";

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($(".a-price-symbol"));

        const discountRate = $(".reinventPriceSavingsPercentageMargin.savingsPercentage").text().replace(/[-%]/g, "");

        const rating = extractRating($("span.a-size-medium.a-color-base"));

        const desc = extractDesc($(".a-unordered-list.a-vertical.a-spacing-mini"))

        // console.log({
        //     title,
        //     currentPrice: Number(currentPrice),
        //     originalPrice: Number(originalPrice),
        //     outOfStock,
        //     imageUrls,
        //     currency,
        //     discountRate: Number(discountRate),
        //     rating,
        //     desc,
        //     lowestPrice: Number(currentPrice) || Number(originalPrice),
        //     highestPrice: Number(originalPrice) || Number(currentPrice),
        //     averagePrice: Number(currentPrice) || Number(originalPrice),
        // });

        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[1],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            desc,
            rating,
            isOutOfStock: outOfStock,
        }

        // console.log(data)
        return data;
    } catch (error: any) {
        throw new Error(`Failed to scrape product: ${error.message}`);
    }
}
