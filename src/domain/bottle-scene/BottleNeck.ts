import { Vector2 } from "../common/Vector2";
import { SignedDistanceFunction2d } from "../common/Abstractions";
import { Functions } from "../common/Functions";

export class BottleNeck implements SignedDistanceFunction2d {
  distance(position: Vector2): number {
    const xMax = 0.4;
    const xMin = -0.4;
    const yMax = 5;
    const yMin = 3;
    if (Functions.between(position.x, xMin, xMax)) {
      if (Functions.between(position.y, yMin, yMax)) {
        const a = position.x - xMax;
        const b = xMin - position.x;
        const c = position.y - yMax;
        const d = yMin - position.y;
        return Math.max(Math.max(a, b), Math.max(c, d));
      }
    }
    const ref = new Vector2(
      Functions.clamp(position.x, xMin, xMax),
      Functions.clamp(position.y, yMin, yMax)
    );
    return position.distanceFrom(ref);
  }
}
