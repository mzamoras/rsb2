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


const componentStyle = { width: 100, height: 100, border: '1px solid green', margin: 0 };
const contentStyle   = { minWidth: 2000, minHeight: 800 };

export default function doTest( component, prefix ) {
    const pref = prefix + ".";
    
    describe(pref + "1 - Api Methods", function () {
        const sharedProps = { showVertical:true, showHorizontal:true };
        const autoDestroy    = true;
        
        describe(pref + "1 When in Possible Scenarios ", function () {
            it("A. ScrollToTop", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToTop' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToTop( 30 );
                        expect( view.scrollTop ).toEqual( 30 );
                        done( autoDestroy );
                    } );
            });
            it("B. ScrollToBottom", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToBottom' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToBottom( 30 );
                        expect( view.scrollTop ).toEqual( this.current.data.maxScrollTop - 30 );
                        done( autoDestroy );
                    } );
            });
            it("C. ScrollToLeft", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToLeft' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToLeft( 30 );
                        expect( view.scrollLeft ).toEqual( 30 );
                        done( autoDestroy );
                    } );
            });
            it("D. ScrollToRight", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToRight' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToRight( 30 );
                        expect( view.scrollLeft ).toEqual( this.current.data.maxScrollLeft - 30 );
                        done( autoDestroy );
                    } );
            });
            it("E. FlashBars [Both]", function () {
                return itRendered(
                    component( {...sharedProps, autoHide:true, flashTime:0}, componentStyle, contentStyle, 'FlashBars' ),
                    function (done) {
                        const { trackVertical, trackHorizontal } = this.refs;
                        this.flashBars( 'both', 100 );
                        expect( trackVertical.style.opacity ).toEqual( 1 );
                        expect( trackHorizontal.style.opacity ).toEqual( 1 );
                        setTimeout(()=>{
                            expect( trackVertical.style.opacity ).toEqual( 0 );
                            expect( trackHorizontal.style.opacity ).toEqual( 0 );
                            done( autoDestroy );
                        },150);
                    } );
            });
            it("F. FlashBars [Vertical]", function () {
                return itRendered(
                    component( {...sharedProps, autoHide:true, flashTime:0}, componentStyle, contentStyle, 'FlashBars' ),
                    function (done) {
                        const { trackVertical, trackHorizontal } = this.refs;
                        this.flashBars( 'vertical', 100 );
                        expect( trackVertical.style.opacity ).toEqual( 1 );
                        expect( trackHorizontal.style.opacity ).toEqual( 0 );
                        setTimeout(()=>{
                            expect( trackVertical.style.opacity ).toEqual( 0 );
                            expect( trackHorizontal.style.opacity ).toEqual( 0 );
                            done( autoDestroy );
                        },150);
                    } );
            });
            it("G. FlashBars [Horizontal]", function () {
                return itRendered(
                    component( {...sharedProps, autoHide:true, flashTime:0}, componentStyle, contentStyle, 'FlashBars' ),
                    function (done) {
                        const { trackVertical, trackHorizontal } = this.refs;
                        this.flashBars( 'horizontal', 100 );
                        expect( trackVertical.style.opacity ).toEqual( 0 );
                        expect( trackHorizontal.style.opacity ).toEqual( 1 );
                        setTimeout(()=>{
                            expect( trackVertical.style.opacity ).toEqual( 0 );
                            expect( trackHorizontal.style.opacity ).toEqual( 0 );
                            done( autoDestroy );
                        },150);
                    } );
            });
        });
    
        describe(pref + "2 When in IMPOSSIBLE Scenarios ", function () {
            it("A. ScrollToTop when already at top", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToTop' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToTop( -30 );
                        expect( view.scrollTop ).toEqual( 0 );
                        done( autoDestroy );
                    } );
            });
            it("B. ScrollToBottom when already at bottom", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToBottom' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToBottom( -30 );
                        expect( view.scrollTop ).toEqual( this.current.data.maxScrollTop );
                        done( autoDestroy );
                    } );
            });
            it("C. ScrollToLeft when already at left", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToLeft' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToLeft( -30 );
                        expect( view.scrollLeft ).toEqual( 0 );
                        done( autoDestroy );
                    } );
            });
            it("D. ScrollToRight when already at right", function () {
                return itRendered(
                    component( sharedProps, componentStyle, contentStyle, 'ScrollToRight' ),
                    function (done) {
                        const { view } = this.refs;
                        this.scrollToRight( -30 );
                        expect( view.scrollLeft ).toEqual( this.current.data.maxScrollLeft );
                        done( autoDestroy );
                    } );
            });
            it("E. FlashBars [Both] when autoHide is false", function () {
                return itRendered(
                    component( {...sharedProps, autoHide:false, flashTime:0}, componentStyle, contentStyle, 'FlashBars' ),
                    function (done) {
                        const { trackVertical, trackHorizontal } = this.refs;
                        this.flashBars( 'both', 100 );
                        expect( trackVertical.style.opacity ).toEqual( '' );
                        expect( trackHorizontal.style.opacity ).toEqual( '' );
                        setTimeout(()=>{
                            expect( trackVertical.style.opacity ).toEqual( '' );
                            expect( trackHorizontal.style.opacity ).toEqual( '' );
                            done( autoDestroy );
                        },150);
                    } );
            });
            it("E. FlashBars [Both] when trackVertical is not present", function () {
                return itRendered(
                    component( {...sharedProps, autoHide:true, flashTime:0, showVertical:false}, componentStyle, contentStyle, 'FlashBars' ),
                    function (done) {
                        const { trackVertical, trackHorizontal } = this.refs;
                        this.flashBars( 'both', 100 );
                        expect( trackVertical.style.display ).toEqual( 'none' );
                        expect( trackHorizontal.style.opacity ).toEqual( 1 );
                        setTimeout(()=>{
                            expect( trackVertical.style.display ).toEqual( 'none' );
                            expect( trackHorizontal.style.opacity ).toEqual( 0 );
                            done( autoDestroy );
                        },150);
                    } );
            });
            it("E. FlashBars [Both] when trackHorizontal is not present", function () {
                return itRendered(
                    component( {...sharedProps, autoHide:true, flashTime:0, showHorizontal:false}, componentStyle, contentStyle, 'FlashBars' ),
                    function (done) {
                        const { trackVertical, trackHorizontal } = this.refs;
                        this.flashBars( 'both', 100 );
                        expect( trackVertical.style.opacity ).toEqual( 1 );
                        expect( trackHorizontal.style.display ).toEqual( 'none' );
                        setTimeout(()=>{
                            expect( trackVertical.style.opacity ).toEqual( 0 );
                            expect( trackHorizontal.style.display ).toEqual( 'none' );
                            done( autoDestroy );
                        },150);
                    } );
            });
        });
        
        
        
    });
    
}