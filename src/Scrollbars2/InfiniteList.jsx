import React from 'react';
import shallowEqual from 'shallowequal';
import {Scrollbars2} from '../index';
import {InfiniteScrollHandler, debounce} from './infinityUtils';
const clog = console.log;
const InfiniteList = React.createClass( {


    /** C O M P O N E N T   B A S I C S **/
    /** ************************************************* **/

    setOffStateVariables( givenProps ){
        const { items, offset, visibles } = givenProps;

        this.lastScrollTop = null;
        this.sbh           = new InfiniteScrollHandler( items.length, visibles, 1, offset );
    },

    setComponentVariables(){
        this.ghostStyle = { textAlign: 'right', border: '1px solid green', height:0 }
    },

    getInitialState(){
        this.setComponentVariables();
        this.setOffStateVariables(this.props);

        return {
            items      : this.props.items,
            initialized: null,
        };
    },

    updateMetrics( update = true ){
        const { itemsContainer, ghostViewTop, ghostViewBottom } = this.refs;
        this.sbh.setExternalObjects( itemsContainer, ghostViewTop, ghostViewBottom );
        if(update) this.forceUpdate();
    },

    onScrollFrame( { scrollTop, direction } ){
        //console.log(scrollTop);
        //if( this.lastScrollTop === scrollTop ) return;

        this.lastScrollTop = scrollTop;
        this.sbh.evaluatePosition( scrollTop, direction );
        if ( this.sbh.needStateUpdate ) {
            this.forceUpdate();
        }

        /*const log = "[%s]Scrolltop: %s | LimitBottom: %s | LimitTop: %s | Height: %s | GhostTopHeight: %s |GhostBottomHeight: %s";
        clog( log , this.sbh.currentChunkIndx ,scrollTop, this.sbh.limitBottom, this.sbh.limitTop,
            this.sbh.itemsContainerHg, this.sbh.ghostTopHg, this.sbh.ghostBottomHg
        );*/
    },


    shouldComponentUpdate(){
        return true;
    },

    componentWillUpdate(nextProps){
        if( !shallowEqual(this.props.items,nextProps.items ) ){
            this.setOffStateVariables(nextProps);
        }

    },
    componentDidUpdate(prevProps){
        if ( this.sbh.needsUpdate ) {
            this.sbh.update();
        }
        //console.log( "did items changed?",!shallowEqual(this.props.items, prevProps.items), this.sbh );
        //console.timeEnd('Infinite');
        if( !shallowEqual(this.props.items,prevProps.items ) ){
            this.lastScrollTop = null;
            this.updateMetrics();
            //console.log("%cItems Changed!!", "font-size:14px;font-weight:bold;",this.sbh);
        }
    },

    /*componentWillUpdate(nextProps){

    },*/

    componentDidMount(){
        this.updateMetricsDebounced = debounce( this.updateMetrics, 1 );
        this.updateMetricsDebounced();
    },

    /** R E N D E R S **/
    /** ************************************************* **/
    render(){
        this.sbh.reportRendering();
        const { init, end }  = this.sbh;

        const visibleItems = this.props.items.slice( init, end ).map( ( obj, index )=> {
            return this.props.renderFunc( obj, index );
        } );
        console.log("SHOWING FROM %s to %s out of %s", init, end,visibleItems.length );
        return (
            <Scrollbars2 onScrollFrame={this.onScrollFrame} thumbMinSize={30}>
                <div className="ghostViewTop" ref="ghostViewTop" style={{ ...this.ghostStyle }} />
                <div ref="itemsContainer" style={{ ...this.props.style, position:'relative'}}
                     className={this.props.className} >
                    {visibleItems}
                </div>
                <div className="ghostViewBottom" ref="ghostViewBottom" style={{ ...this.ghostStyle }} />
            </Scrollbars2>
        );
    }
} );

InfiniteList.defaultProps = {};
InfiniteList.propTypes    = {
    items     : React.PropTypes.any,
    visibles  : React.PropTypes.number,
    offset    : React.PropTypes.number,
    renderFunc: React.PropTypes.func,
};

export default InfiniteList;
