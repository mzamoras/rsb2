/*
 *
 *  File: babel.build.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   09 Sep, 2016 | 08:27 AM
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

module.exports = {
    babelrc: false,
    presets: [
        'babel-preset-react',
        'babel-preset-es2015',
        'babel-preset-stage-1'
    ],
    plugins: [
        'babel-plugin-syntax-trailing-function-commas',
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-object-rest-spread',
        'babel-plugin-transform-react-constant-elements',
    ]
};
