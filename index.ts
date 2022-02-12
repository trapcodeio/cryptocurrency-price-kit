import { CpkProvider, CpkProviderFn, CpkProviders } from "./src/provider";
import axios from "axios";

const Providers: Record<string, CpkProvider> = {};

export class Cpk {
    static useProviders(providerFns: CpkProviderFn[] = []) {
        // Loop and add providers
        for (const fn of providerFns) {
            const provider = fn(axios);
            Providers[provider.name] = provider;
        }

        return this;
    }
}
