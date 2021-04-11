'use strict';
const jsdom = require( 'jsdom' );
const { JSDOM } = require('jsdom');
const fs = require( 'fs' );
const html = fs.readFileSync('index.html' ).toString();
const virtualConsole = new jsdom.VirtualConsole();
const {inputDisplay,handleKeyPress,handleDelete,delKey,handleClear,evaluate,tokenizeUserInput,makeComputable,resultDisplay} = require( '../index.js' );

var dom = new JSDOM( html,{ runScripts: "dangerously",resources: "usable" },{ virtualConsole: virtualConsole.sendTo(console) });


let toInput,output,resultDisplayArr,pressTimer

if ( global !== undefined ) {
    global.window = dom.window;
    global.document = dom.window.document;
  }

const deleteInput = () =>{
    delKey.addEventListener("click",handleDelete);
    delKey.dispatchEvent(new dom.window.MouseEvent('click'));
}

const handleMouseup = ()=>clearTimeout(pressTimer);

const handleMousedown = ()=>{
    pressTimer = window.setTimeout(handleClear(),1000);
  }

const clearInput = ()=>{
    delKey.addEventListener("mouseup",handleMouseup);
    delKey.addEventListener("mousedown",handleMousedown);
    delKey.dispatchEvent(new dom.window.MouseEvent('mousedown'));
    delKey.dispatchEvent(new dom.window.MouseEvent('mouseup'));
}

function runInput(input){
    resultDisplayArr = []
    for (const i of input){
        i.split("").forEach(elem=>{
            let key = dom.window.document.querySelector(`.bottom span[data-key~="${elem}"]`);
            key.addEventListener("click",handleKeyPress);
            key.addEventListener("click",evaluate);
            key.dispatchEvent(new dom.window.MouseEvent('click'));
            resultDisplayArr.push(resultDisplay.innerHTML)
        })
    }
}

function runArrayInput(inputArr,callback){
    let result = []
    let resultAndCbkResult = {}
    inputArr.forEach((i)=>{
        runInput(i)
        result.push(inputDisplay.textContent)
        clearInput()
    });
    if(callback){
        result.forEach((i)=>{
            resultAndCbkResult[i] = callback(i)
        })
        return resultAndCbkResult
    }
    return result
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
                    ['-','x','.23','+','8'],
                    ["18","÷","x","42"]
                ]
        let result = runArrayInput(toInput)
        
        output = [ '124÷2456', '-234-789', '1234x321','1234÷5426','.23+8','18x42' ]
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

describe('Results',()=>{
        let toInput = [
            ["5362","x","1234"],
            ["1234","÷","2456"],
            ["-","234","+","246"],
            ["x","1234","-","24.56"],
            ["5.362","+","12.3.4"],
            ["x","1234","-","x","321"],
            ["+","-","1234","+","÷","5426"],
            ["0.234","+","0789"],
            ["-01234","-","0.321"]
        ]
    it('should return a computable string',()=>{
        let result = Object.values(runArrayInput(toInput,makeComputable))
        output = ['5362*1234', '1234/2456','-234+246','1234-24.56','5.362+12.34','1234*321','-1234/5426','0.234+789', '-1234-0.321']
        expect(result).toEqual(output)
    })

    it('evaluate on the go',()=>{
       toInput = toInput[2]
        runInput(toInput)
        let answer = ["","","","","","-232","-210","12"]
        clearInput()
        expect(resultDisplayArr).toEqual(answer)
    })
})

describe('Delete Operator',()=>{
    let toInput = "5362x1234"
    it('removes the last entry',()=>{
        runInput(toInput)
        deleteInput()
        expect(inputDisplay.textContent).toMatch('5362x123')
    });
    it('longpress should clear screen',()=>{
        clearInput()
        let display = inputDisplay.innerHTML===""&&resultDisplay.innerHTML===""?true:false
        expect(display).toBe(true)
    });
    
});
describe('Equal Operator',()=>{
    it('becomes CLR on equal-to operator key pressed',()=>{
        toInput = ['234x456=']
        runInput(toInput)
        expect(inputDisplay.innerHTML).toMatch(eval(234*456).toString())
        expect(delKey.innerHTML).toMatch('CLR')
    })
})