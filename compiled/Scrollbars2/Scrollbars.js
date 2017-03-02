'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Scrollbars2 = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _basicStyles = require('./basicStyles');

var styles = _interopRequireWildcard(_basicStyles);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RPT = _react2.default.PropTypes;
var HOR = 'HORIZONTAL';
var VER = 'VERTICAL';
var cssChanges = [];

var CSS_CLASS = 'sb2-scrollbars2';
var CSS_TAG_ID = 'sb2-tag';

var noop = function noop() {
    return null;
};
var noopFalse = function noopFalse() {
    return false;
};
var noopTrue = function noopTrue() {
    return false;
};

var Scrollbars2 = exports.Scrollbars2 = _react2.default.createClass({
    displayName: 'Scrollbars2',


    /*** SETUP ***/

    setup: function setup() {

        this.emitter = new _tinyEmitter2.default();

        this._c = this.refs['container'];
        this._view = this.refs['view'];
        this._ht = this.refs['trackHorizontal'];
        this._vt = this.refs['trackVertical'];
        this._htn = this.refs['thumbHorizontal'];
        this._vtn = this.refs['thumbVertical'];

        this.scrollDataManager = new _utils.ScrollDataManager(this.refs, this.props, this.emitter);
        this.movementManager = new _utils.MovementManager(this.scrollDataManager, this.props, this.emitter);
        this.visualChangesManager = new _utils.VisualChangesManager();
        this.scrollingManager = new _utils.ScrollingManager(this.refs, this.props, this.scrollDataManager, this.movementManager, this.visualChangesManager);
        this.draggingManager = new _utils.DraggingManager(this.refs, this.scrollDataManager);

        this.emitter.on('scroll:start', this.onScrollStart);
        // this.emitter.on( 'scroll:end', this.onScrollEnd );
        this.emitter.on('scroll:end', this.onScrollEnd);
        this.emitter.on('scroll:scrolling', this.onScrolling);

        this.emitter.on('scroll:atTop', this.atTop);
        this.emitter.on('scroll:atBottom', this.atBottom);
        this.emitter.on('scroll:atLeft', this.atLeft);
        this.emitter.on('scroll:atRight', this.atRight);

        this.addListeners();
    },
    init: function init() {
        this.scrollingManager.initialize();

        this.props.onMount({
            containerView: this.refs['container'],
            scrollableView: this.refs['view'],
            scrollbarObject: this,
            initialData: this.scrollingManager.prepareExportableData()
        });
    },


    /*** API FUNCTIONS ***/
    api: function api() {
        return {
            toTop: this.scrollingManager.toTop.bind(this.scrollingManager),
            toBottom: this.scrollingManager.toBottom.bind(this.scrollingManager),
            toLeft: this.scrollingManager.toLeft.bind(this.scrollingManager),
            toRight: this.scrollingManager.toRight.bind(this.scrollingManager),
            enable: this.scrollingManager.enable.bind(this.scrollingManager),
            disable: this.scrollingManager.disable.bind(this.scrollingManager),
            cancelFlash: this.scrollingManager.cancelFlash.bind(this.scrollingManager),
            update: this.update
        };
    },
    update: function update() {
        this.scrollDataManager.update();
        this.scrollingManager.initializeX();
        this.scrollingManager.initializeY();
    },


    /*** LISTENERS  ***/
    addListeners: function addListeners() {

        this._view.addEventListener('scroll', this.onScroll, {
            passive: this.props.passiveEvent,
            capture: true
        });
        this._view.addEventListener('wheel', this.onScroll, {
            capture: true
        });

        /** object events **/
        this._ht.addEventListener('mouseenter', this.onMouseEnterTrack);
        this._ht.addEventListener('mouseleave', this.onMouseLeaveTrack);
        this._ht.addEventListener('mousedown', this.onMouseDownTrack);
        this._htn.addEventListener('mousedown', this.onMouseDownThumb);

        this._vt.addEventListener('mouseenter', this.onMouseEnterTrack);
        this._vt.addEventListener('mouseleave', this.onMouseLeaveTrack);
        this._vt.addEventListener('mousedown', this.onMouseDownTrack);
        this._vtn.addEventListener('mousedown', this.onMouseDownThumb);

        this._ht.addEventListener('wheel', this.onScrollBarAndThumb, { capture: true });
        this._vt.addEventListener('wheel', this.onScrollBarAndThumb, { capture: true });
    },
    removeListeners: function removeListeners() {
        this._view.removeListener('scroll', this.onScroll, {
            passive: this.props.passiveEvent,
            capture: true
        });
        this._view.removeListener('wheel', this.onScroll, {
            capture: true
        });
    },


    /*** SCROLL EVENTS ***/
    onScroll: function onScroll(event) {
        this.scrollingManager.onScroll(event);
    },
    onScrollStart: function onScrollStart() {
        this.scrollingManager.onScrollStart();
    },
    onScrollEnd: function onScrollEnd() {
        this.scrollingManager.onScrollEnd();
    },
    onScrolling: function onScrolling() {
        this.scrollingManager.onScrolling();
    },
    atTop: function atTop() {
        this.props.atTop();
    },
    atBottom: function atBottom() {
        this.props.atBottom();
    },
    atLeft: function atLeft() {
        this.props.atLeft();
    },
    atRight: function atRight() {
        this.props.atRight();
    },
    onScrollBarAndThumb: function onScrollBarAndThumb(event) {
        this.scrollingManager.onScrollBarAndThumb(event);
    },


    /*** TRACK EVENTS ***/
    onMouseLeaveTrack: function onMouseLeaveTrack(event) {
        this.scrollingManager.onMouseLeaveTrack(event);
    },
    onMouseEnterTrack: function onMouseEnterTrack(event) {
        this.scrollingManager.onMouseEnterTrack(event);
    },
    onMouseDownTrack: function onMouseDownTrack(event) {
        this.draggingManager.onTrackClicked(event);
    },
    onMouseDownThumb: function onMouseDownThumb(event) {
        this.draggingManager.onDragStart(event);
    },


    /*** COMPONENT LIFECYCLE ***/

    componentWillMount: function componentWillMount() {
        var _props = this.props;
        var cssStyleClass = _props.cssStyleClass;
        var cssStylesheetID = _props.cssStylesheetID;


        var isDefaultStyle = cssStyleClass === CSS_CLASS;
        this.styleTagId = isDefaultStyle ? cssStylesheetID : CSS_TAG_ID + "_" + cssStyleClass;
        this.styleClass = cssStyleClass;
        this.styleManager = new _utils.StyleManager(this.styleTagId, this.styleClass);
        //this.styleManager.setParsedRules( this.props.parsedStyle || defaultParsedStyle );

        /*
         Starts Hidden when:
         - bar is not required by user
         - there is a flash time and a flash delay and autohide
          */

        this.cssClasses = {
            container: (0, _classnames2.default)('sb2container', 'initial', this.styleClass.toLowerCase().replace(".", " "), {
                'sb2-auto-hide': this.props.autoHide,
                'sb2-auto-height': this.props.autoHeight,
                'sb2-expand-tracks': this.props.expandTracks,
                'v-disabled': !this.props.showVertical,
                'h-disabled': !this.props.showHorizontal
            }),
            view: (0, _classnames2.default)('sb2-view', {
                performant: this.props.usePerformantView
            }),
            vTrack: 'sb2tracks sb2v',
            hTrack: 'sb2tracks sb2h',
            vThumb: 'sb2-thumb sb2-v',
            hThumb: 'sb2-thumb sb2-h',
            body: 'sb2-body',
            scrolling: 'sb2-scrolling',
            dragging: 'sb2-dragging',
            autoHideOn: 'sb2-auto-hide-on',
            expanded: 'sb2-expanded'
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        this.apiFunctions = function () {
            return _this.api();
        };
        var setupTimeout = setTimeout(function () {
            _this.setup();
            _this.init();
            clearTimeout(setupTimeout);
        }, 100);
    },


    /***  RENDERS  ***/
    render: function render() {

        return _react2.default.createElement(
            'div',
            { ref: 'container', style: _extends({}, styles.container, this.props.containerStyle),
                className: this.cssClasses.container },
            _react2.default.createElement(
                'div',
                { ref: 'view', className: 'sb2view', style: _extends({}, styles.view, this.props.viewStyle) },
                this.props.children
            ),
            _react2.default.createElement(
                'div',
                { ref: 'trackHorizontal', className: this.cssClasses.hTrack,
                    style: _extends({}, styles.trackX, this.props.tracksStyle) },
                _react2.default.createElement('div', { ref: 'thumbHorizontal', className: 'sb2thumbs sb2h',
                    style: _extends({}, styles.thumbnailX, this.props.thumbsStyle) })
            ),
            _react2.default.createElement(
                'div',
                { ref: 'trackVertical', className: this.cssClasses.vTrack,
                    style: _extends({}, styles.trackY, this.props.tracksStyle) },
                _react2.default.createElement('div', { ref: 'thumbVertical', className: 'sb2thumbs sb2v',
                    style: _extends({}, styles.thumbnailY, this.props.thumbsStyle) })
            )
        );
    }
});

/*** PROPS ***/
Scrollbars2.propTypes = {
    showVertical: RPT.bool,
    showHorizontal: RPT.bool,
    autoHide: RPT.bool,
    autoHideTimeout: RPT.number,
    autoHeight: RPT.bool,
    autoHeightMin: RPT.number,
    autoHeightMax: RPT.number,
    thumbMinSize: RPT.number,
    className: RPT.string,

    onMount: RPT.func,
    onScroll: RPT.func,
    onScrollStart: RPT.func,
    onScrollEnd: RPT.func,
    onScrollFrame: RPT.func,
    onUpdate: RPT.func,
    atBottom: RPT.func,
    atTop: RPT.func,
    atRight: RPT.func,
    atLeft: RPT.func,

    cssStyleClass: RPT.string,
    cssStylesheetID: RPT.string,
    flashTime: RPT.number,
    flashTimeDelay: RPT.number,

    containerStyle: RPT.object,
    viewStyle: RPT.object,
    tracksStyle: RPT.object,
    thumbsStyle: RPT.object,
    parsedStyle: RPT.string,

    preventScrolling: RPT.bool,
    updateOnUpdates: RPT.bool,
    expandTracks: RPT.bool,
    syncTracks: RPT.bool,
    hideUnnecessary: RPT.bool,
    passiveEvent: RPT.bool,
    usePerformantView: RPT.bool
};
Scrollbars2.defaultProps = {
    showVertical: true,
    showHorizontal: false,
    autoHide: false,
    autoHideTimeout: 1000,
    autoHeight: false,
    autoHeightMin: 0,
    autoHeightMax: 200,
    thumbMinSize: 30,
    className: '',

    onMount: noop,
    onScroll: noop,
    onScrollStart: noop,
    onScrollEnd: noop,
    onScrollFrame: noop,
    onUpdate: noop,
    atBottom: noop,
    atTop: noop,
    atRight: noop,
    atLeft: noop,

    cssStyleClass: CSS_CLASS,
    cssStylesheetID: CSS_TAG_ID,
    flashTime: 0,
    flashTimeDelay: 0,

    containerStyle: {},
    viewStyle: {},
    tracksStyle: {},
    thumbsStyle: {},
    parsedStyle: null,

    preventScrolling: true,
    updateOnUpdates: true,
    expandTracks: false,
    syncTracks: false,
    hideUnnecessary: true,
    passiveEvent: false,
    usePerformantView: true
};

exports.default = Scrollbars2;