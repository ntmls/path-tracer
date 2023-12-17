import { SignedDistanceFunction } from "../Abstractions";
import { Material } from "../Material";
import { Bounds } from "../bounds/Bounds";
import { Unbounded } from "../bounds/Unbounded";

export class SceneObject {
  constructor(
    readonly index: number,
    readonly name: string,
    readonly sdf: SignedDistanceFunction,
    readonly material: Material,
    readonly bounds: Bounds = new Unbounded()
  ) {}
}
