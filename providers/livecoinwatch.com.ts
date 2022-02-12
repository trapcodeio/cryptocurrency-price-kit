import { defineCpkProvider } from "../src/provider";

export default defineCpkProvider({
    name: "livecoinwatch.com",

    coinsSupported: "any",
    currenciesSupported: "any",

    async getPrice(coin, currency) {
        return 0;
    },

    async getManyPrices(pairs) {
        return { "BTC/USD": 0, "ETH/USD": 0, "LTC/USD": 0 };
    }
});
