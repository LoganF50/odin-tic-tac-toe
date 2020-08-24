/*
THOUGHT PROCESS
  Setup Modal (see notebook):
    -default names to 'Player 1' and 'Player 2' if blank
    -Play Against Computer status
      >checked:
        *disable Player 2 Name (Name would be 'Computer')
        *select Easy difficulty
      >unchecked:
        *disable difficulty selection

  EndGame Modal (see notebook):

  Setup & Endgame Modals:
    -use same background (to dim board)
    -don't have action for background click

  Game Display
    -unique colors for players (all Player 1 stuff (name, marks, etc.) blue and all Player 2 stuff orange)
    -hide inactive players names/mark
*/


//MODEL
const Game = (() => {
  const WINNER_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let board = Array(9).fill('');
  let isPlayerOneTurn = true;

  const getPlayer = (getPlayer1 = true) => {
    return (getPlayer1 ? players[0] : players[1]);
  }
  const getBoard = () => board;
  const getIsSinglePlayer = () => isSinglePlayer;
  const getIsPlayerOneTurn = () => isPlayerOneTurn;
  const resetBoard = () => board = Array(9).fill('');
  const canMakeMove = (index) => board[index] == '';
  const makeMove = (index, mark) => board[index] = mark;
  //clears board, populates players, sets game status, etc
  const newGame = (playerOneName, playerTwoName) => {
    resetBoard();
    isPlayerOneTurn = true;
    isSinglePlayer = hasTwoPlayers;
    players.push(Player(playerOneName, 'X'));
    players.push(Player(playerTwoName, 'O'));
  };
  const isTie = !board.includes('');
  const isWinner = (mark) => {
    for (let i = 0; i < WINNER_COMBOS.length; i++) {
      if(board[WINNER_COMBOS[i][0]] === mark && board[WINNER_COMBOS[i][1]] === mark && board[WINNER_COMBOS[i][2]] === mark) {
        return true;
      }
    }
    return false;
  };

  return {getPlayer, getBoard, getIsSinglePlayer, getIsPlayerOneTurn, resetBoard, canMakeMove, makeMove, newGame, isTie, isWinner};
})();

//VIEW
const Board = (() => {
  const player1Name = document.querySelector('#p1Name');
  const player1Mark = document.querySelector('#p1Mark');
  const player2Name = document.querySelector('#p2Name');
  const player2Mark = document.querySelector('#p2Mark');
  const board = document.querySelector('#board');
  const cells = document.querySelectorAll('.board__cell');

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

  return {endgameShowHide, enterNames, setupShowHide, togglePlayerTurn};
})();

//CONTROLLER -> links MODEL & VIEW
const GameController = ((model, view) => {
  
})();

Game.newGame(false, 'Logan', 'Brandon');
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