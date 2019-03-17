/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: HTTP server API module -- handles info requests for registered clients
*/

var path = require('path');
var app = require('../../app.js');
var db = require('../../data/db.js');
/* get */
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

/* put */
app.http.put('/api/activated/:uuid/ip', (req, res) => //handle updating existing activated units -> ip in particular, automatically detect IP
{
    const deployId = searchDeploymentsId(req.params.uuid);

    if(deployId < 0)
        return res.status(400).send('Invalid UUID');

    db.deployed[deployId].ip = req.ip;
    res.send('TRUE');
});

app.http.put('/api/activated/:uuid', (req, res) => //handle updating existing activated units -> ip in particular, manually specify IP in JSON
{
    const deployId = searchDeploymentsId(req.params.uuid);

    if(deployId < 0)
        return res.status(400).send('Invalid UUID');

    try{
        let ipReg = new RegExp("^([0-9]{1,3}\.){3}[0-9]{1,3}$").exec(req.body.ip).index;

        if(ipReg >= 0)
        {      
            db.deployed[deployId].ip = req.body.ip;
            res.send('TRUE');
        }
        else res.send('FALSE');
    }
    catch (e)
    {
        return res.send(`FALSE`);
    }
});

/* delete */
app.http.delete('/api/activated/:uuid', (req, res) => //handle deactivating activated units
{
    const deployId = searchDeploymentsId(req.params.uuid);

    if(deployId < 0)
        return res.status(400).send('Invalid UUID');

    db.deployed[deployId].flag = -1;
    res.send('TRUE');
});

function searchDeploymentsId(uuid) //check deployment list and determine uuid position
{
    return db.deployed.findIndex(data => (data.UUID == uuid && data.flag != -1));
}

function searchDeployments(uuid) //check deployment list to verify legitimacy of connecting party
{
    return db.deployed.find(data => (data.UUID == uuid && data.flag != -1));
}
