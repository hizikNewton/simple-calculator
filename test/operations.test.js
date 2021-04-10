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
function runArrayInput(inputArr){
    let result = []
    inputArr.forEach((i)=>{
        runInput(i)
        result.push(inputDisplay.textContent)
        clearInput()
    });
    return result
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
    it('displays a correct string',()=>{
        toInput = [["5362","x","1234"],["1234","÷","2456"]]
        output = []
        toInput.forEach((i)=>{
            i = i.join('')
            output.push(i)
        })
        /* toInput.forEach((i)=>{
            i = i.join('').push()i
            i.includes('x')?output.push(i.replace('x','*'))
            :i.includes('÷')?output.push(i.replace('÷','/')) 
            :output.push(i)
        })
        toInput.forEach((i)=>{
            runInput(i)
            result.push(inputDisplay.textContent)
            clearInput()
        }); */

        let result = runArrayInput(toInput)
        expect(result).toEqual(output)
    });

    it('should be an array of strings',()=>{
        clearInput()
        toInput = ["5.362","+","12.34"]
        runInput(toInput)
        let tokened = tokenizeUserInput()
        expect(tokened).toEqual(toInput)
    });

    it('can only starts with minus(-) as operator',()=>{
        clearInput()
        toInput = [["+","124","x","2456"],["-","234","+","246"],["x","1234","-","2456"],["+","1234","÷","2456"]]
        output = [ '124x2456', '-234+246', '1234-2456', '1234÷2456' ]
        let toOutput = []
        toInput.forEach(i=>{
            clearInput()
            runInput(i);
            toOutput.push(inputDisplay.innerHTML)
        });
       expect(toOutput).toEqual(output)
    });

    it('contains only one decimal point',()=>{
        clearInput()
        toInput = ["5.362","+","12.3.4"]
        output = "5.362+12.34"
        runInput(toInput)
        expect(inputDisplay.textContent).toMatch(output)
    })
    //cannot contain double operator
    it('cannot contain double operator',()=>{
        clearInput()
        toInput = [
                    ["+","124","x","÷","2456"],
                    ["-","234","+","-","789"],
                    ["x","1234","-","x","321"],
                    ["+","1234","+","÷","5426"],
                    ["18","÷","x","42"]
                ]
        let result = runArrayInput(toInput)
        
        output = [ '124÷2456', '-234-789', '1234x321','1234÷5426','18x42' ]
        expect(result).toEqual(output)
    });
    //remove leading zero
    it('should remove leading zero',()=>{
        toInput = [
            ["0000124","÷","026"],
            ["+0124","x","02456"],
            ["0.234","+","0789"],
            ["-01234","-","0.321"]
        ]
        let result = runArrayInput(toInput)
        output = ['124÷26', '124x2456', '0.234+789', '-1234-0.321']
        expect(result).toEqual(output)
    });
})