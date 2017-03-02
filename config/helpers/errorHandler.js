/*
 *
 *  File: errorHandler.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Sep, 2016 | 04:39 PM
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

var chalk         = require( 'chalk' );
var clearConsole  = require( './clearConsole' );
var formatMessage = require( './formatMessage' );
var hasPort       = false;

var friendlySyntaxErrorLabel = 'Syntax error:';
var shouldClearConsole       = true;

function errorHandler(stats) {
    hasPort = process.env.npm_package_config_example_port || false;
    
    if( shouldClearConsole ) clearConsole();
    var hasErrors   = stats.hasErrors();
    var hasWarnings = stats.hasWarnings();
    
    if ( !hasErrors && !hasWarnings ) {
        noErrorsMessage();
        return;
    }
    
    var json              = stats.toJson();
    var formattedErrors   = json.errors.map( message => 'Error in ' + formatMessage( message ) );
    var formattedWarnings = json.warnings.map( message => 'Warning in ' + formatMessage( message ) );
    console.log(formattedErrors);
    if ( hasErrors ) {
        errorMessage();
        
        if ( formattedErrors.some( isLikelyASyntaxError ) ) {
            formattedErrors = formattedErrors.filter( isLikelyASyntaxError );
        }
        
        formattedErrors.forEach( message => {
            console.log( message );
            console.log();
        } );
        
        // If errors exist, ignore warnings.
        return;
    }
    
    if ( hasWarnings ) {
        failedMessage();
        
        formattedWarnings.forEach( message => {
            console.log( message );
            console.log();
        } );
        
        warningMessage();
    }
    
}
function isLikelyASyntaxError(message) {
    return message.indexOf( friendlySyntaxErrorLabel ) !== -1;
}


function warningMessage() {
    console.log( 'You may use special comments to disable some warnings.' );
    console.log( 'Use ' + chalk.yellow( '// eslint-disable-next-line' ) + ' to ignore the next line.' );
    console.log( 'Use ' + chalk.yellow( '/* eslint-disable */' ) + ' to ignore all warnings in a file.' );
}

function failedMessage() {
    console.log( chalk.red( 'Failed to compile. A' ) );
    console.log();
}

function errorMessage() {
    console.log( chalk.red( 'Failed to compile. B' ) );
    console.log();
}

function noErrorsMessage() {
    console.log( chalk.green( 'Compiled successfully!' ) );
    console.log();
    if ( !hasPort ) return;
    console.log( 'The app is running at http://localhost:' + process.env.npm_package_config_example_port + '/' );
    console.log();
}

function compilingMessage() {
    if( shouldClearConsole ) clearConsole();
    console.log( 'Compiling...' );
}

function startingServerMessage() {
    if( shouldClearConsole ) clearConsole();
    console.log( chalk.cyan( 'Starting the development server...' ) );
    console.log();
}


module.exports = {
    noClear : ()=> {
        shouldClearConsole = false
    },
    handler : errorHandler,
    messages: {
        noErrors      : noErrorsMessage,
        error         : errorMessage,
        failed        : failedMessage,
        warning       : warningMessage,
        compiling     : compilingMessage,
        startingServer: startingServerMessage
    }
};