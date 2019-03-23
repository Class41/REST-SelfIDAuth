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
            Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => { //search deployed database, determine if uuid exists
                if (!deployEntry || deployEntry.flag == -1) //if uuid is marked as deleted, do not display it / if no result comes back
                    return res.status(400).send('Invalid UUID');
                res.write(JSON.stringify(deployEntry)); //write stored data to response in JSON form
                res.end();
            });
        });

        http.get('/api/activated/:uuid/firmware', (req, res) => //handle a UUID checking firmware version. Returns firmwareID + URL to firmware
        {
            Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => { //search deployed database, determine if uuid exists
                if (!deployEntry || deployEntry.flag == -1) //if uuid is marked as deleted, do not display it / if no result comes back
                    return res.status(400).send('Invalid UUID');
                res.write(JSON.stringify(cfg.FIRM_VER));
                res.end();
            });
        });

        /* put */
        http.put('/api/activated/:uuid/ip', (req, res) => //handle updating existing activated units -> ip in particular, automatically detect IP
        {
            Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => { //search deployed database, determine if uuid exists
                if (!deployEntry || deployEntry.flag == -1) //if uuid is marked as deleted, do not display it / if no result comes back
                    return res.status(400).send('Invalid UUID');

                mutex.take(() => { //ensure no collide on writes
                    Activated.updateDeployment(req.params.uuid, db, cfg, { $set: { ip: req.ip } }, (result) => {
                        if (result.modifiedCount) { res.send('TRUE'); }
                        else { res.send('FALSE') };                                
                        return mutex.leave();
                    });
                });
            });
        });


        http.put('/api/activated/:uuid', (req, res) => //handle updating existing activated units -> ip in particular, manually specify IP in JSON
        {
            Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => { //search deployed database, determine if uuid exists
                if (!deployEntry || deployEntry.flag == -1) //if uuid is marked as deleted, do not display it / if no result comes back
                    return res.status(400).send('Invalid UUID');

                try {
                    if (new RegExp("^([0-9]{1,3}\.){3}[0-9]{1,3}$").exec(req.body.ip).index >= 0) { //determine if there is a valid IP address within the given string. Currently only supports IPV4
                        mutex.take(() => { //ensure no collide on writes
                            Activated.updateDeployment(req.params.uuid, db, cfg, { $set: { ip: req.body.ip } }, (result) => { //write body ip changes to uuid db entry
                                if (result.modifiedCount) { res.send('TRUE'); }
                                else { res.send('FALSE') };                                
                                return mutex.leave();
                            });
                        });
                    }
                    else { res.send('FALSE'); }
                }
                catch (e) { return res.send(`FALSE`); }
            });
        });

        /* delete */
        http.delete('/api/activated/:uuid', (req, res) => //handle deactivating activated units, simply mark them as deactivated.
        {
            Activated.searchDeployments(req.params.uuid, db, cfg, (deployEntry) => { //search deployed database, determine if uuid exists
                if (!deployEntry || deployEntry.flag == -1) //if uuid is marked as deleted, do not display it / if no result comes back
                    return res.status(400).send('Invalid UUID');

                mutex.take(() => { //ensure no collide on writes
                    Activated.updateDeployment(req.params.uuid, db, cfg, { $set: { flag: -1 } }, (result) => { //write body ip changes to uuid db entry
                        if (result.modifiedCount) { res.send('TRUE'); }
                        else { res.send('FALSE') };                                
                        return mutex.leave();
                    });
                });
            });
        });
    }

    static updateDeployment(uuid, db, cfg, values, callback) //update deployment database with newly provided data. Typically called after searchDeployments.
    {
        if (cfg.DB_MODE == 'Mock')
            return console.log('Mock not supported for this operation.');
        db.mongoUpdate('deployed', { UUID: uuid }, values).then((res) => { callback(res); }); 
    }

    static searchDeployments(uuid, db, cfg, callback) //check deployment database for a specific uuid entry and return the entry
    {
        if (cfg.DB_MODE == 'Mongo')
            db.mongoFind('deployed', { UUID: uuid })
                .then((res) => { callback(res); });
        else { callback(db.deployed.find(data => (data.UUID == uuid && data.flag != -1))); } //'Mock' database support for get
    }
}

module.exports = Activated;

