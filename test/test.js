"use strict";
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var SmartEthereumWallet = require('./../index');
var smartEthereumWallet = new SmartEthereumWallet('https://kovan.infura.io/kixyOXvZF8wkkqqryELG');

describe('Wallet', function () {

    var walletController = smartEthereumWallet.WalletController;
    var walletAddress;
    var walletPrivateKey;
    var userPassword = 'abc';
    var keyStore;

    describe('CreateWallet', function () {
        it('createEthereumWallet() must return public address and private key', function () {
            walletController.createEthereumWallet(function (err, wallet) {
                expect(err).to.be.null;
                expect(wallet).to.have.property('address');
                expect(wallet).to.have.property('privateKey');
                walletAddress = wallet.address;
                walletPrivateKey = wallet.privateKey;
            });
        });
    });

    describe('EncryptWallet', function () {
        it('encryptWallet() must return keystore', function () {
            walletController.encryptWallet(walletPrivateKey, userPassword, function (err, keystore) {
                expect(err).to.be.null;
                expect(keystore).to.be.not.null;
                keyStore = keystore;
            });
        });
    });

    describe('DecryptWallet', function () {
        it('decryptWallet() must return public address and private key', function () {
            walletController.decryptWallet(keyStore, userPassword, function (err, wallet) {
                expect(err).to.be.null;
                expect(wallet).to.be.not.null;
                expect(wallet.address).to.equal(walletAddress);
                expect(wallet.privateKey).to.equal(walletPrivateKey);
            });
        });
    });

    describe('CheckEthereumAddress', function () {
        it('checkEthereumAddress() must return true', function () {
            walletController.checkEthereumAddress(walletAddress, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.be.true;
            });
        });
    });

    describe('CheckAccountBalance', function () {
        it('checkAccountBalance() must return balance', function (done) {
            walletController.checkAccountBalance(walletAddress, function (err, balance) {
                if (err) done(err); else {
                    expect(balance).to.be.not.null;
                    done();
                }
            });
        });
    });

    var address = '0x4731F8558896766E67f0b552b9f434aEA3a301f6';

    describe('GetTransactionPriceAndEstimation', function () {
        it('getTransactionPriceAndEstimation() must return info', function (done) {
            walletController.getTransactionPriceAndEstimation(address, walletAddress, function (err, info) {
                if (err) done(err);
                else {
                    expect(info).to.be.not.null;
                    done();
                }
            });
        });
    });




    var privateKey = '22c8445afef08d2bbd15ff5362bdd6ae69623255c9f4dd0d29c316ee0754c222';
    var destinationAddress = '0x1750c3F8ce7b30e6B89d7F1b017b28e64791e0AE';
    var value = '0.01';

    describe('EtherTransfer', function () {
        it('etherTransfer() must return Transaction Hash', function (done) {
            walletController.etherTransfer(address, privateKey, destinationAddress, value, function (err, txHash) {
                if (err) done(err);
                else {
                    expect(txHash).to.be.not.null;
                    done();
                }
            });
        });
    });

    var transactionHash = '0xc2e7ea59672002c6936e168c20029211cfe77ce87c2e4a40f1debc8480e589a8';
    describe('TransactionReceipt', function () {
        it('getTransactionReceipt() must return info', function (done) {
            walletController.getTransactionReceipt(transactionHash, function (err, info) {
                if (err) done(err);
                else {
                    expect(info).to.be.not.null;
                    done();
                }
            });
        });
    });

});


var CONTRACT_ADDRESS = '0xa000d988836633ce4cd43158884660e9155230d1';
describe('MultiSig', function () {

    var multiSigController = smartEthereumWallet.MultiSigController(CONTRACT_ADDRESS);

    var walletAddress = '0xCCDDCcdeBd0C15590b33b41c40F3361f764fd07c';
    var privateKeys = ['d6031505b3b45dd1be7d72486dec0b7f95eee2db329fc28a1a3b3a09904a7806', 'f521491660b385f0f6ecb0266df4648d57016b7c455e04f77378c36ab7cfaf6c'];
    var destinationAddress = '0x8374D21710cE53a13686aabd67ee13d4b27D1933';
    var value = '0.01';
    var tokenContractAddress = '';

    describe('Ether Token Transfer', function () {
        it('etherTokenTransfer() must return transaction hash', function (done) {
            multiSigController.etherTokenTransfer(walletAddress, privateKeys, destinationAddress, value, tokenContractAddress, function (err, txHash) {
                if (err) done(err);
                else {
                    expect(txHash).to.be.not.null;
                    done();
                }
            });
        });
    });
});