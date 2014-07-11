module.exports = function() {
    "use strict";

    var fs = require('fs');
    var readFile = function(name) {
        var content = fs.readFileSync('spec/data/' + name);
        return content;
    };

    var RequestMock = function(urlFileMapping) {
        this.urlFileMapping = urlFileMapping;
    };

    RequestMock.prototype.get = function(args, callback) {
        var result = this.urlFileMapping[args.url];
        if (result) {
            var body = readFile(result.file);
            callback(result.err, result.resp, body);
        } else {
            callback({'error': 'not found'}, null, null);
        }
    };

    return RequestMock;
};
