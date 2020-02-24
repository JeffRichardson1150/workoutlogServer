require('dotenv').config(); // get variables from the .env file
let PORT = process.env.PORT; // Option A define PORT here

// express stuff
const express = require('express'); // importing express
const app = express(); // invoking/creating the express application

// controller imports
const log = require('./controllers/logcontroller'); 
const user = require('./controllers/usercontroller');
const workout = require('./controllers/workoutcontroller');

// db import & sync
const sequelize = require('./db');
sequelize.sync(); // tip: pass in {force: true} for resetting tables
app.use(express.json());

// middleware
app.use(require('./middleware/headers'));

// routes
app.use('/api', workout);
// app.use('/api/log', log);  //if endpoint is api/log, do the log functions else
// app.use('/api/user', user);   // if endpoint is api (without the /log)
// app.use('/api/login', user);   // if endpoint is api (without the /log)
app.use(require('./middleware/validate-session'))


// app.listen(3000, () => console.log('Log app is listening on 3000'));
app.listen(process.env.PORT, () => console.log(`Log app is listening on ${process.env.PORT}`)); // use the .env variable

//Option A
// app.listen(PORT, () => console.log(`Log app is listening on ${PORT}`)); // use the .env variable


// app.use(express.static(__dirname + '/public'))
// console.log(__dirname);

// app.get('/', (req, res) => res.render('index'));








