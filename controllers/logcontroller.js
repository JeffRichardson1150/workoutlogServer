const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Log = require('../db').import('../models/log'); // if can access db, then import the model

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

/************************
 * logcontroller gets called by app.js for endpoint /api/log
 */

/**********************
 * Post a log
 */
router.post('/', (req, res) => {
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
router.get('/', (req, res) =>{
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
router.get('/:id', (req, res) => { // can put the search string at the end of the URL
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
router.put('/:id', (req, res) => { 
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
router.delete('/:id', (req, res) => {
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