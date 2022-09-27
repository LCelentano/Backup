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
//const mnemonic = bip39.generateMnemonic()
const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
//console.log("mnemonic\n",mnemonic);
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed);
//console.log("Bip32\n",root);
const path = "m/44'/1'/0'/0/0"; //master key/ bip44/ bitcoin testnet/0/0/0
const child = root.derivePath(path);
function getAddress(node, network) {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
}
//console.log("My Address\n",getAddress(child, bitcoin.networks.testnet));
const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature);
async function main() {
    const alice = createPayment('p2pkh');
    const AXIOS_ROOT = `https://blockstream.info/testnet/api/`;
    const address = getAddress(child, bitcoin.networks.testnet);
    const unspent = (await axios.get(`${AXIOS_ROOT}address/${address}/utxo`)).data;
    const raw = (await axios.get(`${AXIOS_ROOT}tx/${unspent[0].txid}/hex`)).data;
    //console.log("raw transaction\n",unspent);
    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet })
        .addInput({ hash: unspent[0].txid, index: unspent[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex') })
        .addOutput({
        address: getAddress(child, bitcoin.networks.testnet),
        value: (unspent[0].value) - 50 - 250,
    }) // the actual "spend"
        .addOutput({
        address: alice.payment.address,
        value: 50,
    })
        .signInput(0, child);
    psbt.finalizeAllInputs();
    console.log(psbt.extractTransaction().toHex());
    const broadcast = await axios.post(`${AXIOS_ROOT}tx`, psbt.extractTransaction().toHex());
    console.log("broadcast\n", broadcast);
    function createPayment(_type, myKeys, network) {
        network = network || bitcoin.networks.testnet;
        const splitType = _type.split('-').reverse();
        const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
        const keys = myKeys || [];
        let m;
        if (isMultisig) {
            const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
            m = parseInt(match[1], 10);
            let n = parseInt(match[2], 10);
            if (keys.length > 0 && keys.length !== n) {
                throw new Error('Need n keys for multisig');
            }
            while (!myKeys && n > 1) {
                keys.push(ECPair.makeRandom({ network }));
                n--;
            }
        }
        if (!myKeys)
            keys.push(ECPair.makeRandom({ network }));
        let payment;
        splitType.forEach(type => {
            if (type.slice(0, 4) === 'p2ms') {
                payment = bitcoin.payments.p2ms({
                    m,
                    pubkeys: keys.map(key => key.publicKey).sort((a, b) => a.compare(b)),
                    network,
                });
            }
            else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
                payment = bitcoin.payments[type]({
                    redeem: payment,
                    network,
                });
            }
            else {
                payment = bitcoin.payments[type]({
                    pubkey: keys[0].publicKey,
                    network,
                });
            }
        });
        return {
            payment,
            keys,
        };
    }
    function getWitnessUtxo(out) {
        delete out.address;
        out.script = Buffer.from(out.script, 'hex');
        return out;
    }
}
main();
//# sourceMappingURL=Excercise2.js.map