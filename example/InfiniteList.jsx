import React from 'react';
import classNames from 'classnames';
import Scrollbars2 from '../compiled/index';
import {InfiniteScrollHandler, debounce} from './utilities';

const clog = console.log;

const InfiniteList = React.createClass( {


    /** C O M P O N E N T   B A S I C S **/
    /** ************************************************* **/

    setOffStateVariables(){
        const { items, offset, visibles } = this.props;

        this.lastScrollTop = null;
        this.sbh           = new InfiniteScrollHandler( items.length, visibles, 1, offset );
    },

    setComponentVariables(){
        this.ghostStyle = { textAlign: 'right', border: '1px solid green', height:0 }
    },

    getInitialState(){
        this.setComponentVariables();
        this.setOffStateVariables();

        return {
            items      : this.props.items,
            initialized: null,
        };
    },

    updateMetrics(){
        const { itemsContainer, ghostViewTop, ghostViewBottom } = this.refs;
        this.sbh.setExternalObjects( itemsContainer, ghostViewTop, ghostViewBottom );
        //this.setState( { initialized: true } );
        this.forceUpdate();
        console.log( "Metrics Updated", itemsContainer.offsetHeight );
    },

    onScrollFrame( { scrollTop, direction, ...all } ){

        if( this.lastScrollTop === scrollTop ) return;

        this.lastScrollTop = scrollTop;
        this.sbh.evaluatePosition( scrollTop, direction );
        if ( this.sbh.needStateUpdate ) {
            //console.log("%cUPDATING",'color:red;font-size:15px;font-weight:bold;' );
            this.forceUpdate();
        }

        /*if( direction === 'down' && this.sbh.limitBottom < scrollTop){
         clog("DOWN = CHANGE NEEDED - Scrolltop: %s | Limit: %s",scrollTop, this.sbh.limitBottom);
         return;
         }
         if( direction === 'up' && this.sbh.limitTop > scrollTop){
         clog("UP = CHANGE NEEDED - Scrolltop: %s | Limit: %s",scrollTop, this.sbh.limitBottom);
         return;
         }*/
        const log = "[%s]Scrolltop: %s | LimitBottom: %s | LimitTop: %s | Height: %s | GhostTopHeight: %s |GhostBottomHeight: %s";
        clog( log , this.sbh.currentChunkIndx ,scrollTop, this.sbh.limitBottom, this.sbh.limitTop,
           this.sbh.itemsContainerHg, this.sbh.ghostTopHg, this.sbh.ghostBottomHg
        );
    },


    shouldComponentUpdate(){
        return true;
    },

    componentDidUpdate(){
        if ( this.sbh.needsUpdate ) {
            this.sbh.update();
        }
        console.log(this.sbh);
    },

    componentWillMount(){
        //const container =   React.Children.toArray( this.props.children )[0];

        //clog( container, this.items, React.Children.toArray( this.props.children ) );
    },
    componentDidMount(){
        this.updateMetricsDebounced = debounce( this.updateMetrics, 1 );
        this.updateMetricsDebounced();
        console.log( this.sbh );
    },

    gtHeight(indx, height){
        console.log( "Card:" + indx + ":" + height + "px;" );
    },

    /** R E N D E R S **/
    /** ************************************************* **/
    render(){
        this.sbh.reportRendering();
        const { init, end, itemsContainer_hg, ghostView_hg, viewport_hg }  = this.sbh;

        const visibleItems = this.state.items.slice( init, end ).map( ( obj, index )=> {
            return this.props.renderFunc( obj, index );
        } );
        console.log( 'style', {  position:'relative', ...this.props.style  } );
        return (
            <Scrollbars2 onScrollFrame={this.onScrollFrame} thumbMinSize={30}>
                <div className="ghostViewTop" ref="ghostViewTop" style={{ ...this.ghostStyle }} />
                <div ref="itemsContainer" style={{  position:'relative', ...this.props.style  }}
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
    items     : React.PropTypes.array,
    visibles  : React.PropTypes.number,
    offset    : React.PropTypes.number,
    renderFunc: React.PropTypes.func,
};

export default InfiniteList;

var GetHeightWrapper = React.createClass( {
    getInitialState() {
        return { height: undefined }
    },

    componentDidMount() {
        this.setHeight()
    },

    setHeight() {
        this.props.addHeight( this.props.indx, this.refs['element'].offsetHeight );
    },
    render() {
        var s = {
            display: 'block',
            clear  : 'both',
        };
        return (
            <div style={s} ref='element' className={this.state.height + '-px'} >
                {this.props.children}
            </div>
        )
    }
} );

GetHeightWrapper.propTypes = {
    addHeight: React.PropTypes.func,
    indx     : React.PropTypes.number
};