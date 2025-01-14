import { GAME_HEIGHT, GAME_WIDTH } from "./constants";

export type Context = CanvasRenderingContext2D;
export type Canvas = HTMLCanvasElement;

function createCanvas(
  width: number,
  height: number,
  parent = document.body,
): Canvas {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  parent.appendChild(c);
  return c;
}

function getContext(canvas: Canvas): Context {
  return canvas.getContext("2d") as Context;
}

export const layers: Record<string, Context> = {
  FG: getContext(createCanvas(GAME_WIDTH, GAME_HEIGHT)),
};
