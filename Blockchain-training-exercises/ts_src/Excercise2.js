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
//const mnemonic = bip39.generateMnemonic()
var mnemonic = 'food inmate escape rough like flavor fee moment change wheel film column';
//console.log("mnemonic\n",mnemonic);
var seed = bip39.mnemonicToSeedSync(mnemonic);
var root = bip32.fromSeed(seed);
//console.log("Bip32\n",root);
var path = "m/44'/1'/0'/0/0"; //master key/ bip44/ bitcoin testnet/0/0/0
var child = root.derivePath(path);
function getAddress(node, network) {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network: network }).address;
}
//console.log("My Address\n",getAddress(child, bitcoin.networks.testnet));
var validator = function (pubkey, msghash, signature) { return ECPair.fromPublicKey(pubkey).verify(msghash, signature); };
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function createPayment(_type, myKeys, network) {
            network = network || bitcoin.networks.testnet;
            var splitType = _type.split('-').reverse();
            var isMultisig = splitType[0].slice(0, 4) === 'p2ms';
            var keys = myKeys || [];
            var m;
            if (isMultisig) {
                var match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
                m = parseInt(match[1], 10);
                var n = parseInt(match[2], 10);
                if (keys.length > 0 && keys.length !== n) {
                    throw new Error('Need n keys for multisig');
                }
                while (!myKeys && n > 1) {
                    keys.push(ECPair.makeRandom({ network: network }));
                    n--;
                }
            }
            if (!myKeys)
                keys.push(ECPair.makeRandom({ network: network }));
            var payment;
            splitType.forEach(function (type) {
                if (type.slice(0, 4) === 'p2ms') {
                    payment = bitcoin.payments.p2ms({
                        m: m,
                        pubkeys: keys.map(function (key) { return key.publicKey; }).sort(function (a, b) { return a.compare(b); }),
                        network: network
                    });
                }
                else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
                    payment = bitcoin.payments[type]({
                        redeem: payment,
                        network: network
                    });
                }
                else {
                    payment = bitcoin.payments[type]({
                        pubkey: keys[0].publicKey,
                        network: network
                    });
                }
            });
            return {
                payment: payment,
                keys: keys
            };
        }
        function getWitnessUtxo(out) {
            delete out.address;
            out.script = Buffer.from(out.script, 'hex');
            return out;
        }
        var alice, AXIOS_ROOT, address, unspent, raw, psbt, broadcast;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alice = createPayment('p2pkh');
                    AXIOS_ROOT = "https://blockstream.info/testnet/api/";
                    address = getAddress(child, bitcoin.networks.testnet);
                    return [4 /*yield*/, axios.get("".concat(AXIOS_ROOT, "address/").concat(address, "/utxo"))];
                case 1:
                    unspent = (_a.sent()).data;
                    return [4 /*yield*/, axios.get("".concat(AXIOS_ROOT, "tx/").concat(unspent[0].txid, "/hex"))];
                case 2:
                    raw = (_a.sent()).data;
                    psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet })
                        .addInput({ hash: unspent[0].txid, index: unspent[0].vout, nonWitnessUtxo: Buffer.from(raw, 'hex') })
                        .addOutput({
                        address: getAddress(child, bitcoin.networks.testnet),
                        value: (unspent[0].value) - 50 - 250
                    }) // the actual "spend"
                        .addOutput({
                        address: alice.payment.address,
                        value: 50
                    })
                        .signInput(0, child);
                    psbt.finalizeAllInputs();
                    console.log(psbt.extractTransaction().toHex());
                    return [4 /*yield*/, axios.post("".concat(AXIOS_ROOT, "tx"), psbt.extractTransaction().toHex())];
                case 3:
                    broadcast = _a.sent();
                    console.log("broadcast\n", broadcast);
                    return [2 /*return*/];
            }
        });
    });
}
main();
