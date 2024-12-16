import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

interface Position {
  row: number;
  col: number;
}

const ChessBoard: React.FC = () => {
  const [rookPosition, setRookPosition] = useState<Position>({ row: 6, col: 6 });
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<string[]>(["G2"]);
  const squareSize = 60;
  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const toggleTimer = () => {
    setIsTimerActive((prevState) => !prevState);
  };

  const handleSquarePress = (row: number, col: number): void => {
    if (possibleMoves.some((move) => move.row === row && move.col === col)) {
      setRookPosition({ row, col });
      setPossibleMoves([]);
      setMoveCount((prevCount) => prevCount + 1);

      const move = `${String.fromCharCode(65 + col)}${8 - row}`;
      setMoveHistory((prevHistory) => [...prevHistory, move]);
    } else if (rookPosition.row === row && rookPosition.col === col) {
      const moves = calculatePossibleMoves(row, col);
      setPossibleMoves(moves);
    }
  };

  const calculatePossibleMoves = (row: number, col: number): Position[] => {
    const moves: Position[] = [];

    // Add all possible vertical and horizontal moves for the rook
    for (let i = 0; i < 8; i++) {
      if (i !== row) moves.push({ row: i, col }); // Vertical moves
      if (i !== col) moves.push({ row, col: i }); // Horizontal moves
    }

    return moves;
  };

  const isSquareBlack = (row: number, col: number): boolean => {
    return (row + col) % 2 === 1;
  };

  const resetGame = () => {
    setRookPosition({ row: 6, col: 6 });
    setMoveCount(0);
    setMoveHistory([]);
    setTimer(0);
    setIsTimerActive(false);
  };

  const undoMove = () => {
    if (moveHistory.length > 1) { 
      const lastMove = moveHistory[moveHistory.length - 2]; 
      console.log("Undoing move:", lastMove);
  
      
      const prCol = lastMove.charCodeAt(0) - 65; 
      const prRow = 8 - parseInt(lastMove[1]);   
  
      
      setRookPosition({ row: prRow, col: prCol });
      setMoveHistory((prevHistory) => prevHistory.slice(0, -1)); 
      setMoveCount((prevCount) => Math.max(0, prevCount - 1));  
      setPossibleMoves([]); // Clear possible moves
    } else {
      console.log("No moves back");
    }
  };
  

  return (
    <View style={styles.board}>
      <View style={styles.labelsRow}>
        {[...'ABCDEFGH'].map((label, index) => (
          <Text key={index} style={styles.columnLabel}>{label}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {[...Array(8)].map((_, row) => (
          <View key={row} style={styles.row}>
            <Text style={styles.rowLabel}>{8 - row}</Text>
            {[...Array(8)].map((_, col) => {
              const isRook = rookPosition.row === row && rookPosition.col === col;
              const isPossibleMove = possibleMoves.some(
                (move) => move.row === row && move.col === col
              );

              return (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.square,
                    {
                      width: squareSize,
                      height: squareSize,
                      backgroundColor: isPossibleMove
                        ? '#aaffaa'
                        : isRook
                        ? '#ffaa00'
                        : isSquareBlack(row, col)
                        ? '#444'
                        : '#fff',
                    },
                  ]}
                  onPress={() => handleSquarePress(row, col)}
                >
                  {isRook && <Text style={styles.rook}>♖</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Text style={styles.moveCount}>Moves: {moveCount}</Text>
      <Text style={styles.timer}>Time: {timer}s</Text>
      <Text style={styles.history}>Move History: {moveHistory.join(' → ')}</Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleTimer}>
        <Text style={styles.toggleButtonText}>
          {isTimerActive ? 'Pause Timer' : 'Start Timer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.undoButton} onPress={undoMove}>
        <Text style={styles.undoButtonText}>Undo Move</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'center',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  columnLabel: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  rowLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  rook: {
    fontSize: 24,
  },
  moveCount: {
    marginTop: 10,
  },
  timer: {
    marginTop: 10,
  },
  history: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  toggleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
  },
  undoButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF5733',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
  },
});

export default ChessBoard;
