module.exports.read = (guid) => {
    return {
        title: 'Stuff',
        author: '',    // Author's name
        ingredients: [
            '3 1/2 cups flour',
            '8 cups water'
        ],
        directions: 'Mix stuff together',
        //group: guid()
         group: '0871172b-1a8a-41c7-ba1c-039bf327e898'
    };
};

module.exports.add = (guid, obj) => {
    return {};
};

module.exports.edit = (guid, obj) => {
    return {};
};

module.exports.remove = (guid, obj) => {
    return {};
};

module.exports.delete = (guid, obj) => {
    return {};
};
