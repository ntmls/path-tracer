import { SignedDistanceFunction2d } from "../common/Abstractions";
import { Functions } from "../common/Functions";

export class BottleNeck implements SignedDistanceFunction2d {
  distance(px: number, py: number): number {
    const xMax = 0.4;
    const xMin = -0.4;
    const yMax = 5;
    const yMin = 3;
    if (Functions.between(px, xMin, xMax)) {
      if (Functions.between(py, yMin, yMax)) {
        const a = px - xMax;
        const b = xMin - px;
        const c = py - yMax;
        const d = yMin - py;
        return Math.max(a, b, c, d)
      }
    }

    const refX = Functions.clamp(px, xMin, xMax);
    const refY = Functions.clamp(py, yMin, yMax);
    return Functions.distance2(refX, refY, px, py);
  }
}
