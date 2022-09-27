//ctrl+shift+/ for mass comment or just /* */

import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from "tiny-secp256k1";
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import {strict} from "assert";
const axios = require('axios');

const ECPair = ECPairFactory(ecc)
const bip32 = BIP32Factory(ecc);

var add_index = 0, glbl_total = 0, stop_counter = 0;
var address = null, child = null, path = null, unspent = null;
var children = {};


function getAddress(node: any, network?: any): string {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;}

const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

function child_gen(mnemonic: string) {
    //let mnemonic = bip39.generateMnemonic()
    //const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
    path = `m/44'/1'/0'/0/${add_index}`;
    let seed = bip39.mnemonicToSeedSync(mnemonic)
    let root = bip32.fromSeed(seed)
    child = root.derivePath(path);
    add_index += 1;
    //console.log(path);
    //console.log(child);
    address = getAddress(child, bitcoin.networks.testnet)
    //console.log(address)
}

async function trans_chkr() {
    const AXIOS_ROOT = `https://blockstream.info/testnet/api/`
    // console.log("address index",add_index);
    // console.log(address);
    let unspent = (await axios.get(`${AXIOS_ROOT}address/${address}/utxo`)).data
    //console.log(unspent[0]);
    try {
        if (unspent[0].value > 0) {
            const child_node = {
                UTXO: unspent,
                Address: address,
                Child: child,
                Path: path
            }
            children[address] = child_node;
            //console.log(children)
            const raw  = (await axios.get(`${AXIOS_ROOT}tx/${children[address].UTXO[0].txid}/hex`)).data
            //console.log(raw);
            const psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet})
                .addInput({hash: children[address].UTXO[0].txid, index: children[address].UTXO[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex')})
                .addOutput({
                    address: "tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt",
                    value: (unspent[0].value)-(unspent[0].value/2)-250,
                }) // the actual "spend"
                .addOutput({
                    address: address,
                    value: unspent[0].value/2,
                })
                .signInput(0, child);
            psbt.finalizeAllInputs();
            console.log("psbt",psbt);
            console.log(psbt.extractTransaction().toHex())
            const broadcast = await axios.post(`${AXIOS_ROOT}tx`,psbt.extractTransaction().toHex())
            console.log("broadcast\n", broadcast);
            stop_counter = 0;
            glbl_total += unspent[0].value;
            //console.log(stop_counter);
            //console.log(glbl_total);
            child_gen('food inmate escape rough like flavor fee moment change wheel film column')
        } else {
            stop_counter += 1;
            //console.log("else", stop_counter)
        }
    } catch {
        stop_counter += 1;
        //console.log("catch",stop_counter);
    }
    //let raw  = (await axios.get(`${AXIOS_ROOT}tx/${unspent[0].txid}/hex`)).data
    /*const psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet})
    .addInput({hash: unspent[0].txid, index: unspent[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex')})
    .addOutput({
        address: getAddress(child, bitcoin.networks.testnet),
        value: (unspent[0].value)-50-250,
    }) // the actual "spend"
    .signInput(0, child);*/
    //psbt.finalizeAllInputs();
}

function test() {
    var i = 0
    // while (i < 26) {
    //     child_gen('food inmate escape rough like flavor fee moment change wheel film column')
    //     trans_chkr()
    //     if (stop_counter >= 20) { //number will most likely be the number of children, under normal circumstances
    //         break
    //     }
    //     i+=1
    // }
    child_gen('food inmate escape rough like flavor fee moment change wheel film column')
    trans_chkr()
}

test()

/*async function main() {
    const alice = createPayment('p2pkh')
    const AXIOS_ROOT = `https://blockstream.info/testnet/api/`
    const address = getAddress(child, bitcoin.networks.testnet)
    const unspent = (await axios.get(`${AXIOS_ROOT}address/${address}/utxo`)).data
    const raw  = (await axios.get(`${AXIOS_ROOT}tx/${unspent[0].txid}/hex`)).data
    //console.log("raw transaction\n",unspent);
    const psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet})
        .addInput({hash: unspent[0].txid, index: unspent[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex')})
        .addOutput({
            address: getAddress(child, bitcoin.networks.testnet),
            value: (unspent[0].value)-50-250,
        }) // the actual "spend"
        .addOutput({
            address: alice.payment.address, // OR script, which is a Buffer.
            value: 50,
        })
        .signInput(0, child);
    psbt.finalizeAllInputs();
    //console.log(psbt.extractTransaction().toHex())
    const broadcast = await axios.post(`${AXIOS_ROOT}tx`,psbt.extractTransaction().toHex())
    //console.log("broadcast\n", broadcast);

}
//main()*/

