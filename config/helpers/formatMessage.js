
/*
 *
 *  File: formatMessage.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Sep, 2016 | 04:46 PM
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

var friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

module.exports = function( message ) {
    return message
        // Make some common errors shorter:
        .replace(
            // Babel syntax error
            'Module build failed: SyntaxError:',
            friendlySyntaxErrorLabel
        )
        .replace(
            // Webpack file not found error
            /Module not found: Error: Cannot resolve 'file' or 'directory'/,
            'Module not found:'
        )
        // Internal stacks are generally useless so we strip them
        .replace( /^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '' ) // at ... ...:x:y
        // Webpack loader names obscure CSS filenames
        .replace( './~/css-loader!./~/postcss-loader!', '' );
};