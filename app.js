/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: Program entrypoint; runs HHTP listener on specified port
*/

const express = require('express');
const http = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3669; //Checks envrionment variable for easy cluster deployment

http.use(bodyParser.json());
http.listen(port, '192.168.0.8', () => {console.log(`Starting HTTP server on port ${port}`)});

exports.http = http;

/* Start Load API Modules */
require("./api/deployed/activated.js");
require("./api/deployed/register.js");
/* End Loading API Modules*/