/*
 *
 *  File: App.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   08 Sep, 2016 | 06:26 PM
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

//require('./example.less');
import React from 'react';
//import InfiniteList from './InfiniteList';
import {InfiniteList} from '../compiled/index';
import {rainbow, inWords} from './exampleHelpers';


/** A P P  **/
/** ************************************************* **/
const App = React.createClass( {
    getInitialState(){
        return {
            topMessage: 'I\'m at the top',
            message: null
        }
    },

    componentWillMount(){
        console.time( "Mounting" );
    },

    componentDidMount(){
        console.timeEnd( "Mounting" );
    },

    itemRender( obj, index ){
        const color = rainbow( 240 - (240 / ( 93 )) * (Math.ceil( obj.index )) );
        const style = {
            border: "1px solid " + color,
            height: "100px",
            color: color,
            fontSize: 25,
            fontWeight: 'bold'
        };

        if( obj.index % 10 === 0 ){
            style.height = "200px";
        }

        return (
            <div key={'crd' + obj.index} className={'card'+(obj.index+1)} style={style}>
                {obj.title}<br/>
                {inWords(obj.index+1)}
            </div>
        )
    },

    setData( message ){
        this.setState({message});
    },

    render(){
        const border     = '1px solid rgba(255,255,255,0.1)';
        const cardsLocal = [];

        let index = 0;
        while ( index < 93 ) {
            cardsLocal.push( { title: "Card" + (index + 1), index } );
            index++;
        }
        return (
            <Content>
                <div className="topBar" >
                    <div className="title" >Scrollbars2 v1</div>
                    <div>{this.state.message}</div>
                </div>

                <InfiniteList className="card-container" setMessage={this.setData}
                              style={{ border }}
                              items={cardsLocal}
                              visibles={15}
                              offset={10}
                              renderFunc={this.itemRender}
                />

                <div style={{ width: "100%", height: 500, border }} >extra content</div>
            </Content>
        )
    }

} );


/*
 const GetHeightWrapper = React.createClass( {

 getInitialState() {
 return { height: undefined }
 },

 componentDidMount() {
 this.setHeight()
 },

 setHeight() {
 var height = ReactDOM.findDOMNode( this ).getBoundingClientRect().height
 this.props.addHeight( height );
 },
 render() {
 return (
 <div ref="elem" >
 {this.props.children}
 </div>
 );
 }
 } );
 */


const Content = React.createClass( {
    render(){
        return (
            <div className="appContainer" >
                {this.props.children}
            </div>
        )
    }
} );

export default App;
