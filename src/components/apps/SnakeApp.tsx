import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, RotateCcw, Play, Pause, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/audio';

const GRID_SIZE = 20;
const CANVAS_SIZE = 280;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE; // 14px

interface Point {
  x: number;
  y: number;
}

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIR: Point = { x: 0, y: -1 };

export const SnakeApp: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('jeptha_snake_highscore') || '0', 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable Game State held in refs for 60fps zero-jitter game loop
  const snakeRef = useRef<Point[]>([...INITIAL_SNAKE]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const speedRef = useRef<number>(110);
  const scoreRef = useRef<number>(0);
  const highScoreRef = useRef<number>(highScore);
  const isPausedRef = useRef<boolean>(false);
  const gameOverRef = useRef<boolean>(false);

  // Input Buffer / Queue (eliminates dropped or delayed turns)
  const inputQueueRef = useRef<Point[]>([]);
  const lastProcessedDirRef = useRef<Point>({ ...INITIAL_DIR });

  // Update synchronized refs
  isPausedRef.current = isPaused;
  gameOverRef.current = gameOver;
  highScoreRef.current = highScore;

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    const occupied = new Set(currentSnake.map((s) => `${s.x},${s.y}`));
    const emptyCells: Point[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!occupied.has(`${x},${y}`)) {
          emptyCells.push({ x, y });
        }
      }
    }
    if (emptyCells.length === 0) return { x: 0, y: 0 };
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, []);

  const queueDirection = useCallback((newDir: Point) => {
    if (gameOverRef.current || isPausedRef.current) return;

    // Check against either the last queued direction or the currently moving direction
    const queue = inputQueueRef.current;
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : lastProcessedDirRef.current;

    // Prevent 180° reverse direction into self and prevent duplicate direction
    const isOpposite = newDir.x === -lastDir.x && newDir.y === -lastDir.y;
    const isSame = newDir.x === lastDir.x && newDir.y === lastDir.y;

    if (!isOpposite && !isSame && queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  const resetGame = useCallback(() => {
    soundFx.playClick();
    snakeRef.current = [...INITIAL_SNAKE];
    lastProcessedDirRef.current = { ...INITIAL_DIR };
    inputQueueRef.current = [];
    speedRef.current = 110;
    scoreRef.current = 0;
    foodRef.current = generateFood(INITIAL_SNAKE);

    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    gameOverRef.current = false;
    isPausedRef.current = false;
  }, [generateFood]);

  const togglePause = useCallback(() => {
    if (gameOverRef.current) return;
    soundFx.playClick();
    setIsPaused((p) => {
      const next = !p;
      isPausedRef.current = next;
      return next;
    });
  }, []);

  // Keyboard navigation with zero input lag & prevents page scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scroll on arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (['ArrowUp', 'KeyW', 'KeyK'].includes(e.code)) {
        queueDirection({ x: 0, y: -1 });
      } else if (['ArrowDown', 'KeyS', 'KeyJ'].includes(e.code)) {
        queueDirection({ x: 0, y: 1 });
      } else if (['ArrowLeft', 'KeyA', 'KeyH'].includes(e.code)) {
        queueDirection({ x: -1, y: 0 });
      } else if (['ArrowRight', 'KeyD', 'KeyL'].includes(e.code)) {
        queueDirection({ x: 1, y: 0 });
      } else if (e.code === 'Space' || e.code === 'KeyP') {
        togglePause();
      } else if (e.code === 'KeyR' && gameOverRef.current) {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queueDirection, togglePause, resetGame]);

  // Initial Food Placement
  useEffect(() => {
    foodRef.current = generateFood(INITIAL_SNAKE);
  }, [generateFood]);

  // High-performance 60FPS Game Loop with Delta Accumulator and HTML5 Canvas Rendering
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let accumulator = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina / High-DPI canvas scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const tick = () => {
      if (gameOverRef.current || isPausedRef.current) return;

      // Dequeue next player direction if available
      if (inputQueueRef.current.length > 0) {
        lastProcessedDirRef.current = inputQueueRef.current.shift()!;
      }

      const dir = lastProcessedDirRef.current;
      const currentSnake = snakeRef.current;
      const head: Point = {
        x: currentSnake[0].x + dir.x,
        y: currentSnake[0].y + dir.y,
      };

      // Wall collision check
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOverRef.current = true;
        setGameOver(true);
        soundFx.playError();
        return;
      }

      // Self collision check
      if (currentSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        gameOverRef.current = true;
        setGameOver(true);
        soundFx.playError();
        return;
      }

      const newSnake = [head, ...currentSnake];

      // Food collision check
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        soundFx.playFood();
        scoreRef.current += 10;
        const newScore = scoreRef.current;
        setScore(newScore);

        if (newScore > highScoreRef.current) {
          highScoreRef.current = newScore;
          setHighScore(newScore);
          localStorage.setItem('jeptha_snake_highscore', newScore.toString());
        }

        // Gradually increase speed
        speedRef.current = Math.max(55, speedRef.current - 2.5);
        foodRef.current = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const render = () => {
      // 1. Clear background
      ctx.fillStyle = '#06100a';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // 2. Subtle arcade grid background
      ctx.strokeStyle = '#0c2417';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, CANVAS_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(CANVAS_SIZE, pos);
        ctx.stroke();
      }

      // 3. Render Food with pulse glow
      const food = foodRef.current;
      const fx = food.x * CELL_SIZE + CELL_SIZE / 2;
      const fy = food.y * CELL_SIZE + CELL_SIZE / 2;
      const foodRadius = (CELL_SIZE / 2) - 2;

      ctx.save();
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(fx, fy, foodRadius, 0, Math.PI * 2);
      ctx.fill();

      // Food highlight
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(fx - 1.5, fy - 1.5, foodRadius / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Render Snake
      const snake = snakeRef.current;
      const currentDir = lastProcessedDirRef.current;

      for (let i = snake.length - 1; i >= 0; i--) {
        const seg = snake[i];
        const sx = seg.x * CELL_SIZE + 1;
        const sy = seg.y * CELL_SIZE + 1;
        const sSize = CELL_SIZE - 2;

        if (i === 0) {
          // Head
          ctx.save();
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.roundRect(sx, sy, sSize, sSize, 4);
          ctx.fill();
          ctx.restore();

          // Snake Eyes according to direction
          ctx.fillStyle = '#064e3b';
          const eyeRadius = 1.5;
          let eye1 = { x: sx + 3, y: sy + 3 };
          let eye2 = { x: sx + sSize - 3, y: sy + 3 };

          if (currentDir.x === 1) {
            eye1 = { x: sx + sSize - 3, y: sy + 3 };
            eye2 = { x: sx + sSize - 3, y: sy + sSize - 3 };
          } else if (currentDir.x === -1) {
            eye1 = { x: sx + 3, y: sy + 3 };
            eye2 = { x: sx + 3, y: sy + sSize - 3 };
          } else if (currentDir.y === 1) {
            eye1 = { x: sx + 3, y: sy + sSize - 3 };
            eye2 = { x: sx + sSize - 3, y: sy + sSize - 3 };
          }

          ctx.beginPath();
          ctx.arc(eye1.x, eye1.y, eyeRadius, 0, Math.PI * 2);
          ctx.arc(eye2.x, eye2.y, eyeRadius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body segment
          const alpha = Math.max(0.6, 1 - (i / snake.length) * 0.4);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.beginPath();
          ctx.roundRect(sx, sy, sSize, sSize, 3);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!isPausedRef.current && !gameOverRef.current) {
        accumulator += dt;
        // Cap accumulator to avoid spiral of ticks on tab refocus
        if (accumulator > 300) accumulator = 300;

        while (accumulator >= speedRef.current) {
          tick();
          accumulator -= speedRef.current;
        }
      }

      render();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [generateFood]);

  return (
    <div className="h-full flex flex-col bg-[#0a0f0d] text-emerald-400 font-mono select-none p-3 items-center justify-between">
      {/* Score Header */}
      <div className="w-full max-w-xs flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 border border-emerald-500/20 text-xs">
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
            onClick={togglePause}
            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-300 transition-colors"
            title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetGame}
            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-300 transition-colors"
            title="Reset Game (R)"
            aria-label="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Retro Arcade Canvas Viewport */}
      <div className="relative my-2 p-1 rounded-xl bg-black border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
          className="rounded block cursor-crosshair"
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <p className="text-red-500 font-bold text-lg tracking-wider mb-1 animate-pulse">
              GAME OVER
            </p>
            <p className="text-xs text-gray-400 mb-3">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95"
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
          onClick={() => queueDirection({ x: 0, y: -1 })}
          className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/40 text-emerald-400 transition-colors"
          aria-label="Up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => queueDirection({ x: -1, y: 0 })}
            className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/40 text-emerald-400 transition-colors"
            aria-label="Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => queueDirection({ x: 0, y: 1 })}
            className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/40 text-emerald-400 transition-colors"
            aria-label="Down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => queueDirection({ x: 1, y: 0 })}
            className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center active:bg-emerald-500/40 text-emerald-400 transition-colors"
            aria-label="Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
