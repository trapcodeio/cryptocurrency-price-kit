import { CpkProvider, CpkProviderFn } from "./src/provider";
import cache from "./src/cache";

const Providers: Record<string, CpkProvider> = {};

export class Cpk {
    public provider: CpkProvider;
    public cache: boolean = true;

    static useProviders(providerFns: (CpkProvider | CpkProviderFn)[] = []) {
        // Loop and add providers
        for (const fn of providerFns) {
            if (typeof fn === "function") {
                const provider = fn();
                Providers[provider.name] = provider;
            } else {
                Providers[fn.name] = fn;
            }
        }

        return this;
    }

    /**
     * ===============================================
     * Instance Methods
     * ===============================================
     */
    constructor(providerName: string) {
        if (!Providers[providerName]) {
            throw new Error(`Provider (${providerName}) not found`);
        }

        this.provider = Providers[providerName];
    }

    /**
     * Disable cache
     */
    disableCache() {
        this.cache = false;
        return this;
    }

    /**
     * Get a single pair
     * @param pair
     * @param ttl
     */
    async get(pair: string, ttl: number = 60) {
        const [coin, currency] = this.parsePair(pair);

        // if cache is enabled, check cache first
        if (this.cache)
            return cache.getOrSetAsync(pair, () => this.provider.getPrice(coin, currency), ttl);

        return this.provider.getPrice(coin, currency);
    }

    async getMany(pairs: string[], ttl: number = 60) {
        const results: Record<string, number> = {};
        const pairsNotInCache: string[] = [];

        // if cache is enabled, check cache first
        if (this.cache) {
            for (const pair of pairs) {
                if (cache.has(pair)) results[pair] = cache.get(pair);
                else pairsNotInCache.push(pair);
            }
        }

        const data: { coin: string; currency: string }[] = [];

        for (const pair of this.cache ? pairsNotInCache : pairs) {
            const [coin, currency] = this.parsePair(pair);
            data.push({ coin, currency });
        }

        const prices = await this.provider.getManyPrices(data);
        if (this.cache) {
            for (const pair of Object.keys(prices)) cache.set(pair, prices[pair], ttl);
        }

        return prices;
    }

    /**
     * ===============================================
     * Private Methods
     * ===============================================
     */

    /***
     * Parse a pair of string into an array
     * This function also validates the pair
     * Checks if the coin/currency is supported
     * @param pair
     * @private
     */
    private parsePair(pair: string) {
        pair = pair.toUpperCase();

        let [coin, currency] = pair.split("/");
        if (!currency) currency = "USD";

        // Check if coin is in the provider
        if (
            this.provider.coinsSupported !== "any" &&
            !this.provider.coinsSupported.includes(coin)
        ) {
            throw new Error(`Coin (${coin}) not supported in provider: ${this.provider.name}`);
        }

        // Check if currency is in the provider
        if (
            this.provider.coinsSupported !== "any" &&
            !this.provider.currenciesSupported.includes(currency)
        ) {
            throw new Error(
                `Currency (${currency}) not supported in provider: ${this.provider.name}`
            );
        }

        console.log(this.provider.config);

        // check if coin exists in the provider
        return [coin, currency];
    }
}
