////////////////////////////////////////
// 1. DATA STRUCTURE OF MASTERMIND GAME
////////////////////////////////////////

const mastermind = {
    codeSet: ["", "", "", ""],
    pegBoard: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
    ],
    marbleBoard: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
    ],
    selector: ["tomato", "mediumseagreen", "dodgerblue", "gold", "darkviolet", "white"],
    selectCode: () => {
        for (let i = 0; i < mastermind.codeSet.length; i++) {
            mastermind.codeSet.splice(i,1,mastermind.selector[Math.floor(Math.random() * mastermind.selector.length)]);
          }
    }
}

///////////////////////////////
// 2. LOGIC OF MASTERMIND GAME
///////////////////////////////

let triesLeft = mastermind.marbleBoard.length;
let globalCounter = 0;

const checkWin = () => {
    // use a method. "element in pegBoard[i] === black", return true. end game. 
    resultsList = []
    for (let i =0; i < mastermind.pegBoard.length; i++){
        resultsList.push(mastermind.pegBoard[i].every((result) => result === "black"))
    }
    return resultsList.some((result) => result === true)   
}

const checkLose = () => {
    resultsList = []
    for (let i =0; i < mastermind.marbleBoard.length; i++) {
        resultsList.push(mastermind.marbleBoard[i].every((result)=> result !== ""))
    }
    return resultsList.every((result) => result === true)
}

const checkMatch = (answer, guess, rowNum) => {
    const answerBoard = [];
    for (let i = 0; i < answer.length; i++) {
        answerBoard.push("");
    }
  // logic test: if position === same, append "correct"
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
        answerBoard.splice(i, 1, "black");
    } else if (guess[i] !== answer[i]) {
      if (answer.some((choice) => choice === guess[i])) {
        answerBoard.splice(i, 1, "white");
      } else if (guess[i] !== answer[i]) {
        answerBoard.splice(i, 1, "blank");
      }
    }
  }
  mastermind.pegBoard[rowNum] = answerBoard
};


///////////////////////////////////
// 3. RENDERING OF GAME ON BROWSER
///////////////////////////////////

const render = () => {
    // clear game decision
    let gameDecision = []
    $(".block0").remove()
    //start game
    mastermind.selectCode()
    //output-> [ 'p', 'r', 'y', 'y' ] to mastermind.codeset
    // assign selected colours the code puzzle 

    for (let i = 0; i < mastermind.codeSet.length; i++){
        $(`#code-setter .code-crater:nth-child(${i+1})`).css("background-color", mastermind.codeSet[i])
    }
    console.log(mastermind.codeSet)
    $(".selector").hide()
    $( "#code-setter" ).hide()


    //////////////////////////////////////////////////////////
    // Select colour from selector to assign to marble crater
    //////////////////////////////////////////////////////////

    let currentCrater = 0;
    let currentRow = 0;
    // $(".mastermind-row").on("click", (event)=> {
    //     currentRow = $(".mastermind-row").index($(event.currentTarget))
    //     console.log(`You selected marble crater nth-child ${currentRow}`)
    // })
    $(".marble-crater").on("click", (event)=> {
        currentCrater = $(".marble-crater").index($(event.currentTarget))
        // console.log(`You selected marble crater nth-child ${currentCrater}`)
        
        // $(`.mastermind-row:nth-child(${1})`).append($(".selector"))
        $(".selector").show()
    })
    $(".options").on("click", (selector) => {
        $(`.mastermind-row`).find(".marble-crater").eq(currentCrater).css("background-color", `${$(selector.currentTarget).html()}`).text(`${$(selector.currentTarget).html()}`)
        $(".selector").hide()

        // map answer from marble crater to pegBoard array in object
        for (let i=0; i < mastermind.marbleBoard.length; i++ ){
            for (let j = 0; j < mastermind.marbleBoard[i].length; j++) {   
                mastermind.marbleBoard[i].splice(j,1,$(`.row${i} .crater${j}`).text())
                checkMatch(mastermind.codeSet, mastermind.marbleBoard[i], i)
            }
        }
        // map pegBoard array to pegs on index.html
        for (let i = 0; i<mastermind.pegBoard.length; i++) {
            for (let j=0; j<mastermind.pegBoard[i].length; j ++) {
            gameDecision = mastermind.pegBoard[i]
            $(`.mastermind-row:nth-child(${mastermind.pegBoard.length-i}) .peg${j}`).css("background-color",`${gameDecision[j]}`)
            }
        }
    })


    //////////////////////
    // Evaluate algorithm
    //////////////////////

    // for every crater in mastermind-row(triesleft marble-crater), if text = empty, alert user that he has to fill all
    //
    $(".eval").on("click", (event) => {
    if(mastermind.marbleBoard[globalCounter].some((option)=>option === "")){
        alert("please fill up all options in the row")
    } else {
        $(event.currentTarget).remove()
        $(".selector").hide()
        // checkWin()
        if (checkWin()) {
            $( "#code-setter" ).show()
            setTimeout(() => {alert("You win!")}, 100)
            // alert("You win!")
        } else if (checkLose()) {
            alert("Sorry, you lost.")
            $( "#code-setter" ).show()
        } else {
            $(`.mastermind-row:nth-child(${triesLeft}) *`).off("click");
            $(`.mastermind-row:nth-child(${triesLeft}) .marble-crater`).css("cursor", "default");
            globalCounter += 1;
            triesLeft -= 1;
            $(`.block${globalCounter}`).remove()             
        }
    }
})
}

const main = () => {
    //create main board
    const $mastermindBoard = $("<div>").addClass("mastermind-board")
    $(".container").append($mastermindBoard)

    ///////////////////////
    // Code Setter Section
    ///////////////////////

    // create code setter section
    const $codeSetter = $("<div>").addClass("code-setter-row")
    $mastermindBoard.append($codeSetter)

    // create marbles row for craters
    const $codeMarblesRow = $("<div>").addClass("marbles").attr("id", "code-setter")
    $codeSetter.append($codeMarblesRow)

    // create marble crater for code selector
    for (let i=0; i < mastermind.codeSet.length; i++) {
        const $marbleCraterCode = $("<div>").addClass("code-crater")
        $codeMarblesRow.append($marbleCraterCode)
    }

    //////////////////
    // Player Section
    //////////////////
    // create div for player rows
    const $gameplay = $("<div>").addClass("gameplay")
    $($mastermindBoard).append($gameplay)

    // create player rows
    for (let i=0; i<mastermind.marbleBoard.length; i++){
        // create player row
        const $playerRole = $("<div>").addClass("mastermind-row").addClass("row"+i)
        $gameplay.prepend($playerRole)

        // create div to prevent click event
        const $turnBlock =$("<div>").addClass("turn-block").addClass("block"+i)
        $playerRole.append($turnBlock)

        // create eval button, peg board, and marble board, in this order
        const $evalButton = $("<div>").addClass("eval").text("EVAL")
        const $pegBoard = $("<div>").addClass("pegs")
        const $marbleBoard = $("<div>").addClass("marbles")
        $playerRole.append($evalButton)
        $playerRole.append($pegBoard, $marbleBoard)
        for (let j=0; j < mastermind.marbleBoard[i].length; j++){
            //create pegs in pegboard
            const $peg = $("<div>").addClass("peg").addClass("peg"+j)
            $pegBoard.append($peg)
            // create marble craters in marbleboard
            const $marbleCrater = $("<div>").addClass("marble-crater").addClass("crater"+j)
            $marbleBoard.append($marbleCrater)
        }
    }

    /////////////
    // Selector
    /////////////

    const $selector = $("<fieldset>").addClass("selector")
    const $legend = $("<legend>").text("Selector").css("padding", "0.00em 0.5em")
    $selector.append($legend)
    $(`.container`).append($selector)
    
    for (const color of mastermind.selector){
        const $options = $("<div>").addClass("options").attr("id", `option-${color}`).text(color)
        $selector.append($options)
    }

    render()
    
}

$(main)