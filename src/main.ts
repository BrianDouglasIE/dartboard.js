import { Board } from "./board";
import { layers } from "./canvas";

const board = new Board(
  0.5 * layers.FG.canvas.width,
  0.3 * layers.FG.canvas.height,
  0.3 * layers.FG.canvas.width,
);

function render(frameCount: number = 0): number {
  const frame = requestAnimationFrame(render);

  layers.FG.clearRect(0, 0, layers.FG.canvas.width, layers.FG.canvas.height);
  board.draw(layers.FG);

  return frame;
}

window.addEventListener("load", () => {
  render();

  layers.FG.canvas.addEventListener("click", (e: MouseEvent) => {
    const x = e.x;
    const y = e.y;

    if (board.bull.containsPoint(x, y)) {
      console.log(board.bull.value);
    } else if (board.outerBull.containsPoint(x, y)) {
      console.log(board.outerBull.value);
    } else {
      for (const segment of board.segments) {
        if (segment.containsPoint(x, y)) {
          console.log(segment.valueAt(x, y));
        }
      }
    }
  });
});
