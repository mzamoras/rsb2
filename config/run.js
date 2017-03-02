/*
 *
 *  File: runBuild.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Sep, 2016 | 09:47 PM
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
const clearConsole = require( './helpers/clearConsole' );
const path         = require( 'path' );
const del          = require( 'del' );
const chalk        = require( 'chalk' );
const emoji        = require( 'node-emoji' );
//const spawn        = require( 'child_process' ).spawn;
//const webpack      = require( 'webpack' );
const tasks        = new Map();
//const errorHandler = require( './helpers/errorHandler' );

const buildScript = require('./_build');
const exampleScript = require('./_example');
const testingScript = require('./_testing');

clearConsole();
const dd = console.log;

const resolver = function (dirOrSrc) {
    return path.resolve( __dirname, dirOrSrc );
};

const normalMark = " ===";
const boldMark   = " ###";
const emojiBlank = "  ";

const msgStart = function (task) {
    const mainStyle = chalk.cyan.bold;
    const _emoji    = emoji.get( 'checkered_flag' );
    console.log( mainStyle( boldMark ), _emoji + " ", mainStyle( "Starting task:" ), chalk.dim( ` [ ${task} ]` ) );
};

const msgEnd = function (task, time) {
    const mainStyle = chalk.dim;
    const tm        = time > 1000 ? time / 1000 : time;
    const units     = time > 1000 ? "segs" : "ms";
    console.log( mainStyle( normalMark ), emojiBlank, mainStyle( "Finished after:" ), chalk.dim( `[ ${task} ]` ), mainStyle.bold( tm + " " + units ) );
};

const msgOk = function (task) {
    const mainStyle = chalk.green.bold;
    const _emoji    = emoji.get( 'white_check_mark' );
    console.log( mainStyle( boldMark ), _emoji + " ", mainStyle( "Completed task:" ), chalk.dim( `[ ${task} ]` ) );
};

const msgError = function (task) {
    const mainStyle = chalk.red.bold;
    const _emoji    = emoji.get( 'o' );
    console.log( mainStyle( boldMark ), _emoji + " ", mainStyle( "Failed task:" ), mainStyle( `[ ${task} ]` ) );
};


const appPath = {
    src       : resolver( "../src" ),
    dist      : resolver( "../dist" ),
    lib       : resolver( "../lib" ),
    babelBuild: resolver( "./configurations/babel.build.js" ),
    mainDir   : resolver( "../src/Scrollbars2" ),
};


function run(task) {
    const start = new Date();
    
    msgStart( task );
    
    return Promise.resolve().then( () => tasks.get( task )() ).then( ( response ) => {
        msgEnd( task, new Date().getTime() - start.getTime() );
        const mess = typeof response !== 'undefined' ? response.message : false;
        if ( mess ) {
            console.log(chalk.dim("---------------"));
            console.log( chalk.dim.bold("Process output:") );
            console.log();
            console.log( response.reformat ? chalk.dim(response.message) : response.message );
            console.log(chalk.dim("---------------"));
        }
        msgOk( task );
    }, err => msgError( err ) );
}

tasks.set( 'start', function () {
    return exampleScript();
} );

tasks.set( 'build:dist', function () {
    return Promise.resolve( "xx" );
} );


/** C L E A N **/
tasks.set( 'clean', function () {
    run( 'clean:dist' );
    run( 'clean:lib' );
} );
tasks.set( 'clean:dist', function () {
    return new Promise( function (resolve) {
        del( [ 'dist/*', '!dist/.git' ], { dot: true } );
        resolve();
    } );
    
} );
tasks.set( 'clean:lib', function () {
    return new Promise( function (resolve) {
        del( [ 'lib/*', '!lib/.git' ], { dot: true } );
        resolve();
    } );
} );


/** B U I L D   -  L I B **/
tasks.set( 'build:lib', function () {
    return buildScript('lib');
} );


/** B U I L D   -  D I S T **/
tasks.set( 'build:dist', function () {
    return buildScript('dist');
} );

tasks.set('build', function () {
    return run('build:dist').then( ()=>{
        return run('build:lib')
    } );
});

tasks.set('test', function () {
    return testingScript();
});

tasks.set('test:watch', function () {
    return testingScript();
});

// Execute the specified task or default one. E.g.: node run build
run( /^\w/.test( process.argv[ 2 ] || '' ) ? process.argv[ 2 ] : 'start' /* default */ );