/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: HTTP server API module -- handles registering unregistered devices from a keylist
*/

class Register {

    constructor(http, db) {
        http.put('/api/register/:uuid', (req, res) => //handle registering a new device from a keylist
        {
            let keyPos = checkKeys(req.params.uuid, db);

            if (keyPos < 0)
                return res.status(200).send('UUID not permitted');

            db.keyset.splice(keyPos, 1);
            db.deployed.push({ 'id': db.deployed.length + 1, 'UUID': req.params.uuid, 'ip': req.ip });

            res.send('Device Registered Successfully');
        });
    }

    checkKeys(uuid, db) //check keylist for key provided in PUT
    {
        return db.keyset.findIndex(key => key == uuid);
    }
}

module.exports = Register;