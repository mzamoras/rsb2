/*
 *
 *  File: scrollbarsClassNames.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   28 Mar, 2017 | 02:26 AM
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

import classnames from 'classnames';

export default function ( props ) {
    return {
        cssContainer: classnames(
            'sb2container', 'initial', props.cssStyleClass.toLowerCase().replace( ".", " " ), {
                'sb2-auto-hide'    : props.autoHide,
                'sb2-auto-height'  : props.autoHeight,
                'sb2-expand-tracks': props.expandTracks,
                'v-disabled'       : !props.showVertical,
                'h-disabled'       : !props.showHorizontal,
            }
        ),
        view        : classnames(
            'sb2-view', {
                performant: props.usePerformantView
            }
        ),
        cssVTrack   : 'sb2tracks sb2v',
        cssHTrack   : 'sb2tracks sb2h',
        cssVThumb   : 'sb2thumbs sb2v',
        cssHThumb   : 'sb2thumbs sb2h',
        scrolling   : 'sb2-scrolling',
        dragging    : 'sb2-dragging',
        autoHideOn  : 'sb2-auto-hide-on',
        expanded    : 'sb2-expanded',
    };
}