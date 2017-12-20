/**
 * Created by smartSense on 19/12/17.
 */
'use strict';

var Web3 = require('web3');
var web3;
var WalletController = require('./Controller/WalletController');

var SmartEthereumWallet = function SmartEthereumWallet(url) {
    var _this = this;
    web3 = new Web3(new Web3.providers.HttpProvider(url));
    WalletController.Init(web3);
    this.WalletController = WalletController;
};

module.exports = SmartEthereumWallet;

