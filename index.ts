import { CpkProvider, CpkProviderFn } from "./src/provider";
import Cache from "./src/cache";
import { pairString } from "./src/functions";

const Providers: Record<string, CpkProvider> = {};

export class Cpk {
    public provider: CpkProvider;
    public useCache: boolean = true;
    public cache?: Cache;
    public currency: string = "USD";

    static useProviders(providers: Array<CpkProvider | CpkProviderFn<any>> = []) {
        // Loop and add providers
        for (const fn of providers) {
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
        providerName = providerName.toLowerCase();

        if (!Providers[providerName]) {
            throw new Error(`Provider (${providerName}) not found`);
        }

        if (this.useCache) {
            this.cache = new Cache({
                prefix: providerName
            });
        }

        this.provider = Providers[providerName];
    }

    /**
     * Disable useCache
     */
    disableCache() {
        this.useCache = false;
        this.cache = undefined;
        return this;
    }

    /**
     * Set currency
     */
    setCurrency(currency: string) {
        currency = currency.toUpperCase();

        // Check if currency is in the provider
        if (
            this.provider.coinsSupported !== "any" &&
            !this.provider.currenciesSupported.includes(currency)
        ) {
            throw new Error(
                `Currency (${currency}) not supported in provider: ${this.provider.name}`
            );
        }

        this.currency = currency;
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
            return this.cache.getOrSetAsync(
                pairString(coin, currency),
                () => this.provider.getPrice(coin, currency),
                ttl
            );

        return this.provider.getPrice(coin, currency);
    }

    async getMany(pairs: string[], ttl: number = 60) {
        let results: Record<string, number> = {};
        const pairsNotInCache: string[] = [];

        // if cache is enabled, check cache first
        if (this.cache) {
            for (const pair of pairs) {
                const [, , paired] = this.parsePair(pair);
                if (this.cache.has(paired)) {
                    results[paired] = this.cache.get(paired);
                } else {
                    pairsNotInCache.push(paired);
                }
            }
        }

        const data: { coin: string; currency: string }[] = [];

        for (const pair of this.cache ? pairsNotInCache : pairs) {
            const [coin, currency] = this.parsePair(pair);
            data.push({ coin, currency });
        }

        if (data.length) {
            const prices = await this.provider.getPrices(data);
            if (this.cache) {
                for (const pair of Object.keys(prices)) this.cache.set(pair, prices[pair], ttl);
            }

            results = Object.assign(results, prices);
        }

        return results;
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
        if (!currency) currency = this.currency;

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

        // check if coin exists in the provider
        return [coin, currency, pairString(coin, currency)];
    }
}
