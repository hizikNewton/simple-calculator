'use strict';
const jsdom = require( 'jsdom' );
const { JSDOM } = require('jsdom');
const fs = require( 'fs' );

const html = fs.readFileSync('index.html' ).toString();

const virtualConsole = new jsdom.VirtualConsole();

var dom = new JSDOM( html,{ runScripts: "dangerously",resources: "usable" },{ virtualConsole: virtualConsole.sendTo(console) });

const {inputDisplay,handleKeyPress,deleteKeyPress,tokenizeUserInput,result} = require( '../index.js' );

let toInput,output

if ( global !== undefined ) {
    global.window = dom.window;
    global.document = dom.window.document;
  }

function runInput(input){
    for (const i of input){
        i.split("").forEach(elem=>{
            let key = dom.window.document.querySelector(`.bottom span[data-key~="${elem}"]`);
            key.addEventListener("click",handleKeyPress);
            key.dispatchEvent(new dom.window.MouseEvent('click'));
        })
    }
}
function clearInput(){
    let key = dom.window.document.querySelector(".delete")
    key.addEventListener("click",deleteKeyPress);
    key.dispatchEvent(new dom.window.MouseEvent('click'));
}

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
        toInput = ["5362","+","1234"]
        let userInput = toInput.join('');
        runInput(toInput)
        expect(inputDisplay.textContent).toBe(userInput)
    });

    it('should be an array of strings',()=>{
        let tokened = tokenizeUserInput()
        expect(tokened).toEqual(toInput)
    });

    it('can only starts with (-)operator',()=>{
        clearInput()
        toInput = [["+","124","x","2456"],["-","234","+","246"],["x","1234","-","2456"],["+","1234","÷","2456"]]
        output = []
        toInput.forEach((i)=>i[0]=="-"?output.push(i.join("")):output.push(i.slice(1).join('')))
        //output = [ '124*2456', '-234+246', '1234-2456', '1234*2456' ]
        let toOutput = []
        toInput.forEach(i=>{
            clearInput()
            runInput(i);
            toOutput.push(inputDisplay.innerHTML)
        });
       expect(toOutput).toEqual(output)
    });

    it.only('contains only one decimal point',()=>{
        clearInput()
        toInput = ["5.36.2","+",".12.34"]
        output = "5.362+1.234"
        runInput(toInput)
        expect(inputDisplay.textContent).toMatch(output)
    })
    //remove leading zero if integer
    
})