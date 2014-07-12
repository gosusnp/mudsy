module.exports = function(request, cheerio, url, utils) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');
    url = url || require('url');
    utils = require('../utils')();

    var BASEURL = 'http://www.allmusic.com';

    var buildSearchUrl = function(name) {
        return BASEURL + '/search/typeahead/artist/' + name.replace(/ +/g, '+');
    };

    var AllMusicFetcher = function() {
    };

    AllMusicFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildSearchUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var $ = cheerio.load(body),
                result = $('li.result').attr('data-url');

            if (!result)
                return callback({'error': 'not found'});

            request.get({url: url.resolve(BASEURL, result)}, function(err, resp, body) {
                if (err)
                    callback(err);

                var similar = [];
                var $ = cheerio.load(body);
                $('li', $('section.related-artists')).filter(function() {
                    var artist = {};
                    var data = $(this);

                    artist.name = utils.trimString($('.artist > a', data).text());
                    artist.link = url.resolve(BASEURL, $('.artist > a', data).attr('href'));
                    artist.img = $('img', data).attr('src');
                    artist.source = 'allmusic';

                    similar.push(artist);
                });

                callback(null, similar);
            });
        });
    };

    return AllMusicFetcher;
};
