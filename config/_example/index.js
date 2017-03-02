/*
 *
 *  File: index.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   09 Sep, 2016 | 12:21 PM
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

const path             = require( 'path' );
const webpack          = require( 'webpack' );
const WebpackDevServer = require( 'webpack-dev-server' );
const wpConfig         = require( './webpack.config.example' );
const errorHandler     = require( '../helpers/errorHandler' );
const openBrowser      = require( '../helpers/openBrowser' );

errorHandler.noClear();
const dd = console.log;

const resolver = function (dirOrSrc) {
    return path.resolve( __dirname, dirOrSrc );
};

const appPath = {
    base   : resolver( '../../' ),
    src    : resolver( "../../src" ),
    dist   : resolver( "../../dist" ),
    lib    : resolver( "../../lib" ),
    mainDir: resolver( "../../src/Scrollbars2" ),
};

var someVar;

module.exports = function () {
    /*var selected = lib;
     if ( sel ) {
     selected = sel === 'lib' ? lib : dist;
     }*/
    //dd( appPath, "XXXXX" );
    return new Promise( function (resolve, reject) {
        runServer().then( function (response) {
            resolve( response )
        }, (error)=> {
            reject( error + "ggg" );
        } );
    } );
};


function runServer() {
    return new Promise( function (resolve, reject) {
        setupCompiler().then( (response)=> {
            
            new WebpackDevServer( response.compiler, {
                historyApiFallback: true,
                hot               : true,//process.env.npm_package_config_example_hot, // Note: only CSS is currently hot reloaded
                publicPath        : wpConfig.output.publicPath,
                quiet             : true,
                watchOptions      : {
                    ignored: /node_modules/
                },
                /*proxy             : {
                    '*': {
                        "target"    : {
                            host    : process.env.npm_package_config_proxy_host,
                            protocol: process.env.npm_package_config_proxy_protocol,
                            port    : process.env.npm_package_config_proxy_port,
                        },
                        changeOrigin: true,
                        secure      : false
                    }
                }*/
            } ).listen( process.env.npm_package_config_example_port, (err) => {
                if ( err ) {
                    reject( { message: "yyy", reformat: true } );
                    return; //console.log( err );
                }
                errorHandler.messages.startingServer();
                openBrowser( process.env.npm_package_config_example_port );
            } );
            //resolve( { message: "serving", reformat: false } );
        }, (error)=> {
            //reject( { message: error + "xxxx", reformat: true } );
        } );
    } );
}


function setupCompiler() {
    //console.log( wpConfig.otherVars, " l l l l l l ll l l" );
    return new Promise( function (resolve, reject) {
        const compiler = webpack( wpConfig, someVar );
        
        //noinspection JSUnresolvedFunction
        compiler.plugin( 'invalid', function (ee) {
            console.log( ee + " - - - - - - - - - - - - - - - - - - - - - - - - - - - - -- -" );
            errorHandler.messages.compiling();
            return;
        } );
        //noinspection JSUnresolvedFunction
        compiler.plugin( 'done', function (stats) {
            //console.log(arguments,  " - - - - - - - - - - - - - - - - - - - - - - - - - - - - -- -");
            console.log( stats.toString( "normal" ) );
            //errorHandler.handler( stats );
        } );
        resolve( { compiler: compiler, message: "OOPP" } );
    } );
    
    
}
