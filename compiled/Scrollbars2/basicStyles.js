"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 *
 *  File: basicStyles.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   13 Sep, 2016 | 10:14 PM
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

var performanceLayerHack = {
    /*transform: 'translateZ(0)',
    willChange: 'transform'*/
};

var container = exports.container = {};

var view = exports.view = {};

var tracks = exports.tracks = {
    opacity: 0
    /*position: 'absolute',
    ...performanceLayerHack,
    backgroundColor: "#CCC",*/
};

var trackY = exports.trackY = {};

var trackX = exports.trackX = {};

var thumbnails = exports.thumbnails = {};

var thumbnailY = exports.thumbnailY = {};

var thumbnailX = exports.thumbnailX = {};