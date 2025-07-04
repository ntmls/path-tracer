import { SignedDistanceFunction } from "../Abstractions";

export class FastBoxSdf implements SignedDistanceFunction {
  constructor(
    private halfWidth: number,
    private halfHeight: number,
    private halfDepth: number
  ) {}

  /**
   * Returns the distance to the surface of the box.
   * The box is centered at the origin and has dimensions
   * 2 * halfWidth, 2 * halfHeight, and 2 * halfDepth.
   */
  distance(px: number, py: number, pz: number): number {
    const tempX = Math.abs(px) - this.halfWidth;
    const tempY = Math.abs(py) - this.halfHeight;
    const tempZ = Math.abs(pz) - this.halfDepth;
    return Math.max(tempX, tempY, tempZ);
  }

  /**
   * Grows the box in all directions by the specified amount.
   */
  growBy(amount: number): SignedDistanceFunction {
    return new FastBoxSdf(
      (this.halfDepth += amount),
      (this.halfHeight += amount),
      (this.halfWidth += amount)
    );
  }
}
