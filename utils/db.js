const connection_string =
    process.env.OPENSHIFT_MONGODB_DB_URL
        ? `${process.env.OPENSHIFT_MONGODB_DB_URL}${process.env.OPENSHIFT_APP_NAME}`
        : 'localhost:27017/cookbook';

const mongojs = require('mongojs');
module.exports = mongojs(connection_string, ['recipes', 'users']);
