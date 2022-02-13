export interface CpkProvider {
    name: string;
    coinsSupported: string[] | "any";
    currenciesSupported: string[] | "any";

    getPrice(coin: string, currency: string): Promise<number>;

    getManyPrices(pairs: { coin: string; currency: string }[]): Promise<Record<string, number>>;
}

export type CpkProviderFn<Config = Record<string, any>> = (config?: Config) => CpkProvider;

export function defineCpkProvider<Config = Record<string, any>>(fn: CpkProviderFn<Config>) {
    return function (config: Config) {
        return fn(config);
    };
}
