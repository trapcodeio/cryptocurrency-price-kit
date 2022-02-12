import type { Axios } from "axios";

export interface CpkProvider {
    name: string;
    coinsSupported: string[] | "any";
    currenciesSupported: string[] | "any";

    getPrice(pair: string, currency: string, ttl: string): Promise<number>;
    getManyPrices(pairs: string[], ttl: string): Promise<Record<string, number>>;
}

export type CpkProviderFn = (axios: Axios) => CpkProvider;

export type CpkProviders = CpkProvider[];

export function defineCpkProvider(provider: CpkProviderFn) {
    return provider;
}
