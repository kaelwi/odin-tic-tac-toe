const container = document.getElementById('container');

const playerFactory = (mark) => {
  return { mark };
};

const game = (() => {
  let player;
  let computer;
  let board = ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'];

  const renderBoard = () => {
    board.forEach(element => {
      let div = document.createElement('div');
      div.textContent = element;
      container.appendChild(div);
    });
  }

  return { renderBoard };
})();

// gameboard.renderBoard();

const displayController = (() => {
  document.getElementById('start').addEventListener('click', () => {
    game.renderBoard();
  })

  document.querySelectorAll('#button-container > button').forEach((button) => {
    button.addEventListener('click', () => {
      
    })
  })
})();