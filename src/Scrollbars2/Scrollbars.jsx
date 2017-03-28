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

//noinspection JSUnresolvedVariable
import React, {Component, PropTypes} from 'react';
import autobind from 'react-autobind-helper';

import TinyEmitter from 'tiny-emitter';

const defaultParsedStyle = require( 'to-string!css!less!./style/style.less' );

const CSS_CLASS  = 'sb2-scrollbars2';
const CSS_TAG_ID = 'sb2-tag';
const noop       = () => null;


import {
    ScrollDataManager,
    MovementManager,
    DraggingManager,
    ScrollingManager,
    VisualChangesManager,
    StyleManager
} from './utils';
import scrollbarsStyle from './scrollbarsStyle';
import scrollbarsClassNames from './scrollbarsClassNames';


export class Scrollbars2 extends Component {
    constructor( props ) {

        super( props );
        autobind( this );

        this.reactStyle = {
            container : true,
            view      : true,
            bothThumbs: true,
            bothTracks: true,
            trackH    : true,
            trackV    : true,
            thumbH    : true,
            thumbV    : true,
        };

        this.reactStyle = scrollbarsStyle( props );
        this.cssClasses = scrollbarsClassNames( props );
    }


    setup() {
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
        this.emitter.on( 'scroll:end', this.onScrollEnd );
        this.emitter.on( 'scroll:scrolling', this.onScrolling );

        this.emitter.on( 'scroll:atTop', this.atTop );
        this.emitter.on( 'scroll:atBottom', this.atBottom );
        this.emitter.on( 'scroll:atLeft', this.atLeft );
        this.emitter.on( 'scroll:atRight', this.atRight );

        this.addListeners();
        this.api = {};
        this.exposeApiFunctions();
    };

    init() {
        this.scrollingManager.initialize();

        this.props.onMount( {
            containerView  : this.refs['container'],
            scrollableView : this.refs['view'],
            scrollbarObject: this,
            initialData    : this.scrollingManager.prepareExportableData()
        } );
    };

    /*** API FUNCTIONS ***/
    exposeApiFunctions() {

        this.api.toTop       = ( dist = 0 ) => this.scrollingManager.toTop( dist );
        this.api.toLeft      = ( dist = 0 ) => this.scrollingManager.toLeft( dist );
        this.api.toBottom    = ( dist = 0 ) => this.scrollingManager.toBottom( dist );
        this.api.toRight     = ( dist = 0 ) => this.scrollingManager.toRight( dist );
        this.api.enable      = () => this.scrollingManager.enable();
        this.api.disable     = () => this.scrollingManager.disable();
        this.api.cancelFlash = () => this.scrollingManager.cancelFlash();
        this.api.update      = () => this.scrollingManager.update();
        this.api.data        = () => this.scrollingManager.prepareExportableData();

        this.api.getPositionY = () => this.scrollingManager.prepareExportableData().scrollTop;
        this.api.getPositionX = () => this.scrollingManager.prepareExportableData().scrollLeft;

    };


    update() {
        if ( !this.scrollDataManager ) return;
        this.scrollDataManager.update();
        this.scrollingManager.initializeX();
        this.scrollingManager.initializeY();
    };


    /*** LISTENERS  ***/
    addListeners() {

        const { passive } = this.props;
        const capture     = true;

        this._view.addEventListener( 'scroll', this.onScroll, { passive, capture } );
        this._view.addEventListener( 'wheel', this.onScroll, { capture } );

        /** object events **/
        this._ht.addEventListener( 'mouseenter', this.onMouseEnterTrack );
        this._ht.addEventListener( 'mouseleave', this.onMouseLeaveTrack );
        this._ht.addEventListener( 'mousedown', this.onMouseDownTrack );
        this._htn.addEventListener( 'mousedown', this.onMouseDownThumb );

        this._vt.addEventListener( 'mouseenter', this.onMouseEnterTrack );
        this._vt.addEventListener( 'mouseleave', this.onMouseLeaveTrack );
        this._vt.addEventListener( 'mousedown', this.onMouseDownTrack );
        this._vtn.addEventListener( 'mousedown', this.onMouseDownThumb );

        this._ht.addEventListener( 'wheel', this.onScrollBarAndThumb, { capture } );
        this._vt.addEventListener( 'wheel', this.onScrollBarAndThumb, { capture } );
    };

    removeListeners() {

        const { passive } = this.props;
        const capture     = true;

        this._view.removeEventListener( 'scroll', this.onScroll, { passive, capture } );
        this._view.removeEventListener( 'wheel', this.onScroll, { capture } );

        /** object events **/
        this._ht.removeEventListener( 'mouseenter', this.onMouseEnterTrack );
        this._ht.removeEventListener( 'mouseleave', this.onMouseLeaveTrack );
        this._ht.removeEventListener( 'mousedown', this.onMouseDownTrack );
        this._htn.removeEventListener( 'mousedown', this.onMouseDownThumb );

        this._vt.removeEventListener( 'mouseenter', this.onMouseEnterTrack );
        this._vt.removeEventListener( 'mouseleave', this.onMouseLeaveTrack );
        this._vt.removeEventListener( 'mousedown', this.onMouseDownTrack );
        this._vtn.removeEventListener( 'mousedown', this.onMouseDownThumb );

        this._ht.removeEventListener( 'wheel', this.onScrollBarAndThumb, { capture } );
        this._vt.removeEventListener( 'wheel', this.onScrollBarAndThumb, { capture } );
    };


    /*** SCROLL EVENTS ***/
    onScroll( event ) {
        this.scrollingManager.onScroll( event );
    };

    onScrollStart() {
        this.scrollingManager.onScrollStart();
    };

    onScrollEnd() {
        this.scrollingManager.onScrollEnd();
    };

    onScrolling() {
        this.scrollingManager.onScrolling();
    };

    atTop() {
        this.props.atTop();
    };

    atBottom() {
        this.props.atBottom();
    };

    atLeft() {
        this.props.atLeft();
    };

    atRight() {
        this.props.atRight();
    };

    onScrollBarAndThumb( event ) {
        event.preventDefault();
        event.stopPropagation();
        this.scrollingManager.onScrollBarAndThumb( event );
    };


    /*** TRACK EVENTS ***/
    onMouseLeaveTrack( event ) {
        this.scrollingManager.onMouseLeaveTrack( event );
    };

    onMouseEnterTrack( event ) {
        this.scrollingManager.onMouseEnterTrack( event );
    };

    onMouseDownTrack( event ) {
        this.draggingManager.onTrackClicked( event );
    };

    onMouseDownThumb( event ) {
        this.draggingManager.onDragStart( event );
    };


    /*** COMPONENT LIFECYCLE ***/
    componentWillUnmount() {
        this.removeListeners();
    }

    componentWillMount() {

        const { cssStyleClass, cssStylesheetID } = this.props;

        const isDefaultStyle = cssStyleClass === CSS_CLASS;
        this.styleTagId      = isDefaultStyle ? cssStylesheetID : CSS_TAG_ID + "_" + cssStyleClass;
        this.styleClass      = cssStyleClass;
        this.styleManager    = new StyleManager( this.styleTagId, this.styleClass );
        this.styleManager.setParsedRules( this.props.parsedStyle || defaultParsedStyle );

    };

    componentDidMount() {
        this.setup();
        this.init();
    };


    /***  RENDERS  ***/
    render() {

        const { container, view, trackV, trackH, thumbV, thumbH }          = this.reactStyle;
        const { cssContainer, cssHTrack, cssVTrack, cssHThumb, cssVThumb } = this.cssClasses;

        return (
            <div ref="container" style={ container } className={cssContainer} >

                {/** MAIN VIEW **/}
                <div ref="view" className="sb2view" style={view} >
                    {this.props.children}
                </div>

                {/** HORIZONTAL scroll track and thumb **/}
                <div ref='trackHorizontal' className={cssHTrack} style={trackH} >
                    <div ref='thumbHorizontal' className={cssHThumb} style={thumbH } />
                </div>

                {/** VERTICAL scroll track and thumb **/}
                <div ref='trackVertical' className={cssVTrack} style={trackV } >
                    <div ref='thumbVertical' className={cssVThumb} style={ thumbV } />
                </div>

            </div>
        )
    }

}


/*** PROPS ***/
Scrollbars2.propTypes = {
    showVertical   : PropTypes.bool,
    showHorizontal : PropTypes.bool,
    autoHide       : PropTypes.bool,
    autoHideTimeout: PropTypes.number,
    autoHeight     : PropTypes.bool,
    autoHeightMin  : PropTypes.number,
    autoHeightMax  : PropTypes.number,
    thumbMinSize   : PropTypes.number,
    className      : PropTypes.string,

    onMount      : PropTypes.func,
    onScroll     : PropTypes.func,
    onScrollStart: PropTypes.func,
    onScrollEnd  : PropTypes.func,
    onScrollFrame: PropTypes.func,
    onUpdate     : PropTypes.func,
    atBottom     : PropTypes.func,
    atTop        : PropTypes.func,
    atRight      : PropTypes.func,
    atLeft       : PropTypes.func,

    cssStyleClass  : PropTypes.string,
    cssStylesheetID: PropTypes.string,
    flashTime      : PropTypes.number,
    flashTimeDelay : PropTypes.number,

    containerStyle: PropTypes.object,
    viewStyle     : PropTypes.object,
    tracksStyle   : PropTypes.object,
    thumbsStyle   : PropTypes.object,
    parsedStyle   : PropTypes.string,

    preventScrolling : PropTypes.bool,
    updateOnUpdates  : PropTypes.bool,
    expandTracks     : PropTypes.bool,
    syncTracks       : PropTypes.bool,
    hideUnnecessary  : PropTypes.bool,
    passiveEvent     : PropTypes.bool,
    usePerformantView: PropTypes.bool
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
