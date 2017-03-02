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

/*global describe it before*/
//noinspection JSUnresolvedVariable
import React from 'react';
import {createGlobalNode} from './mochaTDDSetup';

//import Scrollbars2 from '../../components/Scrollbars/index';
import Scrollbars2 from '../../lib/scrollbars2';
import Lorem from 'react-lorem-component';

import basicTest from './base.specs';
import apiTest from './api.specs';
import eventsTest from './events.specs';

/* - - C O N F I G U R A T I O N  O F   T E S T I N G   C O M P O N E N T - - */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const innerElem = (style, title)=> {
    return (<div style={style}><h1>{title}</h1><Lorem count={40}/></div>);
};
const component = (props = {}, style = {}, innerStyle = {}, innerTitle = "Something") => {
    return (
        <Scrollbars2 style={style} {...props}>
            {innerElem( innerStyle, innerTitle )}
        </Scrollbars2>);
};

/* - - C O N F I G U R A T I O N   O F   T E S T- - */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

before( 'Global Node Instantiation', function () {
    return createGlobalNode( true );
} );
describe( 'Prepare for test...', function () {
    it( "is browser ready?", function test(done) {
        setTimeout( done, 500 );
    } )
} );

//Tests to run
describe('1. Set of basic tests', function () {
   basicTest(component, '1');
   apiTest(component, '2');
   eventsTest(component, '3');
});
