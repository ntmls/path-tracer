import { Vector } from "../common/Vector";
import { SignedDistanceFunction } from "../common/Abstractions";

export class TileBackgroundSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  private _sizeX = 5;
  private _sizeY = 3;

  constructor(private readonly z: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(position: Vector): number {
    const result = Math.abs(position.z - this.z) - this.halfThickness;
    return (result - this.displace(position.x + 1.7, position.y - 0.95)) * 0.75;
  }
  private displace(x: number, y: number): number {
    const indexX = Math.round(x / this._sizeX);
    const indexY = Math.round(y / this._sizeY);

    let offsetX = 0;
    if (indexY % 2 === 0) {
      offsetX = this._sizeX / 2;
    }

    const resultX = this.sawTooth(this._sizeX, x + offsetX);
    const resultY = this.sawTooth(this._sizeY, y);
    const result = Math.min(resultX, resultY);
    const transfer = this.transfer(result);
    const ramp = this.curvedRamp(transfer);
    return ramp / 8;
  }

  private sawTooth(size: number, x: number): number {
    const slope = x / size;
    const index = Math.round(slope);
    const frac = -Math.abs(size * (slope - index)) + 0.5 * size;
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
    return -(x2 * x2) + 1;
  }
}
