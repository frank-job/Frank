const mongoose = require('mongoose');

let database;

const initDB = async (callback) => {
    if (database) {
        console.log('DB is already initialized');
        if (callback) return callback(null, database);
        return database;
    }

    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not configured');
        }

        const connection = await mongoose.connect(process.env.MONGODB_URL);
        database = connection.connection.db;
        console.log('MongoDB connected successfully');
        if (callback) callback(null, database);
        return database;
    } catch (err) {
        console.log('MongoDB connection failed:', err.message);
        if (callback) callback(err);
        if (!callback) throw err;
    }
};

const getDatabase = () => {
    if (!database) {
        throw Error('DB is not initialized');
    }
    return database;
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        database = undefined;
    } catch (err) {
        console.log('Error closing database:', err.message);
    }
};

module.exports = {
    initDB,
    getDatabase,
    closeDB,
};
