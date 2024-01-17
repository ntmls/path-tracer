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

  distance(position: Vector): number {
    const delta = position.abs().minus(this.corner);
    return (
      delta.clampNegatives().magnitude +
      delta.clampPositives().maxComponent() -
      this.radius
    );
  }
}
