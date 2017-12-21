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
    var value = '0.001';//(Ether)

    describe('EtherTransfer', function () {
        it('etherTransfer() must return Transaction Hash', function (done) {
            walletController.etherTransfer(address, privateKey, walletAddress, value, function (err, txHash) {
            // walletController.etherTransfer(walletAddress, walletPrivateKey, address, value, function (err, txHash) {
                if (err) done(err);
                else {
                    expect(txHash).to.be.not.null;
                    done();
                }
            });
        });
    });

});