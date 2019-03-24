/*
* Author: Vasyl Onufriyev
* Date: 3-19-2019
* Purpose: Configuation file for this application
*/

/* Network */
const PORT_NUM = process.env.PORT || 3669; // Port number to run on
const BIND_IP = '0.0.0.0';                 // Local IP to bind to (ALL BY DEFAULT)

/* Threading */
var INSTANCE_COUNT = -1;                    // Number of clusters, set to -1 to use all cores available

/* Database */
const DB_MODE = 'Mongo'; /*set to 'Mock' if you wish to use the mock DB instead. 
                         To prevent excessive code, 'Mock' now only supports basic 'GET' requests. 
                         'Mongo' to use mongo and full support.*/
const DB_CONN_STRING = 'mongodb://localhost:27017/'; //accepts the following format: mongodb://[username:password@]host1:port1/
const DB_NAME = 'MyDbName';

/* EndUser Firmware */
const FIRM_VER = { 'currentVersion': '1.0.0.1', 'url': 'www.google.com', 'launchop': '--updatecheck 60' }; //keeps track of firmware version/URL for firmware

/*
//
// IGNORE
//
*/

/* Config calculations */
let cpuCount = require('os').cpus().length;
INSTANCE_COUNT = (INSTANCE_COUNT == -1 || INSTANCE_COUNT > cpuCount) ? cpuCount : INSTANCE_COUNT;

/* Collection names */
const COLLECTION_TITLES = ['deployed', 'keyset'];

/* Export config to global scope */
module.exports = { PORT_NUM, BIND_IP, INSTANCE_COUNT, DB_MODE, DB_CONN_STRING, DB_NAME, COLLECTION_TITLES, FIRM_VER };