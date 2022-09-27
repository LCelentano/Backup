//ctrl+shift+/ for mass comment or just /* */

import * as assert from 'assert';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from "tiny-secp256k1";
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
const axios = require('axios');

const ECPair = ECPairFactory(ecc)

const bip32 = BIP32Factory(ecc);

//const mnemonic = bip39.generateMnemonic()
const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
//console.log("mnemonic\n",mnemonic);
const seed = bip39.mnemonicToSeedSync(mnemonic)
const root = bip32.fromSeed(seed)
//console.log("Bip32\n",root);
const path = "m/44'/1'/0'/0/0"; //master key/ bip44/ bitcoin testnet/0/0/0
const child = root.derivePath(path);

function getAddress(node: any, network?: any): string {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}
//console.log("My Address\n",getAddress(child, bitcoin.networks.testnet));
const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

async function main() {
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
    console.log(psbt.extractTransaction().toHex())
    const broadcast = await axios.post(`${AXIOS_ROOT}tx`,psbt.extractTransaction().toHex())
    console.log("broadcast\n", broadcast);

    function createPayment(_type: string, myKeys?: any[], network?: any): any {
        network = network || bitcoin.networks.testnet;
        const splitType = _type.split('-').reverse();
        const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
        const keys = myKeys || [];
        let m: number | undefined;
        if (isMultisig) {
            const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
            m = parseInt(match![1], 10);
            let n = parseInt(match![2], 10);
            if (keys.length > 0 && keys.length !== n) {
                throw new Error('Need n keys for multisig');
            }
            while (!myKeys && n > 1) {
                keys.push(ECPair.makeRandom({network}));
                n--;
            }
        }
        if (!myKeys) keys.push(ECPair.makeRandom({network}));

        let payment: any;
        splitType.forEach(type => {
            if (type.slice(0, 4) === 'p2ms') {
                payment = bitcoin.payments.p2ms({
                    m,
                    pubkeys: keys.map(key => key.publicKey).sort((a, b) => a.compare(b)),
                    network,
                });
            } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
                payment = (bitcoin.payments as any)[type]({
                    redeem: payment,
                    network,
                });
            } else {
                payment = (bitcoin.payments as any)[type]({
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


    function getWitnessUtxo(out: any): any {
        delete out.address;
        out.script = Buffer.from(out.script, 'hex');
        return out;
    }
}
main()

