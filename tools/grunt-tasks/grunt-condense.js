/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*
condense script and link tags to a single instance of each in the
specified HTML file; like grunt-usemin but less confusing and more dumb

example config:

condense: {
  dist: {
    file: 'build/app/index.html',
    script: {
      src: 'js/all.js',
      attrs: { 'data-main': 'all' }
    },
    stylesheet: 'css/all.css'
  }
}
*/
module.exports = function (grunt) {
  var fs = require('fs');

  grunt.registerMultiTask('condense', 'Condense script and link elements', function () {
    var stylesheet = this.data.stylesheet;
    var script = this.data.script;
    var file = this.data.file;

    var content = fs.readFileSync(file, 'utf8');
    var html;

    if (script) {
      // add single <script> just before the closing </body>
      content = content.replace(/<script.*?src.*?.+?><\/script>/g, '');
      html = '<script async="async" src="' + script.src + '"';

      if (script.attrs) {
        for (var k in script.attrs) {
          html += ' ' + k + '="' + script.attrs[k] + '"';
        }
      }

      html += '></script></body>';
      content = content.replace(/<\/body>/, html);
    }

    if (stylesheet) {
      content = content.replace(/<link.+?>/g, '');

      // add a single <link> just above the closing </head>
      html = '<link rel="stylesheet" href="' + stylesheet + '"></head>';
      content = content.replace(/<\/head>/, html);
    }

    // overwrite the original file
    fs.writeFileSync(file, content, 'utf8');
  });
};
