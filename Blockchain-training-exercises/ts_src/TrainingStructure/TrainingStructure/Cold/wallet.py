from cmath import inf
from bip_utils import (Bip39MnemonicGenerator, Bip39MnemonicValidator,Bip39WordsNum, Bip44, Bip44Coins, Bip39SeedGenerator, 
                        Secp256k1, Bip32Slip10Secp256k1, Bip32Secp256k1)                                             
from os.path import exists
from coincurve import PublicKey
# import binascii
# # from eth_account.signers.local import LocalAccount
# from eth_account import Account
# # from web3.middleware import construct_sign_and_send_raw_middleware
from web3.auto import w3
from eth_account.messages import encode_defunct
import json
import os
import sys
import pathlib
from eth_account import Account
# from hdwallet import BIP44HDWallet
# from hdwallet.cryptocurrencies import EthereumMainnet
# from hdwallet.derivations import BIP44Derivation
# from hdwallet.utils import generate_mnemonic
# from typing import Optional


class Cold:
    coins = {'60':Bip44Coins.ETHEREUM}
    # def __init__(self, profile_id: str):
    #     pass

    def generate_cold_mnemonic(self) -> str:
        if exists(os.path.join(sys.path[0],"mnemonic.txt")) == True:
            with open(os.path.join(sys.path[0],"mnemonic.txt"),'r') as f:
                mnemonic = f.read().split(' ')
            check = all(x.isalpha() for x in mnemonic)
            is_valid = Bip39MnemonicValidator().IsValid(mnemonic=" ".join(mnemonic))
            if check == True and is_valid == True:
                return " ".join(mnemonic)
            else:
                # mnemonic: str = generate_mnemonic(language="english", strength=256)
                mnemonic = Bip39MnemonicGenerator().FromWordsNumber(Bip39WordsNum.WORDS_NUM_24)
                return mnemonic
        else:
            # mnemonic: str = generate_mnemonic(language="english", strength=256)
            mnemonic = Bip39MnemonicGenerator().FromWordsNumber(Bip39WordsNum.WORDS_NUM_24)
            return mnemonic
            
        # """
        # Create the base mnemonic to be securely stored. This mnemonic will be used to derive all keys and addresses.

        # :return: Twenty-four word mnemonic phrase.
        # """
        # if a valid mnemonic exists at file path, read and return it

    def generate_private_key(self, path: str, salt: str = "") -> str:
        path_chk = path.split("/")
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        if path_chk[2].replace("'","") in Cold.coins.keys():
            seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
            #bip44 = Bip44.FromSeed(seed, Cold.coins[path_chk[2].replace("'","")])
            bip32 = Bip32Slip10Secp256k1.FromSeedAndPath(seed, path)
            priv = bip32.PrivateKey().Raw().ToHex()
            return priv
        
        # """
        # Generates a private key at a given path

        # :param path: BIP-44-like HD wallet path
        # :param salt: passphrase for added protection or separation for HD wallet keys
        # :return: secret key data at the given path of the HD wallet
        # """

    def generate_public_key(self, path: str, salt: str = "") -> str:
        path_chk = path.split("/")
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        if path_chk[2].replace("'","") in Cold.coins.keys():
            seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
            #bip44 = Bip44.FromSeed(seed, Cold.coins[path_chk[2].replace("'","")])
            bip32 = Bip32Slip10Secp256k1.FromSeedAndPath(seed, path)
            pub = bip32.PublicKey().RawCompressed().ToHex()
            #pub = f'0x{pub}'
            return pub
        
        # """
        # Generates a public key at a given path

        # :param path: BIP-44-like HD wallet path
        # :param salt: passphrase for added protection or separation for HD wallet keys
        # :return: public key data at the given path of the HD wallet
        # """

    def generate_xprv(self, path: str, salt: str = "") -> str:
        path_chk = path.split("/")
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        if path_chk[2].replace("'","") in Cold.coins.keys():
            seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
            #bip44 = Bip44.FromSeed(seed, Cold.coins[path_chk[2].replace("'","")])
            bip32 = Bip32Slip10Secp256k1.FromSeedAndPath(seed, path)
            xpriv = bip32.PrivateKey().ToExtended()
            return xpriv

    #     """
    #     Generates an extended private key at a given path

    #     :param path: BIP-44-like HD wallet path
    #     :param salt: passphrase for added protection or separation for HD wallet keys
    #     :return: bech32-encoded private key data at the given path of the HD wallet that further derive private keys
    #     """

    def generate_xpub(self, path: str, salt: str = "") -> str:
        path_chk = path.split("/")
        passphrase = salt
        mnemonic = Cold.generate_cold_mnemonic(self)
        if path_chk[2].replace("'","") in Cold.coins.keys():
            seed = Bip39SeedGenerator(mnemonic).Generate(passphrase)
            #bip44 = Bip44.FromSeed(seed, Cold.coins[path_chk[2].replace("'","")])
            bip32 = Bip32Slip10Secp256k1.FromSeedAndPath(seed, path)
            xpub = bip32.PublicKey().ToExtended()
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

    def sign(self, private_key: str, message: str) -> str:
        signatureRequests = message
        msg = message['signatureRequests'][0]['message']
        msg = encode_defunct(text=msg)
        print(msg)
        signed_msg = Account.sign_message(msg, private_key=private_key)
        signature = {
            "messageHash":signed_msg['messageHash'].hex(),
            "r": signed_msg['r'],
            "s":signed_msg['s'],
            "v":signed_msg['v'],
            "signature":signed_msg['signature'].hex()
        }
        signatureResponse = {
            "preimage": signatureRequests['preimage'],
            "publicKey":  signatureRequests['signatureRequests'][0]['publicKey'],
            "path": signatureRequests['signatureRequests'][0]['path'],
            "curve":signatureRequests['signatureRequests'][0]['curve'],
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
print("private",c.generate_private_key("m/44'/60'/0'/", ""))
print("public",c.generate_public_key("m/44'/60'/0'", ""))
print("xpub", c.generate_xpub("m/44'/60'/0'", ""))    
print("xpriv", c.generate_xprv("m/44'/60'/0'/", ""))
c.sign(private_key=c.generate_private_key("m/44'/60'/0'", ""), message=json.load(open("ts_src/TrainingStructure/TrainingStructure/Hot/data/signature_requests.json")))
# print(os.listdir("/Hot/data"))