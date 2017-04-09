module.exports = function(request, cheerio, url, utils) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');
    url = url || require('url');
    utils = require('../utils')();

    var BASEURL = 'http://www.similar-artist.com';

    var buildSearchUrl = function(name) {
        return BASEURL + '/similarto/artist/' + name.replace(/ +/g, '%20');
    };

    var SimilarArtistFetcher = function() {
    };

    SimilarArtistFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildSearchUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var similar = [];
            var $ = cheerio.load(body);

            $('#listing > div').filter(function() {
                var artist = {};
                var data = $(this);

                artist.name = $('h1', data).text();
                artist.img = $('img', data).attr('src');
                artist.link = $('a', data).attr('href');
                artist.score = parseFloat($('p', data).first().text().split(': ')[1]);
                artist.source = 'similarartist';

                if (artist.name && artist.score > 0.2) {
                    similar.push(artist);
                }
            });


            callback(null, similar);
        });
    };

    return SimilarArtistFetcher;
};

