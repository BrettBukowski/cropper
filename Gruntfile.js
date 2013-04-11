module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    component: {
      build: {
        options: {
          action: 'build',
          args: {
            name: '<%= pkg.name %>'
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'spec/**/*.js', 'index.js'],
      options: {
        expr: true,
        browser: true,
        node: true
      }
    },

    watch: {
      scripts: {
        files: ['index.js', 'lib/**/*.js', 'test/**/*.js', 'component.json', 'Gruntfile.js'],
        tasks: ['jshint', 'component', 'mocha_phantomjs', 'docker']
      }
    },

    docker: {
      app: {
        expand: true,
        src: ['lib/*.js'],
        dest: 'docs'
      }
    },

    mocha_phantomjs: {
      all: ['test/**/*.html']
    }

  });

  grunt.loadNpmTasks('grunt-docker');
  grunt.loadNpmTasks('grunt-component');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  grunt.registerTask('build', ['jshint', 'mocha_phantomjs', 'component', 'uglify', 'docker']);
  grunt.registerTask('test', ['jshint', 'component', 'mocha_phantomjs']);
};
