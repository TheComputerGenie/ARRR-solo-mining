var util = require('./util.js');
var init = require('../../init');
var bitcoin = require('bitgo-utxo-lib');
// public members
var txHash;
exports.txHash = function () {
    return txHash;
};
// TODO: examine and see how much is antiquated leftovers
function scriptCompile(addrHash) {
    script = bitcoin.script.compile(
        [
            bitcoin.opcodes.OP_DUP,
            bitcoin.opcodes.OP_HASH160,
            addrHash,
            bitcoin.opcodes.OP_EQUALVERIFY,
            bitcoin.opcodes.OP_CHECKSIG
        ]);
    return script;
}

exports.createGeneration = function (blockHeight, blockReward, feeReward, recipients, poolAddress) {
    var poolAddrHash = bitcoin.address.fromBase58Check(poolAddress).hash;
    let network = bitcoin.networks[init.coin]
    //console.log('network: ', network)
    let tx = new bitcoin.TransactionBuilder(network)
    tx.setVersion(bitcoin.Transaction.ZCASH_SAPLING_VERSION);
    // input for coinbase tx
    let blockHeightSerial = (blockHeight.toString(16).length % 2 === 0 ? '' : '0') + blockHeight.toString(16)

    let height = Math.ceil((blockHeight << 1).toString(2).length / 8)
    var lengthDiff = blockHeightSerial.length / 2 - height;
    for (let i = 0; i < lengthDiff; i++) {
        blockHeightSerial = `${blockHeightSerial}00`
    }
    let length = `0${height}`
    let serializedBlockHeight = new Buffer.concat([
        new Buffer(length, 'hex'),
        util.reverseBuffer(new Buffer(blockHeightSerial, 'hex')),
        new Buffer('00', 'hex') // OP_0
    ]);

    tx.addInput(new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
        4294967295,
        4294967295,
        new Buffer.concat([serializedBlockHeight,
            Buffer('4152525220736f6c6f2d6d696e696e672068747470733a2f2f6769746875622e636f6d2f546865436f6d707574657247656e69652f415252522d736f6c6f2d6d696e696e67', 'hex')])
        //ARRR solo-mining https://github.com/TheComputerGenie/ARRR-solo-mining
    );
    // because you can't have fees AND more than 1 vout
    if (recipients.length > 0) {
        var feePercent = 0;
        for (var i = 0; i < recipients.length; i++) {
            feePercent = feePercent + recipients[i].percent;
        }
        tx.addOutput(
            scriptCompile(poolAddrHash),
            Math.round(blockReward * (1 - (feePercent / 100)))
        );
        for (var i = 0; i < recipients.length; i++) {
            tx.addOutput(
                scriptCompile(bitcoin.address.fromBase58Check(recipients[i].address).hash),
                Math.round(blockReward * (recipients[i].percent / 100))
            );
        }
    } else {
        tx.addOutput(
            scriptCompile(poolAddrHash),
            blockReward + feeReward
        );
    }

    let txb = tx.build()
    txHex = txb.toHex()
    // assign
    txHash = txb.getHash().toString('hex');
    return txHex;
};

module.exports.getFees = function (feeArray) {
    var fee = Number();
    feeArray.forEach(function (value) {
        fee = fee + Number(value.fee);
    });
    return fee;
};
