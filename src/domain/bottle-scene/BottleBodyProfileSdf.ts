import { SignedDistanceFunction2d } from "../common/Abstractions";

export class BottleBodyProfileSdf implements SignedDistanceFunction2d {
  private bottleRadius = 1.5;
  private neckRadius = 0.25;
  private baseRadius = 0.75;
  private bottleHeight = 4.5;

  private l1 = this.bottleRadius - this.baseRadius;
  private l3 = this.bottleRadius - this.neckRadius;
  private l2 = this.bottleHeight + -this.l1 + -this.l3;

  private h1 = 0;
  private h2 = this.h1 + this.l1;
  private h3 = this.h2 + this.l2;
  private h4 = this.h3 + this.l3;

  distance(px: number, py: number): number {
    const localX = Math.abs(px);
    if (py < this.h2) {
      if (localX < this.baseRadius) {
        return this.h1 - py;
      } else {
        const tempx = localX - this.baseRadius;
        const tempy = this.h2 - py;
        return Math.sqrt(tempx * tempx + tempy * tempy) - this.l1;
      }
    }
    if (py < this.h3) {
      if (localX > this.bottleRadius) {
        return localX - this.bottleRadius;
      } else {
        const a = localX - this.bottleRadius;
        const b = this.h1 - py;
        const c = py - this.h4;
        return this.max3(a, b, c);
      }
    }
    if (localX < this.neckRadius) {
      return py - this.h4;
    } else {
      const tempX = localX - this.neckRadius;
      const tempy = py - this.h3;
      return Math.sqrt(tempX * tempX + tempy * tempy) - this.l3;
    }
  }

  max3(a: number, b: number, c: number): number {
    const max1 = a > b ? a : b;
    const max2 = max1 > c ? max1 : c;
    return max2;
  }
}
