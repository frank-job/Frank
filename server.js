require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { setupPassport } = require('./config/passport');

setupPassport();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'frank-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/swagger', (req, res) => {
    res.redirect('/api-docs');
});

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

app.get('/login', (req, res) => {
    if (!process.env.GITHUB_CLIENT_ID) {
        return res.status(500).send('GitHub OAuth is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.');
    }
    return passport.authenticate('github', { scope: ['user:email'] })(req, res);
});

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        req.session.user = req.user;
        return res.redirect('/api-docs');
    }
);

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
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
    if(err){
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node is running on port http://localhost:${port}`)});
    }
});
