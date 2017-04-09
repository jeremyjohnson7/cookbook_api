const connection_string =
    process.env.OPENSHIFT_MONGODB_DB_URL
        ? `${process.env.PENSHIFT_MONGODB_DB_URL}/${process.env.OPENSHIFT_APP_NAME}`
        : 'localhost:27017/cookbook';

console.log('* * *   C O N N E C T I O N   S T R I N G   * * *', connection_string);

const mongojs = require('mongojs');
module.exports = mongojs(connection_string, ['recipes', 'users']);
