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

/*
//
// IGNORE
//
*/

/* Config calculations */
let CpuCount = require('os').cpus().length;
INSTANCE_COUNT = (INSTANCE_COUNT == -1 || INSTANCE_COUNT > CpuCount) ? CpuCount : INSTANCE_COUNT;
    
/* Export config to global scope */
module.exports = {PORT_NUM, BIND_IP, INSTANCE_COUNT};