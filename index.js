const input = document.querySelector(".input");
const keys = document.querySelectorAll(".bottom span");
const deleteBtn = document.querySelector(".delete");
const result = document.querySelector(".result");


const operators = ["+", "-", "x", "÷"];
let operation = "";
let decimalOrOperatorAdded = false;
let answer = "";

keys.forEach(key => {
    key.addEventListener("click", handleKeyPress);
    key.addEventListener("click", evaluate);
  });

deleteBtn.addEventListener("click", deleteKeyPress);

function handleKeyPress (e) {
  //set the clear button text to delete
  deleteBtn.innerHTML = "DEL"

  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  if (key === "=") {
      return;
    }
//operation does not contain more than one decimal    
  if (key === "." && decimalOrOperatorAdded) {
    return;
  }

// if key is an operator set decimalOrOperatorAdded to false
  if (operators.indexOf(key) !== -1) {
      decimalOrOperatorAdded = false;
    }
// - is consider as sign operator if it start as input
  if (operation.length === 0 && key === "-") {
    operation += key;
    input.innerHTML = operation;
    return;
  }

//An operator cannot start as input
  if (operation.length === 0 && operators.indexOf(key) !== -1) {
    input.innerHTML = operation;
    return;
  }

//Replace with latest operator in a case of double operator
  if (operators.indexOf(lastChar) !== -1 && operators.indexOf(key) !== -1) {
    operation = operation.replace(/.$/, key);
    input.innerHTML = operation;
    return;
  }

  if (key) {
    if (key === ".") decimalAdded = true;
      operation += key;
      input.innerHTML = operation;
      return;
  }


}

function evaluate(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  //if last character is an operator remove it
  if (key === "=" && operators.indexOf(lastChar) !== -1) {
    operation = operation.slice(0, -1);
  }
  // if operation is empty set result to ""
  if (operation.length === 0) {
    answer = "";
    result.innerHTML = answer;
    return;
  }

  try {
    //remove leading 0
    if (operation[0] === "0" && operation[1] !== "." && operation.length > 1) {
      operation = operation.slice(1);
    }

    //replace x and ÷ with * and / respectively
    const final = operation.replace(/x/g, "*").replace(/÷/g, "/");

    //evaluate only if operation does not end with an operator
    let regexp = /\d["+", "-", "x", "÷"]\d/.test(operation)
    if (operators.indexOf(lastChar) == -1&&regexp) {
      answer = +(eval(final)).toFixed(5);
      console.log(answer)
    }

    if (key === "=") {
      decimalAdded = false;
      operation = `${answer}`;
      answer = "";
      input.innerHTML = operation;
      result.innerHTML = answer;
      
      //set the delete button text to clear
      deleteBtn.innerHTML = "CLR"
      return;
    }

    result.innerHTML = answer;

  } catch (e) {
    if (key === "=") {
      decimalAdded = false;
      input.innerHTML = `<span class="error">${operation}</span>`;
      result.innerHTML = `<span class="error">Error</span>`;
    }
  }

}

function deleteKeyPress(e) {
  //clear input
  if (e.ctrlKey) {
    operation = "";
    answer = "";
    input.innerHTML = operation;
    result.innerHTML = answer;
    return;
  }
  operation = operation.slice(0,-1)
  input.innerHTML = operation;

}