"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumBuilder = void 0;
const builder_1 = require("./builder");
const fs = __importStar(require("fs"));
const ethers = require('ethers');
const ether = __importStar(require("ethers"));
const Utils_1 = require("./Utils");
class EthereumBuilder extends builder_1.Builder {
    //Contains all necessary information for account. filled out with .init()
    data;
    constructor(pub, path, provider) {
        super(pub, path, provider);
    }
    init = async () => {
        return this;
    };
    //Method that logs all relevant wallet data.
    show = async () => {
        return this;
    };
    //Base method used to create an unsigned transaction object. Writes a signature request to ./data/signature_requests.json to be imported to crt-cold for signing.
    //stores the unsigned transaction to this.transaction
    async createTransaction(targetAddress, value, { ...params } = {}) {
        let network = new ether.ethers.providers.AlchemyProvider(this.provider);
        let hdnode = ether.utils.HDNode.fromExtendedKey(this.xpub);
        let address = hdnode.address;
        let pubkey = hdnode.publicKey;
        let tx = {
            to: targetAddress,
            nonce: await network.getTransactionCount(address),
            gasPrice: await (await network.getGasPrice()).toNumber(),
            value: ethers.BigNumber.from(value).toNumber(),
            gasLimit: 21000,
        };
        let preimage = ether.utils.serializeTransaction(tx);
        let message = ether.utils.keccak256(preimage);
        let signatureRequests = {
            preimage: preimage,
            signatureRequests: [{ message: message, publicKey: pubkey, path: this.path, curve: "secp256k1" }]
        };
        return (0, Utils_1.writeRecords)(null, signatureRequests);
    }
    //Base method used to sign a transaction. After a signature response is created by crt-cold either manually or with the API, this reconstructs the transaction using a preimage and injects the signature
    //to the transaction
    async signTransaction() {
        let response = fs.readFileSync("../data/signature_response.json", "utf-8");
        let signedMsg = JSON.parse(response);
        let parseTx = ether.ethers.utils.parseTransaction(signedMsg.preimage);
        let serialTx = ether.ethers.utils.serializeTransaction(parseTx, signedMsg.signature.signature);
        return serialTx;
    }
    ;
    //posts the transaction on the testnet and logs a link to view the transaction on the block explorer
    async postTransaction(transaction) {
        let network = new ether.ethers.providers.AlchemyProvider(this.provider);
        let broadcast = await network.sendTransaction(await this.signTransaction());
        console.log(broadcast);
    }
}
exports.EthereumBuilder = EthereumBuilder;
async function main() {
    let xPJ = fs.readFileSync("../data/xPJ.json", "utf-8");
    let xpj = JSON.parse(xPJ);
    let builder = await new EthereumBuilder(xpj.xpub, xpj.path, 'goerli').init();
    const args = process.argv;
    if (args.length > 2) {
        if (args[2] == "--sign") {
            console.log("Signing and Posting Transaction!");
            builder.postTransaction(await builder.signTransaction());
            console.log("Transaction Posted!");
        }
    }
    else {
        console.log("Building Transaction!");
        builder.createTransaction("0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1", 1000, builder.provider);
    }
}
main();
