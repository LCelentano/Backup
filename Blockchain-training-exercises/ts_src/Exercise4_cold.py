from hashlib import new
from mnemonic import Mnemonic
import binascii
from bip_utils import (Bip39SeedGenerator, Bip32Slip10Secp256k1, Bip32KeyIndex, Bip32PrivateKeySerializer, Secp256k1PrivateKey, Bip32KeyData,
                        Bip32Path, Bip32PathParser, Secp256k1PublicKey, Bip32PublicKeySerializer)
import bip32utils
import json
from io import StringIO
from eth_account import Account
import secrets
from web3 import Web3

language = Mnemonic("english")

# mnemo = language.generate(strength=128)

mnemo = 'food inmate escape rough like flavor fee moment change wheel film column'
path = "m/44'/60'/0'/0/0"
child_i = 0

seed = Bip39SeedGenerator(mnemo).Generate()
bip32 = Bip32Slip10Secp256k1.FromSeed(seed)
child = bip32.DerivePath(f"44'/60'/0'/0/{child_i}")

# child = bip32.ChildKey(Bip32KeyIndex.HardenIndex(44)) \
#                     .ChildKey(Bip32KeyIndex.HardenIndex(60)) \
#                     .ChildKey(Bip32KeyIndex.HardenIndex(0)) \
#                     .ChildKey(0)                            \
#                     .ChildKey(child_i)
                      
#xPub = child.PublicKey().ToExtended()
xPub = child.PublicKey().RawCompressed().ToHex()
xPub = f"0x{xPub}"
# xPub2 = child.PublicKey().RawUncompressed().ToBytes()
# print(xPub2)
# xPriv = child.PrivateKey().ToExtended()
# print(xPriv)
xPriv = child.PrivateKey().Raw().ToHex()
xPriv = f"0x{xPriv}"
print(xPriv)

depth = child.Depth().ToInt()
index = child.Index().ToInt()
chain = child.ChainCode().ToBytes()
pfprint = child.ParentFingerPrint().ToBytes()

key_data = Bip32KeyData(
    depth=depth,
    index=index,
    chain_code=chain,
    parent_fprint= pfprint
)

dictionary = {"xPub": xPub}
with open("ts_src\Child.json",'w') as outfile:
    json.dump(dictionary, outfile)

outfile.close()

infile = open("ts_src/transaction.json")
tx = json.load(infile)

infile.close()

signTx = Account.sign_transaction(tx, xPriv)
signature = {
    "rawTransaction":signTx['rawTransaction'].hex(),
    "hash":signTx['hash'].hex(),
    "r": signTx['r'],
    "s":signTx['s'],
    "v":signTx['v']
}
print(signature)
with open("ts_src/signature.json", "w") as signer:
    json.dump(signature, signer)

# super_path = Bip32PathParser("m/44'/60'/0'/0/0")
# for elem in super_path:
#     print(elem.IsHardened())

#xpub harden -> xpub non harden


#final goal get public key in json


# print(priv_key_ser)
#print(bip32)
# bip32 = Bip32Slip10Secp256k1.FromSeed(seed)

# new_child_bip32 = bip32.ChildKey(Bip32KeyIndex.HardenIndex(44)) \
#                     .ChildKey(Bip32KeyIndex.HardenIndex(60)) \
#                     .ChildKey(Bip32KeyIndex.HardenIndex(0)) \
#                     .ChildKey(0)                            \
#                     .ChildKey(0)    

# new_child_ctx = bip32_ctx.ChildKey(Bip32KeyIndex.HardenIndex(44)) \
#                     .ChildKey(Bip32KeyIndex.HardenIndex(60)) \
#                     .ChildKey(Bip32KeyIndex.HardenIndex(0)) \
#                     .ChildKey(0)                            \
#                     .ChildKey(0)

# print("bip32", bip32.PrivateKey())
# print("bip32 extend", bip32.PrivateKey().ToExtended())
# print("bip32_ctx", bip32_ctx.PrivateKey())
# print("bip32 extend ctx", bip32_ctx.PrivateKey().ToExtended())
# print("child32",new_child_bip32)
# print("child ctx", new_child_ctx)
    
# child_key = root_key

# bip32_ctx = Bip32Slip10Secp256k1.FromSeedAndPath(seed, path)
# print(bip32_ctx.PrivateKey())
# root = Xkey.parse_from_seed(seed)
# print(root)
