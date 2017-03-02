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
    
    describe(pref + "1 - Events by Props", function () {
        const sharedProps = { showVertical:true, showHorizontal:true };
        const autoDestroy    = true;
        
        describe(pref + "1 When in Possible Scenarios ", function () {
            it( "A. onScroll", function () {
                const spy = createSpy();
                return itRendered(
                    component( { ...sharedProps, onScroll: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toHaveBeenCalled();
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 250 );
                    } );
            });
            it( "B. onScrollStart", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onScrollStart: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toHaveBeenCalled();
                            expect( spy.calls[0].arguments.length ).toEqual(1);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "C. onScrollEnd", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onScrollEnd: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toHaveBeenCalled();
                            expect( spy.calls[0].arguments.length ).toEqual(1);
                            done( autoDestroy );
                        }, 400 );
                    } );
            } );
            it( "D. onScrollFrame", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onScrollFrame: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toHaveBeenCalled();
                            expect( spy.calls[0].arguments.length ).toEqual(1);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "E. onUpdate", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onUpdate: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(1);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "F. atBottom", function () {
                const spy = createSpy();
                return itRendered(
                    component( { atBottom: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToBottom(0);
                        setTimeout( function () {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "G. atTop", function () {
                const spy = createSpy();
                return itRendered(
                    component( { atTop: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop(30);
                
                        setTimeout( ()=> {
                            this.scrollToTop(0);
                        },100);
                
                        setTimeout( ()=> {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 250 );
                    } );
            } );
            it( "H. atRight", function () {
                const spy = createSpy();
                const contentStyleR   = { width: '400%', };
                return itRendered(
                    component( { atRight: spy, showHorizontal:true }, componentStyle, contentStyleR ),
                    function callback(done) {
                        this.scrollToRight(0);
                        setTimeout( function () {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "I. atLeft", function () {
                const spy = createSpy();
                const contentStyleR   = { width: '400%', };
                return itRendered(
                    component( { atLeft: spy, showHorizontal:true }, componentStyle, contentStyleR ),
                    function callback(done) {
                        this.scrollToLeft(30);
                
                        setTimeout( ()=> {
                            this.scrollToLeft(0);
                        },300);
                
                        setTimeout( () => {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 950 );
                    } );
            } );
        });
    
        describe(pref + "1 When in IMPOSSIBLE Scenarios ", function () {
            it( "A. onScroll and Nothing to scroll", function () {
                const spy = createSpy();
                return itRendered(
                    component( { ...sharedProps, onScroll: spy }, componentStyle, {maxWidth:90, maxHeight:90, overflow:'hidden'}, 'onScroll' ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toNotHaveBeenCalled();
                            done( autoDestroy );
                        }, 250 );
                    } );
            });
            it( "B. onScrollStart", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onScrollStart: spy }, componentStyle, {maxWidth:90, maxHeight:90, overflow:'hidden'}, 'onScrollStart' ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toNotHaveBeenCalled();
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "C. onScrollEnd", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onScrollEnd: spy }, componentStyle, {maxWidth:90, maxHeight:90, overflow:'hidden'}, 'onScrollEnd' ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toNotHaveBeenCalled();
                            done( autoDestroy );
                        }, 400 );
                    } );
            } );
            it( "D. onScrollFrame", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onScrollFrame: spy }, componentStyle, {maxWidth:90, maxHeight:90, overflow:'hidden'}, 'onScrollFrame' ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy ).toNotHaveBeenCalled();
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "E. onUpdate", function () {
                const spy = createSpy();
                return itRendered(
                    component( { onUpdate: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop( 20 );
                        setTimeout( function () {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(1);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "F. atBottom", function () {
                const spy = createSpy();
                return itRendered(
                    component( { atBottom: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToBottom(0);
                        this.scrollToBottom(0);
                        setTimeout( function () {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "G. atTop", function () {
                const spy = createSpy();
                return itRendered(
                    component( { atTop: spy }, componentStyle, contentStyle ),
                    function callback(done) {
                        this.scrollToTop(30);
                    
                        setTimeout( ()=> {
                            this.scrollToTop(0);
                            this.scrollToTop(0);
                        },100);
                    
                        setTimeout( ()=> {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 250 );
                    } );
            } );
            it( "H. atRight", function () {
                const spy = createSpy();
                const contentStyleR   = { width: '400%', };
                return itRendered(
                    component( { atRight: spy, showHorizontal:true }, componentStyle, contentStyleR ),
                    function callback(done) {
                        this.scrollToRight(0);
                        this.scrollToRight(0);
                        setTimeout( function () {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 100 );
                    } );
            } );
            it( "I. atLeft", function () {
                const spy = createSpy();
                const contentStyleR   = { width: '400%', };
                return itRendered(
                    component( { atLeft: spy, showHorizontal:true }, componentStyle, contentStyleR ),
                    function callback(done) {
                        this.scrollToLeft(30);
                    
                        setTimeout( ()=> {
                            this.scrollToLeft(0);
                            this.scrollToLeft(0);
                        },300);
                    
                        setTimeout( () => {
                            expect( spy.calls.length ).toEqual( 1 );
                            expect( spy.calls[0].arguments.length ).toEqual(2);
                            done( autoDestroy );
                        }, 950 );
                    } );
            } );
        });
    });
    
}