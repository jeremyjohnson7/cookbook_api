const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./utils/db');
const guid = require('./utils/guid');
const hashes = require('./utils/hashes');

const crud = require('./utils/crud');
app.crud = crud(app, db);

// Allows access to req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://cookbook.netlify.com');
    res.setHeader('Access-Control-Allow-Origin',
        `http://${process.env.NODE_IP || 'localhost'}:${process.env.NODE_PORT || 3000}`);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    next();
});

// Debug logging
app.use((req, res, next) => {
    console.log(req.method, req.path);
    if (req.body && Object.keys(req.body).length)
        console.log(req.body);
    next();
});

// Required health check
app.get('/health', (req, res) => {
    res.status(200).end();
});

// Generate a new GUID
app.get('/api/guid', (req, res) => {
    res.send(guid());
});

// // Authorization check
// app.use((req, res, next) => {
//     console.log('Authorized:', req.query['86f7e437faa5a7fce15d1ddcb9eaeaea377667b8'] !== undefined);
//     if (req.query['86f7e437faa5a7fce15d1ddcb9eaeaea377667b8'] === undefined)
//         return res.status(401).end('Unauthorized');
//     next();
// });

// Authorization check
app.use((req, res, next) => {
    // console.log(hashes.sha256.hex('a'));

    const token = JSON.stringify(req.query).replace(/\W/g, '');
    if (!token.match(/^[0-9a-f]+$/))
        return res.status(401).end('Unauthorized');

    db.users.find({token: token}).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs[0] && docs[0].token == token)
            next();
        else
            return res.status(401).end('Unauthorized');  
    });

    // if (req.query['86f7e437faa5a7fce15d1ddcb9eaeaea377667b8'] === undefined)
    //     return res.status(401).end('Unauthorized');
    // next();
});

// Recipes
app.crud(db.recipes, {
    title: '.*',
    ingredients: ['.*'],
    directions: '.*',
    // group: '[a-z][a-z0-9]*'
});

// Prevent getting a user's data (which would expose the password hash)
app.get('/api/users/:guid', (req, res) => {
    res.status(403).end();
});

// Users
app.crud(db.users, {
    username: '[a-z][a-z0-9]*',
    password: '[0-9a-f]{64}',
    // groups: ['[a-z][a-z0-9]*']
});

// Get all recipes that belong to the specified user
app.get('/api/recipes/:user([a-z][a-z0-9]*)', (req, res) => {
    db.recipes.find({user: req.params.user}).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs)
            res.send(docs);
    });
});

// Log in
app.post('/api/login/:user([a-z][a-z0-9]*)', (req, res) => {
    db.recipes.find({user: req.params.user}).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs)
            res.send(docs);
    });
});

app.listen(process.env.NODE_PORT || 3080, process.env.NODE_IP || 'localhost', () => {
    console.log(`Application worker ${process.pid} started...`);
});
