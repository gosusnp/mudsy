(function() {
    "use strict";

    var urlFileMapping = {
        'http://www.jango.com/music/the+glitch+mob&c=1': {
            file: 'jango.glitchmob.artist.html'
        },
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.jango", function() {
        var jangoFetcher = new fetcher.JangoFetcher();

        it("fetchSimilar", function(done) {
            jangoFetcher.fetchSimilar('the glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(6);
                for (var i in data) {
                    var similarArtist = data[i];
                    expect(similarArtist.name).toBeDefined();
                    expect(similarArtist.link).toBeDefined();
                    expect(similarArtist.img).toBeDefined();
                    expect(similarArtist.source).toBeDefined();
                }
                done();
            });
        });
    });
}());
