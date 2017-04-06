const http = require('http');
const fs = require('fs');
const path = require('path');
const contentTypes = require('./utils/content-types');
const sysInfo = require('./utils/sys-info');
const api = require('./api/api');

let server = http.createServer((req, res) => {
    let url = req.url;
    if (url == '/')
        url += 'index.html';

    // IMPORTANT: Your application HAS to respond to GET /health with status 200
    // for OpenShift health monitoring

    if (url == '/health') {
        res.writeHead(200);
        res.end();
    } else if (url == '/info/gen' || url == '/info/poll') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.end(JSON.stringify(sysInfo[url.slice(6)]()));
    } else if (url.startsWith('/api/')) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.end(JSON.stringify(api(req.method, url.slice(4))));
    } else {
        fs.readFile(`./static${url}`, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                let ext = path.extname(url).slice(1);
                
                if (contentTypes[ext])
                    res.setHeader('Content-Type', contentTypes[ext]);
                
                if (ext === 'html')
                    res.setHeader('Cache-Control', 'no-cache, no-store');
                
                res.end(data);
            }
        });
    }
});

server.listen(process.env.NODE_PORT || 3080, process.env.NODE_IP || 'localhost', () => {
    console.log(`Application worker ${process.pid} started...`);
});
