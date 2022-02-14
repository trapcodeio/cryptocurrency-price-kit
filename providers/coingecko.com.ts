import { defineCpkProvider } from "../src/provider";
import axios from "axios";
import { pairString } from "../src/functions";

export = defineCpkProvider(() => {
    return {
        name: "coingecko.com",
        coinsSupported: "any",
        currenciesSupported: [
            "btc",
            "eth",
            "ltc",
            "bch",
            "bnb",
            "eos",
            "xrp",
            "xlm",
            "link",
            "dot",
            "yfi",
            "usd",
            "aed",
            "ars",
            "aud",
            "bdt",
            "bhd",
            "bmd",
            "brl",
            "cad",
            "chf",
            "clp",
            "cny",
            "czk",
            "dkk",
            "eur",
            "gbp",
            "hkd",
            "huf",
            "idr",
            "ils",
            "inr",
            "jpy",
            "krw",
            "kwd",
            "lkr",
            "mmk",
            "mxn",
            "myr",
            "ngn",
            "nok",
            "nzd",
            "php",
            "pkr",
            "pln",
            "rub",
            "sar",
            "sek",
            "sgd",
            "thb",
            "try",
            "twd",
            "uah",
            "vef",
            "vnd",
            "zar",
            "xdr",
            "xag",
            "xau",
            "bits",
            "sats"
        ].map((c) => c.toUpperCase()),

        async getPrice(coin, currency) {
            let data: Record<string, Record<string, number>> = {};

            try {
                const res = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
                );

                data = res.data;
            } catch (e) {
                throw new Error(`Error fetching price for ${coin} in ${currency}`);
            }

            if (!data.hasOwnProperty(coin.toLowerCase())) {
                throw new Error(`Coingecko.com does not support ${coin}`);
            }

            return data[coin.toLowerCase()][currency.toLowerCase()];
        },

        async getPrices(pairs) {
            let data: Record<string, Record<string, number>> = {};
            const result: Record<string, number> = {};

            try {
                const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
                    params: {
                        ids: pairs.map((p) => p.coin).join(","),
                        vs_currencies: pairs.map((p) => p.currency).join(",")
                    }
                });

                data = res.data;
            } catch (e) {
                throw new Error(`Error fetching prices from coingecko.com`);
            }

            for (const pair of pairs) {
                const coinL = pair.coin.toLowerCase();
                const currencyL = pair.currency.toLowerCase();

                if (!data.hasOwnProperty(coinL)) {
                    throw new Error(`Coingecko.com does not support ${pair.coin}`);
                }

                if (!data[coinL].hasOwnProperty(currencyL)) {
                    throw new Error(`Coingecko.com does not support ${pair.currency}`);
                }

                result[pairString(pair.coin, pair.currency)] = data[coinL][currencyL];
            }

            return result;
        }
    };
});
