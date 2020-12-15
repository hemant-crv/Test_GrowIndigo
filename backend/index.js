const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const otpAuth = require('./routes/otpAuth');
const session = require('express-session')

mongoose.Promise = global.Promise;
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    name:'auth',
    resave:false,
    saveUninitialized:false,
    secret:config.secret,
    cookie:{
        maxAge:1000 * 60 * 60,
        sameSite: true,
        secure: false
    }
}))

app.use('/api/otp', otpAuth);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});