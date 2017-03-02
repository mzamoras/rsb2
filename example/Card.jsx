import React from 'react';
import {rainbow, inWords} from './exampleHelpers';

/** C A R D  **/
/** ************************************************* **/
export const RCard = React.createClass( {

    getInitialState(){
        return {
            selected: false
        }
    },
    onClick(){
        this.setState( { selected: !this.state.selected } )
    },

    render(){
        const isOdd        = this.props.data.index % 2;
        const baseClass    = isOdd ? 'odd' : 'pair';
        const currentClass = 'sCard ' + baseClass + ( this.state.selected ? ' selected' : '' );
        const contentStyle = { border: "2px solid " + rainbow( 240 - (240 / (this.props.total / 4 )) * (Math.ceil( this.props.data.index / 4 )) ) };

        return (
            <div onClick={this.onClick} className={currentClass + " " + this.props.data.index} style={contentStyle} >
                <div className="title" >click on the Card</div>
                <div className="title" >{inWords(this.props.data.index)}</div>
                <div className="content" >{this.props.data.index}</div>
            </div>
        );
    }
} );

export default RCard;