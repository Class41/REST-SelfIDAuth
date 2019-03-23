/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: HTTP server API module -- handles registering unregistered devices from a keylist
*/

class Register {

    constructor(http, db, cfg, mutex) {

        /* PUT */
        http.put('/api/register/:uuid', (req, res) => //handle registering a new device from a keylist
        {
            Register.searchKeys(req.params.uuid, db, cfg, (keyEntry) => { //check key collection for a valid matching key
                if(!keyEntry)
                    return res.status(400).send('Invalid key');
                
                    Register.insertDeployments({ UUID:req.params.uuid, ip: req.ip }, db, cfg, (result) => { //key found, create a new deployment entry. Register UUID and IP (v4)
                        if(result.insertedCount) 
                        { 
                            Register.deleteKey(req.params.uuid, db, cfg, (result) => { //delete key after it is used
                                if(result.deletedCount) { return res.send('TRUE'); } //key was deleted and deployment created successfully
                                else { return res.status(500).send('TRUE'); }  //deployment creation success, but the key deletion failed
                            });
                        }
                        else { return res.send('FALSE'); } //deployment insertion failed
                    });          
            });
        });
    }

    static searchKeys(uuid, db, cfg, callback) //searches key collection for a specific key
    {
        if (cfg.DB_MODE == 'Mongo')
            db.mongoFind('keyset', { KEY: uuid })
                .then((res) => { callback(res); });
        else { console.log('Mock not supported for this operation.'); }
    } 

    static deleteKey(uuid, db, cfg, callback) //deletes a key from the key database
    {
        if (cfg.DB_MODE == 'Mongo')
            db.mongoDelete('keyset', { KEY: uuid })
                .then((res) => { callback(res); });
        else { console.log('Mock not supported for this operation.'); }
    }

    static insertDeployments(value, db, cfg, callback) //inserts a new deployment into the deployed collection
    {
        if(cfg.DB_MODE == 'Mongo')
            db.mongoInsert('deployed', value)
                .then((res) => { callback(res); });
        else { console.log('Mock not supported for this operation.'); }
    }
}

module.exports = Register;