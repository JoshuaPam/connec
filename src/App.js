import React, { useState } from "react";
import './App.css';  // Updated import for styles

const ConnectFour = () => {
  const rows = 6;
  const columns = 7;
  const initialBoard = Array.from({ length: rows }, () => Array(columns).fill(null));

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("Red");
  const [winner, setWinner] = useState(null);
  const [redScore, setRedScore] = useState(0);
  const [yellowScore, setYellowScore] = useState(0);

  const handleColumnClick = (colIndex) => {
    if (winner) return;

    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
      if (!board[rowIndex][colIndex]) {
        const newBoard = board.map((row) => row.slice());
        newBoard[rowIndex][colIndex] = currentPlayer;
        setBoard(newBoard);
        checkForWinner(newBoard, rowIndex, colIndex);

        if (!winner && isBoardFull(newBoard)) {
          setWinner("Draw");
        } else {
          setCurrentPlayer(currentPlayer === "Red" ? "Yellow" : "Red");
        }
        return;
      }
    }
  };

  const checkForWinner = (board, row, col) => {
    const directions = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: -1 }
    ];

    for (const { row: dRow, col: dCol } of directions) {
      let count = 1;
      count += countDiscs(board, row, col, dRow, dCol);
      count += countDiscs(board, row, col, -dRow, -dCol);

      if (count >= 4) {
        setWinner(currentPlayer);
        updateScore(currentPlayer);
        return;
      }
    }
  };

  const countDiscs = (board, row, col, dRow, dCol) => {
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;

    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
      count++;
      r += dRow;
      c += dCol;
    }

    return count;
  };

  const updateScore = (player) => {
    if (player === "Red") {
      setRedScore(redScore + 1);
    } else {
      setYellowScore(yellowScore + 1);
    }
  };

  const isBoardFull = (board) => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const handleRestart = () => {
    setBoard(initialBoard);
    setCurrentPlayer("Red");
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Connect Four</h1>

      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <p>Red: {redScore}</p>
        <p>Yellow: {yellowScore}</p>
      </div>

      <h2>Current Player: {currentPlayer}</h2>
      {winner && <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>}

      <div className="game-board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleColumnClick(colIndex)}
              className={`cell ${cell ? (cell === "Red" ? "red" : "yellow") : ""}`}
            />
          ))
        )}
      </div>

      <button onClick={handleRestart}>Restart Game</button>
    </div>
  );
};

export default ConnectFour;
