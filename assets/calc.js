(() => {
  /*
    Some high level notes:
      - Floating point precision errors are not handled.
      - Operand 1 starts as 0, so an operation being the first click is valid
      - Entering two operands and an operator, then clicking another operator
        will calculate the result and lock it in as a new operand 1.
        - For the "+/=" case, it will prioritize = at this point. Doing more
          addition will require clicking "+/=" again.
      - Order of operations is ignored since this is a simple calculator.
        - For example, inputting "1 + 4 * 3" will result in 15, not 13, due to
          the rule defined above. When "*" is clicked, 5 will be displayed as
          operand 1.
      - After "=" is clicked causing a result to show, the next number/decimal input
        will clear the calculator and begin typing a new operand 1.
  */

  /*
    clickedNum - handles number button click

    Given the clicked number "num", update the state and display appropriately:

    1. Currently showing result -> clear and begin typing operand one
    2. Otherwise -> Append the clicked number onto the current operand (can tell
         based on whether the state is undefined or not)
  */
  function clickedNum(num) {
    if (state.result !== undefined) {
      clear();
    }

    if (state.operation === undefined) {
      state.operandOne = state.operandOne === "0" ? num : (state.operandOne + num);
      panel.textContent = state.operandOne;
    } else {
      state.operandTwo += num;
      panel.textContent = state.operandTwo;
    }
  }

  /*
    clickedDec - handles decimal button click

    Logic is similar to number click:
    1. Result is showing -> clear
    2. Otherwise -> append decimal onto operand currently being typed
       - If there is already a decimal point, do nothing
  */
  function clickedDec() {
    if (state.result !== undefined) {
      clear();
    }

    if (state.operation === undefined) {
      if (state.operandOne.includes(".")) return; // do nothing
      state.operandOne += ".";
      panel.textContent = state.operandOne;
    } else {
      if (state.operandTwo.includes(".")) return; // do nothing
      state.operandTwo += ".";
      panel.textContent = state.operandTwo;
    }
  }

  /*
    clickedOp - handles operator button click

    Given operator id "op", logic is as follows:
    1. Currently showing a result ->
       move result to operand one and begin typing operand two
    2. Currently typing operand two (and length > 0) ->
       calculate result and display it. If operation OTHER THAN add/equals
       was pressed (in that case we just show the result), then move result
       to operand one and begin typing operand two
    3. Currently typing operand one (usual case) ->
       finished with operand one, begin typing operand two
    4. Otherwise (entered operand one and operation already, but have not
       started typing operand two) -> switch operation to what was clicked
  */
  function clickedOp(op) {
    if (state.result !== undefined) {
      state = {
        operandOne: state.result,
        operandTwo: "",
        operation: op,
        result: undefined
      };
    } else if (state.operandTwo !== undefined && state.operandTwo.length) {
      result = getResult();
      if (op === "add-equals") {
        state.result = result;
        panel.textContent = result;
      } else {
        result = getResult();
        state = {
          operandOne: result,
          operandTwo: "",
          operation: op,
          result: undefined
        };
        panel.textContent = result;
      }
    } else if (state.operandTwo === undefined) {
      state.operandTwo = "";
      state.operation = op;
    } else {
      state.operation = op;
    }
  }

  /*
    clickedClear - handles clear button click

    Simply reset the state and set operand one to the default ("0")
  */
  function clickedClear() {
    clear();
    panel.textContent = "0";
  }

  /*
    clear - resets the state of the calculator

    operandOne being defined allows us to easily append onto it
  */
  function clear() {
    state = {
      operandOne: "0",
      operandTwo: undefined,
      operation: undefined,
      result: undefined
    };
  }

  /*
    getResult - calculates the result based on the given operands and operator

    NOTE: should only be called when the above 3 state properties are populated
  */
  function getResult() {
    operandOne = Number(state.operandOne);
    operandTwo = Number(state.operandTwo);

    switch (state.operation) {
      case "add-equals":
        return (operandOne + operandTwo).toString();
      case "sub":
        return (operandOne - operandTwo).toString();
      case "mult":
        return (operandOne * operandTwo).toString();
      case "div":
        return (operandOne / operandTwo).toString();
      default:
        console.error("something went wrong");
    }
  }

  // Get panel element to display operands and results
  let panel = document.getElementById("calc-panel");

  // Begin with a reset state
  let state;
  clear();

  // Map button ids to their respective digit strings
  const numBtnIdToNum = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "zero": "0"
  };

  // Attach click listener to number buttons
  let numBtns = document.getElementsByClassName("calc-num");
  for(let i = 0; i < numBtns.length; i++) {
    let btn = numBtns[i];
    let num = numBtnIdToNum[btn.id];
    btn.addEventListener("click", () => clickedNum(num));
  }

  // Attach click listener to operator buttons
  let opBtns = document.getElementsByClassName("calc-op");
  for(let i = 0; i < opBtns.length; i++) {
    let btn = opBtns[i];
    btn.addEventListener("click", () => clickedOp(btn.id));
  }

  // Attach click listener to decimal button
  document.getElementById("calc-dec")
    .addEventListener("click", () => clickedDec());


  // Attach click listener to clear button
  document.getElementById("calc-clear")
    .addEventListener("click", () => clickedClear());
})();
