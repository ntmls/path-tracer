import { Ray } from "../Ray";
import { Vector } from "../Vector";
import { Bounds } from "./Bounds";

export class SphereBounds implements Bounds {
  private _radiusSquared: number;

  constructor(readonly center: Vector, readonly radius: number) {
    this._radiusSquared = radius * radius;
  }
  inBounds(ray: Ray): boolean {
    const vectToCenter = this.center.minus(ray.origin);
    // project the vector to the center onto the ray
    const time = vectToCenter.dot(ray.direction);
    const projected = ray.pointAlongRay(time);
    const distanceSquared = projected.distanceSquaredFrom(this.center);
    if (distanceSquared > this._radiusSquared) {
      return false; // sphere does not intersect the line at all
    } else {
      if (time > 0) {
        // We know that at least one of the intersections is in front of the origion.
        return true;
      } else {
        // the center of the intersection is behind the origion. We need to check if an actual intersection could be in frond of the origin.
        const halfIntersectionLengthSqr = this._radiusSquared - distanceSquared;
        const distFromOrigionToProjectedSqr =
          ray.origin.distanceSquaredFrom(projected);
        if (distFromOrigionToProjectedSqr > halfIntersectionLengthSqr) {
          return true; // an intersection could be in front of the origion.
        } else {
          return false; // he spehre is far enough behind the origion that we know the ray does not
        }
      }
    }
  }
}
