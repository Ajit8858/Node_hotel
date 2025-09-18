const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const Person = require('./model/person'); 

app.use(express.json());
const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

app.use(logRequest);
passport.use(new LocalStrategy(async (username, password, done) =>{
    try{
        console.log('Received credential', username, password);
        const user =await Person.findOne({username: username});
        if(!user){
            return done(null, false, {
                message: 'Incorrect username'});
        }

        const isPassward = user.password === password ? true : false;
        if(isPassward){
            return done(null, user);
        }else{
            return done(null, false, {message:'Incorrect password'});
        }
    }catch(err){
        return done(err);
    }
}))

app.use(passport.initialize());
// Home route
const localAuthMiddleware = passport.authenticate('local', {session: false});
app.get('/',localAuthMiddleware, (req, res) => {
    res.send('Hello World in my village is very beautiful');
});

const personRoute = require('./routes/personRoutes'); 
const menuRoute = require('./routes/menuRoutes');
app.use('/person', personRoute);
app.use('/menu',localAuthMiddleware, menuRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
