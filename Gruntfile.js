module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'Gruntfile.js',
                'bin/*.js',
                'lib/**/*.js',
                'spec/**/*.js'
            ]
        },

        run: {
            test: {
                cmd: 'jasmine-node',
                args: [
                    'spec/utests',
                ],
            },
            testloop: {
                cmd: 'jasmine-node',
                args: [
                    'spec/utests',
                    '--autoTest',
                    '--watchFolders', 'lib',
                    '--verbose'
                ],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-run');

    grunt.registerTask('default', ['jshint', 'run:test']);
};
