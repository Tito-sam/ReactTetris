import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  function drawSquares() {
    const rowSquares = Array(3).fill(null);
    const squaresDraw = Array(3).fill(null);

    let n = 0;
    for (let i = 0; i < squaresDraw.length; i++) {
      squaresDraw[i] = (
        <div key={i} className="board-row">
          {rowSquares.map((square, j) => {
            let x = n;
            n++;
            return (
              <Square
                key={x}
                value={squares[x]}
                onSquareClick={() => {
                  handleClick(x);
                }}
              />
            );
          })}
        </div>
      );
    }
    return squaresDraw;
  }
  const drawRowSquares = drawSquares();
  return <>{drawSquares()}</>;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  let dataMove;
  let isFinishGame = currentSquares.includes(null);

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = "Ganador: " + winner;
    dataMove = "Se acabo el Juego";
  } else if (isFinishGame == false) {
    status = "Han empatado. ";
    dataMove = "Se acabo en juego.";
  } else {
    status = "Siguiente jugador: " + (xIsNext ? "X" : "O");
    dataMove = "Estas en el movimiento: " + (currentMove + 1);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Ir al movimiento #" + move;
    } else {
      description = "Ir al inicio del juego";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}> {description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <div>{dataMove}</div>
      </div>
    </div>
  );
}
