import { Vector } from "../common/Vector";
import { SignedDistanceFunction } from "../common/Abstractions";

export class RoundedBox implements SignedDistanceFunction {
  private corner: Vector;

  constructor(
    private width: number,
    private height: number,
    private depth: number,
    private radius: number
  ) {
    this.corner = new Vector(
      (width - 2 * this.radius) / 2,
      (height - 2 * this.radius) / 2,
      (depth - 2 * this.radius) / 2
    );
  }

  distance(px: number, py: number, pz: number): number {
    const deltaX = Math.abs(px) - this.corner.x;
    const deltaY = Math.abs(py) - this.corner.y;
    const deltaZ = Math.abs(pz) - this.corner.z;

    const clampedX = Math.max(deltaX, 0);
    const clampedY = Math.max(deltaY, 0);
    const clampedZ = Math.max(deltaZ, 0);

    const innerDistance = Math.min(Math.max(deltaX, deltaY, deltaZ), 0);
    if (innerDistance < 0) return innerDistance - this.radius;

    return (
      Math.sqrt(
        clampedX * clampedX + clampedY * clampedY + clampedZ * clampedZ
      ) - this.radius
    );
  }
}
