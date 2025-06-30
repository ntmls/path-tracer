import {
  SignedDistanceFunction2d,
  SignedDistanceFunction,
} from "../common/Abstractions";

export class SdfXY implements SignedDistanceFunction2d {
  constructor(private sdf3d: SignedDistanceFunction) {}
  distance(px: number, py: number): number {
    return this.sdf3d.distance(px, py, 0);
  }
}
