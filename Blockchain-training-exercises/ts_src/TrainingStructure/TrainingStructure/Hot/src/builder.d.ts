export declare abstract class Builder {
    xpub: any;
    path: any;
    provider: any;
    constructor(xpub: any, path: any, provider: any);
    abstract init(): Promise<any>;
    abstract show(): Promise<any>;
    abstract createTransaction(targetAddress: string, value: number, provider: any): Promise<any>;
    abstract signTransaction(): Promise<any>;
    abstract postTransaction(transaction: any): Promise<any>;
}
