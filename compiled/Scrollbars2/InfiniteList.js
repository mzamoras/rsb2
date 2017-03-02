'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _index = require('../index');

var _infinityUtils = require('./infinityUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clog = console.log;
var InfiniteList = _react2.default.createClass({
    displayName: 'InfiniteList',


    /** C O M P O N E N T   B A S I C S **/
    /** ************************************************* **/

    setOffStateVariables: function setOffStateVariables(givenProps) {
        var items = givenProps.items;
        var offset = givenProps.offset;
        var visibles = givenProps.visibles;


        this.lastScrollTop = null;
        this.sbh = new _infinityUtils.InfiniteScrollHandler(items.length, visibles, 1, offset);
    },
    setComponentVariables: function setComponentVariables() {
        this.ghostStyle = { textAlign: 'right', border: '1px solid green', height: 0 };
    },
    getInitialState: function getInitialState() {
        this.setComponentVariables();
        this.setOffStateVariables(this.props);

        return {
            items: this.props.items,
            initialized: null
        };
    },
    updateMetrics: function updateMetrics() {
        var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var _refs = this.refs;
        var itemsContainer = _refs.itemsContainer;
        var ghostViewTop = _refs.ghostViewTop;
        var ghostViewBottom = _refs.ghostViewBottom;

        this.sbh.setExternalObjects(itemsContainer, ghostViewTop, ghostViewBottom);
        if (update) this.forceUpdate();
    },
    onScrollFrame: function onScrollFrame(_ref) {
        var scrollTop = _ref.scrollTop;
        var direction = _ref.direction;

        //console.log(scrollTop);
        //if( this.lastScrollTop === scrollTop ) return;

        this.lastScrollTop = scrollTop;
        this.sbh.evaluatePosition(scrollTop, direction);
        if (this.sbh.needStateUpdate) {
            this.forceUpdate();
        }

        /*const log = "[%s]Scrolltop: %s | LimitBottom: %s | LimitTop: %s | Height: %s | GhostTopHeight: %s |GhostBottomHeight: %s";
        clog( log , this.sbh.currentChunkIndx ,scrollTop, this.sbh.limitBottom, this.sbh.limitTop,
            this.sbh.itemsContainerHg, this.sbh.ghostTopHg, this.sbh.ghostBottomHg
        );*/
    },
    shouldComponentUpdate: function shouldComponentUpdate() {
        return true;
    },
    componentWillUpdate: function componentWillUpdate(nextProps) {
        if (!(0, _shallowequal2.default)(this.props.items, nextProps.items)) {
            this.setOffStateVariables(nextProps);
        }
    },
    componentDidUpdate: function componentDidUpdate(prevProps) {
        if (this.sbh.needsUpdate) {
            this.sbh.update();
        }
        //console.log( "did items changed?",!shallowEqual(this.props.items, prevProps.items), this.sbh );
        //console.timeEnd('Infinite');
        if (!(0, _shallowequal2.default)(this.props.items, prevProps.items)) {
            this.lastScrollTop = null;
            this.updateMetrics();
            //console.log("%cItems Changed!!", "font-size:14px;font-weight:bold;",this.sbh);
        }
    },


    /*componentWillUpdate(nextProps){
     },*/

    componentDidMount: function componentDidMount() {
        this.updateMetricsDebounced = (0, _infinityUtils.debounce)(this.updateMetrics, 1);
        this.updateMetricsDebounced();
    },


    /** R E N D E R S **/
    /** ************************************************* **/
    render: function render() {
        var _this = this;

        this.sbh.reportRendering();
        var _sbh = this.sbh;
        var init = _sbh.init;
        var end = _sbh.end;


        var visibleItems = this.props.items.slice(init, end).map(function (obj, index) {
            return _this.props.renderFunc(obj, index);
        });
        console.log("SHOWING FROM %s to %s out of %s", init, end, visibleItems.length);
        return _react2.default.createElement(
            _index.Scrollbars2,
            { onScrollFrame: this.onScrollFrame, thumbMinSize: 30 },
            _react2.default.createElement('div', { className: 'ghostViewTop', ref: 'ghostViewTop', style: _extends({}, this.ghostStyle) }),
            _react2.default.createElement(
                'div',
                { ref: 'itemsContainer', style: _extends({}, this.props.style, { position: 'relative' }),
                    className: this.props.className },
                visibleItems
            ),
            _react2.default.createElement('div', { className: 'ghostViewBottom', ref: 'ghostViewBottom', style: _extends({}, this.ghostStyle) })
        );
    }
});

InfiniteList.defaultProps = {};
InfiniteList.propTypes = {
    items: _react2.default.PropTypes.any,
    visibles: _react2.default.PropTypes.number,
    offset: _react2.default.PropTypes.number,
    renderFunc: _react2.default.PropTypes.func
};

exports.default = InfiniteList;