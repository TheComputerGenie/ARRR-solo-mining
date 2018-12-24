var util = require('./util.js');
var ev = require('equihashverify');
var diff1 = global.diff1 = 0x0007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
// TODO: there's no reason to have both diffs, but deep edits needed elsewhere to use just 1
var algos = module.exports = global.algos = {
    'equihash': {
        multiplier: 1,
        diff: parseInt('0x0007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
        hash: function () {
            return function () { return ev.verify.apply(this, [arguments[0], arguments[1], 'ZcashPoW', 200, 9]) }
        }
    }
};

for (var algo in algos) {
    if (!algos[algo].multiplier)
        algos[algo].multiplier = 1;
}
