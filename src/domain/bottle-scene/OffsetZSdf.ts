import { SignedDistanceFunction } from "../common/Abstractions";

export class OffsetZSdf implements SignedDistanceFunction {
  constructor(private offset: number, private sdf: SignedDistanceFunction) {}
  distance(px: number, py: number, pz: number): number {
    return this.sdf.distance(px, py, pz - this.offset);
  }
}
