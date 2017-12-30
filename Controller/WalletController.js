/**
 * Created by smartSense on 19/12/17.
 */
'use strict';
var async = require('async');
var Tx = require('ethereumjs-tx');
var web3;

var WalletController = function () {
};

var getEstimation = function (address, destinationAddress, callback) {
    try {
        var gasObj = {
            to: destinationAddress,
            from: address
        };
        async.parallel({
            nonce: web3.eth.getTransactionCount.bind(web3.eth, address),
            gasPrice: web3.eth.getGasPrice.bind(web3.eth),
            gasEstimate: web3.eth.estimateGas.bind(web3.eth, gasObj),
            balance: web3.eth.getBalance.bind(web3.eth, address)
        }, function (err, results) {
            // console.log(results);
            if (err) {
                return callback(err, null);
            } else {
                results.balance = web3.utils.fromWei(results.balance, 'ether');
                results.totalEstimateCost = (results.gasEstimate * results.gasPrice);
                return callback(null, results);
            }
        });
    } catch (e) {
        return callback(e, null);
    }
};

var sendTransaction = function (address, walletPrivateKey, destinationAddress, transferValue, callback) {
    try {
        getEstimation(address, destinationAddress, function (err, results) {
            // console.log(results);
            if (err)
                return callback(err, null);
            else if (web3.utils.toWei(results.balance, 'ether') < (transferValue + (results.gasEstimate * results.gasPrice))) {
                return callback('low balance', null);
            } else {
                var tx = new Tx({
                    to: results.destinationAddress,
                    nonce: results.nonce,
                    gasPrice: web3.utils.toHex(results.gasPrice),
                    gasLimit: web3.utils.toHex(53000),//results.gasEstimate
                    value: web3.utils.toHex(transferValue)
                });
                tx.sign(new Buffer(walletPrivateKey, 'hex'));
                web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (err, response) {
                    if (err) {
                        return callback(err, null);
                    } else
                        return callback(null, response);
                });
            }
        });
    } catch (e) {
        return callback(e, null);
    }
};

WalletController.prototype.Init = function (_web3) {
    web3 = _web3;
};

WalletController.prototype.createEthereumWallet = function (callback) {
    try {
        var wallet = web3.eth.accounts.create();
        var body = {
            address: wallet.address,
            privateKey: wallet.privateKey.substring(2, wallet.privateKey.length)
        };
        return callback(null, body);
    } catch (e) {
        return callback(e, null);
    }
};

WalletController.prototype.encryptWallet = function (walletPrivateKey, password, callback) {
    try {
        var keyStore = web3.eth.accounts.encrypt(walletPrivateKey, password);
        return callback(null, keyStore);
    } catch (e) {
        return callback(e, null);
    }
};

WalletController.prototype.decryptWallet = function (keyStore, password, callback) {
    try {
        var wallet = web3.eth.accounts.decrypt(keyStore, password);
        var body = {
            address: wallet.address,
            privateKey: wallet.privateKey.substring(2, wallet.privateKey.length)
        };
        return callback(null, body);
    } catch (e) {
        return callback(e, null);
    }
};

WalletController.prototype.checkAccountBalance = function (address, callback) {
    try {
        web3.eth.getBalance(address).then(function (res) {
            callback(null, web3.utils.fromWei(res, 'ether'));
        });
    } catch (e) {
        callback(e, null);
    }
};

WalletController.prototype.checkEthereumAddress = function (address, callback) {
    try {
        callback(null, web3.utils.isAddress(address));
    } catch (e) {
        callback(e, null);
    }
};

WalletController.prototype.getTransactionPriceAndEstimation = function (address, destinationAddress, callback) {
    try {
        getEstimation(address, destinationAddress, callback);
    } catch (e) {
        return callback(e, null);
    }
};

WalletController.prototype.etherTransfer = function (address, walletPrivateKey, destinationAddress, value, callback) {
    try {
        var transferValue = web3.utils.toWei(value, 'ether');
        sendTransaction(address, walletPrivateKey, destinationAddress, transferValue, callback);
    } catch (e) {
        return callback(e, null);
    }
};

WalletController.prototype.getTransactionReceipt = function (txHash, callback) {
    try {
        web3.eth.getTransactionReceipt(txHash, function (err, res) {
            if (err) {
                return callback(err, null);
            } else
                callback(null, res);
        });
    } catch (e) {
        return callback(e, null);
    }
};


module.exports = new WalletController();
