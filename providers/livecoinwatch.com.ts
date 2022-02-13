import { defineCpkProvider } from "../src/provider";
import axios from "axios";

export = defineCpkProvider<{ apiKey: string }>((config) => {
    if (!config) throw new Error("LiveCoinWatch requires a config object");

    return {
        name: "livecoinwatch.com",
        coinsSupported: "any",
        /**
         * Gotten from https://livecoinwatch.github.io/lcw-api-docs/?javascript#fiatsall
         */
        currenciesSupported: [
            "PAB",
            "AZN",
            "CUC",
            "KRW",
            "MUR",
            "BOB",
            "BGN",
            "AOA",
            "ARS",
            "ETB",
            "TWD",
            "CAD",
            "HKD",
            "GIP",
            "GTQ",
            "MKD",
            "BBD",
            "GGP",
            "NIO",
            "BZD",
            "LAK",
            "JMD",
            "GEL",
            "MZN",
            "KWD",
            "NAD",
            "SRD",
            "XAF",
            "GMD",
            "DKK",
            "LKR",
            "NOK",
            "PGK",
            "RUB",
            "CHF",
            "EUR",
            "AUD",
            "BND",
            "NZD",
            "AFN",
            "DJF",
            "COP",
            "CZK",
            "JEP",
            "BIF",
            "KGS",
            "BRL",
            "AWG",
            "ISK",
            "MYR",
            "PEN",
            "EGP",
            "HRK",
            "IMP",
            "LRD",
            "USD",
            "BYN",
            "ERN",
            "CLP",
            "BHD",
            "LBP",
            "KMF",
            "SAR",
            "GYD",
            "AMD",
            "HNL",
            "KZT",
            "KHR",
            "QAR",
            "GBP",
            "IDR",
            "MDL",
            "ILS",
            "SGD",
            "ALL",
            "BTN",
            "CUP",
            "FJD",
            "BDT",
            "PLN",
            "NGN",
            "SLL",
            "ZMW",
            "BSD",
            "BYR",
            "CNY",
            "CVE",
            "HUF",
            "LYD",
            "BMD",
            "FKP",
            "IRR",
            "HTG",
            "KPW",
            "INR",
            "JPY",
            "UAH",
            "BAM",
            "AED",
            "BWP",
            "CLF",
            "DOP",
            "GHS",
            "GNF",
            "LTL",
            "LSL",
            "MRO",
            "MNT",
            "OMR",
            "TTD",
            "PHP",
            "ANG",
            "CRC",
            "CDF",
            "KES",
            "DZD",
            "LVL",
            "MOP",
            "STD",
            "MMK",
            "PYG",
            "MVR",
            "SZL",
            "TND",
            "RON",
            "TMT",
            "XAU",
            "SVC",
            "XPF",
            "MGA",
            "SDG",
            "SBD",
            "ZAR",
            "SCR",
            "YER",
            "XCD",
            "MXN",
            "RWF",
            "TRY",
            "SEK",
            "TZS",
            "NPR",
            "VND",
            "SYP",
            "IQD",
            "JOD",
            "ZWL",
            "WST",
            "RSD",
            "SHP",
            "UZS",
            "VUV",
            "MAD",
            "SOS",
            "TOP",
            "THB",
            "UYU",
            "XOF",
            "XAG",
            "VEF",
            "UGX",
            "ZMK",
            "XDR",
            "TJS",
            "MWK",
            "PKR"
        ],

        async getPrice(coin, currency) {
            try {
                type Response = { rate: number };
                const { data } = await axios.post<Response>(
                    "https://api.livecoinwatch.com/coins/single",
                    { currency, code: coin, meta: true },
                    { headers: { "x-api-key": config.apiKey } }
                );

                return data.rate;
            } catch (e) {
                throw new Error("Error fetching price");
            }
        },

        async getPrices(pairs) {
            const result: Record<string, number> = {};
            const tasks = [];

            for (const pair of pairs) {
                tasks.push(
                    new Promise(async (resolve) => {
                        const price = await this.getPrice(pair.coin, pair.currency);
                        result[pair.coin + "/" + pair.currency] = price;
                        resolve(price);
                    })
                );
            }

            // Run all tasks
            await Promise.all(tasks);

            return result;
        }
    };
});
