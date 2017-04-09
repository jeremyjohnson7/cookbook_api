let connection_string = 'localhost:27017/cookbook';
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/';
    process.env.OPENSHIFT_APP_NAME;
}

const mongojs = require('mongojs');
module.exports = mongojs(connection_string, ['recipes', 'users']);
