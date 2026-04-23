class GameOfLife {
  private cols = 0;
  private rows = 0;
  private cellSize: number;
  private stepInterval: number;
  private grid: Uint8Array = new Uint8Array(0);
  private nextGrid: Uint8Array = new Uint8Array(0);
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mouseX = -1000;
  private mouseY = -1000;
  private frame = 0;
  private rafId = 0;

  constructor(canvas: HTMLCanvasElement, cellSize = 12, stepInterval = 6) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.cellSize = cellSize;
    this.stepInterval = stepInterval;
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);

    const newCols = Math.ceil(width / this.cellSize);
    const newRows = Math.ceil(height / this.cellSize);
    const newGrid = new Uint8Array(newCols * newRows);

    for (let y = 0; y < newRows; y++) {
      for (let x = 0; x < newCols; x++) {
        if (y < this.rows && x < this.cols) {
          newGrid[y * newCols + x] = this.grid[y * this.cols + x];
        } else {
          newGrid[y * newCols + x] = Math.random() < 0.12 ? 1 : 0;
        }
      }
    }

    this.cols = newCols;
    this.rows = newRows;
    this.grid = newGrid;
    this.nextGrid = new Uint8Array(newCols * newRows);
  }

  private getCell(x: number, y: number): number {
    const cx = ((x % this.cols) + this.cols) % this.cols;
    const cy = ((y % this.rows) + this.rows) % this.rows;
    return this.grid[cy * this.cols + cx];
  }

  private countNeighbors(x: number, y: number): number {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        n += this.getCell(x + dx, y + dy);
      }
    }
    return n;
  }

  step() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const i = y * this.cols + x;
        const neighbors = this.countNeighbors(x, y);
        const alive = this.grid[i];
        this.nextGrid[i] = alive
          ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
          : (neighbors === 3 ? 1 : 0);
      }
    }
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  }

  seedNearMouse() {
    if (this.mouseX < 0) return;
    const cx = Math.floor(this.mouseX / this.cellSize);
    const cy = Math.floor(this.mouseY / this.cellSize);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (Math.random() < 0.2) {
          const col = ((cx + dx) % this.cols + this.cols) % this.cols;
          const row = ((cy + dy) % this.rows + this.rows) % this.rows;
          this.grid[row * this.cols + col] = 1;
        }
      }
    }
  }

  render() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const baseOpacity = isDark ? 0.07 : 0.05;
    const nearOpacity = isDark ? 0.16 : 0.12;
    const mouseRadius = 120;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const r = isDark ? 255 : 0;
    const g = isDark ? 255 : 0;
    const b = isDark ? 255 : 0;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (!this.grid[y * this.cols + x]) continue;

        const px = x * this.cellSize;
        const py = y * this.cellSize;
        const dist = Math.hypot(
          px + this.cellSize / 2 - this.mouseX,
          py + this.cellSize / 2 - this.mouseY
        );
        const t = Math.max(0, 1 - dist / mouseRadius);
        const opacity = baseOpacity + t * (nearOpacity - baseOpacity);

        this.ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
        this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
      }
    }
  }

  onMouseMove(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  start() {
    const loop = () => {
      this.frame++;
      if (this.frame % this.stepInterval === 0) {
        this.seedNearMouse();
        this.step();
      }
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }
}

let game: GameOfLife | null = null;
let resizeTimeout: ReturnType<typeof setTimeout>;

const onMouseMove = (e: MouseEvent) => game?.onMouseMove(e.clientX, e.clientY);
const onResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => game?.resize(), 200);
};

function cleanup() {
  if (game) {
    game.stop();
    game = null;
  }
  document.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("resize", onResize);
}

function initAmbientCanvas() {
  cleanup();

  const canvas = document.querySelector<HTMLCanvasElement>(".ambient-canvas");
  if (!canvas) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  game = new GameOfLife(canvas);

  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onResize);

  requestAnimationFrame(() => canvas.classList.add("is-active"));

  game.start();
}

document.addEventListener("astro:page-load", initAmbientCanvas);
