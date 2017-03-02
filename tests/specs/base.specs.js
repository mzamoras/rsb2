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
import ReactTestUtils, {Simulate} from 'react-addons-test-utils';
import expect, {createSpy} from 'expect';
import {itRendered} from './mochaTDDSetup';
//import simulant from 'simulant';

/* global describe it */

const componentStyle = { width: 100, height: 100, border: '1px solid green', margin: 0 };
const contentStyle   = { width: 100, minHeight: 800 };
const autoDestroy    = true;



export default function doTest( component, prefix ) {
    const pref = prefix + ".";
    
    describe(pref + "1 - Elements Existence", function () {
        const thisComponent  = component( {}, componentStyle, {}, 'Elements' );
        const autoDestroy    = true;
        
        describe("A. Default", function () {
            it( 'Container', function test() {
                return itRendered( thisComponent, function (done) {
                    const { container } = this.refs;
                    expect( container).toExist();
                    done( autoDestroy );
                } )
            } );
            it( 'View', function test() {
                return itRendered( thisComponent, function (done) {
                    const { view } = this.refs;
                    expect( view).toExist();
                    done( autoDestroy );
                } )
            } );
            it( 'trackVertical', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical).toExist();
                    done( autoDestroy );
                } )
            } );
            it( 'thumbVertical', function test() {
                return itRendered( thisComponent, function (done) {
                    const { thumbVertical } = this.refs;
                    expect( thumbVertical).toExist();
                    done( autoDestroy );
                } )
            } );
            it( 'trackHorizontal', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal).toExist();
                    done( autoDestroy );
                } )
            } );
            it( 'thumbHorizontal', function test() {
                return itRendered( thisComponent, function (done) {
                    const { thumbHorizontal } = this.refs;
                    expect( thumbHorizontal).toExist();
                    done( autoDestroy );
                } )
            } );
            it( "Window <style/>", function test() {
                return itRendered( thisComponent, function (done) {
                    expect( document.getElementById( this.props.cssStylesheetID.toLowerCase() ) ).toExist();
                    done( autoDestroy );
                } );
        
            } );
        });
        
    });
    
    describe(pref + "2 - Default CSS Class Styling", function () {
        const autoDestroy    = true;
        
        it( 'Container | Should apply the class provided and keep sb2-container', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    const { container } = this.refs;
                    expect( container.className ).toContain( 'testing-class' );
                    expect( container.className ).toContain( 'sb2-container' );
                    done( autoDestroy );
                } )
        } );
        it( 'Style tag should accepts class and applies it', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    expect( this.global.data.stylesheetObject.getObject().innerHTML ).toContain( 'testing-class' );
                    done( autoDestroy );
                } )
        } );
        it( 'View | should have class sb2-view', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    const { view } = this.refs;
                    expect( view.className ).toContain( 'sb2-view' );
                    done( autoDestroy );
                } )
        } );
        it( 'Vertical Track | should have class sb2-track and sb2-v', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical.className ).toContain( 'sb2-track' );
                    expect( trackVertical.className ).toContain( 'sb2-v' );
                    done( autoDestroy );
                } )
        } );
        it( 'Vertical Thumb | should have class sb2-thumb and sb2-h', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    const { thumbVertical } = this.refs;
                    expect( thumbVertical.className ).toContain( 'sb2-thumb' );
                    expect( thumbVertical.className ).toContain( 'sb2-v' );
                    done( autoDestroy );
                } )
        } );
        it( 'Horizontal Track | should have class sb2-track and sb2-v', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.className ).toContain( 'sb2-track' );
                    expect( trackHorizontal.className ).toContain( 'sb2-h' );
                    done( autoDestroy );
                } )
        } );
        it( 'Horizontal Thumb | should have class sb2-thumb and sb2-h', function test() {
            return itRendered(
                component( { cssStyleClass: 'testing-class' }, componentStyle, contentStyle ),
                function (done) {
                    const { thumbHorizontal } = this.refs;
                    expect( thumbHorizontal.className ).toContain( 'sb2-thumb' );
                    expect( thumbHorizontal.className ).toContain( 'sb2-h' );
                    done( autoDestroy );
                } )
        } );
    });
    
    describe(pref + "3 - Basic Styling", function () {
        const autoDestroy    = true;
        
        describe("A. Default: Vertical Only", function () {
            const thisComponent  = component( {}, componentStyle, {}, 'Style Default' );
            
            it( 'Container -       Position Relative, w:auto, h:auto', function test() {
                return itRendered( thisComponent, function (done) {
                    const { container } = this.refs;
                    expect( container.style.position ).toEqual( 'relative' );
                    expect( container.style.width ).toEqual( '100px' );
                    expect( container.style.height ).toEqual( '100px' );
                    done( autoDestroy );
                } )
            } );
            it( 'View -            Absolute Position(0,0,0,0)', function test() {
                return itRendered( thisComponent, function (done) {
                    const { view } = this.refs;
                    expect( view.style.position ).toEqual( 'absolute' );
                    expect( view.style.top ).toEqual( '0px' );
                    expect( view.style.left ).toEqual( '0px' );
                    expect( view.style.bottom ).toEqual( '0px' );
                    expect( view.style.right ).toEqual( '0px' );
                    done( autoDestroy );
                } )
            } );
            it( 'View -            Overflow, y:scroll, x:hidden', function test() {
                return itRendered( thisComponent, function (done) {
                    const { view } = this.refs;
                    expect( view.style.overflowY ).toEqual( 'scroll' );
                    expect( view.style.overflowX ).toEqual( 'hidden' );
                    done( autoDestroy );
                } )
            } );
            it( 'TrackVertical -   Absolute Position(0,0,0,null)', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical.style.position ).toEqual( 'absolute' );
                    expect( trackVertical.style.bottom ).toEqual( '0px' );
                    expect( trackVertical.style.right ).toEqual( '0px' );
                    expect( trackVertical.style.top ).toEqual( '0px' );
                    done( autoDestroy );
                } );
            } );
            it( 'TrackHorizontal - hidden', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.display ).toEqual( 'none' );
                    done( autoDestroy );
                } );
            } );
        });
    
        describe("B. Horizontal", function () {
            const thisComponent  = component( {
                showHorizontal:true, showVertical:false
            }, componentStyle, {}, 'Style Horizontal Only' );
            it( 'View - Overflow, x:scroll, y:hidden', function test() {
                return itRendered( thisComponent, function (done) {
                    const { view } = this.refs;
                    expect( view.style.overflowX ).toEqual( 'scroll' );
                    expect( view.style.overflowY ).toEqual( 'hidden' );
                    done( autoDestroy );
                } )
            } );
            it( 'trackHorizontal - Absolute Position(null,0,0,0)', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.position ).toEqual( 'absolute' );
                    expect( trackHorizontal.style.bottom ).toEqual( '0px' );
                    expect( trackHorizontal.style.right ).toEqual( '0px' );
                    expect( trackHorizontal.style.left ).toEqual( '0px' );
                    done( autoDestroy );
                } );
            } );
            it( 'trackVertical - hidden', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical.style.display ).toEqual( 'none' );
                    done( autoDestroy );
                } );
            } );
        });
    
        describe("C. Both Scrollbars", function () {
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true
            }, componentStyle, {}, 'Style Both' );
            it( 'View - Overflow, x:scroll, y:scroll', function test() {
                return itRendered( thisComponent, function (done) {
                    const { view } = this.refs;
                    expect( view.style.overflowX ).toEqual( 'scroll' );
                    expect( view.style.overflowY ).toEqual( 'scroll' );
                    done( autoDestroy );
                } )
            } );
            it( 'trackHorizontal - Absolute Position(null,0,0,0)', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.position ).toEqual( 'absolute' );
                    expect( trackHorizontal.style.bottom ).toEqual( '0px' );
                    expect( trackHorizontal.style.right ).toEqual( '0px' );
                    expect( trackHorizontal.style.left ).toEqual( '0px' );
                    done( autoDestroy );
                } );
            } );
            it( 'trackVertical - hidden', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical.style.position ).toEqual( 'absolute' );
                    expect( trackVertical.style.bottom ).toEqual( '0px' );
                    expect( trackVertical.style.right ).toEqual( '0px' );
                    expect( trackVertical.style.top ).toEqual( '0px' );
                    done( autoDestroy );
                } );
            } );
        });
    
        describe("D. AutoHeight", function () {
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true, autoHeight: true, autoHeightMin: 100, autoHeightMax: 200
            }, {}, {}, 'Auto Height' );
            it( 'View - Position Relative, w:100%, h:100%', function test () {
                return itRendered( thisComponent, function (done) {
                    const { view } = this.refs;
                    //const { scrollbarWidth } = this.cache;
                    expect( view.style.position ).toEqual( 'relative' );
                    expect( view.style.minHeight ).toEqual( '100px' );
                    expect( view.style.maxHeight ).toEqual( '200px' );
                    done( autoDestroy );
                } )
            } );
        });
    
        describe("E. No AutoHide ", function () {
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true, autoHide:false
            }, componentStyle, { minWidth: 800 }, 'No Auto Hide' );
            it( 'trackHorizontal - Not flashes', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.display ).toEqual( 'block' );
                    done( autoDestroy );
                } );
            } );
            it( 'trackVertical - Not Flashes', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical.style.display ).toEqual( 'block' );
                    done( autoDestroy );
                } );
            } );
        });
        
        describe("F. AutoHide Flash:0", function () {
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true, autoHide:true, flashTime:0
            }, componentStyle, { minWidth: 800 }, 'AutoHide Flash:0' );
            it( 'trackHorizontal - Not flashes', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.opacity ).toEqual( '0' );
                    done( autoDestroy );
                } );
            } );
            it( 'trackVertical - Not Flashes', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    expect( trackVertical.style.opacity ).toEqual( '0' );
                    done( autoDestroy );
                } );
            } );
        });
    
        describe("G. AutoHide Flash:150", function () {
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true, autoHide:true, flashTime:150, autoHideTimeout:100
            }, componentStyle, {}, 'autoHide Flash:150' );
            it( 'trackHorizontal - not Flashes', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.opacity ).toEqual( '0' );
                    done( autoDestroy );
                } );
            } );
            it( 'trackVertical - flashes', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    //expect( trackVertical.style.opacity ).toEqual( '1' );
                    setTimeout(()=>{
                        expect( trackVertical.style.opacity ).toEqual( '0' );
                        done( autoDestroy );
                    },this.props.autoHideTimeout + 100);
                } );
            } );
        });
        
        describe("H. ExpandTracks & AutoHide:ON", function () {
           
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true, autoHide:true, flashTime:0,
                autoHideTimeout:100, expandTracks:true
            }, componentStyle,{ minWidth:800 }, 'H Expand Tracks');
    
            it( 'trackVertical - Expand on mouse over if scrolling', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    this.scrollToTop(20);
                    Simulate.mouseEnter(trackVertical,{});
                    
                    setTimeout(()=>{
                        expect( trackVertical.style.opacity ).toEqual( '1' );
                        expect( trackVertical.classList.contains(this.cssClasses.expanded) ).toBeTruthy();
                        Simulate.mouseLeave(trackVertical,{});
                        done( false );
                    },250);
                } );
            } );
            it( 'trackHorizontal - Expand on mouse over if scrolling', function test() {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    this.scrollToLeft(20);
                    Simulate.mouseEnter(trackHorizontal,{});
                    /*simulant.fire(trackHorizontal, 'mouseenter', {
                        target: trackHorizontal,
                        clientY: top + (height / 2)
                    });*/
            
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity ).toEqual( '1' );
                        expect( trackHorizontal.classList.contains(this.cssClasses.expanded) ).toBeTruthy();
                        Simulate.mouseLeave(trackHorizontal,{});
                        done( autoDestroy );
                    },50);
                } );
            } );
        });
    
        describe("I. ExpandTracks & AutoHide:OFF", function () {
            
            const thisComponent  = component( {
                showHorizontal:true, showVertical:true,
                expandTracks:true
            }, componentStyle,{ minWidth:800 }, 'I Expand Tracks');
        
            it( 'trackVertical - Expand on mouse over if scrolling', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackVertical } = this.refs;
                    Simulate.mouseEnter(trackVertical,{});
                
                    setTimeout(()=>{
                        expect( trackVertical.style.opacity ).toEqual( '1' );
                        expect( trackVertical.classList.contains(this.cssClasses.expanded) ).toBeTruthy();
                        Simulate.mouseLeave(trackVertical,{});
                        done( autoDestroy );
                    },50);
                } );
            } );
            it( 'trackHorizontal - Expand on mouse over if scrolling', function test () {
                return itRendered( thisComponent, function (done) {
                    const { trackHorizontal } = this.refs;
                    Simulate.mouseEnter(trackHorizontal,{});
                
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity ).toEqual( '1' );
                        expect( trackHorizontal.classList.contains(this.cssClasses.expanded) ).toBeTruthy();
                        Simulate.mouseLeave(trackHorizontal,{});
                        done( autoDestroy );
                    },50);
                } );
            } );
        });
        
    });
    
    describe(pref + "4 - Style trough props", function () {
        const autoDestroy    = true;
    
        it( 'Container  | containerStyle={}', function test () {
            const customStyle = { backgroundColor: 'pink' };
            return itRendered(
                component( { containerStyle: customStyle }, componentStyle, contentStyle, 'Style trough Props' ),
                function (done) {
                    const { container } = this.refs;
                    expect( container.style.backgroundColor ).toEqual( 'pink' );
                    done( autoDestroy );
                } )
        } );
        it( 'Container  | style={}', function test () {
            const customStyle = { backgroundColor: 'pink' };
            return itRendered(
                component( { }, customStyle, contentStyle, 'Style trough Props' ),
                function (done) {
                    const { container } = this.refs;
                    expect( container.style.backgroundColor ).toEqual( 'pink' );
                    done( autoDestroy );
                } )
        } );
        it( 'View       | viewStyle={}', function test () {
            const customStyle = { backgroundColor: 'orange' };
            return itRendered(
                component( { viewStyle: customStyle }, componentStyle, contentStyle ),
                function (done) {
                    const { view } = this.refs;
                    expect( view.style.backgroundColor ).toEqual( 'orange' );
                    done( autoDestroy );
                } )
        } );
        it( 'TrackBars  | tracksStyle={}', function test () {
            const customStyle = { backgroundColor: 'orange' };
            return itRendered(
                component( { tracksStyle: customStyle }, componentStyle, contentStyle ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    expect( trackVertical.style.backgroundColor ).toEqual( 'orange' );
                    expect( trackHorizontal.style.backgroundColor ).toEqual( 'orange' );
                    done( autoDestroy );
                } )
        } );
        it( 'Thumbs     | thumbsStyle={}', function test () {
            const customStyle = { backgroundColor: 'pink' };
            return itRendered(
                component( { thumbsStyle: customStyle }, componentStyle, contentStyle ),
                function (done) {
                    const { thumbVertical, thumbHorizontal } = this.refs;
                    expect( thumbVertical.style.backgroundColor ).toEqual( 'pink' );
                    expect( thumbHorizontal.style.backgroundColor ).toEqual( 'pink' );
                    done( autoDestroy );
                } )
        } );
    });
    
    describe(pref + "5 - Style based on NON STYLING PROPS", function () {
        const autoDestroy    = true;
        
        it( 'Thumb [thumbMinSize:0] NO MinWidth and NO MinHeight', function test () {
            return itRendered(
                component( { thumbMinSize:0, showHorizontal:true }, componentStyle, {width: 2000, height:2000 }, 'Style trough Props' ),
                function (done) {
                    //100/2000 * (100 -4) = 4.8
                    const { thumbVertical, thumbHorizontal, view } = this.refs;
                    const h = 100/view.scrollHeight * 96;
                    const w = 100/view.scrollWidth * 96;
                    expect( thumbVertical.style.height).toEqual( ( Math.round( h * 100 ) / 100 ) + 'px' );
                    expect( thumbHorizontal.style.width).toEqual( ( Math.round( w * 100 ) / 100 ) + 'px' );
                    done( autoDestroy );
                } );
        } );
        it( 'Thumb [thumbMinSize:22] MinWidth:22px and MinHeight:22px', function test () {
            return itRendered(
                component( { thumbMinSize:22, showHorizontal:true }, componentStyle, {minWidth: 2000, minHeight:2000 }, 'Style trough Props' ),
                function (done) {
                    //100/2000 * (100 -4) = 4.8
                    const { thumbVertical, thumbHorizontal } = this.refs;
                    expect( thumbVertical.style.height).toEqual( '22px' );
                    expect( thumbHorizontal.style.width).toEqual( '22px' );
                    done( autoDestroy );
                } )
        } );
        it( 'trackVertical [hideUnnecessary:true], configured but not necessary', function test () {
            return itRendered(
                component( { showHorizontal:true }, componentStyle, { maxHeight:100, minWidth:2000, overflow:'hidden' }, 'Style trough Props' ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.display).toEqual( 'block' );
                    expect( trackVertical.style.display).toEqual( 'none' );
                    done( autoDestroy );
                } );
        } );
        it( 'trackHorizontal [hideUnnecessary:true], configured but not necessary', function test () {
            return itRendered(
                component( { showHorizontal:true }, componentStyle, {}, 'Style trough Props' ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    expect( trackHorizontal.style.display).toEqual( 'none' );
                    expect( trackVertical.style.display).toEqual( 'block' );
                    done( autoDestroy );
                } );
        } );
        it( 'trackVertical [SyncTracks:true]', function test () {
            return itRendered(
                component( { showHorizontal:true, syncTracks:true, autoHide:true, flashTime:0, autoHideTimeout:100 }, componentStyle, {minWidth:2000, minHeight:2000}, 'SyncTracks' ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    this.scrollToTop(30);
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 1 );
                        expect( trackVertical.style.opacity).toEqual( 1);
                    },30);
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 0 );
                        expect( trackVertical.style.opacity).toEqual( 0 );
                    },300);
                    done( autoDestroy );
                } );
        } );
        it( 'trackHorizontal [SyncTracks:true]', function test () {
            return itRendered(
                component( { showHorizontal:true, syncTracks:true, autoHide:true, flashTime:0, autoHideTimeout:100 }, componentStyle, {minWidth:2000, minHeight:2000}, 'SyncTracks' ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    this.scrollToLeft(30);
                    
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 1 );
                        expect( trackVertical.style.opacity).toEqual( 1);
                    },30);
                    
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 0 );
                        expect( trackVertical.style.opacity).toEqual( 0 );
                    },300);
                    done( autoDestroy );
                } );
        } );
        it( 'trackVertical [SyncTracks:false]', function test () {
            return itRendered(
                component( { showHorizontal:true, syncTracks:true, autoHide:true, flashTime:0, autoHideTimeout:100 }, componentStyle, {minWidth:2000, minHeight:2000}, 'SyncTracks' ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    this.scrollToTop(30);
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 0 );
                        expect( trackVertical.style.opacity).toEqual( 1);
                    },30);
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 0 );
                        expect( trackVertical.style.opacity).toEqual( 0 );
                    },300);
                    done( autoDestroy );
                } );
        } );
        it( 'trackHorizontal [SyncTracks:false]', function test () {
            return itRendered(
                component( { showHorizontal:true, syncTracks:true, autoHide:true, flashTime:0, autoHideTimeout:100 }, componentStyle, {minWidth:2000, minHeight:2000}, 'SyncTracks' ),
                function (done) {
                    const { trackVertical, trackHorizontal } = this.refs;
                    this.scrollToLeft(30);
                
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 1 );
                        expect( trackVertical.style.opacity).toEqual( 0);
                    },30);
                
                    setTimeout(()=>{
                        expect( trackHorizontal.style.opacity).toEqual( 0 );
                        expect( trackVertical.style.opacity).toEqual( 0 );
                    },300);
                    done( autoDestroy );
                } );
        } );
    });
}