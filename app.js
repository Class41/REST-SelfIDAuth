/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: Program entrypoint--runs HTTP threads
*/

/* Load threading and configuration */
const threads = require('cluster');
const mutex = require('semaphore')(1);
const cfg = require('./cfg/configure.js');

if(threads.isMaster)
{
    for(tcount = 0; tcount < cfg.INSTANCE_COUNT; tcount++) //create worker threads
        threads.fork();

    threads.on('exit', (worker, code, signal) => { 
        threads.fork();                                   //Restart worker thread if a thread dies for some reason
    })
}
else 
{
    /* Imports / Declares */
    const express = require('express');
    const http = express();
    const bodyParser = require('body-parser');


    /* Create a express socket running a json body parser */
    http.use(bodyParser.json());
    http.listen(cfg.PORT_NUM, cfg.BIND_IP, () => {console.log(`PID: ${process.pid} Starting HTTP server on port ${cfg.PORT_NUM}`)});

    module.exports = {http, mutex};

    /* Start Load API Modules */
    require("./api/deployed/activated.js");
    require("./api/deployed/register.js");
    /* End Loading API Modules */
}