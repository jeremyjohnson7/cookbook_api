module.exports = (method, url='/') => {
    console.log(`API ${method}: ${url}`);

    if (url.startsWith('/recipe/') && method == 'GET') {
        return {
            title: 'Stuff',
            ingredients: [
                '3 1/2 cups flour',
                '8 cups water'
            ],
            directions: 'Mix stuff together'
        };
    }

    return {
        test: 'value',
        test2: 'value2'
    };
}
