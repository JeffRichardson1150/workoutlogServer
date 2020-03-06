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
    console.log("******************** You're in usercontroller /user processing - Create New User ********************");
    console.log(req);
    console.log(req.body)
    console.log("req.body.password: ", req.body.password);
    User.create({
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(
        createSuccess = (user) => {
            console.log("******* in usercontroller /user (create user) createSuccess -- encrypted password : ", req.body.password)
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
        createError = err => res.status(500).send({error: 'failed to authenticate'})
    )
})

router.post('/login', (req, res) => {
    console.log("************* usercontroller  /login  req.body.userName: ", req.body.userName);
    User.findOne({
        where: {
            userName: req.body.userName
        }
    })
    .then(user => {
        console.log("***************  in the .then - found user ", user.userName);
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, matches) => {
                if(matches){
                    console.log("************************ the user matched. assign token to user.id: ", user.id)
                    let token = jwt.sign({
                        id: user.id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 60*60*24
                    })
                    console.log("******************************* jsonify (using res.json) user: ", user, " sessionToken: ", token)
                    res.json({
                        user: user,
                        message: 'user successfully logged in',
                        sessionToken: token
                    })
                } else {
                    console.log("******************************* the user DID NOT match anyone in the user DB")
                    res.status(502).send({error: 'bad gateway'})
                }
            })
        } else {
            res.status(500).send({error: 'failed to authenticate'})
        }
    }, err => res.status(501).send({error: 'failed to process'}))
})

module.exports = router;