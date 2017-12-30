/**
 * Created by smartSense on 27/12/17.
 */

'use strict';
var async = require('async');
var Tx = require('ethereumjs-tx');
const leftPad = require('left-pad');
const util = require("ethereumjs-util");
const BigNumber = require('bignumber.js');


var web3;
var contractObj;
var CONTRACT_ABI =[{"constant":true,"inputs":[],"name":"threshold","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner2","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner1","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"destination","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TransferEther","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenAddress","type":"address"},{"indexed":false,"name":"destination","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TransferToken","type":"event"},{"constant":false,"inputs":[{"name":"sigV","type":"uint8[]"},{"name":"sigR","type":"bytes32[]"},{"name":"sigS","type":"bytes32[]"},{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"tokenAddress","type":"address"}],"name":"execute","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}];

var MultiSigController = function () {
};

MultiSigController.prototype.Init = function (_web3, contractAddress) {
    web3 = _web3;
    contractObj = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
};

var createSignatures = function (privateKeys, multiSigContractAddress, nonce, destinationAddress, tokenAddress) {
    try {
        let input = '0x19' + '00' + multiSigContractAddress.slice(2) + destinationAddress.slice(2) + leftPad(nonce.toString('16'), '64', '0') + leftPad((new BigNumber(Number(tokenAddress))).toString('16'), '2', '0');
        let hash = web3.utils.sha3(input)

        let sigV = []
        let sigR = []
        let sigS = []

        for (let i = 0; i < privateKeys.length; i++) {
            let sig = util.ecsign(new Buffer(util.stripHexPrefix(hash), 'hex'), new Buffer(privateKeys[i], 'hex'));
            sigV.push(sig.v)
            sigR.push('0x' + sig.r.toString('hex'))
            sigS.push('0x' + sig.s.toString('hex'))
        }

        return (null,{sigV: sigV, sigR: sigR, sigS: sigS});
    } catch (e) {
        // console.log(e);
        return (e, null);
    }
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

MultiSigController.prototype.etherTokenTransfer = function (walletAddress, privateKeys, destinationAddress, value, tokenAddress, mainCallback) {
    try {
        var nonce = 0;
        async.series([
            function (callback) {
                contractObj.methods.nonce().call(function (err, result) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        nonce = Number(result);
                        return callback(null, result);
                    }
                });
            },
            function (callback) {
                var hasTokenAddress = tokenAddress ? true : false;
                return callback(null,createSignatures(privateKeys, contractObj.options.address, nonce, destinationAddress, hasTokenAddress))
            }
        ], function (err, results) {
            // console.log("---", results);
            if (err) {
                return mainCallback(err, null);
            } else {
                var transferValue = web3.utils.toWei(value, 'ether');
                var data = contractObj.methods.execute(results[1].sigV, results[1].sigR, results[1].sigS, destinationAddress, Number(transferValue), tokenAddress).encodeABI();
                signTransaction(walletAddress, data, privateKeys[0], mainCallback);
            }
        });
    } catch (e) {
        return mainCallback(e, null);
    }
};


module.exports = new MultiSigController();
