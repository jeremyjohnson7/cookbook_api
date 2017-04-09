let connection_string = 'localhost:27017/cookbook';
// If OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL)
    connection_string = `${process.env.PENSHIFT_MONGODB_DB_URL}/${process.env.OPENSHIFT_APP_NAME}`;

const mongojs = require('mongojs');
module.exports = mongojs(connection_string, ['recipes', 'users']);
