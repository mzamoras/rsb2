/*
 *
 *  File: utilities.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   23 Nov, 2016 | 08:41 AM
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



const lStyle = function ( color = 'black', size = '14', weight = 'bold' ) {
    return `color:${color};font-size:${size}px;font-weight:${weight};`;
};
const clog   = function ( label, color = 'black', ...params ) {
    console.warn( `%c${label}`, lStyle( color ), ...params );
};

export class InfiniteScrollHandler {

    constructor( totalItems = 0, visibleItems = 0, columns = 0, offset = 0 ) {

        //Records Data
        this.totalItems   = totalItems;
        this.visibleItems = visibleItems;
        this.columns      = columns;
        this.offset       = offset;

        //Updating Status
        this.updating        = false;
        this.needStateUpdate = false;
        this.needLimitUpdate = null;
        this.needsUpdate     = false;

        //CHUNKS
        this.chunks           = [];
        this.chunksSize       = 0;
        this.prevChunkIndx    = 0;
        this.currentChunkIndx = 0;
        this.currentChunkObj  = null;
        this.calculateChunks();

        //DOM MAIN OBJECTS
        this.ghostTopEl       = null;
        this.ghostBottomEl    = null;
        this.itemsContainerEl = null;
        this.bodyEl           = null;
        this.viewportEl       = null;

        // REFERENCE HEIGHTS
        this.ghostTopHg       = null;
        this.ghostBottomHg    = null;
        this.itemsContainerHg = null;
        this.bodyHg           = null;
        this.viewportHg       = null;

        this.chunckItemHg = null;
        this.baseChunkHg  = null;
        this.allChunksHg  = null;

        //DYNAMIC HEIGHTS
        this._itemsContainerHg = null;
        this._ghostTopHg       = null;
        this._ghostBottomHg    = null;

        // EXPOSED INFO
        this.limitTop     = null;
        this.limitBottom  = null;
        this.init         = this.currentChunkObj.offsetInit;
        this.end          = this.currentChunkObj.offsetEnd;
        this.isFirstChunk = this.currentChunkObj.isFirst;
        this.isLastChunk  = this.currentChunkObj.isLast;

        this.hugeJump    = false;
        this.hugeJumpDir = false;
        this.hugeJumpBtm = false;

    }

    /** S E T T E R S  A N D   G E T T E R S **/
    /** ************************************************* **/
    set _itemsContainerHg( hg ) {
        if ( !this.itemsContainerEl ) return;
        this.itemsContainerEl.style.height = (hg ? hg + 'px' : 'auto');
    }

    set _ghostTopHg( hg ) {
        if ( !this.ghostTopEl ) return;
        this.ghostTopEl.style.height = (hg || 0) + 'px';
    }

    set _ghostBottomHg( hg ) {
        if ( !this.ghostBottomEl ) return;
        this.ghostBottomEl.style.height = (hg || 0) + 'px';
    }

    /** ************************************************* **/

    /**
     * I N I T I A L I Z A T I O N
     *
     * Creates chunk objects to store and calculate over each one
     * this are the main objects
     *
     * @param defaultChunkIndex
     */
    calculateChunks( defaultChunkIndex = 0 ) {
        const { totalItems, visibleItems, offset } = this;

        const leftOvers = Math.ceil( totalItems % visibleItems );
        let chunkSize   = leftOvers <= offset ? Math.floor( totalItems / visibleItems ) : Math.ceil( totalItems / visibleItems );
        let index       = 0;
        let newObject   = null;

        while ( index < chunkSize ) {
            newObject = new Chunk( index, chunkSize, totalItems, visibleItems, offset, leftOvers );
            this.chunks.push( newObject );
            index++;
        }

        this.chunksSize      = index;
        this.currentChunkObj = this.chunks[defaultChunkIndex];
    }

    /** R E G I S T E R I N G  E X T E R N A L   O B J E C T S **/
    /** ************************************************* **/
    setExternalObjects( dom_container, dom_ghostTop, dom_ghostBottom ) {

        //Stores the references to this elements
        this.itemsContainerEl = dom_container;
        this.ghostTopEl       = dom_ghostTop;
        this.ghostBottomEl    = dom_ghostBottom;
        this.viewportEl       = dom_container.parentElement;
        this.bodyEl           = window.document.body;

        this.setStaticHeightsForExternalObjects();
        this.updateHeightsFromExternalObjects();

        //Sets initial heights for this elements
        this._itemsContainerHg = this.baseChunkHg;
        this._ghostTopHg       = 0;
        this._ghostBottomHg    = this.calculateGhostBottomHeight();

    }

    /**
     * R E A D  A N D  S E T  D O M  V A L U E S
     * Sets the static values to be the base of all calculations
     */
    setStaticHeightsForExternalObjects() {

        //Register the children container to be able to calculate chunk
        this.currentChunkObj._containerEl = this.itemsContainerEl;

        this.bodyHg      = this.bodyEl.offsetHeight;
        this.viewportHg  = this.viewportEl.offsetHeight;
        this.baseChunkHg = this.currentChunkObj.fullHeight;

        this.chunckItemHg = Math.floor( this.baseChunkHg / this.end );
        this.allChunksHg  = this.chunckItemHg * this.totalItems;
    }

    updateHeightsFromExternalObjects() {

        //Register the children container to be able to calculate chunk
        this.currentChunkObj._containerEl = this.itemsContainerEl;

        this.itemsContainerHg = this.currentChunkObj.fullHeight;
        this.ghostTopHg       = this.ghostTopEl.offsetHeight;
        this.ghostBottomHg    = this.ghostBottomEl.offsetHeight;


        this.currentChunkObj.externalObjects = {
            containerEl  : this.itemsContainerEl,
            viewportEl   : this.viewportEl,
            ghostTopEl   : this.ghostTopEl,
            ghostBottomEl: this.ghostBottomEl,

            containerHg  : this.itemsContainerHg,
            viewportHg   : this.viewportHg,
            ghostTopHg   : this.ghostTopHg,
            ghostBottomHg: this.ghostBottomHg,
            allChunksHg  : this.allChunksHg,
        };
    }


    /**
     * P O S T  R E N D E R  R E S I Z I N G  A N D  F I X I N G
     * Calculates GhostBottom
     * When we have topGhost size and items container we could calculate
     * the bottom height to match our original calculation size
     * @returns {number}
     */
    calculateGhostBottomHeight() {
        return this.allChunksHg - (this.itemsContainerEl.offsetHeight + this.ghostTopHg)
    }

    /** U P D A T E S **/
    /** ************************************************* **/

    /**
     * Receives the notification of render in process
     */
    reportRendering() {
        this.updating        = false;
        this.needStateUpdate = false;
    }

    /**
     * Starts the updating process
     */
    update() {
        this.updateHeights();
        this.updateLimits();
    }

    updateHeights( forceReCalculation = false ) {
        if ( this.hugeJump ) {
            const isNext = this.hugeJumpDir === 'next';
            this.updateHeightsFromExternalObjects();
            this.ghostTopHg                  = this.isFirstChunk ? 0 : isNext ? this.hugeJump : this.hugeJump - this.currentChunkObj.offsetHeight;
            this._ghostTopHg                 = this.ghostTopHg;
            this.currentChunkObj._ghostTopHg = this.ghostTopHg;

            this.itemsContainerHg  = this.currentChunkObj.fullHeight;
            this._itemsContainerHg = this.itemsContainerHg;

            if ( isNext ) {
                this.ghostFixingHeight( null, true, 'post' );
                if ( this.isLastChunk && this.hugeJumpBtm ) {
                    const lastViewedElem      = this.itemsContainerEl.children[this.currentChunkObj.offsetDelta - 1];
                    this.viewportEl.scrollTop = this.ghostTopHg + lastViewedElem.offsetTop + lastViewedElem.offsetHeight - this.viewportHg;
                }
            }
            else {
                this.ghostFixingHeight( this.isFirstChunk ? 0 : this.allChunksHg - (this.ghostBottomHg + this.itemsContainerHg), this.isFirstChunk ? null : false );
                this.currentChunkObj._ghostTopHg = this.ghostTopHg;
            }

            this.hugeJump    = false;
            this.hugeJumpDir = false;
            this.hugeJumpBtm = false;

            return;

        }

        this.updateHeightsFromExternalObjects();
        this._itemsContainerHg = this.itemsContainerHg;

        //Going Next
        if ( this.currentChunkIndx > this.prevChunkIndx ) {
            this.ghostFixingHeight( null, true, 'post' );
        }

        //Going Prev
        else if ( this.currentChunkIndx < this.prevChunkIndx ) {
            this.ghostFixingHeight( this.isFirstChunk ? 0 : this.allChunksHg - (this.ghostBottomHg + this.itemsContainerHg), this.isFirstChunk ? null : false );
            this.currentChunkObj._ghostTopHg = this.ghostTopHg;

            //Due to small fixes the viewport should be scrolled to the last element visible
            if ( this.isFirstChunk ) {
                const lastViewedElem      = this.itemsContainerEl.children[this.currentChunkObj.visualEnd - 1];
                this.viewportEl.scrollTop = lastViewedElem.offsetTop;
            }
        }

        this.totals( 'updateHeights3' );

    }

    /**
     * U P D A T E S
     * Updates Top and Bottom Limits to trigger change of chunk
     */
    updateLimits() {
        this.limitTop    = this.currentChunkObj.limitTop;
        this.limitBottom = this.currentChunkObj.limitBottom;
    }

    /**
     * U P D A T E S
     *
     * Updates locally the the information of current chunk
     * to make it available easier
     * @param chunk
     */
    updateChunkDataOnChange( chunk ) {
        this.currentChunkObj = this.chunks[chunk];
        this.init            = this.currentChunkObj.offsetInit;
        this.end             = this.currentChunkObj.offsetEnd;
        this.isLastChunk     = this.currentChunkObj.isLast;
        this.isFirstChunk    = this.currentChunkObj.isFirst;
    }

    /** ************************************************* **/


    /**
     * P R E  R E N D E R  R E S I Z I N G  A N D  F I X I N G
     *
     * @param top
     * @param bottom
     * @param stage
     * @returns {boolean}
     */
    ghostFixingHeight( top = null, bottom = null, stage = 'prev' ) {
        if ( top !== null ) {
            this.ghostTopHg  = top;
            this._ghostTopHg = this.ghostTopHg;
            if ( bottom === null )this.ghostFixingHeight( null, true );
        }
        if ( bottom ) {
            if ( stage === 'post' && this.isLastChunk ) {
                this.ghostBottomHg  = 0;
                this._ghostBottomHg = this.ghostBottomHg;
                return true;
            }
            const tgtBottom     = bottom === true ? this.allChunksHg - (this.itemsContainerHg + this.ghostTopHg) : bottom;
            this.ghostBottomHg  = tgtBottom > 0 ? tgtBottom : 0;
            this._ghostBottomHg = this.ghostBottomHg;
        }

        return false;
    }

    /**
     * P R E  R E N D E R   R E S I Z I N G  A N D  F I X I N G
     *
     * @param direction
     */
    resizeGhostElement( direction = 'next' ) {

        const { ghostTop, ghostBottom } = direction === 'next'
            ? this.currentChunkObj.distancesGoingNext()
            : this.currentChunkObj.distancesGoingPrevious();

        this.ghostFixingHeight( ghostTop, ghostBottom );
    }


    /** ************************************************* **/


    /**
     * M O V E M E N T
     *
     * On every scroll receives the position and evaluates the
     * action to perform
     * @param scrollTop
     * @param direction
     */
    evaluatePosition( scrollTop, direction ) {
        if ( this.needStateUpdate ) return;
        //const difference = Math.abs( scrollTop - this.limitBottom  );

        if ( direction === 'down' && this.limitBottom <= scrollTop ) {

            //Probably when css is not loaded
            if ( this.viewportHg > this.bodyHg ) {

                this.setStaticHeightsForExternalObjects();
                this.updateHeightsFromExternalObjects();
                this.updateHeights( true );
                this.updateLimits();

                this.needStateUpdate = true;
                this.updating        = true;

                return;
            }

            this.needStateUpdate = true;
            this.nextChunk( scrollTop );
        }
        else if ( direction === 'up' && this.limitTop >= scrollTop ) {
            this.needStateUpdate = true;
            this.prevChunk( scrollTop );
        }
    }

    jumpChunk( pos = null, dir = null ) {

        const nextChunk = Math.max( 0, Math.round( pos / (this.allChunksHg / this.chunksSize) ) );

        if ( dir === 'next' ) {
            this.ghostTopHg  = pos;
            this._ghostTopHg = this.ghostTopHg;
            this.ghostFixingHeight( null, true, 'post' );
        }
        else {
            this.ghostTopHg  = pos;
            this._ghostTopHg = this.ghostTopHg;
            this.ghostFixingHeight( null, true, 'post' );
        }

        //Keep data for update after render
        this.hugeJump    = pos;
        this.hugeJumpDir = dir;
        this.hugeJumpBtm = this.chunksSize === nextChunk;

        //Allows the next to be over limit to get to the bottom of last chunk instead of the
        //start of last chunk
        return nextChunk - ( this.hugeJumpBtm ? 1 : 0 );

    }

    /**
     * M O V E M E N T
     *
     * Moves a chunk forward
     * @returns {boolean}
     */
    nextChunk( scrollTop ) {

        let nextChunk    = this.currentChunkIndx + 1;
        const difference = Math.abs( scrollTop - this.limitBottom );

        if ( nextChunk < this.chunksSize && this.updating === false ) {

            if ( difference > this.baseChunkHg ) {
                nextChunk = this.jumpChunk( scrollTop, 'next' );
            }

            //BeforeChange
            this.updating = true;
            this.resizeGhostElement( 'next' );

            //AfterChange
            this.prevChunkIndx    = this.currentChunkIndx;
            this.currentChunkIndx = nextChunk;
            this.updateChunkDataOnChange( nextChunk );
            this.needsUpdate = true;

            return true;
        }
        return false;
    }

    /**
     * M O V E M E N T
     *
     * Moves a chunk forward
     * @returns {boolean}
     */
    prevChunk( scrollTop ) {
        let nextChunk    = this.currentChunkIndx - 1;
        const difference = Math.abs( this.limitTop - scrollTop );

        if ( nextChunk >= 0 && this.updating === false ) {

            if ( difference > this.baseChunkHg ) {
                nextChunk = this.jumpChunk( scrollTop, 'prev' );
            }

            //BeforeChange
            this.updating = true;
            this.resizeGhostElement( 'prev' );

            //AfterChange
            this.prevChunkIndx    = this.currentChunkIndx;
            this.currentChunkIndx = nextChunk;
            this.updateChunkDataOnChange( nextChunk );
            this.needsUpdate = true;

            return true;
        }
        return false;
    }

}


class Chunk {

    constructor( index, totalChunks, totalItems, visibleItems, offsetItems, leftOvers ) {

        this.id = index;

        this.isFirst   = this.id === 0;
        this.isLast    = this.id === ( totalChunks - 1);
        this.isSecond  = this.id === 1;
        this.isPreLast = this.id === ( totalChunks - 2);

        this.visualInit = this.id * visibleItems;
        this.visualEnd  = Math.min( totalItems, this.visualInit + visibleItems + ( this.isLast ? leftOvers : 0 ) );

        this.offsetInit = Math.max( 0, this.visualInit - offsetItems );
        this.offsetEnd  = Math.min( totalItems, this.visualEnd + offsetItems );

        this.visualDelta = this.visualEnd - this.visualInit;
        this.offsetDelta = this.offsetEnd - this.offsetInit;

        this.visibleItems = visibleItems;
        this.offsetItems  = offsetItems;

        this.chunksBefore = this.id;
        this.chunksAfter  = totalChunks - (this.id + 1);
        this.totalChunks  = totalChunks;
        this.totalItems   = totalItems;

        // EXTERNAL OBJECTS
        this._viewportEl    = null;
        this._containerEl   = null;
        this._ghostTopEl    = null;
        this._ghostBottomEl = null;

        this._viewportHg    = null;
        this._containerHg   = null;
        this._ghostTopHg    = null;
        this._ghostBottomHg = null;
        this._allChunksHg   = null;

    }

    set externalObjects( data ) {

        if ( data.viewportEl ) this._viewportEl = data.viewportEl;
        if ( data.containerEl ) this._containerEl = data.containerEl;
        if ( data.ghostTopEl ) this._ghostTopEl = data.ghostTopEl;
        if ( data.ghostBottomEl ) this._ghostBottomEl = data.ghostBottomEl;

        if ( data.viewportHg ) this._viewportHg = data.viewportHg;
        if ( data.containerHg ) this._containerHg = data.containerHg;
        if ( data.ghostTopHg ) this._ghostTopHg = data.ghostTopHg;
        if ( data.ghostBottomHg ) this._ghostBottomHg = data.ghostBottomHg;
        if ( data.allChunksHg ) this._allChunksHg = data.allChunksHg;
    }


    get fullHeight() {
        return this.getChildSegmentHeight( 0, this.offsetDelta - 1, true );
    }

    get offsetHeight() {
        return this.getChildSegmentHeight( 0, this.offsetItems - 1, false );
    }

    /** L I M I T  T O P **/
    /** ************************************************* **/
    get itemIndexForLimitTop() {
        return this.isFirst ? 0 : this.offsetItems - 1;
    }

    get childForLimitTop() {
        return this.getChild( this.itemIndexForLimitTop );
    }

    get limitTop() {
        return this.calculateLimitTop();
    }

    /** L I M I T  B O T T O M **/
    /** ************************************************* **/
    get itemIndexForLimitBottom() {
        return this.isFirst ? this.visualDelta : this.visualDelta + this.offsetItems + (this.isLast ? -1 : 0);
    }

    get childForLimitBottom() {
        return this.getChild( this.itemIndexForLimitBottom );
    }

    get limitBottom() {
        return this.calculateLimitBottom();
    }

    /** G O I N G  N E X T **/
    /** ************************************************* **/

    /**
     * Sets the index range to be removed going next chunk
     * @returns {{from: number, to: number}}
     */
    get indexesForGoingNext() {
        return {
            from: 0,
            to  : this.isFirst ? this.visibleItems - this.offsetItems : this.visibleItems
        };
    }

    /** ************************************************* **/

    /**
     * Calculates the LimitBottom to trigger change of chunk
     *
     * @returns {*}
     */
    calculateLimitBottom() {
        const child       = this.childForLimitBottom;
        const childOffset = child.offsetTop;
        return (this.isLast ? childOffset + 10000 : 0  ) + (childOffset - this._viewportHg) + this._ghostTopHg;
    }

    /**
     * Calculates the LimitTop to trigger change of chunk
     *
     * @returns {number}
     */
    calculateLimitTop() {
        return this.isFirst ? -10 : this.childForLimitTop.offsetTop + this._ghostTopHg;
    }

    /**
     * Calculates the height of all items to be removed from the current chunk in order
     * to render next
     * @returns {{ghostTop: *, ghostBottom: *, container: number}}
     */
    distancesGoingNext() {

        const indexes      = this.indexesForGoingNext;
        const firstChild   = this.getChild( indexes.from );
        const lastChild    = this.getChild( indexes.to );
        const removingSize = Math.abs( lastChild.offsetTop ) - Math.abs( firstChild.offsetTop );

        const ghostTop    = this._ghostTopHg + removingSize;
        const ghostBottom = null;
        const container   = this._containerHg - removingSize;

        return { ghostTop, ghostBottom, container };
    }

    /**
     * Calculates the height of all items to be removed from the current chunk in order
     * to render previous
     * @returns {{ghostTop: *, ghostBottom: *, container: *}}
     */
    distancesGoingPrevious() {

        const offsetContainer = this._allChunksHg - this._containerEl.parentElement.scrollHeight;
        const indxFrom        = (this.offsetItems * 2);
        const indxTo          = this.offsetDelta - 1;
        const difference      = this.getChildSegmentHeight( indxFrom, indxTo, true );

        return {
            ghostTop   : null,
            ghostBottom: this._ghostBottomEl.offsetHeight + difference + offsetContainer,
            container  : null
        }
    }


    /**
     * Gets the distance between two children
     *
     * @param from
     * @param to
     * @param includeHeight
     * @returns {number}
     */
    getChildSegmentHeight( from, to, includeHeight = false ) {
        const firstChild = this.getChild( from );
        const lastChild  = this.getChild( to );
        return Math.abs( lastChild.offsetTop + ( includeHeight ? lastChild.offsetHeight : 0 ) ) - Math.abs( firstChild.offsetTop );
    }

    /**
     * Gets the DOM children for a given index
     *
     * @param indx
     * @returns {*}
     */
    getChild( indx ) {
        return this._containerEl.children[indx];
    }

}

export function debounce( fn, delay, eventProp = null ) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        if ( eventProp ) {
            switch ( eventProp ) {
                case 'target.value':
                    args[0] = args[0].target.value;
                    break;
                default:
                    args[0] = args[0].persist()
            }
        }
        clearTimeout( timer );
        timer = setTimeout( function () {
            fn.apply( context, args );
        }, delay );
    };
}
export function debounceThrottle( func, wait, immediate ) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout( timeout );
        timeout = setTimeout( function () {
            timeout = null;
            if ( !immediate ) func.apply( context, args );
        }, wait );
        if ( immediate && !timeout ) func.apply( context, args );
    };
}

