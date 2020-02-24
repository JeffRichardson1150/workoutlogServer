const router = require('express').Router();
const User = require('../db').import('../models/user');
const Log = require('../db').import('../models/log');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
Endpoint        Verb	Description
/api/user/	    POST	Allows a new user to be created with a username and password.
/api/login/	    POST	Allows log in with an existing user.
/api/log/	    POST	Allows users to create a workout log with descriptions, definitions, results, and owner properties.
/api/log/	    GET	    Gets all logs for an individual user.
/api/log/:id	GET	    Gets individual logs by id for an individual user.
/api/log/:id	PUT	    Allows individual logs to be updated by a user.
/api/log/:id	DELETE	Allows individual logs to be deleted by a user.
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

/**********************
 * Post a log
 */
router.post('/log', (req, res) => {
    const logFromRequest = {
        description: req.body.description,
        definition: req.body.definition,
        result: req.body.result,
        owner: req.body.owner,
    }

    console.log(`********************* This is req from logcontroller ${req}  ***********************`);

    Log.create(logFromRequest)
        .then(log => res.status(200).json(log))
        .catch(err => res.json({
            error: err
        }))
})

/*******************************
 * Get all logs
 */
router.get('/log', (req, res) =>{
    Log.findAll()
        .then(log => {
            res.status(200).json(log)
            console.log(`**********  from logcontroller --- status 200 ${log}`)
        })
        .catch(err => res.status(500).json({
            error: err
        }))
});

/*****************
 * Get a single requested log
 */
router.get('/log/:id', (req, res) => { // can put the search string at the end of the URL
    Log.findOne({ // find first instance of ...
            where: {
                id: req.params.id
            }
        })
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({
            error: err
        }))
})

/**********************************************
changing
If specify the id of a log, update that log using the contents of body
********************************************* */
router.put('/log/:id', (req, res) => { 
    Log.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(log => res.status(200).json(log))
        .catch(err => res.json(req.errors))
})

/********************************************** 
Delete
specify the id of the record to delete at the end of the URL
********************************************* */
router.delete('log/:id', (req, res) => {
    Log.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.json({
        error: err
    }))
})


module.exports = router;