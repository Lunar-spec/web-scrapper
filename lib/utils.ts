export function extractPrice(...elements: any) {
    for (const element of elements) {
        const priceText = element.text().trim();

        if (priceText) {
            const cleanPrice = priceText.replace(/[^\d.]/g, "");

            let firstPrice;

            if (cleanPrice) {
                firstPrice = cleanPrice.match(/\d+\:\d{2}/)?.[0];
            }

            return firstPrice || cleanPrice;
        }
    }

    return "";
}

export function extractCurrency(element: any) {
    const currencyText = element.text().trim().slice(0, 1);
    return currencyText ? currencyText : "";
}

export function extractDesc(element: any) {
    const desc = element.text().trim();
    const sentences = desc.split(". ");

    const formattedDesc = sentences
        .map((sentence: any) => {
            return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim();
        })
        .join("\n");

    return formattedDesc;
}

export function extractRating(element: any) {
    const text = element.text().trim();

    const match = text.match(/(\d+(\.\d+)?)\sout\sof\s5/);

    if (match) {
        return match[1];
    } else {
        return "No rating";
    }
}
