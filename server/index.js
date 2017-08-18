const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({ db })
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
module.exports = app

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  db.models.user.findById(id)
    .then(user => done(null, user))
    .catch(done))

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // session middleware with passport
  app.use(session({
    secret: process.env.SESSION_SECRET || 'my best friend is Cody',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })

}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))

  // set up our socket control center
  const io = socketio(server)
  require('./socket')(io)
}

const syncDb = () => db.sync()

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  sessionStore.sync()
    .then(syncDb)
    .then(createApp)
    .then(startListening)
} else {
  createApp()
}


/*
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/


// /*
//  * Import required packages.
//  * Packages should be installed with "npm install".
//  */
// const express = require('express');
// const aws = require('aws-sdk');
// const path = require('path');

// /*
//  * Set-up and run the Express app.
//  */
// const app = express();
// app.set('views', './views');
// app.use(express.static('./public'));
// app.engine('html', require('ejs').renderFile);
// app.listen(process.env.PORT || 3000);

// /*
//  * Configure the AWS region of the target bucket.
//  * Remember to change this to the relevant region.
//  */
// aws.config.region = 'eu-west-1';

// /*
//  * Load the S3 information from the environment variables.
//  */
// const S3_BUCKET = process.env.S3_BUCKET;

// /*
//  * Respond to GET requests to /account.
//  * Upon request, render the 'account.html' web page in views/ directory.
//  */

//    app.use(express.static(path.join(__dirname, '..', 'public')))
//   app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public/index.html'))
//   })


//  * Respond to GET requests to /sign-s3.
//  * Upon request, return JSON containing the temporarily-signed S3 request and
//  * the anticipated URL of the image.

// app.get('/sign-s3', (req, res) => {
//   const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileType = req.query['file-type'];
//   const s3Params = {
//     Bucket: S3_BUCKET,
//     Key: fileName,
//     Expires: 60,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//     };
//     res.write(JSON.stringify(returnData));
//     res.end();
//   });
// });

// /*
//  * Respond to POST requests to /submit_form.
//  * This function needs to be completed to handle the information in
//  * a way that suits your application.
//  */
// app.post('/save-details', (req, res) => {
//   // TODO: Read POSTed form data and do something useful
// });
