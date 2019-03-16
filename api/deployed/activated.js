/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: HTTP server API module -- handles info requests for registered clients
*/

var path = require('path');
var app = require('../../app.js');
var db = require('../../data/db.js');

app.http.get('/api/activated', (req, res) => //handle an empty reqest to /api/deployed
{
    return res.status(400).send('Invalid Request');
});

app.http.get('/api/activated/:uuid', (req, res) => //handle returning information about a specific UUID
{
    const deployEntry = searchDeployments(req.params.uuid);

    if(!deployEntry)
        return res.status(400).send('Invalid UUID');
    
    res.write(JSON.stringify(deployEntry));
    res.end();
});

app.http.get('/api/activated/:uuid/firmware', (req, res) => //handle a UUID checking firmware version. Returns firmwareID + URL to firmware
{
    const deployEntry = searchDeployments(req.params.uuid);

    if(!deployEntry)
        return res.status(400).send('Invalid UUID');
    
    res.write(JSON.stringify(db.firmare));
    res.end();
});

app.http.delete('/api/activated/:uuid', (req, res) => {
    const deployId = searchDeploymentsId(req.params.uuid);
    console.log(deployId);
    if(deployId < 0)
        return res.status(400).send('Invalid UUID');

    db.deployed[deployId].flag = -1;
    res.write('UUID deleted');
    res.end();
});

function searchDeploymentsId(uuid) //check deployment list and determine uuid position
{
    return db.deployed.findIndex(data => (data.UUID == uuid && data.flag != -1));
}

function searchDeployments(uuid) //check deployment list to verify legitimacy of connecting party
{
    return db.deployed.find(data => (data.UUID == uuid && data.flag != -1));
}
