import { Context } from "./canvas";
import { PI2 } from "./constants";

export function drawArc(
  ctx: Context,
  x: number,
  y: number,
  r: number,
  sa: number = 0,
  ea: number = PI2,
  counterClockwise = false,
  color: string = "black",
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, sa, ea, counterClockwise);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
