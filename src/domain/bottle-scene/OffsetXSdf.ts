import { Vector } from "../common/Vector";
import { SignedDistanceFunction } from "../common/Abstractions";

export class OffsetXSdf implements SignedDistanceFunction {
  constructor(private offset: number, private sdf: SignedDistanceFunction) {}
  distance(position: Vector): number {
    const offset = new Vector(position.x - this.offset, position.y, position.z);
    return this.sdf.distance(offset);
  }
}
