module.exports = function(request, cheerio, url, utils) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');
    url = url || require('url');
    utils = require('../utils')();

    var BASEURL = 'http://www.last.fm';

    var buildArtistUrl = function(name) {
        return BASEURL + '/music/' + name.replace(/ +/g, '+');
    };
    var buildSimilarUrl = function(name) {
        return buildArtistUrl(name) + '/+similar';
    };

    var LastFmFetcher = function() {
    };

    LastFmFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildSimilarUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var similar = [];
            var $ = cheerio.load(body, {normalizeWhitespace: true});
            $('.similar-artists > li').filter(function() {
                var artist = {};
                var data = $(this);

                artist.name = utils.trimString($('h3', data).text());
                artist.link = url.resolve(endpoint, $('a.link-reference', data).attr('href'));
                artist.abstract = utils.trimString($('p.wiki-abstract', data).text());
                artist.img = $('img', data).attr('src');
                artist.score = utils.trimString($('span.text-over-image-text', data).text());
                artist.source = 'last.fm';

                similar.push(artist);
            });

            callback(null, similar);
        });
    };

    return LastFmFetcher;
};
