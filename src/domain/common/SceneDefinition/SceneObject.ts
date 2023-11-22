import { SignedDistanceFunction } from "../Abstractions";
import { Material } from "../Material";

export class SceneObject {
  constructor(
    readonly sdf: SignedDistanceFunction,
    readonly material: Material
  ) {}
}
