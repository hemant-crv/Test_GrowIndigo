const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');
const User = require('../models/User');

router.get('/generate', function (req, res) {
    axios.get('https://2factor.in/API/V1/' + config.otp_key + '/SMS/+91' + req.query.mobile_no + '/AUTOGEN').then(response => {
        res.status(200).json(response.data);
    }) .catch(err => {
            res.status(400).json(err.message);
        });
})

router.get('/validation', function (req, res) {
    axios.get('https://2factor.in/API/V1/' + config.otp_key + '/SMS/VERIFY/' + req.query.session + '/' + req.query.otp).then(response => {
        User.findOne({ number: req.query.number }).then(user => {
            if (user) {
                req.session.user = user._id
                req.session.firstname = user.firstname
                req.session.lastname = user.lastname
                req.session.email = user.email
                req.session.number = user.number
                res.status(200).json({ newUser: false, firstname: user.firstname, lastname: user.lastname, email: user.email });
            }
            else
                res.status(200).json({ newUser: true, firstname: '', lastname: '', email: '' });
        })

    }) .catch(err => {
            res.status(400).json(err.message);
        });
})

router.post('/signup', function (req, res) {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        number: req.body.number,
    });
    User.findOne({ number: req.body.number }).then(user => {
        if (!user) {
            req.session.user = true
            req.session.firstname = newUser.firstname
            req.session.lastname = newUser.lastname
            req.session.email = newUser.email
            req.session.number = newUser.number
            newUser.save().then(data => {
                res.status(200).json(newUser);
            });
        }
    })
})

router.get('/hassignned', (req, res) => {
    if (req.session.user) {
        return res.json({
            auth: true,
            firstname: req.session.firstname,
            lastname: req.session.lastname,
            number: req.session.number,
            email: req.session.email,
            message: 'Your signned in'
        })
    }
    return res.json({
        auth: false,
        message: 'Your are not signned in'
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.json({
            message: 'successfully logged out'
        })
    })
})

module.exports = router;