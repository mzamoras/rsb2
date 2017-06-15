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

const performanceLayerHack = {
    /*transform: 'translateZ(0)',
    willChange: 'transform'*/
};

export const container = {

    /*width          : '100%',
    height         : '100%',
    //border         : '1px solid red',
    overflow       : 'hidden',
    position       : 'relative',
    backgroundColor: "#DDD",
    ...performanceLayerHack,*/
};

export const view = {
    /*position: 'absolute',
    width   : '100%',
    height  : '100%',
    overflow: 'scroll',
    transform: 'translateZ(0)',
    willChange: 'transform'*/

};

export const tracks = {
    opacity:0
    /*position: 'absolute',
    ...performanceLayerHack,
    backgroundColor: "#CCC",*/
};

export const trackY = {
    /*...tracks,
    //border : '1px solid red',
    top    : 0,
    bottom : 15,
    right  : 15,
    padding: '3px 1px',*/
};

export const trackX = {
    /*...tracks,
    //border: '1px solid blue',
    left  : 0,
    right : 27,
    bottom: 15,*/
};

export const thumbnails = {
   /* backgroundColor: '#A1A1A1',
    borderRadius   : '5px',
    //...performanceLayerHack,*/
};

export const thumbnailY = {
    //height:'100%'
   /* ...thumbnails,
    minHeight: 30,
    width    : 8,*/
};

export const thumbnailX = {
    /*...thumbnails,
    //minWidth: 30,
    height  : 8,*/
};
