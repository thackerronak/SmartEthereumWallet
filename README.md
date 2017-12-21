# SmartEthereumWallet
Ethereum Wallet and Contract Integration

[![NPM](https://nodei.co/npm/smartethereumwallet.png?compact=true)](https://nodei.co/npm/smartethereumwallet/) [![npm version](https://badge.fury.io/js/smartethereumwallet.svg)](https://badge.fury.io/js/smartethereumwallet)


## Installation

### Node.js

```bash
npm install --save smartethereumwallet
```

## Usage
- Importing library

```js
import * as SmartEthereumWallet from "smartethereumwallet";	
or
var SmartEthereumWallet = require('smartethereumwallet');
```

- Initalizing the library 


[Register](https://infura.io/register.html) for an INFURA TM Access Token.

```js
var smartEthereumWallet = new SmartEthereumWallet('https://mainnet.infura.io/{{YOUR TOKEN}}');
var walletController = smartEthereumWallet.WalletController;
```


- Create Ethereum Wallet/Account 

```js
walletController.createEthereumWallet(function (err, wallet) {
    if (err) {
        console.log("Error in createEthereumWallet", err);
    } else {
        console.log("Success in createEthereumWallet", wallet);
    }
});
```


- Encrypt the private key, to get the encrypted web3 keystore v3 JSON

```js
var userPassword = 'Abc';
var walletPrivateKey = '22c8445afef08d2bbd15ff5362bdd6ae69623255c9f4dd0d29c316ee0754c222';
var walletAddress = '0x4731F8558896766E67f0b552b9f434aEA3a301f6';

walletController.encryptWallet(walletPrivateKey, userPassword, function (err, keystore) {
    if (err) {
        console.log("Error in encryptWallet", err);
    } else {
        console.log("Success in encryptWallet", keystore);
    }
});
```


- Decrypt a keystore v3 JSON, and get the wallet/private key back

```js
var keyStore ={ version: 3,
    id: '65fba463-16d7-4a44-b3b5-607fff51db2b',
    address: '91a968a3cc7d28598df278b051492e25d3459e4d',
    crypto:
    { ciphertext: '767df5d97e2980d80bceb720426ff543e8116606341b5256caab7eb71f3321ec',
        cipherparams: { iv: 'a3904bcb6319a879efcd675fde320ceb' },
        cipher: 'aes-128-ctr',
            kdf: 'scrypt',
        kdfparams:
        { dklen: 32,
            salt: '1c7ec2d5d0f655d3a09279e2226d19a5ea87d4d6fcc042c90f58cddbcbb2f2a0',
            n: 8192,
            r: 8,
            p: 1 },
        mac: '1dfbbe2bc0e400aaf72ad7b8defa0d89f8110bab216766a412116eabc68890a9' } };

walletController.decryptWallet(keyStore, userPassword, function (err, wallet) {
    if (err) {
        console.log("Error in decryptWallet", err);
    } else {
        console.log("Success in decryptWallet", wallet);
    }
});
```


- Check if given Ethereum Address is valid

```js
var walletAddress = '0x4731F8558896766E67f0b552b9f434aEA3a301f6';
walletController.checkEthereumAddress(walletAddress, function (err, result) {
    if (err) {
        console.log("Error in checkEthereumAddress", err);
    } else {
        console.log("Success in checkEthereumAddress", result);
    }
});
```


- Check Ethereum Wallet Balance

```js
var walletAddress = '0x4731F8558896766E67f0b552b9f434aEA3a301f6';
walletController.checkAccountBalance(walletAddress, function (err, balance) {
    if (err) {
        console.log("Error in checkAccountBalance", err);
    } else {
        console.log("Success in checkAccountBalance", balance);
    }
});
```


- Get estimation for transaction

```js
var walletAddress = '0x4731F8558896766E67f0b552b9f434aEA3a301f6';
var destinationAddress = '0x1750c3F8ce7b30e6B89d7F1b017b28e64791e0AE';
walletController.getTransactionPriceAndEstimation(walletAddress, destinationAddress, function (err, estimate) {
    if (err) {
        console.log("Error in getTransactionPriceAndEstimation", err);
    } else {
        console.log("Success in getTransactionPriceAndEstimation", estimate);
    }
});
```


- Send Ether to another wallet

```js
var walletAddress = '0x4731F8558896766E67f0b552b9f434aEA3a301f6';
var walletPrivateKey = '22c8445afef08d2bbd15ff5362bdd6ae69623255c9f4dd0d29c316ee0754c222';
var destinationAddress = '0x1750c3F8ce7b30e6B89d7F1b017b28e64791e0AE';
var value = '0.01';//(Ether)
walletController.etherTransfer(walletAddress, walletPrivateKey, destinationAddress, value, function (err, txHash) {
    if (err) {
        console.log("Error in etherTransfer", err);
    } else {
        console.log("Success in etherTransfer", txHash);
    }
});
```


