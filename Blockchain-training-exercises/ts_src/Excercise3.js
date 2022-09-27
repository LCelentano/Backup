"use strict";
//ctrl+shift+/ for mass comment or just /* */
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
var bip39 = require("bip39");
var bip32_1 = require("bip32");
var ecc = require("tiny-secp256k1");
var bitcoin = require("bitcoinjs-lib");
var ecpair_1 = require("ecpair");
var axios = require('axios');
var ECPair = (0, ecpair_1["default"])(ecc);
var bip32 = (0, bip32_1["default"])(ecc);
var add_index = 0, glbl_total = 0, stop_counter = 0;
var address = null, child = null, path = null, unspent = null;
var children = {};
function getAddress(node, network) {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network: network }).address;
}
var validator = function (pubkey, msghash, signature) { return ECPair.fromPublicKey(pubkey).verify(msghash, signature); };
function child_gen(mnemonic) {
    //let mnemonic = bip39.generateMnemonic()
    //const mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
    path = "m/44'/1'/0'/0/".concat(add_index);
    var seed = bip39.mnemonicToSeedSync(mnemonic);
    var root = bip32.fromSeed(seed);
    child = root.derivePath(path);
    add_index += 1;
    //console.log(path);
    //console.log(child);
    address = getAddress(child, bitcoin.networks.testnet);
    //console.log(address)
}
function trans_chkr() {
    return __awaiter(this, void 0, void 0, function () {
        var AXIOS_ROOT, unspent, child_node, raw, psbt, broadcast, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    AXIOS_ROOT = "https://blockstream.info/testnet/api/";
                    return [4 /*yield*/, axios.get("".concat(AXIOS_ROOT, "address/").concat(address, "/utxo"))];
                case 1:
                    unspent = (_b.sent()).data;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, , 8]);
                    if (!(unspent[0].value > 0)) return [3 /*break*/, 5];
                    child_node = {
                        UTXO: unspent,
                        Address: address,
                        Child: child,
                        Path: path
                    };
                    children[address] = child_node;
                    return [4 /*yield*/, axios.get("".concat(AXIOS_ROOT, "tx/").concat(children[address].UTXO[0].txid, "/hex"))];
                case 3:
                    raw = (_b.sent()).data;
                    psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet })
                        .addInput({ hash: children[address].UTXO[0].txid, index: children[address].UTXO[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex') })
                        .addOutput({
                        address: "tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt",
                        value: (unspent[0].value) - (unspent[0].value / 2) - 250
                    }) // the actual "spend"
                        .addOutput({
                        address: address,
                        value: unspent[0].value / 2
                    })
                        .signInput(0, child);
                    psbt.finalizeAllInputs();
                    console.log("psbt", psbt);
                    console.log(psbt.extractTransaction().toHex());
                    return [4 /*yield*/, axios.post("".concat(AXIOS_ROOT, "tx"), psbt.extractTransaction().toHex())];
                case 4:
                    broadcast = _b.sent();
                    console.log("broadcast\n", broadcast);
                    stop_counter = 0;
                    glbl_total += unspent[0].value;
                    //console.log(stop_counter);
                    //console.log(glbl_total);
                    child_gen('food inmate escape rough like flavor fee moment change wheel film column');
                    return [3 /*break*/, 6];
                case 5:
                    stop_counter += 1;
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    _a = _b.sent();
                    stop_counter += 1;
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function test() {
    var i = 0;
    // while (i < 26) {
    //     child_gen('food inmate escape rough like flavor fee moment change wheel film column')
    //     trans_chkr()
    //     if (stop_counter >= 20) { //number will most likely be the number of children, under normal circumstances
    //         break
    //     }
    //     i+=1
    // }
    child_gen('food inmate escape rough like flavor fee moment change wheel film column');
    trans_chkr();
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
