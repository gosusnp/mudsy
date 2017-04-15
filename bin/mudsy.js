(function() {
    "use strict";

    var mudsy = require('../lib/mudsy')();

    var search = process.argv.slice(2).join(' ');
    if (!search.length) {
        console.log('missing search arguments');
        return;
    }

    mudsy.findSimilar(search, function(results) {
        for (var i in results) {
            var result = results[i];
            var sources = [];
            for (var j in result)
                sources.push(result[j].source);
            console.log(result[0].name + '\t(' + result.length + ')\t[' + sources.join(',') + ']');
        }
    });
}());
