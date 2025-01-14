import { Context } from "./canvas";
import { PI2 } from "./constants";

export class BoardSegment {
  private doubleModifier: DoubleModifier;
  private tripleModifier: TripleModifier;

  constructor(
    public n: number,
    public x: number,
    public y: number,
    public r: number,
    public sa: number,
    public ea: number,
    public color: string,
  ) {
    const modifierColor = color === "black" ? "red" : "green";
    this.doubleModifier = new DoubleModifier(x, y, r, sa, ea, modifierColor);
    this.tripleModifier = new TripleModifier(x, y, r, sa, ea, modifierColor);
  }

  public draw(ctx: Context): void {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r, this.sa, this.ea);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();

    this.drawNumber(ctx);
    this.doubleModifier.draw(ctx);
    this.tripleModifier.draw(ctx);
  }

  public drawNumber(ctx: Context): void {
    const angleMid = (this.sa + this.ea) / 2;
    const textRadius = this.r * 1.1;
    const textX = this.x + textRadius * Math.cos(angleMid);
    const textY = this.y + textRadius * Math.sin(angleMid);

    ctx.font = `${this.r * 0.1}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(this.n.toString(), textX, textY);
  }

  public containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared > this.r * this.r) {
      return false;
    }

    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
      angle += PI2;
    }

    if (angle < this.sa || angle > this.ea) {
      return false;
    }

    return true;
  }

  public valueAt(x: number, y: number): number {
    if (this.doubleModifier.containsPoint(x, y, this.x, this.y)) {
      return this.doubleModifier.applyModifier(this.n);
    }

    if (this.tripleModifier.containsPoint(x, y, this.x, this.y)) {
      return this.tripleModifier.applyModifier(this.n);
    }

    return this.n;
  }
}

export class DoubleModifier {
  protected modifierValue = 2;
  protected outerRModifier = 1;
  protected innerRModifier = 0.95;

  public get outerR(): number {
    return this.r * this.outerRModifier;
  }

  public get innerR(): number {
    return this.r * this.innerRModifier;
  }

  constructor(
    public x: number,
    public y: number,
    public r: number,
    public sa: number,
    public ea: number,
    public color: string,
  ) {}

  public draw(ctx: Context): void {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.outerR, this.sa, this.ea);
    ctx.arc(this.x, this.y, this.innerR, this.ea, this.sa, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  public containsPoint(x: number, y: number, cx: number, cy: number): boolean {
    const dx = x - cx;
    const dy = y - cy;
    const distanceSquared = dx * dx + dy * dy;

    if (
      distanceSquared < this.innerR * this.innerR ||
      distanceSquared > this.outerR * this.outerR
    ) {
      return false;
    }

    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
      angle += PI2;
    }

    return angle >= this.sa && angle <= this.ea;
  }

  public applyModifier(n: number): number {
    return n * this.modifierValue;
  }
}

export class TripleModifier extends DoubleModifier {
  protected modifierValue = 3;
  protected outerRModifier = 0.65;
  protected innerRModifier = 0.6;
}
