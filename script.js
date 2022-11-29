/*
 *  Player factory function
 */
const playerFactory = (mark) => {
  return { mark };
};

/*
 *  Gameboard module.
 *  Store and update board and winning combinatoins. 
 *  Reset board.
 */
const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];
  const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8],   // row
                                [0, 3, 6], [1, 4, 7], [2, 5, 8],  // col
                                [0, 4, 8], [2, 4, 6]];            // diagonal

  function setBoard(position, mark) {
    board[position] = mark;
  }

  function getBoard() {
    return board;
  }

  function getWinningCombinations() {
    return winningCombinations;
  }

  function resetBoard() {
    board.forEach((_element, index) => { 
      board[index] = '';
    });
  }

  return { setBoard, getBoard, getWinningCombinations, resetBoard };
})();

/*
 *  Control UI elements.
 *  Set up (or reset) the tic-tac-toe grid using divs.
 * 
 */
const displayController = (() => {
  const container = document.getElementById('container');
  const buttons = document.querySelectorAll('#button-container > button');
  const restart = document.getElementById('restart');

  /*
   *  Set up grid for tic-tac-toe
   */
  gameBoard.getBoard().forEach((_element, index) => {
    let div = document.createElement('div');
    div.dataset.position = index;
    container.appendChild(div);
  });

  restart.addEventListener('click', () => {
    gameBoard.resetBoard();
    game.resetGame();
    resetDisplay();
  });

  /*
   * Remove already written x/o marks
   */
  function resetDisplay() {
    Array.from(container.children).forEach(el => {
      while(el.firstChild) {
        el.removeChild(el.lastChild);
      }
    });
    showResult('');
  }

  /*
   *  Allow mark choice only if play hasn't started yet
   */
  buttons.forEach((button) => {
    button.addEventListener('click', e => {
      if (!game.getPlay() && !game.isGameOver()) {
        let mark = e.target.dataset.mark;
        game.setPlayers(mark);
      }
    })
  })

  /*
   * Allow setting mark only if players have chosen their mark and if there is no 
   * other mark in that particular field.
   */
  container.addEventListener('click', e => {
    if (game.getPlay() && e.target.tagName == 'DIV' && e.target.children.length == 0) {
      let mark = document.createElement('h1');
      mark.textContent = game.getCurrentPlayer().mark;
      e.target.appendChild(mark);
      gameBoard.setBoard(e.target.dataset.position, game.getCurrentPlayer().mark);
      game.nextTurn();
    }
  })

  /*
   * Set mark for the computer
   */
  function setComputerTurn(position, mark) {
    let heading = document.createElement('h1');
    heading.textContent = mark;
    gameBoard.setBoard(position, mark);
    container.children[position].appendChild(heading);
  }

  function showResult(winner) {
    document.getElementById('result').textContent = winner;
  }

  return { setComputerTurn, showResult };
})();

const game = (() => {
  let player;
  let computer;
  let currentPlayer;

  let play = false;
  let gameover = false;

  function resetGame() {
    player = null;
    computer = null;
    play = false;
    gameover = false;
    currentPlayer = null;
  }

  function setPlayers(mark) {
    player = playerFactory(mark);
    computer = playerFactory(mark == 'x' ? 'o' : 'x');
    play = true;
    currentPlayer = player;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getPlay() {
    return play;
  }

  function isGameOver() {
    return gameover;
  }

  function nextTurn() {
    checkWinner();

    if (!gameover) {
      currentPlayer = (currentPlayer == player ? computer : player);
      if (currentPlayer == computer) {
        computerTurn();
        nextTurn();
      }
    }
  }

  /*
   * Choose a position for the computer's turn.
   * Based on a random choice from remaining empty fields.
   */
  function computerTurn() {
    const temp = [];
    gameBoard.getBoard().forEach(function(element, index) {
      if (element == '') {
        temp.push(index);
      }
    });

    let randPosition = temp[Math.floor(Math.random() * temp.length)];
    displayController.setComputerTurn(randPosition, currentPlayer.mark);    
  }

  /*
   * Check if there is a winning combination on the field or if the 
   * board is already filled (tie).
   */
  function checkWinner() {
    const board = gameBoard.getBoard();
    const win = gameBoard.getWinningCombinations();

    win.forEach((el) => {
      if (board[el[0]] == board[el[1]] && board[el[1]] == board[el[2]] &&
          board[el[0]] != '') {
            const winner = (board[el[0]] == player.mark) ? 'HUMAN' : 'COMPUTER';
            gameover = true;
            displayController.showResult(winner);
          }
    })

    if (board.find(el => el == '') == null) {
      displayController.showResult('TIE');
      gameover = true;
    }

    play = !gameover;
  }

  return { isGameOver, getPlay, nextTurn, setPlayers, getCurrentPlayer, resetGame };
})();