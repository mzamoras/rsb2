//noinspection JSUnresolvedVariable
import React, {Component, PropTypes} from 'react';
import shallowEqual from 'shallowequal';
import {Scrollbars2} from '../index';
import autobind from 'react-autobind-helper';
import {List, Iterable} from 'immutable';

const emptyArray = [];


class InfiniteList extends Component {

    constructor( props ) {

        super( props );
        autobind( this );

        this.state = { currentPage: 0 };

        //Pages Info
        this.pData      = new List();
        this.pTotal     = 0;
        this.pLeftOvers = 0;
        this.pRefs      = {};

        //Heights
        this.hGhost = 0;
        this.hItems = 0;

        //Flags
        this.isIterable    = false;
        this.isListening   = false;

        this.resetPagesObject( props );
    }

    /** C A L C U L A T I O N S **/
    /** ************************************************* **/

    resetPagesObject( props ) {

        //Flags
        this.isListening   = false;
        this.isIterable    = Iterable.isIterable( props.items );

        const length     = this.isIterable ? props.items.size : props.items.length;
        const baseHeight = length <= props.visibles ? 0 : props.defaultRowHeight * length;

        //Pages Info
        this.pTotal     = Math.ceil( length / props.visibles );
        this.pLeftOvers = length % props.visibles;
        this.pData      = new List().setSize( this.pTotal ).map( ( x, y ) => this.createPagesObject( y, props ) );

        //Heights
        this.hGhost = baseHeight;
        this.hItems = baseHeight;
    }

    createPagesObject( page, props ) {

        const { visibles, defaultRowHeight } = props;

        const length          = this.isIterable ? props.items.size : props.items.length;
        const isLast          = page === this.pTotal - 1;
        const from            = page * visibles;
        const to              = Math.min( from + visibles, length );
        const estimatedHeight = visibles * defaultRowHeight;
        const height          = isLast && this.pLeftOvers > 0 ? this.pLeftOvers * defaultRowHeight : estimatedHeight;

        return {
            page, from, to, height,
            key         : 'Page' + page,
            cssClass    : 'infinityPage page' + page,
            limitTop    : -1,
            limitBottom : 1000000000 * 100000000,
            initialized : false,
            itemsPerPage: visibles
        }
    }

    calculateLimits( ) {
        const { currentPage }       = this.state;
        const currentPageData       = this.pData.get( currentPage );

        if(!currentPageData){
            return;
        }

        const { itemsContainerRef } = this.refs;
        const currentPageDomObj     = this.pRefs['Page' + currentPage];
        const isInitialized         = currentPageData.initialized === true;

        if ( currentPageData && currentPageDomObj && !isInitialized ) {

            const { offsetHeight, offsetTop } = currentPageDomObj;

            this.hItems = itemsContainerRef.offsetHeight;
            this.hGhost = this.pData.reduce( ( acc, obj ) => acc + obj.height, 0 );
            this.pData  = this.pData.update( currentPage, val => ({
                ...val,
                height     : offsetHeight,
                limitTop   : offsetTop,
                limitBottom: offsetTop + offsetHeight,
                initialized: true,
            }) );
            this.enableScrollListening();
        }
    }

    enableScrollListening() {
        this.isListening = true;
    }

    disableScrollListening() {
        this.isListening = false;
    }

    /** E V E N T S **/
    /** ************************************************* **/
    onScrollFrame( { scrollTop, direction, clientHeight, realMovY } ) {

        if ( !this.isListening || !this.pData.get( this.state.currentPage ) ) return;

        const { currentPage }                   = this.state;
        const { pData }                         = this;
        const { defaultRowHeight, visibles }    = this.props;
        const { limitTop, limitBottom, height } = pData.get( currentPage );

        const fixedScrollTop = scrollTop + clientHeight;
        const nextPage       = currentPage + 1;
        const prevPage       = currentPage - 1;
        const isDown         = direction === 'down';
        const isUp           = direction === 'up';
        const isBigMove      = Math.abs( realMovY ) > height;


        //When Scroll moves big distances
        if ( isBigMove ) {
            const midList     = pData.size / 2;
            const tgtPageCalc = ( fixedScrollTop / defaultRowHeight / visibles );
            const tgtPage     = tgtPageCalc > midList ? Math.round( tgtPageCalc ) : Math.floor( tgtPageCalc );

            this.disableScrollListening();
            this.setState( { currentPage: tgtPage }, this.enableScrollListening );
            return;
        }


        if ( fixedScrollTop > limitBottom + 1 && isDown && nextPage < pData.size ) {
            this.disableScrollListening();
            this.setState( { currentPage: nextPage }, this.enableScrollListening );
        }


        if ( fixedScrollTop < limitTop - 1 && isUp && prevPage >= 0 ) {
            this.disableScrollListening();
            this.setState( { currentPage: prevPage }, this.enableScrollListening );
        }

    }

    /** L I F E C Y C L E **/
    /** ************************************************* **/

    componentWillUpdate( nextProps ) {

        //When the number of items has changed
        if ( !shallowEqual( this.props.items, nextProps.items ) ) {

            const { scrollbarsRef }     = this.refs;

            this.resetPagesObject( nextProps, false );
            this.disableScrollListening();

            this.setState( { currentPage: 0 }, () => {
                if ( !scrollbarsRef || !scrollbarsRef.api) return;
                scrollbarsRef.update();
                scrollbarsRef.api.toTop();
                this.enableScrollListening()
            } );
        }
    }

    componentDidMount() {
        this.calculateLimits();
    }

    componentDidUpdate() {
        this.calculateLimits();
    }


    /** R E N D E R **/
    /** ************************************************* **/

    render() {

        const { currentPage }   = this.state;

        return (
            <Scrollbars2 onScrollFrame={this.onScrollFrame} thumbMinSize={30} ref="scrollbarsRef">
                <div className="items" ref='itemsContainerRef' style={{ position: 'absolute', width: '100%' }} >

                    { this.pData.map( ( object ) => {
                        const { page, from, to } = object;

                        const isRenderable = page >= currentPage - 1 && page <= currentPage + 1;
                        const _loopItems   = isRenderable ? this.props.items.slice( from, to ) : emptyArray;
                        const loopItems    = this.isIterable && isRenderable ? _loopItems.entrySeq() : _loopItems;

                        return (
                            <PageInfiniteList
                                key={object.key}
                                ref={ this.getPageRef }
                                pageData={object}
                                pageItems={ loopItems }
                                renderFunc={this.props.renderFunc}
                                isRenderable={ isRenderable }
                                isIterable={this.isIterable}
                            />
                        )
                    } ) }

                </div>
                <div ref='ghost' className="ghost"
                     style={{ height: Math.min( this.hItems, this.hGhost ) }} />
            </Scrollbars2>
        );
    }

    getPageRef( obj ) {
        if ( obj ) this.pRefs[obj.pageKey] = obj.refs['page']
    }

    static propTypes = {
        items           : PropTypes.any.isRequired,
        visibles        : PropTypes.number,
        offset          : PropTypes.number,
        renderFunc      : PropTypes.func.isRequired,
        defaultRowHeight: PropTypes.number.isRequired,
        totalItems      : PropTypes.number.isRequired,
    }
}

class PageInfiniteList extends Component {

    constructor( props ) {
        super( props );
        this.normalClass = props.pageData.cssClass;
        this.renderClass = props.pageData.cssClass + " renderable";
        this.emptyStyle  = {};
        this.pageKey     = props.pageData.key;
    }

    shouldComponentUpdate( nextProps ) {
        return !shallowEqual( nextProps, this.props );
    }

    render() {
        const { pageData, pageItems, isRenderable, isIterable } = this.props;
        const pageStyle                                         = isRenderable ? this.emptyStyle : { height: pageData.height };

        return (
            <div ref="page" className={isRenderable ? this.renderClass : this.normalClass } style={pageStyle} >
                { isRenderable && pageItems.map( ( x, y ) => {

                    const object = isIterable ? x[1] : x;
                    const index  = isIterable ? x[0] : y;
                    const indx   = (y + (this.props.pageData.page * this.props.pageData.itemsPerPage));

                    return (
                        <div className={'itemWrapper itemWrapper' + index } key={'item_' + index} >
                            {isRenderable && this.props.renderFunc( object, index, indx )}
                        </div>
                    );
                } ) }
            </div>
        );
    }

    static propTypes = {
        pageData    : PropTypes.any,
        pageItems   : PropTypes.any,
        renderFunc  : PropTypes.func,
        isRenderable: PropTypes.bool,
        isIterable  : PropTypes.bool,
    }
}

export default InfiniteList;
