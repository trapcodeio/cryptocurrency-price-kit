import test from "japa";
import { Env } from "@xpresser/env";
import { Cpk } from "../index";
// import BlockchainInfo from "../providers/blockchain.info";
// import CoinGecko from "../providers/coingecko.com";
import LiveCoinWatch from "../providers/livecoinwatch.com";

const env = Env(__dirname, {
    LIVECOINWATCH_API_KEY: Env.is.string()
});

// Add Providers
Cpk.useProviders([
    // BlockchainInfo, // supports bitcoin only
    // CoinGecko, // supports almost all coins
    LiveCoinWatch({ apiKey: env.LIVECOINWATCH_API_KEY }) // supports almost all coins
]);

test.group("LiveCoinWatch", (g) => {
    g.timeout(10000);
    const livecoinwatch = new Cpk("livecoinwatch.com");

    test("Get BTC/USD", async (assert) => {
        const price = await livecoinwatch.get("BTC/USD");
        assert.isAbove(Number(price), 0);
    });

    test("Get Many", async (assert) => {
        const currencies = ["BTC", "ETH", "BNB", "ADA"];
        const prices = await livecoinwatch.getMany(currencies, 120);
        assert.isObject(prices);
        assert.hasAllKeys(prices, ["BTC/USD", "ETH/USD", "BNB/USD", "ADA/USD"]);
    });

    test("Get Many with a different currency", async (assert) => {
        const currencies = ["BTC", "ETH", "BNB", "ADA"].map((c) => c + "/EUR");
        const prices = await livecoinwatch.getMany(currencies, 120);
        assert.isObject(prices);
        assert.hasAllKeys(prices, ["BTC/EUR", "ETH/EUR", "BNB/EUR", "ADA/EUR"]);
    });

    test("Get Many with multiple currencies", async (assert) => {
        const currencies = ["BTC/USD", "BTC/EUR", "ETH/USD", "ETH/EUR", "BNB/USD", "ADA/EUR"];
        const prices = await livecoinwatch.getMany(currencies, 120);
        assert.isObject(prices);
        assert.hasAllKeys(prices, currencies);
    });
});
