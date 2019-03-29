module.exports = {
    main: {
        compile: {
          options: {
            baseUrl: 'public/js/',
            optimize: 'uglify2',
            inlineText: true,
            dir: 'public/js/data',
            removeCombined: true,
            keepBuildDir: false,
            deps: [],
            shim: {},
            paths: {
                'require': "lib/require.min",
                "jquery": "lib/jquery.min",
                "Vue": "lib/vue.min",
                "ko": "lib/knockout-min",
            },
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
          },
        },
      },
  };
  
