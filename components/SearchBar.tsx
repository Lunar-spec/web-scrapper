"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isValidAmazonProductURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;

        // Check if URL from amazon or not
        if (
            hostname.includes("amazon.com") ||
            hostname.includes("amazon.") ||
            hostname.endsWith("amazon")
        ) {
            return true;
        }
        {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValidLink = isValidAmazonProductURL(searchPrompt);

        // alert(isValidLink ? 'valid' : 'invalid')
        if (!isValidLink)
            return alert("Please provide a valid Amazon Product link");

        try {
            setIsLoading(true);

            const product = await scrapeAndStoreProduct(searchPrompt)

        } catch (error) {
            alert('Error please try again')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                className="searchbar-input"
                placeholder="Enter Product Link"
                onChange={(e) => setSearchPrompt(e.target.value)}
            />
            <button
                type="submit"
                className="searchbar-btn"
                disabled={searchPrompt === ''}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    );
};

export default SearchBar;
