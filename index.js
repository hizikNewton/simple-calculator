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
  key.addEventListener("click", evaluate);
});

let val = '';
let last = ''
let res
let entry
const operators = ["+", "-", "x","÷"];
let userInput = []

let inputDisplay = dom.window.document.querySelector(".input")
let resultDisplay = dom.window.document.querySelector(".result")

function handleKeyPress(e){
  entry = e.target.dataset.key;

  if(operators.indexOf(entry)!=-1){
    userInput = userInput.concat([val,entry])
  }
  entry = justOneDecimal(entry,userInput,last)
  val = val+entry;
  last = val.replace(userInput.join(''),'');
  val = normalize(val,entry,last)
  val = noDoubleOperator(val,entry)
  val = noLeadingZero(val,entry)
  inputDisplay.innerHTML = val;
}

function tokenizeUserInput(){
  userInput = userInput.concat(last)
  return userInput
  }

function normalize(val,entry){ 
  if((operators.indexOf(val[0])!==-1) && val[0]!='-'){
    val = val.slice(1)
  }
  return val
}

function noDoubleOperator(val,entry){
  if(operators.indexOf(entry)!=-1){
    myop = operators.concat(['*','/'])
    if(val.length>1&&myop.includes(val[val.length-2])){
      val = val.slice(0,-2)+entry
    }
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

function noLeadingZero(val,entry){
  const afterOpCheck =(val)=>val[0]==0&&val[1]!=='.'
  if(val.length>1){
    if(val[0]=='-'){
      let toCheck = val.slice(1)
      if(afterOpCheck(toCheck)){
        val = val[0]+toCheck.slice(1)
        return val
        }
      
      }
      if(val[val.length-1]!=='.' && val[val.length-2]=='0'&& operators.indexOf(val[val.length-3])!==-1){
        val = val.slice(0,-2)+entry
        return val
        }
    else{
      if(afterOpCheck(val)){
        val = val.slice(1)
        return val
      }
    }
  }

  
  return val
}

function evaluate(e){
  const final = makeComputable(val)
  try{
    let regexp = /\d+["+", "-", "*", "/"]\d+/.test(final)
    answer = regexp? +(eval(final)).toFixed(5):''
    resultDisplay.innerHTML = answer;
  }catch(e){
    console.log('error')
  }
}
const makeComputable = (val)=>{
    //replace x and ÷ with * and / respectively
    return val.replace(/x/g, "*").replace(/÷/g, "/");
}


function deleteKeyPress(e){
  userInput = []
  val =''
  last=''
  inputDisplay.textContent = '';
  resultDisplay.textContent = '';
}

const fn = {
  inputDisplay,
  handleKeyPress,
  tokenizeUserInput,
  deleteKeyPress,
  makeComputable,
  evaluate,
  resultDisplay
}
module.exports = fn