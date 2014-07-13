(function() {
    "use strict";

    var stream = require("stream"),
        util = require("util");
    var mr = require("../../lib/mr")();

    var StreamMock = function() {
        stream.Readable.call(this, {objectMode: true});
    };
    util.inherits(StreamMock, stream.Readable);
    StreamMock.prototype._read = function() {};

    describe("mr.mapred", function() {
        it("basic mr test", function(done) {
            var s1 = new StreamMock(),
                s2 = new StreamMock();
            var r = new mr.mapred({
                streams: [s1, s2],
                reduce: function(acc, values) {
                    for (var i in values)
                        acc.push(values[i]);
                    return acc;
                },
                finalize: function(values) {
                    expect(values.length).toEqual(5);
                    expect(values).toContain(1);
                    expect(values).toContain(2);
                    expect(values).toContain(3);
                    expect(values).toContain(4);
                    expect(values).toContain(5);
                    done();
                }
            });
            s1.push(1);
            s2.push(2);
            s2.push(3);
            s2.push(null);
            s1.push(4);
            s1.push(5);
            s1.push(null);
        });
    });

    describe("mr.Streamify", function() {
        var WriteStream = function() {
            stream.Writable.call(this, {objectMode: true});
            this.result = [];
        };
        util.inherits(WriteStream, stream.Writable);
        WriteStream.prototype._write = function(data, encoding, callback) {
            this.result.push(data);
            callback();
        };

        it("streamifies an array", function(done) {
            var resultStream = new WriteStream();
            var testStream = new mr.Streamify([1, 2, 3, 4]);
            testStream.on('end', function() {
                expect(resultStream.result).toEqual([1, 2, 3, 4]);
                done();
            });
            testStream.pipe(resultStream);
        });

        it("streamifies a function", function(done) {
            var resultStream = new WriteStream();
            var testStream = new mr.Streamify(function(callback) { callback([1, 2, 3, 4]); });
            testStream.on('end', function() {
                expect(resultStream.result).toEqual([1, 2, 3, 4]);
                done();
            });
            testStream.pipe(resultStream);
        });
    });
}());
