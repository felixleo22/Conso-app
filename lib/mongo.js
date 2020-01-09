// eslint-disable-next-line import/no-extraneous-dependencies
const { MongoClient } = require('mongodb');

let db = null;

module.exports = {
    connect: (url, collection, callback) => {
        if (db) {
            return callback(null, db);
        }
        return MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }, (err, database) => {
            if (err) { return callback(err); }
            db = database;
            const col = database.collection(collection);
            return col;
        });
    },

    disconnect: (callback) => {
        if (!db) {
            return callback(null);
        }
        return db.close((err) => {
            db = null;
            callback(err);
        });
    },
    get: (col) => (db ? db.collection(col) : null),
};
