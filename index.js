const inputDisplay = document.querySelector(".input")
const resultDisplay = document.querySelector(".result")
const delKey = document.querySelector(".delete")
const clrKey = document.querySelector(".clear")
const keys = document.querySelectorAll(".bottom span[data-key]");
const result = document.querySelector(".result");

let pressTimer

const handleMouseup = ()=>clearTimeout(pressTimer);

const handleMousedown = ()=>{
  pressTimer = window.setTimeout(handleClear(),1000);
}
const handleDelete = (e)=>{
  val = val.slice(0,-1)
  inputDisplay.innerHTML = val
}

delKey.addEventListener("click",handleDelete);

if(clrKey){
clrKey.addEventListener("mouseup",handleMouseup);
clrKey.addEventListener("mousedown",handleMousedown);
}

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


function handleKeyPress(e){
  entry = e.target.dataset.key;
  if (entry === "=") {
    return;
  }
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
  const key = e.target.dataset.key;
  const final = makeComputable(val)
  try{
    let regexp = /\d+["+", "-", "*", "/"]\d+/.test(final)
    answer = regexp? +(eval(final)).toFixed(5):''
    
    if(key=='='){
      val = answer
      inputDisplay.innerHTML = answer
      resultDisplay.innerHTML = ''
      delKey.innerHTML = 'CLR'
    }
    resultDisplay.innerHTML = answer;
  }catch(e){
    inputDisplay.innerHTML = val
  }
}
const makeComputable = (val)=>{
    //replace x and ÷ with * and / respectively
    return val.replace(/x/g, "*").replace(/÷/g, "/");
}


function handleClear(e){
  userInput = []
  val =''
  last=''
  inputDisplay.textContent = '';
  resultDisplay.textContent = '';
}

/* const fn = {
  inputDisplay,
  handleKeyPress,
  handleDelete,
  handleClear,
  tokenizeUserInput,
  makeComputable,
  evaluate,
  resultDisplay,
  delKey
}
module.exports = fn */