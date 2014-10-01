var express = require('express');
var path = require('path');
var querystring = require('querystring');

module.exports = function(options) {
  var router = new express.Router();
  if(!options) options = {};
  var backend = options.backend || 'filesystem';

  backend = require('./backends/' + backend)(options);

  router.use(function(req, res, next) {
    req.target = querystring.unescape(req.path);
    next();
  });

  router.get('*', function(req, res) {
    var options = req.query;

    backend.get(req.target, options, function(err, data) {
      if(options.follow !== undefined) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });

        res.write(data, "\n");

        fn = backend.follow(req.target, options, res);
        res.socket.on('close', fn);
      } else {
        res.send(err || data);
      }
    });
  });

  router.post('*', function(req, res) {
    var target = req.target;
    var options = req.query;

    if(target.charAt(target.length - 1) == "/") {
      options.directory = true;
      target = target.substr(0, target.length - 1);
    }

    backend.create(target, req, options, function(err, data) {
      if(err)
        res.status(401).send(err);
      else
        res.status(201).send(data);
    });
  });

  router.put('*', function(req, res) {
    var options = req.query;

    backend.update(req.target, req, options, function(err, data) {
      res.send(err || data);
    });
  });

  router.patch('*', function(req, res) {
    var options = req.query;

    backend.touch(req.target, options, function(err, data) {
      res.send(err || data);
    });
  });

  router.delete('*', function(req, res) {
    var options = req.query;

    backend.remove(req.target, options, function(err, data) {
      res.send(err || data);
    });
  });

  return router;
};
