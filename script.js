//PLAYERS
const Player = (name, mark) => {
  return {name, mark};
};

//controls game logic/flow
const GameModel = (() => {
  const _WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let _board;
  let _player1;
  let _player2;
  let _isPlayer1Turn;
  let _isSinglePlayer;
  let _difficultyLevel;

  const canMakeMove = (index) => {
    return _board[index] == '';
  };

  const changePlayerTurn = () => {
    _isPlayer1Turn = !_isPlayer1Turn;
  };

  const getDifficultyLevel = () => {
    return _difficultyLevel;
  };

  //returns [-1=not endgame; 0=tie; 1=player1 win; 2=player2 win]
  const getEndgameResult = () => {
    //check for winner
    for(let comboNum = 0; comboNum < _WINNING_COMBOS.length; comboNum++) {
      if(_board[_WINNING_COMBOS[comboNum][0]] == _board[_WINNING_COMBOS[comboNum][1]] && _board[_WINNING_COMBOS[comboNum][0]] == _board[_WINNING_COMBOS[comboNum][2]]) {
        if(_board[_WINNING_COMBOS[comboNum][0]] == _player1.mark) {
          return 1;
        };
        if(_board[_WINNING_COMBOS[comboNum][0]] == _player2.mark) {
          return 2;
        };
      }
    }

    //check if any empty spots left
    if(_board.includes('')) {
      return -1;
    } else {
      return 0;
    }
  };

  const getIsPlayer1Turn = () => {
    return _isPlayer1Turn;
  };

  const getIsSinglePlayer = () => {
    return _isSinglePlayer;
  };

  //makes move for computer
  //difficulty [1=easy; 2=medium; 3=hard]
  //TODO implement medium and hard difficulties
  //returns index move is made on
  const makeAIMove = (difficulty) => {
    let index = -1;
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
        let indexOptions = [];
        for(let i = 0; i < _board.length; i++) {
          if(canMakeMove(i)) {
            indexOptions.push(i);
          }
        }
        index = indexOptions[Math.floor(Math.random() * indexOptions.length)];
        makeMove(index);
    }
    return index;
  };

  //fills board at index w/ current player's mark
  const makeMove = (index) => {
    _board[index] = _isPlayer1Turn ? _player1.mark : _player2.mark;
  };

  //brand new game
  const newGame = (player1Name, player2Name, player2IsAI, levelOfDifficulty) => {
    _player1 = Player(player1Name, 'X');
    _player2 = Player(player2Name, 'O');
    _isSinglePlayer = player2IsAI;
    _difficultyLevel = levelOfDifficulty;
    _board = Array(9).fill('');
    _isPlayer1Turn = true;
  };

  //new game w/ same players, settings
  const resetGame = () => {
    _board = Array(9).fill('');
    _isPlayer1Turn = true;
  };

  return {canMakeMove, changePlayerTurn, getDifficultyLevel, getEndgameResult, getIsPlayer1Turn, getIsSinglePlayer, makeAIMove, makeMove, newGame, resetGame};
})();

//controls what displays
const GameView = (() => {
  //players
  const _player1 = document.querySelector('#p1');
  const _player1Mark = document.querySelector('#p1Mark');
  const _player1Name = document.querySelector('#p1Name');
  const _player2 = document.querySelector('#p2');
  const _player2Mark = document.querySelector('#p2Mark');
  const _player2Name = document.querySelector('#p2Name');
  //cells
  const _cells = document.querySelectorAll('.board__cell');
  //modals
  const _modal = document.querySelector('#modal');
  //setup
  const _modalSetup = document.querySelector('#modalSetup');
  const _setupP1Name = document.querySelector('#setupP1Name');
  const _setupP2Name = document.querySelector('#setupP2Name');
  const _playAI = document.querySelector('#play-ai');
  const _difficultyEasy = document.querySelector('#difficulty-easy');
  const _difficultyMedium = document.querySelector('#difficulty-medium');
  const _difficultyHard = document.querySelector('#difficulty-hard');
  //endgame
  const _modalEndgame = document.querySelector('#modalEndgame');
  const _endgameWinner = document.querySelector('#endgameWinner');

  //clears all board cells
  const clearBoard = () => {
    for(let i = 0; i < _cells.length; i++) {
      _cells[i].textContent = '';
      _cells[i].classList.add(_cssClasses.cellPlayable);
      _cells[i].classList.remove(_cssClasses.cellBlue);
      _cells[i].classList.remove(_cssClasses.cellOrange);
    };
  };


  //list of css classes to add/remove
  const _cssClasses = (() => {
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
    _player1Name.textContent = p1Name;
    _player2Name.textContent = p2Name;
  };

  const hideEndgameModal = () => {
    _modal.classList.add(_cssClasses.modalHidden);
    _modalEndgame.classList.add(_cssClasses.modalHidden);
  };

  const hideSetupModal = () => {
    _modal.classList.add(_cssClasses.modalHidden);
    _modalSetup.classList.add(_cssClasses.modalHidden);
  };

  //fills indicated cell on board based on whose turn it is
  const makeMove = (isPlayer1Turn, index) => {
    _cells[index].classList.remove(_cssClasses.cellPlayable);

    if(isPlayer1Turn) {
      _cells[index].classList.add(_cssClasses.cellOrange);
      _cells[index].textContent = _player1Mark.textContent;
    } else {
      _cells[index].classList.add(_cssClasses.cellBlue);
      _cells[index].textContent = _player2Mark.textContent;
    }
  };

  //clears board and makes it player1's turn
  const resetGame = () => {
    clearBoard();
    togglePlayerTurn(true);
    hideEndgameModal();
  }

  const showEndgameModal = (resultNumber) => {
    _modal.classList.remove(_cssClasses.modalHidden);
    _modalEndgame.classList.remove(_cssClasses.modalHidden);
    let resultText = '';
    switch(resultNumber) {
      case 1:
        resultText = `${_player1Name.textContent} Won!`;
        break;
      case 2:
        resultText = `${_player2Name.textContent} Won!`;
        break;
      default:
        resultText = 'You Tied!';
    };
    _endgameWinner.textContent = resultText;
  };

  const showSetupModal = () => {
    _modal.classList.remove(_cssClasses.modalHidden);
    _modalSetup.classList.remove(_cssClasses.modalHidden);
    _setupP1Name.value = '';
    _setupP2Name.value = '';
    _playAI.checked = false;
    _difficultyEasy.checked = true;
    _difficultyEasy.disabled = true;
    _difficultyMedium.checked = false;
    _difficultyMedium.disabled = true;
    _difficultyHard.checked = false;
    _difficultyHard.disabled = true;
  };

  //change which player is visible to indicating their turn
  const togglePlayerTurn = (isPlayer1Turn) => {
    if(isPlayer1Turn) {
      _player1.classList.remove(_cssClasses.playerInactive);
      _player2.classList.add(_cssClasses.playerInactive);
    } else {
      _player1.classList.add(_cssClasses.playerInactive);
      _player2.classList.remove(_cssClasses.playerInactive);      
    }
  };
  return {clearBoard, enterNames, hideEndgameModal, hideSetupModal, makeMove, resetGame, showEndgameModal, showSetupModal, togglePlayerTurn};
})();

//Links model and view
const GameController = (() => {
    const addListeners = () => {
      const endGameButton = document.querySelector('#endgamePlayAgain');
      const playAIButton = document.querySelector('#play-ai');
      const startGameButton = document.querySelector('#setupStartGame');
      const boardCells = document.querySelectorAll('.board__cell');
      
      playAIButton.addEventListener('change', _playAIChangeHandler);
      startGameButton.addEventListener('click', _startGameHandler);
      Array.from(boardCells).forEach(cell => cell.addEventListener('click', _moveHandler));
      endGameButton.addEventListener('click', _playAgainHandler);
    };

    //handles all moves (user & ai)
    const _moveHandler = (e) => {
      const index = e.target.dataset.index;
      let result = -1;
      if(GameModel.canMakeMove(index)) {
        //make player move
        GameModel.makeMove(index);
        GameView.makeMove(GameModel.getIsPlayer1Turn(), index);

        //check endgame
        result = GameModel.getEndgameResult();
        //endgame
        if(result >= 0) {
          GameView.showEndgameModal(result);
          return;
        //not endgame
        } else {
          //change player turn
          GameModel.changePlayerTurn();
          GameView.togglePlayerTurn(GameModel.getIsPlayer1Turn());

          //make ai move (if applicable)
          if(GameModel.getIsSinglePlayer()) {
            const aiIndex = GameModel.makeAIMove(GameModel.getDifficultyLevel());
            GameView.makeMove(false, aiIndex);

            //check endgame
            result = GameModel.getEndgameResult();
            //endgame
            if(result >= 0) {
              GameView.showEndgameModal(result);
            //not endgame
            } else {
              GameModel.changePlayerTurn();
              GameView.togglePlayerTurn(true);
            };
          };
        };
      };
    };

    //handles user clicking play again
    const _playAgainHandler = () => {
      GameModel.resetGame();
      GameView.resetGame();
    };

    //handles user clicking play against computer
    const _playAIChangeHandler = (e) => {
      const setupPlayer2Name = document.querySelector('#setupP2Name');
      const setupEasy = document.querySelector('#difficulty-easy');
      const setupMedium = document.querySelector('#difficulty-medium');
      const setupHard = document.querySelector('#difficulty-hard');
      if(e.target.checked) {
        setupPlayer2Name.disabled = true;
        setupPlayer2Name.placeholder = 'Computer';
        setupPlayer2Name.value = '';
        setupEasy.disabled = false;
        setupEasy.checked = true;
        setupMedium.disabled = false;
        setupHard.disabled = false;
      } else {
        setupPlayer2Name.disabled = false;
        setupPlayer2Name.placeholder = 'Player 2';
        setupEasy.disabled = true;
        setupMedium.disabled = true;
        setupHard.disabled = true;
      }
    };

    //handles user clicking start game
    const _startGameHandler = () => {
      let p1Name = document.querySelector('#setupP1Name').value;
      let p2Name = document.querySelector('#setupP2Name').value;
      const defaultP1Name = 'Player 1';
      const defaultP2Name = 'Player 2';
      const computerName = 'Computer';
      const isPlayingAI = document.querySelector('#play-ai').checked;
      let difficulty = 0;
      //set final names
      if(p1Name == '') {
        p1Name = defaultP1Name;
      };
      if(p2Name == '') {
        p2Name = defaultP2Name
      };
      if(isPlayingAI) {
        p2Name = computerName;
      };
      //set difficulty
      if(document.querySelector('#difficulty-hard').checked) {
        difficulty = 3;
      } else if(document.querySelector('#difficulty-medium').checked) {
        difficulty = 2;
      } else {
        difficulty = 1;
      };

      //start game
      GameModel.newGame(p1Name, p2Name, isPlayingAI, difficulty);
      GameView.enterNames(p1Name, p2Name);
      GameView.resetGame();
      GameView.hideSetupModal();
    };
  return {addListeners};
})();

GameController.addListeners();
GameView.showSetupModal();