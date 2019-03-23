var { MongoClient } = require('mongodb');
var cfg = require('../cfg/configure.js');

function mongoFind(collection, filter)
{
    return new Promise((res) => { //return promise 
        //TODO: Pool db
        MongoClient.connect(cfg.DB_CONN_STRING, { useNewUrlParser: true }, (err, conn) => { //connect using the mongo connect string   
            if(err)
                throw err;

            let db = conn.db(cfg.DB_NAME); //open the specified database. Change this in cfg/configure.js

            db.collection(collection).findOne(filter, (err, result) => { //find result, return the value async
                if (err) 
                    throw err;

                conn.close();
                res(result);
            });
        });
    });
}

function mongoUpdate(collection, filter, values)
{
    return new Promise((res) => { //return promise 
        //TODO: Pool db
        MongoClient.connect(cfg.DB_CONN_STRING, { useNewUrlParser: true }, (err, conn) => { //connect using the mongo connect string   
            if(err)
                throw err;

            let db = conn.db(cfg.DB_NAME); //open the specified database. Change this in cfg/configure.js

            db.collection(collection).updateOne(filter, values, (err, result) => { //find result, return the value async
                if (err) 
                    throw err;

                conn.close();
                res(result);
            });
        });
    });

    //return db.deployed.findIndex(data => (data.UUID == uuid && data.flag != -1));
}

module.exports = { mongoFind, mongoUpdate};

