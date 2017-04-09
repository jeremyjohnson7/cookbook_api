module.exports.toBase26 = x => x
    .toString(26)
    .split('')
    .map(x => String.fromCharCode(parseInt(x, 26) + 97))
    .join('');

module.exports.fromBase26 = x =>
    parseInt(x
        .split('')
        .map(x => parseInt(x, 36) - 10)
        .map(x => x.toString(26))
        .join(''), 26);
