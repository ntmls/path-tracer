import { SignedDistanceFunction } from "../Abstractions";
import { Material } from "../Material";
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

}

export class Unbounded {

}

export class SphereBounds {
  constructor(
    readonly center: Vector, 
    readonly radius: number
  ) {}

}
