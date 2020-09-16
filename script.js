//PLAYERS
const Player = (name, mark) => {
  return {name, mark};
};

//controls game logic/flow
const GameModel = (() => {
  const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let board;
  let player1;
  let player2;
  let isPlayer1Turn;
  let isSinglePlayer;
  let difficultyLevel;

  const canMakeMove = (index) => {
    return board[index] == '';
  };

  const changePlayerTurn = () => {
    isPlayer1Turn = !isPlayer1Turn;
  };

  const getDifficultyLevel = () => {
    return difficultyLevel;
  };

  //returns [-1=not endgame; 0=tie; 1=player1 win; 2=player2 win]
  const getEndgameResult = () => {
    //check for winner
    for(let comboNum = 0; comboNum < WINNING_COMBOS.length; comboNum++) {
      if(board[WINNING_COMBOS[comboNum][0]] === board[WINNING_COMBOS[comboNum][1]] && board[WINNING_COMBOS[comboNum][0]] == board[WINNING_COMBOS[comboNum][2]]) {
        if(board[WINNING_COMBOS[comboNum][0]] == player1.mark) {
          return 1;
        } else if(board[WINNING_COMBOS[comboNum][0]] == player2.mark) {
          return 2;
        } else {
          return -1;
        }
      }
    }

    //check if any empty spots left
    if(board.includes('')) {
      return -1;
    } else {
      return 0;
    }
  };

  const getIsPlayer1Turn = () => {
    return isPlayer1Turn;
  };

  const getIsSinglePlayer = () => {
    return isSinglePlayer;
  };

  //makes move for computer
  //difficulty [1=easy; 2=medium; 3=hard]
  //TODO implement medium and hard difficulties
  const makeAIMove = (difficulty) => {
    switch(difficulty) {
      //best available move (minimax)
      case 3:
        break;
      //only think ahead 1 move (in order: make winning move, block losing move, random move)
      case 2:
        break;
      //random move
      default:
        //get all possible moves and makeMove
        let indexOptions;
        for(let i = 0; i < board.length; i++) {
          if(canMakeMove(i)) {
            indexOptions.push(i);
          }
        }
        makeMove(indexOptions[Math.floor(Math.random() * indexOptions.length)]);
    }
  };

  //fills board at index w/ current player's mark
  const makeMove = (index) => {
    board[index] = isPlayer1Turn ? player1.mark : player2.mark;
  };

  //brand new game
  const newGame = (player1Name, player2Name, player2IsAI, levelOfDifficulty) => {
    player1 = Player(player1Name, 'X');
    player2 = Player(player2Name, 'O');
    isSinglePlayer = player2IsAI;
    difficultyLevel = levelOfDifficulty;
    board = Array(9).fill('');
    isPlayer1Turn = true;
  };

  //new game w/ same players, settings
  const resetGame = () => {
    board = Array(9).fill('');
    isPlayer1Turn = true;
  };

  return {canMakeMove, changePlayerTurn, getDifficultyLevel, getEndgameResult, getIsPlayer1Turn, getIsSinglePlayer, makeAIMove, makeMove, newGame, resetGame};
})();

//controls what displays
const GameView = (() => {
  //players
  const player1 = document.querySelector('#p1');
  const player1Name = document.querySelector('#p1Name');
  const player2 = document.querySelector('#p2');
  const player2Name = document.querySelector('#p1Name');
  //cells
  const cells = document.querySelectorAll('.board__cell');
  //modals
  const modal = document.querySelector('#modal');
  //setup
  const modalSetup = document.querySelector('#modalSetup');
  const setupP1Name = document.querySelector('#setupP1Name');
  const setupP2Name = document.querySelector('#setupP2Name');
  const playAI = document.querySelector('#play-ai');
  const difficultyEasy = document.querySelector('#difficulty-easy');
  const difficultyMedium = document.querySelector('#difficulty-medium');
  const difficultyHard = document.querySelector('#difficulty-hard');
  //endgame
  const modalEndgame = document.querySelector('#modalEndgame');
  const endgameWinner = document.querySelector('#endgameWinner');

  //clears all board cells
  const clearBoard = () => {
    for(let i = 0; i < cells.length; i++) {
      cells[i].textContent = '';
      cells[i].classList.add(cssClasses.cellPlayable);
      cells[i].classList.remove(cssClasses.cellBlue);
      cells[i].classList.remove(cssClasses.cellOrange);
    };
  };


  //list of css classes to add/remove
  const cssClasses = (() => {
    return {
      cellBlue: 'board__cell--blue',
      cellOrange: 'board__cell--orange',
      cellPlayable: 'board__cell--playable',
      modalHidden: 'modal--hidden',
      playerBlue: 'player--blue',
      playerInactive: 'player--inactive',
      playerOrange: 'player--orange',
    };
  })();

  //fills in player names in game
  const enterNames = (p1Name, p2Name) => {
    player1Name.textContent = p1Name;
    player2Name.textContent = p2Name;
  };

  const hideEndgameModal = () => {
    modal.classList.add(cssClasses.modalHidden);
    modalEndgame.classList.add(cssClasses.modalHidden);
  };

  const hideSetupModal = () => {
    modal.classList.add(cssClasses.modalHidden);
    modalSetup.classList.add(cssClasses.modalHidden);
  };

  //fills indicated cell on board based on whose turn it is
  const makeMove = (isPlayer1Turn, index) => {
    cells[index].classList.remove(cssClasses.cellPlayable);

    if(isPlayer1Turn) {
      cells[index].classList.add(cssClasses.cellOrange);
      cells[index].textContent = player1Mark.textContent;
    } else {
      cells[index].classList.add(cssClasses.cellBlue);
      cells[index].textContent = player2Mark.textContent;
    }
  };

  //clears board and makes it player1's turn
  const resetGame = () => {
    clearBoard();
    togglePlayerTurn(true);
    hideEndgameModal();
  }

  const showEndgameModal = (resultText) => {
    modal.classList.remove(cssClasses.modalHidden);
    modalEndgame.classList.remove(cssClasses.modalHidden);
    endgameWinner.textContent = resultText;
  };

  const showSetupModal = () => {
    modal.classList.remove(cssClasses.modalHidden);
    modalSetup.classList.remove(cssClasses.modalHidden);
    setupP1Name.value = '';
    setupP2Name.value = '';
    playAI.checked = false;
    difficultyEasy.checked = false;
    difficultyMedium.checked = false;
    difficultyHard.checked = false;
  };

  //change which player is visible to indicating their turn
  const togglePlayerTurn = (isPlayer1Turn) => {
    if(isPlayer1Turn) {
      player1.classList.remove(cssClasses.playerInactive);
      player2.classList.add(cssClasses.playerInactive);
    } else {
      player1.classList.add(cssClasses.playerInactive);
      player2.classList.remove(cssClasses.playerInactive);      
    }
  };
  return {};
})();

//Links model and view
const GameController = (() => {

  return {};
})();


//OLD CODE BASE
//MODEL
const Game = (() => {
  const WINNER_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let board = Array(9).fill('');
  let isPlayerOneTurn = true;
  let player1 = {name: 'Player1', mark: 'X'};
  let player2 = {name: 'Player2', mark: 'O'};

  const canMakeMove = (index) => board[index] == '';
  const changePlayerTurn = () => {
    isPlayerOneTurn = !isPlayerOneTurn;
  };
  const clearBoard = () => board = Array(9).fill('');
  const getActivePlayer = () => {
    if(isPlayerOneTurn) {
      return player1;
    } else {
      return player2;
    }
  };
  const getIsPlayerOneTurn = () => isPlayerOneTurn;
  const isTie = () => {
    return !board.includes('');
  }
  const isWinner = (player) => {
    for (let i = 0; i < WINNER_COMBOS.length; i++) {
      if(board[WINNER_COMBOS[i][0]] === player.mark && board[WINNER_COMBOS[i][1]] === player.mark && board[WINNER_COMBOS[i][2]] === player.mark) {
        return true;
      }
    }
    return false;
  };
  const makeMove = (index) => {
    board[index] = isPlayerOneTurn ? player1.mark : player2.mark;
  };
  //clears board, populates players, etc
  const newGame = (playerOneName, playerTwoName) => {
    clearBoard();
    isPlayerOneTurn = true;
    player1.name = playerOneName;
    player2.name = playerTwoName;
  };
  const resetGame = () => {
    clearBoard();
    isPlayerOneTurn = true;
  };

  return {changePlayerTurn, canMakeMove, clearBoard, getActivePlayer, getIsPlayerOneTurn, isTie, isWinner, makeMove, newGame, resetGame};
})();

//VIEW
const Board = (() => {
  const player1Name = document.querySelector('#p1Name');
  const player1Mark = document.querySelector('#p1Mark');
  const player2Name = document.querySelector('#p2Name');
  const player2Mark = document.querySelector('#p2Mark');
  const cells = document.querySelectorAll('.board__cell');

  const clearBoard = () => {
    for(let i = 0; i < cells.length; i++) {
      cells[i].textContent = '';
      cells[i].classList.add(cssClasses.cellPlayable);
      cells[i].classList.remove(cssClasses.cellBlue);
      cells[i].classList.remove(cssClasses.cellOrange);
    }
  };

  const clearSetup = () => {
    document.querySelector('#setupP1Name').value = '';
    document.querySelector('#setupP2Name').value = '';
  };

  const cssClasses = (() => {
    return {
      cellBlue: 'board__cell--blue',
      cellOrange: 'board__cell--orange',
      cellPlayable: 'board__cell--playable',
      modalHidden: 'modal--hidden',
      playerBlue: 'player--blue',
      playerInactive: 'player--inactive',
      playerOrange: 'player--orange',
    };
  })();

  const endgameResult = (isTie, isPlayer1Win = true) => {
    const result = document.querySelector('#endgameWinner');

    if(isPlayer1Win) {
      result.textContent = `${player1Name.textContent} Won!`;
    } else if(isTie) {
      result.textContent = 'You Tied!';
    } else {
      result.textContent = `${player2Name.textContent} Won!`;
    }
  };

  const endgameShowHide = (shouldHideEndgame) => {
    const modalBackground = document.querySelector('#modal');
    const modalEndgame = document.querySelector('#modalEndgame');

    if(shouldHideEndgame) {
      modalBackground.classList.add(cssClasses.modalHidden);
      modalEndgame.classList.add(cssClasses.modalHidden);
    } else {
      modalBackground.classList.remove(cssClasses.modalHidden);
      modalEndgame.classList.remove(cssClasses.modalHidden);
    }
  };

  const enterNames = (p1Name, p2Name) => {
    player1Name.textContent = p1Name;
    player2Name.textContent = p2Name;
  };

  const makeMove = (isPlayer1Turn, index) => {
    cells[index].classList.remove(cssClasses.cellPlayable);

    if(isPlayer1Turn) {
      cells[index].classList.add(cssClasses.cellOrange);
      cells[index].textContent = player1Mark.textContent;
    } else {
      cells[index].classList.add(cssClasses.cellBlue);
      cells[index].textContent = player2Mark.textContent;
    }
  };

  const resetGame = () => {
    Board.clearBoard();
    Board.togglePlayerTurn(true);
    Board.endgameShowHide(true);
  };

  const setupShowHide = (shouldHideSetup) => {
    const modalBackground = document.querySelector('#modal');
    const modalSetup = document.querySelector('#modalSetup');

    if(shouldHideSetup) {
      modalBackground.classList.add(cssClasses.modalHidden);
      modalSetup.classList.add(cssClasses.modalHidden);
      clearSetup();
      togglePlayerTurn(true);
    } else {
      modalBackground.classList.remove(cssClasses.modalHidden);
      modalSetup.classList.remove(cssClasses.modalHidden);
      clearSetup();
    }
  };

  const togglePlayerTurn = (isPlayer1Turn) => {
    const player1 = document.querySelector('#p1');
    const player2 = document.querySelector('#p2');

    if(isPlayer1Turn) {
      player1.classList.remove(cssClasses.playerInactive);
      player2.classList.add(cssClasses.playerInactive);
    } else {
      player1.classList.add(cssClasses.playerInactive);
      player2.classList.remove(cssClasses.playerInactive);      
    }
  };

  return {clearBoard, clearSetup, endgameResult, endgameShowHide, enterNames, makeMove, resetGame, setupShowHide, togglePlayerTurn};
})();

//CONTROLLER -> links MODEL & VIEW
const GameController = (() => {
  const startButton = document.querySelector('#setupStartGame');
  const endgameButton = document.querySelector('#endgamePlayAgain');
  const cells = document.querySelectorAll('.board__cell');

  //end game button
  const endGameButton = () => {
    Game.resetGame();
    Board.resetGame();
  };

  //handles all moves including checking for endgame and moving to next player
  const makeMove = (e) => {
    const index = e.target.dataset.index;
    if(Game.canMakeMove(index)) {
      //make move
      Game.makeMove(index);
      Board.makeMove(Game.getIsPlayerOneTurn(), index);

      //check player winner
      if(Game.isWinner(Game.getActivePlayer())) {
        Board.endgameResult(false, Game.getIsPlayerOneTurn());
        Board.endgameShowHide(false);
      //check tie
      } else if(Game.isTie()) {
        Board.endgameResult(true, false);
        Board.endgameShowHide(false);
      //not endgame
      } else {
        Game.changePlayerTurn();
        Board.togglePlayerTurn(Game.getIsPlayerOneTurn());
      }
    }
  };

  //fills names and hides setup
  const newGame = (player1Name, player2Name) => {
    Game.newGame(player1Name, player2Name);
    
    Board.setupShowHide(true);
    Board.enterNames(player1Name, player2Name);
    Board.clearBoard();
  };

  //initiate game
  const startGame = () => {
    Board.setupShowHide(false);
  };

  //start game button
  const startGameButton = () => {
    const p1Name = document.querySelector('#setupP1Name').value;
    const p2Name = document.querySelector('#setupP2Name').value;
    const defaultPlayer1Name = 'Player 1';
    const defaultPlayer2Name = 'Player 2';
    let player1Name = '';
    let player2Name = '';

    player1Name = p1Name == '' ? defaultPlayer1Name : p1Name;
    player2Name = p2Name == '' ? defaultPlayer2Name : p2Name;

    newGame(player1Name, player2Name);
  };

  //Add EventListeners
  startButton.addEventListener('click', startGameButton);
  endgameButton.addEventListener('click', endGameButton);
  Array.from(cells).forEach(cell => cell.addEventListener('click', makeMove));

  return {endGameButton, makeMove, newGame, startGame, startGameButton};
})();

GameController.startGame();

/*
Parts of Tic-Tac-Toe
  VIEW
  -gameboard
    -render board
    -update board on click on empty cell
    -enter names modal
    -end game modal

  CONTROLLER
  -gameController
-------------------------------------------------
BOARD
0 | 1 | 2
----------
3 | 4 | 5
----------
6 | 7 | 8
-------------------------------------------------
MISC
-modal enter names
  -instructions
    -enter names
    -auto assigned if blank ('Player1' 'Player2')
    -check box to play against the computer
  -checkbox to play against AI ('Computer')
  -spot to enter name for player 1
  -spot to enter name for player 2 (visibility: hidden? or opacity lowered and disabled when trying to play against computer)
  -start game button
-modal end game
  -congratulate winner  (or lost message if computer wins)
  -play again button
-ai
  -play random legal play
  -play smart play
-------------------------------------------------
*/