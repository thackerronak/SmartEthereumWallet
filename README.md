# SmartEthereumWallet [![Build Status][travis-image]][travis-url]
Ethereum Wallet and Contract Integration

[![npm version](https://badge.fury.io/js/smartethereumwallet.svg)](https://badge.fury.io/js/smartethereumwallet)

### Updates

```bash
0.3.0 - Coin Support
0.2.0 - MultiSig Wallet Support
0.1.0 - Wallet Support
```

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


[Register](https://infura.io/signup) for an INFURA TM Access Token.

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

- Get Transaction Receipt

```js
var transactionHash = '0xc2e7ea59672002c6936e168c20029211cfe77ce87c2e4a40f1debc8480e589a8';
walletController.getTransactionReceipt(transactionHash, function (err, hash) {
    if (err) {
        console.log("Error in getTransactionReceipt", err);
    } else {
        console.log("Success in getTransactionReceipt", hash);
    }
});
```

- Initialize MultiSigController


```js
var smartEthereumWallet = new SmartEthereumWallet('https://mainnet.infura.io/{{YOUR TOKEN}}');
var CONTRACT_ADDRESS = '{{CONTRACT ADDRESS}}';
var multiSigController = smartEthereumWallet.MultiSigController(CONTRACT_ADDRESS);
```



- Ether Token Transfer

```js
var walletAddress = '{{ADDRESS}}';
var privateKeys = ['{{PRIVATE KEY 1}}', '{{PRIVATE KEY 2}}'];
var destinationAddress = '{{DESTINATION ADDRESS}}';
var value = '{{VALUE}}'; (Ether/Token)
var tokenContractAddress = '{{TOKEN ADDRESS}}'; (if you want pass ether then put empty '')

multiSigController.etherTokenTransfer(walletAddress, privateKeys, destinationAddress, value, tokenContractAddress, function (err, txHash) {
    if (err) {
        console.log("Error in etherTokenTransfer", err);
    } else {
        console.log("Success in etherTokenTransfer", txHash);
    }
});
```



- Initialize CoinController


```js
var smartEthereumWallet = new SmartEthereumWallet('https://mainnet.infura.io/{{YOUR TOKEN}}');
var CONTRACT_ADDRESS = '{{CONTRACT ADDRESS}}';
var coinController = smartEthereumWallet.CoinController(CONTRACT_ADDRESS);
```


- Get Token Transfer Stage

```js
coinController.getTokenTransferStage(function (err, txHash) {
    if (err) {
        console.log("Error in getTokenTransferStage", err);
    } else {
        console.log("Success in getTokenTransferStage", txHash);
    }
});
```

- Start Token Transfer

```js
var walletPrivateKey = 'd6031505b3b45dd1be7d72486dec0b7f95eee2db329fc28a1a3b3a09904a7806';
var walletAddress = '0xccddccdebd0c15590b33b41c40f3361f764fd07c';
coinController.startTokenTransfer(walletAddress, walletPrivateKey, function (err, txHash) {
    if (err) {
        console.log("Error in startTokenTransfer", err);
    } else {
        console.log("Success in startTokenTransfer", txHash);
    }
});
```

- Stop Token Transfer

```js
var walletPrivateKey = 'd6031505b3b45dd1be7d72486dec0b7f95eee2db329fc28a1a3b3a09904a7806';
var walletAddress = '0xccddccdebd0c15590b33b41c40f3361f764fd07c';
coinController.stopTokenTransfer(walletAddress, walletPrivateKey, function (err, txHash) {
    if (err) {
        console.log("Error in stopTokenTransfer", err);
    } else {
        console.log("Success in stopTokenTransfer", txHash);
    }
});
```


- Get Token Balance

```js
var walletAddress = '0xccddccdebd0c15590b33b41c40f3361f764fd07c';
coinController.getTokenBalance(walletAddress, function (err, txHash) {
    if (err) {
        console.log("Error in getTokenBalance", err);
    } else {
        console.log("Success in getTokenBalance", txHash);
    }
});
```


- Token Transfer

```js
var walletPrivateKey = 'd6031505b3b45dd1be7d72486dec0b7f95eee2db329fc28a1a3b3a09904a7806';
var walletAddress = '0xccddccdebd0c15590b33b41c40f3361f764fd07c';
var destinationAddress = '0x8374D21710cE53a13686aabd67ee13d4b27D1933';
var value = '0.1';
coinController.tokenTransfer(walletAddress, walletPrivateKey, function (err, txHash) {
    if (err) {
        console.log("Error in tokenTransfer", err);
    } else {
        console.log("Success in tokenTransfer", txHash);
    }
});
```

[travis-image]: https://travis-ci.org/thackerronak/SmartEthereumWallet.svg
[travis-url]: https://travis-ci.org/thackerronak/SmartEthereumWallet
