"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.EthereumBuilder = void 0;
var builder_1 = require("./builder");
var fs = require("fs");
var ethers = require('ethers');
var ether = require("ethers");
var Utils_1 = require("./Utils");
var EthereumBuilder = /** @class */ (function (_super) {
    __extends(EthereumBuilder, _super);
    function EthereumBuilder(pub, path, provider) {
        var _this = _super.call(this, pub, path, provider) || this;
        _this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this];
            });
        }); };
        //Method that logs all relevant wallet data.
        _this.show = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this];
            });
        }); };
        return _this;
    }
    //Base method used to create an unsigned transaction object. Writes a signature request to ./data/signature_requests.json to be imported to crt-cold for signing.
    //stores the unsigned transaction to this.transaction
    EthereumBuilder.prototype.createTransaction = function (targetAddress, value, _a) {
        if (_a === void 0) { _a = {}; }
        var params = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function () {
            var network, hdnode, address, pubkey, tx, preimage, message, signatureRequests;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        network = new ether.ethers.providers.AlchemyProvider(this.provider);
                        hdnode = ether.utils.HDNode.fromExtendedKey(this.xpub);
                        address = hdnode.address;
                        pubkey = hdnode.publicKey;
                        _b = {
                            to: targetAddress
                        };
                        return [4 /*yield*/, network.getTransactionCount(address)];
                    case 1:
                        _b.nonce = _c.sent();
                        return [4 /*yield*/, network.getGasPrice()];
                    case 2: return [4 /*yield*/, (_c.sent()).toNumber()];
                    case 3:
                        tx = (_b.gasPrice = _c.sent(),
                            _b.value = ethers.BigNumber.from(value).toNumber(),
                            _b.gasLimit = 21000,
                            _b);
                        preimage = ether.utils.serializeTransaction(tx);
                        message = ether.utils.keccak256(preimage);
                        signatureRequests = {
                            preimage: preimage,
                            signatureRequests: [{ message: message, publicKey: pubkey, path: this.path, curve: "secp256k1" }]
                        };
                        return [2 /*return*/, (0, Utils_1.writeRecords)(null, signatureRequests)];
                }
            });
        });
    };
    //Base method used to sign a transaction. After a signature response is created by crt-cold either manually or with the API, this reconstructs the transaction using a preimage and injects the signature
    //to the transaction
    EthereumBuilder.prototype.signTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, signedMsg, parseTx, serialTx;
            return __generator(this, function (_a) {
                response = fs.readFileSync("../data/signature_response.json", "utf-8");
                signedMsg = JSON.parse(response);
                parseTx = ether.ethers.utils.parseTransaction(signedMsg.preimage);
                serialTx = ether.ethers.utils.serializeTransaction(parseTx, signedMsg.signature.signature);
                return [2 /*return*/, serialTx];
            });
        });
    };
    ;
    //posts the transaction on the testnet and logs a link to view the transaction on the block explorer
    EthereumBuilder.prototype.postTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var network, broadcast, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        network = new ether.ethers.providers.AlchemyProvider(this.provider);
                        _b = (_a = network).sendTransaction;
                        return [4 /*yield*/, this.signTransaction()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2:
                        broadcast = _c.sent();
                        console.log(broadcast);
                        return [2 /*return*/];
                }
            });
        });
    };
    return EthereumBuilder;
}(builder_1.Builder));
exports.EthereumBuilder = EthereumBuilder;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var xPJ, xpj, builder, args, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    xPJ = fs.readFileSync("../data/xPJ.json", "utf-8");
                    xpj = JSON.parse(xPJ);
                    return [4 /*yield*/, new EthereumBuilder(xpj.xpub, xpj.path, 'goerli').init()];
                case 1:
                    builder = _c.sent();
                    args = process.argv;
                    if (!(args.length > 2)) return [3 /*break*/, 4];
                    if (!(args[2] == "--sign")) return [3 /*break*/, 3];
                    console.log("Signing and Posting Transaction!");
                    _b = (_a = builder).postTransaction;
                    return [4 /*yield*/, builder.signTransaction()];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    console.log("Transaction Posted!");
                    _c.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    console.log("Building Transaction!");
                    builder.createTransaction("0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1", 1000, builder.provider);
                    _c.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
