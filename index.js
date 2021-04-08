
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
const operators = ["+", "-", "x", "÷"];
let userInput = []

input = dom.window.document.querySelector(".input")

const handleKeyPress = (e)=> {
  entry = e.target.dataset.key;
  if(operators.indexOf(entry)!=-1){
    userInput = userInput.concat([val,entry])
  }
  val = val+entry
  last = val.replace(userInput.join(''),'')
  dom.window.document.querySelector(".input").innerHTML = val
  }

function tokenizeUserInput(){
  userInput = userInput.concat(last)
  return userInput
  }

function evaluate(e){}

function deleteKeyPress(e){}

const fn = {
  handleKeyPress,
  tokenizeUserInput
}
module.exports = fn;
