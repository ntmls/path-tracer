import { Vector } from "./Vector";

export class Ray {
  constructor(readonly origin: Vector, readonly direction: Vector) {}
  pointAlongRay(distance: number): Vector {
    return this.origin.add(this.direction.scale(distance));
  }
}
