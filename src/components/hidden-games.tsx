"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';

// Simple Tetris game implementation
const useTetris = () => {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const BLOCK_SIZE = 20;
  
  const [board, setBoard] = useState<number[][]>(
    Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    x: number;
    y: number;
    color: string;
  }>({
    shape: [[1, 1], [1, 1]],  // Default square piece
    x: 4,
    y: 0,
    color: '#00bcd4',
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const dropInterval = useRef<number>(1000); // ms
  
  // Tetromino shapes - wrap in useMemo to prevent recreating on each render
  const tetrominoes = useMemo(() => [
    { shape: [[1, 1], [1, 1]], color: '#ffd600' }, // square
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#9c27b0' }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#4caf50' }, // Z
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#f44336' }, // S
    { shape: [[1, 1, 1, 1]], color: '#00bcd4' }, // I
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#2196f3' }, // L
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9800' }, // J
  ], []);

  // Generate new piece function defined before it's used in resetGame
  const generateNewPiece = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    const newPiece = tetrominoes[randomIndex];
    
    setCurrentPiece({
      shape: newPiece.shape,
      x: Math.floor((BOARD_WIDTH - newPiece.shape[0].length) / 2),
      y: 0,
      color: newPiece.color,
    });
  }, [tetrominoes]);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0)));
    generateNewPiece();
    setScore(0);
    setGameOver(false);
    setPaused(false);
    dropInterval.current = 1000;
  }, [generateNewPiece]);
  
  // Check collision
  const checkCollision = useCallback((shape: number[][], x: number, y: number) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const boardX = x + col;
          const boardY = y + row;
          
          // Check boundaries
          if (
            boardX < 0 || 
            boardX >= BOARD_WIDTH || 
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);
  
  // Rotate piece
  const rotatePiece = useCallback(() => {
    const rotated = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    if (!checkCollision(rotated, currentPiece.x, currentPiece.y)) {
      setCurrentPiece({
        ...currentPiece,
        shape: rotated,
      });
    }
  }, [currentPiece, checkCollision]);
  
  // Move piece
  const movePiece = useCallback((dx: number) => {
    if (!checkCollision(currentPiece.shape, currentPiece.x + dx, currentPiece.y)) {
      setCurrentPiece({
        ...currentPiece,
        x: currentPiece.x + dx,
      });
    }
  }, [currentPiece, checkCollision]);
  
  // Drop piece
  const dropPiece = useCallback(() => {
    if (!checkCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece({
        ...currentPiece,
        y: currentPiece.y + 1,
      });
    } else {
      // Merge piece with board
      const newBoard = [...board];
      
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col] !== 0) {
            const boardY = currentPiece.y + row;
            
            if (boardY < 0) {
              setGameOver(true);
              return;
            }
            
            if (boardY >= 0) {
              newBoard[boardY][currentPiece.x + col] = 1;
            }
          }
        }
      }
      
      // Check for completed rows
      const completedRows = newBoard.filter(row => row.every(cell => cell !== 0));
      if (completedRows.length > 0) {
        // Remove completed rows
        const newRows = Array(completedRows.length).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
        setBoard([...newRows, ...newBoard.filter(row => !row.every(cell => cell !== 0))]);
        
        // Update score
        setScore(prev => prev + completedRows.length * 100);
        
        // Increase speed
        dropInterval.current = Math.max(100, dropInterval.current - 50);
      } else {
        setBoard(newBoard);
      }
      
      // Generate new piece
      generateNewPiece();
    }
  }, [board, currentPiece, checkCollision, generateNewPiece]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || paused) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          // Hard drop - implement if desired
          break;
        case 'p':
          setPaused(prev => !prev);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, paused, movePiece, dropPiece, rotatePiece]);
  
  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (gameOver || paused) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    const elapsed = timestamp - lastTimeRef.current;
    
    if (elapsed > dropInterval.current) {
      dropPiece();
      lastTimeRef.current = timestamp;
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, paused, dropPiece]);
  
  // Start and stop game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);
  
  // Initial setup
  useEffect(() => {
    resetGame();
  }, [resetGame]);
  
  return {
    board,
    currentPiece,
    score,
    gameOver,
    paused,
    BOARD_WIDTH,
    BOARD_HEIGHT,
    BLOCK_SIZE,
    resetGame,
    setPaused,
    movePiece,
    rotatePiece,
    dropPiece,
  };
};

const HiddenGames = () => {
  const { theme } = useTheme();
  // Actually using these variables in the UI/logic
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [drawingActive, setDrawingActive] = useState(false);
  const [tetrisActive, setTetrisActive] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  
  // Track keypresses for Konami code - wrap in useMemo to prevent array recreation
  const konamiCode = useMemo(() => [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ], []);
  
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialize tetris game - we initialize this regardless of client/server, but only use it on the client
  const tetris = useTetris();

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tetrisActive) return; // Don't track Konami code if Tetris is already active
      
      const key = e.key.toLowerCase();
      const newKeysPressed = [...keysPressed, key];
      
      // Only keep the last N keys pressed, where N is the length of the Konami code
      if (newKeysPressed.length > konamiCode.length) {
        newKeysPressed.shift();
      }
      
      setKeysPressed(newKeysPressed);
      
      // Check if Konami code has been entered
      const konamiString = konamiCode.join('').toLowerCase();
      const pressedString = newKeysPressed.join('').toLowerCase();
      
      if (pressedString === konamiString) {
        setKonamiActivated(true);
        setTetrisActive(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keysPressed, tetrisActive, konamiCode]);

  // Drawing canvas setup
  useEffect(() => {
    if (drawingActive && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.7;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
  }, [drawingActive, theme]);

  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    lastPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);
  
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(lastPos.current.x, lastPos.current.y);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    
    lastPos.current = { x, y };
  }, []);
  
  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
  }, []);

  // Secret click detection for drawing game
  useEffect(() => {
    if (secretClickCount >= 5) {
      setDrawingActive(true);
      setSecretClickCount(0);
    }
  }, [secretClickCount]);

  const handleSecretClick = () => {
    setSecretClickCount(prev => prev + 1);
  };

  // Close active games
  const handleClose = (game: 'tetris' | 'drawing') => {
    if (game === 'tetris') {
      setTetrisActive(false);
      setKonamiActivated(false);
    } else {
      setDrawingActive(false);
    }
  };

  // Clear drawing canvas
  const clearDrawing = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <>
      {/* Hidden clickable area */}
      <div 
        className="fixed top-0 left-0 w-16 h-16 cursor-default z-50" 
        onClick={handleSecretClick}
        aria-hidden="true"
      />
      
      {/* Drawing Canvas Game */}
      {drawingActive && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-4xl w-full ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-800 border border-gray-700'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">Hidden Drawing Canvas</h3>
              <div className="flex gap-2">
                <button 
                  onClick={clearDrawing}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  aria-label="Clear canvas"
                >
                  Clear
                </button>
                <button 
                  onClick={() => handleClose('drawing')}
                  className="p-2 rounded-full hover:bg-gray-700"
                  aria-label="Close drawing canvas"
                >
                  <svg className="w-6 h-6 text-gray-300" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-700'}`}
              />
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-300">
              <p>You found the hidden drawing canvas! Have fun sketching.</p>
              <p className="mt-2 text-xs opacity-75">Easter egg: Click in the top-left corner 5 times to reveal this canvas</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tetris Game */}
      {tetrisActive && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-lg w-full ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-800 border border-gray-700'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">Tetris</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => tetris?.resetGame()}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  aria-label="Restart game"
                >
                  Restart
                </button>
                <button 
                  onClick={() => tetris?.setPaused(!tetris.paused)}
                  className={`p-2 rounded-lg ${tetris?.paused ? 'bg-green-600' : 'bg-amber-600'} text-white hover:opacity-90 transition-colors`}
                  aria-label={tetris?.paused ? "Resume game" : "Pause game"}
                >
                  {tetris?.paused ? "Resume" : "Pause"}
                </button>
                <button 
                  onClick={() => handleClose('tetris')}
                  className="p-2 rounded-full hover:bg-gray-700"
                  aria-label="Close tetris game"
                >
                  <svg className="w-6 h-6 text-gray-300" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4 flex flex-col items-center bg-gray-800/50">
              <div className="mb-4 flex justify-between w-full text-gray-200">
                <span className="font-bold">Score: {tetris?.score}</span>
                <span className={`font-bold ${tetris?.gameOver ? 'text-red-400' : ''}`}>
                  {tetris?.gameOver ? 'Game Over' : tetris?.paused ? 'Paused' : 'Playing'}
                </span>
              </div>
              
              <div 
                className="grid gap-[1px] bg-gray-700 p-1 rounded-md"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${tetris?.BOARD_WIDTH}, ${tetris?.BLOCK_SIZE}px)`,
                  width: `${tetris?.BOARD_WIDTH * tetris?.BLOCK_SIZE + tetris?.BOARD_WIDTH + 1}px`
                }}
              >
                {tetris?.board.map((row, y) => 
                  row.map((cell, x) => {
                    // Check if current piece occupies this cell
                    let isCurrentPiece = false;
                    let color = theme === 'dark' ? '#1a1d24' : '#1e2430';
                    
                    if (tetris?.currentPiece) {
                      const { shape, x: pieceX, y: pieceY } = tetris.currentPiece;
                      const pieceRows = shape.length;
                      const pieceCols = shape[0].length;
                      
                      for (let py = 0; py < pieceRows; py++) {
                        for (let px = 0; px < pieceCols; px++) {
                          if (
                            shape[py][px] !== 0 &&
                            pieceX + px === x &&
                            pieceY + py === y &&
                            pieceY + py >= 0 // Don't render off-board
                          ) {
                            isCurrentPiece = true;
                            color = tetris.currentPiece.color;
                          }
                        }
                      }
                    }
                    
                    return (
                      <div 
                        key={`${x}-${y}`}
                        className="border border-gray-900 rounded-sm"
                        style={{ 
                          width: `${tetris?.BLOCK_SIZE}px`, 
                          height: `${tetris?.BLOCK_SIZE}px`,
                          backgroundColor: cell === 1 ? '#6366f1' : isCurrentPiece ? color : '#1a1d24'
                        }}
                      />
                    );
                  })
                )}
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-300">
                <p className="mb-2">Controls:</p>
                <div className="flex justify-center gap-3">
                  <div>↑ Rotate</div>
                  <div>← Move left</div>
                  <div>→ Move right</div>
                  <div>↓ Move down</div>
                  <div>P Pause</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-300">
              <p>You activated the Konami code! ↑↑↓↓←→←→BA</p>
              {konamiActivated && <p className="mt-1 text-xs">Konami code status: Activated</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HiddenGames;