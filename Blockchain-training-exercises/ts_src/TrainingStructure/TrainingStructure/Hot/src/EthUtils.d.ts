import { ethers, BigNumber } from "ethers";
export declare type WalletData = {
    rootXpub: string;
    rootXpubPath: string;
    publicKey: string;
    address: string;
    path: string;
    balance: BigNumber;
    gasFeeData: any;
};
export declare const provider: ethers.providers.AlchemyProvider;
