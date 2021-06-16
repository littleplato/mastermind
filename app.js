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
    ["", "", "", ""],
  ],
  marbleBoard: [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ],
  selector: [
    "tomato",
    "mediumseagreen",
    "dodgerblue",
    "gold",
    "darkviolet",
    "white",
  ],
  pegColors: ["black", "red", "blank"],
  selectCode: () => {
    for (let i = 0; i < mastermind.codeSet.length; i++) {
      mastermind.codeSet.splice(
        i,
        1,
        mastermind.selector[
          Math.floor(Math.random() * mastermind.selector.length)
        ]
      );
    }
  },
};

///////////////////////////////
// 2. LOGIC OF MASTERMIND GAME
///////////////////////////////

let globalCounter = 0; //this is the turn number

const checkWin = () => {
  // use a method. "element in pegBoard[i] === black", return true. end game.
  resultsList = [];
  for (let i = 0; i < mastermind.pegBoard.length; i++) {
    resultsList.push(
      mastermind.pegBoard[i].every(
        (result) => result === mastermind.pegColors[0]
      )
    );
  }
  return resultsList.some((result) => result === true);
};

const winScene = () => {
  $("#code-setter").show();
  $("#winModal").show();
  $("button").on("click", () => {
    location.reload();
  });
  $("span").on("click", () => {
    $(".modal").hide();
  });
  $(".finalInstruction").text("You win!");
  $(".reset-global").show();
  $(".mastermind-board *").off();
};

const checkLose = () => {
  resultsList = [];
  for (let i = 0; i < mastermind.marbleBoard.length; i++) {
    resultsList.push(
      mastermind.marbleBoard[i].every((result) => result !== "")
    );
  }
  return resultsList.every((result) => result === true);
};

const loseScene = () => {
  $("#code-setter").show();
  $("#loseModal").show();
  $("button").on("click", () => {
    location.reload();
  });
  $("span").on("click", () => {
    $(".modal").hide();
  });
  $(".finalInstruction").text("You lose!");
  $(".reset-global").show();
  $(".mastermind-board *").off();
};

const gameContinues = () => {
  // $(`.mastermind-row:nth-child(${triesLeft}) *`).off("click");
  $(`.mastermind-row:nth-child(${mastermind.marbleBoard.length - globalCounter}) *`).off("click");
  $(
    `.mastermind-row:nth-child(${mastermind.marbleBoard.length - globalCounter}) .marble-crater`
  ).css("cursor", "default");
  globalCounter++;
  $(`.block${globalCounter}`).remove();
};

const checkMatch = (answer, guess, rowNum) => {
  const answerBoard = [];
  for (let i = 0; i < answer.length; i++) {
    answerBoard.push("");
  }
  // logic test: if position === same, append "correct"
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      answerBoard.splice(i, 1, mastermind.pegColors[0]);
    } else if (guess[i] !== answer[i]) {
      if (answer.some((choice) => choice === guess[i])) {
        answerBoard.splice(i, 1, mastermind.pegColors[1]);
      } else if (guess[i] !== answer[i]) {
        answerBoard.splice(i, 1, mastermind.pegColors[2]);
      }
    }
  }
  mastermind.pegBoard[rowNum] = answerBoard;
};

///////////////////////////////////
// 3. RENDERING OF GAME ON BROWSER
///////////////////////////////////

const render = () => {
  // clear game decision

  $("#start").on("click", (event) => {
    $(".finalInstruction").show();
    $(event.currentTarget).remove();
    $(".description").remove();
    $(".mastermind-board").show();
    $(".announce").addClass("announced").text("Plato has chosen.");
  });

  let gameDecision = [];
  $(".block0").remove();
  //start game
  mastermind.selectCode();
  //output-> [ 'p', 'r', 'y', 'y' ] to mastermind.codeset
  // assign selected colours the code puzzle
  for (let i = 0; i < mastermind.codeSet.length; i++) {
    $(`#code-setter .code-crater:nth-child(${i + 1})`).css(
      "background-color",
      mastermind.codeSet[i]
    );
  }
  console.log(mastermind.codeSet);
  $(".selector").hide();
  $("#code-setter").hide();

  //////////////////////////////////////////////////////////
  // Select colour from selector to assign to marble crater
  //////////////////////////////////////////////////////////

  let currentCrater = 0;
  $(".marble-crater").on("click", (event) => {
    $(".finalInstruction").text("Match Plato's choice.");
    currentCrater = $(".marble-crater").index($(event.currentTarget));
    // console.log(`You selected marble crater nth-child ${currentCrater}`)
    $(`.select${globalCounter + 1}`).show();
  });
  $(".options").on("click", (selector) => {
    $(`.mastermind-row`)
      .find(".marble-crater")
      .eq(currentCrater)
      .css("background-color", `${$(selector.currentTarget).html()}`)
      .text(`${$(selector.currentTarget).html()}`);
    $(".selector").hide();

    // map answer from marble crater to pegBoard array in object
    for (let i = 0; i < mastermind.marbleBoard.length; i++) {
      for (let j = 0; j < mastermind.marbleBoard[i].length; j++) {
        mastermind.marbleBoard[i].splice(
          j,
          1,
          $(`.row${i} .crater${j}`).text()
        );
        checkMatch(mastermind.codeSet, mastermind.marbleBoard[i], i);
      }
    }
    // map pegBoard array to pegs on index.html
    for (let i = 0; i < mastermind.pegBoard.length; i++) {
      for (let j = 0; j < mastermind.pegBoard[i].length; j++) {
        gameDecision = mastermind.pegBoard[i];
        $(
          `.mastermind-row:nth-child(${
            mastermind.pegBoard.length - i
          }) .peg${j}`
        ).css("background-color", `${gameDecision[j]}`);
      }
    }
  });

  //////////////////////
  // Evaluate algorithm
  //////////////////////

  // for every crater in mastermind-row(triesleft marble-crater), if text = empty, alert user that he has to fill all
  //
  $(".eval").on("click", (event) => {
    if (mastermind.marbleBoard[globalCounter].some((option) => option === "")) {
      alert(
        "Please fill all options in the row. \nThere are no empty selections."
      );
    } else {
      $(event.currentTarget).remove();
      $(".selector").hide();
      // checkWin()
      if (checkWin()) {
        winScene();
      } else if (checkLose()) {
        loseScene();
      } else {
        gameContinues();
      }
    }
  });
};

const main = () => {
  // Final instructions
  const $finalInstruction = $("<div>")
    .addClass("finalInstruction")
    .text("Start from the bottom.");
  $(".container").append($finalInstruction, $("<br>"));
  $finalInstruction.hide();

  //create main board
  const $mastermindBoard = $("<div>").addClass("mastermind-board");
  $(".container").append($mastermindBoard);

  //Global reset button
  const $resetGlobal = $("<button>")
    .addClass("modal-button")
    .addClass("reset-global")
    .text("Restart Game");
  $(".container").append($resetGlobal);
  $resetGlobal.hide();

  ///////////////////////
  // Code Setter Section
  ///////////////////////

  // create code setter section
  const $codeSetter = $("<div>").addClass("code-setter-row");
  $mastermindBoard.append($codeSetter);

  // create marbles row for craters
  const $codeMarblesRow = $("<div>")
    .addClass("marbles")
    .attr("id", "code-setter");
  $codeSetter.append($codeMarblesRow);

  // create marble crater for code selector
  for (let i = 0; i < mastermind.codeSet.length; i++) {
    const $marbleCraterCode = $("<div>").addClass("code-crater");
    $codeMarblesRow.append($marbleCraterCode);
  }

  //////////////////
  // Player Section
  //////////////////
  // create div for player rows
  const $gameplay = $("<div>").addClass("gameplay");
  $($mastermindBoard).append($gameplay);

  // create player rows
  for (let i = 0; i < mastermind.marbleBoard.length; i++) {
    // create player row
    const $playerRole = $("<div>")
      .addClass("mastermind-row")
      .addClass("row" + i);
    $gameplay.prepend($playerRole);

    // create div to prevent click event
    const $turnBlock = $("<div>")
      .addClass("turn-block")
      .addClass("block" + i);
    $playerRole.append($turnBlock);

    // create eval button, peg board, and marble board, in this order
    const $evalButton = $("<div>").addClass("eval").text("EVAL");
    const $pegBoard = $("<div>").addClass("pegs");
    const $marbleBoard = $("<div>").addClass("marbles");
    $playerRole.append($evalButton);
    $playerRole.append($pegBoard, $marbleBoard);
    for (let j = 0; j < mastermind.marbleBoard[i].length; j++) {
      //create pegs in pegboard
      const $peg = $("<div>")
        .addClass("peg")
        .addClass("peg" + j);
      $pegBoard.append($peg);
      // create marble craters in marbleboard
      const $marbleCrater = $("<div>")
        .addClass("marble-crater")
        .addClass("crater" + j);
      $marbleBoard.append($marbleCrater);
    }
  }

  /////////////
  // Selector
  /////////////

  for (let i = 0; i <= mastermind.marbleBoard.length; i++) {
    const $selector = $("<fieldset>")
      .addClass("selector")
      .addClass("select" + i);
    const $legend = $("<legend>")
      .text("Selector")
      .css("padding", "0.00em 0.5em");
    $selector.append($legend);
    $(
      `.mastermind-row:nth-child(${mastermind.marbleBoard.length + 1 - i})`
    ).append($selector);

    for (const color of mastermind.selector) {
      const $options = $("<div>")
        .addClass("options")
        .attr("id", `option-${color}`)
        .text(color);
      $selector.append($options);
    }
  }

  ///////////////
  // Exit Modals
  ///////////////

  // Win Modal
  const $winModal = $("<div>").addClass("modal").attr("id", "winModal");
  const $winModalContent = $("<div>").addClass("modal-content");
  const $crossOut1 = $("<span>").addClass("close").text("x");
  const $img1 = $("<img>").attr("src", "/media/philosophy.svg");
  const $platoWinMessage = $("<h3>").text(`"I see you know theory of Forms!"`);
  const $winMessage = $("<p>").text(
    "You defeated the greatest philosopher of all time!"
  );
  const $restartButton1 = $("<button>")
    .addClass("modal-button")
    .text("Restart Game");
  $winModalContent.append(
    $crossOut1,
    $img1,
    $platoWinMessage,
    $winMessage,
    $restartButton1
  );
  $winModal.append($winModalContent);
  $("body").append($winModal);

  // Lose Modal
  const $loseModal = $("<div>").addClass("modal").attr("id", "loseModal");
  const $loseModalContent = $("<div>").addClass("modal-content");
  const $crossOut2 = $("<span>").addClass("close").text("x");
  const $img2 = $("<img>").attr("src", "/media/philosophy.svg");
  const $platoLoseMessage = $("<h3>").text(
    `"Maybe you should stay in the cave..."`
  );
  const $loseMessage = $("<p>").text(
    "You lost, but it's okay. It is Plato after all."
  );
  const $restartButton2 = $("<button>")
    .addClass("modal-button")
    .text("Try Again");
  $loseModalContent.append(
    $crossOut2,
    $img2,
    $platoLoseMessage,
    $loseMessage,
    $restartButton2
  );
  $loseModal.append($loseModalContent);
  $("body").append($loseModal);

  $(".mastermind-board").hide();

  render();
};

$(main);
