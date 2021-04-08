const jsdom = require( 'jsdom' );
const { JSDOM } = require('jsdom');
const fs = require( 'fs' );

const html = fs.readFileSync('index.html' ).toString();

var dom = new JSDOM( html,{ runScripts: "dangerously",resources: "usable" });
/* 
let inputDisplay = document.querySelector(".input") */
const keys = document.querySelectorAll(".bottom span");
const deleteBtn = document.querySelector(".delete");
const result = document.querySelector(".result");

keys.forEach(key => {
  key.addEventListener("click",handleKeyPress);
});

let val = '';
let last = ''
const operators = ["+", "-", "x", "÷"];
let userInput = []

let inputDisplay = dom.window.document.querySelector(".input")



function handleKeyPress(e){
  entry = e.target.dataset.key;
  if(operators.indexOf(entry)!=-1){
    userInput = userInput.concat([val,entry])
  }
  val = val+entry;
  last = val.replace(userInput.join(''),'');
  val = normalize(val,last,entry)
  inputDisplay.innerHTML = val;
  }

function tokenizeUserInput(){
  userInput = userInput.concat(last)
  return userInput
  }

function normalize(val,last,entry){
  if((operators.indexOf(val[0])!==-1) && val[0]!='-'){
    val = val.slice(1)
    return val
  }
  if(entry =='.' && ((last.match(/\./g) ||'').length)>1){
    last = last.slice(0,-1)
    return last
  }
  return val
}

function evaluate(e){}

function deleteKeyPress(e){
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
