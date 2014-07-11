(function() {
    "use strict";

    var urlFileMapping = {
        'http://www.last.fm/music/the+glitch+mob/+similar': {
            file: 'lastfm.glitchmob.similar.html'
        }
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.lastfm", function() {
        var lastFmFetcher = new fetcher.LastFmFetcher();

        it("fetchSimilar", function(done) {
            lastFmFetcher.fetchSimilar('the glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(15);
                for (var i in data) {
                    var similarArtist = data[i];
                    expect(similarArtist.name).toBeDefined();
                    expect(similarArtist.link).toBeDefined();
                    expect(similarArtist.abstract).toBeDefined();
                    expect(similarArtist.img).toBeDefined();
                    expect(similarArtist.score).toBeDefined();
                    expect(similarArtist.source).toBeDefined();
                }
                done();
            });
        });
    });
}());
