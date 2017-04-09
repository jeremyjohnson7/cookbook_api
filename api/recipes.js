const db = require('./db');

module.exports.read = (guid, callback) => {
    /*return {
        title: 'Stuff',
        author: '',    // Author's name
        ingredients: [
            '3 1/2 cups flour',
            '8 cups water'
        ],
        directions: 'Mix stuff together',
        //group: guid()
        group: '0871172b-1a8a-41c7-ba1c-039bf327e898'
    };*/

    // const records = db.recipes.find({}, (err, docs) => err || docs);

    const query =
        guid
            ? {_id: guid}
            : {};

    let rs = db.recipes.find(query).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs) {
            console.dir(docs);
            callback(docs);
        }
    });
};

module.exports.find = module.exports.read;

module.exports.insert = (guid, obj) => {
    return {};
};

module.exports.update = (guid, obj) => {
    return {};
};

module.exports.remove = (guid, obj) => {
    return {};
};

module.exports.delete = (guid, obj) => {
    return {};
};
