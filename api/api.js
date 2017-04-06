const guid = require('./guid');

module.exports = (method, url='/') => {
    console.log(`API ${method}: ${url}`);

    if (url.startsWith('/recipe/') && method == 'GET') {
        return {
            title: 'Stuff',
            author: '',    // Author's name
            ingredients: [
                '3 1/2 cups flour',
                '8 cups water'
            ],
            directions: 'Mix stuff together',
            group: guid()
            // group: '0871172b-1a8a-41c7-ba1c-039bf327e898'
        };
    } else {
        return undefined;
    }

    return {
        test: 'value',
        test2: 'value2'
    };
}
