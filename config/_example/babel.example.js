/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports = {
    babelrc       : false,
    cacheDirectory: true,
    presets       : [
        'babel-preset-es2015',
        'babel-preset-react',
        'babel-preset-react-hmre'
    ].map( require.resolve ),
    plugins       : [
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-object-rest-spread'
    ].map( require.resolve ).concat( [
        [ require.resolve( 'babel-plugin-transform-runtime' ), {
            helpers    : false,
            polyfill   : false,
            regenerator: true
        } ]
    ] )
};
