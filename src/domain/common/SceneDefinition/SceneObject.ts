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
  constructor(readonly center: Vector, readonly radius: number) {}
  inBounds(ray: Ray): boolean {
    return true; //TODO check fo rintersection with spehre
  }
}
