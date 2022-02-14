import { defineCpkProvider } from "../src/provider";
import axios from "axios";
import { pairString } from "../src/functions";

export = defineCpkProvider<{ apiKey: string }>((config) => {
    if (!config) throw new Error("CoinMarketCap requires a config object");

    const baseUrl = "https://pro-api.coinmarketcap.com";

    return {
        name: "coinmarketcap",
        coinsSupported: "any",
        currenciesSupported: "any",

        async getPrice(coin, currency) {
            const endpoint = `${baseUrl}/v2/tools/price-conversion`;
            try {
                const { data } = await axios.get(endpoint, {
                    params: {
                        symbol: coin,
                        convert: currency,
                        amount: 1
                    },
                    headers: {
                        "X-CMC_PRO_API_KEY": config.apiKey
                    }
                });

                // Destructure the data
                const quote = data.data[0].quote[currency] as { price: number };

                // Return the price.
                return quote.price;
            } catch (e: any) {
                throw new Error(`Error fetching price from ${endpoint}`);
            }
        },

        async getPrices(pairs) {
            const endpoint = `${baseUrl}/v2/cryptocurrency/quotes/latest`;
            let data: any = undefined;
            const result: Record<string, number> = {};

            try {
                const res = await axios.get(endpoint, {
                    params: {
                        symbol: pairs.map((p) => p.coin).join(","),
                        convert: pairs.map((p) => p.currency).join(",")
                    },
                    headers: {
                        "X-CMC_PRO_API_KEY": config.apiKey
                    }
                });

                data = res.data.data;
            } catch (e: any) {
                console.log(e.response?.data);
            }

            if (!data) throw new Error(`Error fetching price from ${endpoint}`);

            for (const pair of pairs) {
                if (!data.hasOwnProperty(pair.coin)) throw new Error(`Coin ${pair.coin} not found`);
                const items = data[pair.coin] as { quote: Record<string, any> }[];
                const paired = pairString(pair.coin, pair.currency);

                for (const item of items) {
                    if (item.quote.hasOwnProperty(pair.currency)) {
                        result[paired] = item.quote[pair.currency].price;
                    }
                }

                if (!result.hasOwnProperty(paired)) throw new Error(`Pair ${paired} not found`);
            }

            return result;
        }
    };
});
