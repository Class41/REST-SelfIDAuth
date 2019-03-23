/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: HTTP server API module -- handles info requests for registered clients
*/

class Activated {

    constructor(http, db, cfg) {
        /* get */
        http.get('/api/activated/:uuid', (req, res) => //handle returning information about a specific UUID
        {
            this.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');

                res.write(JSON.stringify(deployEntry));
                res.end();
            });
        });

        http.get('/api/activated/:uuid/firmware', (req, res) => //handle a UUID checking firmware version. Returns firmwareID + URL to firmware
        {
            this.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');
            
                res.write(JSON.stringify(cfg.FIRM_VER));
                res.end();
            });
        });

        /* put */
        http.put('/api/activated/:uuid/ip', (req, res) => //handle updating existing activated units -> ip in particular, automatically detect IP
        {
            this.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');

                app.mutex.take(function () {
                    db.deployed[deployId].ip = req.ip;
                    app.mutex.leave();
                });

                res.send('TRUE');                
            });
        });
        

        http.put('/api/activated/:uuid', (req, res) => //handle updating existing activated units -> ip in particular, manually specify IP in JSON
        {
            this.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');

                try {
                    let ipReg = new RegExp("^([0-9]{1,3}\.){3}[0-9]{1,3}$").exec(req.body.ip).index;

                    if (ipReg >= 0) {
                        app.mutex.take(function () {
                            db.deployed[deployId].ip = req.body.ip;
                            app.mutex.leave();
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
        {
            this.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => {
                if (!deployEntry)
                    return res.status(400).send('Invalid UUID');

                app.mutex.take(function () {
                    db.deployed[deployId].flag = -1;
                    app.mutex.leave();
                });

                res.send('TRUE');
            });
        });
    }

    searchDeploymentsId(uuid, db, cfg, callback) //check deployment list and determine uuid position
    {
        if(cfg.DB_MODE == 'Mongo')
            return db.mongoFind('deployed', { 'uuid':uuid });

        return db.deployed.findIndex(data => (data.UUID == uuid && data.flag != -1));
    }

    searchDeployments(uuid, db, cfg, callback) //check deployment list to verify legitimacy of connecting party
    {
        if(cfg.DB_MODE == 'Mongo')            
            db.mongoFind('deployed', { UUID: uuid })
                .then((res) => { callback(res); });   
        else
            callback(db.deployed.find(data => (data.UUID == uuid && data.flag != -1)));
    }

}

module.exports = Activated;

