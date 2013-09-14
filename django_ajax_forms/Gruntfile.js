module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {

    },
    qunit: {
      //files: ['grunt/test/**/*.html']
    },
    concat: {
      full: {
        src: ['static/django-ajax-forms/js/util/form.js', 'static/django-ajax-forms/js/template/ajaxforms.js',
            'static/django-ajax-forms/js/util/ajaxformsutils.js', 'static/django-ajax-forms/js/util/ajaxformstemplateutils.js' ],
        dest: 'static/django-ajax-forms/js/<%= pkg.name %>.js'
      },
      noTemplate: {
        src: ['static/django-ajax-forms/js/util/form.js', 'static/django-ajax-forms/js/util/ajaxformsutils.js' ],
        dest: 'static/django-ajax-forms/js/<%= pkg.name %>-notemplate.js'
      }
    },
    uglify: {
        options: {
            banner: '<%= meta.banner %>'
        },

      full: {
        files: {
            'static/django-ajax-forms/js/<%= pkg.name %>.min.js': ['<%= concat.full.dest %>']
        }
      },
      noTemplate: {
        files: {
            'static/django-ajax-forms/js/<%= pkg.name %>-notemplate.min.js': ['<%= concat.noTemplate.dest %>']
        }
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'jshint'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true,

          globals: {
            jQuery: false,
            _: false,
            define: false
          }
      },
    files: ['static/django-ajax-forms/js/template/*.js', 'static/django-ajax-forms/js/util/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('full', ['jshint', 'concat:full', 'uglify:full']);
  grunt.registerTask('noTemp', ['jshint', 'concat:noTemplate', 'uglify:noTemplate']);

};