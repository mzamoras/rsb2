/*
 *
 *  File: index.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   09 Sep, 2016 | 06:34 PM
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
/*
 
 const del         = require( 'del' );
 const webpack     = require( 'webpack' );
 const wpConfig    = require( './webpack.config.testing' );
 const babelConfig = require( './babel.testing' );
 */

const spawn       = require( 'child_process' ).spawn;
const path        = require( 'path' );

const resolver = function (dirOrSrc) {
    return path.resolve( __dirname, dirOrSrc );
};

const appPath = {
    base     : resolver( '../../' ),
    tests    : resolver( "../../tests" ),
    dist     : resolver( "../../dist" ),
    lib      : resolver( "../../lib" ),
    mainDir  : resolver( "../../src/Scrollbars2" ),
    karmaFile: resolver( "./karma.config.js" ),
};

module.exports = function (sel) {
    /*var selected = lib;
     if ( sel ) {
     selected = sel === 'lib' ? lib : dist;
     }*/
    return new Promise( function (resolve, reject) {
        testing().then( function (response) {
            resolve( response )
        }, (error)=> {
            reject( error );
        } );
    } );
};


function testing() {
    return new Promise( function (resolve, reject) {
        resolve( { message: "testing" } );
        
        const karmaOptions = [
            'start',
            appPath.karmaFile,
            true
        ];
        
        
        var output         = '';
        const babelProcess = spawn( './node_modules/.bin/karma', karmaOptions, { stdio: 'inherit' } );
        
        babelProcess.stdout.on( 'data', (data)=> {
            output += data.toString();
        } );
        
        babelProcess.on( 'exit', (code)=> {
            completed( code ).then( ()=> {
                resolve( { message: "x", reformat: true } );
            } )
        }, (error) => {
            reject( error );
        } );
        
    } );
}

/*
 function lib() {
 return new Promise( function (resolve, reject) {
 wpConfig.entry           = path.join( appPath.mainDir, "index.js" );
 wpConfig.output.path     = appPath.lib;
 wpConfig.output.filename = 'scrollbars2.js';
 
 del( [ 'lib/!*', '!lib/.git' ], { dot: true } );
 
 webpack( wpConfig, function (err, stats) {
 if ( !err ) {
 resolve( {message: stats.toString( "normal" ), reformat: false} );
 return;
 }
 reject( err );
 } );
 
 } );
 }
 
 function completed(code) {
 return new Promise( function (resolve, reject) {
 if ( code ) {
 reject();
 return;
 }
 resolve();
 } );
 }*/
