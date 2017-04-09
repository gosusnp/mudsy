(function() {
    "use strict";

    var urlFileMapping = {
        'http://www.similar-artist.com/similarto/artist/glitch%20mob': {
            file: 'similarartist.glitchmob.search.html'
        },
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.similarartist", function() {
        var allMusicFetcher = new fetcher.SimilarArtistFetcher();

        it("fetchSimilar", function(done) {
            allMusicFetcher.fetchSimilar('glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(24);
                for (var i in data) {
                    var similarArtist = data[i];
                    expect(similarArtist.name).toBeDefined();
                    expect(similarArtist.link).toBeDefined();
                    expect(similarArtist.img).toBeDefined();
                    expect(similarArtist.score).toBeDefined();
                    expect(similarArtist.source).toBeDefined();
                }
                done();
            });
        });
    });
}());

