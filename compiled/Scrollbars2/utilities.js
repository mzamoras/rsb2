'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

/* E L E M E N T S   I N N E R - W I D T H  A N D   H E I G H T */
var innerWidth = function innerWidth(elem) {
    var computedSt = getComputedStyle(elem);
    var clientWidth = elem.clientWidth;
    var paddingLeft = computedSt.paddingLeft,
        paddingRight = computedSt.paddingRight;
    var borderLeftWidth = computedSt.borderLeftWidth,
        borderRightWidth = computedSt.borderRightWidth;

    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight) - parseFloat(borderLeftWidth) - parseFloat(borderRightWidth);
};
var innerHeight = function innerHeight(elem) {
    var computedSt = getComputedStyle(elem);
    var clientHeight = elem.clientHeight;
    var paddingTop = computedSt.paddingTop,
        paddingBottom = computedSt.paddingBottom;
    var borderBottomWidth = computedSt.borderBottomWidth,
        borderTopWidth = computedSt.borderTopWidth;

    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom) - parseFloat(borderTopWidth) - parseFloat(borderBottomWidth);
};

/* T H U M B   S I Z E */
var thumbHeight = function thumbHeight(elem, trackHeight, minSize) {
    var calculated = Math.round(elem.clientHeight / elem.scrollHeight * trackHeight * 100) / 100;
    var result = Math.max(calculated, minSize);
    return result === trackHeight ? 0 : result;
};
var thumbWidth = function thumbWidth(elem, trackWidth, minSize) {
    var calculated = Math.round(elem.clientWidth / elem.scrollWidth * trackWidth * 100) / 100;
    var result = Math.max(calculated, minSize);
    return result === trackWidth ? 0 : result;
};

/* T H U M B   P O S I T I O N */
var thumbPosY = function thumbPosY(elem, trackHeight, thumbSize) {
    return elem.scrollTop / (elem.scrollHeight - elem.clientHeight) * (trackHeight - thumbSize);
};
var thumbPosX = function thumbPosX(elem, trackWidth, thumbSize) {
    return elem.scrollLeft / (elem.scrollWidth - elem.clientWidth) * (trackWidth - thumbSize);
};

/* C O N T E N T   P O S I T I O N */
var posY = function posY(event, dataSource) {
    var target = event.target,
        clientY = event.clientY;

    var _target$getBoundingCl = target.getBoundingClientRect(),
        targetTop = _target$getBoundingCl.top;

    var scrollHeight = dataSource.scrollHeight,
        clientHeight = dataSource.clientHeight,
        thumbHeight = dataSource.thumbHeight,
        trackHeight = dataSource.trackHeight;


    var offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
    return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
};

var posX = function posX(event, dataSource) {
    var target = event.target,
        clientX = event.clientX;

    var _target$getBoundingCl2 = target.getBoundingClientRect(),
        targetLeft = _target$getBoundingCl2.left;

    var scrollWidth = dataSource.scrollWidth,
        clientWidth = dataSource.clientWidth,
        thumbWidth = dataSource.thumbWidth,
        trackWidth = dataSource.trackWidth;


    var offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
    return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
};

/* S C R O L L I N G   A X I S   D A T A */
var VER = 'vertical';
var HOR = 'horizontal';
var NONE = 'none';

var axisDelta = function axisDelta(dx, dy) {
    var absX = Math.abs(dx || 0);
    var absY = Math.abs(dy || 0);

    return Math.max(absX, absY) === absY ? VER : HOR;
};

var axisRequired = function axisRequired(requireHorizontal, requireVertical) {
    return requireVertical ? VER : requireHorizontal ? HOR : NONE;
};

/* S C R O L L I N G   M O V E M E N T   D I R E C T I O N   D A T A */
var DOWN = 'down';
var UP = 'up';
var LEFT = 'left';
var RIGHT = 'right';

var movement = function movement(actual, past) {
    var movX = actual.scrollLeft - past.scrollLeft;
    var movY = actual.scrollTop - past.scrollTop;
    var dir = void 0,
        dirX = void 0,
        dirY = void 0;

    dirX = movX > 0 ? RIGHT : movX < 0 ? LEFT : NONE;
    dirY = movY > 0 ? DOWN : movY < 0 ? UP : NONE;
    dir = dirX !== NONE ? HOR : dirY !== NONE ? VER : NONE;

    return {
        direction: dir,
        directionX: dirX,
        directionY: dirY,
        changeX: movX,
        changeY: movY
    };
};

/* S T Y L E S H E E T    C R E A T E   A N D   I N S E R T */
function StyleInserter(styleID) {
    var _this = this;

    var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var useDirectInsert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


    this.conf = {
        id: styleID.toLowerCase(),
        obj: null,
        cssParsed: null,
        cssRaw: null,
        namespace: namespace,
        directInsert: useDirectInsert,
        original: null
    };

    this.getObject = function () {
        return _this.conf.obj;
    };

    this.rex = {
        placeholder: /classNamePlaceholder/gm,
        ruleFinder: /([#.a-z]?[a-z_][\s\S]+?{[\s\S]*?})/gmi
    };

    this.markers = {
        tagIsOwn: false,
        fromFile: false
    };

    this.rules = [];

    var parseRawCss = function () {
        this.conf.cssParsed = this.conf.cssRaw.replace(this.rex.placeholder, this.conf.namespace);
    }.bind(this);

    var insertRules = function (rulesArray) {
        var _this2 = this;

        rulesArray.forEach(function (value, index) {
            _this2.rules.push(value);
            //noinspection JSUnresolvedVariable
            _this2.conf.obj.sheet.insertRule(value, index);
        });
    }.bind(this);

    var createDomNode = function () {
        var node = document.createElement('style');
        node.setAttribute('id', this.conf.id);
        document.head.appendChild(node);

        this.markers.tagIsOwn = true;

        return node;
    }.bind(this);

    this.setNameSpace = function (namespace) {
        this.conf.namespace = namespace.toLowerCase();
    };

    this.setRules = function () {
        var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var forceNew = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


        if (!this.markers.tagIsOwn && !forceNew) {
            return;
        } else if (!this.markers.tagIsOwn && forceNew) {
            this.cleanUp(true);
        }

        if (!this.conf.obj) {
            this.init();
        }

        if (!this.conf.cssParsed || forceNew && !this.markers.fromFile) {
            this.conf.cssRaw = rules;
            parseRawCss();
        }

        if (!this.conf.directInsert) {
            insertRules(this.conf.cssParsed.match(this.rex.ruleFinder));
        } else {
            this.conf.original = this.conf.obj.innerHTML;
            this.conf.obj.innerHTML = this.conf.cssParsed;
        }
    };

    this.setRulesFromParsed = function (fileParsed, custom) {

        if (!this.conf.cssRaw || custom) {
            this.conf.cssRaw = fileParsed;
            parseRawCss();
        }
        this.markers.fromFile = true;
        this.setRules(null, custom);
    };

    this.setRulesFromFile = function (fileParsed) {
        var forceReadFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!this.conf.cssRaw) {
            //this.conf.cssRaw = require( '../xx/' + filePath );
            //this.conf.cssRaw = require( 'to-string!css!less!../../style.tpl.less' );
            this.conf.cssRaw = fileParsed; //require( 'to-string!css!less!../../style.tpl.less' );
            parseRawCss();
        }
        this.markers.fromFile = true;
        this.setRules(null, forceReadFile);
    };

    this.cleanUp = function () {
        var _this3 = this;

        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!this.markers.tagIsOwn || !force) {
            return;
        }
        if (!this.conf.directInsert) {
            this.rules.forEach(function (value, index) {
                //noinspection JSUnresolvedVariable
                _this3.conf.obj.sheet.deleteRule(index);
            });
            this.rules = [];
        } else {
            this.conf.obj.innerHTML = this.conf.original;
        }
        this.document.head.removeChild(this.conf.obj);
        this.conf.obj = null;
    };

    var init = function () {
        this.setNameSpace(this.conf.namespace || this.conf.id);
        this.conf.obj = document.getElementById(this.conf.id) || createDomNode();
    }.bind(this);

    init();
}

function SelfStorage() {
    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    this.data = init;

    this.save = function saveData(keyOrObject) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if ((typeof keyOrObject === 'undefined' ? 'undefined' : _typeof(keyOrObject)) === 'object') {
            this.data = _extends({}, this.data, keyOrObject);
        } else if (value) {
            this.data[keyOrObject] = value;
        }
    };
    this.reset = function resetData(dataToResetWith) {
        this.data = {};
        this.save(dataToResetWith);
    };
    this.get = function getData() {
        var keyOrKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (!keyOrKeys) {
            return this.data;
        }
        if (typeof keyOrKeys === 'string') {
            return this.data[keyOrKeys];
        }
    };
}

var cssClassManager = exports.cssClassManager = {
    getCurrent: function getCurrent(elem) {
        return elem.getAttribute('class') || null;
    },
    add: function add(elem) {
        var cssClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var cur = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        if (cssClass) {
            var current = cur || this.getCurrent(elem);
            if (!current) {
                elem.setAttribute('class', cssClass);
                return;
            }
            var oldFixed = this.remove(elem, cssClass, cur, false);
            elem.setAttribute('class', oldFixed + ' ' + cssClass);
        }
    },
    remove: function remove(elem) {
        var cssClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var cur = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var set = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        var current = cur || this.getCurrent(elem);
        if (cssClass && current) {
            //rex = new RegExp( cssClass ,'g');
            var newCssClass = current.replace(new RegExp(cssClass, 'gim'), '');
            if (set) {
                elem.setAttribute('class', newCssClass.trim());
            } else {
                return newCssClass;
            }
        }
    },
    toggle: function toggle(elem) {
        var cssClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var current = this.getCurrent(elem);
        if (cssClass) {
            if (!current) {
                this.add(elem, cssClass, current);
            } else if (current.indexOf(cssClass) > -1) {
                this.remove(elem, cssClass, current);
            } else {
                this.add(elem, cssClass, current);
            }
        }
    }
};

var calc = exports.calc = {
    innerWidth: innerWidth,
    innerHeight: innerHeight,
    thumbHeight: thumbHeight,
    thumbWidth: thumbWidth,
    thumbPosY: thumbPosY,
    thumbPosX: thumbPosX,
    posY: posY,
    posX: posX,
    axisDelta: axisDelta,
    axisRequired: axisRequired,
    movement: movement
};

var falseNoop = function falseNoop() {
    return false;
};

var noop = function noop() {
    return true;
};

var WindowResizer = exports.WindowResizer = function WindowResizer() {
    var _this4 = this;

    this.resizing = false;
    this.resizeInterval = null;
    this.innerWidthWin = null;
    this.innerHeightWin = null;
    this.instances = [];
    this.evt = null;

    this.setAsListener = function () {
        window.addEventListener('resize', _this4.onResize, { capture: true, passive: true });
    };

    this.removeAsListener = function () {
        window.removeEventListener('resize', _this4.onResize, { capture: true, passive: true });
    };

    this.addInstance = function () {
        var inst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        if (!inst) return;
        if (_this4.instances.length === 0) {
            _this4.setAsListener();
        }
        _this4.instances.push({
            instance: inst,
            callback: callback
        });
    };

    this.removeInstance = function (instance) {
        _this4.instances.filter(function (obj) {
            return instance !== obj;
        });
        if (_this4.instances.length === 0) {
            _this4.removeAsListener();
        }
    };

    this.onResize = function (eventReceived) {
        _this4.evt = eventReceived;
        _this4.detectResizing();
    };

    this.onResizeEnd = function () {
        _this4.instances.forEach(_this4.performCallback);
        _this4.evt = null;
    };

    this.performCallback = function (obj, index, arr) {
        if (!_this4.evt) return;
        obj.callback(_this4.evt);
    };

    this.detectResizing = function () {
        if (_this4.resizing) return;
        _this4.resizing = true;
        _this4.resizeInterval = setInterval(function () {

            if (_this4.innerWidthWin === _this4.evt.target.innerWidth && _this4.innerHeightWin === _this4.evt.target.innerHeight) {

                clearInterval(_this4.resizeInterval);

                _this4.resizing = false;
                _this4.onResizeEnd();
                return;
            }

            _this4.innerWidthWin = _this4.evt.target.innerWidth;
            _this4.innerHeightWin = _this4.evt.target.innerHeight;
        }, 350);
    };
};

var utils = exports.utils = {
    falseNoop: falseNoop,
    noop: noop,
    DataStorage: SelfStorage,
    StyleInserter: StyleInserter,
    css: cssClassManager,
    WindowResizer: WindowResizer
};