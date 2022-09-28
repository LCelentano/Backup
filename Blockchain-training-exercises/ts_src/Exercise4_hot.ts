import * as ether from "ethers"
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from "tiny-secp256k1";
import ECPairFactory from 'ecpair';
import {strict} from "assert";
const axios = require('axios');
import { Network, Alchemy } from 'alchemy-sdk';
//import * as bitcoin from 'bitcoinjs-lib';

//ctrl+shift+/ for mass comment or just /* */


// const ECPair = ECPairFactory(ecc)
// const bip32 = BIP32Factory(ecc);

// var add_index = 0, glbl_total = 0, stop_counter = 0;
// var address = null, child = null, path = null, unspent = null;
// var children = {};

// const validator = (
//     pubkey: Buffer,
//     msghash: Buffer,
//     signature: Buffer,
// ): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

async function Alchemical(apiKey: string, network: any) {
    const settings = {
        apiKey: apiKey,
        network: network,
    };
    
    const alchemy = new Alchemy(settings);
    const block = await alchemy.core.getBlockNumber();

    //console.log(network)
    const provider = new ether.providers.AlchemyProvider("goerli", apiKey);
    //console.log(provider)
    const tx = await provider.getBlockWithTransactions(block)
    //console.log(tx)
    return [tx, provider] as const; 
}

//Alchemical("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", Network.ETH_GOERLI)


async function Broadcast(mnemonic: string) {
    //let mnemonic = bip39.generateMnemonic()
    //const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
    //path = `m/44'/1'/0'/0/${add_index}`;
    const [tx, provider] = await Alchemical("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", Network.ETH_GOERLI);
    //const EtherSign = Signer();
    let EtherMnemonic = ether.Wallet.fromMnemonic(mnemonic);
    let EtherPrivate = new ether.Wallet(EtherMnemonic.privateKey)
    //console.log(EtherMnemonic.address === EtherPrivate.address)
    //console.log(EtherMnemonic.provider)
    let EtherAddress = EtherMnemonic.address
    //alchemy.core.getTokenBalances(EtherAddress)
    //console.log(EtherMnemonic.mnemonic)
    //console.log(EtherPrivate.mnemonic)
    await EtherMnemonic.signTransaction(tx)
    let EtherWallet = EtherMnemonic.connect(provider)
    let broadcast = await EtherWallet.sendTransaction(tx) 
    console.log(broadcast)
}

Broadcast('food inmate escape rough like flavor fee moment change wheel film column')

// async function trans_chkr() {
//     const AXIOS_ROOT = `https://blockstream.info/testnet/api/`
//     // console.log("address index",add_index);
//     // console.log(address);
//     let unspent = (await axios.get(`${AXIOS_ROOT}address/${address}/utxo`)).data
//     //console.log(unspent[0]);
//     try {
//         if (unspent[0].value > 0) {
//             const child_node = {
//                 UTXO: unspent,
//                 Address: address,
//                 Child: child,
//                 Path: path
//             }
//             children[address] = child_node;
//             //console.log(children)
//             const raw  = (await axios.get(`${AXIOS_ROOT}tx/${children[address].UTXO[0].txid}/hex`)).data
//             //console.log(raw);
//             const psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet})
//                 .addInput({hash: children[address].UTXO[0].txid, index: children[address].UTXO[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex')})
//                 .addOutput({
//                     address: "tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt",
//                     value: (unspent[0].value)-(unspent[0].value/2)-250,
//                 }) // the actual "spend"
//                 .addOutput({
//                     address: address,
//                     value: unspent[0].value/2,
//                 })
//                 .signInput(0, child);
//             psbt.finalizeAllInputs();
//             console.log("psbt",psbt);
//             console.log(psbt.extractTransaction().toHex())
//             const broadcast = await axios.post(`${AXIOS_ROOT}tx`,psbt.extractTransaction().toHex())
//             console.log("broadcast\n", broadcast);
//             stop_counter = 0;
//             glbl_total += unspent[0].value;
//             //console.log(stop_counter);
//             //console.log(glbl_total);
//             child_gen('food inmate escape rough like flavor fee moment change wheel film column')
//         } else {
//             stop_counter += 1;
//             //console.log("else", stop_counter)
//         }
//     } catch {
//         stop_counter += 1;
//         //console.log("catch",stop_counter);
//     }
//     //let raw  = (await axios.get(`${AXIOS_ROOT}tx/${unspent[0].txid}/hex`)).data
//     /*const psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet})
//     .addInput({hash: unspent[0].txid, index: unspent[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex')})
//     .addOutput({
//         address: getAddress(child, bitcoin.networks.testnet),
//         value: (unspent[0].value)-50-250,
//     }) // the actual "spend"
//     .signInput(0, child);*/
//     //psbt.finalizeAllInputs();
// }

// function test() {
//     var i = 0
//     // while (i < 26) {
//     //     child_gen('food inmate escape rough like flavor fee moment change wheel film column')
//     //     trans_chkr()
//     //     if (stop_counter >= 20) { //number will most likely be the number of children, under normal circumstances
//     //         break
//     //     }
//     //     i+=1
//     // }
//     child_gen('food inmate escape rough like flavor fee moment change wheel film column')
//     trans_chkr()
// }

// test()



