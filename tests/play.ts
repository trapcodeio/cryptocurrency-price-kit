import { Cpk } from "../index";
import blockchainInfo from "../providers/blockchain.info";

Cpk.useProviders([blockchainInfo]);

const cpk = new Cpk();

console.log(cpk);
