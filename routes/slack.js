var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../slackConfig');

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/invite', function(req, res) {
  if (req.body.email) {
    request.post({
        url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
        form: {
          email: req.body.email,
          token: config.slacktoken,
          set_active: true
        }
      }, function(err, httpResponse, body) {
        if (err) return res.send('Error:' + err);

        body = JSON.parse(body);

        console.log(body);
        
        if (body.ok) {
          res.send('Success! Check "'+ req.body.email +'" for an invite from Slack.');
        } else {
          res.send('Failed! ' + body.error);
        }
      });
  } else {
    res.status(400).send('email is required.');
  }
});

module.exports = router;