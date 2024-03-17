import { Vector } from "../common/Vector";
import { SignedDistanceFunction } from "../common/Abstractions";

export class TileBackgroundSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  private _sizeX;
  private _sizeY;
  private _inverseSizeX;
  private _inverseSizeY;

  constructor(private readonly z: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
    this._sizeX = 5;
    this._sizeY = 3;
    this._inverseSizeX = 1 / this._sizeX;
    this._inverseSizeY = 1 / this._sizeY;
  }

  distance(position: Vector): number {
    const result = Math.abs(position.z - this.z) - this.halfThickness;
    return (result - this.displace(position.x + 1.7, position.y - 0.95)) * 0.75;
  }
  private displace(x: number, y: number): number {
    const indexX = Math.round(x * this._inverseSizeX);
    const indexY = Math.round(y * this._inverseSizeY);

    let offsetX = 0;
    if (indexY % 2 === 0) {
      offsetX = this._sizeX * 0.5;
    }

    const resultX = this.sawTooth(this._sizeX, this._inverseSizeX, x + offsetX);
    const resultY = this.sawTooth(this._sizeY, this._inverseSizeY, y);
    const result = Math.min(resultX, resultY);
    const transfer = this.transfer(result);
    const ramp = this.curvedRamp(transfer);
    return ramp * 0.125; // / 8;
  }

  private sawTooth(size: number, inverseSize: number, x: number): number {
    const slope = x * inverseSize;
    const index = Math.round(slope);
    // const frac = -Math.abs(size * (slope - index)) + 0.5 * size;
    const frac = size * (0.5 - Math.abs(slope - index));
    return frac;
  }

  private transfer(x: number): number {
    const slope = 4;
    const intercept = -0.1;
    const max = 1;
    const min = 0;
    const y = slope * x + intercept;
    return Math.max(min, Math.min(max, y));
  }

  /**
   *
   * @param x A value between 0 and infinity
   * @returns A value between 0 and 1
   */
  private curvedRamp(x: number): number {
    const xMinus1 = x - 1;
    const x2 = xMinus1 * xMinus1;
    return -x2 * x2 + 1;
  }
}
