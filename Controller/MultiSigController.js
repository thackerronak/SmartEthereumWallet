
/**
 * Created by smartSense on 27/12/17.
 */

'use strict';
var web3;
var contractObj;


var MultiSigController = function () {
};

MultiSigController.prototype.Init = function (_web3, contractABI, contractAddress) {
    web3 = _web3;
    contractObj = new web3.eth.Contract(contractABI, contractAddress);
};



module.exports = new MultiSigController();
