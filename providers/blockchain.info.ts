import { defineCpkProvider } from "../src/provider";
import axios from "axios";
import { Obj } from "object-collection/exports";

const endpoint = `https://blockchain.info/ticker`;

export default defineCpkProvider(() => ({
    name: "blockchain.info",
    coinsSupported: ["BTC"],
    currenciesSupported: [
        "AUD",
        "BRL",
        "CAD",
        "CHF",
        "CLP",
        "CNY",
        "CZK",
        "DKK",
        "EUR",
        "GBP",
        "HKD",
        "HRK",
        "HUF",
        "INR",
        "ISK",
        "JPY",
        "KRW",
        "NZD",
        "PLN",
        "RON",
        "RUB",
        "SEK",
        "SGD",
        "THB",
        "TRY",
        "TWD",
        "USD"
    ],

    async getPrice(pair, currency, ttl) {
        try {
            const res = await axios.get<
                Record<
                    string,
                    {
                        "15m": number;
                        last: number;
                        buy: number;
                        sell: number;
                        symbol: string;
                    }
                >
            >(endpoint);

            let data = Obj(res.data);
            if (data.has(`${currency}[15m]`)) {
                return data.get<number>(`${currency}[15m]`);
            } else {
            }
        } catch (e) {
            console.log(e);
            throw new Error(`Error fetching price from ${endpoint}`);
        }

        throw new Error(`No data for ${currency} in ${this.name}`);
    },

    async getManyPrices(pairs, ttl) {
        return { "BTC/USD": 535999 };
    }
}));
