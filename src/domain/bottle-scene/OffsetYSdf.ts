import { Vector } from "../common/Vector";
import { SignedDistanceFunction } from "../common/Abstractions";

export class OffsetYSdf implements SignedDistanceFunction {
  constructor(private offset: number, private sdf: SignedDistanceFunction) {}
  distance(position: Vector): number {
    const offset = new Vector(position.x, position.y - this.offset, position.z);
    return this.sdf.distance(offset);
  }
}
