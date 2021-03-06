module.exports = {
    appVersion: '1.1.2', //todo: match this version with the appVersion in dojoBootstrap.js before build
    copy: {
        libs: {
            src: 'src/libs/**/*',
            out: 'build/libs'
        },
        access: {
            src: 'src/.htaccess',
            out: 'build'
        }
    },
    imagemin: {
        src: 'src/**/*.{png,jpg,gif,svg}',
        dest: 'build'
    },
    browserSyncSrc: ['src/**/*.html', 'src/**/*.js', 'src/**/*.css'],
    stylus: {
        base: 'src/css',
        watch: 'src/css/**/*.styl',
        src: ['src/css/base.styl', 'src/css/map.styl', 'src/css/report.styl', 'src/css/analysis.styl'],
        devOut: 'src/css',
        buildOut: 'build/css'
    },
    jade: {
        base: 'src',
        watch: 'src/**/*.jade',
        src: ['src/map.jade', 'src/report.jade', 'src/analysis.jade'],
        devOut: 'src',
        buildOut: 'build'
    },
    react: {
        src: 'src/js/**/*.jsx',
        out: 'src/js'
    },
    uglify: {
        src: ['src/js/dojoBootstrap.js', 'src/js/reportBootstrap.js', 'src/js/analysisBootstrap.js'],
        dest: 'build/js'
    },
    optimizer: {
        map: {
            options: {
                baseUrl: 'src',
                paths: {
                    'dojo': 'empty:',
                    'esri': 'empty:',
                    'dijit': 'empty:',
                    'dojox': 'empty:',
                    'react': 'empty:',
                    'js': 'js',
                    'libs': 'libs',
                    'main': 'js/main',
                    'map': 'js/map',
                    'utils': 'js/utils',
                    'components': 'js/components'
                },
                name: 'js/loader',
                out: 'build/js/loader.js'
            }
        },
        report: {
            options: {
                baseUrl: 'src',
                paths: {
                    'dojo': 'empty:',
                    'esri': 'empty:',
                    'dijit': 'empty:',
                    'dojox': 'empty:',
                    'react': 'empty:',
                    'js': 'js',
                    'libs': 'libs',
                    'main': 'js/main',
                    'map': 'js/map',
                    'utils': 'js/utils',
                    'components': 'js/components'
                },
                name: 'js/reportLoader',
                out: 'build/js/reportLoader.js'
            }
        },
        analysis: {
            options: {
                baseUrl: 'src',
                paths: {
                    'dojo': 'empty:',
                    'esri': 'empty:',
                    'dijit': 'empty:',
                    'dojox': 'empty:',
                    'react': 'empty:',
                    'js': 'js',
                    'libs': 'libs',
                    'main': 'js/main',
                    'map': 'js/map',
                    'utils': 'js/utils',
                    'components': 'js/components'
                },
                name: 'js/analysisLoader',
                out: 'build/js/analysisLoader.js'
            }
        }
    }
};
