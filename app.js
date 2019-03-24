/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: Program entrypoint--runs HTTP threads
*/

/* Load threading and configuration */
const threads = require('cluster');
const mutex = require('semaphore')(1);
const cfg = require('./cfg/configure.js');
const dbinc = (cfg.DB_MODE == 'Mock') ? require('./data/db_mock') : require('./data/db');

/* Use this DB instead if you wish to just use a mock database instead */
//const db = require('./data/db_mock.js');

/* Start Load API Modules */
const module_activated = require('./api/deployed/activated.js');
const module_register = require('./api/deployed/register.js');
/* End Loading API Modules */

if (threads.isMaster) {
    threads.on('exit', (worker, code, signal) => {
        threads.fork();                                   //Restart worker thread if a thread dies for some reason
    })

    for (tcount = 0; tcount < cfg.INSTANCE_COUNT; tcount++) //create worker threads
        threads.fork();
}
else {
    /* Imports / Declares */
    const express = require('express');
    const http = express();
    const https = require('https');
    const fs = require('fs');
    const bodyParser = require('body-parser');

    if (cfg.DB_MODE == 'Mongo') {
        dbinc.mongoSessionStart((conn) => {
            /* Apply modules for Mongo*/
            new module_activated(http, { dbinc, conn }, cfg, mutex);
            new module_register(http, { dbinc, conn }, cfg, mutex);
        });
    }
    else {    /* Apply modules for Mock db*/
        new module_activated(http, dbinc, cfg, mutex);
        new module_register(http, dbinc, cfg, mutex);
    }

    /* Create a express socket running a json body parser */
    http.use(bodyParser.json());

    if(cfg.HTTPS_MODE)
        https.createServer({
            key: fs.readFileSync(cfg.HTTPS_KEY_PATH),
            cert: fs.readFileSync(cfg.HTTPS_CERT_PATH)
        }, http).listen(cfg.PORT_NUM, cfg.BIND_IP, () => { console.log(`PID: ${process.pid} Starting HTTPS server on port ${cfg.PORT_NUM}`) });
    else
        http.listen(cfg.PORT_NUM, cfg.BIND_IP, () => { console.log(`PID: ${process.pid} Starting HTTP server on port ${cfg.PORT_NUM}`) });
}