import { SignedDistanceFunction } from "../common/Abstractions";

export class OffsetYSdf implements SignedDistanceFunction {
  constructor(private offset: number, private sdf: SignedDistanceFunction) {}
  distance(px: number, py: number, pz: number): number {
    return this.sdf.distance(px, py - this.offset, pz);
  }
}
