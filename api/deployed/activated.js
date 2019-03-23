/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: HTTP server API module -- handles info requests for registered clients
*/

class Activated {

    constructor(http, db, cfg, mutex) {
        /* get */
        http.get('/api/activated/:uuid', (req, res) => //handle returning information about a specific UUID
        {
           Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');

                res.write(JSON.stringify(deployEntry));
                res.end();
            });
        });

        http.get('/api/activated/:uuid/firmware', (req, res) => //handle a UUID checking firmware version. Returns firmwareID + URL to firmware
        {
           Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');
            
                res.write(JSON.stringify(cfg.FIRM_VER));
                res.end();
            });
        });

        /* put */
        http.put('/api/activated/:uuid/ip', (req, res) => //handle updating existing activated units -> ip in particular, automatically detect IP
        {
           Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry || deployEntry.flag == -1)
                    return res.status(400).send('Invalid UUID');

                mutex.take(function () {
                    Activated.updateDeployment(req.params.uuid, db, cfg, { $set: { ip: req.ip } }, (result) => { 
                        if(result.modifiedCount)
                            res.send('TRUE');
                        else
                            res.send('FALSE');
                            
                        mutex.leave();
                        return;
                    });
                });                
            });
        });
        

        http.put('/api/activated/:uuid', (req, res) => //handle updating existing activated units -> ip in particular, manually specify IP in JSON
        {
           Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry || deployEntry.flag == -1)
                    return res.status(400).send('Invalid UUID');

                try {
                    let ipReg = new RegExp("^([0-9]{1,3}\.){3}[0-9]{1,3}$").exec(req.body.ip).index;

                    if (ipReg >= 0) {
                        mutex.take(function () {
                            db.deployed[deployId].ip = req.body.ip;
                            mutex.leave();
                        });
                        res.send('TRUE');
                    }
                    else res.send('FALSE');
                }
                catch (e) {
                    return res.send(`FALSE`);
                }
            });
        });

        /* delete */
        http.delete('/api/activated/:uuid', (req, res) => //handle deactivating activated units
        {qqerd
           Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry || deployEntry.flag == -1)
                    return res.status(400).send('Invalid UUID');

                mutex.take(function () {
                    db.deployed[deployId].flag = -1;
                    mutex.leave();
                });

                res.send('TRUE');
            });
        });
    }

    static updateDeployment(uuid, db, cfg, values, callback) //check deployment list and determine uuid position
    {
        if(cfg.DB_MODE == 'Mock')
            throw 'Mock not supported for this operation.';

        db.mongoUpdate('deployed', { UUID: uuid }, values).then((res) => { callback(res); });
    }

    static searchDeployments(uuid, db, cfg, callback) //check deployment list to verify legitimacy of connecting party
    {
        if(cfg.DB_MODE == 'Mongo')            
            db.mongoFind('deployed', { UUID: uuid })
                .then((res) => { callback(res); });   
        else
            callback(db.deployed.find(data => (data.UUID == uuid && data.flag != -1)));
    }

}

module.exports = Activated;

