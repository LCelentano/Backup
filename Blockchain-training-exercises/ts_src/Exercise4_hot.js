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
var fs = require("fs");
var Child = require("./Child.json");
// const transaction = require('./transaction.json');
//import { loadJsonFile } from 'load-json-file';
//import * as Web3 from 'web3';
//const Web3 = require('web3')
//import { toBytes, toHex } from 'hex-my-bytes'
function transBroad(value, destination, apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var child, address, provider, gasPrice, v, tx, json, signature, signature2, broadcast;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    child = Child["xPub"];
                    address = ether.utils.computeAddress(child);
                    provider = new ether.providers.AlchemyProvider("goerli", apiKey);
                    return [4 /*yield*/, provider.getGasPrice()];
                case 1: return [4 /*yield*/, (_b.sent()).toNumber()];
                case 2:
                    gasPrice = _b.sent();
                    v = ether.BigNumber.from(value).toNumber();
                    _a = {
                        to: destination
                    };
                    return [4 /*yield*/, provider.getTransactionCount(address)];
                case 3:
                    tx = (_a.nonce = _b.sent(),
                        _a.gasPrice = gasPrice,
                        _a.value = v,
                        _a.chainId = 5,
                        _a.gas = 21000,
                        _a);
                    json = JSON.stringify(tx);
                    fs.writeFileSync("./transaction.json", json);
                    signature = fs.readFileSync("./signature.json", "utf-8");
                    signature2 = JSON.parse(signature);
                    console.log(signature2);
                    return [4 /*yield*/, provider.sendTransaction(signature2.rawTransaction)];
                case 4:
                    broadcast = _b.sent();
                    console.log(broadcast);
                    return [2 /*return*/];
            }
        });
    });
}
transBroad(1000, "0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1", "lkbb4VMbwbhvriG-2UqK83r-qzMXG2pb");
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
