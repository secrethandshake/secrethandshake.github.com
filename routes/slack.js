var express = require('express');
var router = express.Router();
var request = require('request');
var validator = require('email-validator');
var config = require('../slackConfig');

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/invite', function(req, res) {
  var email = req.body.email.trim();

  if (email) {
    if (validator.validate(email)) {
      request.post({
        url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
        form: {
          email: email,
          token: config.slacktoken,
          set_active: true
        }
      }, function(err, httpResponse, body) {
        if (err) return res.send(err);

        body = JSON.parse(body);

        console.log('>' + email + '<');
        console.log(body);
        
        if (body.ok) {
          res.send('Invitation sent to ' + email);
        } else {
          res.send('Failed! ' + body.error);
        }
      });
    } else {
      res.status(400).send('Invalid email.');
    } 
  } else {
    res.status(400).send('Email is required.');
  }
});

module.exports = router;