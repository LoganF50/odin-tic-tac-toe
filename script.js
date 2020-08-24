//MODEL
const Game = (() => {
  const WINNER_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let board = Array(9).fill('');
  let isPlayerOneTurn = true;
  let player1 = {name: 'Player1', mark: 'X'};
  let player2 = {name: 'Player2', mark: 'O'};

  const canMakeMove = (index) => board[index] == '';
  const changePlayerTurn = () => {
    isPlayerOneTurn != isPlayerOneTurn;
  };
  const getIsPlayerOneTurn = () => isPlayerOneTurn;
  const isTie = !board.includes('');
  const isWinner = (player) => {
    for (let i = 0; i < WINNER_COMBOS.length; i++) {
      if(board[WINNER_COMBOS[i][0]] === player.mark && board[WINNER_COMBOS[i][1]] === player.mark && board[WINNER_COMBOS[i][2]] === player.mark) {
        return true;
      }
    }
    return false;
  };
  const makeMove = (index) => board[index] = isPlayerOneTurn ? player1.mark : player2.mark;
  //clears board, populates players, etc
  const newGame = (playerOneName, playerTwoName) => {
    resetBoard();
    isPlayerOneTurn = true;
    player1.name = playerOneName;
    player2.name = playerTwoName;
  };
  const resetBoard = () => board = Array(9).fill('');

  return {changePlayerTurn, canMakeMove, getIsPlayerOneTurn, isTie, isWinner, makeMove, newGame, resetBoard};
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
      cells[i].classList.add('board__cell--playable');
    }
  };

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
      modalBackground.classList.add('modal--hidden');
      modalEndgame.classList.add('modal--hidden');
    } else {
      modalBackground.classList.remove('modal--hidden');
      modalEndgame.classList.remove('modal--hidden');
    }
  };

  const enterNames = (p1Name, p2Name) => {
    player1Name.textContent = p1Name;
    player2Name.textContent = p2Name;
  };

  const makeMove = (isPlayer1Turn, index) => {
    if(isPlayer1Turn) {
      cells[index].classList.add('board__cell--orange');
      cells[index].textContent = player1Mark.textContent;
    } else {
      cells[index].classList.add('board__cell--blue');
      cells[index].textContent = player2Mark.textContent;
    }
  };

  const setupShowHide = (shouldHideSetup) => {
    const modalBackground = document.querySelector('#modal');
    const modalSetup = document.querySelector('#modalSetup');

    if(shouldHideSetup) {
      modalBackground.classList.add('modal--hidden');
      modalSetup.classList.add('modal--hidden');
    } else {
      modalBackground.classList.remove('modal--hidden');
      modalSetup.classList.remove('modal--hidden');
    }
  };

  const togglePlayerTurn = (isPlayer1Turn) => {
    const player1 = document.querySelector('#p1');
    const player2 = document.querySelector('#p2');

    if(isPlayer1Turn) {
      player1.classList.remove('player--inactive');
      player2.classList.add('player--inactive');
    } else {
      player1.classList.add('player--inactive');
      player2.classList.remove('player--inactive');      
    }
  };

  return {clearBoard, endgameResult, endgameShowHide, enterNames, makeMove, setupShowHide, togglePlayerTurn};
})();

//CONTROLLER -> links MODEL & VIEW
const GameController = ((model, view) => {
  
})();
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