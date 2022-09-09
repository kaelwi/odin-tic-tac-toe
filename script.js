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
      container.appendChild(div);
    });
  }

  return { renderBoard, player, computer };
})();

// gameboard.renderBoard();

const displayController = (() => {

  let chosen = false;

  document.getElementById('start').addEventListener('click', () => {
    game.renderBoard();
  })

  document.querySelectorAll('#button-container > button').forEach((button) => {
    button.addEventListener('click', e => {
      if (!chosen) {
        let mark = e.target.dataset.mark;
        game.player = playerFactory(mark);
        game.computer = playerFactory(mark == 'x' ? 'o' : 'x');
        chosen = true;
      }
    })
  })

  container.addEventListener('click', e => {
    if (typeof game.player !== 'undefined' && e.target.children.length == 0) {
      let heading = document.createElement('h1');
      heading.textContent = game.player.mark;
      e.target.appendChild(heading);
    }
  })
})();

game.renderBoard();