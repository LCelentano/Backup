import * as fs from 'fs'; 
import { stringify } from 'querystring';
import { SignatureRequest } from "./SignatureRequest";

export const writeRecords = async (walletData?, signatureRequests?: { preimage: string, signatureRequests: SignatureRequest[] }) => {
    var json = JSON.stringify(signatureRequests)   
    fs.writeFileSync('../data/signature_requests.json',json)
}