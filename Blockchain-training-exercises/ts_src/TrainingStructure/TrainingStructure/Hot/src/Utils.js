"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeRecords = void 0;
const fs_1 = __importDefault(require("fs"));
const writeRecords = async (walletData, signatureRequests) => {
    if (walletData) {
        fs_1.default.writeFileSync('./data/wallet_data.json', JSON.stringify(walletData, null, '\t'), { flag: 'w+' });
    }
    if (signatureRequests) {
        fs_1.default.writeFileSync('./data/signature_requests.json', JSON.stringify(signatureRequests, null, '\t'), { flag: 'w+' });
    }
};
exports.writeRecords = writeRecords;
