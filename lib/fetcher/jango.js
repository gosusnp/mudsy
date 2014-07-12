module.exports = function(request, cheerio, url, utils) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');
    url = url || require('url');
    utils = require('../utils')();

    var BASEURL = 'http://www.jango.com';

    var buildArtistUrl = function(name) {
        return BASEURL + '/music/' + name.replace(/ +/g, '+') + '&c=1';
    };

    var JangoFetcher = function() {
    };

    JangoFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildArtistUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var similar = [];
            var $ = cheerio.load(body, {normalizeWhitespace: true});
            $('#similar_artists > div > a').filter(function() {
                var artist = {};
                var data = $(this);

                artist.name = utils.trimString($('div', data).text());
                artist.link = url.resolve(endpoint, data.attr('href'));
                artist.img = $('img', data).attr('src');
                artist.source = 'jango';

                similar.push(artist);
            });

            callback(null, similar);
        });
    };

    return JangoFetcher;
};
