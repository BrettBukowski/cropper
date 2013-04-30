module.exports = function(grunt) {

  var port = 8981;

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
        files: ['index.js', 'lib/**/*.js', 'test/**/*.js', 'component.json'],
        tasks: ['jshint', 'component', 'mocha']
      }
    },

    docker: {
      app: {
        expand: true,
        src: ['lib/*.js'],
        dest: 'docs'
      }
    },

    mocha: {
      test: {
        options: {
          reporter: 'Spec',
          urls: ['http://localhost:' + port + '/test/runner.html']
        }
      }
    },

    connect: {
      server: {
        options: {
          port: port,
          base: '.'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-docker');
  grunt.loadNpmTasks('grunt-component');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['jshint', 'mocha', 'component', 'uglify', 'docker']);
  grunt.registerTask('test', ['jshint', 'component', 'connect', 'mocha']);
};
