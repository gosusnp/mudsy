module.exports = function() {
    "use strict";

    var my = {};

    my.trimString = function(str) {
        return str.replace(/^ +| +$/g, '');
    };

    return my;
};
