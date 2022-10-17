import { Builder } from './builder';
import { WalletData } from "./EthUtils";
export declare class EthereumBuilder extends Builder {
    data: WalletData;
    constructor(pub: any, path: any, provider: any);
    init: () => Promise<this>;
    show: () => Promise<any>;
    createTransaction(targetAddress: any, value: number, { ...params }?: {}): Promise<any>;
    signTransaction(): Promise<any>;
    postTransaction(transaction: any): Promise<any>;
}
