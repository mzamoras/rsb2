(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["react-scrollbars2"] = factory(require("react"));
	else
		root["react-scrollbars2"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var _react = __webpack_require__(8);

	var _react2 = _interopRequireDefault(_react);

	var _basicStyles = __webpack_require__(1);

	var styles = _interopRequireWildcard(_basicStyles);

	var _tinyEmitter = __webpack_require__(6);

	var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

	var _classnames = __webpack_require__(3);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _utils = __webpack_require__(2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultParsedStyle = __webpack_require__(7);

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

	        /*** API FUNCTIONS ***/
	        this.api = {
	            toTop: this.scrollingManager.toTop.bind(this.scrollingManager),
	            toBottom: this.scrollingManager.toBottom.bind(this.scrollingManager),
	            toLeft: this.scrollingManager.toLeft.bind(this.scrollingManager),
	            toRight: this.scrollingManager.toRight.bind(this.scrollingManager),
	            enable: this.scrollingManager.enable.bind(this.scrollingManager),
	            disable: this.scrollingManager.disable.bind(this.scrollingManager),
	            cancelFlash: this.scrollingManager.cancelFlash.bind(this.scrollingManager)
	        };
	    },
	    init: function init() {
	        this.scrollingManager.initialize();
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
	        this.styleManager.setParsedRules(defaultParsedStyle);

	        /*
	        Starts Hidden when:
	        - bar is not required by user
	        - there is a flash time and a flash delay and autohide
	          */

	        this.cssClasses = {
	            container: (0, _classnames2.default)('sb2container', this.styleClass.toLowerCase().replace(".", " "), {
	                'sb2-auto-hide': this.props.autoHide,
	                'sb2-auto-height': this.props.autoHeight,
	                'sb2-expand-tracks': this.props.expandTracks
	            }),
	            view: (0, _classnames2.default)('sb2-view', {
	                performant: this.props.usePerformantView
	            }),
	            vTrack: (0, _classnames2.default)('sb2tracks sb2v'),
	            hTrack: (0, _classnames2.default)('sb2tracks sb2h'),
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

	        //const setupTimeout = setTimeout( () => {
	        this.setup();
	        this.init();
	        //    clearTimeout( setupTimeout );
	        //}, 0 );
	    },


	    /***  RENDERS  ***/
	    render: function render() {

	        return _react2.default.createElement(
	            'div',
	            { ref: 'container', style: _extends({}, styles.container, this.props.containerStyle), className: this.cssClasses.container },
	            _react2.default.createElement(
	                'div',
	                { ref: 'view', className: 'sb2view', style: _extends({}, styles.view, this.props.viewStyle) },
	                this.props.children
	            ),
	            _react2.default.createElement(
	                'div',
	                { ref: 'trackHorizontal', className: this.cssClasses.hTrack, style: _extends({}, styles.trackX, this.props.tracksStyle) },
	                _react2.default.createElement('div', { ref: 'thumbHorizontal', className: 'sb2thumbs sb2h', style: _extends({}, styles.thumbnailX, this.props.thumbsStyle) })
	            ),
	            _react2.default.createElement(
	                'div',
	                { ref: 'trackVertical', className: this.cssClasses.vTrack, style: _extends({}, styles.trackY, this.props.tracksStyle) },
	                _react2.default.createElement('div', { ref: 'thumbVertical', className: 'sb2thumbs sb2v', style: _extends({}, styles.thumbnailY, this.props.thumbsStyle) })
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
	    expandTracks: true,
	    syncTracks: false,
	    hideUnnecessary: true,
	    passiveEvent: false,
	    usePerformantView: true
	};

	exports.default = Scrollbars2;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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

	var performanceLayerHack = {
	    /*transform: 'translateZ(0)',
	    willChange: 'transform'*/
	};

	var container = exports.container = {};

	var view = exports.view = {};

	var tracks = exports.tracks = {
	    opacity: 0
	    /*position: 'absolute',
	    ...performanceLayerHack,
	    backgroundColor: "#CCC",*/
	};

	var trackY = exports.trackY = {};

	var trackX = exports.trackX = {};

	var thumbnails = exports.thumbnails = {};

	var thumbnailY = exports.thumbnailY = {};

	var thumbnailX = exports.thumbnailX = {};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 *
	 *  File: utils.js | Package: Scrollbars2
	 *
	 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
	 *  Created:   12 Sep, 2016 | 04:33 PM
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

	window.sb2GlobalData = window.sb2GlobalData || {};
	window.sb2GlobalData.scrollbarWidth = window.sb2GlobalData.scrollbarWidth || null;

	if (window.sb2GlobalData.scrollbarWidth === null) {
	    window.sb2GlobalData.scrollbarWidth = calculateScrollbarWidth();
	}

	function calculateScrollbarWidthAsPromise() {
	    var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	    return new Promise(function (resolve) {
	        calculateScrollbarWidth(force);
	        resolve();
	    });
	}

	function calculateScrollbarWidth() {
	    var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


	    if (window.sb2GlobalData.scrollbarWidth !== null && !force) {
	        return window.sb2GlobalData.scrollbarWidth;
	    }

	    var div1 = void 0,
	        div2 = void 0;

	    div1 = document.createElement('div');
	    div2 = document.createElement('div');

	    div1.style.width = div2.style.width = div1.style.height = div2.style.height = '100px';
	    div1.style.overflow = 'scroll';
	    div2.style.overflow = 'hidden';

	    document.body.appendChild(div1);
	    document.body.appendChild(div2);

	    window.sb2GlobalData.scrollbarWidth = Math.abs(div1.scrollHeight - div2.scrollHeight);

	    document.body.removeChild(div1);
	    document.body.removeChild(div2);

	    return window.sb2GlobalData.scrollbarWidth;
	}

	var HOR = "axis:x";
	var VER = "axis:y";
	var AN = "axis:none";
	var emptyThumb = {
	    size: 0,
	    pos: 0
	};

	var ScrollDataManager = exports.ScrollDataManager = function () {
	    _createClass(ScrollDataManager, [{
	        key: 'init',
	        value: function init() {
	            this.hasData = false;
	            this.hasPrevData = false;

	            this.data = {};
	            this.dataTX = {};
	            this.dataTY = {};
	            this.prevData = {};
	        }
	    }]);

	    function ScrollDataManager(refs, props, emitter) {
	        _classCallCheck(this, ScrollDataManager);

	        this.refs = refs;
	        this.view = refs['view'];
	        this.tX = refs['trackHorizontal'];
	        this.tY = refs['trackVertical'];
	        this.tnX = refs['thumbHorizontal'];
	        this.tnY = refs['thumbVertical'];
	        this.props = props;
	        this.emitter = emitter;

	        this.init();
	        this.update();
	    }

	    /*** Collect Element Info ***/


	    _createClass(ScrollDataManager, [{
	        key: 'gatherDataFromElement',
	        value: function gatherDataFromElement() {
	            var savePrev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


	            if (savePrev && this.hasData) {
	                this.prevData = this.data;
	                this.hasPrevData = true;
	            }

	            var tmpEl = this.view;
	            var tmpData = {};

	            /** Basic Measures **/
	            tmpData.barWidth = window.sb2GlobalData.scrollbarWidth;
	            tmpData.scrollLeft = tmpEl.scrollLeft;
	            tmpData.scrollTop = tmpEl.scrollTop;
	            tmpData.scrollWidth = tmpEl.scrollWidth;
	            tmpData.scrollHeight = tmpEl.scrollHeight;
	            tmpData.clientWidth = tmpEl.clientWidth;
	            tmpData.clientHeight = tmpEl.clientHeight;
	            tmpData.trackHeight = this.getInnerSize(VER);
	            tmpData.trackWidth = this.getInnerSize(HOR);

	            /** Basic Calculations **/
	            tmpData.maxScrollTop = tmpData.scrollHeight - tmpData.clientHeight;
	            tmpData.maxScrollLeft = tmpData.scrollWidth - tmpData.clientWidth;
	            tmpData.thumbWidth = Number(ScrollDataManager.thumbSize(HOR, tmpData, this.props).toFixed(0));
	            tmpData.thumbHeight = Number(ScrollDataManager.thumbSize(VER, tmpData, this.props).toFixed(0));

	            /** Movement Calculations **/
	            tmpData.realMovY = tmpData.scrollTop - (!this.hasPrevData ? 0 : this.prevData.scrollTop);
	            tmpData.realMovX = tmpData.scrollLeft - (!this.hasPrevData ? 0 : this.prevData.scrollLeft);

	            /** Display Calculations **/
	            tmpData.reqByDimensionsX = tmpData.scrollWidth > tmpData.clientWidth;
	            tmpData.reqByDimensionsY = tmpData.scrollHeight > tmpData.clientHeight;
	            tmpData.reqByConfigX = this.props.showHorizontal;
	            tmpData.reqByConfigY = this.props.showVertical;
	            tmpData.reqByMovementX = tmpData.realMovX !== 0;
	            tmpData.reqByMovementY = tmpData.realMovY !== 0;

	            tmpData.requireX = tmpData.scrollWidth > tmpData.clientWidth;
	            tmpData.requireY = tmpData.scrollHeight > tmpData.clientHeight;

	            tmpData.availableTrackX = tmpData.reqByConfigX && (tmpData.reqByDimensionsX || !this.props.hideUnnecessary);
	            tmpData.availableTrackY = tmpData.reqByConfigY && (tmpData.reqByDimensionsY || !this.props.hideUnnecessary);
	            tmpData.displayableTrackX = tmpData.availableTrackX && (tmpData.realMovX && this.props.autoHide || !this.props.autoHide);
	            tmpData.displayableTrackY = tmpData.availableTrackY && (tmpData.realMovY && this.props.autoHide || !this.props.autoHide);
	            tmpData.flashableTrackX = tmpData.availableTrackX; //&& this.props.flashTime > 0;
	            tmpData.flashableTrackY = tmpData.availableTrackY; //&& this.props.flashTime > 0;

	            tmpData.displayableThumbX = tmpData.availableTrackX;
	            tmpData.displayableThumbY = tmpData.availableTrackY;

	            //tmpData.displayableThumbX = tmpData.displayableTrackX && tmpData.thumbWidth !== tmpData.clientWidth;
	            //tmpData.displayableThumbY = tmpData.displayableTrackY && tmpData.thumbHeight !== tmpData.clientHeight;

	            /*tmpData.displayableTrackX = (tmpData.requireX || !this.props.hideUnnecessary) && this.props.showHorizontal;
	             tmpData.displayableTrackY = (tmpData.requireY || !this.props.hideUnnecessary) && this.props.showVertical;
	             tmpData.displayableThumbX = tmpData.displayableTrackX && tmpData.thumbWidth !== tmpData.clientWidth;
	             tmpData.displayableThumbY = tmpData.displayableTrackY && tmpData.thumbHeight !== tmpData.clientHeight;*/

	            this.data = tmpData;
	            this.hasData = true;
	        }
	    }, {
	        key: 'gatherDataFromThumbs',
	        value: function gatherDataFromThumbs() {
	            //debugger;

	            var tx = this.tnX.style.transform.match(/X\((.*)px/);
	            var ty = this.tnY.style.transform.match(/Y\((.*)px/);
	            this.dataTX = {
	                pos: Number(tx ? tx[1] : 0),
	                size: Number(this.tnX.style.width.replace('px', '') || 0),
	                opacity: Number(this.tnX.style.opacity || 0)
	            };
	            this.dataTY = {
	                pos: Number(ty ? ty[1] : 0),
	                size: Number(this.tnY.style.height.replace('px', '') || 0),
	                opacity: Number(this.tnY.style.opacity || 0)
	            };
	        }
	    }, {
	        key: 'getInnerSize',
	        value: function getInnerSize(axis) {
	            var el = axis === VER ? this.tY : this.tX;
	            var offsetSize = axis === VER ? el.offsetHeight : el.offsetWidth;

	            var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;
	            var marginLeft = parseInt(style.marginLeft, 10) || 0;
	            var marginRight = parseInt(style.marginRight, 10) || 0;
	            var marginTop = parseInt(style.marginTop, 10) || 0;
	            var marginBottom = parseInt(style.marginBottom, 10) || 0;
	            var paddingLeft = parseInt(style.paddingLeft, 10) || 0;
	            var paddingRight = parseInt(style.paddingRight, 10) || 0;
	            var paddingTop = parseInt(style.paddingTop, 10) || 0;
	            var paddingBottom = parseInt(style.paddingBottom, 10) || 0;
	            var borderLeft = parseInt(style.borderLeftWidth, 10) || 0;
	            var borderRight = parseInt(style.borderRightWidth, 10) || 0;
	            var borderTop = parseInt(style.borderTopWidth, 10) || 0;
	            var borderBottom = parseInt(style.borderBottomWidth, 10) || 0;
	            var borders = axis === VER ? borderTop + borderBottom : borderLeft + borderRight;
	            var margins = axis === VER ? marginTop + marginBottom : marginLeft + marginRight;
	            var paddings = axis === VER ? paddingTop + paddingBottom : paddingLeft + paddingRight;

	            return offsetSize - (borders + margins + paddings);
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            var _this = this;

	            var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            if (force) {
	                return calculateScrollbarWidthAsPromise(force).then(function () {
	                    _this.gatherDataFromElement();
	                    return _this.data;
	                });
	            }
	            calculateScrollbarWidth();
	            this.gatherDataFromElement();
	            return this.data;
	        }

	        /** PUBLIC **/

	        /*** STATICS ***/

	    }, {
	        key: 'values',


	        /*** PROPS TO RESOLVE ***/

	        get: function get() {
	            return this.data;
	        }
	    }, {
	        key: 'previous',
	        get: function get() {
	            return this.prevData;
	        }
	    }, {
	        key: 'hasMovX',
	        get: function get() {
	            return this.data.realMovX > 0 || this.data.realMovX < 0;
	        }
	    }, {
	        key: 'hasMovY',
	        get: function get() {
	            return this.data.realMovY > 0 || this.data.realMovY < 0;
	        }
	    }, {
	        key: 'atTop',
	        get: function get() {
	            return this.data.scrollTop <= 0 && this.data.reqByDimensionsY;
	        }
	    }, {
	        key: 'atBottom',
	        get: function get() {
	            return this.data.scrollTop >= this.data.maxScrollTop - 1 && this.data.reqByDimensionsY;
	        }
	    }, {
	        key: 'atLeft',
	        get: function get() {
	            return this.data.scrollLeft <= 0 && this.data.reqByDimensionsX;
	        }
	    }, {
	        key: 'atRight',
	        get: function get() {
	            return this.data.scrollLeft >= this.data.maxScrollLeft - 1 && this.data.reqByDimensionsX;
	        }
	    }, {
	        key: 'thumbData',
	        get: function get() {
	            var axisX = this.data.requireX ? Object.assign({}, emptyThumb) : {};
	            axisX.size = this.data.thumbWidth;

	            axisX.pos = Number(ScrollDataManager.thumbPos(HOR, this.data, axisX.size).toFixed(3));
	            axisX.sizeChanged = !this.dataTX.size === axisX.size;
	            axisX.posChanged = !this.dataTX.pos === axisX.pos;

	            var axisY = this.data.requireY ? Object.assign({}, emptyThumb) : {};
	            axisY.size = this.data.thumbHeight;
	            axisY.pos = Number(ScrollDataManager.thumbPos(VER, this.data, axisY.size).toFixed(3));
	            axisY.sizeChanged = !(this.dataTY.size === axisY.size);
	            axisY.posChanged = !(this.dataTY.pos === axisY.pos);

	            return {
	                x: axisX,
	                y: axisY
	            };
	        }
	    }], [{
	        key: 'thumbSize',
	        value: function thumbSize(axis, dataSource, props) {

	            var windowSize = axis === VER ? dataSource.clientHeight : dataSource.clientWidth;
	            var contentSize = axis === VER ? dataSource.scrollHeight : dataSource.scrollWidth;
	            var trackSize = axis === VER ? dataSource.trackHeight : dataSource.trackWidth;
	            var contentRatio = windowSize / contentSize;

	            var size = trackSize * contentRatio;
	            var minSize = props.thumbMinSize;
	            var finalSize = minSize > size ? minSize : size;

	            return finalSize - dataSource.barWidth / 2 + 2;
	        }
	    }, {
	        key: 'thumbPos',
	        value: function thumbPos(axis, dataSource, thumbSize) {

	            var windowSize = axis === VER ? dataSource.clientHeight : dataSource.clientWidth;
	            var contentSize = axis === VER ? dataSource.scrollHeight : dataSource.scrollWidth;
	            var trackSize = axis === VER ? dataSource.trackHeight : dataSource.trackWidth;

	            var scrollAreaSize = contentSize - windowSize;
	            var windowPosition = axis === VER ? dataSource.scrollTop : dataSource.scrollLeft;
	            var windowPositionRatio = windowPosition / (scrollAreaSize || 1);
	            var trackScrollAreaSize = trackSize - thumbSize;

	            return trackScrollAreaSize * windowPositionRatio;
	        }
	    }]);

	    return ScrollDataManager;
	}();

	var SCROLL = 'scroll';
	var WHEEL = 'wheel';
	var DOWN = 'down';
	var UP = 'up';
	var LEFT = 'left';
	var RIGHT = 'right';
	var NONE = 'none';

	var MovementManager = exports.MovementManager = function () {
	    _createClass(MovementManager, [{
	        key: 'init',
	        value: function init() {
	            var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { type: AN };


	            this.values = this.dataManager.values;

	            this.event = event;
	            this.eventType = event ? this.event.type : null;

	            this.isScroll = event ? this.eventType === SCROLL : false;
	            this.isWheel = event ? this.eventType === WHEEL : false;

	            this.direction = event ? this.getEventAxis() : AN;
	            this.isX = event ? this.direction.isX : false;
	            this.isY = event ? this.direction.isY : false;

	            this.movementAllowedY = this.props.showVertical || false;
	            this.movementAllowedX = this.props.showHorizontal || false;

	            this.movementRequiredY = this.values.requireY;
	            this.movementRequiredX = this.values.requireX;

	            this.needY = this.movementAllowedY && this.movementRequiredY && this.isY;
	            this.needX = this.movementAllowedX && this.movementRequiredX && this.isX;

	            this.needYWithMovement = this.needY && this.dataManager.hasMovY;
	            this.needXWithMovement = this.needX && this.dataManager.hasMovX;

	            this.lastValidDirection = this.direction.axis === AN ? this.lastValidDirection : this.direction;
	        }
	    }]);

	    function MovementManager(dataManager, passedProps, emitter) {
	        _classCallCheck(this, MovementManager);

	        this.dataManager = dataManager;
	        this.props = passedProps;
	        this.emitter = emitter;
	        this.scrollTimer = null;
	        this.scrolling = false;
	        this.lastValidDirection = AN;
	        this.scrollStarted = false;

	        this.atTopEmitted = false;
	        this.atBottomEmitted = false;
	        this.atLeftEmitted = false;
	        this.atRightEmitted = false;

	        this.init();
	    }

	    _createClass(MovementManager, [{
	        key: 'shouldContinue',
	        value: function shouldContinue() {
	            this.startTimer();
	            this.scrolling = true;

	            this.edgeChecker();

	            //Event is explorable
	            if ((this.needYWithMovement || this.needXWithMovement) && this.isScroll) {
	                this.emitter.emit('scroll:scrolling');
	                return true;
	            }

	            if (this.isWheel) {
	                var isDeltaUp = this.event.deltaY <= 0;
	                var isDeltaDown = this.event.deltaY >= 0;
	                var isDeltaLeft = this.event.deltaX <= 0;
	                var isDeltaRight = this.event.deltaX >= 0;
	                var preventScrolling = false;

	                if (this.isY && isDeltaUp && this.dataManager.atTop && this.needY) {
	                    //console.log( "at atTop actions" );
	                    preventScrolling = true;
	                }

	                if (this.isY && isDeltaDown && this.dataManager.atBottom && this.needY) {
	                    //console.log( "at atBottom actions" );
	                    preventScrolling = true;
	                }

	                if (this.isX && isDeltaLeft && this.dataManager.atLeft && this.needX) {
	                    //console.log( "at atLeft actions" );
	                    preventScrolling = true;
	                }

	                if (this.isX && isDeltaRight && this.dataManager.atRight && this.needX) {
	                    //console.log( "at atRight actions" );
	                    preventScrolling = true;
	                }

	                if (this.props.preventScrolling && preventScrolling) {
	                    this.event.preventDefault();
	                }

	                return false;
	            }
	        }
	    }, {
	        key: 'edgeMarker',
	        value: function edgeMarker(obj) {
	            var object = obj + 'Emitted';
	            if (this[object]) return;
	            this[object] = true;
	            this.emitter.emit('scroll:' + obj);
	        }
	    }, {
	        key: 'edgeChecker',
	        value: function edgeChecker() {

	            var dir = this.direction.dir;
	            var _dataManager = this.dataManager;
	            var atTop = _dataManager.atTop;
	            var atBottom = _dataManager.atBottom;
	            var atLeft = _dataManager.atLeft;
	            var atRight = _dataManager.atRight;


	            if (!atTop && !atBottom) {
	                this.atTopEmitted = false;
	                this.atBottomEmitted = false;
	            }
	            if (!atLeft && !atRight) {
	                this.atLeftEmitted = false;
	                this.atRightEmitted = false;
	            }

	            if (this.dataManager.atTop && dir === UP) {
	                this.edgeMarker('atTop');
	            }

	            if (this.dataManager.atBottom && dir === DOWN) {
	                this.edgeMarker('atBottom');
	            }

	            if (this.dataManager.atLeft && dir === LEFT) {
	                this.edgeMarker('atLeft');
	            }

	            if (this.dataManager.atRight && dir === RIGHT) {
	                this.edgeMarker('atRight');
	            }
	        }
	    }, {
	        key: 'setEvent',
	        value: function setEvent(event) {
	            this.init(event);
	            if (!this.scrollStarted) {
	                this.emitter.emit('scroll:start');
	                this.scrollStarted = true;
	            }
	            return this;
	        }
	    }, {
	        key: 'getEventAxis',
	        value: function getEventAxis() {

	            var dx = this.isScroll ? this.values.realMovX : this.event.deltaX;
	            var dy = this.isScroll ? this.values.realMovY : this.event.deltaY;
	            var dirY = dy === 0 ? NONE : dy > 0 ? DOWN : UP;
	            var dirX = dx === 0 ? NONE : dx > 0 ? RIGHT : LEFT;

	            var deltaX = dx * (dx > 0 ? 1 : -1) || 0;
	            var deltaY = dy * (dy > 0 ? 1 : -1) || 0;

	            var majorDelta = deltaX > deltaY ? deltaX : deltaY > deltaX ? deltaY : -1;

	            var directionRes = {
	                dx: dx,
	                dy: dy,
	                deltaX: deltaX,
	                deltaY: deltaY,
	                et: this.eventType
	            };

	            directionRes.axis = majorDelta === deltaY ? VER : majorDelta === deltaX ? HOR : AN;
	            directionRes.isX = directionRes.axis === HOR;
	            directionRes.isY = directionRes.axis === VER;
	            directionRes.dir = directionRes.isY ? dirY : dirX;
	            directionRes.isUp = directionRes.isY && dirY === UP;
	            directionRes.isDown = directionRes.isY && dirY === DOWN;
	            directionRes.isLeft = directionRes.isX && dirX === LEFT;
	            directionRes.isRight = directionRes.isX && dirX === RIGHT;

	            return directionRes;
	        }
	    }, {
	        key: 'startTimer',
	        value: function startTimer() {
	            var _this2 = this;

	            if (this.scrolling) return;

	            this.scrollTimer = setInterval(function () {

	                _this2.scrolling = false;
	                clearInterval(_this2.scrollTimer);
	                if (!_this2.scrolling) {
	                    _this2.scrollStarted = false;
	                    _this2.emitter.emit('scroll:end');
	                }
	            }, 100);
	        }
	    }]);

	    return MovementManager;
	}();

	var noop = function noop() {
	    return null;
	};
	var noopFalse = function noopFalse() {
	    return false;
	};
	var noopTrue = function noopTrue() {
	    return false;
	};

	var DraggingManager = exports.DraggingManager = function () {
	    function DraggingManager(refs, scrollDataManager) {
	        _classCallCheck(this, DraggingManager);

	        this.draggingCSSClass = 'sb2-dragging';
	        this.dragging = false;
	        this.direction = null;
	        this.prevPositionX = null;
	        this.prevPositionY = null;
	        this.onSelectStartKeeper = null;
	        this.target = null;

	        this.tX = refs['trackHorizontal'];
	        this.tY = refs['trackVertical'];
	        this.tnX = refs['thumbHorizontal'];
	        this.tnY = refs['thumbVertical'];
	        this.view = refs['view'];

	        this.data = scrollDataManager.values;

	        this.eventsSetup = { passive: false, capture: true };
	        this.onDragBinded = this.onDrag.bind(this);
	        this.onDragEndBinded = this.onDragEnd.bind(this);
	    }

	    _createClass(DraggingManager, [{
	        key: 'setup',
	        value: function setup() {
	            //Save some data before change it
	            this.onSelectStartKeeper = document.onselectstart;

	            //Add events
	            document.addEventListener('mousemove', this.onDragBinded, this.eventsSetup);
	            document.addEventListener('mouseup', this.onDragEndBinded, this.eventsSetup);
	            document.onselectstart = noopFalse();

	            //Add Styles
	            document.body.classList.add(this.draggingCSSClass);
	        }
	    }, {
	        key: 'tearDown',
	        value: function tearDown() {
	            //Restore data and events
	            document.onselectstart = this.onSelectStartKeeper;

	            //Remove Events
	            document.removeEventListener('mousemove', this.onDragBinded, this.eventsSetup);
	            document.removeEventListener('mouseup', this.onDragEndBinded, this.eventsSetup);

	            //Remove Styles
	            document.body.classList.remove(this.draggingCSSClass);
	        }
	    }, {
	        key: 'onDragStart',
	        value: function onDragStart(event) {
	            event.stopPropagation();

	            var target = event.target;
	            var clientY = event.clientY;
	            var clientX = event.clientX;
	            var offsetHeight = target.offsetHeight;
	            var offsetWidth = target.offsetWidth;

	            var _target$getBoundingCl = target.getBoundingClientRect();

	            var top = _target$getBoundingCl.top;
	            var left = _target$getBoundingCl.left;


	            this.dragging = true;
	            this.direction = target === this.tnY ? VER : HOR;

	            if (this.direction === VER) this.prevPositionY = offsetHeight - (clientY - top);
	            if (this.direction === HOR) this.prevPositionX = offsetWidth - (clientX - left);

	            this.setup();
	        }
	    }, {
	        key: 'onDrag',
	        value: function onDrag(event) {
	            var clientX = event.clientX;
	            var clientY = event.clientY;

	            var _tY$getBoundingClient = this.tY.getBoundingClientRect();

	            var top = _tY$getBoundingClient.top;

	            var _tX$getBoundingClient = this.tX.getBoundingClientRect();

	            var left = _tX$getBoundingClient.left;
	            var _data = this.data;
	            var thumbHeight = _data.thumbHeight;
	            var thumbWidth = _data.thumbWidth;


	            var clickPositionY = thumbHeight - this.prevPositionY;
	            var clickPositionX = thumbWidth - this.prevPositionX;
	            var offsetY = -top + clientY - clickPositionY;
	            var offsetX = -left + clientX - clickPositionX;

	            if (this.prevPositionY) {
	                this.move(VER, this.getScrollTopForOffset(offsetY));
	            }
	            if (this.prevPositionX) {
	                this.move(HOR, this.getScrollLeftForOffset(offsetX));
	            }

	            return false;
	        }
	    }, {
	        key: 'onDragEnd',
	        value: function onDragEnd() {

	            this.dragging = false;
	            this.direction = null;
	            this.tearDown();
	        }
	    }, {
	        key: 'move',
	        value: function move(axis, newPosition) {
	            if (axis === VER) this.view.scrollTop = newPosition;
	            if (axis === HOR) this.view.scrollLeft = newPosition;
	        }
	    }, {
	        key: 'getScrollTopForOffset',
	        value: function getScrollTopForOffset(offset) {
	            var _data2 = this.data;
	            var scrollHeight = _data2.scrollHeight;
	            var clientHeight = _data2.clientHeight;
	            var thumbHeight = _data2.thumbHeight;

	            return offset / (clientHeight - thumbHeight) * (scrollHeight - clientHeight);
	        }
	    }, {
	        key: 'getScrollLeftForOffset',
	        value: function getScrollLeftForOffset(offset) {
	            var _data3 = this.data;
	            var scrollWidth = _data3.scrollWidth;
	            var clientWidth = _data3.clientWidth;
	            var thumbWidth = _data3.thumbWidth;

	            return offset / (clientWidth - thumbWidth) * (scrollWidth - clientWidth);
	        }
	    }, {
	        key: 'onTrackClicked',
	        value: function onTrackClicked(event) {
	            this.direction = event.target === this.tY ? VER : HOR;
	            var offset = this.direction === VER ? this.getScrollTopForClickOffset(event) : this.getScrollLeftForClickOffset(event);
	            this.move(this.direction, offset);
	        }
	    }, {
	        key: 'getScrollTopForClickOffset',
	        value: function getScrollTopForClickOffset(event) {
	            var target = event.target;
	            var clientY = event.clientY;

	            var _target$getBoundingCl2 = target.getBoundingClientRect();

	            var top = _target$getBoundingCl2.top;
	            var _data4 = this.data;
	            var scrollHeight = _data4.scrollHeight;
	            var clientHeight = _data4.clientHeight;
	            var thumbHeight = _data4.thumbHeight;
	            var trackHeight = _data4.trackHeight;


	            var offset = Math.abs(top - clientY) - thumbHeight / 2;
	            return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
	        }
	    }, {
	        key: 'getScrollLeftForClickOffset',
	        value: function getScrollLeftForClickOffset(event) {
	            var target = event.target;
	            var clientX = event.clientX;

	            var _target$getBoundingCl3 = target.getBoundingClientRect();

	            var left = _target$getBoundingCl3.left;
	            var _data5 = this.data;
	            var scrollWidth = _data5.scrollWidth;
	            var clientWidth = _data5.clientWidth;
	            var thumbWidth = _data5.thumbWidth;
	            var trackWidth = _data5.trackWidth;


	            var offset = Math.abs(left - clientX) - thumbWidth / 2;
	            return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
	        }
	    }]);

	    return DraggingManager;
	}();

	var ScrollingManager = exports.ScrollingManager = function () {
	    function ScrollingManager(refs, props, dataManager, movementManager, visualChangesManager) {
	        _classCallCheck(this, ScrollingManager);

	        this.changesManager = visualChangesManager;
	        this.dataManager = dataManager;
	        this.props = props;
	        this.movementManager = movementManager;

	        this.enabled = true;
	        this.scrolling = false;
	        this.raf = null;
	        this.autoHideTimeout = null;
	        this.flashTimeout = null;
	        this.cancelHiding = false;
	        this.mouseOverX = false;
	        this.mouseOverY = false;
	        this.visibleX = false;
	        this.disableX = false;
	        this.visibleY = false;
	        this.disableY = false;

	        this.tX = refs['trackHorizontal'];
	        this.tY = refs['trackVertical'];
	        this.tnX = refs['thumbHorizontal'];
	        this.tnY = refs['thumbVertical'];
	        this.view = refs['view'];

	        this.loopBinded = this.rafLoop.bind(this);
	    }

	    /*** Initializer ***/


	    _createClass(ScrollingManager, [{
	        key: 'initialize',
	        value: function initialize() {
	            this.initializeX();
	            this.initializeY();
	            this.flashBars(true);
	        }
	    }, {
	        key: 'initializeX',
	        value: function initializeX() {
	            var availableTrackX = this.dataManager.values.availableTrackX;
	            var _props = this.props;
	            var flashTime = _props.flashTime;
	            var flashTimeDelay = _props.flashTimeDelay;
	            var autoHide = _props.autoHide;

	            var startHidden = flashTime > 0 && flashTimeDelay > 0 && autoHide || autoHide && !flashTime;

	            if (availableTrackX) {
	                this.resizeThumbX();
	                if (startHidden) {
	                    this.hideBar(HOR, true);
	                    this.hideBar(HOR);
	                } else {
	                    this.showBar(HOR);
	                }
	                return;
	            }
	            this.hideBar(HOR, true);
	        }
	    }, {
	        key: 'initializeY',
	        value: function initializeY() {
	            var availableTrackY = this.dataManager.values.availableTrackY;
	            var _props2 = this.props;
	            var flashTime = _props2.flashTime;
	            var flashTimeDelay = _props2.flashTimeDelay;
	            var autoHide = _props2.autoHide;

	            var startHidden = flashTime > 0 && flashTimeDelay > 0 && autoHide || autoHide && !flashTime;

	            if (availableTrackY) {
	                this.resizeThumbY();
	                if (startHidden) {
	                    this.hideBar(VER, true);
	                    this.hideBar(VER);
	                } else {
	                    this.showBar(VER);
	                }
	                return;
	            }
	            this.hideBar(VER, true);
	        }

	        /*** Events ***/

	    }, {
	        key: 'onScroll',
	        value: function onScroll(event) {
	            this.dataManager.update();
	            this.movementManager.setEvent(event);
	            this.movementManager.shouldContinue();

	            if (this.raf) return;
	            this.raf = window.requestAnimationFrame(this.loopBinded);
	        }
	    }, {
	        key: 'onScrollStart',
	        value: function onScrollStart() {
	            this.scrolling = true;
	            this.cancelHiding = false;
	            this.changesManager.scrollingOn();
	        }
	    }, {
	        key: 'onScrolling',
	        value: function onScrolling() {}
	    }, {
	        key: 'onScrollEnd',
	        value: function onScrollEnd() {
	            window.cancelAnimationFrame(this.raf);
	            this.raf = undefined;
	            this.scrolling = false;
	            this.changesManager.scrollingOff();
	            this.autoHide();
	        }
	    }, {
	        key: 'onMouseEnterTrack',
	        value: function onMouseEnterTrack(event) {

	            var targetDirection = this.mouseEnterLeaveDetect(event.target);
	            if (targetDirection === HOR) this.mouseOverX = true;
	            if (targetDirection === VER) this.mouseOverY = true;

	            clearTimeout(this.autoHideTimeout);
	            this.autoHideTimeout = null;
	        }
	    }, {
	        key: 'onMouseLeaveTrack',
	        value: function onMouseLeaveTrack(event) {

	            var targetDirection = this.mouseEnterLeaveDetect(event.target);
	            if (targetDirection === VER) this.mouseOverY = false;
	            if (targetDirection === HOR) this.mouseOverX = false;

	            this.autoHide();
	        }
	    }, {
	        key: 'mouseEnterLeaveDetect',
	        value: function mouseEnterLeaveDetect(target) {
	            return target === this.tY || target === this.tnY ? VER : target === this.tX || target === this.tnX ? HOR : NONE;
	        }
	    }, {
	        key: 'onScrollBarAndThumb',
	        value: function onScrollBarAndThumb(event) {
	            this.movementManager.setEvent(event, true);
	            var _movementManager$dire = this.movementManager.direction;
	            var dx = _movementManager$dire.dx;
	            var dy = _movementManager$dire.dy;
	            var isX = _movementManager$dire.isX;
	            var isY = _movementManager$dire.isY;
	            var _dataManager$values = this.dataManager.values;
	            var scrollTop = _dataManager$values.scrollTop;
	            var scrollLeft = _dataManager$values.scrollLeft;


	            if (isY) {
	                this.toTop(scrollTop + dy);
	            }
	            if (isX) {
	                this.toLeft(scrollLeft + dx);
	            }
	        }

	        /*** animation frame ***/

	    }, {
	        key: 'rafLoop',
	        value: function rafLoop() {
	            this.rafActions();
	            this.raf = window.requestAnimationFrame(this.loopBinded);
	        }
	    }, {
	        key: 'rafActions',
	        value: function rafActions() {
	            this.showBars();
	            this.changesManager.applyChanges();
	        }

	        /*** changers ***/

	    }, {
	        key: 'showBars',
	        value: function showBars() {
	            var _dataManager$values2 = this.dataManager.values;
	            var displayableTrackX = _dataManager$values2.displayableTrackX;
	            var displayableTrackY = _dataManager$values2.displayableTrackY;


	            if (displayableTrackX) {
	                this.showBar(HOR);
	                this.moveThumbX();
	                this.resizeThumbX();
	            }

	            if (displayableTrackY) {
	                this.showBar(VER);
	                this.moveThumbY();
	                this.resizeThumbY();
	            }
	        }
	    }, {
	        key: 'showBar',
	        value: function showBar(axis) {
	            var disable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            //console.log("******", axis, disable, this.visibleY, this.visibleX);
	            var object = axis === HOR ? this.tX : this.tY;
	            if (!disable) {
	                this.adjustCounterpart(axis, 'show');
	                this['visible' + (axis === HOR ? 'X' : 'Y')] = true;
	                this.changesManager.removeClass(object, 'inactive');

	                if (this['disable' + (axis === HOR ? 'X' : 'Y')] === true) {
	                    this['disable' + (axis === HOR ? 'X' : 'Y')] = false;
	                    this.changesManager.changeProperty(object, 'display', 'block');
	                }
	                return;
	            }
	            this['disable' + (axis === HOR ? 'X' : 'Y')] = false;
	            this.changesManager.changeProperty(object, 'display', 'block');
	        }
	    }, {
	        key: 'hideBar',
	        value: function hideBar(axis) {
	            var disable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            var object = axis === HOR ? this.tX : this.tY;
	            if (!disable) {
	                this.adjustCounterpart(axis, 'hide');
	                this['visible' + (axis === HOR ? 'X' : 'Y')] = false;
	                this.changesManager.addClass(object, 'inactive');
	                return;
	            }
	            this['disable' + (axis === HOR ? 'X' : 'Y')] = true;
	            this.changesManager.changeProperty(object, 'display', 'none');
	        }
	    }, {
	        key: 'moveThumbX',
	        value: function moveThumbX() {
	            this.changesManager.changeProperty(this.tnX, 'transform', 'translateX(' + this.dataManager.thumbData.x.pos + 'px)');
	        }
	    }, {
	        key: 'moveThumbY',
	        value: function moveThumbY() {
	            this.changesManager.changeProperty(this.tnY, 'transform', 'translateY(' + this.dataManager.thumbData.y.pos + 'px)');
	        }
	    }, {
	        key: 'resizeThumbX',
	        value: function resizeThumbX() {
	            this.changesManager.changeProperty(this.tnX, 'width', this.dataManager.thumbData.x.size + 'px');
	        }
	    }, {
	        key: 'resizeThumbY',
	        value: function resizeThumbY() {
	            this.changesManager.changeProperty(this.tnY, 'height', this.dataManager.thumbData.y.size + 'px');
	        }
	    }, {
	        key: 'autoHide',
	        value: function autoHide() {
	            var _this3 = this;

	            if (this.props.autoHide) {
	                this.autoHideTimeout = setTimeout(function () {
	                    clearTimeout(_this3.autoHideTimeout);

	                    if (!_this3.scrolling && !_this3.cancelHiding) {
	                        if (!_this3.mouseOverX) _this3.hideBar(HOR);
	                        if (!_this3.mouseOverY) _this3.hideBar(VER);
	                    }
	                }, this.props.autoHideTimeout);
	            }
	        }
	    }, {
	        key: 'flashBars',
	        value: function flashBars() {
	            var _this4 = this;

	            var useDelay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	            var _dataManager$values3 = this.dataManager.values;
	            var flashableTrackX = _dataManager$values3.flashableTrackX;
	            var flashableTrackY = _dataManager$values3.flashableTrackY;


	            var flash = setTimeout(function () {

	                if (flashableTrackX) _this4.showBar(HOR, true);
	                if (flashableTrackX) _this4.showBar(HOR);
	                if (flashableTrackY) _this4.showBar(VER, true);
	                if (flashableTrackY) _this4.showBar(VER);
	                clearTimeout(flash);

	                if (!_this4.props.autoHide) return;

	                _this4.flashTimeout = setTimeout(function () {

	                    clearTimeout(_this4.flashTimeout);
	                    if (flashableTrackX && !_this4.mouseOverX) _this4.hideBar(HOR);
	                    if (flashableTrackY && !_this4.mouseOverY) _this4.hideBar(VER);
	                }, _this4.props.flashTime);
	            }, useDelay ? this.props.flashTimeDelay : 0);
	        }
	    }, {
	        key: 'adjustCounterpart',
	        value: function adjustCounterpart(axis, action) {
	            var otherVisibility = axis === HOR ? this.visibleY : this.visibleX;
	            var thisObject = axis === HOR ? this.tX : this.tY;
	            var otherObject = axis === HOR ? this.tY : this.tX;

	            if (action === 'show') {
	                if (otherVisibility) {
	                    this.changesManager.addClass(thisObject, 'shrinked');
	                    this.changesManager.addClass(otherObject, 'shrinked');
	                    this.changesManager.removeClass(thisObject, 'extended');
	                    this.changesManager.removeClass(otherObject, 'extended');
	                    return;
	                }
	                this.changesManager.addClass(thisObject, 'extended');
	                this.changesManager.removeClass(thisObject, 'shrinked');
	                return;
	            }

	            if (action === 'hide') {

	                this.changesManager.removeClass(thisObject, 'extended');
	                this.changesManager.removeClass(thisObject, 'shrinked');

	                if (otherVisibility) {
	                    this.changesManager.addClass(otherObject, 'extended');
	                    this.changesManager.removeClass(otherObject, 'shrinked');
	                }
	            }
	        }
	    }, {
	        key: 'toTop',
	        value: function toTop() {
	            var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	            if (this.dataManager.values.availableTrackY) this.view.scrollTop = top;
	        }
	    }, {
	        key: 'toBottom',
	        value: function toBottom() {
	            var bottom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	            if (this.dataManager.values.availableTrackY) this.view.scrollTop = this.dataManager.values.maxScrollTop - bottom;
	        }
	    }, {
	        key: 'toLeft',
	        value: function toLeft() {
	            var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	            if (this.dataManager.values.availableTrackX) this.view.scrollLeft = left;
	        }
	    }, {
	        key: 'toRight',
	        value: function toRight() {
	            var right = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	            if (this.dataManager.values.availableTrackX) this.view.scrollLeft = this.dataManager.values.maxScrollLeft - right;
	        }
	    }, {
	        key: 'enable',
	        value: function enable() {
	            this.enabled = true;
	        }
	    }, {
	        key: 'disable',
	        value: function disable() {
	            this.enabled = false;
	        }
	    }, {
	        key: 'cancelFlash',
	        value: function cancelFlash() {}
	    }]);

	    return ScrollingManager;
	}();

	var VisualChangesManager = exports.VisualChangesManager = function () {
	    function VisualChangesManager() {
	        _classCallCheck(this, VisualChangesManager);

	        this.scrolling = false;
	        this.visualChanges = [];
	    }

	    _createClass(VisualChangesManager, [{
	        key: 'scrollingOn',
	        value: function scrollingOn() {
	            this.scrolling = true;
	        }
	    }, {
	        key: 'scrollingOff',
	        value: function scrollingOff() {
	            this.scrolling = false;
	        }
	    }, {
	        key: 'addClass',
	        value: function addClass(object, cssClass) {
	            var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	            if (this.scrolling && !force) {
	                this.storeChange(object, 'class', cssClass, 'add');
	                return;
	            }
	            object.classList.add(cssClass);
	        }
	    }, {
	        key: 'removeClass',
	        value: function removeClass(object, cssClass) {
	            var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	            if (this.scrolling && !force) {
	                this.storeChange(object, 'class', cssClass, 'remove');
	                return;
	            }
	            object.classList.remove(cssClass);
	        }
	    }, {
	        key: 'changeProperty',
	        value: function changeProperty(object, cssProperty, value) {
	            var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


	            if (this.scrolling && !force) {
	                this.storeChange(object, cssProperty, value, null);
	                return;
	            }

	            object.style[cssProperty] = value;
	        }
	    }, {
	        key: 'storeChange',
	        value: function storeChange(object, cssProperty, value, action) {
	            this.visualChanges.push({ object: object, cssProperty: cssProperty, value: value, action: action });
	        }
	    }, {
	        key: 'applyChanges',
	        value: function applyChanges() {

	            while (this.visualChanges.length > 0 && this.scrolling) {
	                var currentChange = this.visualChanges.shift();

	                var object = currentChange.object;
	                var cssProperty = currentChange.cssProperty;
	                var value = currentChange.value;
	                var action = currentChange.action;


	                if (cssProperty === 'class') {
	                    if (action === 'add') this.addClass(object, value, true);
	                    if (action === 'remove') this.removeClass(object, value, true);
	                } else {
	                    this.changeProperty(object, cssProperty, value, true);
	                }
	            }
	        }
	    }]);

	    return VisualChangesManager;
	}();

	var DisplayManager = exports.DisplayManager = function DisplayManager(refs) {
	    _classCallCheck(this, DisplayManager);

	    this.v = {
	        track: refs['trackVertical'],
	        thumb: refs['thumbVertical']
	    };
	    this.h = {
	        track: refs['trackHorizontal'],
	        thumb: refs['thumbHorizontal']
	    };
	};

	var StyleManager = exports.StyleManager = function () {
	    _createClass(StyleManager, [{
	        key: 'init',
	        value: function init() {}
	    }]);

	    function StyleManager(styleID) {
	        var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	        _classCallCheck(this, StyleManager);

	        this.id = styleID.toLowerCase();
	        this.rawCSS = null;
	        this.parsedCSS = null;
	        this.cssOwner = false;
	        this.namespace = (namespace || '').toLowerCase() || this.id;
	        this.preExisted = true;
	        this.currentNode = document.getElementById(this.id) || this.createDomNode();
	        this.origin = null;

	        this.rex = {
	            placeholder: /classNamePlaceholder/gm,
	            ruleFinder: /([#.a-z]?[a-z_][\s\S]+?{[\s\S]*?})/gmi
	        };
	    }

	    _createClass(StyleManager, [{
	        key: 'setParsedRules',
	        value: function setParsedRules(rawCSS) {
	            if (!rawCSS) return;

	            this.rawCSS = rawCSS;
	            this.fixRawCSS();
	            this.writeRules();
	        }
	    }, {
	        key: 'writeRules',
	        value: function writeRules() {
	            var forceNew = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            if (!this.cssOwner && !forceNew) return;
	            if (this.preExisted) return;

	            this.currentNode.innerHTML = this.parsedCSS;
	        }
	    }, {
	        key: 'fixRawCSS',
	        value: function fixRawCSS() {
	            this.parsedCSS = this.rawCSS.replace(this.rex.placeholder, this.namespace);
	        }
	    }, {
	        key: 'createDomNode',
	        value: function createDomNode() {
	            var node = document.createElement('style');
	            node.setAttribute('type', "text/css");
	            node.setAttribute('id', this.id);
	            document.head.appendChild(node);
	            this.preExisted = false;
	            this.cssOwner = true;
	            return node;
	        }
	    }]);

	    return StyleManager;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".classNamePlaceholder{width:100%;height:100%;position:relative;overflow:hidden}.classNamePlaceholder::-webkit-scrollbar{display:none!important}.classNamePlaceholder .sb2view{position:absolute;width:100%;height:100%;overflow:scroll}.classNamePlaceholder .sb2view::-webkit-scrollbar{display:none!important}.classNamePlaceholder .sb2tracks{position:absolute;background:rgba(0,0,0,.15);padding:3px 2px;transition:opacity .2s;opacity:1}.classNamePlaceholder .sb2tracks.sb2init-hidden{display:none}.classNamePlaceholder .sb2tracks.sb2h{bottom:0;left:0;right:12px}.classNamePlaceholder .sb2tracks.sb2h.extended{right:0}.classNamePlaceholder .sb2tracks.sb2v{bottom:0;top:0;right:0}.classNamePlaceholder .sb2tracks.sb2v.shrinked{padding-bottom:15px}.classNamePlaceholder .sb2tracks.inactive{opacity:0}.classNamePlaceholder .sb2tracks.inactive.sb2h{bottom:-15px}.classNamePlaceholder .sb2tracks.inactive.sb2v{right:-15px}.classNamePlaceholder .sb2thumbs{border-radius:4px;background:#AAA}.classNamePlaceholder .sb2thumbs.sb2h{height:8px}.classNamePlaceholder .sb2thumbs.sb2v{width:8px}._defCursor,._noSelectable{cursor:default!important}._noSelectable{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._noOutline{outline:0!important;-moz-outline-style:none!important}.classNamePlaceholder .sb2view,.hack{transform:translateZ(0);will-change:transform}", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	function E () {
	  // Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}

	E.prototype = {
	  on: function (name, callback, ctx) {
	    var e = this.e || (this.e = {});

	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });

	    return this;
	  },

	  once: function (name, callback, ctx) {
	    var self = this;
	    function listener () {
	      self.off(name, listener);
	      callback.apply(ctx, arguments);
	    };

	    listener._ = callback
	    return this.on(name, listener, ctx);
	  },

	  emit: function (name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;

	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }

	    return this;
	  },

	  off: function (name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];

	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
	          liveEvents.push(evts[i]);
	      }
	    }

	    // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

	    (liveEvents.length)
	      ? e[name] = liveEvents
	      : delete e[name];

	    return this;
	  }
	};

	module.exports = E;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(4);

	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;