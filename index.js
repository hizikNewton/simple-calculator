const jsdom = require( 'jsdom' );
const { JSDOM } = require('jsdom');
const fs = require( 'fs' );

const html = fs.readFileSync('index.html' ).toString();

var dom = new JSDOM( html,{ runScripts: "dangerously",resources: "usable" });
const keys = document.querySelectorAll(".bottom span");
const deleteBtn = document.querySelector(".delete");
const result = document.querySelector(".result");

keys.forEach(key => {
  key.addEventListener("click",handleKeyPress);
});

let val = '';
let last = ''
let entry
const operators = ["+", "-", "x", "÷"];
let userInput = []

let inputDisplay = dom.window.document.querySelector(".input")



function handleKeyPress(e){
  entry = e.target.dataset.key;
  if(operators.indexOf(entry)!=-1){
    userInput = userInput.concat([val,entry])
  }
  entry = justOneDecimal(entry,userInput,last)
  val = val+entry;
  last = val.replace(userInput.join(''),'');
  val = normalize(val,last,entry)
  inputDisplay.innerHTML = val;
  }

function tokenizeUserInput(){
  userInput = userInput.concat(last)
  return userInput
  }

function normalize(val){
  if((operators.indexOf(val[0])!==-1) && val[0]!='-'){
    val = val.slice(1)
    return val
  }
  return val
}

function justOneDecimal(entry,userInput,last){
  let checkVal
  if(entry =='.' && userInput.length == 0){
     checkVal = val
     if(entry =='.' && ((checkVal.match(/\./g) ||'').length)>0){
       entry=''
       return entry;
    }
  }
  
  if(entry =='.' && (userInput.length>0)){
    checkVal = last
    if(((checkVal.match(/\./g) ||'').length)>0){
    entry = ''
    }
  }
  return entry
}

function evaluate(e){}

function deleteKeyPress(e){
  userInput = []
  val =''
  last=''
  inputDisplay.textContent = '';
}

const fn = {
  inputDisplay,
  handleKeyPress,
  tokenizeUserInput,
  deleteKeyPress
}
module.exports = fn;
