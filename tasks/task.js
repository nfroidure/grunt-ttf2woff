/*
 * grunt-ttf2woff
 * https://github.com/nfroidure/grunt-ttf2woff
 *
 * Copyright (c) 2013 Nicolas Froidure
 * Licensed under the MIT license.
 */

'use strict';

var Path = require('path')
  , Package = require('../package.json')
  , ttf2woff = require('ttf2woff');

module.exports = function(grunt) {

  grunt.registerMultiTask('ttf2woff', Package.description, function() {
    var done = this.async();

    this.files.forEach(function (files) {


      files.src.forEach(function(srcFile) {
        var srcExt = Path.extname(srcFile),
            fontName,
            destFile = files.dest;

        if('.ttf' !== srcExt) {
          grunt.log.fail('The given file seems to not be a TTF font ('
            + srcFile + ')');
        }

        // If we're not using grunt file expansion and dest is a directory, we'll
        // need to build our dest path manually
        if(!files.orig.expand && grunt.file.isDir(destFile)) {
          fontName = fontName = Path.basename(srcFile, srcExt),
          destFile = Path.join(files.dest, fontName) + '.woff';
        } else {
          // We didn't build the path, so make sure it has a .woff extension
          destFile = destFile.replace(/.ttf$/, '.woff');
        }

        try {
          grunt.file.write(destFile,
            new Buffer(ttf2woff(
              new Uint8Array(grunt.file.read(srcFile, {
                encoding: null
              }))
            ).buffer)
          );

          grunt.log.ok('Created "' + destFile + '" from "' + srcFile + '"');
          done();

        } catch(e) {

          grunt.log.fail('Unable to create "' + destFile + '" from "' + srcFile
            + '" (error: ' + e.message + ')');
          done();

        }

      });

    });

  });

};

