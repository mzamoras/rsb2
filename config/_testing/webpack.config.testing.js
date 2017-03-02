/*
 * Copyright (c) 2016-present, BackLogics Technologies.
 * All rights reserved.
 *
 * Proprietary and Confidential
 *
 * This source code belongs to it's proprietaries and unauthorized copying
 * of this file, via any medium is strictly prohibited.
 *
 * Author: MiKE Zamora <mzamoras@backlogics.com>
 *
 */

var path                     = require( 'path' );
var autoprefixer             = require( 'autoprefixer' );
var webpack                  = require( 'webpack' );
var HtmlWebpackPlugin        = require( 'html-webpack-plugin' );
var CaseSensitivePathsPlugin = require( 'case-sensitive-paths-webpack-plugin' );

var paths = {
    appBuild      : resolveApp( 'build' ),
    appHtml       : resolveApp( 'index.html' ),
    appFavicon    : resolveApp( 'favicon.ico' ),
    appPackageJson: resolveApp( 'package.json' ),
    appSrc        : resolveApp( 'src' ),
    appTesting    : resolveApp( 'tests' ),
    appNodeModules: resolveApp( 'node_modules' ),
    ownNodeModules: resolveApp( 'node_modules' )
};
console.log( paths );

function resolveApp(relativePath) {
    return path.resolve( relativePath );
}

var LessPluginCleanCSS = require( 'less-plugin-clean-css' );

//noinspection JSUnresolvedFunction
module.exports = {
    //devtool: 'eval',
    /*devtool      : 'cheap-module-source-map',
     entry        : [
     require.resolve( 'webpack-dev-server/client' ) + '?/',
     require.resolve( 'webpack/hot/dev-server' ),
     require.resolve( '../helpers/polyfills' ),
     path.join( paths.appSrc, 'index' )
     ],
     output       : {
     // Next line is not used in dev but WebpackDevServer crashes without it:
     path      : paths.appBuild,
     pathinfo  : true,
     filename  : 'static/js/bundle.js',
     publicPath: '/'
     },*/
    node      : {
        fs       : "empty",
        stringify: 'empty'
    },
    resolve   : {
        extensions: [ '', '.js', '.jsx', '.json' ],
        alias     : {
            'sinon': 'sinon/pkg/sinon'
        }
    },
    /*resolveLoader: {
     root           : paths.ownNodeModules,
     moduleTemplates: [ '*-loader' ]
     },*/
    lessLoader: {
        lessPlugins: [
            //new LessPluginCleanCSS({advanced: true})
        ]
    },
    externals : {
        'cheerio'                       : 'window',
        'react/addons'                  : true, // important!!
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext'        : true
    },
    module    : {
        noParse  : [
            /node_modules\/sinon\//
        ],
        externals: {
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext'        : true,
            'react/addons'                  : true
        },
        /*preLoaders: [ {
         test   : /\.jsx?$/,
         loader : 'eslint',
         include: paths.appSrc
         } ],*/
        loaders  : [ {
            test   : /\.jsx?$/,
            include: [paths.appSrc, paths.appTesting],
            loader : 'babel',
            query  : { plugins: [ 'transform-runtime' ], presets: [ "react", "es2015", "stage-1" ] }
            /*loaders: [
             'react-hot',
             'babel?presets[]=es2015,presets[]=stage-1,presets[]=react,presets[]=react-hmre,plugins[]=transform-runtime,plugins[]=babel-plugin-transform-class-properties,plugins[]=transform-object-rest-spread'
             ]*/
        }, /*{
         test   : /\.css$/,
         include: [ paths.appSrc, paths.appNodeModules ],
         loader : 'style!css!postcss'
         }, {
         test   : /\.json$/,
         include: [ paths.appSrc, paths.appNodeModules ],
         loader : 'json'
         }, {
         test   : /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
         include: [ paths.appSrc, paths.appNodeModules ],
         loader : 'file',
         query  : {
         name: 'static/media/[name].[ext]'
         }
         }, {
         test   : /\.(mp4|webm)(\?.*)?$/,
         include: [ paths.appSrc, paths.appNodeModules ],
         loader : 'url',
         query  : {
         limit: 10000,
         name : 'static/media/[name].[ext]'
         }
         },*/ {
            test   : /\.tpl\.less$/,
            include: [ paths.appSrc, paths.appNodeModules, paths.appTesting ],
            loader : 'to-string!css!less'
        }
        ]
    }//,
    /*eslint       : {
     configFile : path.join( __dirname, 'eslint.js' ),
     useEslintrc: false
     },*/
    /*postcss      : function () {
     return [ autoprefixer ];
     }*/
    //,
    /*plugins      : [
     /!* new HtmlWebpackPlugin( {
     inject  : true,
     template: paths.appHtml,
     favicon : paths.appFavicon
     } ),*!/
     new webpack.DefinePlugin( {
     'process.env.NODE_ENV': '"development"'
     } ),
     // Note: only CSS is currently hot reloaded
     new webpack.HotModuleReplacementPlugin(),
     new CaseSensitivePathsPlugin()
     ]*/
};