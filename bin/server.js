var express = require('express');

var swagger = require('./swagger.json');

var app = express();
app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Authorization, X-Amz-Date');
  next();
});

app.get('/api/swagger.json', function(req, res) {
  res.json(swagger);
});

app.get('/api/account', function(req, res) {
  if(typeof req.get('Authorization') === 'undefined') {
    console.log('Missing authorization');
    res.status(401).json({
      code: 401,
      message: 'No authorization provided',
    });
  } else {
    var auth = req.get('Authorization');
    console.log('Successful request: ' + auth);

    var handleBasicAuth = function() {
      var val = req.get('Authorization').split(/ /)[1];
      var orig = Buffer.from(val, 'base64').toString();
      return orig.split(':')[0];
    };

    var handleAWS4Auth = function() {
      if(typeof req.get('X-Amz-Date') === 'undefined') {
        return null;
      } else {
        // TODO Implement this. If I ever feel like it...
        return 'YOUR NAME GOES HERE';
      }
    };

    var name = null;
    var type = auth.split(/ /)[0];
    switch(type) {
      case "Basic":
        name = handleBasicAuth();
        break;
      case "AWS4-HMAC-SHA256":
        name = handleAWS4Auth();
        break;
      default:
        console.log('Unknown authorization scheme');
        break;
    }

    if(name === null) {
      res.status(401).json({
        code: 401,
        message: 'Authentication failed',
      });
    } else {
      res.json({
        name: name,
      });
    }
  }
});

app.listen(9000, function() {
  console.log('Application listening on port 9000');
});
