import { SignedDistanceFunction } from "../Abstractions";
import { Material } from "../Material";
import { Ray } from "../Ray";
import { Vector } from "../Vector";

export class SceneObject {
  constructor(
    readonly index: number,
    readonly name: string,
    readonly sdf: SignedDistanceFunction,
    readonly material: Material,
    readonly bounds: Bounds = new Unbounded()
  ) {}
}

export interface Bounds {
  inBounds(ray: Ray): boolean;
}

export class Unbounded implements Bounds {
  inBounds(ray: Ray): boolean {
    return true;
  }
}

export class SphereBounds implements Bounds {
  private _radiusSquared: number;

  constructor(readonly center: Vector, readonly radius: number) {
    this._radiusSquared = radius * radius;
  }
  inBounds(ray: Ray): boolean {;
    const vectToCenter = this.center.minus(ray.origin);
    // project the vector to the center onto the ray
    const time = vectToCenter.dot(ray.direction);
    const projected = ray.pointAlongRay(time);
    const distanceSquared = projected.distanceSquaredFrom(this.center);
    if (this._radiusSquared > distanceSquared ) {
      return true;
    }
    return false;
  }
}
