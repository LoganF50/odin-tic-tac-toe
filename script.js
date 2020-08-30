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

    if(isTie) {
      result.textContent = 'You Tied!';
    } else if(isPlayer1Win) {
      result.textContent = `${player1Name.textContent} Won!`;
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

      //check for endgame
      if(Game.isTie()) {
        Board.endgameResult(true, false);
        Board.endgameShowHide(false);
      } else if(Game.isWinner(Game.getActivePlayer())) {
        Board.endgameResult(false, Game.getIsPlayerOneTurn());
        Board.endgameShowHide(false);
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