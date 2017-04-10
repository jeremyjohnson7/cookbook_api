const Hashes = require('jshashes');

// module.exports.crc32 = Hashes.CRC32;
// module.exports.md5 = new Hashes.MD5;
// module.exports.sha1 = new Hashes.SHA1;
// module.exports.sha256 =  new Hashes.SHA256;
// module.exports.sha512 = new Hashes.SHA512;
// module.exports.rmd160 = new Hashes.RMD160;
// module.exports.base64 = new Hashes.Base64;

global.crc32 = Hashes.CRC32;
// global.crc32 = s => Hashes.CRC32(s).toString(16);
global.md5 = new Hashes.MD5().hex;
global.sha1 = new Hashes.SHA1().hex;
global.sha256 =  new Hashes.SHA256().hex;
global.sha512 = new Hashes.SHA512().hex;
global.rmd160 = new Hashes.RMD160().hex;
