/*
 *
 *  File: start.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   09 Sep, 2016 | 09:49 AM
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
const path        = require( 'path' );
const spawn       = require( 'child_process' ).spawn;
const del         = require( 'del' );
const webpack     = require( 'webpack' );
const wpConfig    = require( './webpack.config.build' );
const babelConfig = require( './babel.build' );

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

module.exports = function (sel) {
    var selected = lib;
    if ( sel ) {
        selected = sel === 'lib' ? lib : dist;
    }
    return new Promise( function (resolve, reject) {
        selected().then( function (response) {
            resolve( response )
        }, (error)=> {
            reject( error );
        } );
    } );
};


function dist() {
    return new Promise( function (resolve, reject) {
        const babelOptions = [
            appPath.src,
            '--out-dir', appPath.dist,
            '--presets', babelConfig.presets,
            '--plugins', babelConfig.plugins,
            '--copy-files',
            '--ansi'
        ];
        
        del( [ 'dist/*', '!dist/.git' ], { dot: true } );
        
        var output         = '';
        const babelProcess = spawn( './node_modules/.bin/babel', babelOptions/*, { stdio: 'inherit' }*/ );
        
        babelProcess.stdout.on( 'data', (data)=> {
            output += data.toString();
        } );
        
        babelProcess.on( 'exit', (code)=> {
            completed( code ).then( ()=> {
                resolve( { message: output.replace( new RegExp(appPath.base + "/", 'g'), '' ), reformat: true } );
            } )
        }, (error) => {
            reject( error );
        } );
        
    } );
}

function lib() {
    return new Promise( function (resolve, reject) {
        wpConfig.entry           = path.join( appPath.mainDir, "index.js" );
        wpConfig.output.path     = appPath.lib;
        wpConfig.output.filename = 'scrollbars2.js';
        
        del( [ 'lib/*', '!lib/.git' ], { dot: true } );
        
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
    } );
}