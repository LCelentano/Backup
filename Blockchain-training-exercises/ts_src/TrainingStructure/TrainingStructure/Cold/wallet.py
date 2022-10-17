from bip_utils import (Bip39MnemonicGenerator, Bip39MnemonicValidator,Bip39WordsNum, Bip44, Bip44Coins, Bip39SeedGenerator, 
                        Secp256k1, Bip32Slip10Secp256k1, Bip32Secp256k1)                                             
from os.path import exists
import json
import os
import sys
from eth_account import Account


class Cold:

    def generate_cold_mnemonic(self) -> str:
        if exists(os.path.join(sys.path[0],"mnemonic.txt")) == True:
            with open(os.path.join(sys.path[0],"mnemonic.txt"),'r') as f:
                mnemonic = f.read().split(' ')
            check = all(x.isalpha() for x in mnemonic)
            is_valid = Bip39MnemonicValidator().IsValid(mnemonic=" ".join(mnemonic))
            if check == True and is_valid == True:
                return " ".join(mnemonic)
            else:
                mnemonic = Bip39MnemonicGenerator().FromWordsNumber(Bip39WordsNum.WORDS_NUM_24)
                return mnemonic
        else:
            mnemonic = Bip39MnemonicGenerator().FromWordsNumber(Bip39WordsNum.WORDS_NUM_24)
            return mnemonic
            
        # """
        # Create the base mnemonic to be securely stored. This mnemonic will be used to derive all keys and addresses.

        # :return: Twenty-four word mnemonic phrase.
        # """
        # if a valid mnemonic exists at file path, read and return it

    def generate_private_key(self, path: str, salt: str = "") -> str:
        path = path
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
        bip32 = Bip32Slip10Secp256k1.FromSeed(seed)
        child = bip32.DerivePath(path)    
        priv = child.PrivateKey().Raw().ToHex()    
        return priv
        
        # """
        # Generates a private key at a given path

        # :param path: BIP-44-like HD wallet path
        # :param salt: passphrase for added protection or separation for HD wallet keys
        # :return: secret key data at the given path of the HD wallet
        # """

    def generate_public_key(self, path: str, salt: str = "") -> str:
        path = path
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
        bip32 = Bip32Slip10Secp256k1.FromSeed(seed)
        child = bip32.DerivePath(path)
        pub = child.PublicKey().RawCompressed().ToHex()
        return pub
        
        # """
        # Generates a public key at a given path

        # :param path: BIP-44-like HD wallet path
        # :param salt: passphrase for added protection or separation for HD wallet keys
        # :return: public key data at the given path of the HD wallet
        # """

    def generate_xprv(self, path: str, salt: str = "") -> str:
        path = path
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        seed = Bip39SeedGenerator(mnemonic).Generate(passphrase=passphrase)
        bip32 = Bip32Slip10Secp256k1.FromSeed(seed)
        child = bip32.DerivePath(path)
        xpriv = child.PrivateKey().ToExtended()
        return xpriv

    #     """
    #     Generates an extended private key at a given path

    #     :param path: BIP-44-like HD wallet path
    #     :param salt: passphrase for added protection or separation for HD wallet keys
    #     :return: bech32-encoded private key data at the given path of the HD wallet that further derive private keys
    #     """

    def generate_xpub(self, path: str, salt: str = "") -> str:
        path = path
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
        bip32 = Bip32Slip10Secp256k1.FromSeed(seed)
        child = bip32.DerivePath(path)
        xpub = child.PublicKey().ToExtended()

        xpubJson = {
            "xpub":xpub,
            "path":path
        }
        with open("ts_src/TrainingStructure/TrainingStructure/Hot/data/xPJ.json", "w") as outfile:    
                json.dump(xpubJson, outfile)
                
        return xpub
    #     """
    #     Generates an extended public key at a given path

    #     :param path: BIP-44-like HD wallet path
    #     :param salt: passphrase for added protection or separation for HD wallet keys
    #     :return: bech32-encoded public key data at the given path of the HD wallet that further derive public keys
    #     """

    def sign(self, private_key: str, message: str, salt: str = "") -> str:
        signatureRequests = message
        message = message['signatureRequests'][0]['message']
        signed_msg = Account.from_key(private_key).signHash(message)

        signature = {
            "messageHash":signed_msg['messageHash'].hex(),
            "r":str(signed_msg['r']),
            "s":str(signed_msg['s']),
            "v":signed_msg['v'],
            "signature":signed_msg['signature'].hex()
        }

        signatureResponse = {
            "preimage": signatureRequests['preimage'],
            "publicKey":  signatureRequests['signatureRequests'][0]['publicKey'],
            "path": signatureRequests['signatureRequests'][0]['path'],
            "curve":signatureRequests['signatureRequests'][0]['curve'],
            "messageHash": message,
            "signature": signature
        }

        with open("ts_src/TrainingStructure/TrainingStructure/Hot/data/signature_response.json", "w") as outfile:    
            return json.dump(signatureResponse, outfile)

    #     """
    #     Signs a message using the appropriate algorithm for the coin

    #     :param private_key: secret key used to produce cryptographic signature
    #     :param message: data that is to be signed
    #     :return: signature as r and s concatenated as a string
    #     """
c = Cold()   
# print("private",c.generate_private_key("m/44'/60'/0'/0", ""))
# print("public",c.generate_public_key("m/44'/60'/0'/0", ""))
print("xpub", c.generate_xpub("m/44'/60'/0'/0/0", ""))    
# print("xpriv", c.generate_xprv("m/44'/60'/0'/0", ""))
c.sign(private_key=c.generate_private_key("m/44'/60'/0'/0/0", ""), message=json.load(open("ts_src/TrainingStructure/TrainingStructure/Hot/data/signature_requests.json")),salt="")