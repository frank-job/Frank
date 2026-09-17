const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const port = process.env.PORT || 8080

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use('/', require('./routes'))

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
    if(err){
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node is running on port http://localhost:${port}`)});
    }
});
