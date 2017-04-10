const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./utils/db');
const guid = require('./utils/guid');
const hashes = require('./utils/hashes');

const crud = require('./utils/crud');
app.crud = crud(app, db);

const production = process.env.NODE_ENV == 'production';

// Allows access to req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', [
        'http://cookbook.netlify.com',
        `http://${process.env.NODE_IP || 'localhost'}:${process.env.NODE_PORT || 3000}`]);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    next();
});

// Debug logging
app.use((req, res, next) => {
    console.log(req.method, req.path);
    if (!production && req.body && Object.keys(req.body).length)
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

// Hashing functions
app.get('/api/:fun(crc32|md5|sha1|sha256|sha512|rmd160)/:str', (req, res) => {
    if (req.params.fun == 'crc32')
        res.send(crc32(req.params.str).toString(16));
    else
        res.send(global[req.params.fun](req.params.str));
});

// Log in
app.post('/api/login', (req, res) => {
    let passwd = req.body.password;
    for (let x = 0; x < (crc32(passwd) & 0xfff); x++)
        passwd = sha512(passwd);
    
    db.users.find({username: req.body.username}).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs[0] && docs[0].password == passwd) {
            const token = sha256(docs[0]._id + guid());
            const tokens = [...docs[0].tokens, token];
            db.users.update({username: req.body.username}, {$set: {tokens: tokens}}, (err, id) => {
                if (err)
                    throw err;
                if (id)
                    res.send(token);
            });
        }
    });
});

// Authorization check
app.use((req, res, next) => {
    const token = JSON.stringify(req.query).replace(/\W/g, '');
    if (!token.match(/^[0-9a-f]+$/))
        return res.status(401).end('Unauthorized');

    db.users.find({tokens: token}).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs[0] && docs[0].tokens.includes(token))
            next();
        else
            return res.status(401).end('Unauthorized');  
    });
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * All routes below this line require a valid access token                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Recipes
app.crud(db.recipes, {
    title: '.*',
    ingredients: ['.*'],
    directions: '.*',
    // group: '[a-z][a-z0-9]*'
});

// Get all recipes that belong to the specified group
app.get('/api/recipes/:group([a-z][a-z0-9]*)', (req, res) => {
    db.recipes.find({group: req.params.group}).toArray((err, docs) => {
        if (err)
            throw err;
        if (docs)
            res.send(docs);
    });
});

// Users
app.route('/api/users/:guid([0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12})$')
    // Create new user
    .post((req, res) => {
        let passwd = req.body.password;
        for (let x = 0; x < (crc32(passwd) & 0xfff); x++)
            passwd = sha512(passwd);

        db.users.find({_id: req.params.guid}).toArray((err, docs) => {
            if (err)
                throw err;
            if (!docs.length) {
                const token = sha256(req.params.guid + guid());
                db.users.save({
                    _id: req.params.guid,
                    username: req.body.username,
                    password: passwd,
                    tokens: [token]
                }, (err, id) => {
                    if (err)
                        throw err;
                    if (id)
                        res.send(token);
                });
            }
        });
    })
    // Change password
    .put((req, res) => {
        let passwd = req.body.password;
        for (let x = 0; x < (crc32(passwd) & 0xfff); x++)
            passwd = sha512(passwd);
        
        db.users.find({_id: req.params.guid}).toArray((err, docs) => {
            if (err)
                throw err;
            if (docs[0] && docs[0].username == req.body.username) {
                const token = sha256(docs[0]._id + guid());
                db.users.update({
                    username: req.body.username
                }, {
                    $set: {password: passwd, tokens: [token]}
                }, (err, id) => {
                    if (err)
                        throw err;
                    if (id)
                        res.send(token);
                });
            }
        });
    });

// // Prevent getting a user's data (which would expose the password hash)
// app.get('/api/users/:guid', (req, res) => {
//     res.status(403).end();
// });

// // Users
// app.crud(db.users, {
//     username: '[a-z][a-z0-9]*',
//     password: '[0-9a-f]{64}',
//     // groups: ['[a-z][a-z0-9]*']
// });

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).end('Internal Server Error')
})

app.listen(process.env.NODE_PORT || 3080, process.env.NODE_IP || 'localhost', () => {
    console.log(`Application worker ${process.pid} started...`);
});
