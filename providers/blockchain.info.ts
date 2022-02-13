import { defineCpkProvider } from "../src/provider";
import axios from "axios";
import { Obj } from "object-collection/exports";

const endpoint = "https://blockchain.info/ticker";
type endpointResponse = Record<
    string,
    {
        "15m": number;
        last: number;
        buy: number;
        sell: number;
        symbol: string;
    }
>;

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

    async getPrice(pair, currency) {
        try {
            // Get data from endpoint
            const res = await axios.get<endpointResponse>(endpoint);

            // Use object-collection to get the price
            let data = Obj(res.data);

            if (data.has(`${currency}[15m]`)) {
                return data.get<number>(`${currency}[15m]`);
            }
        } catch (e: any) {
            throw new Error(`Error fetching price from ${endpoint}`);
        }

        throw new Error(`No data for ${currency} in ${this.name}`);
    },

    async getPrices(pairs) {
        const result: Record<string, number> = {};

        try {
            const res = await axios.get<endpointResponse>(endpoint);

            let data = Obj(res.data);

            for (let pair of pairs) {
                const { coin, currency } = pair;
                if (data.has(`${currency}[15m]`)) {
                    result[coin + "/" + currency] = data.get<number>(`${currency}[15m]`);
                }
            }
        } catch (e) {
            console.log(e);
            throw new Error(`Error fetching price from ${endpoint}`);
        }

        return result;
    }
}));
