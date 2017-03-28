'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _index = require('../index');

var _reactAutobindHelper = require('react-autobind-helper');

var _reactAutobindHelper2 = _interopRequireDefault(_reactAutobindHelper);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //noinspection JSUnresolvedVariable


var emptyArray = [];

var InfiniteList = function (_Component) {
    _inherits(InfiniteList, _Component);

    function InfiniteList(props) {
        _classCallCheck(this, InfiniteList);

        var _this = _possibleConstructorReturn(this, (InfiniteList.__proto__ || Object.getPrototypeOf(InfiniteList)).call(this, props));

        (0, _reactAutobindHelper2.default)(_this);

        _this.state = { currentPage: 0 };

        //Pages Info
        _this.pData = new _immutable.List();
        _this.pTotal = 0;
        _this.pLeftOvers = 0;
        _this.pRefs = {};

        //Heights
        _this.hGhost = 0;
        _this.hItems = 0;

        //Flags
        _this.isIterable = false;
        _this.isListening = false;

        _this.resetPagesObject(props);
        return _this;
    }

    /** C A L C U L A T I O N S **/
    /** ************************************************* **/

    _createClass(InfiniteList, [{
        key: 'resetPagesObject',
        value: function resetPagesObject(props) {
            var _this2 = this;

            //Flags
            this.isListening = false;
            this.isIterable = _immutable.Iterable.isIterable(props.items);

            var length = this.isIterable ? props.items.size : props.items.length;
            var baseHeight = length <= props.visibles ? 0 : props.defaultRowHeight * length;

            //Pages Info
            this.pTotal = Math.ceil(length / props.visibles);
            this.pLeftOvers = length % props.visibles;
            this.pData = new _immutable.List().setSize(this.pTotal).map(function (x, y) {
                return _this2.createPagesObject(y, props);
            });

            //Heights
            this.hGhost = baseHeight;
            this.hItems = baseHeight;
        }
    }, {
        key: 'createPagesObject',
        value: function createPagesObject(page, props) {
            var visibles = props.visibles,
                defaultRowHeight = props.defaultRowHeight;


            var length = this.isIterable ? props.items.size : props.items.length;
            var isLast = page === this.pTotal - 1;
            var from = page * visibles;
            var to = Math.min(from + visibles, length);
            var estimatedHeight = visibles * defaultRowHeight;
            var height = isLast && this.pLeftOvers > 0 ? this.pLeftOvers * defaultRowHeight : estimatedHeight;

            return {
                page: page, from: from, to: to, height: height,
                key: 'Page' + page,
                cssClass: 'infinityPage page' + page,
                limitTop: -1,
                limitBottom: 1000000000 * 100000000,
                initialized: false,
                itemsPerPage: visibles
            };
        }
    }, {
        key: 'calculateLimits',
        value: function calculateLimits() {
            var currentPage = this.state.currentPage;

            var currentPageData = this.pData.get(currentPage);

            if (!currentPageData) {
                return;
            }

            var itemsContainerRef = this.refs.itemsContainerRef;

            var currentPageDomObj = this.pRefs['Page' + currentPage];
            var isInitialized = currentPageData.initialized === true;

            if (currentPageData && currentPageDomObj && !isInitialized) {
                var offsetHeight = currentPageDomObj.offsetHeight,
                    offsetTop = currentPageDomObj.offsetTop;


                this.hItems = itemsContainerRef.offsetHeight;
                this.hGhost = this.pData.reduce(function (acc, obj) {
                    return acc + obj.height;
                }, 0);
                this.pData = this.pData.update(currentPage, function (val) {
                    return _extends({}, val, {
                        height: offsetHeight,
                        limitTop: offsetTop,
                        limitBottom: offsetTop + offsetHeight,
                        initialized: true
                    });
                });
                this.enableScrollListening();
            }
        }
    }, {
        key: 'enableScrollListening',
        value: function enableScrollListening() {
            this.isListening = true;
        }
    }, {
        key: 'disableScrollListening',
        value: function disableScrollListening() {
            this.isListening = false;
        }

        /** E V E N T S **/
        /** ************************************************* **/

    }, {
        key: 'onScrollFrame',
        value: function onScrollFrame(_ref) {
            var scrollTop = _ref.scrollTop,
                direction = _ref.direction,
                clientHeight = _ref.clientHeight,
                realMovY = _ref.realMovY;


            if (!this.isListening || !this.pData.get(this.state.currentPage)) return;

            var currentPage = this.state.currentPage;
            var pData = this.pData;
            var _props = this.props,
                defaultRowHeight = _props.defaultRowHeight,
                visibles = _props.visibles;

            var _pData$get = pData.get(currentPage),
                limitTop = _pData$get.limitTop,
                limitBottom = _pData$get.limitBottom,
                height = _pData$get.height;

            var fixedScrollTop = scrollTop + clientHeight;
            var nextPage = currentPage + 1;
            var prevPage = currentPage - 1;
            var isDown = direction === 'down';
            var isUp = direction === 'up';
            var isBigMove = Math.abs(realMovY) > height;

            //When Scroll moves big distances
            if (isBigMove) {
                var midList = pData.size / 2;
                var tgtPageCalc = fixedScrollTop / defaultRowHeight / visibles;
                var tgtPage = tgtPageCalc > midList ? Math.round(tgtPageCalc) : Math.floor(tgtPageCalc);

                this.disableScrollListening();
                this.setState({ currentPage: tgtPage }, this.enableScrollListening);
                return;
            }

            if (fixedScrollTop > limitBottom + 1 && isDown && nextPage < pData.size) {
                this.disableScrollListening();
                this.setState({ currentPage: nextPage }, this.enableScrollListening);
            }

            if (fixedScrollTop < limitTop - 1 && isUp && prevPage >= 0) {
                this.disableScrollListening();
                this.setState({ currentPage: prevPage }, this.enableScrollListening);
            }
        }

        /** L I F E C Y C L E **/
        /** ************************************************* **/

    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps) {
            var _this3 = this;

            //When the number of items has changed
            if (!(0, _shallowequal2.default)(this.props.items, nextProps.items)) {
                var scrollbarsRef = this.refs.scrollbarsRef;


                this.resetPagesObject(nextProps, false);
                this.disableScrollListening();

                this.setState({ currentPage: 0 }, function () {
                    if (!scrollbarsRef || !scrollbarsRef.api) return;
                    scrollbarsRef.update();
                    scrollbarsRef.api.toTop();
                    _this3.enableScrollListening();
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.calculateLimits();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.calculateLimits();
        }

        /** R E N D E R **/
        /** ************************************************* **/

    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var currentPage = this.state.currentPage;


            return _react2.default.createElement(
                _index.Scrollbars2,
                { onScrollFrame: this.onScrollFrame, thumbMinSize: 30, ref: 'scrollbarsRef' },
                _react2.default.createElement(
                    'div',
                    { className: 'items', ref: 'itemsContainerRef', style: { position: 'absolute', width: '100%' } },
                    this.pData.map(function (object) {
                        var page = object.page,
                            from = object.from,
                            to = object.to;


                        var isRenderable = page >= currentPage - 1 && page <= currentPage + 1;
                        var _loopItems = isRenderable ? _this4.props.items.slice(from, to) : emptyArray;
                        var loopItems = _this4.isIterable && isRenderable ? _loopItems.entrySeq() : _loopItems;

                        return _react2.default.createElement(PageInfiniteList, {
                            key: object.key,
                            ref: _this4.getPageRef,
                            pageData: object,
                            pageItems: loopItems,
                            renderFunc: _this4.props.renderFunc,
                            isRenderable: isRenderable,
                            isIterable: _this4.isIterable
                        });
                    })
                ),
                _react2.default.createElement('div', { ref: 'ghost', className: 'ghost',
                    style: { height: Math.min(this.hItems, this.hGhost) } })
            );
        }
    }, {
        key: 'getPageRef',
        value: function getPageRef(obj) {
            if (obj) this.pRefs[obj.pageKey] = obj.refs['page'];
        }
    }]);

    return InfiniteList;
}(_react.Component);

InfiniteList.propTypes = {
    items: _react.PropTypes.any.isRequired,
    visibles: _react.PropTypes.number,
    offset: _react.PropTypes.number,
    renderFunc: _react.PropTypes.func.isRequired,
    defaultRowHeight: _react.PropTypes.number.isRequired,
    totalItems: _react.PropTypes.number.isRequired
};

var PageInfiniteList = function (_Component2) {
    _inherits(PageInfiniteList, _Component2);

    function PageInfiniteList(props) {
        _classCallCheck(this, PageInfiniteList);

        var _this5 = _possibleConstructorReturn(this, (PageInfiniteList.__proto__ || Object.getPrototypeOf(PageInfiniteList)).call(this, props));

        _this5.normalClass = props.pageData.cssClass;
        _this5.renderClass = props.pageData.cssClass + " renderable";
        _this5.emptyStyle = {};
        _this5.pageKey = props.pageData.key;
        return _this5;
    }

    _createClass(PageInfiniteList, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return !(0, _shallowequal2.default)(nextProps, this.props);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var _props2 = this.props,
                pageData = _props2.pageData,
                pageItems = _props2.pageItems,
                isRenderable = _props2.isRenderable,
                isIterable = _props2.isIterable;

            var pageStyle = isRenderable ? this.emptyStyle : { height: pageData.height };

            return _react2.default.createElement(
                'div',
                { ref: 'page', className: isRenderable ? this.renderClass : this.normalClass, style: pageStyle },
                isRenderable && pageItems.map(function (x, y) {

                    var object = isIterable ? x[1] : x;
                    var index = isIterable ? x[0] : y;
                    var indx = y + _this6.props.pageData.page * _this6.props.pageData.itemsPerPage;

                    return _react2.default.createElement(
                        'div',
                        { className: 'itemWrapper itemWrapper' + index, key: 'item_' + index },
                        isRenderable && _this6.props.renderFunc(object, index, indx)
                    );
                })
            );
        }
    }]);

    return PageInfiniteList;
}(_react.Component);

PageInfiniteList.propTypes = {
    pageData: _react.PropTypes.any,
    pageItems: _react.PropTypes.any,
    renderFunc: _react.PropTypes.func,
    isRenderable: _react.PropTypes.bool,
    isIterable: _react.PropTypes.bool
};
exports.default = InfiniteList;