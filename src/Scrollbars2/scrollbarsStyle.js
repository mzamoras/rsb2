/*
 *
 *  File: ScrollbarsStyle.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   28 Mar, 2017 | 02:17 AM
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
import reactCSS from 'reactcss';

export default function ( props ) {

    const { flashTime, flashTimeDelay, autoHide, showVertical, showHorizontal } = props;

    const startsHidden        = (flashTime > 0 && flashTimeDelay > 0 && autoHide) || ( autoHide && !flashTime );
    const showBoth            = !startsHidden && showVertical && showHorizontal;
    const showVerticalTrack   = !startsHidden && !showBoth && showVertical;
    const showHorizontalTrack = !startsHidden && !showBoth && showHorizontal;
    const startInvisibleV     = showVertical && startsHidden;
    const startInvisibleH     = showHorizontal && startsHidden;

    return reactCSS( {

        default: {
            trackV   : {
                ...props.tracksStyle,
            },
            trackH   : {
                ...props.tracksStyle,
            },
            thumbV   : {
                ...props.thumbsStyle,
            },
            thumbH   : {
                ...props.thumbsStyle,
            },
            view     : {
                position  : 'absolute',
                width     : "100%",
                height    : "100%",
                overflow  : 'scroll', //#todo: check for disable scroll behaviour
                transform : 'translateZ(0)',
                willChange: 'transform',
                ...props.viewStyle
            },
            container: {
                position: 'relative',
                width   : "100%", // todo: review for fixed parent container width and height
                height  : "100%", // todo: review for fixed parent container width and height
                overflow: 'hidden',
                ...props.containerStyle
            }
        },

        startsHidden: {
            trackV: {
                display: 'none'
            },
            trackH: {
                display: 'none'
            }
        },

        showBoth: {
            trackV: {
                display: 'block'
            },
            trackH: {
                display: 'block'
            }
        },

        showVerticalTrack: {
            trackV: {
                display: 'block'
            },
            trackH: {
                display: 'none'
            }
        },

        showHorizontalTrack: {
            trackV: {
                display: 'none'
            },
            trackH: {
                display: 'block'
            }
        },

        startInvisibleH: {
            trackH: {
                display: 'block',
                opacity: 0
            }
        },

        startInvisibleV: {
            trackV: {
                display: 'block',
                opacity: 0
            }
        }


    }, props, {
        startsHidden, showBoth, showVerticalTrack, showHorizontalTrack, startInvisibleH, startInvisibleV
    } );
}