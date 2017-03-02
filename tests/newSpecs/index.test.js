/*
 *
 *  File: index.js | Package: Scrollbars2
 *
 *  Author:    Miguel Zamora Serrano <mzamoras@backlogics.com>
 *  Created:   15 Sep, 2016 | 09:54 PM
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


/*global describe it before*/

import React from 'react';
import Scrollbars2 from '../../src/Scrollbars2/index'
import Lorem from 'react-lorem-component';
import {createGlobalNode, itRendered} from '../specs/mochaTDDSetup';
import expect, {createSpy} from 'expect';


const ComponentToTest = function ( title = "Component Testing", props = {}, style = {} ) {
    this.title    = title;
    this.props    = props;
    this.styleOut = style;
    this.styleIn  = {};
    this.length   = 40;
    this.sections = [];

    this.innerElement = ( givenTitle = null )=> {
        return (
            <div style={this.styleIn}>
                <h1>{givenTitle || this.title}</h1>
                <Lorem count={this.length}/>
            </div>
        );
    };

    //Set title but reset
    this.rt = ( resetTitle = null ) => {
        this.sections   = [];
        const thisTitle = (this.sections.length + 1 ) + "." + resetTitle;
        if ( thisTitle ) {
            this.sections.push( {
                title: thisTitle,
                obj  : this.innerElement( thisTitle )
            } );
            return thisTitle;
        }
    };

    //Set title counting section
    this.t = ( sectionTitle )=> {
        const thisTitle = (this.sections.length + 1 ) + "." + sectionTitle;
        this.sections.push( {
            title: thisTitle,
            obj  : this.innerElement( thisTitle )
        } );
        return thisTitle;
    };

    this.setTitle = ( newTitle )=> {
        this.title = newTitle;
        return title;
    };

    this.get = ( sty = null, prp = null ) => {
        const title2Render = this.sections.length ? this.sections.shift().obj : this.innerElement();
        return (
            <Scrollbars2 style={ sty || this.styleOut} {...(prp || this.props)}>
                {title2Render}
            </Scrollbars2>
        );
    };
};

before( 'Global Node Instantiation', function () {
    return createGlobalNode( true );
} );

describe( '|| Prepare for test...||', function () {
    it( "is browser ready now?", function test( done ) {
        setTimeout( done, 500 );
    } )
} );

describe( "A. Objects Existence", function () {
    const comp        = new ComponentToTest();
    const autoDestroy = true;

    it( comp.t( "Container" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            expect( this.refs.container ).toExist();
            done( autoDestroy );
        } )
    } );

    it( comp.t( "View" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            expect( this.refs.view ).toExist();
            done( autoDestroy );
        } )
    } );

    it( comp.t( "Track Vertical" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            expect( this.refs["trackVertical"] ).toExist();
            done( autoDestroy );
        } )
    } );

    it( comp.t( "Thumb Vertical" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            expect( this.refs["thumbVertical"] ).toExist();
            done( autoDestroy );
        } )
    } );

    it( comp.t( "Track Horizontal" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            expect( this.refs["trackHorizontal"] ).toExist();
            done( autoDestroy );
        } )
    } );

    it( comp.t( "Thumb Horizontal" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            expect( this.refs["thumbHorizontal"] ).toExist();
            done( autoDestroy );
        } )
    } );

} );

describe( "B. CSS Classes Applied", function () {
    const comp        = new ComponentToTest();
    const autoDestroy = true;

    describe("Defaults", function () {
        it( comp.t( "Container has Class: sb2container" ), function test() {
            return itRendered( comp.get( null, { autoHide: false } ), function ( done ) {
                const element = this.refs["container"];
                expect( element.className ).toContain( 'sb2container' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "View has Class: sb2view" ), function test() {
            return itRendered( comp.get( null, { autoHide: false } ), function ( done ) {
                const element = this.refs["view"];
                expect( element.className ).toContain( 'sb2view' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "trackHorizontal has Class: sb2tracks" ), function test() {
            return itRendered( comp.get( null, { autoHide: false } ), function ( done ) {
                const element = this.refs["trackHorizontal"];
                expect( element.className ).toContain( 'sb2tracks' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "thumbHorizontal has Class: sb2thumbs" ), function test() {
            return itRendered( comp.get( null, { autoHide: false } ), function ( done ) {
                const element = this.refs["thumbHorizontal"];
                expect( element.className ).toContain( 'sb2thumbs' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "trackVertical has Class: sb2tracks" ), function test() {
            return itRendered( comp.get( null, { autoHide: false } ), function ( done ) {
                const element = this.refs["trackVertical"];
                expect( element.className ).toContain( 'sb2tracks' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "thumbVertical has Class: sb2thumbs" ), function test() {
            return itRendered( comp.get( null, { autoHide: false } ), function ( done ) {
                const element = this.refs["thumbVertical"];
                expect( element.className ).toContain( 'sb2thumbs' );
                done( autoDestroy );
            } )
        } );
    });

    describe("Showing only one track", function () {
        it(comp.t('Only vertical track, Horizontal should be inactive'), function test(  ) {
            return itRendered( comp.get( ), function ( done ) {
                const element = this.refs["trackHorizontal"];
                expect( element.style.display ).toEqual( 'none' );
                done( autoDestroy );
            } )
        });
        it(comp.t('Only horizontal track, Vertical should be inactive'), function test(  ) {
            return itRendered( comp.get(null, {showVertical:false, showHorizontal:true} ), function ( done ) {
                const element = this.refs["trackHorizontal"];
                expect( element.style.display ).toEqual( 'none' );
                done( autoDestroy );
            } )
        })
    })

} );

describe( "C. API Functions", function () {
    const aProps      = { showHorizontal: true, autoHide: false };
    const comp        = new ComponentToTest( '', aProps );
    const autoDestroy = true;

    comp.styleIn = { minWidth: '300%' };

    it( comp.t( " Scroll to Top" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            const { view } = this.refs;
            this.api.toTop( 100 );
            expect( view.scrollTop ).toEqual( '100' );
            done( autoDestroy );
        } )
    } );
    it( comp.t( " Scroll to Bottom" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            const { view } = this.refs;
            this.api.toBottom( 100 );
            expect( view.scrollTop ).toEqual( this.scrollDataManager.values.maxScrollTop - 100 );
            done( autoDestroy );
        } )
    } );
    it( comp.t( " Scroll to Left" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            const { view } = this.refs;
            this.api.toLeft( 100 );
            expect( view.scrollLeft ).toEqual( 100 );
            done( autoDestroy );
        } )
    } );
    it( comp.t( " Scroll to Right" ), function test() {
        return itRendered( comp.get(), function ( done ) {
            const { view } = this.refs;
            this.api.toRight( 100 );
            expect( view.scrollLeft ).toEqual( this.scrollDataManager.values.maxScrollLeft - 100 );
            done( autoDestroy );
        } )
    } );
} );

describe( "D. Flash Behaviour", function () {
    const comp        = new ComponentToTest();
    const autoDestroy = true;

    describe( ' Flash Time 100ms delay 0ms, both visible', function () {
        const aProps = { flashTimeDelay: 0, flashTime: 100, showHorizontal: true, autoHide: true };
        comp.styleIn = { minWidth: '200%' };

        it( comp.t( "Tracks Starts Visible" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;
                const calcStyleH                         = window.getComputedStyle( trackHorizontal );
                const calcStyleV                         = window.getComputedStyle( trackVertical );

                expect( calcStyleH.display ).toEqual( 'block' );
                expect( calcStyleH.opacity ).toEqual( '1' );
                expect( calcStyleV.display ).toEqual( 'block' );
                expect( calcStyleV.opacity ).toEqual( '1' );
                done( autoDestroy );
            } )
        } );

        it( comp.t( "Tracks hides after 100ms + transition 200ms" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;

                const to = setTimeout( ()=> {
                    const calcStyleH = window.getComputedStyle( trackHorizontal );
                    const calcStyleV = window.getComputedStyle( trackVertical );
                    expect( calcStyleH.opacity ).toEqual( '0' );
                    expect( calcStyleV.opacity ).toEqual( '0' );
                    clearTimeout( to );
                    done( autoDestroy );
                }, 320 );

            } )
        } );
    } );

    describe( ' Flash Time 100ms delay 100ms, both visible', function () {
        const aProps = { flashTimeDelay: 100, flashTime: 100, showHorizontal: true, autoHide: true };
        comp.styleIn = { minWidth: '200%' };

        it( comp.t( "Tracks Starts Hidden" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;
                const calcStyleH                         = window.getComputedStyle( trackHorizontal );
                const calcStyleV                         = window.getComputedStyle( trackVertical );

                expect( calcStyleH.display ).toEqual( 'none' );
                expect( calcStyleV.display ).toEqual( 'none' );
                done( autoDestroy );
            } )
        } );

        it( comp.t( "Becomes visible after 100ms" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;

                const to = setTimeout( ()=> {

                    const calcStyleH = window.getComputedStyle( trackHorizontal );
                    const calcStyleV = window.getComputedStyle( trackVertical );

                    expect( calcStyleH.opacity ).toEqual( '1' );
                    expect( calcStyleH.display ).toEqual( 'block' );
                    expect( calcStyleV.opacity ).toEqual( '1' );
                    expect( calcStyleV.display ).toEqual( 'block' );
                    clearTimeout( to );
                    done( autoDestroy );
                }, 150 );

            } )
        } );

        it( comp.t( "Tracks hides after 100ms" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;

                const to = setTimeout( ()=> {
                    const calcStyleH = window.getComputedStyle( trackHorizontal );
                    const calcStyleV = window.getComputedStyle( trackVertical );
                    expect( calcStyleH.opacity ).toEqual( '0' );
                    expect( calcStyleV.opacity ).toEqual( '0' );
                    clearTimeout( to );
                    done( autoDestroy );
                }, 400 );

            } )
        } );
    } );

    describe( ' Flash Time 0ms delay 100ms, both visible', function () {
        const aProps = { flashTimeDelay: 50, flashTime: 200, showHorizontal: true, autoHide: true };
        comp.styleIn = { minWidth: '200%' };

        it( comp.t( "Tracks Starts hidden" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;
                const calcStyleH                         = window.getComputedStyle( trackHorizontal );
                const calcStyleV                         = window.getComputedStyle( trackVertical );

                expect( calcStyleH.display ).toEqual( 'none' );
                expect( calcStyleV.display ).toEqual( 'none' );
                done( autoDestroy );
            } )
        } );

        it( comp.t( "Tracks Visible after 100ms + transition 200ms" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;

                const to = setTimeout( ()=> {
                    const calcStyleH = window.getComputedStyle( trackHorizontal );
                    const calcStyleV = window.getComputedStyle( trackVertical );
                    expect( calcStyleH.opacity ).toEqual( '1' );
                    expect( calcStyleV.opacity ).toEqual( '1' );
                    clearTimeout( to );
                    done( autoDestroy );
                }, 250 );

            } )
        } );
    } );

} );

describe( "E. AutoHide Behaviour", function () {
    const comp        = new ComponentToTest();
    const autoDestroy = true;

    describe( ' AutoHide off', function () {
        const aProps = { showHorizontal: true, flashTime: 100, autoHide: false };
        comp.styleIn = { minWidth: '200%' };

        it( comp.t( "Tracks Starts Visible" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;
                const calcStyleH                         = window.getComputedStyle( trackHorizontal );
                const calcStyleV                         = window.getComputedStyle( trackVertical );

                expect( calcStyleH.display ).toEqual( 'block' );
                expect( calcStyleH.opacity ).toEqual( '1' );
                expect( calcStyleV.display ).toEqual( 'block' );
                expect( calcStyleV.opacity ).toEqual( '1' );
                done( autoDestroy );
            } )
        } );

        it( comp.t( "Stays Visible after default flash time:100ms" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;
                const to                                 = setTimeout( ()=> {
                    const calcStyleH = window.getComputedStyle( trackHorizontal );
                    const calcStyleV = window.getComputedStyle( trackVertical );

                    expect( calcStyleH.display ).toEqual( 'block' );
                    expect( calcStyleH.opacity ).toEqual( '1' );
                    expect( calcStyleV.display ).toEqual( 'block' );
                    expect( calcStyleV.opacity ).toEqual( '1' );
                    clearTimeout( to );
                    done( autoDestroy );
                }, 200 );
            } )
        } );

    } );
    describe( ' AutoHide on', function () {
        const aProps = { showHorizontal: true, flashTime: 0, autoHide: true, autoHideTimeout: 200 };
        comp.styleIn = { minWidth: '200%' };

        it( comp.t( "Tracks Starts Hidden" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackHorizontal, trackVertical } = this.refs;

                const calcStyleH = window.getComputedStyle( trackHorizontal );
                const calcStyleV = window.getComputedStyle( trackVertical );
                expect( calcStyleV.display ).toEqual( 'none' );
                expect( calcStyleH.display ).toEqual( 'none' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "Tracks Appear after movement" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackVertical } = this.refs;
                this.api.toTop( 400 );
                const to = setTimeout( ()=> {
                    const calcStyleV = window.getComputedStyle( trackVertical );
                    expect( calcStyleV.display ).toEqual( 'block' );
                    expect( calcStyleV.opacity ).toEqual( '1' );
                    done( autoDestroy );
                }, 250 );
            } )
        } );
        it( comp.t( "Tracks Hides after autoHideTimeout:200ms + transition 200ms" ), function test() {
            return itRendered( comp.get( null, aProps ), function ( done ) {

                const { trackVertical } = this.refs;
                this.api.toTop( 200 );
                const to = setTimeout( ()=> {
                    const calcStyleV = window.getComputedStyle( trackVertical );
                    expect( calcStyleV.display ).toEqual( 'block' );
                    expect( calcStyleV.opacity ).toEqual( '0' );
                    done( autoDestroy );
                }, 550 );
            } )
        } );

    } );

} );

describe( "F. Event Handling", function () {
    const comp        = new ComponentToTest();
    const autoDestroy = true;
    const delayTime   = 50;
    comp.styleIn      = { minWidth: '300%' };

    it( comp.t( " onScrollTop" ), function test() {
        const spy   = createSpy();
        const aProp = { atTop: spy };
        return itRendered( comp.get( null, aProp ), function ( done ) {

            this.api.toTop( 100 );

            setTimeout( ()=> {
                this.api.toTop( 0 );
                setTimeout( ()=> {
                    expect( spy ).toHaveBeenCalled();
                    done( autoDestroy );
                }, delayTime );
            }, delayTime );

        } )
    } );
    it( comp.t( " onScrollBottom" ), function test() {
        const spy   = createSpy();
        const aProp = { atBottom: spy };
        return itRendered( comp.get( null, aProp ), function ( done ) {
            this.api.toBottom( 0 );
            setTimeout( ()=> {
                expect( spy ).toHaveBeenCalled();
                done( autoDestroy );
            }, delayTime );
        } )
    } );
    it( comp.t( " onScrollLeft" ), function test() {
        const spy   = createSpy();
        const aProp = { atLeft: spy, showHorizontal: true };

        return itRendered( comp.get( null, aProp ), function ( done ) {
            this.api.toLeft( 100 );
            setTimeout( ()=> {
                this.api.toLeft( 0 );
                setTimeout( ()=> {
                    expect( spy ).toHaveBeenCalled();
                    done( autoDestroy );
                }, delayTime );
            }, delayTime );
        } )
    } );
    it( comp.t( " onScrollRight" ), function test() {
        const spy   = createSpy();
        const aProp = { atRight: spy, showHorizontal: true };

        return itRendered( comp.get( null, aProp ), function ( done ) {
            this.api.toRight( 0 );
            setTimeout( ()=> {
                this.api.toRight( 0 );
                expect( spy ).toHaveBeenCalled();
                done( autoDestroy );
            }, delayTime );
        } )
    } );

} );

describe( "G. Custom Styles Applied", function () {
    const comp        = new ComponentToTest();
    comp.styleIn      = { minWidth: '300%' };
    const autoDestroy = true;

    it( comp.t( " Container Custom Style" ), function test() {
        return itRendered( comp.get( null, { showHorizontal: true, containerStyle: { backgroundColor: 'red' } } ), function ( done ) {
            expect( this.refs['container'].style.backgroundColor ).toEqual( 'red' );

            done( autoDestroy );
        } )
    } );
    it( comp.t( " View Custom Style" ), function test() {
        return itRendered( comp.get( null, { showHorizontal: true, viewStyle: { backgroundColor: 'red' } } ), function ( done ) {
            expect( this.refs['view'].style.backgroundColor ).toEqual( 'red' );

            done( autoDestroy );
        } )
    } );
    it( comp.t( " trackHorizontal Custom Style" ), function test() {
        return itRendered( comp.get( null, { showHorizontal: true, tracksStyle: { backgroundColor: 'red' } } ), function ( done ) {
            expect( this.refs['trackHorizontal'].style.backgroundColor ).toEqual( 'red' );

            done( autoDestroy );
        } )
    } );
    it( comp.t( " trackVertical Custom Style" ), function test() {
        return itRendered( comp.get( null, { showHorizontal: true, tracksStyle: { backgroundColor: 'red' } } ), function ( done ) {
            expect( this.refs['trackVertical'].style.backgroundColor ).toEqual( 'red' );

            done( autoDestroy );
        } )
    } );
    it( comp.t( " thumbHorizontal Custom Style" ), function test() {
        return itRendered( comp.get( null, { showHorizontal: true, thumbsStyle: { backgroundColor: 'red' } } ), function ( done ) {
            expect( this.refs['thumbHorizontal'].style.backgroundColor ).toEqual( 'red' );

            done( autoDestroy );
        } )
    } );
    it( comp.t( " thumbVertical Custom Style" ), function test() {
        return itRendered( comp.get( null, { showHorizontal: true, thumbsStyle: { backgroundColor: 'red' } } ), function ( done ) {
            expect( this.refs['thumbVertical'].style.backgroundColor ).toEqual( 'red' );

            done( autoDestroy );
        } )
    } );

} );

describe( "H. Trackbar combined positions and styles", function () {
    const comp        = new ComponentToTest();
    comp.styleIn = { minWidth: '300%' };
    const autoDestroy = true;

    describe('When rendering and tracks are visible', function () {
        it( comp.t( "Only Vertical Track: thumb should scroll up to the bottom" ), function test() {
            const aProps = {};
            return itRendered( comp.get( null, aProps ), function ( done ) {
                const { trackVertical } = this.refs;
                expect( trackVertical.className ).toContain( 'extended' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "Only Horizontal Track: thumb should scroll up to the right" ), function test() {
            const aProps = { showVertical:false, showHorizontal:true };
            return itRendered( comp.get( null, aProps ), function ( done ) {
                const { trackHorizontal } = this.refs;
                expect( trackHorizontal.className ).toContain( 'extended' );
                done( autoDestroy );
            } )
        } );
        it( comp.t( "Both tracks Track: thumb should scroll but limited each other" ), function test() {
            const aProps = { showHorizontal:true };
            return itRendered( comp.get( null, aProps ), function ( done ) {
                const { trackHorizontal, trackVertical } = this.refs;
                expect( trackHorizontal.className ).toContain( 'shrinked' );
                expect( trackVertical.className ).toContain( 'shrinked' );
                done( autoDestroy );
            } )
        } );
    });

    describe('On Moving when autoHide is activated', function () {
        it( comp.t( "Both Activated only vTrack moving: track extended" ), function test() {
            const aProps = { showHorizontal: true, autoHide:true };
            return itRendered( comp.get( null, aProps ), function ( done ) {
                this.api.toTop(30);
                setTimeout(()=>{
                    const { trackVertical } = this.refs;
                    expect( trackVertical.className ).toContain( 'extended' );
                    done( autoDestroy );
                },30);
            } )
        } );
        it( comp.t( "Both Activated only hTrack moving: track extended" ), function test() {
            const aProps = { autoHide:true, showHorizontal:true };
            return itRendered( comp.get( null, aProps ), function ( done ) {
                this.api.toLeft(30);
                setTimeout(()=>{
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.className ).toContain( 'extended' );
                    done( autoDestroy );
                },30);
            } )
        } );
        it( comp.t( "Both tracks Track: must re-adapt after movement" ), function test() {
            const aProps = { showHorizontal:true, autoHide:true };
            return itRendered( comp.get( null, aProps ), function ( done ) {
                const { trackHorizontal, trackVertical } = this.refs;
                this.api.toTop(30);
                setTimeout( ()=>{
                    expect( trackVertical.className ).toContain( 'extended' );
                    this.api.toLeft(30);
                    setTimeout( ()=>{
                        expect( trackHorizontal.className ).toContain( 'shrinked' );
                        expect( trackVertical.className ).toContain( 'shrinked' );
                        done( autoDestroy );
                    } ,30);
                } ,30);
            } )
        } );
    });

} );

// Prevent scroll on deactivated axis
// Integrate backface visibility hack to styles to avoid re-calculations
