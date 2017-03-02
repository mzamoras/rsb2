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

var SCROLL = 'scroll';
var WHEEL = 'wheel';
var DOWN = 'down';
var UP = 'up';
var LEFT = 'left';
var RIGHT = 'right';
var NONE = 'none';

/** D E B O U N C E **/
/** ************************************************* **/

function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

/** ************************************************* **/

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

        this.dx = 0;
        this.dy = 0;

        this.refs = refs;
        //noinspection JSUnresolvedVariable
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
            tmpData.realMovY = tmpData.scrollTop - (!this.hasPrevData ? 0 : this.prevData.scrollTop) || this.dy !== 0;
            tmpData.realMovX = tmpData.scrollLeft - (!this.hasPrevData ? 0 : this.prevData.scrollLeft) || this.dx !== 0;

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
            var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: AN };


            this.dx = event.type === WHEEL ? event.dx : 0;
            this.dy = event.type === WHEEL ? event.dy : 0;

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

var MovementManager = exports.MovementManager = function () {
    _createClass(MovementManager, [{
        key: 'init',
        value: function init() {
            var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { type: AN };


            this.values = this.dataManager.values;
            var dy = event.deltaY || 0;
            var dx = event.deltaX || 0;

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

            this.needYWithMovement = this.needY && (this.dataManager.hasMovY || dy !== 0);
            this.needXWithMovement = this.needX && (this.dataManager.hasMovX || dx !== 0);

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
            this.scrolling = true;
            this.startTimer();

            this.edgeChecker();
            //console.log(this.isScroll, this.isWheel,this.scrolling);
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

            //if ( this.scrolling ) return;
            if (this.scrolling) {
                clearInterval(this.scrollTimer);
            }

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

//const noop      = () => null;


var noopFalse = function noopFalse() {
    return false;
};
//const noopTrue  = () => false;

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
        //noinspection JSUnresolvedVariable
        this.view = refs['view'];

        this.data = scrollDataManager.values;

        this.eventsSetup = { passive: false, capture: true };
        this.onDragBinded = this.onDrag.bind(this);
        this.onDragEndBinded = this.onDragEnd.bind(this);

        //Data for constant calculation
        this.scrollDataManager = scrollDataManager;
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
            var _scrollDataManager$va = this.scrollDataManager.values;
            var scrollHeight = _scrollDataManager$va.scrollHeight;
            var thumbHeight = _scrollDataManager$va.thumbHeight;
            var clientHeight = _scrollDataManager$va.clientHeight; //keeps the data updated

            return offset / (clientHeight - thumbHeight) * (scrollHeight - clientHeight);
        }
    }, {
        key: 'getScrollLeftForOffset',
        value: function getScrollLeftForOffset(offset) {
            var _scrollDataManager$va2 = this.scrollDataManager.values;
            var scrollWidth = _scrollDataManager$va2.scrollWidth;
            var clientWidth = _scrollDataManager$va2.clientWidth;
            var thumbWidth = _scrollDataManager$va2.thumbWidth; //keeps the data updated

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
            var _data2 = this.data;
            var scrollHeight = _data2.scrollHeight;
            var thumbHeight = _data2.thumbHeight;

            var clientHeight = this.view.clientHeight; //->read this values each time, they may have changed
            var trackHeight = target.offsetHeight; //->read this values each time, they may have changed

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
            var _data3 = this.data;
            var scrollWidth = _data3.scrollWidth;
            var thumbWidth = _data3.thumbWidth;

            var clientWidth = this.view.clientWidth; //->read this values each time, they may have changed
            var trackWidth = target.offsetWidth; //->read this values each time, they may have changed

            var offset = Math.abs(left - clientX) - thumbWidth / 2;
            return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
        }
    }]);

    return DraggingManager;
}();

var ScrollingManager = exports.ScrollingManager = function () {
    _createClass(ScrollingManager, [{
        key: 'prepareExportableData',
        value: function prepareExportableData() {
            var d = this.dataManager.data;
            var t = this.dataManager.thumbData;
            var m = this.movementManager.direction;
            return {
                scrollTop: d.scrollTop,
                scrollLeft: d.scrollLeft,
                scrollHeight: d.scrollHeight,
                scrollWidth: d.scrollWidth,
                clientHeight: d.clientHeight,
                clientWidth: d.clientWidth,
                realMovY: d.realMovY,
                realMovX: d.realMovX,
                maxScrollTop: d.maxScrollTop,
                maxScrollLeft: d.maxScrollLeft,
                thumbHeightY: d.thumbHeight,
                thumbWidthX: d.thumbWidth,
                direction: m.dir,
                axis: m.axis,
                thumbsData: t
            };
        }
    }, {
        key: 'debouncedOnScrollProps',
        value: function debouncedOnScrollProps() {
            this.props.onScroll(this.prepareExportableData());
        }
    }, {
        key: 'debouncedOnScrollFrameProps',
        value: function debouncedOnScrollFrameProps() {
            this.props.onScrollFrame(this.prepareExportableData());
        }

        /** ************************************************* **/

    }]);

    function ScrollingManager(refs, props, dataManager, movementManager, visualChangesManager) {
        _classCallCheck(this, ScrollingManager);

        this.changesManager = visualChangesManager;
        this.dataManager = dataManager;
        this.props = props;
        this.movementManager = movementManager;

        //this.enabled         = true;
        this.scrolling = false;
        this.raf = null;
        this.autoHideTimeout = null;
        this.flashTimeout = null;
        this.cancelHiding = false;
        this.mouseOverX = false;
        this.mouseOverY = false;
        this.visibleX = false;
        //this.disableX        = false;
        this.visibleY = false;
        //this.disableY        = false;

        this.tX = refs['trackHorizontal'];
        this.tY = refs['trackVertical'];
        this.tnX = refs['thumbHorizontal'];
        this.tnY = refs['thumbVertical'];
        //noinspection JSUnresolvedVariable
        this.view = refs['view'];
        this.cont = refs['container'];

        this.loopBinded = this.rafLoop.bind(this);
        this.debouncedOnScrollProps = this.debouncedOnScrollProps.bind(this);
        this.debouncedOnScrollFrameProps = this.debouncedOnScrollFrameProps.bind(this);
        this.callOnScrollProps = debounce(this.debouncedOnScrollProps, 0);
        this.callOnScrollFrameProps = debounce(this.debouncedOnScrollFrameProps, 0);
    }

    /*** Initializer ***/


    _createClass(ScrollingManager, [{
        key: 'initialize',
        value: function initialize() {
            var _this3 = this;

            this.changesManager.removeClass(this.cont, 'initial');

            var to = setTimeout(function () {

                _this3.dataManager.update(true);
                _this3.initializeX();
                _this3.initializeY();
                _this3.flashBars(true);
                clearTimeout(to);
            }, 0);

            //this.initializeX();
            //this.initializeY();
            //this.flashBars( true );
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
            this.callOnScrollProps();
            this.dataManager.update(false, event);
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
            event.preventDefault();
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
            this.props.onScrollFrame(this.prepareExportableData());
            //this.callOnScrollFrameProps();
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
            var _this4 = this;

            if (this.props.autoHide) {
                this.autoHideTimeout = setTimeout(function () {
                    clearTimeout(_this4.autoHideTimeout);

                    if (!_this4.scrolling && !_this4.cancelHiding) {
                        if (!_this4.mouseOverX) _this4.hideBar(HOR);
                        if (!_this4.mouseOverY) _this4.hideBar(VER);
                    }
                }, this.props.autoHideTimeout);
            }
        }
    }, {
        key: 'flashBars',
        value: function flashBars() {
            var _this5 = this;

            var useDelay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var _dataManager$values3 = this.dataManager.values;
            var flashableTrackX = _dataManager$values3.flashableTrackX;
            var flashableTrackY = _dataManager$values3.flashableTrackY;


            var flash = setTimeout(function () {

                if (flashableTrackX) _this5.showBar(HOR, true);
                if (flashableTrackX) _this5.showBar(HOR);
                if (flashableTrackY) _this5.showBar(VER, true);
                if (flashableTrackY) _this5.showBar(VER);
                clearTimeout(flash);

                if (!_this5.props.autoHide) return;

                _this5.flashTimeout = setTimeout(function () {

                    clearTimeout(_this5.flashTimeout);
                    if (flashableTrackX && !_this5.mouseOverX) _this5.hideBar(HOR);
                    if (flashableTrackY && !_this5.mouseOverY) _this5.hideBar(VER);
                }, _this5.props.flashTime);
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
            //this.enabled = true;
        }
    }, {
        key: 'disable',
        value: function disable() {
            //this.enabled = false;
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
        //this.origin      = null;

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