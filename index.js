/**
 * Created by smartSense on 19/12/17.
 */
'use strict';

var Web3 = require('web3');
var web3;
var WalletController = require('./Controller/WalletController');
var MultiSigController = require('./Controller/MultiSigController');
var CoinController = require('./Controller/CoinController');

var SmartEthereumWallet = function SmartEthereumWallet(url) {
    var _this = this;
    web3 = new Web3(new Web3.providers.HttpProvider(url));
    WalletController.Init(web3);
    this.WalletController = WalletController;

    // Initialize MultiSigController with given contractAddress
    this.MultiSigController = function (contractAddress) {
        MultiSigController.Init(web3,contractAddress);
        return MultiSigController;
    };

    // Initialize CoinController with given contractAddress
    this.CoinController = function (contractAddress) {
        CoinController.Init(web3,contractAddress);
        return CoinController;
    };

};

module.exports = SmartEthereumWallet;

