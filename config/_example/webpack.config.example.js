/*
 *
 *  File: webpack.config.example.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Sep, 2016 | 05:45 PM
 *
 *  This file is part of a package and all the information, intellectual
 *  and technical concepts contained here are property of their owners.
 *  Any kind of use, reproduction, distribution, publication, etc. without
 *  express written permission from CapitalMental && BackLogics Technologies
 *  is strictly forbidden.
 *
 *  CapitalMental && BackLogics Technologies
 *  Copyright 2014-present. | All rights reserved.
 *
 *
 *
 */

var path                     = require( 'path' );
var autoprefixer             = require( 'autoprefixer' );
var webpack                  = require( 'webpack' );
var HtmlWebpackPlugin        = require( 'html-webpack-plugin' );
var CaseSensitivePathsPlugin = require( 'case-sensitive-paths-webpack-plugin' );
var WebpackNotifierPlugin    = require( 'webpack-notifier' )

var targetDirRelativity = "../../";
var targetDir           = "example";
var dd                  = console.log;

var paths = {
    appBuild      : resolveApp( 'build' ),
    appHtml       : resolveApp( 'example/index.html' ),
    appFavicon    : resolveApp( 'example/favicon.ico' ),
    //appPackageJson: resolveApp( 'package.json' ),
    realSource    : path.resolve( __dirname, targetDirRelativity, "src" ),
    appSrc        : resolveApp( targetDir ),
    appNodeModules: resolveApp( 'node_modules' ),
    ownNodeModules: resolveApp( 'node_modules' )
};

function resolveApp(relativePath) {
    return path.resolve( __dirname, targetDirRelativity + relativePath );
}
console.log( paths, "YYYY" );
var LessPluginCleanCSS = require( 'less-plugin-clean-css' );

var config = {
    otherVars    : paths,
    //devtool: 'eval',
    //devtool      : 'cheap-module-source-map',
    //devtool      : 'eval',
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
    },
    node         : {
        fs       : "empty",
        stringify: 'empty'
    },
    resolve      : {
        extensions: [ '', '.js', '.jsx', '.json' ],
    },
    resolveLoader: {
        root           : paths.ownNodeModules,
        moduleTemplates: [ '*-loader' ]
    },
    /*lessLoader   : {
        lessPlugins: [
            new LessPluginCleanCSS( { advanced: true } )
        ]
    },*/
    module       : {
        preLoaders: [ {
            test   : /\.jsx?$/,
            loader : 'eslint',
            include: paths.appSrc
        } ],
        loaders   : [ {
            test   : /\.jsx?$/,
            include: [ paths.appSrc, paths.realSource ],
            loader : 'babel',
            query  : require( "./babel.example" )
            /* loaders: [
             'react-hot',
             'babel?presets[]=es2015,presets[]=stage-1,presets[]=react,presets[]=react-hmre,plugins[]=transform-runtime,plugins[]=babel-plugin-transform-class-properties,plugins[]=transform-object-rest-spread' ]
             // loader: 'babel',*/
            // query: require( './babel.dev.js' )
        }, {
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
        }/*, {
            test   : /\.less$/,
            include: [ paths.appSrc, paths.appNodeModules ],
            loader : 'style!css!less'
        }, {
            test   : /\.tpl\.less$/,
            include: [ paths.appSrc, paths.appNodeModules ],
            loader : 'to-string!css!less'
        }*/
        ]
    },
    eslint       : {
        configFile : path.resolve( __dirname, '../configurations/eslint.js' ),
        useEslintrc: false
    },
    postcss      : function () {
        return [ autoprefixer ];
    },
    plugins      : [
        new HtmlWebpackPlugin( {
            inject  : true,
            template: paths.appHtml,
            favicon : paths.appFavicon
        } ),
        new webpack.DefinePlugin( {
             'process.env.NODE_ENV': '"development"'
            // 'process.env.NODE_ENV': '"production"'
        } ),
        // Note: only CSS is currently hot reloaded
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WebpackNotifierPlugin()
    ]
};

module.exports = retrieveConfig();

function retrieveConfig() {
    //dd( "- - - - ", paths );
    return config;
}