(function() {
    "use strict";

    var urlFileMapping = {
        'https://itunes.apple.com/search/?media=music&entity=musicArtist&term=the+glitch+mob': {
            file: 'itunes.glitchmob.similar.html'
        },
        'https://itunes.apple.com/us/artist/the-glitch-mob/id314913876?uo=4': {
            file: 'itunes.glitchmob.artist.html'
        }
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.itunes", function() {
        var itunesFetcher = new fetcher.ItunesFetcher();

        it("fetchSimilar", function(done) {
            itunesFetcher.fetchSimilar('the glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(8);
                for (var i in data) {
                    var similarArtist = data[i];
                    expect(similarArtist.name).toBeDefined();
                    expect(similarArtist.link).toBeDefined();
                    expect(similarArtist.score).toBeDefined();
                    expect(similarArtist.source).toBeDefined();
                }
                done();
            });
        });
    });
}());
