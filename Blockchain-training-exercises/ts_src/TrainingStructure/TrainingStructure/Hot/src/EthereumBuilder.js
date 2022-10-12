"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumBuilder = void 0;
const builder_1 = require("./builder");
class EthereumBuilder extends builder_1.Builder {
    //CLI will store the unsigned/signed transaction objects in this class property.
    transaction;
    //Contains all necessary information for account. filled out with .init()
    data;
    constructor(xpub, path) {
        super(xpub, path);
    }
    init = async () => {
        console.log("\nLoading account data...\n");
        return this;
    };
    //Method that logs all relevant wallet data.
    show = async () => {
        return this;
    };
    //Base method used to create an unsigned transaction object. Writes a signature request to ./data/signature_requests.json to be imported to crt-cold for signing.
    //stores the unsigned transaction to this.transaction
    async createTransaction(targetAddress, value, { ...params } = {}) {
    }
    //Base method used to sign a transaction. After a signature response is created by crt-cold either manually or with the API, this reconstructs the transaction using a preimage and injects the signature
    //to the transaction
    async signTransaction() {
    }
    ;
    //posts the transaction on the testnet and logs a link to view the transaction on the block explorer
    async postTransaction(transaction) {
    }
}
exports.EthereumBuilder = EthereumBuilder;
async function main() {
    const args = process.argv;
    if (args.length > 2) {
        if (args[2] == "--sign") {
            console.log("Signing and Posting Transaction!");
            console.log("Transaction Posted!");
        }
    }
    else {
        console.log("Building Transaction!");
    }
}
main();
