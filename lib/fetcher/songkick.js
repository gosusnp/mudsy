module.exports = function(request, cheerio, url, utils) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');
    url = url || require('url');
    utils = require('../utils')();

    var BASEURL = 'http://www.songkick.com';

    var buildSearchUrl = function(name) {
        return BASEURL + '/search?page=1&per_page=1&type=artists&query=' + name.replace(/ +/g, '+');
    };

    var SongKickFetcher = function() {
    };

    SongKickFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildSearchUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var $ = cheerio.load(body),
                result = $('li.artist > a').attr('href');

            if (!result)
                return callback({'error': 'not found'});

            request.get({url: url.resolve(BASEURL, result)}, function(err, resp, body) {
                if (err)
                    callback(err);

                var similar = [];
                var $ = cheerio.load(body);
                $('li', $('div.related-artists')).filter(function() {
                    var artist = {};
                    var data = $(this);

                    artist.name = utils.trimString($('span.artist-name', data).text());
                    artist.link = url.resolve(BASEURL, $('a', data).attr('href'));
                    artist.img = $('img.artist-profile-image', data).attr('src');
                    artist.source = 'songkick';

                    similar.push(artist);
                });

                callback(null, similar);
            });
        });
    };

    return SongKickFetcher;
};
