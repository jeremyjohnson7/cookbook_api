const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./api/db');
const guid = require('./api/guid');
// const recipes = require('./api/recipes');

let data = [
    { x: 1, y: 10 },
    { x: 2, y: 5 },
    { x: 3, y: 15 }
];

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
    console.log(req.method, req.url);
    if (req.body && Object.keys(req.body).length)
        console.log(req.body);
    next();
});

// Required health check
app.get('/health', (req, res) => {
    res.writeHead(200);
    res.end();
});

app.get('/', (req, res) => {
    res.send(data);
});

app.get('/hello', (req, res) => {
    // console.log(req);
    res.writeHead(200);
    res.end('Hello world!');
});

app.get('/api', (req, res) => {
    res.send(data);
});

app.get('/api/guid', (req, res) => {
    res.send(guid());
});

// Recipes
app.route('/api/recipes/:guid([0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12})')
    .get((req, res, next) => {
        db.recipes.find({_id: req.params.guid}).toArray((err, docs) => {
            if (err)
                throw err;
            if (docs[0])
                res.send(docs[0]);
            else
                next();
        });
    })
    .post((req, res) => {
        if (!req.body._id)
            req.body._id = guid();
        db.recipes.save(req.body, (err, id) => {
            if (err)
                throw err;
            if (id)
                res.send(id);
        });
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

app.listen(process.env.NODE_PORT || 3080, process.env.NODE_IP || 'localhost', () => {
    console.log(`Application worker ${process.pid} started...`);
});




// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const contentTypes = require('./utils/content-types');
// const sysInfo = require('./utils/sys-info');
// const api = require('./api/api');

// let server = http.createServer((req, res) => {
//     let url = req.url;
//     if (url == '/')
//         url += 'index.html';

//     // IMPORTANT: Your application HAS to respond to GET /health with status 200
//     // for OpenShift health monitoring

//     if (url == '/health') {
//         res.writeHead(200);
//         res.end();
//     } else if (url == '/info/gen' || url == '/info/poll') {
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Cache-Control', 'no-cache, no-store');
//         res.end(JSON.stringify(sysInfo[url.slice(6)]()));
//     } else if (url.startsWith('/api/')) {
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Cache-Control', 'no-cache, no-store');

//         const results = api(req.method, url.slice(4));
        
//         if (results !== undefined) {
//             res.end(JSON.stringify(results));
//         } else {
//             res.writeHead(400);
//             res.end('Bad request');
//         }
//     } else {
//         fs.readFile(`./static${url}`, (err, data) => {
//             if (err) {
//                 res.writeHead(404);
//                 res.end('Not found');
//             } else {
//                 let ext = path.extname(url).slice(1);
                
//                 if (contentTypes[ext])
//                     res.setHeader('Content-Type', contentTypes[ext]);
                
//                 if (ext === 'html')
//                     res.setHeader('Cache-Control', 'no-cache, no-store');
                
//                 res.end(data);
//             }
//         });
//     }
// });

// server.listen(process.env.NODE_PORT || 3080, process.env.NODE_IP || 'localhost', () => {
//     console.log(`Application worker ${process.pid} started...`);
// });
