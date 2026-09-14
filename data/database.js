const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const initDB = (callback) => {
    if(database) {
        console.log('DB is already initalised')
        return callback(null, database)
    }
    MongoClient.connect(process.env.MONGODB_URL)

    .then((client) => {
        database = client.db();
        callback(null, database);
    }).catch((err) => {
        callback((err));
    })
}

const getDatabase = () => {
     if(!database) {
        throw Error ('DB is not initalised')
       
    }

    return database;

}

module.exports = {
    initDB,
    getDatabase
}