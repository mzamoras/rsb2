'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getScrollbarWidth = undefined;

var _bowser = require('bowser');

var _bowser2 = _interopRequireDefault(_bowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window._sbwDetected = window._sbwDetected || false;
window._sbwSize = window._sbwSize || 0;

var def = {
    mac: 0,
    win: 17,
    msedge: 12
};

var getScrollbarWidth = exports.getScrollbarWidth = function getScrollbarWidth() {
    var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


    //already detected and no force required
    if (window._sbwDetected && !force) {
        return window._sbwSize;
    }
    //Do the calculation
    var tmpSbw = calculate();

    //If we get a zero, then try to use default widths
    if (tmpSbw === 0) {
        if (_bowser2.default['mac']) {
            tmpSbw = def.mac;
        } else if (_bowser2.default['msedge']) {
            tmpSbw = def.msedge;
        } else if (_bowser2.default['msie']) {
            tmpSbw = def.win;
        }
    }
    //Mark as calculated and store the size
    window._sbwDetected = true;
    window._sbwSize = tmpSbw;

    return tmpSbw;
};

function calculate() {
    var div1 = void 0,
        div2 = void 0,
        sbw = void 0;

    div1 = document.createElement('div');
    div2 = document.createElement('div');

    div1.style.width = div2.style.width = div1.style.height = div2.style.height = '100px';
    div1.style.overflow = 'scroll';
    div2.style.overflow = 'hidden';

    document.body.appendChild(div1);
    document.body.appendChild(div2);

    sbw = Math.abs(div1.scrollHeight - div2.scrollHeight);

    document.body.removeChild(div1);
    document.body.removeChild(div2);
    return sbw;
}

exports.default = getScrollbarWidth;