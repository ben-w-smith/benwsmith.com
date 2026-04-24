export class GameOfLife {
  private cols = 0;
  private rows = 0;
  private cellSize: number;
  private stepInterval: number;
  private grid: Uint8Array = new Uint8Array(0);
  private nextGrid: Uint8Array = new Uint8Array(0);
  private heatGrid: Float32Array = new Float32Array(0);
  private nextHeatGrid: Float32Array = new Float32Array(0);
  private alphaGrid: Float32Array = new Float32Array(0);
  private trailGrid: Float32Array = new Float32Array(0);
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  mouseX = -1000;
  mouseY = -1000;
  private prevTrailX = -1000;
  private prevTrailY = -1000;
  private frame = 0;
  private rafId = 0;
  private palette: string[] = [];
  private trailColor = "";
  private isDarkTheme = false;

  fadeIn = 0.06;
  fadeOut = 0.02;
  trailFade = 0.08; // ~0.4s at 30fps

  baseOpacityLight = 0.06;
  baseOpacityDark = 0.18;
  nearOpacityLight = 0.18;
  nearOpacityDark = 0.45;
  trailMaxOpacityLight = 0.25;
  trailMaxOpacityDark = 0.60;
  mouseRadius = 120;
  seedDensity = 0.25;

  constructor(canvas: HTMLCanvasElement, cellSize = 12, stepInterval = 5) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.cellSize = cellSize;
    this.stepInterval = stepInterval;
    this.isDarkTheme = document.documentElement.getAttribute("data-theme") === "dark";
    this.buildPalette();
    this.resize();
  }

  private buildPalette() {
    const isDark = this.isDarkTheme;
    // Ambient: desaturated blue
    const ambR = isDark ? 80 : 30, ambG = isDark ? 140 : 80, ambB = isDark ? 220 : 160;
    // Hot: vivid accent blue
    const hotR = isDark ? 100 : 0, hotG = isDark ? 180 : 122, hotB = 255;

    this.palette = [];
    for (let h = 0; h <= 10; h++) {
      const t = h / 10;
      const r = Math.round(ambR + (hotR - ambR) * t);
      const g = Math.round(ambG + (hotG - ambG) * t);
      const b = Math.round(ambB + (hotB - ambB) * t);
      this.palette.push(`rgb(${r},${g},${b})`);
    }

    // Trail: saturated accent blue
    this.trailColor = `rgb(${hotR},${hotG},${hotB})`;
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const newCols = Math.ceil(width / this.cellSize);
    const newRows = Math.ceil(height / this.cellSize);
    const newGrid = new Uint8Array(newCols * newRows);
    const newHeat = new Float32Array(newCols * newRows);
    const newAlpha = new Float32Array(newCols * newRows);
    const newTrail = new Float32Array(newCols * newRows);

    for (let y = 0; y < newRows; y++) {
      for (let x = 0; x < newCols; x++) {
        if (y < this.rows && x < this.cols) {
          newGrid[y * newCols + x] = this.grid[y * this.cols + x];
          newHeat[y * newCols + x] = this.heatGrid[y * this.cols + x];
          newAlpha[y * newCols + x] = this.alphaGrid[y * this.cols + x];
          newTrail[y * newCols + x] = this.trailGrid[y * this.cols + x];
        } else {
          newGrid[y * newCols + x] = Math.random() < 0.12 ? 1 : 0;
          newAlpha[y * newCols + x] = newGrid[y * newCols + x] ? 1 : 0;
        }
      }
    }

    this.cols = newCols;
    this.rows = newRows;
    this.grid = newGrid;
    this.nextGrid = new Uint8Array(newCols * newRows);
    this.heatGrid = newHeat;
    this.nextHeatGrid = new Float32Array(newCols * newRows);
    this.alphaGrid = newAlpha;
    this.trailGrid = newTrail;
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
        const survives = alive
          ? (neighbors === 2 || neighbors === 3)
          : (neighbors === 3);
        this.nextGrid[i] = survives ? 1 : 0;

        if (survives) {
          this.nextHeatGrid[i] = alive
            ? this.heatGrid[i] * 0.96
            : this.inheritHeat(x, y);
        } else {
          this.nextHeatGrid[i] = 0;
        }
      }
    }
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    [this.heatGrid, this.nextHeatGrid] = [this.nextHeatGrid, this.heatGrid];
  }

  private inheritHeat(x: number, y: number): number {
    let total = 0, count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const cx = ((x + dx) % this.cols + this.cols) % this.cols;
        const cy = ((y + dy) % this.rows + this.rows) % this.rows;
        const ni = cy * this.cols + cx;
        if (this.grid[ni]) {
          total += this.heatGrid[ni];
          count++;
        }
      }
    }
    return count > 0 ? (total / count) * 0.8 : 0;
  }

  updateAlpha() {
    for (let i = 0; i < this.alphaGrid.length; i++) {
      if (this.grid[i]) {
        this.alphaGrid[i] = Math.min(1, this.alphaGrid[i] + this.fadeIn);
      } else {
        this.alphaGrid[i] = Math.max(0, this.alphaGrid[i] - this.fadeOut);
      }
    }
  }

  updateTrail() {
    for (let i = 0; i < this.trailGrid.length; i++) {
      if (this.trailGrid[i] > 0) {
        this.trailGrid[i] = Math.max(0, this.trailGrid[i] - this.trailFade);
      }
    }
  }

  private paintTrail(x0: number, y0: number, x1: number, y1: number) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / (this.cellSize / 2)));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = x0 + (x1 - x0) * t;
      const py = y0 + (y1 - y0) * t;
      const col = Math.floor(px / this.cellSize);
      const row = Math.floor(py / this.cellSize);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const c = col + dx;
          const r = row + dy;
          if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
            this.trailGrid[r * this.cols + c] = 1.0;
          }
        }
      }
    }
  }

  render() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark !== this.isDarkTheme) {
      this.isDarkTheme = isDark;
      this.buildPalette();
    }

    const baseOpacity = isDark ? this.baseOpacityDark : this.baseOpacityLight;
    const nearOpacity = isDark ? this.nearOpacityDark : this.nearOpacityLight;
    const trailMaxOpacity = isDark ? this.trailMaxOpacityDark : this.trailMaxOpacityLight;

    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    this.ctx.clearRect(0, 0, w, h);

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const i = y * this.cols + x;
        const trail = this.trailGrid[i];
        const alpha = this.alphaGrid[i];

        // Skip cells with nothing to show
        if (trail <= 0.01 && alpha <= 0.01) continue;

        const px = x * this.cellSize;
        const py = y * this.cellSize;

        // Mouse proximity boost
        let proximity = 0;
        if (this.mouseX >= 0) {
          const dist = Math.hypot(
            px + this.cellSize / 2 - this.mouseX,
            py + this.cellSize / 2 - this.mouseY
          );
          proximity = Math.max(0, 1 - dist / this.mouseRadius);
        }

        // Render GoL cell
        if (alpha > 0.01) {
          const heat = this.heatGrid[i];
          const heatLevel = Math.min(10, Math.round(heat * 10));
          this.ctx.fillStyle = this.palette[heatLevel];
          const golOpacity = baseOpacity + proximity * (nearOpacity - baseOpacity);
          this.ctx.globalAlpha = golOpacity * alpha;
          this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
        }

        // Render trail cell on top
        if (trail > 0.01) {
          this.ctx.fillStyle = this.trailColor;
          this.ctx.globalAlpha = trailMaxOpacity * trail;
          this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
        }
      }
    }

    this.ctx.globalAlpha = 1;
  }

  onMouseMove(x: number, y: number) {
    if (this.prevTrailX >= 0) {
      this.paintTrail(this.prevTrailX, this.prevTrailY, x, y);
      this.seedAlongPath(this.prevTrailX, this.prevTrailY, x, y);
    }
    this.mouseX = x;
    this.mouseY = y;
    this.prevTrailX = x;
    this.prevTrailY = y;
  }

  private seedAlongPath(x0: number, y0: number, x1: number, y1: number) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / this.cellSize));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = x0 + (x1 - x0) * t;
      const py = y0 + (y1 - y0) * t;
      const col = Math.floor(px / this.cellSize);
      const row = Math.floor(py / this.cellSize);
      for (let sdy = -1; sdy <= 1; sdy++) {
        for (let sdx = -1; sdx <= 1; sdx++) {
          if (Math.random() > this.seedDensity) continue;
          const c = ((col + sdx) % this.cols + this.cols) % this.cols;
          const r = ((row + sdy) % this.rows + this.rows) % this.rows;
          const i = r * this.cols + c;
          this.grid[i] = 1;
          this.heatGrid[i] = 1.0;
          this.alphaGrid[i] = 1.0;
        }
      }
    }
  }

  start() {
    let lastTime = 0;
    const interval = 1000 / 30;

    const loop = (time: number) => {
      this.rafId = requestAnimationFrame(loop);
      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      this.frame++;
      if (this.frame % this.stepInterval === 0) {
        this.step();
      }
      this.updateAlpha();
      this.updateTrail();
      this.render();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }
}
