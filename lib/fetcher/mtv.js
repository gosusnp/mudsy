module.exports = function(request, cheerio, url, utils) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');
    url = url || require('url');
    utils = require('../utils')();

    var BASEURL = 'http://www.mtv.com';
    var APIBASEURL = 'http://search.mtvnservices.com';

    var buildSimilarArtistsFromAlias = function(alias) {
        return BASEURL + '/artists/' + alias + '/related-artists/';
    };
    var buildSearchUrl = function(name) {
        name = name.replace(/ +/g, '+');
        return APIBASEURL + '/typeahead/suggest/?spellcheck.count=5&spellcheck.q=' + name +
            '&q=' + name + '&siteName=artist_platform&format=json&rows=1';
    };

    var MtvFetcher = function() {
    };

    MtvFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildSearchUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var parsedBody = JSON.parse(body),
                result = parsedBody.response.docs[0];

            if (!result)
                return callback({'error': 'not found'});

            request.get({url: buildSimilarArtistsFromAlias(result.platform_artist_alias_s)}, function(err, resp, body) {
                if (err)
                    callback(err);

                var similar = [];
                var $ = cheerio.load(body);
                $('li.related-artists').filter(function() {
                    var artist = {};
                    var data = $(this);

                    artist.name = $('img', data).attr('alt');
                    artist.link = $('a', data).attr('href');
                    artist.img = $('img', $('noscript', data)).attr('src');
                    artist.source = 'mtv';

                    similar.push(artist);
                });

                callback(null, similar);
            });
        });
    };

    return MtvFetcher;
};
