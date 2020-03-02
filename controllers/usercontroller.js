const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
Endpoint        Verb	Description
/api/user/	    POST	Allows a new user to be created with a username and password.
/api/login/	    POST	Allows log in with an existing user.
*/

// router.post('/user', (req, res) => {
router.post('/user', (req, res) => {
    console.log("******************** You're in /user processing - Create New User ********************");
    User.create({
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10)
        // password: req.body.password
    })
    .then(
        createSuccess = (user) => {
            let token = jwt.sign({
                id: user.id
            }, process.env.JWT_SECRET, {
                expiresIn: 60*60*24
            })
            res.json({
                user: user,
                message: 'user created',
                sessionToken: token
            })
        }, 
        createError = err => res.send(500, err)
    )
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            userName: req.body.userName
        }
    })
    .then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, matches) => {
                if(matches){
                    let token = jwt.sign({
                        id: user.id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 60*60*24
                    })
                    res.json({
                        user: user,
                        message: 'user successfully logged in',
                        sessionToken: token
                    })
                } else {
                    res.status(502).send({error: 'bad gateway'})
                }
            })
        } else {
            res.status(500).send({error: 'failed to authenticate'})
        }
    }, err => res.status(501).send({error: 'failed to process'}))
})

module.exports = router;