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

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

let mainNodeID      = 'mochaTDDSetup_mainNode';
let mainNode        = document.getElementById( mainNodeID );
const nodeContainer = [];
let nodesToDestroy  = [];
let styleNode;

export const createGlobalNode = function (asPromise = false) {
    if( asPromise ){
        return new Promise( gNodeCreator );
    }
    gNodeCreator();
};

const gNodeCreator = function(resolve,reject){
    if ( !mainNode ) {
        mainNode = document.createElement( 'div' );
    }
    
    mainNode.setAttribute( 'id', mainNodeID );
    document.body.appendChild( mainNode );
    mainNode.classList.add( 'container-mx' );
    mainNode.style.minWidth = '600px';
    mainNode.style.minHeight = '600px';
    
    if ( !styleNode ) {
        styleNode = document.createElement( 'style' );
        document.head.appendChild( styleNode );
        styleNode.innerHTML = require( '../test.tpl.less' );
    }
    return resolve ? resolve(mainNode) : mainNode;
};

export const makeNode = function () {
    if ( !mainNode ) {
        createGlobalNode();
    }
    const id       = "_testNode" + (nodeContainer.length + 1);
    const caseNode = document.createElement( 'div' );
    nodeContainer.push( { id, caseNode, destroy: false } );
    
    caseNode.setAttribute( 'id', id );
    caseNode.style.maxWidth = '70%';
    caseNode.style.height = '300px';
    //caseNode.style.minHeight = '300px';
    caseNode.style.border = '3px solid purple';
    caseNode.style.marginTop = '3px';
    caseNode.style.marginLeft = '3px';
    caseNode.style.overflow = 'hidden';
    caseNode.style.padding = 0;
    caseNode.style.position = 'relative';
    mainNode.appendChild( caseNode );
    return { caseNode, id, destroy:function( autoDestroy=false ){
        autoDestroySingle( autoDestroy, id, caseNode );
    }};
};

export const itComponent = function (component, callBack) {
    return function (done) {
        const thisNodeInfo = makeNode();
        const thisNodeObj  = thisNodeInfo.caseNode;
        const thisNodeID   = thisNodeInfo.id;
        //console.log("creating ", thisNodeID);
        render( component, thisNodeObj, function () {
            callBack( function (shouldDestroy = false) {
                if ( shouldDestroy ) {
                    nodesToDestroy.push( { thisNodeID, thisNodeObj } );
                    destroyNodes();
                    done();
                }
                else {
                    done();
                }
                
            }, this );
        } )
    }
};

export const itComponentAsync = function (component, callBack) {
    
    return function (done) {
        
        const thisNodeInfo = makeNode();
        const thisNodeObj  = thisNodeInfo.caseNode;
        const thisNodeID   = thisNodeInfo.id;
        
        render( component, thisNodeObj, function () {
            const newPromise = new Promise( callBack.bind( this ) );
            newPromise.then( function (shouldDestroy) {
                if ( shouldDestroy ) {
                    nodesToDestroy.push( { thisNodeID, thisNodeObj } );
                    destroyNodes();
                    done();
                }
                else {
                    done();
                }
            } );
        } )
    };
};


const destroyNodes = function () {
    if ( nodesToDestroy.length > 0 ) {
        for ( const obj of nodesToDestroy ) {
            const container = document.getElementById( obj.thisNodeID );
            unmountComponentAtNode( obj.thisNodeObj );
            mainNode.removeChild( container );
            nodesToDestroy = nodesToDestroy.filter( node => node.thisNodeID != obj.thisNodeID );
        }
    }
};

const autoDestroySingle = function(shouldDestroy, thisNodeID, thisNodeObj){
    if( shouldDestroy ){
        nodesToDestroy.push( { thisNodeID, thisNodeObj } );
        destroyNodes();
    }
};

export const itRendered = function( component, callbackOrTimeout, callback = null ){
    
    const thisNodeInfo = makeNode();
    const thisNodeObj  = thisNodeInfo.caseNode;
    const thisNodeID   = thisNodeInfo.id;
    const needsTimeout = typeof callbackOrTimeout === 'number';
    
    return new Promise( function (resolve, reject) {
        const doneAndDestroy = function (autoDestroy=false) {
            autoDestroySingle( autoDestroy, thisNodeID, thisNodeObj );
            resolve();
        };
        render( component, thisNodeObj, function () {
            if( needsTimeout ){
                const to = setTimeout( ()=>{
                    callback.bind(this, doneAndDestroy)();
                    clearTimeout( to );
                } ,callbackOrTimeout);
            }
            else{
                callbackOrTimeout.bind(this, doneAndDestroy)();
            }

        });
    } );

};



/*export const itRendered = function( component, callback ){
    const container = {
        name : "SS"
    };
    //this.name = "itRendered";
    //return Promise.resolve(function () {
    return new Promise( function () {
        callback.bind(container)();
    } );
    //});
};*/




export const renderComponentBeforeEachTest = function (component, destroyable) {
    
    const thisNodeInfo = makeNode();
    const thisNodeObj  = thisNodeInfo.caseNode;
    const thisNodeID   = thisNodeInfo.id;
    let thisComponent  = null;
    
    if ( destroyable ) {
        nodesToDestroy.push( { thisNodeID, thisNodeObj } );
    }
    
    render( component, thisNodeObj, function () {
        thisComponent = this;
    } );
    
    return thisComponent;
};

export const destroyIfNeededAfterEachTest = function () {
    destroyNodes();
};

