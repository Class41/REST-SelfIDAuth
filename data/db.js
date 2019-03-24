/*
* Author: Vasyl Onufriyev
* Date: 3-23-2019
* Purpose: Wrapper for monogodb database operations
*/

var { MongoClient } = require('mongodb');
var cfg = require('../cfg/configure.js');

function mongoSessionStart(callback) {
    MongoClient.connect(cfg.DB_CONN_STRING, { useNewUrlParser: true }, (err, conn) => { //create a new connection to the db
        let db = conn.db(cfg.DB_NAME);
        callback(db);
    });
}

function mongoFind(db, collection, filter) {
    return new Promise((res) => { //return promise 
        db.collection(collection).findOne(filter, (err, result) => { //find result, return the value async
            if (err) throw err;
            res(result);
        });
    });
}

function mongoUpdate(db, collection, filter, values) {
    return new Promise((res) => { //return promise 
        db.collection(collection).updateOne(filter, values, (err, result) => { //find result, return the value async
            if (err) throw err;
            res(result);
        });
    });
}

function mongoInsert(db, collection, value) {
    return new Promise((res) => { //return promise 
        db.collection(collection).insertOne(value, (err, result) => { //find result, return the value async
            if (err) throw err;
            res(result);
        });
    });
}

function mongoDelete(db, collection, filter) {
    return new Promise((res) => { //return promise 
        db.collection(collection).deleteOne(filter, (err, result) => { //find result, return the value async
            if (err) throw err;
            res(result);
        });
    })
}

module.exports = { mongoSessionStart, mongoFind, mongoUpdate, mongoInsert, mongoDelete };

