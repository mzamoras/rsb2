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


var InfiniteList = function (_Component) {
    _inherits(InfiniteList, _Component);

    function InfiniteList(props) {
        _classCallCheck(this, InfiniteList);

        var _this = _possibleConstructorReturn(this, (InfiniteList.__proto__ || Object.getPrototypeOf(InfiniteList)).call(this, props));

        (0, _reactAutobindHelper2.default)(_this);

        _this.listenScroll = false;
        console.log(props.items);
        _this.state = _extends({}, _this.resetPagesObject(props));
        return _this;
    }

    /** C A L C U L A T I O N S **/
    /** ************************************************* **/

    _createClass(InfiniteList, [{
        key: 'resetPagesObject',
        value: function resetPagesObject(props) {
            var _this2 = this;

            this.listenScroll = false;
            var length = _immutable.Iterable.isIterable(props.items) ? props.items.size : props.items.length;
            this.totalPages = Math.ceil(length / props.visibles);
            this.leftOvers = length % props.visibles;

            return {
                pagesData: new _immutable.List().setSize(this.totalPages).map(function (x, y) {
                    return _this2.createPagesObject(y, props);
                }),
                currentPage: 0,
                ghostHeightExpected: props.defaultRowHeight * length,
                ghostHeight: props.defaultRowHeight * length,
                itemsHeight: props.defaultRowHeight * length
            };
        }
    }, {
        key: 'createPagesObject',
        value: function createPagesObject(page, props) {
            var visibles = props.visibles,
                defaultRowHeight = props.defaultRowHeight;


            var length = _immutable.Iterable.isIterable(props.items) ? props.items.size : props.items.length;
            var isLast = page === this.totalPages - 1;
            var from = page * visibles;
            var to = Math.min(from + visibles, length);
            var estimatedHeight = visibles * defaultRowHeight;
            var height = isLast && this.leftOvers > 0 ? this.leftOvers * defaultRowHeight : estimatedHeight;

            return {
                page: page, from: from, to: to, height: height,
                key: 'Page' + page,
                cssClass: 'infinityPage page' + page,
                limitTop: -1,
                limitBottom: 1000000000 * 100000000,
                initialized: false
            };
        }
    }, {
        key: 'calculateLimits',
        value: function calculateLimits() {
            var _state = this.state,
                currentPage = _state.currentPage,
                pagesData = _state.pagesData;
            var itemsContainerRef = this.refs.itemsContainerRef;

            var currentPageData = pagesData.get(currentPage);
            var currentPageDomObj = this.refs['Page' + currentPage];

            if (currentPageData && currentPageDomObj && currentPageData.initialized === false) {
                var offsetHeight = currentPageDomObj.offsetHeight,
                    offsetTop = currentPageDomObj.offsetTop;


                var ghostHeight = pagesData.reduce(function (acc, obj) {
                    return acc + obj.height;
                }, 0);

                this.setState({
                    ghostHeight: ghostHeight,
                    pagesData: pagesData.update(currentPage, function (val) {
                        return _extends({}, val, {
                            height: offsetHeight,
                            limitTop: offsetTop,
                            limitBottom: offsetTop + offsetHeight,
                            initialized: true
                        });
                    }),
                    itemsHeight: itemsContainerRef.offsetHeight
                }, this.enableScrollListening);
            }
        }
    }, {
        key: 'enableScrollListening',
        value: function enableScrollListening() {
            this.listenScroll = true;
        }
    }, {
        key: 'disableScrollListening',
        value: function disableScrollListening() {
            this.listenScroll = false;
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


            if (!this.listenScroll || !this.state.pagesData.get(this.state.currentPage)) return;

            var _state2 = this.state,
                currentPage = _state2.currentPage,
                pagesData = _state2.pagesData;
            var _props = this.props,
                defaultRowHeight = _props.defaultRowHeight,
                visibles = _props.visibles;

            var _pagesData$get = pagesData.get(currentPage),
                limitTop = _pagesData$get.limitTop,
                limitBottom = _pagesData$get.limitBottom,
                height = _pagesData$get.height;

            var fixedScrollTop = scrollTop + clientHeight;
            var nextPage = currentPage + 1;
            var prevPage = currentPage - 1;
            var isDown = direction === 'down';
            var isUp = direction === 'up';
            var isBigMove = Math.abs(realMovY) > height;

            //When Scroll moves big distances
            if (isBigMove) {
                var midList = pagesData.size / 2;
                var tgtPageCalc = fixedScrollTop / defaultRowHeight / visibles;
                var tgtPage = tgtPageCalc > midList ? Math.round(tgtPageCalc) : Math.floor(tgtPageCalc);

                this.disableScrollListening();
                this.setState({ currentPage: tgtPage }, this.enableScrollListening);
                return;
            }

            if (fixedScrollTop > limitBottom + 1 && isDown && nextPage < pagesData.size) {
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

                var recalculatedState = this.resetPagesObject(nextProps, false);

                this.disableScrollListening();

                this.setState(_extends({}, recalculatedState, { currentPage: 0 }), function () {
                    if (!scrollbarsRef) return;
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

        /** R E N D E R S **/
        /** ************************************************* **/

    }, {
        key: 'renderItems',
        value: function renderItems(slicedItems) {
            if (_immutable.Iterable.isIterable(this.props.items)) {
                return slicedItems.entrySeq().map(this.renderItemsSimple);
            }
            return slicedItems.map(this.renderItemsSimple);
        }
    }, {
        key: 'renderItemsSimple',
        value: function renderItemsSimple(x, y) {
            var isIterable = _immutable.Iterable.isIterable(this.props.items);
            var object = isIterable ? x[1] : x;
            var index = isIterable ? x[0] : y;

            return _react2.default.createElement(
                'div',
                { className: 'itemWrapper itemWrapper' + index, key: 'item_' + index },
                this.props.renderFunc(object, index)
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _state3 = this.state,
                currentPage = _state3.currentPage,
                pagesData = _state3.pagesData,
                itemsHeight = _state3.itemsHeight,
                ghostHeight = _state3.ghostHeight;


            return _react2.default.createElement(
                _index.Scrollbars2,
                { onScrollFrame: this.onScrollFrame, thumbMinSize: 30, ref: 'scrollbarsRef' },
                _react2.default.createElement(
                    'div',
                    { className: 'items', ref: 'itemsContainerRef', style: { position: 'absolute', width: '100%' } },
                    pagesData.map(function (object) {
                        var page = object.page,
                            from = object.from,
                            to = object.to,
                            key = object.key,
                            cssClass = object.cssClass,
                            height = object.height;


                        var isRenderable = page >= currentPage - 1 && page <= currentPage + 1;
                        var pageStyle = isRenderable ? {} : { height: height };
                        var pageItems = isRenderable ? _this4.props.items.slice(from, to) : null;
                        var className = cssClass + (isRenderable ? " renderable" : "");

                        return _react2.default.createElement(
                            'div',
                            { key: key, ref: key, className: className, style: pageStyle },
                            isRenderable ? _this4.renderItems(pageItems) : pageItems
                        );
                    })
                ),
                _react2.default.createElement('div', { ref: 'ghost', className: 'ghost',
                    style: { height: Math.min(itemsHeight, ghostHeight) } })
            );
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
exports.default = InfiniteList;