import { Ray } from "../Ray";
import { Vector } from "../Vector";
import { Bounds } from "./Bounds";


export class SphereBounds implements Bounds {
  private _radiusSquared: number;

  constructor(readonly center: Vector, readonly radius: number) {
    this._radiusSquared = radius * radius;
  }
  inBounds(ray: Ray): boolean {
    ;
    const vectToCenter = this.center.minus(ray.origin);
    // project the vector to the center onto the ray
    const time = vectToCenter.dot(ray.direction);
    const projected = ray.pointAlongRay(time);
    const distanceSquared = projected.distanceSquaredFrom(this.center);
    if (this._radiusSquared > distanceSquared) {
      return true;
    }
    return false;
  }
}
