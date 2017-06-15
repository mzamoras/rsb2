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
const innerWidth  = function (elem) {
    const computedSt = getComputedStyle( elem );
    const { clientWidth } = elem;
    const { paddingLeft, paddingRight } = computedSt;
    const { borderLeftWidth, borderRightWidth } = computedSt;
    return clientWidth - parseFloat( paddingLeft ) - parseFloat( paddingRight ) - parseFloat( borderLeftWidth ) - parseFloat( borderRightWidth );
};
const innerHeight = function (elem) {
    const computedSt = getComputedStyle( elem );
    const { clientHeight } = elem;
    const { paddingTop, paddingBottom } = computedSt;
    const { borderBottomWidth, borderTopWidth } = computedSt;
    return clientHeight - parseFloat( paddingTop ) - parseFloat( paddingBottom ) - parseFloat( borderTopWidth ) - parseFloat( borderBottomWidth );
};


/* T H U M B   S I Z E */
const thumbHeight = function (elem, trackHeight, minSize) {
    const calculated = Math.round( (elem.clientHeight / elem.scrollHeight * trackHeight) * 100 ) / 100;
    const result     = Math.max( calculated, minSize );
    return result === trackHeight ? 0 : result;
};
const thumbWidth  = function (elem, trackWidth, minSize) {
    const calculated = Math.round( (elem.clientWidth / elem.scrollWidth * trackWidth) * 100 ) / 100;
    const result     = Math.max( calculated, minSize );
    return result === trackWidth ? 0 : result;
};

/* T H U M B   P O S I T I O N */
const thumbPosY = function (elem, trackHeight, thumbSize) {
    return elem.scrollTop / (elem.scrollHeight - elem.clientHeight) * (trackHeight - thumbSize);
};
const thumbPosX = function (elem, trackWidth, thumbSize) {
    return elem.scrollLeft / (elem.scrollWidth - elem.clientWidth) * (trackWidth - thumbSize);
};

/* C O N T E N T   P O S I T I O N */
const posY = function (event, dataSource) {
    const { target, clientY } = event;
    const { top: targetTop } = target.getBoundingClientRect();
    const { scrollHeight, clientHeight, thumbHeight, trackHeight } = dataSource;

    const offset = Math.abs( targetTop - clientY ) - thumbHeight / 2;
    return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
};

const posX = function (event, dataSource) {
    const { target, clientX } = event;
    const { left: targetLeft } = target.getBoundingClientRect();
    const { scrollWidth, clientWidth, thumbWidth, trackWidth } = dataSource;

    const offset = Math.abs( targetLeft - clientX ) - thumbWidth / 2;
    return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
};


/* S C R O L L I N G   A X I S   D A T A */
const VER  = 'vertical';
const HOR  = 'horizontal';
const NONE = 'none';

const axisDelta = function (dx, dy) {
    const absX = Math.abs( dx || 0 );
    const absY = Math.abs( dy || 0 );

    return Math.max( absX, absY ) === absY ? VER : HOR;
};

const axisRequired = function (requireHorizontal, requireVertical) {
    return requireVertical ? VER : requireHorizontal ? HOR : NONE;
};

/* S C R O L L I N G   M O V E M E N T   D I R E C T I O N   D A T A */
const DOWN  = 'down';
const UP    = 'up';
const LEFT  = 'left';
const RIGHT = 'right';

const movement = function (actual, past) {
    const movX = actual.scrollLeft - past.scrollLeft;
    const movY = actual.scrollTop - past.scrollTop;
    let dir, dirX, dirY;

    dirX = movX > 0 ? RIGHT : movX < 0 ? LEFT : NONE;
    dirY = movY > 0 ? DOWN : movY < 0 ? UP : NONE;
    dir  = dirX !== NONE ? HOR : dirY !== NONE ? VER : NONE;

    return {
        direction : dir,
        directionX: dirX,
        directionY: dirY,
        changeX   : movX,
        changeY   : movY
    };
};


/* S T Y L E S H E E T    C R E A T E   A N D   I N S E R T */
function StyleInserter(styleID, namespace = null, useDirectInsert = false) {

    this.conf = {
        id          : styleID.toLowerCase(),
        obj         : null,
        cssParsed   : null,
        cssRaw      : null,
        namespace   : namespace,
        directInsert: useDirectInsert,
        original    : null
    };

    this.getObject = ()=> {
        return this.conf.obj;
    };

    this.rex = {
        placeholder: /classNamePlaceholder/gm,
        ruleFinder : /([#.a-z]?[a-z_][\s\S]+?{[\s\S]*?})/gmi
    };

    this.markers = {
        tagIsOwn: false,
        fromFile: false
    };

    this.rules = [];


    const parseRawCss = function () {
        this.conf.cssParsed = this.conf.cssRaw.replace( this.rex.placeholder, this.conf.namespace );
    }.bind( this );

    const insertRules = function (rulesArray) {
        rulesArray.forEach( (value, index) => {
            this.rules.push( value );
            //noinspection JSUnresolvedVariable
            this.conf.obj.sheet.insertRule( value, index );
        } );
    }.bind( this );

    const createDomNode = function () {
        const node = document.createElement( 'style' );
        node.setAttribute( 'id', this.conf.id );
        document.head.appendChild( node );

        this.markers.tagIsOwn = true;

        return node;
    }.bind( this );

    this.setNameSpace = function (namespace) {
        this.conf.namespace = namespace.toLowerCase();
    };

    this.setRules = function (rules = null, forceNew = false) {

        if ( !this.markers.tagIsOwn && !forceNew ) {
            return;
        }
        else if ( !this.markers.tagIsOwn && forceNew ) {
            this.cleanUp( true );
        }

        if ( !this.conf.obj ) {
            this.init();
        }

        if ( !this.conf.cssParsed || ( forceNew && !this.markers.fromFile ) ) {
            this.conf.cssRaw = rules;
            parseRawCss();
        }

        if ( !this.conf.directInsert ) {
            insertRules( this.conf.cssParsed.match( this.rex.ruleFinder ) );
        }
        else {
            this.conf.original      = this.conf.obj.innerHTML;
            this.conf.obj.innerHTML = this.conf.cssParsed;
        }
    };

    this.setRulesFromParsed = function( fileParsed, custom ){

        if ( !this.conf.cssRaw || custom) {
            this.conf.cssRaw = fileParsed;
            parseRawCss();
        }
        this.markers.fromFile = true;
        this.setRules( null, custom );
    };

    this.setRulesFromFile = function (fileParsed, forceReadFile = false) {
        if ( !this.conf.cssRaw ) {
            //this.conf.cssRaw = require( '../xx/' + filePath );
            //this.conf.cssRaw = require( 'to-string!css!less!../../style.tpl.less' );
            this.conf.cssRaw = fileParsed;//require( 'to-string!css!less!../../style.tpl.less' );
            parseRawCss();
        }
        this.markers.fromFile = true;
        this.setRules( null, forceReadFile );
    };

    this.cleanUp = function (force = false) {
        if ( !this.markers.tagIsOwn || !force ) {
            return;
        }
        if ( !this.conf.directInsert ) {
            this.rules.forEach( (value, index) => {
                //noinspection JSUnresolvedVariable
                this.conf.obj.sheet.deleteRule( index );
            } );
            this.rules = [];
        }
        else {
            this.conf.obj.innerHTML = this.conf.original;
        }
        this.document.head.removeChild( this.conf.obj );
        this.conf.obj = null;
    };

    const init = function () {
        this.setNameSpace( this.conf.namespace || this.conf.id );
        this.conf.obj = document.getElementById( this.conf.id ) || createDomNode();
    }.bind( this );

    init();
}


function SelfStorage(init = {}) {

    this.data = init;

    this.save  = function saveData(keyOrObject, value = null) {
        if ( typeof  keyOrObject === 'object' ) {
            this.data = { ...this.data, ...keyOrObject };
        }
        else if ( value ) {
            this.data[ keyOrObject ] = value;
        }
    };
    this.reset = function resetData(dataToResetWith) {
        this.data = {};
        this.save( dataToResetWith );
    };
    this.get   = function getData(keyOrKeys = null) {
        if ( !keyOrKeys ) {
            return this.data;
        }
        if ( typeof  keyOrKeys === 'string' ) {
            return this.data[ keyOrKeys ];
        }
    };
}

export const cssClassManager = {

    getCurrent(elem){
        return elem.getAttribute( 'class' ) || null;
    },

    add(elem, cssClass = null, cur = null){
        if ( cssClass ) {
            const current = cur || this.getCurrent( elem );
            if ( !current ) {
                elem.setAttribute( 'class', cssClass );
                return;
            }
            const oldFixed = this.remove( elem, cssClass, cur, false );
            elem.setAttribute( 'class', oldFixed + ' ' + cssClass );
        }
    },

    remove(elem, cssClass = null, cur = null, set = true){
        const current = cur || this.getCurrent( elem );
        if ( cssClass && current ) {
            //rex = new RegExp( cssClass ,'g');
            const newCssClass = current.replace( new RegExp( cssClass, 'gim' ), '' );
            if ( set ) {
                elem.setAttribute( 'class', newCssClass.trim() );
            }
            else {
                return newCssClass;
            }

        }
    },

    toggle(elem, cssClass = null){
        const current = this.getCurrent( elem );
        if ( cssClass ) {
            if ( !current ) {
                this.add( elem, cssClass, current );
            }
            else if ( current.indexOf( cssClass ) > -1 ) {
                this.remove( elem, cssClass, current );
            }
            else {
                this.add( elem, cssClass, current );
            }
        }
    }
};

export const calc = {
    innerWidth,
    innerHeight,
    thumbHeight,
    thumbWidth,
    thumbPosY,
    thumbPosX,
    posY,
    posX,
    axisDelta,
    axisRequired,
    movement
};

const falseNoop = function() {
    return false
};

const noop = function() {
    return true
};


export const WindowResizer = function() {

        this.resizing       = false;
        this.resizeInterval = null;
        this.innerWidthWin  = null;
        this.innerHeightWin = null;
        this.instances      = [];
        this.evt            = null;

        this.setAsListener = ()=>{
            window.addEventListener('resize', this.onResize, {capture:true, passive:true});
        };

        this.removeAsListener = () =>{
            window.removeEventListener('resize', this.onResize, {capture:true, passive:true});
        };

        this.addInstance = ( inst = null, callback = noop )=>{
            if( !inst ) return;
            if( this.instances.length === 0){
                this.setAsListener();
            }
            this.instances.push({
                instance: inst,
                callback: callback
            });
        };

        this.removeInstance = ( instance ) =>{
            this.instances.filter( obj => instance !== obj);
            if( this.instances.length === 0){
                this.removeAsListener();
            }
        };

        this.onResize = eventReceived =>{
            this.evt = eventReceived;
            this.detectResizing();
        };

        this.onResizeEnd = () =>{
            this.instances.forEach( this.performCallback );
            this.evt = null;
        };

        this.performCallback = ( obj, index, arr )=>{
            if( !this.evt ) return;
            obj.callback( this.evt );
        };

        this.detectResizing = () =>{
            if( this.resizing ) return;
            this.resizing = true;
            this.resizeInterval = setInterval( () => {

                if( this.innerWidthWin  === this.evt.target.innerWidth &&
                    this.innerHeightWin === this.evt.target.innerHeight){

                    clearInterval( this.resizeInterval );

                    this.resizing = false;
                    this.onResizeEnd();
                    return;
                }

                this.innerWidthWin  = this.evt.target.innerWidth;
                this.innerHeightWin = this.evt.target.innerHeight;
            }, 350);
        };
};




export const utils = {
    falseNoop,
    noop,
    DataStorage  : SelfStorage,
    StyleInserter: StyleInserter,
    css          : cssClassManager,
    WindowResizer
};
