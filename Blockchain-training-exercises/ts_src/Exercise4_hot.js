"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ether = require("ethers");
var axios = require('axios');
var alchemy_sdk_1 = require("alchemy-sdk");
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
function Alchemical(apiKey, network) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, alchemy, block, provider, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settings = {
                        apiKey: apiKey,
                        network: network
                    };
                    alchemy = new alchemy_sdk_1.Alchemy(settings);
                    return [4 /*yield*/, alchemy.core.getBlockNumber()];
                case 1:
                    block = _a.sent();
                    provider = new ether.providers.AlchemyProvider("goerli", apiKey);
                    return [4 /*yield*/, provider.getBlockWithTransactions(block)
                        //console.log(tx)
                    ];
                case 2:
                    tx = _a.sent();
                    //console.log(tx)
                    return [2 /*return*/, [tx, provider]];
            }
        });
    });
}
//Alchemical("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", Network.ETH_GOERLI)
function transactions(mnemonic) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, tx, provider, EtherMnemonic, EtherPrivate, EtherAddress, EtherWallet, broadcast;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Alchemical("lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb", alchemy_sdk_1.Network.ETH_GOERLI)];
                case 1:
                    _a = _b.sent(), tx = _a[0], provider = _a[1];
                    EtherMnemonic = ether.Wallet.fromMnemonic(mnemonic);
                    EtherPrivate = new ether.Wallet(EtherMnemonic.privateKey);
                    EtherAddress = EtherMnemonic.address;
                    //alchemy.core.getTokenBalances(EtherAddress)
                    //console.log(EtherMnemonic.mnemonic)
                    //console.log(EtherPrivate.mnemonic)
                    return [4 /*yield*/, EtherMnemonic.signTransaction(tx)];
                case 2:
                    //alchemy.core.getTokenBalances(EtherAddress)
                    //console.log(EtherMnemonic.mnemonic)
                    //console.log(EtherPrivate.mnemonic)
                    _b.sent();
                    EtherWallet = EtherMnemonic.connect(provider);
                    return [4 /*yield*/, EtherWallet.sendTransaction(tx)];
                case 3:
                    broadcast = _b.sent();
                    console.log(broadcast);
                    return [2 /*return*/];
            }
        });
    });
}
transactions('food inmate escape rough like flavor fee moment change wheel film column');
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
