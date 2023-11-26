import { SignedDistanceFunction } from "../Abstractions";
import { Material } from "../Material";

export class SceneObject {
  constructor(
    readonly index: number,
    readonly name: string,
    readonly sdf: SignedDistanceFunction,
    readonly material: Material
  ) {}
}
