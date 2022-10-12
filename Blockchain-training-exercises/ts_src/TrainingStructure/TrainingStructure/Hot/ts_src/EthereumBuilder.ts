import {Builder} from './builder';
import {WalletData} from "./EthUtils";
import * as fs from 'fs'; 
const ethers = require('ethers')
import * as ether from 'ethers' 
import { writeRecords } from './Utils';
import { HDNode } from 'ethers/lib/utils';
//const { EthTxSigner } = require("hdwallet-signer");
// import * as hdwallet from 'hdwallet-signer'
import { sign } from 'crypto';
import { json } from 'stream/consumers';
const Web3 = require('web3')

export class EthereumBuilder extends Builder {

    //Contains all necessary information for account. filled out with .init()
    data: WalletData;

    constructor(pub: any, path: any, provider: any) {
        super(pub, path, provider);
    }
    init: () => Promise<this> = async () => {
        return this
    };

    //Method that logs all relevant wallet data.
    show: () => Promise<any> = async () => {
        return this
    };

    //Base method used to create an unsigned transaction object. Writes a signature request to ./data/signature_requests.json to be imported to crt-cold for signing.
    //stores the unsigned transaction to this.transaction
    async createTransaction(targetAddress: any, value: number, {...params} = {}): Promise<any> {
        let network = new ether.providers.AlchemyProvider(this.provider)
        let hdnode = ether.utils.HDNode.fromExtendedKey(this.xpub)
        let address = hdnode.address
        console.log(hdnode.publicKey)
        console.log(address)
        let pubkey = hdnode.publicKey
        let tx = {
            to: targetAddress,
            nonce: await network.getTransactionCount(address),
            gasPrice: await (await network.getGasPrice()).toNumber(),
            value: ethers.BigNumber.from(value).toNumber(),
            gasLimit: 21000,
        }
        let preimage = ethers.utils.serializeTransaction(tx)
        let message = ethers.utils.keccak256(preimage)
        let signatureRequests =  {
            preimage: preimage,
            signatureRequests: [{message: message, publicKey:pubkey,path:this.path,curve:"Secp256k1"}]

        }
        return writeRecords(null, signatureRequests)
    }

    //Base method used to sign a transaction. After a signature response is created by crt-cold either manually or with the API, this reconstructs the transaction using a preimage and injects the signature
    //to the transaction
    async signTransaction(): Promise<any> {
        let response = fs.readFileSync("../data/signature_response.json", "utf-8")  
        let signedMsg = JSON.parse(response)
        let parseTx = ether.ethers.utils.parseTransaction(signedMsg.preimage)
        let serialTx = ether.ethers.utils.serializeTransaction(parseTx, signedMsg.signature.signature)
        // console.log(serialTx)
        return serialTx
        
    };

    //posts the transaction on the testnet and logs a link to view the transaction on the block explorer
    public async postTransaction(transaction: any): Promise<any> {
        let network = new ethers.providers.AlchemyProvider(this.provider)   
        let broadcast = await network.sendTransaction(await this.signTransaction())
        // console.log(broadcast)
    }
}

async function main() {
    let xPJ = fs.readFileSync("../data/xPJ.json", "utf-8")  
    let xpj = JSON.parse(xPJ)
    let builder = await new EthereumBuilder(xpj.xpub, xpj.path, 'goerli').init()
    builder.createTransaction("0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1", 1000, "goerli")
    // await builder.signTransaction()
    builder.postTransaction(await builder.signTransaction())
    const args = process.argv;
    if (args.length > 2) {
        if (args[2] == "--sign") {
            console.log("Signing and Posting Transaction!")
            console.log("Transaction Posted!")
        }
    } else {
        console.log("Building Transaction!")
    }
}
main();