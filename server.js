require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodb = require('./data/database');
const swaggerUI = require('swagger-ui-express');
const swaggerDocuments = require('./swagger-documents');
const passport = require('passport');
const { setupPassport } = require('./config/passport');

const port = process.env.PORT || 8080;
const httpsPort = process.env.HTTPS_PORT || 8443;

app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

setupPassport();

app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocuments.all));
app.get('/events/api-docs/swagger.json', (req, res) => res.json(swaggerDocuments.events));
app.get('/organizers/api-docs/swagger.json', (req, res) => res.json(swaggerDocuments.organizers));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocuments.all));
app.get('/events/api-docs', (req, res) => res.redirect('/api-docs/'));
app.get('/events/api-docs/', (req, res) => res.redirect('/api-docs/'));
app.get('/organizers/api-docs', (req, res) => res.redirect('/api-docs/'));
app.get('/organizers/api-docs/', (req, res) => res.redirect('/api-docs/'));

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

app.get('/', (req, res) => {
    const user = req.user;
    const loginLink = `<a href="/auth/github">Login with GitHub</a>`;
    const logoutLink = `<a href="/auth/logout">Logout</a>`;
    
    if (user) {
        res.send(`Logged in as ${user.username} | ${logoutLink} | <a href="/api-docs">API Docs</a>`);
    } else {
        res.send(`Welcome! ${loginLink} | <a href="/api-docs">API Docs</a>`);
    }
});

app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
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
        console.error('MongoDB connection failed:', err.message || err);
        process.exitCode = 1;
        return;
    }

    if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
        const sslOptions = {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        };

        https.createServer(sslOptions, app).listen(httpsPort, () => {
            console.log(`Database is listening and node is running on https://localhost:${httpsPort}`);
        });
        return;
    }

    http.createServer(app).listen(port, () => {
        console.log(`Database is listening and node is running on http://localhost:${port}`);
    });
});