import { Vector } from "../Vector";
import { SignedDistanceFunction } from "../Abstractions";


export class SphereSdf implements SignedDistanceFunction {
  constructor(readonly location: Vector, readonly radius: number) { }
  distance(position: Vector): number {
    return position.minus(this.location).magnitude - this.radius;
  }
}
