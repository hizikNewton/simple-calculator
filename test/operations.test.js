'use strict';
const jsdom = require( 'jsdom' );
const { JSDOM } = require('jsdom');
const fs = require( 'fs' );

const html = fs.readFileSync('index.html' ).toString();

const virtualConsole = new jsdom.VirtualConsole();

var dom = new JSDOM( html,{ runScripts: "dangerously",resources: "usable" },{ virtualConsole: virtualConsole.sendTo(console) });

const {handleKeyPress,tokenizeUserInput} = require( '../index.js' );

let toInput,input

beforeAll(()=>{
    // set the global window and document objects using JSDOM
// global is a node.js global object
if ( global !== undefined ) {
    global.window = dom.window;
    global.document = dom.window.document;
  }
    input = dom.window.document.querySelector(".input").innerHTML;
    toInput = ["5362","+","1234"]
    for (const i of toInput){
        i.split("").forEach(elem=>{
            let key = dom.window.document.querySelector(`.bottom span[data-key~="${elem}"]`);
            key.addEventListener("click",handleKeyPress);
            key.dispatchEvent(new dom.window.MouseEvent('click'));
        })
    }
});

describe('Browser Window',()=>{
    test( 'sees if window is available before loading DOM...', () => {
        /* console.log(document.body.textContent.trim()); */
        expect( window !== undefined ).toBe( true );
    } );
    
    test( 'verifies document is available before loading DOM...', () => {
        expect( document !== undefined && document !== null ).toBe( true );
    } );
 })

describe('UserInput',()=>{
    it('displays a computable string',()=>{
        let userInput = toInput.join('')
        expect(input).toBe(userInput)
    })
    it('should be an array of strings',()=>{
        input = tokenizeUserInput()
        expect(input).toEqual(toInput)
    });
})