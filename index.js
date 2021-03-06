// Required NPM libraries
require('dotenv').config();
const express = require('express');
const ejsLayouts = require("express-ejs-layouts");
const helmet = require('helmet');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('./config/ppConfig');
const db = require('./models');
const isLoggedIn = require('./middleware/isLoggedIn');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const axios = require('axios');


// app setup
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.use(ejsLayouts);
app.use(require('morgan')('dev'));
app.use(helmet());

// create new instance of class Sequelize Store
const sessionStore = new SequelizeStore({
    db: db.sequelize,
    expiration: 1000 * 60 * 30
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}))

sessionStore.sync();

// initialize passport and session info
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
    res.locals.alerts  = req.flash();
    res.locals.currentUser = req.user;

    next();
});

// ROUTES
app.get('/', function(req, res) {
    const rescueApi = "https://api.petfinder.com/v2/animals?status=adoptable"
    axios.get(rescueApi).then( function(apiResponse) {
        const animals = apiResponse.animals;
    res.send(animals);
    });
    // check to see if user logged in
    console.log(env)
    res.render('index');
})

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile');
})

// include auth controller
app.use('/auth', require('./controllers/auth'));

app.use('/', require('./controllers/test'));

// initialize App on Port
app.listen(process.env.PORT || 3000, function() {
    console.log(`Listening to the smooth sweet sounds of port ${process.env.PORT} in the morning ☕️.`);
});