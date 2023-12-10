import { Vector } from "./Vector";

export class Ray {
  constructor(readonly origin: Vector, readonly direction: Vector) {}
  shift(distance: number): Ray {
    return new Ray(
      this.origin.add(this.direction.scale(distance)),
      this.direction
    );
  }
  pointAlongRay(distance: number): Vector {
    return this.origin.add(this.direction.scale(distance));
  }
}
