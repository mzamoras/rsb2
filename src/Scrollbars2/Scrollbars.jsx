/*
 *
 *  File: index.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   12 Sep, 2016 | 03:33 PM
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

import React from 'react';
import * as styles from './basicStyles';
import TinyEmitter from 'tiny-emitter';
import classnames from 'classnames';

import {
    ScrollDataManager,
    MovementManager,
    DraggingManager,
    ScrollingManager,
    VisualChangesManager,
    StyleManager
} from './utils';


const RPT        = React.PropTypes;
const HOR        = 'HORIZONTAL';
const VER        = 'VERTICAL';
const cssChanges = [];

const CSS_CLASS  = 'sb2-scrollbars2';
const CSS_TAG_ID = 'sb2-tag';

const noop      = () => null;
const noopFalse = () => false;
const noopTrue  = () => false;

export const Scrollbars2 = React.createClass( {

    /*** SETUP ***/

    setup(){

        this.emitter = new TinyEmitter();

        this._c    = this.refs['container'];
        this._view = this.refs['view'];
        this._ht   = this.refs['trackHorizontal'];
        this._vt   = this.refs['trackVertical'];
        this._htn  = this.refs['thumbHorizontal'];
        this._vtn  = this.refs['thumbVertical'];

        this.scrollDataManager    = new ScrollDataManager( this.refs, this.props, this.emitter );
        this.movementManager      = new MovementManager( this.scrollDataManager, this.props, this.emitter );
        this.visualChangesManager = new VisualChangesManager();
        this.scrollingManager     = new ScrollingManager( this.refs, this.props, this.scrollDataManager, this.movementManager, this.visualChangesManager );
        this.draggingManager      = new DraggingManager( this.refs, this.scrollDataManager );


        this.emitter.on( 'scroll:start', this.onScrollStart );
        // this.emitter.on( 'scroll:end', this.onScrollEnd );
        this.emitter.on( 'scroll:end', this.onScrollEnd );
        this.emitter.on( 'scroll:scrolling', this.onScrolling );

        this.emitter.on( 'scroll:atTop', this.atTop );
        this.emitter.on( 'scroll:atBottom', this.atBottom );
        this.emitter.on( 'scroll:atLeft', this.atLeft );
        this.emitter.on( 'scroll:atRight', this.atRight );

        this.addListeners();

    },

    init(){
        this.scrollingManager.initialize();

        this.props.onMount( {
            containerView  : this.refs['container'],
            scrollableView : this.refs['view'],
            scrollbarObject: this,
            initialData    : this.scrollingManager.prepareExportableData()
        } );
    },

    /*** API FUNCTIONS ***/
    api(){
        return {
            toTop      : this.scrollingManager.toTop.bind( this.scrollingManager ),
            toBottom   : this.scrollingManager.toBottom.bind( this.scrollingManager ),
            toLeft     : this.scrollingManager.toLeft.bind( this.scrollingManager ),
            toRight    : this.scrollingManager.toRight.bind( this.scrollingManager ),
            enable     : this.scrollingManager.enable.bind( this.scrollingManager ),
            disable    : this.scrollingManager.disable.bind( this.scrollingManager ),
            cancelFlash: this.scrollingManager.cancelFlash.bind( this.scrollingManager ),
            update     : this.update
        }
    },

    update(){
        this.scrollDataManager.update();
        this.scrollingManager.initializeX();
        this.scrollingManager.initializeY();
    },


    /*** LISTENERS  ***/
    addListeners(){

        this._view.addEventListener( 'scroll', this.onScroll, {
            passive: this.props.passiveEvent,
            capture: true
        } );
        this._view.addEventListener( 'wheel', this.onScroll, {
            capture: true
        } );

        /** object events **/
        this._ht.addEventListener( 'mouseenter', this.onMouseEnterTrack );
        this._ht.addEventListener( 'mouseleave', this.onMouseLeaveTrack );
        this._ht.addEventListener( 'mousedown', this.onMouseDownTrack );
        this._htn.addEventListener( 'mousedown', this.onMouseDownThumb );

        this._vt.addEventListener( 'mouseenter', this.onMouseEnterTrack );
        this._vt.addEventListener( 'mouseleave', this.onMouseLeaveTrack );
        this._vt.addEventListener( 'mousedown', this.onMouseDownTrack );
        this._vtn.addEventListener( 'mousedown', this.onMouseDownThumb );

        this._ht.addEventListener( 'wheel', this.onScrollBarAndThumb, { capture: true } );
        this._vt.addEventListener( 'wheel', this.onScrollBarAndThumb, { capture: true } );
    },
    removeListeners(){
        this._view.removeListener( 'scroll', this.onScroll, {
            passive: this.props.passiveEvent,
            capture: true
        } );
        this._view.removeListener( 'wheel', this.onScroll, {
            capture: true
        } );
    },

    /*** SCROLL EVENTS ***/
    onScroll( event ){
        this.scrollingManager.onScroll( event );
    },
    onScrollStart(){
        this.scrollingManager.onScrollStart();
    },
    onScrollEnd(){
        this.scrollingManager.onScrollEnd();
    },
    onScrolling(){
        this.scrollingManager.onScrolling();
    },

    atTop(){
        this.props.atTop();
    },

    atBottom(){
        this.props.atBottom();
    },

    atLeft(){
        this.props.atLeft();
    },

    atRight(){
        this.props.atRight();
    },

    onScrollBarAndThumb( event ){
        this.scrollingManager.onScrollBarAndThumb( event );
    },


    /*** TRACK EVENTS ***/
    onMouseLeaveTrack( event ){
        this.scrollingManager.onMouseLeaveTrack( event );
    },
    onMouseEnterTrack( event ){
        this.scrollingManager.onMouseEnterTrack( event );
    },
    onMouseDownTrack( event ){
        this.draggingManager.onTrackClicked( event );
    },
    onMouseDownThumb( event ){
        this.draggingManager.onDragStart( event );
    },


    /*** COMPONENT LIFECYCLE ***/

    componentWillMount(){

        const { cssStyleClass, cssStylesheetID } = this.props;

        const isDefaultStyle = cssStyleClass === CSS_CLASS;
        this.styleTagId      = isDefaultStyle ? cssStylesheetID : CSS_TAG_ID + "_" + cssStyleClass;
        this.styleClass      = cssStyleClass;
        this.styleManager    = new StyleManager( this.styleTagId, this.styleClass );
        //this.styleManager.setParsedRules( this.props.parsedStyle || defaultParsedStyle );

        /*
         Starts Hidden when:
         - bar is not required by user
         - there is a flash time and a flash delay and autohide

         */

        this.cssClasses = {
            container : classnames(
                'sb2container', 'initial', this.styleClass.toLowerCase().replace( ".", " " ), {
                    'sb2-auto-hide'    : this.props.autoHide,
                    'sb2-auto-height'  : this.props.autoHeight,
                    'sb2-expand-tracks': this.props.expandTracks,
                    'v-disabled'       : !this.props.showVertical,
                    'h-disabled'       : !this.props.showHorizontal,
                }
            ),
            view      : classnames(
                'sb2-view', {
                    performant: this.props.usePerformantView
                }
            ),
            vTrack    : 'sb2tracks sb2v',
            hTrack    : 'sb2tracks sb2h',
            vThumb    : 'sb2-thumb sb2-v',
            hThumb    : 'sb2-thumb sb2-h',
            body      : 'sb2-body',
            scrolling : 'sb2-scrolling',
            dragging  : 'sb2-dragging',
            autoHideOn: 'sb2-auto-hide-on',
            expanded  : 'sb2-expanded',
        };
    },

    componentDidMount(){
        this.apiFunctions  = ()=> this.api();
        const setupTimeout = setTimeout( () => {
            this.setup();
            this.init();
            clearTimeout( setupTimeout );
        }, 100 );

    },


    /***  RENDERS  ***/
    render(){

        return (
            <div ref="container" style={{ ...styles.container, ...this.props.containerStyle } }
                 className={this.cssClasses.container} >

                {/** MAIN VIEW **/}
                <div ref="view" className="sb2view" style={{ ...styles.view, ...this.props.viewStyle }} >
                    {this.props.children}
                </div>

                {/** HORIZONTAL scroll track and thumb **/}
                <div ref='trackHorizontal' className={this.cssClasses.hTrack}
                     style={{ ...styles.trackX, ...this.props.tracksStyle }} >
                    <div ref='thumbHorizontal' className="sb2thumbs sb2h"
                         style={{ ...styles.thumbnailX, ...this.props.thumbsStyle }} />
                </div>

                {/** VERTICAL scroll track and thumb **/}
                <div ref='trackVertical' className={this.cssClasses.vTrack}
                     style={{ ...styles.trackY, ...this.props.tracksStyle }} >
                    <div ref='thumbVertical' className="sb2thumbs sb2v"
                         style={{ ...styles.thumbnailY, ...this.props.thumbsStyle }} />
                </div>

            </div>
        )
    }
} );

/*** PROPS ***/
Scrollbars2.propTypes = {
    showVertical   : RPT.bool,
    showHorizontal : RPT.bool,
    autoHide       : RPT.bool,
    autoHideTimeout: RPT.number,
    autoHeight     : RPT.bool,
    autoHeightMin  : RPT.number,
    autoHeightMax  : RPT.number,
    thumbMinSize   : RPT.number,
    className      : RPT.string,

    onMount      : RPT.func,
    onScroll     : RPT.func,
    onScrollStart: RPT.func,
    onScrollEnd  : RPT.func,
    onScrollFrame: RPT.func,
    onUpdate     : RPT.func,
    atBottom     : RPT.func,
    atTop        : RPT.func,
    atRight      : RPT.func,
    atLeft       : RPT.func,

    cssStyleClass  : RPT.string,
    cssStylesheetID: RPT.string,
    flashTime      : RPT.number,
    flashTimeDelay : RPT.number,

    containerStyle: RPT.object,
    viewStyle     : RPT.object,
    tracksStyle   : RPT.object,
    thumbsStyle   : RPT.object,
    parsedStyle   : RPT.string,

    preventScrolling : RPT.bool,
    updateOnUpdates  : RPT.bool,
    expandTracks     : RPT.bool,
    syncTracks       : RPT.bool,
    hideUnnecessary  : RPT.bool,
    passiveEvent     : RPT.bool,
    usePerformantView: RPT.bool
};
Scrollbars2.defaultProps = {
    showVertical   : true,
    showHorizontal : false,
    autoHide       : false,
    autoHideTimeout: 1000,
    autoHeight     : false,
    autoHeightMin  : 0,
    autoHeightMax  : 200,
    thumbMinSize   : 30,
    className      : '',

    onMount      : noop,
    onScroll     : noop,
    onScrollStart: noop,
    onScrollEnd  : noop,
    onScrollFrame: noop,
    onUpdate     : noop,
    atBottom     : noop,
    atTop        : noop,
    atRight      : noop,
    atLeft       : noop,

    cssStyleClass  : CSS_CLASS,
    cssStylesheetID: CSS_TAG_ID,
    flashTime      : 0,
    flashTimeDelay : 0,

    containerStyle: {},
    viewStyle     : {},
    tracksStyle   : {},
    thumbsStyle   : {},
    parsedStyle   : null,

    preventScrolling : true,
    updateOnUpdates  : true,
    expandTracks     : false,
    syncTracks       : false,
    hideUnnecessary  : true,
    passiveEvent     : false,
    usePerformantView: true
};

export default Scrollbars2;
