export interface CpkProvider {
    name: string;
    config?: Record<string, any>;
    coinsSupported: string[] | "any";
    currenciesSupported: string[] | "any";
    getPrice(coin: string, currency: string): Promise<number>;
    getManyPrices(pairs: { coin: string; currency: string }[]): Promise<Record<string, number>>;
}

export type CpkProviderFn = (config?: Record<string, any>) => CpkProvider;
export type CpkProviders = CpkProvider[];

export function defineCpkProvider(provider: CpkProvider): CpkProviderFn {
    return (config?: Record<string, any>) => {
        if (config) provider.config = config;
        return provider;
    };
}
