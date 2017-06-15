/*
 *
 *  File: infinityUtils.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Dec, 2016 | 05:28 PM
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

class Chunk {

    constructor( index, totalChunks, totalItems, visibleItems, offsetItems, leftOvers ) {

        this.id      = index;
        this.indexes = {};

        this.setIndexes( index, totalChunks, totalItems, visibleItems, offsetItems, leftOvers );

        this.isFirst = this.indexes.first;
        this.isLast  = this.indexes.last;

        this.visualInit = this.indexes.visualInit; //this.id * visibleItems;
        this.visualEnd  = this.indexes.visualEnd;//Math.min( totalItems, this.visualInit + visibleItems + ( this.isLast ? leftOvers : 0 ) );

        this.offsetInit = this.indexes.absoluteInit;//Math.max( 0, this.visualInit - offsetItems );
        this.offsetEnd  = this.indexes.absoluteEnd;//Math.min( totalItems, this.visualEnd + offsetItems );

        this.visualDelta = this.indexes.totalVisibleItems;//this.visualEnd - this.visualInit;
        this.offsetDelta = this.indexes.totalAbsoluteItems;//this.offsetEnd - this.offsetInit;

        this.visibleItems = visibleItems;
        this.offsetItems  = offsetItems;
        this.totalItems   = totalItems;

        // EXTERNAL OBJECTS
        // this._viewportEl    = null;
        this._containerEl   = null;
        //this._ghostTopEl    = null;
        this._ghostBottomEl = null;

        this._viewportHg    = null;
        this._containerHg   = null;
        this._ghostTopHg    = null;
        this._ghostBottomHg = null;
        this._allChunksHg   = null;

    }

    /** ****** **/
    setIndexes( index, totalChunks, totalItems, visibleItems, offsetItems, leftOvers ) {

        const first   = index === 0;
        const last    = index === totalChunks - 1;
        const indexes = {};

        indexes.first = first;
        indexes.last  = last;

        //Global Indexes
        indexes.visualInit   = index * visibleItems;
        indexes.visualEnd    = (last ? totalItems : indexes.visualInit + visibleItems);
        indexes.absoluteInit = first ? indexes.visualInit : indexes.visualInit - offsetItems;
        indexes.absoluteEnd  = last ? indexes.visualEnd : indexes.visualEnd + offsetItems;

        indexes.totalAbsoluteItems = indexes.absoluteEnd - indexes.absoluteInit;
        indexes.totalVisibleItems  = indexes.visualEnd - indexes.visualInit;

        //Chunk Indexes Ranges
        indexes.visualFrom   = first ? 0 : offsetItems;
        indexes.visualTo     = (last ? indexes.totalAbsoluteItems : indexes.visualFrom + visibleItems) - 1;
        indexes.absoluteFrom = first ? indexes.visualFrom : last ? 0 : indexes.visualFrom - offsetItems;
        indexes.absoluteTo   = last ? indexes.totalAbsoluteItems - 1 : indexes.visualTo + offsetItems;

        indexes.offsetTopFrom    = indexes.absoluteFrom;
        indexes.offsetTopTo      = first ? 0 : indexes.visualFrom - 1;
        indexes.offsetBottomFrom = last ? indexes.absoluteTo : indexes.visualTo + 1;
        indexes.offsetBottomTo   = indexes.absoluteTo;

        indexes.limitTopFrom    = first ? null : indexes.visualFrom;
        indexes.limitTopTo      = indexes.visualFrom;
        indexes.limitBottomFrom = last ? null : indexes.visualTo;
        indexes.limitBottomTo   = indexes.visualTo;

        indexes.removableNextFrom = indexes.absoluteFrom;
        indexes.removableNextTo   = indexes.visualFrom - offsetItems + visibleItems - 1;
        indexes.removablePrevFrom = (indexes.visualTo - (last ? leftOvers : 0)) + offsetItems - visibleItems + 1;
        indexes.removablePrevTo   = (indexes.absoluteTo);

        this.indexes = indexes;
        //console.clear();
        //console.log(totalItems);
        console.table([indexes]);
    }


    /** ****** **/

    set externalObjects( data ) {

        //if ( data.viewportEl ) this._viewportEl = data.viewportEl;
        if ( data.containerEl ) this._containerEl = data.containerEl;
        //if ( data.ghostTopEl ) this._ghostTopEl = data.ghostTopEl;
        if ( data.ghostBottomEl ) this._ghostBottomEl = data.ghostBottomEl;

        if ( data.viewportHg ) this._viewportHg = data.viewportHg;
        if ( data.containerHg ) this._containerHg = data.containerHg;
        if ( data.ghostTopHg ) this._ghostTopHg = data.ghostTopHg;
        if ( data.ghostBottomHg ) this._ghostBottomHg = data.ghostBottomHg;
        if ( data.allChunksHg ) this._allChunksHg = data.allChunksHg;
    }


    get fullHeight() {
        if(this._containerEl.children.length === 0) return 0;
        return this.getChildSegmentHeight( this.indexes.absoluteFrom, this._containerEl.children.length - 1/*this.indexes.absoluteTo*/, true );
    }

    get offsetHeight() {
        return this.getChildSegmentHeight( 0, this.offsetItems - 1, false );
    }

    /** L I M I T S **/
    /** ************************************************* **/

    get limitTop() {
        if(this._containerEl.children.length === 0) return -10;
        return !this.indexes.limitTopFrom ? -10 : this.getChild( this.indexes.limitTopTo ).offsetTop + this._ghostTopHg;
    }

    get limitBottom() {
        if(this._containerEl.children.length === 0) return 10;
        const childOffset = this.getChild( this.indexes.limitBottomTo ).offsetTop;
        return !this.indexes.limitBottomFrom ? this._allChunksHg * 10 : childOffset - this._viewportHg + this._ghostTopHg;

    }

    /** G O I N G  N E X T **/
    /** ************************************************* **/

    /**
     * Calculates the height of all items to be removed from the current chunk in order
     * to render next
     * @returns {{ghostTop: *, ghostBottom: *, container: number}}
     */
    distancesGoingNext() {
        const removingHeight = this.getChildSegmentHeight( this.indexes.removableNextFrom, this.indexes.removableNextTo, true );
        return {
            ghostTop   : this._ghostTopHg + removingHeight,
            ghostBottom: null,
            container  : this._containerHg - removingHeight
        }
    }

    /** G O I N G  P R E V **/
    /** ************************************************* **/
    /**
     * Calculates the height of all items to be removed from the current chunk in order
     * to render previous
     * @returns {{ghostTop: *, ghostBottom: *, container: *}}
     */
    distancesGoingPrevious() {
        const offsetContainer = this._allChunksHg - this._containerEl.parentElement.scrollHeight;
        const removingHeight  = this.getChildSegmentHeight( this.indexes.removablePrevFrom, this.indexes.removablePrevTo, true );
        return {
            ghostTop   : null,
            ghostBottom: this._ghostBottomEl.offsetHeight + removingHeight + offsetContainer,
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
        //console.log("Getting %s to %s", from, to,  this._containerEl.children);
        if(to < 0) return 0;
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

        this.hugeJumpAdjusmentNeeded = false;
        this.doWeHaveMovement        = false;

        this.pastPosition  = 0;
        this.positionDelta = 0;
        console.log("--", this);
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
        const actualPerChunk =  visibleItems + (offset * 2);

        //const leftOvers = Math.ceil( totalItems % visibleItems );
        const leftOvers = Math.ceil( totalItems % actualPerChunk );
        //let chunkSize   = leftOvers <= offset ? Math.floor( totalItems / visibleItems ) : Math.ceil( totalItems / visibleItems );
        //let chunkSize   = leftOvers <= offset ? Math.floor( totalItems / actualPerChunk ) : Math.ceil( totalItems / actualPerChunk );
        let chunkSize   = Math.ceil( totalItems / actualPerChunk );
        let index       = 0;
        let newObject   = null;

        if( totalItems <= actualPerChunk ){
            chunkSize = 0;
        }

        while ( index < chunkSize ) {
            newObject = new Chunk( index, chunkSize, totalItems, visibleItems, offset, leftOvers );
            this.chunks.push( newObject );
            index++;
        }

        //When only one chunk is needed
        if ( chunkSize === 0 /*&& totalItems > 0*/ ) {
            newObject = new Chunk( 0, 1, totalItems, visibleItems, offset, leftOvers );
            this.chunks.push( newObject );
        }

        this.chunksSize      = index;
        this.currentChunkObj = this.chunks[defaultChunkIndex];
        console.log(this.chunks)
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

        this.updateLimits();
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

        this.viewportEl.scrollTop = 0;
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
        if ( this.allChunksHg <= this.viewportHg ) return 0;
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
        //if( !this.doWeHaveMovement  ) return;

        this.updateHeights();
        this.updateLimits();
        this.needsUpdate = false;
        //this.doWeHaveMovement = false;
    }

    updateHeights() {
        const f = "font-size:14px;font-weight:bold;color:red";
        //console.log("%cUpdating Chunk: %s | hugeJump: %s",f, this.currentChunkIndx, this.hugeJump);

        //Huge jump detected
        if ( this.hugeJump || this.hugeJump === 0 ) {
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
                    console.log( "BOU TO SCROLL TOP", this.positionDelta );
                    const lastViewedElem         = this.itemsContainerEl.children[this.currentChunkObj.offsetDelta - 1];
                    this.viewportEl.scrollTop    = this.ghostTopHg + lastViewedElem.offsetTop + lastViewedElem.offsetHeight - this.viewportHg;
                    this.hugeJumpAdjusmentNeeded = false;
                }
            }
            else {
                console.log( "THIS IS THE ELSE", this.itemsContainerEl.scrollTop );
                this.ghostFixingHeight( this.isFirstChunk ? 0 : this.allChunksHg - (this.ghostBottomHg + this.itemsContainerHg), this.isFirstChunk ? null : false );
                this.currentChunkObj._ghostTopHg = this.ghostTopHg;
                if ( this.viewportEl.scrollTop < (this.baseChunkHg / 2) ) {
                    this.viewportEl.scrollTop = 0;
                }
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
            const fixableScrollTop = this.ghostTopHg > 0 && this.isFirstChunk;
            this.ghostFixingHeight( this.isFirstChunk ? 0 : this.allChunksHg - (this.ghostBottomHg + this.itemsContainerHg), this.isFirstChunk ? null : false );
            this.currentChunkObj._ghostTopHg = this.ghostTopHg;

            //Due to small fixes the viewport should be scrolled to the last element visible
            if ( this.isFirstChunk && fixableScrollTop/*this.hugeJumpAdjusmentNeeded*/ ) {
                console.log( "BOU TO SCROLL TOP B", this.positionDelta, this.ghostTopHg );
                const lastViewedElem      = this.itemsContainerEl.children[this.currentChunkObj.visualEnd - 1];
                this.viewportEl.scrollTop = lastViewedElem.offsetTop + this.positionDelta + lastViewedElem.offsetHeight;
            }
        }
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
        // console.log( "change:",scrollTop - this.pastPosition );
        if ( direction === 'down' && this.limitBottom <= scrollTop ) {
            //debugger;
            console.log( "%cDOWN:", "font-weight:bold; font-size:14px; color:red;", scrollTop - this.pastPosition );
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
            console.log( "%cUP:", "font-weight:bold; font-size:14px; color:red;", scrollTop - this.pastPosition );
            this.needStateUpdate = true;
            this.prevChunk( scrollTop );
        }
        this.doWeHaveMovement = true;
        this.positionDelta    = scrollTop - this.pastPosition;
        this.pastPosition     = scrollTop;
    }

    jumpChunk( pos = null, dir = null ) {

        const nextChunk = Math.max( 0, Math.round( pos / (this.allChunksHg / (this.chunksSize-1)) ) );
        console.log( "JUMPING TO", nextChunk - 1, pos, this.allChunksHg, this.chunksSize );
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
        this.hugeJumpTop = this.chunksSize < 0;
        this.hugeJumpBtm = this.chunksSize === nextChunk;

        this.hugeJumpAdjusmentNeeded = true;

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
/*
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
 }*/
