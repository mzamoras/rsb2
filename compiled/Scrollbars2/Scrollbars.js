'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Scrollbars2 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAutobindHelper = require('react-autobind-helper');

var _reactAutobindHelper2 = _interopRequireDefault(_reactAutobindHelper);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _utils = require('./utils');

var _scrollbarsStyle = require('./scrollbarsStyle');

var _scrollbarsStyle2 = _interopRequireDefault(_scrollbarsStyle);

var _scrollbarsClassNames = require('./scrollbarsClassNames');

var _scrollbarsClassNames2 = _interopRequireDefault(_scrollbarsClassNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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

var defaultParsedStyle = require('to-string!css!less!./style/style.less');

var CSS_CLASS = 'sb2-scrollbars2';
var CSS_TAG_ID = 'sb2-tag';
var noop = function noop() {
    return null;
};

var Scrollbars2 = exports.Scrollbars2 = function (_React$Component) {
    _inherits(Scrollbars2, _React$Component);

    function Scrollbars2(props) {
        _classCallCheck(this, Scrollbars2);

        var _this = _possibleConstructorReturn(this, (Scrollbars2.__proto__ || Object.getPrototypeOf(Scrollbars2)).call(this, props));

        (0, _reactAutobindHelper2.default)(_this);

        _this.reactStyle = {
            container: true,
            view: true,
            bothThumbs: true,
            bothTracks: true,
            trackH: true,
            trackV: true,
            thumbH: true,
            thumbV: true
        };

        _this.reactStyle = (0, _scrollbarsStyle2.default)(props);
        _this.cssClasses = (0, _scrollbarsClassNames2.default)(props);
        return _this;
    }

    _createClass(Scrollbars2, [{
        key: 'setup',
        value: function setup() {
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
            this.emitter.on('scroll:end', this.onScrollEnd);
            this.emitter.on('scroll:scrolling', this.onScrolling);

            this.emitter.on('scroll:atTop', this.atTop);
            this.emitter.on('scroll:atBottom', this.atBottom);
            this.emitter.on('scroll:atLeft', this.atLeft);
            this.emitter.on('scroll:atRight', this.atRight);

            this.addListeners();
            this.api = {};
            this.exposeApiFunctions();
        }
    }, {
        key: 'init',
        value: function init() {
            this.scrollingManager.initialize();

            this.props.onMount({
                containerView: this.refs['container'],
                scrollableView: this.refs['view'],
                scrollbarObject: this,
                initialData: this.scrollingManager.prepareExportableData()
            });
        }
    }, {
        key: 'exposeApiFunctions',


        /*** API FUNCTIONS ***/
        value: function exposeApiFunctions() {
            var _this2 = this;

            this.api.toTop = function () {
                var dist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                return _this2.scrollingManager.toTop(dist);
            };
            this.api.toLeft = function () {
                var dist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                return _this2.scrollingManager.toLeft(dist);
            };
            this.api.toBottom = function () {
                var dist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                return _this2.scrollingManager.toBottom(dist);
            };
            this.api.toRight = function () {
                var dist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                return _this2.scrollingManager.toRight(dist);
            };
            this.api.enable = function () {
                return _this2.scrollingManager.enable();
            };
            this.api.disable = function () {
                return _this2.scrollingManager.disable();
            };
            this.api.cancelFlash = function () {
                return _this2.scrollingManager.cancelFlash();
            };
            this.api.update = function () {
                return _this2.update();
            };
            this.api.data = function () {
                return _this2.scrollingManager.prepareExportableData();
            };

            this.api.getPositionY = function () {
                return _this2.scrollingManager.prepareExportableData().scrollTop;
            };
            this.api.getPositionX = function () {
                return _this2.scrollingManager.prepareExportableData().scrollLeft;
            };
        }
    }, {
        key: 'update',
        value: function update() {
            var _this3 = this;

            if (!this.scrollDataManager) return;
            this.scrollDataManager.update();

            var to = setTimeout(function () {
                _this3.scrollingManager.initializeX();
                _this3.scrollingManager.initializeY();
                clearTimeout(to);
            }, 20);
        }
    }, {
        key: 'addListeners',


        /*** LISTENERS  ***/
        value: function addListeners() {
            var passive = this.props.passive;

            var capture = true;

            this._view.addEventListener('scroll', this.onScroll, { passive: passive, capture: capture });
            this._view.addEventListener('wheel', this.onScroll, { capture: capture });

            /** object events **/
            this._ht.addEventListener('mouseenter', this.onMouseEnterTrack);
            this._ht.addEventListener('mouseleave', this.onMouseLeaveTrack);
            this._ht.addEventListener('mousedown', this.onMouseDownTrack);
            this._htn.addEventListener('mousedown', this.onMouseDownThumb);

            this._vt.addEventListener('mouseenter', this.onMouseEnterTrack);
            this._vt.addEventListener('mouseleave', this.onMouseLeaveTrack);
            this._vt.addEventListener('mousedown', this.onMouseDownTrack);
            this._vtn.addEventListener('mousedown', this.onMouseDownThumb);

            this._ht.addEventListener('wheel', this.onScrollBarAndThumb, { capture: capture });
            this._vt.addEventListener('wheel', this.onScrollBarAndThumb, { capture: capture });
        }
    }, {
        key: 'removeListeners',
        value: function removeListeners() {
            var passive = this.props.passive;

            var capture = true;

            this._view.removeEventListener('scroll', this.onScroll, { passive: passive, capture: capture });
            this._view.removeEventListener('wheel', this.onScroll, { capture: capture });

            /** object events **/
            this._ht.removeEventListener('mouseenter', this.onMouseEnterTrack);
            this._ht.removeEventListener('mouseleave', this.onMouseLeaveTrack);
            this._ht.removeEventListener('mousedown', this.onMouseDownTrack);
            this._htn.removeEventListener('mousedown', this.onMouseDownThumb);

            this._vt.removeEventListener('mouseenter', this.onMouseEnterTrack);
            this._vt.removeEventListener('mouseleave', this.onMouseLeaveTrack);
            this._vt.removeEventListener('mousedown', this.onMouseDownTrack);
            this._vtn.removeEventListener('mousedown', this.onMouseDownThumb);

            this._ht.removeEventListener('wheel', this.onScrollBarAndThumb, { capture: capture });
            this._vt.removeEventListener('wheel', this.onScrollBarAndThumb, { capture: capture });
        }
    }, {
        key: 'onScroll',


        /*** SCROLL EVENTS ***/
        value: function onScroll(event) {
            this.scrollingManager.onScroll(event);
        }
    }, {
        key: 'onScrollStart',
        value: function onScrollStart() {
            this.scrollingManager.onScrollStart();
        }
    }, {
        key: 'onScrollEnd',
        value: function onScrollEnd() {
            this.scrollingManager.onScrollEnd();
        }
    }, {
        key: 'onScrolling',
        value: function onScrolling() {
            this.scrollingManager.onScrolling();
        }
    }, {
        key: 'atTop',
        value: function atTop() {
            this.props.atTop();
        }
    }, {
        key: 'atBottom',
        value: function atBottom() {
            this.props.atBottom();
        }
    }, {
        key: 'atLeft',
        value: function atLeft() {
            this.props.atLeft();
        }
    }, {
        key: 'atRight',
        value: function atRight() {
            this.props.atRight();
        }
    }, {
        key: 'onScrollBarAndThumb',
        value: function onScrollBarAndThumb(event) {
            event.preventDefault();
            event.stopPropagation();
            this.scrollingManager.onScrollBarAndThumb(event);
        }
    }, {
        key: 'onMouseLeaveTrack',


        /*** TRACK EVENTS ***/
        value: function onMouseLeaveTrack(event) {
            this.scrollingManager.onMouseLeaveTrack(event);
        }
    }, {
        key: 'onMouseEnterTrack',
        value: function onMouseEnterTrack(event) {
            this.scrollingManager.onMouseEnterTrack(event);
        }
    }, {
        key: 'onMouseDownTrack',
        value: function onMouseDownTrack(event) {
            this.draggingManager.onTrackClicked(event);
        }
    }, {
        key: 'onMouseDownThumb',
        value: function onMouseDownThumb(event) {
            this.draggingManager.onDragStart(event);
        }
    }, {
        key: 'componentWillUnmount',


        /*** COMPONENT LIFECYCLE ***/
        value: function componentWillUnmount() {
            this.removeListeners();
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                cssStyleClass = _props.cssStyleClass,
                cssStylesheetID = _props.cssStylesheetID;


            var isDefaultStyle = cssStyleClass === CSS_CLASS;
            this.styleTagId = isDefaultStyle ? cssStylesheetID : CSS_TAG_ID + "_" + cssStyleClass;
            this.styleClass = cssStyleClass;
            this.styleManager = new _utils.StyleManager(this.styleTagId, this.styleClass);

            if (this.props.injectStyle || this.props.parsedStyle) {
                this.styleManager.setParsedRules(this.props.parsedStyle || defaultParsedStyle);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setup();
            this.init();
        }
    }, {
        key: 'render',
        value: function render() {
            var _reactStyle = this.reactStyle,
                container = _reactStyle.container,
                view = _reactStyle.view,
                trackV = _reactStyle.trackV,
                trackH = _reactStyle.trackH,
                thumbV = _reactStyle.thumbV,
                thumbH = _reactStyle.thumbH;
            var _cssClasses = this.cssClasses,
                cssContainer = _cssClasses.cssContainer,
                cssHTrack = _cssClasses.cssHTrack,
                cssVTrack = _cssClasses.cssVTrack,
                cssHThumb = _cssClasses.cssHThumb,
                cssVThumb = _cssClasses.cssVThumb;


            return _react2.default.createElement(
                'div',
                { ref: 'container', style: container, className: cssContainer },
                _react2.default.createElement(
                    'div',
                    { ref: 'view', className: 'sb2view', style: view },
                    this.props.children
                ),
                _react2.default.createElement(
                    'div',
                    { ref: 'trackHorizontal', className: cssHTrack, style: trackH },
                    _react2.default.createElement('div', { ref: 'thumbHorizontal', className: cssHThumb, style: thumbH })
                ),
                _react2.default.createElement(
                    'div',
                    { ref: 'trackVertical', className: cssVTrack, style: trackV },
                    _react2.default.createElement('div', { ref: 'thumbVertical', className: cssVThumb, style: thumbV })
                )
            );
        }
    }]);

    return Scrollbars2;
}(_react2.default.Component);

/*** PROPS ***/


Scrollbars2.propTypes = {
    showVertical: _propTypes2.default.bool,
    showHorizontal: _propTypes2.default.bool,
    autoHide: _propTypes2.default.bool,
    autoHideTimeout: _propTypes2.default.number,
    autoHeight: _propTypes2.default.bool,
    autoHeightMin: _propTypes2.default.number,
    autoHeightMax: _propTypes2.default.number,
    thumbMinSize: _propTypes2.default.number,
    className: _propTypes2.default.string,

    onMount: _propTypes2.default.func,
    onScroll: _propTypes2.default.func,
    onScrollStart: _propTypes2.default.func,
    onScrollEnd: _propTypes2.default.func,
    onScrollFrame: _propTypes2.default.func,
    onUpdate: _propTypes2.default.func,
    atBottom: _propTypes2.default.func,
    atTop: _propTypes2.default.func,
    atRight: _propTypes2.default.func,
    atLeft: _propTypes2.default.func,

    cssStyleClass: _propTypes2.default.string,
    cssStylesheetID: _propTypes2.default.string,
    flashTime: _propTypes2.default.number,
    flashTimeDelay: _propTypes2.default.number,

    containerStyle: _propTypes2.default.object,
    viewStyle: _propTypes2.default.object,
    tracksStyle: _propTypes2.default.object,
    thumbsStyle: _propTypes2.default.object,
    parsedStyle: _propTypes2.default.string,
    injectStyle: _propTypes2.default.bool,

    preventScrolling: _propTypes2.default.bool,
    updateOnUpdates: _propTypes2.default.bool,
    expandTracks: _propTypes2.default.bool,
    syncTracks: _propTypes2.default.bool,
    hideUnnecessary: _propTypes2.default.bool,
    passiveEvent: _propTypes2.default.bool,
    usePerformantView: _propTypes2.default.bool
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
    injectStyle: true,

    preventScrolling: true,
    updateOnUpdates: true,
    expandTracks: false,
    syncTracks: false,
    hideUnnecessary: true,
    passiveEvent: false,
    usePerformantView: true
};

exports.default = Scrollbars2;