const Hashes = require('jshashes');

module.exports.md5 = new Hashes.MD5;
module.exports.sha1 = new Hashes.SHA1;
module.exports.sha256 =  new Hashes.SHA256;
module.exports.sha512 = new Hashes.SHA512;
module.exports.rmd160 = new Hashes.RMD160;
