(function() {
    "use strict";

    var express = require('express'),
        lessMiddleware = require('less-middleware'),
        morgan = require('morgan'),
        request = require('request'),
        cachedRequest = require('../lib/cached-request')(request),
        mudsy = require('../lib/mudsy')(cachedRequest);

    var app = express();

    app.use(morgan({format: 'dev'}));

    app.get('/api/artists/similar', function(req, res) {
        if (req.query.q) {
            mudsy.findSimilar(req.query.q, function(results) {
                res.send(results);
            });
        }
    });

    app.use('/assets/css', lessMiddleware(__dirname + '/../client/assets/css'));
    app.use('/', express.static(__dirname + '/../client'));

    app.listen(3000);
}());
