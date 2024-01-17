import { Vector } from "../common/Vector";
import { Vector2 } from "../common/Vector2";
import {
  SignedDistanceFunction2d,
  SignedDistanceFunction,
} from "../common/Abstractions";

export class SdfXY implements SignedDistanceFunction2d {
  constructor(private sdf3d: SignedDistanceFunction) {}
  distance(position: Vector2): number {
    return this.sdf3d.distance(new Vector(position.x, position.y, 0));
  }
}
