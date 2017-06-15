
import browser from 'bowser';

window._sbwDetected = window._sbwDetected || false;
window._sbwSize     = window._sbwSize || 0;

const def = {
    mac   : 0,
    win   : 17,
    msedge: 12
};

export const getScrollbarWidth = function (force = null) {
    
    //already detected and no force required
    if ( window._sbwDetected && !force ) {
        return window._sbwSize;
    }
    //Do the calculation
    let tmpSbw = calculate();
    
    //If we get a zero, then try to use default widths
    if ( tmpSbw === 0 ) {
        if ( browser[ 'mac' ] ) {
            tmpSbw = def.mac;
        }
        else if ( browser[ 'msedge' ] ) {
            tmpSbw = def.msedge;
        }
        else if ( browser[ 'msie' ] ) {
            tmpSbw = def.win;
        }
    }
    //Mark as calculated and store the size
    window._sbwDetected = true;
    window._sbwSize     = tmpSbw;
    
    return tmpSbw;
};

function calculate() {
    let div1, div2, sbw;
    
    div1 = document.createElement( 'div' );
    div2 = document.createElement( 'div' );
    
    div1.style.width = div2.style.width = div1.style.height = div2.style.height = '100px';
    div1.style.overflow = 'scroll';
    div2.style.overflow = 'hidden';
    
    document.body.appendChild( div1 );
    document.body.appendChild( div2 );
    
    sbw = Math.abs( div1.scrollHeight - div2.scrollHeight );
    
    document.body.removeChild( div1 );
    document.body.removeChild( div2 );
    return sbw;
}


export default getScrollbarWidth;