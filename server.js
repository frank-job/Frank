const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use('/', require('./routes'));

app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.statusCode || 500).json({
        error: error.statusCode && error.statusCode < 500
            ? error.message
            : 'Internal server error'
    });
});

mongodb.initDB((err) => {
    if (err) {
        console.log('Warning: MongoDB connection failed:', err.message || err);
    } else {
        console.log('MongoDB connected successfully');
    }
    app.listen(port, () => { console.log(`Database is listening and node is running on port http://localhost:${port}`) });
});
