# Our Team

We are the research team, our job is to learn about different coins and how to implement cold solutions with them. 

As a member of the Blockchain Research team, one of your main tasks will be to build and split wallets for various coins into a *hot* and a *cold* file. 


The *hot* file (also known as a builder) is the only file that communicates with the internet. The cold file operates offline and stores the private key and mnemonic seed. The cold file only communicates with the builder through reading and writing to json files. 

Separating the two files ensures private keys are stored securely.

The builder will create transactions and send them to the *cold* file to be signed. The *cold* file will then return the signed transaction to the builder and the builder will broadcast the transaction to the network.

# Creating an Ethereum Wallet

## Your Task

Your task is to implement an Ethereum wallet. This wallet will contain a cold file that signs transactions and a hot file that creates and posts transactions.

Read more about Etherum [here](https://github.com/ethereumbook/ethereumbook/blob/develop/01what-is.asciidoc) and [here](https://github.com/ethereumbook/ethereumbook/blob/develop/02intro.asciidoc).

Read more about Ethereum wallets and cold wallets [here](https://github.com/ethereumbook/ethereumbook/blob/develop/05wallets.asciidoc).

### Getting started

> *Task:* Write a hot-only implementation of an Ethereum wallet. This should be one file that constructs, signs, and broadcasts a transaction. The [EthersJS](https://docs.ethers.io/v5/) Library should be helpful here.

To get started you will need to set up an account with a network provider like [Alchemy](https://www.alchemy.com/). 


Create an account and set up an application on an Ethereum test network. See [this](https://docs.ethers.io/v5/api-keys/#api-keys--alchemy) for guidance on setting up the provider.

### Separating Hot from Cold

> *Task:* Once your hot-only implementation of an Ethereum wallet is working, split the wallet into two separate files. One builder file and one cold file (use python for this). The cold wallet will initialize wallets, receive signature requests and send signature responses.


Think carefully about the information you will need to send between the two files!



