/*
 *
 *  File: webpack.config.build.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Sep, 2016 | 08:22 PM
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

var webpack            = require( 'webpack' );
var LessPluginCleanCSS = require( 'less-plugin-clean-css' );

var useLess = false;
var useCSS  = false;

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin( {
        'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
    } )
];

if ( process.env.NODE_ENV === 'production' ) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin( {
            compressor: {
                screw_ie8: true,
                warnings : false
            }
        } )
    );
}

var config = {
    externals : {
        react      : {
            root     : 'React',
            commonjs2: 'react',
            commonjs : 'react',
            amd      : 'react'
        },
        "react-dom": {
            root     : 'ReactDOM',
            commonjs2: 'ReactDOM',
            commonjs : 'ReactDOM',
            amd      : 'ReactDOM'
        }
    },
    module    : {
        loaders: [ {
            test   : /\.js$/,
            loader : 'babel-loader',
            query  : require( './babel.build.js' ),
            exclude: /node_modules/
        } ]
    },
    output    : {
        //libraryTarget: 'commonjs2'
        libraryTarget: 'umd',
        library:'react-scrollbars2'
    },
    plugins   : plugins,
    resolve   : {
        extensions: [ '', '.js' ],
    },
    lessLoader: {
        lessPlugins: [
            new LessPluginCleanCSS( { advanced: true } )
        ]
    },
};

/** EXTRA LOADERS | CSS **/
if ( useCSS || useLess ) {
    config.module.loaders.push( {
        test   : /\.css$/,
        loader : 'style-loader!css-loader!postcss-loader',
        exclude: /node_modules/
    } );
}
/** EXTRA LOADERS | LESS **/
if ( useLess ) {
    config.module.loaders.push( {
        test   : /\.tpl\.less$/,
        loader : 'to-string-loader!css-loader!less-loader',
        exclude: /node_modules/
    } );
}

module.exports = config;