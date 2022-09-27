"use strict";
//ctrl+shift+/ for mass comment or just /* */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bip39 = __importStar(require("bip39"));
const bip32_1 = __importDefault(require("bip32"));
const ecc = __importStar(require("tiny-secp256k1"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const ecpair_1 = __importDefault(require("ecpair"));
const axios = require('axios');
const ECPair = (0, ecpair_1.default)(ecc);
const bip32 = (0, bip32_1.default)(ecc);
var add_index = 0, glbl_total = 0, stop_counter = 0;
var address = null, child = null, path = null, unspent = null;
var children = {};
function getAddress(node, network) {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
}
const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature);
function child_gen(mnemonic) {
    //let mnemonic = bip39.generateMnemonic()
    //const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
    path = `m/44'/1'/0'/0/${add_index}`;
    let seed = bip39.mnemonicToSeedSync(mnemonic);
    let root = bip32.fromSeed(seed);
    child = root.derivePath(path);
    add_index += 1;
    //console.log(path);
    //console.log(child);
    address = getAddress(child, bitcoin.networks.testnet);
    //console.log(address)
}
async function trans_chkr() {
    const AXIOS_ROOT = `https://blockstream.info/testnet/api/`;
    // console.log("address index",add_index);
    // console.log(address);
    let unspent = (await axios.get(`${AXIOS_ROOT}address/${address}/utxo`)).data;
    //console.log(unspent[0]);
    try {
        if (unspent[0].value > 0) {
            const child_node = {
                UTXO: unspent,
                Address: address,
                Child: child,
                Path: path
            };
            children[address] = child_node;
            //console.log(children)
            const raw = (await axios.get(`${AXIOS_ROOT}tx/${children[address].UTXO[0].txid}/hex`)).data;
            //console.log(raw);
            const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet })
                .addInput({ hash: children[address].UTXO[0].txid, index: children[address].UTXO[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex') })
                .addOutput({
                address: "tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt",
                value: (unspent[0].value) - (unspent[0].value / 2) - 250,
            }) // the actual "spend"
                .addOutput({
                address: address,
                value: unspent[0].value / 2,
            })
                .signInput(0, child);
            psbt.finalizeAllInputs();
            console.log("psbt", psbt);
            console.log(psbt.extractTransaction().toHex());
            const broadcast = await axios.post(`${AXIOS_ROOT}tx`, psbt.extractTransaction().toHex());
            console.log("broadcast\n", broadcast);
            stop_counter = 0;
            glbl_total += unspent[0].value;
            //console.log(stop_counter);
            //console.log(glbl_total);
            child_gen('food inmate escape rough like flavor fee moment change wheel film column');
        }
        else {
            stop_counter += 1;
            //console.log("else", stop_counter)
        }
    }
    catch {
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
    var i = 0;
    while (i < 26) {
        child_gen('food inmate escape rough like flavor fee moment change wheel film column');
        trans_chkr();
        if (stop_counter >= 20) { //number will most likely be the number of children, under normal circumstances
            break;
        }
        i += 1;
    }
}
test();
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
//# sourceMappingURL=Excercise3.js.map