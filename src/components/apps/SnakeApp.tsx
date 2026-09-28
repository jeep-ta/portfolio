import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, RotateCcw, Play, Pause, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/audio';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIR = { x: 0, y: -1 };

export const SnakeApp: React.FC = () => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>(INITIAL_SNAKE);
  const [dir, setDir] = useState<{ x: number; y: number }>(INITIAL_DIR);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('jeptha_snake_highscore') || '0', 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(110);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const collides = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!collides) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    soundFx.playClick();
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    setScore(0);
    setSpeed(110);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: globalThis.KeyboardEvent) => {
      const current = dirRef.current;
      if (['ArrowUp', 'KeyW'].includes(e.code) && current.y === 0) {
        setDir({ x: 0, y: -1 });
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && current.y === 0) {
        setDir({ x: 0, y: 1 });
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && current.x === 0) {
        setDir({ x: -1, y: 0 });
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && current.x === 0) {
        setDir({ x: 1, y: 0 });
      } else if (e.code === 'Space') {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Main game tick
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = {
          x: prevSnake[0].x + dirRef.current.x,
          y: prevSnake[0].y + dirRef.current.y,
        };

        // Wall collision check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          soundFx.playError();
          return prevSnake;
        }

        // Self collision check
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          soundFx.playError();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food eaten check
        if (head.x === food.x && head.y === food.y) {
          soundFx.playFood();
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('jeptha_snake_highscore', nextScore.toString());
            }
            return nextScore;
          });
          setSpeed((sp) => Math.max(65, sp - 3));
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, speed, highScore, generateFood]);

  return (
    <div className="h-full flex flex-col bg-[#0a0f0d] text-emerald-400 font-mono select-none p-3 items-center justify-between">
      {/* Score Header */}
      <div className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 border border-emerald-500/20 text-xs">
        <div className="flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">SCORE: {score}</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>BEST: {highScore}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-300"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetGame}
            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-300"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Retro Arcade Grid Viewport */}
      <div className="relative my-2 p-1 rounded-xl bg-black border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10">
        <div
          className="grid gap-[1px] bg-[#0c1a12] p-[1px] rounded"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '260px',
            height: '260px',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((seg) => seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-[2px] transition-colors duration-75 ${
                  isHead
                    ? 'bg-emerald-300 shadow-sm shadow-emerald-200'
                    : isBody
                    ? 'bg-emerald-600'
                    : isFood
                    ? 'bg-red-500 animate-ping'
                    : 'bg-black/30'
                }`}
              />
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <p className="text-red-500 font-bold text-lg tracking-wider mb-1 animate-pulse">
              GAME OVER
            </p>
            <p className="text-xs text-gray-400 mb-3">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/75 rounded-xl flex flex-col items-center justify-center">
            <p className="text-amber-400 font-bold text-base tracking-widest">PAUSED</p>
            <p className="text-[10px] text-gray-400 mt-1">Press Space to Resume</p>
          </div>
        )}
      </div>

      {/* Mobile / Screen D-Pad Controls */}
      <div className="flex flex-col items-center gap-1 select-none">
        <button
          onClick={() => {
            if (dirRef.current.y === 0) setDir({ x: 0, y: -1 });
          }}
          className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/30 text-emerald-400"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (dirRef.current.x === 0) setDir({ x: -1, y: 0 });
            }}
            className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/30 text-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (dirRef.current.y === 0) setDir({ x: 0, y: 1 });
            }}
            className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/30 text-emerald-400"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (dirRef.current.x === 0) setDir({ x: 1, y: 0 });
            }}
            className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/30 text-emerald-400"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
