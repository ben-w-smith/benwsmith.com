import { GameOfLife } from "./gol-engine";

let game: GameOfLife | null = null;
let resizeTimeout: ReturnType<typeof setTimeout>;

const onMouseMove = (e: MouseEvent) => game?.onMouseMove(e.clientX, e.clientY);
const onMouseLeave = () => {
  if (game) {
    game.mouseX = -1000;
    game.mouseY = -1000;
    game.prevTrailX = -1000;
    game.prevTrailY = -1000;
  }
};
const onResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => game?.resize(), 200);
};

function cleanup() {
  clearTimeout(resizeTimeout);
  if (game) {
    game.stop();
    game = null;
  }
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseleave", onMouseLeave);
  window.removeEventListener("resize", onResize);
  document.removeEventListener("astro:before-swap", cleanup);
}

function initAmbientCanvas() {
  if (game) return;

  const canvas = document.querySelector<HTMLCanvasElement>(".ambient-canvas");
  if (!canvas) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  game = new GameOfLife(canvas);

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseleave", onMouseLeave);
  window.addEventListener("resize", onResize);

  requestAnimationFrame(() => canvas.classList.add("is-active"));

  game.start();
}

document.addEventListener("astro:page-load", initAmbientCanvas);
