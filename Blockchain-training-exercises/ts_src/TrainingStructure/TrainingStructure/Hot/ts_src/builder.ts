

export abstract class Builder {
    xpub: any;
    path: any;
    provider: any;

    constructor(xpub: any, path: any, provider: any) {
        this.xpub = xpub;
        this.path = path;
        this.provider = provider;
    }

    abstract init(): Promise<any>;
    abstract show(): Promise<any>;
    abstract createTransaction(targetAddress: string, value: number, provider: any ): Promise<any>;
    abstract signTransaction(): Promise<any>;
    abstract postTransaction(transaction): Promise<any>;
}