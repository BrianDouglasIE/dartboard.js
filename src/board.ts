import { BoardSegment } from "./board_segment";
import { Context } from "./canvas";
import { PI2 } from "./constants";
import { drawArc } from "./utils";

export class Board {
  public segmentCount = 20;
  public segments: BoardSegment[] = [];

  public bull: Bull;
  public outerBull: OuterBull;

  public get outerPad(): number {
    return this.r / 5;
  }

  public numbers: number[] = [
    10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6,
  ];

  public get cx(): number {
    return this.x - this.r;
  }

  public get cy(): number {
    return this.y - this.r;
  }

  public get circumference(): number {
    return this.r * 2;
  }

  private renderCache?: ImageData;

  constructor(
    public x: number,
    public y: number,
    public r: number,
  ) {
    this.bull = new Bull(x, y, r / 24);
    this.outerBull = new OuterBull(x, y, this.r / 10);

    const offsetAngle = 0.15;

    // segments
    for (let i = 0; i < this.segmentCount; i++) {
      const sa = offsetAngle + (i / this.segmentCount) * PI2;
      const ea = offsetAngle + ((i + 1) / this.segmentCount) * PI2;
      const boardNumber = this.numbers[i];

      const segment = new BoardSegment(
        boardNumber,
        x,
        y,
        r - this.outerPad,
        sa,
        ea,
        i % 2 === 0 ? "black" : "white",
      );
      this.segments.push(segment);
    }
  }

  public draw(ctx: Context): void {
    if (this.renderCache) {
      return ctx.putImageData(this.renderCache, this.cx, this.cy);
    }

    drawArc(ctx, this.x, this.y, this.r, 0, PI2);

    for (let i = 0; i < this.segmentCount; i++) {
      this.segments[i].draw(ctx);
    }

    this.outerBull.draw(ctx);
    this.bull.draw(ctx);

    this.renderCache = ctx.getImageData(
      this.cx,
      this.cy,
      this.circumference,
      this.circumference,
    );
  }
}

export class Bull {
  public value = 50;
  public color = "red";

  constructor(
    public x: number,
    public y: number,
    public r: number,
  ) {}

  public draw(ctx: Context): void {
    drawArc(ctx, this.x, this.y, this.r, 0, PI2, false, this.color);
  }

  public containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= this.r * this.r;
  }
}

export class OuterBull extends Bull {
  public value = 25;
  public color = "green";
}
