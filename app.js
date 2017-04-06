const express = require('express');
const app = express();

let data = [
    { x: 1, y: 10 },
    { x: 2, y: 5 },
    { x: 3, y: 15 }
];

app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    // res.send('Hello world!')
    console.log(req);
    res.send(data);
});

// Required health check
app.get('/health', (req, res) => {
    console.log(req);
    res.writeHead(200);
    res.end();
});

app.listen(process.env.NODE_PORT || 3080, () => {
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
