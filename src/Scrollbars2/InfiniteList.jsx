//noinspection JSUnresolvedVariable
import React, {Component, PropTypes} from 'react';
import shallowEqual from 'shallowequal';
import {Scrollbars2} from '../index';
import autobind from 'react-autobind-helper';
import {List, Iterable} from 'immutable';

class InfiniteList extends Component {

    constructor( props ) {

        super( props );
        autobind( this );

        this.listenScroll = false;
        console.log( props.items );
        this.state        = {
            ...this.resetPagesObject( props )
        };
    }

    /** C A L C U L A T I O N S **/
    /** ************************************************* **/

    resetPagesObject( props ) {

        this.listenScroll = false;
        const length      = Iterable.isIterable( props.items ) ? props.items.size : props.items.length;
        this.totalPages   = Math.ceil( length / props.visibles );
        this.leftOvers    = length % props.visibles;

        return {
            pagesData          : new List().setSize( this.totalPages ).map( ( x, y ) => this.createPagesObject( y, props ) ),
            currentPage        : 0,
            ghostHeightExpected: props.defaultRowHeight * length,
            ghostHeight        : props.defaultRowHeight * length,
            itemsHeight        : props.defaultRowHeight * length,
        }
    }

    createPagesObject( page, props ) {

        const { visibles, defaultRowHeight } = props;

        const length          = Iterable.isIterable( props.items ) ? props.items.size : props.items.length;
        const isLast          = page === this.totalPages - 1;
        const from            = page * visibles;
        const to              = Math.min( from + visibles, length );
        const estimatedHeight = visibles * defaultRowHeight;
        const height          = isLast && this.leftOvers > 0 ? this.leftOvers * defaultRowHeight : estimatedHeight;

        return {
            page, from, to, height,
            key        : 'Page' + page,
            cssClass   : 'infinityPage page' + page,
            limitTop   : -1,
            limitBottom: 1000000000 * 100000000,
            initialized: false
        }
    }

    calculateLimits() {
        const { currentPage, pagesData } = this.state;
        const { itemsContainerRef }      = this.refs;
        const currentPageData            = pagesData.get( currentPage );
        const currentPageDomObj          = this.refs['Page' + currentPage];

        if ( currentPageData && currentPageDomObj && currentPageData.initialized === false ) {

            const { offsetHeight, offsetTop } = currentPageDomObj;

            const ghostHeight = pagesData.reduce( ( acc, obj ) => {
                return acc + obj.height
            }, 0 );

            this.setState( {
                ghostHeight: ghostHeight,
                pagesData  : pagesData.update( currentPage, val => ({
                    ...val,
                    height     : offsetHeight,
                    limitTop   : offsetTop,
                    limitBottom: offsetTop + offsetHeight,
                    initialized: true,
                }) ),
                itemsHeight: itemsContainerRef.offsetHeight
            }, this.enableScrollListening );
        }
    }

    enableScrollListening() {
        this.listenScroll = true;
    }

    disableScrollListening() {
        this.listenScroll = false;
    }

    /** E V E N T S **/
    /** ************************************************* **/
    onScrollFrame( { scrollTop, direction, clientHeight, realMovY } ) {

        if ( !this.listenScroll || !this.state.pagesData.get( this.state.currentPage ) ) return;


        const { currentPage, pagesData }              = this.state;
        const { defaultRowHeight, visibles }          = this.props;
        const { limitTop, limitBottom, height }       = pagesData.get( currentPage );

        const fixedScrollTop = scrollTop + clientHeight;
        const nextPage       = currentPage + 1;
        const prevPage       = currentPage - 1;
        const isDown         = direction === 'down';
        const isUp           = direction === 'up';
        const isBigMove      = Math.abs( realMovY ) > height;


        //When Scroll moves big distances
        if ( isBigMove ) {
            const midList     = pagesData.size / 2;
            const tgtPageCalc = ( fixedScrollTop / defaultRowHeight / visibles );
            const tgtPage     = tgtPageCalc > midList ? Math.round( tgtPageCalc ) : Math.floor( tgtPageCalc );

            this.disableScrollListening();
            this.setState( { currentPage: tgtPage }, this.enableScrollListening );
            return;
        }


        if ( fixedScrollTop > limitBottom + 1 && isDown && nextPage < pagesData.size ) {
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
            const recalculatedState     = this.resetPagesObject( nextProps, false );

            this.disableScrollListening();

            this.setState( { ...recalculatedState, currentPage: 0 }, () => {
                if ( !scrollbarsRef ) return;
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


    /** R E N D E R S **/
    /** ************************************************* **/

    renderItems( slicedItems ) {
        if ( Iterable.isIterable( this.props.items ) ) {
            return slicedItems.entrySeq().map( this.renderItemsSimple );
        }
        return slicedItems.map( this.renderItemsSimple );
    }

    renderItemsSimple( x, y ) {
        const isIterable = Iterable.isIterable( this.props.items );
        const object     = isIterable ? x[1] : x;
        const index      = isIterable ? x[0] : y;

        return (
            <div className={'itemWrapper itemWrapper' + index } key={'item_' + index} >
                {this.props.renderFunc( object, index )}
            </div>
        );
    }

    render() {

        const { currentPage, pagesData, itemsHeight, ghostHeight }   = this.state;

        return (
            <Scrollbars2 onScrollFrame={this.onScrollFrame} thumbMinSize={30} ref="scrollbarsRef" >
                <div className="items" ref='itemsContainerRef' style={{ position: 'absolute', width: '100%' }} >

                    { pagesData.map( ( object ) => {

                        const { page, from, to, key, cssClass, height } = object;

                        const isRenderable = page >= currentPage - 1 && page <= currentPage + 1;
                        const pageStyle    = isRenderable ? {} : { height };
                        const pageItems    = isRenderable ? this.props.items.slice( from, to ) : null;
                        const className    = cssClass + ( isRenderable ? " renderable" : "" );

                        return (
                            <div key={key} ref={key} className={className} style={pageStyle} >
                                {isRenderable ? this.renderItems( pageItems ) : pageItems}
                            </div>
                        );

                    } ) }

                </div>
                <div ref='ghost' className="ghost"
                     style={{ height: Math.min( itemsHeight, ghostHeight ) }} />
            </Scrollbars2>
        );
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

export default InfiniteList;
