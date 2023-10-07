"use server";
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return;

    try {
        connectDB();
        const scrapedProduct = await scrapeAmazonProduct(productUrl);

        if (!scrapedProduct) return;

        let product = scrapedProduct;

        // console.log(scrapedProduct)

        const exisitingProduct = await Product.findOne({ url: scrapedProduct.url });

        if (exisitingProduct) {
            const updatedPriceHistory: any = [
                ...exisitingProduct.priceHistory,
                {
                    price: scrapedProduct.currentPrice,
                },
            ];

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            };
        }

        const newProduct = await Product.findOneAndUpdate(
            {
                url: scrapedProduct.url,
            },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/product/${newProduct._id}`);
    } catch (error: any) {
        throw new Error(`Failed to create/ update Product: ${error.message}`);
    }
}

export async function getProductById(productId: string) {
    try {
        connectDB();

        const product = await Product.findOne({ _id: productId });

        if (!product) return null;

        return product;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllProducts() {
    try {
        connectDB();

        const products = await Product.find();

        return products;
    } catch (error) {
        console.log(error)
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        connectDB();

        const currentProduct = await Product.findById(productId);

        if (!currentProduct) return null;

        const similarProducts = await Product.find({
            _id: { $ne: productId },
        }).limit(3)

        return similarProducts;
    } catch (error) {
        console.log(error)
    }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findById(productId);
        console.log(typeof userEmail)
        console.log(userEmail.trim())

        if (!product) return;

        const userExists = product.users.some((user: User) => user.email === userEmail);

        if (!userExists) {
            const updatedUsers = product.users.concat({ email: userEmail });
            product.users = updatedUsers;

            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");

            await sendEmail(emailContent, [userEmail]);
        }
        // return console.log('Already there')
    } catch (error) {
        console.log(error);
    }
}