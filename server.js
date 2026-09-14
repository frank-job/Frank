const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// const bodyParser = require('body-parser')
const mongodb = require('./data/database');


const port = process.env.PORT || 8080



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

app.use(bodyParser.json());

// Define a route for GET requests to the root URL
// app.get('/', (req, res) => {
//   res.send('Hello World from Express!');
// });


app.use('/', require('./routes'))

mongodb.initDB((err) => {
    if(err){
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node is running on port http://localhost:${port}`)});
    }
});