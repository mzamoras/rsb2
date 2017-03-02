/*
 *
 *  File: exampleHelpers.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Dec, 2016 | 04:32 PM
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

export function rainbow( n ) {
    return `hsl(${n}, 100%, 50%)`;
}

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function inWords( num ) {
    num = num.toString();
    if ( num.length > 9 ) return 'overflow';
    const n = ('000000000' + num).substr( -9 ).match( /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/ );
    if ( !n ) return;
    var str = '';
    str += (n[1] > 0) ? (a[Number( n[1] )] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'billion ' : '';
    str += (n[2] > 0) ? (a[Number( n[2] )] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'million ' : '';
    str += (n[3] > 0) ? (a[Number( n[3] )] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] > 0) ? (a[Number( n[4] )] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] > 0) ? ((str !== '') ? 'and ' : '') + (a[Number( n[5] )] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}