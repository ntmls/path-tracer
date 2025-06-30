import { Vector } from "../common/Vector";
import { Vector2 } from "../common/Vector2";
import { SignedDistanceFunction } from "../common/Abstractions";
import { Pill } from "./Pill";

export class BottleCapSpout implements SignedDistanceFunction {
  private pill1: Pill;
  private pill2: Pill;

  constructor() {
    const yOffset = 6.025;
    const p1 = new Vector(0, yOffset, 0);
    const p2 = new Vector(1.25, yOffset, 0);
    const p3 = new Vector(1.5, yOffset - 0.125, 0);
    this.pill1 = new Pill(p1, p2);
    this.pill2 = new Pill(p2, p3);
  }

  distance(px: number, py: number, pz: number): number {
    const dist1 = this.pill1.distanceSquared(px, py, pz);
    const dist2 = this.pill2.distanceSquared(px, py, pz);
    const dist = Math.sqrt(Math.min(dist1, dist2));
    return this.shell(dist, 0.05, 0.025);
  }

  private shell(value: number, radius1: number, radius2: number): number {
    return Math.abs(value - radius1) - radius2;
  }

  private tubeProfile(position: Vector2): number {
    // handle inside
    if (
      position.y < 0.2 &&
      position.y > 0.1 &&
      position.x < 1 &&
      position.x > -1
    ) {
      const v1 = 0.2 - position.y;
      const v2 = position.y - 0.1;
      const v3 = 1 - position.x;
      const v4 = position.x - -1;
      const m1 = Math.min(v1, v2);
      const m2 = Math.min(v3, v4);
      return -Math.min(m1, m2);
    }

    // handle outside
    let x = position.x;
    let y = position.y;

    if (x > 1) x = 1;
    if (x < -1) x = -1;
    if (y > 0.2) y = 0.2;
    if (y < 0.1) y = 0.1;

    const constrained = new Vector2(x, y);
    return position.distanceFrom(constrained);
  }
}
