(function() {
    "use strict";

    var urlFileMapping = {
        'http://search.mtvnservices.com/typeahead/suggest/?spellcheck.count=5&spellcheck.q=the+glitch+mob&q=the+glitch+mob&siteName=artist_platform&format=json&rows=1': {
            file: 'mtv.glitchmob.search.html'
        },
        'http://www.mtv.com/artists/the-glitch-mob/related-artists/': {
            file: 'mtv.glitchmob.artist.html'
        },
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.mtv", function() {
        var mtvFetcher = new fetcher.MtvFetcher();

        it("fetchSimilar", function(done) {
            mtvFetcher.fetchSimilar('the glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(33);
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
