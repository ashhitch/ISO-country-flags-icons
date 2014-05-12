/*!
 * Fresh Egg Project Grunt File
 */
module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Last Build <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n' +
            ' * Files Compiled with Grnt do not edit directly!!!\n' +
            ' */  \n\n',

    // Task configuration.
        notify: {
        task_name: {
        options: {
          // Task-specific options go here.
        }
      },
      builddone: {
        options: {
          title: 'Task Complete Sir',  // optional
          message: 'Project Built', //required
        }
      },
      watchless: {
        options: {
          title: 'Task Complete Sir',  // optional
          message: 'LESS Built', //required
        }
      },
      watchimages: {
        options: {
          title: 'Task Complete Sir',  // optional
          message: 'Images compressed', //required
        }
      },
      watchjs: {
        options: {
          title: 'Task Complete Sir',  // optional
          message: 'JS Built', //required
        }
      },
      watchhbs: {
        options: {
          title: 'Task Complete Sir',  // optional
          message: 'HTML Built', //required
        }
      }
    },
    clean: {
      options: { force: true },
      build: ['dist']
    },
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: '<%= pkg.live %>/css/<%= pkg.name %>.css.map'
        },
        files: {
          '<%= pkg.live %>/css/<%= pkg.name %>.css': '<%= pkg.dev %>/less/flags.less'
        }
      },
      minify: {
        options: {
          cleancss: true,
          banner: '<%= banner %>'
        },
        files: {
          '<%= pkg.live %>/css/<%= pkg.name %>.min.css': '<%= pkg.live %>/css/<%= pkg.name %>.css',
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '<%= pkg.dev %>/less/.csslintrc'
      },
      src: [
        '<%= pkg.live %>/css/<%= pkg.name %>.css',
      ]
    },
    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: '<%= pkg.live %>/css/*.css'
      }
    },
    csscomb: {
      options: {
        config: '<%= pkg.dev %>/less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: '<%= pkg.live %>/css/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= pkg.live %>/css/'
      }
    },
    copy: {
      imgs: {
        expand: true,
        cwd: '<%= pkg.dev %>/flags/',
        src: '**',
        dest: '<%= pkg.live %>/flags/',
        filter: 'isFile'
      }
    },

    img: {
        all: {
          src: ['<%= pkg.live %>/flags/png/**.{png}'],
          dest: '<%= pkg.live %>/flags/png/'
      }
    },
    svgmin: {
        options: {
            plugins: [
              { removeViewBox: false },
              { removeUselessStrokeAndFill: false }
            ]
        },
        dist: {
            files: [{
                expand: true,        // Enable dynamic expansion.
                cwd: '<%= pkg.live %>/flags/svg/',
                src: ['**/*.svg'],
                dest: '<%= pkg.live %>/flags/svg/',
                ext: '.svg'
            }]
        }
    },
    watch: {

      less: {
        files: ['<%= pkg.dev %>/less/*.less','<%= pkg.dev %>/less/**/*.less'],
        tasks: ['less','notify:watchless']
      },
      images: {
        files: ['<%= pkg.dev %>/svg/**'],
        tasks: ['copy:imgs','img','svgmin','notify:watchimages']
      },

    },
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  require('time-grunt')(grunt);

  // Img distribution task.
  grunt.registerTask('dist-img', ['img', 'svgmin']);


  // CSS distribution tasks.
  grunt.registerTask('less-compile', ['less:compileCore']);
  grunt.registerTask('dist-css', ['less-compile', 'csscomb', 'less:minify']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean','copy', 'dist-css', 'svgmin', 'img' ,'notify:builddone']);
  // Default task.
  grunt.registerTask('default', ['dist']);

  grunt.registerTask('cleanme', ['clean']);

};
