module.exports = function(grunt) {


    // //任务配置
    // grunt.initConfig({
    //   pkg: grunt.file.readJSON('package.json'),
    //   uglify: {
    //     options: {
    //       banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //     },
    //     build: {
    //       src: 'public/js/*.js',
    //       dest: 'build/<%= pkg.name %>.min.js'
    //     }
    //   }
    // });
    // // 载入任务
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // // 注册任务
    // grunt.registerTask('default', ['uglify']);





    // var _ = require('underscore'),
    //     path = require('path'),
    //     configDir = './grunt/config';
    //     tasks = './grunt/tasks'
    // require('load-grunt-config')(grunt, {
    //     configPath: path.join(__dirname, configDir),
    //     jitGrunt: {
    //         customTasksDir: './grunt/tasks',
    //         staticMappings: {
    //             require: 'grunt-contrib-requirejs'
    //         }
    //     }
    // });


    var files = grunt.file.expand('public/js/*.js');
    var requireOptions = {};
    files.forEach(function (file) {
        var filenamelist = file.split('/');
        var num = filenamelist.length;
        var filename = filenamelist[num - 1].replace(/\.js$/,'');
        requireOptions[filename] = {
            options: {
                baseUrl: 'public/js',
                paths: {
                    'require': "lib/require.min",
                    "jquery": "lib/jquery.min",
                    "Vue": "lib/vue.min",
                    "ko": "lib/knockout-min",
                },
                dir: 'public/static/js',
                optimize: 'uglify2',
                removeCombined: true,
                map: { "*": {
                    "index": "index",
                    "test": "test"
                } },
                modules: [
                    {
                        name: 'main.min',
                        create: true,
                        include: [
                            'index',
                            'jquery',
                            'Vue',
                            'ko',
                        ],
                        exclude: [ 
                        ],
                    },
                    {
                        name: 'test.min',
                        create: true,
                        include: [
                            'jquery',
                            'Vue',
                            'test'
                        ],
                        exclude: [ 
            
                        ],
                    }
                ],
            }
        };
    });

    grunt.initConfig({
        requirejs: requireOptions,
    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('default', ['requirejs'])
};