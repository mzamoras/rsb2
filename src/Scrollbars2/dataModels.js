/*
 * Copyright (c) 2016-present, BackLogics Technologies.
 * All rights reserved.
 *
 * Proprietary and Confidential
 *
 * This source code belongs to it's proprietaries and unauthorized copying
 * of this file, via any medium is strictly prohibited.
 *
 * Author: MiKE Zamora <mzamoras@backlogics.com>
 *
 */

export const dataModels = {
    scrollInfo    : {
        //Scroll Data
        scrollLeft    : null,
        scrollTop     : null,
        scrollWidth   : null,
        scrollHeight  : null,
        clientWidth   : null,
        clientHeight  : null,
        scrollbarWidth: null,
        
        //Movement
        realMovement: {
            direction : 'none',
            directionX: 'none',
            directionY: 'none',
            changeX   : 0,
            changeY   : 0,
        },
        
        //Calculated
        maxScrollTop : null,
        maxScrollLeft: null,
        
        //Thumbs Calculation
        thumbHeight  : null,
        thumbHeightPX: 0,
        thumbWidth   : null,
        thumbWidthPX : 0,
        thumbPosY    : null,
        thumbPosYPX  : 0,
        thumbPosX    : null,
        thumbPosXPX  : 0,
        
        //Position Calculation
        atTop   : null,
        atLeft  : null,
        atBottom: null,
        atRight : null,
        
        //Direction
        direction : null,
        directionX: null,
        directionY: null,
        
        //Size Calculations
        widerThanClient : null,
        tallerThanClient: null,
        
        //Scrollbars required
        requireVertical  : null,
        requireHorizontal: null,
        requireBoth      : null,
        requireNone      : null
    },
    draggingInfo  : {
        bodyClass    : '',
        draggingAxis : null,
        onselectstart: null,
        prevPosY     : null,
        prevPosX     : null
    },
    globalTracking: {
        ticking     : false,
        dragging    : false,
        draggingDir : false,
        scrolling   : false,
        scrollingDir: null,
        resizing    : false,
        //trackMouseOver    : false, //todo: possible delete
        //trackMouseOverX   : false,
        //trackMouseOverY   : false,
        raf         : null,
        rafScrollbar: null,
        rafDragging : null,
        
        interval          : null,
        autoHideTimeout   : null, //todo: possible delete
        autoHideTimeoutX  : null,
        autoHideTimeoutY  : null,
        expandedTimeout   : null, //todo: possible delete
        expandedTimeoutX  : null,
        expandedTimeoutY  : null,
        detectingPointX   : null,
        detectingPointY   : null,
        verticalExpanded  : false,
        horizontalExpanded: false,
        stylesheetObject  : null,
        usableMovement    : false,
        atBottomCalled    : false,
        atTopCalled       : false,
        atRightCalled     : false,
        atLeftCalled      : false,
        hasEverMoveDown   : false,
        hasEverMoveRight  : false,
        
        mouseOverTrack : false, //todo: possible delete
        mouseOverTrackX: false,
        mouseOverTrackY: false,
    }
};
export default dataModels;
