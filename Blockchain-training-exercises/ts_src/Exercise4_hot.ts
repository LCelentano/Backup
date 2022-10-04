import * as ether from "ethers"
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from "tiny-secp256k1";
import ECPairFactory from 'ecpair';
import {strict} from "assert";
const axios = require('axios');
import { Network, Alchemy } from 'alchemy-sdk';
import { stringify } from "querystring";
import * as fs from 'fs';
const Child = require("./Child.json")
// const transaction = require('./transaction.json');
//import { loadJsonFile } from 'load-json-file';
//import * as Web3 from 'web3';
//const Web3 = require('web3')
//import { toBytes, toHex } from 'hex-my-bytes'


async function transBroad(value: number, destination: string, apiKey: string) {
    let child = Child["xPub"];
    let address = ether.utils.computeAddress(child)
    const provider = new ether.providers.AlchemyProvider("goerli", apiKey);

    let gasPrice = await (await provider.getGasPrice()).toNumber()
    let v = ether.BigNumber.from(value).toNumber()

    let tx = {
        to: destination,
        nonce: await provider.getTransactionCount(address),
        gasPrice: gasPrice,
        value: v,
        chainId: 5,
        gas: 21000,
    }

    // var web3 = new Web3(Web3.givenProvider)
    // console.log(Web3.givenProvider)
    //web3.eth.estimateGas()

    var json = JSON.stringify(tx)

    fs.writeFileSync("./transaction.json",json)

    let signature = fs.readFileSync("./signature.json", "utf-8")  
    let signedTx = JSON.parse(signature)
    console.log(signedTx)

    let broadcast = await provider.sendTransaction(signedTx.rawTransaction)
    console.log(broadcast)

}

transBroad(1000, "0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1", "lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb")

//SignBroadcast("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", Network.ETH_GOERLI)

// async function SignBroadcast(apiKey: string, network: any) {
//     const settings = {
//         apiKey: apiKey,
//         network: network,
//     };
//     //let EtherMnemonic = ether.Wallet.fromMnemonic('food inmate escape rough like flavor fee moment change wheel film column');
//     // 
//     // let EtherWallet = EtherMnemonic.connect(provider)
//     // console.log(await EtherWallet.getBalance())
//     // const tx = trans_gen(1000, "0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1")
//     // await EtherWallet.signTransaction(tx)
//     // await EtherWallet.sendTransaction(tx)
// }

// SignBroadcast("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", Network.ETH_GOERLI)



// async function Broadcast(mnemonic: string) {
//     //let mnemonic = bip39.generateMnemonic()
//     //const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
//     //path = `m/44'/1'/0'/0/${add_index}`;
//     const [tx, provider] = await Alchemical("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", Network.ETH_GOERLI);
//     //const EtherSign = Signer();
    
//     let EtherPrivate = new ether.Wallet(EtherMnemonic.privateKey)
//     //console.log(EtherMnemonic.address === EtherPrivate.address)
//     //console.log(EtherMnemonic.provider)
//     let EtherAddress = EtherMnemonic.address
//     //alchemy.core.getTokenBalances(EtherAddress)
//     //console.log(EtherMnemonic.mnemonic)
//     //console.log(EtherPrivate.mnemonic)
//     //await EtherMnemonic.populateTransaction(tx)
//     await EtherMnemonic.signTransaction(tx)
//     let EtherWallet = EtherMnemonic.connect(provider)
//     let broadcast = await EtherWallet.sendTransaction(tx) 
//     //console.log(broadcast)
// }

// Broadcast('food inmate escape rough like flavor fee moment change wheel film column')



