import { Vector } from "../common/Vector";
import { SignedDistanceFunction } from "../common/Abstractions";


export class OffsetZSdf implements SignedDistanceFunction {
  constructor(private offset: number, private sdf: SignedDistanceFunction) { }
  distance(position: Vector): number {
    const offset = new Vector(position.x, position.y, position.z - this.offset);
    return this.sdf.distance(offset);
  }
}
