/**
 * Created by smartSense on 04/01/18.
 */
/**
 * Created by smartSense on 27/12/17.
 */

'use strict';
var async = require('async');
var Tx = require('ethereumjs-tx');


var web3;
var contractObj;
var CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"startTransafer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sender","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalsupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"stopTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

var CoinController = function () {
};

CoinController.prototype.Init = function (_web3, contractAddress) {
    web3 = _web3;
    contractObj = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
};

let signTransaction = function (address, functionData, privateKey, callback) {
    var gasObj = {
        to: contractObj.options.address,
        from: address,
        data: functionData
    };
    async.parallel({
        nonce: web3.eth.getTransactionCount.bind(web3.eth, address),
        gasPrice: web3.eth.getGasPrice.bind(web3.eth),
        gasEstimate: web3.eth.estimateGas.bind(web3.eth, gasObj),
        balance:  web3.eth.getBalance.bind(web3.eth, address)
    }, function (err, results) {
        if (err) {
            return callback(err, null);
        } else
        // return callback(null, results);
            try {
                // console.log("---", results);
                if (web3.utils.toWei(results.balance, 'ether') < (results.gasEstimate * results.gasPrice)) {
                    return callback('low balance', null);
                } else {
                    var tx = new Tx({
                        to: contractObj.options.address,
                        nonce: results.nonce,
                        gasPrice: web3.utils.toHex(results.gasPrice),
                        gasLimit: web3.utils.toHex(results.gasEstimate),
                        data: functionData
                    });
                    tx.sign(new Buffer(privateKey, 'hex'));
                    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (err, response) {
                        if (err) {
                            return callback(err, null);
                        } else
                            return callback(null, response);
                    });
                }
            } catch (e) {
                return callback(e, null);
            }
    });
};

CoinController.prototype.startTokenTransfer = function (address, privateKey, callback) {
    try {
        var data = contractObj.methods.startTransafer().encodeABI();
        signTransaction(address, data, privateKey, callback);
    } catch (e) {
        return callback(e, null);
    }
};

CoinController.prototype.stopTokenTransfer = function (address, privateKey, callback) {
    try {
        var data = contractObj.methods.stopTransfer().encodeABI();
        signTransaction(address, data, privateKey, callback);
    } catch (e) {
        return callback(e, null);
    }
};

CoinController.prototype.getTokenTransferStage = function (callback) {
    try {
        contractObj.methods.stage().call(function (err, result) {
            if (err) {
                return callback(err, null);
            } else
                return callback(null, result);
        });
    } catch (e) {
        return callback(e, null);
    }
};

CoinController.prototype.getTokenBalance = function (address,callback) {
    try {
        contractObj.methods.balanceOf(address).call(function (err, result) {
            if (err) {
                return callback(err, null);
            } else
                return callback(null, web3.utils.fromWei(result, 'ether'));
        });
    } catch (e) {
        return callback(e, null);
    }
};

CoinController.prototype.tokenTransfer = function (address, privateKey, destinationAddress, value,mainCallback) {
    try {
        async.series([
            function (callback) {
                module.exports.getTokenBalance(address, function (err, res) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        // console.log(res)
                        if (res < value) {
                            return callback('low balance', null);
                        }else {
                            return callback(null, res);
                        }
                    }
                });
            },
            function (callback) {
                module.exports.getTokenTransferStage(function (err, res) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if (res == '0') {
                            return callback('transfer stop', null);
                        }else {
                            return callback(null, res);
                        }
                    }
                });
            }
        ], function (err, results) {
            if (err) {
                return mainCallback(err, null);
            } else {
                // console.log(results);
                var transferValue = web3.utils.toWei(value, 'ether');
                var data = contractObj.methods.transfer(destinationAddress, transferValue).encodeABI();
                signTransaction(address, data, privateKey, mainCallback);
            }
        });
    } catch (e) {
        return mainCallback(e, null);
    }
};

module.exports = new CoinController();
